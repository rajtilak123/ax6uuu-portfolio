import http from 'http'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const TEMP_PROFILE = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-contact-profile-' + Date.now())
const PORT = 9226
const APP_URL = 'http://localhost:5173'

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

async function run() {
  console.log('--- AX6UUU CONTACT SECTION AUDIT & VERIFICATION ---')
  fs.mkdirSync(TEMP_PROFILE, { recursive: true })

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${TEMP_PROFILE}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    'about:blank',
  ], { detached: false })

  let wsUrl = null
  for (let i = 0; i < 20; i++) {
    await sleep(500)
    try {
      const list = await fetchJson(`http://localhost:${PORT}/json/list`)
      if (list && list.length > 0 && list[0].webSocketDebuggerUrl) {
        wsUrl = list[0].webSocketDebuggerUrl
        break
      }
    } catch {
      // Retry
    }
  }

  if (!wsUrl) {
    console.error('Could not obtain Chrome WebSocket URL!')
    chromeProc.kill()
    process.exit(1)
  }

  const ws = new WebSocket(wsUrl)
  let idCounter = 0
  const pending = new Map()

  function send(method, params = {}) {
    const id = ++idCounter
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject })
      ws.send(JSON.stringify({ id, method, params }))
    })
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id)
      pending.delete(data.id)
      if (data.error) reject(data.error)
      else resolve(data.result)
    }
  }

  await new Promise((resolve) => { ws.onopen = resolve })

  async function evaluate(fnString) {
    const res = await send('Runtime.evaluate', {
      expression: `(${fnString})()`,
      returnByValue: true,
      awaitPromise: true,
    })
    if (res.exceptionDetails) {
      console.error('Eval error:', JSON.stringify(res.exceptionDetails))
    }
    return res.result ? res.result.value : null
  }

  try {
    await send('Page.enable')
    await send('Runtime.enable')
    await send('DOM.enable')

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    })

    console.log('[1] Navigating to ' + APP_URL + '...')
    await send('Page.navigate', { url: APP_URL })
    await sleep(2500)

    // Scroll to #contact
    console.log('[2] Scrolling to #contact section...')
    await evaluate(`
      function() {
        const contact = document.getElementById('contact');
        if (contact) contact.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    `)
    await sleep(1000)

    // 1. Audit Desktop 1440x900
    console.log('\n--- AUDIT 1: Desktop 1440px Layout & Content ---')
    const desktopAudit = await evaluate(`
      function() {
        const section = document.getElementById('contact');
        if (!section) return null;

        const heading = section.querySelector('h2');
        const paragraph = section.querySelector('p');
        const tag = section.querySelector('span[class*="tracking-widest"]');
        const availability = section.querySelector('div[class*="text-[#5E606E]"]');

        const linkEls = Array.from(section.querySelectorAll('a[aria-label]'));
        const links = linkEls.map(a => ({
          href: a.getAttribute('href'),
          target: a.getAttribute('target'),
          label: a.getAttribute('aria-label'),
          text: a.innerText.replace(/\s+/g, ' ').trim()
        }));

        const footer = section.querySelector('footer');
        const footerText = footer ? footer.innerText.replace(/\s+/g, ' ').trim() : null;

        const leftCol = heading ? heading.parentElement : null;
        const rightCol = linkEls[0] ? linkEls[0].parentElement : null;

        const leftW = leftCol ? Math.round(leftCol.getBoundingClientRect().width) : 0;
        const rightW = rightCol ? Math.round(rightCol.getBoundingClientRect().width) : 0;
        const totalW = leftW + rightW;

        return {
          sectionFound: true,
          tagText: tag ? tag.innerText.trim() : null,
          headingText: heading ? heading.innerText.trim() : null,
          paragraphText: paragraph ? paragraph.innerText.trim() : null,
          availabilityText: availability ? availability.innerText.trim() : null,
          links,
          leftColWidth: leftW,
          rightColWidth: rightW,
          leftRatio: totalW ? Math.round((leftW / totalW) * 100) + '%' : null,
          rightRatio: totalW ? Math.round((rightW / totalW) * 100) + '%' : null,
          footerText,
          hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
        };
      }
    `)
    console.log(JSON.stringify(desktopAudit, null, 2))

    // Capture desktop screenshot
    const shotDesktop = await send('Page.captureScreenshot', { format: 'png' })
    const shotDesktopPath = path.join(process.cwd(), 'ax6uuu-portfolio', 'contact-desktop-verified.png')
    fs.writeFileSync(shotDesktopPath, Buffer.from(shotDesktop.data, 'base64'))
    console.log('Saved desktop screenshot to ' + shotDesktopPath)

    // 2. Audit Mobile 375x812
    console.log('\n--- AUDIT 2: Mobile 375px Responsive Verification ---')
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true,
    })
    await sleep(800)
    await evaluate(`
      function() {
        const contact = document.getElementById('contact');
        if (contact) contact.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    `)
    await sleep(800)

    const mobileAudit375 = await evaluate(`
      function() {
        const section = document.getElementById('contact');
        return {
          windowWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
          sectionWidth: section ? Math.round(section.getBoundingClientRect().width) : null
        };
      }
    `)
    console.log('Mobile 375px:', JSON.stringify(mobileAudit375, null, 2))

    // Capture mobile 375 screenshot
    const shotMobile375 = await send('Page.captureScreenshot', { format: 'png' })
    const shotMobile375Path = path.join(process.cwd(), 'ax6uuu-portfolio', 'contact-mobile-375-verified.png')
    fs.writeFileSync(shotMobile375Path, Buffer.from(shotMobile375.data, 'base64'))
    console.log('Saved mobile 375 screenshot to ' + shotMobile375Path)

    // 3. Audit Mobile 390x844
    console.log('\n--- AUDIT 3: Mobile 390px Responsive Verification ---')
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    })
    await sleep(800)

    const mobileAudit390 = await evaluate(`
      function() {
        return {
          windowWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
        };
      }
    `)
    console.log('Mobile 390px:', JSON.stringify(mobileAudit390, null, 2))

    console.log('\n=============================================')
    console.log('CONTACT SECTION AUDIT & VERIFICATION COMPLETE!')
    console.log('=============================================\n')
  } catch (err) {
    console.error('Error during contact audit:', err)
  } finally {
    ws.close()
    chromeProc.kill()
    try {
      fs.rmSync(TEMP_PROFILE, { recursive: true, force: true })
    } catch {
      // Safe
    }
  }
}

run()
