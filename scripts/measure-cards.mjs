import http from 'http'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const TEMP_PROFILE = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-measure-profile-' + Date.now())
const PORT = 9224
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

    await send('Page.navigate', { url: APP_URL })
    await sleep(2500)

    await evaluate(`
      function() {
        return new Promise(resolve => {
          const check = () => {
            const el = document.querySelector('[data-project-id="project-01"]');
            if (el) {
              el.scrollIntoView({ behavior: 'instant', block: 'center' });
              resolve(true);
            } else {
              setTimeout(check, 100);
            }
          };
          check();
        });
      }
    `)
    await sleep(1000)

    const measurements = await evaluate(`
      function() {
        const c1 = document.querySelector('[data-project-id="project-01"]');
        const c2 = document.querySelector('[data-project-id="project-02"]');
        const c3 = document.querySelector('[data-project-id="project-03"]');

        const r1 = c1 ? c1.getBoundingClientRect() : null;
        const r2 = c2 ? c2.getBoundingClientRect() : null;
        const r3 = c3 ? c3.getBoundingClientRect() : null;

        const videoBox1 = c1 ? c1.querySelector('div[class*="aspect-"]')?.getBoundingClientRect() : null;
        const label1 = c1 ? c1.querySelector('span[class*="tracking-widest"]') : null;
        const badge1 = c1 ? c1.querySelector('.bg-electric') : null;

        const gridEl = c1 ? c1.parentElement.parentElement : null;
        const gridRect = gridEl ? gridEl.getBoundingClientRect() : null;

        const spacing = (r1 && r2) ? Math.round(r2.left - r1.right) : null;

        const chain = [];
        let cur = c1;
        while (cur && cur !== document.body) {
          const cs = window.getComputedStyle(cur);
          chain.push({
            tag: cur.tagName,
            id: cur.id || null,
            className: cur.className ? cur.className.slice(0, 50) : null,
            width: Math.round(cur.getBoundingClientRect().width),
            maxWidth: cs.maxWidth,
            padding: cs.paddingLeft + ' ' + cs.paddingRight,
          });
          cur = cur.parentElement;
        }

        return {
          windowInnerWidth: window.innerWidth,
          gridTemplateColumns: gridEl ? window.getComputedStyle(gridEl).gridTemplateColumns : null,
          gridWidth: gridRect ? Math.round(gridRect.width) : null,
          gridComputedWidth: gridEl ? window.getComputedStyle(gridEl).width : null,
          gridClass: gridEl ? gridEl.className : null,
          parentOfGrid: gridEl ? {
            tag: gridEl.parentElement.tagName,
            class: gridEl.parentElement.className,
            display: window.getComputedStyle(gridEl.parentElement).display,
            alignItems: window.getComputedStyle(gridEl.parentElement).alignItems,
            width: gridEl.parentElement.getBoundingClientRect().width,
          } : null,
          card1: {
            width: r1 ? Math.round(r1.width) : null,
            height: r1 ? Math.round(r1.height) : null,
            videoWidth: videoBox1 ? Math.round(videoBox1.width) : null,
            videoHeight: videoBox1 ? Math.round(videoBox1.height) : null,
            ratio: videoBox1 ? (videoBox1.width / videoBox1.height).toFixed(4) : null,
          },
          card2: {
            width: r2 ? Math.round(r2.width) : null,
            height: r2 ? Math.round(r2.height) : null,
          },
          card3: {
            width: r3 ? Math.round(r3.width) : null,
            height: r3 ? Math.round(r3.height) : null,
          },
          spacingBetweenCards: spacing,
          labelWrapCheck: label1 ? label1.offsetHeight : null,
          labelOverlapsBadge: (label1 && badge1) ? (label1.getBoundingClientRect().right > badge1.getBoundingClientRect().left) : false
        };
      }
    `)

    console.log('=== EXACT MEASUREMENTS AT DESKTOP (1440x900) ===')
    console.log(JSON.stringify(measurements, null, 2))

    // Capture screenshot
    const screenshot = await send('Page.captureScreenshot', { format: 'png' })
    const screenshotPath = path.join(process.cwd(), 'ax6uuu-portfolio', 'corrected-sizing-verified.png')
    fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'))
    console.log(`Saved screenshot to ${screenshotPath}`)

  } catch (err) {
    console.error('Error during measurements:', err)
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
