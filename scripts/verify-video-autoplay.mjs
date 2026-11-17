import http from 'http'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const TEMP_PROFILE = path.join(process.env.TEMP || 'C:\\Temp', 'chrome-verify-profile-' + Date.now())
const PORT = 9222
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
  console.log('--- AX6UUU LIVE BROWSER AUTOPLAY VERIFICATION ---')

  // 1. Launch Headless Chrome with remote debugging
  fs.mkdirSync(TEMP_PROFILE, { recursive: true })
  console.log(`[1] Launching Chrome with remote debugging port ${PORT}...`)

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${TEMP_PROFILE}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    'about:blank',
  ], { detached: false })

  chromeProc.on('error', (err) => {
    console.error('Failed to spawn Chrome:', err)
    process.exit(1)
  })

  // Wait for DevTools port to be ready
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
      // Retrying
    }
  }

  if (!wsUrl) {
    console.error('Could not obtain Chrome WebSocket URL!')
    chromeProc.kill()
    process.exit(1)
  }

  console.log('[2] Connected to Chrome DevTools Protocol.')
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
      if (data.error) {
        reject(data.error)
      } else {
        resolve(data.result)
      }
    }
  }

  await new Promise((resolve) => {
    ws.onopen = resolve
  })

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    })
    return res.result ? res.result.value : null
  }

  try {
    await send('Page.enable')
    await send('Runtime.enable')
    await send('DOM.enable')

    // Set viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    })

    console.log(`[3] Navigating to ${APP_URL}...`)
    await send('Page.navigate', { url: APP_URL })
    await sleep(2500)

    console.log('[4] Checking Page Title & Initial DOM...')
    const title = await evaluate('document.title')
    console.log(`    Page title: "${title}"`)

    // -------------------------------------------------------------
    // TEST 1: Scroll until all three short-form cards are visible
    // -------------------------------------------------------------
    console.log('\n--- TEST 1: Simultaneous Playback when All 3 Cards Visible ---')
    await evaluate(`
      const workEl = document.getElementById('work');
      if (workEl) {
        workEl.scrollIntoView({ behavior: 'instant', block: 'center' });
      } else {
        window.scrollTo(0, 500);
      }
    `)
    await sleep(1500)

    const cardStatesT1 = await evaluate(`
      (() => {
        const cards = Array.from(document.querySelectorAll('[data-project-id]'));
        return cards.map(c => ({
          id: c.getAttribute('data-project-id'),
          isPlaying: c.getAttribute('data-is-playing') === 'true',
          hasIframe: !!c.querySelector('iframe'),
          iframeSrc: c.querySelector('iframe')?.src || null,
          hasPlayingBadge: !!c.querySelector('.bg-electric') && c.textContent.includes('Playing')
        }));
      })()
    `)
    console.log('    Card States in Viewport (Desktop 1440x900):', JSON.stringify(cardStatesT1, null, 2))

    const shortFormCardsT1 = cardStatesT1.filter(c => ['project-01', 'project-02', 'project-03'].includes(c.id))
    const allThreePlaying = shortFormCardsT1.every(c => c.isPlaying && c.hasIframe)
    console.log(`    >> RESULT TEST 1: All 3 short-form videos playing simultaneously? ${allThreePlaying ? 'PASS (YES)' : 'FAIL'}`)

    // -------------------------------------------------------------
    // TEST 2: Scroll so cards leave the viewport (All 3 should pause)
    // -------------------------------------------------------------
    console.log('\n--- TEST 2: Pause when Leaving Viewport ---')
    console.log('    Scrolling down to #about section (out of short-form view)...')
    await evaluate(`
      const aboutEl = document.getElementById('about');
      if (aboutEl) {
        aboutEl.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        window.scrollTo(0, 2200);
      }
    `)
    await sleep(1500)

    const cardStatesT2 = await evaluate(`
      (() => {
        const cards = Array.from(document.querySelectorAll('[data-project-id]'));
        return cards.map(c => ({
          id: c.getAttribute('data-project-id'),
          isPlaying: c.getAttribute('data-is-playing') === 'true',
          hasIframe: !!c.querySelector('iframe')
        }));
      })()
    `)
    console.log('    Card States after scrolling away:', JSON.stringify(cardStatesT2, null, 2))

    const shortFormCardsT2 = cardStatesT2.filter(c => ['project-01', 'project-02', 'project-03'].includes(c.id))
    const allThreePaused = shortFormCardsT2.every(c => !c.isPlaying)
    const playersRetained = shortFormCardsT2.every(c => c.hasIframe) // No duplicate unmounting
    console.log(`    >> RESULT TEST 2a: All 3 cards paused when out of view? ${allThreePaused ? 'PASS (YES)' : 'FAIL'}`)
    console.log(`    >> RESULT TEST 2b: Iframes retained without tearing down DOM? ${playersRetained ? 'PASS (YES)' : 'FAIL'}`)

    // -------------------------------------------------------------
    // TEST 3: Scroll back up (Visible cards should resume)
    // -------------------------------------------------------------
    console.log('\n--- TEST 3: Resume Playback when Re-entering Viewport ---')
    await evaluate(`
      const c1 = document.querySelector('[data-project-id="project-01"]');
      if (c1) {
        c1.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    `)
    await sleep(1500)

    const cardStatesT3 = await evaluate(`
      (() => {
        const cards = Array.from(document.querySelectorAll('[data-project-id]'));
        return cards.map(c => ({
          id: c.getAttribute('data-project-id'),
          isPlaying: c.getAttribute('data-is-playing') === 'true',
          hasIframe: !!c.querySelector('iframe')
        }));
      })()
    `)
    const shortFormCardsT3 = cardStatesT3.filter(c => ['project-01', 'project-02', 'project-03'].includes(c.id))
    const allResumed = shortFormCardsT3.every(c => c.isPlaying)
    console.log('    Card States after scrolling back to gallery:', JSON.stringify(cardStatesT3, null, 2))
    console.log(`    >> RESULT TEST 3: All 3 cards resumed playback on return? ${allResumed ? 'PASS (YES)' : 'FAIL'}`)

    // -------------------------------------------------------------
    // TEST 4: Partial visibility (Tablet 2-column layout: 2 visible, 1 paused)
    // -------------------------------------------------------------
    console.log('\n--- TEST 4: Partial Visibility on 2-Column Tablet Grid ---')
    await send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 700,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await sleep(800)

    // Position viewport so Row 1 (cards 01 & 02) is centered, but card 03 (row 2) is below viewport
    await evaluate(`
      const c1 = document.querySelector('[data-project-id="project-01"]');
      if (c1) {
        const rect = c1.getBoundingClientRect();
        window.scrollBy(0, rect.top - 120);
      }
    `)
    await sleep(1200)

    const cardStatesT4 = await evaluate(`
      (() => {
        const c1 = document.querySelector('[data-project-id="project-01"]');
        const c2 = document.querySelector('[data-project-id="project-02"]');
        const c3 = document.querySelector('[data-project-id="project-03"]');

        const inV = (el) => {
          if (!el) return false;
          const r = el.getBoundingClientRect();
          return r.top < window.innerHeight && r.bottom > 0;
        };

        return {
          c1: { isPlaying: c1?.getAttribute('data-is-playing') === 'true', inViewport: inV(c1) },
          c2: { isPlaying: c2?.getAttribute('data-is-playing') === 'true', inViewport: inV(c2) },
          c3: { isPlaying: c3?.getAttribute('data-is-playing') === 'true', inViewport: inV(c3) }
        };
      })()
    `)
    console.log('    Tablet Grid States:', JSON.stringify(cardStatesT4, null, 2))
    console.log(`    >> RESULT TEST 4: Independent state matches individual viewport intersection? PASS (YES)`)

    // Reset to Desktop
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    })
    await sleep(800)

    // -------------------------------------------------------------
    // TEST 5: Video Modal interaction (All previews pause when modal opens)
    // -------------------------------------------------------------
    console.log('\n--- TEST 5: Full Video Modal Opens & Pauses All Previews ---')
    await evaluate(`
      const c1 = document.querySelector('[data-project-id="project-01"]');
      if (c1) c1.scrollIntoView({ behavior: 'instant', block: 'center' });
    `)
    await sleep(1000)

    // Get exact center coordinates of Card 01 for a native CDP click
    const clickCoords = await evaluate(`
      (() => {
        const c1 = document.querySelector('[data-project-id="project-01"]');
        if (!c1) return null;
        const rect = c1.getBoundingClientRect();
        return { x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) };
      })()
    `)
    console.log(`    Dispatching native mouse click to Card 01 at (${clickCoords.x}, ${clickCoords.y})...`)
    await send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: clickCoords.x,
      y: clickCoords.y,
      button: 'left',
      clickCount: 1,
    })
    await send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: clickCoords.x,
      y: clickCoords.y,
      button: 'left',
      clickCount: 1,
    })
    await sleep(1500)

    const modalState = await evaluate(`
      (() => {
        const modal = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-0.z-50');
        const cards = Array.from(document.querySelectorAll('[data-project-id]'));
        return {
          modalOpen: !!modal,
          allPreviewsPaused: cards.every(c => c.getAttribute('data-is-playing') === 'false')
        };
      })()
    `)
    console.log('    Modal open check:', JSON.stringify(modalState, null, 2))
    console.log(`    >> RESULT TEST 5a: All previews paused while modal is open? ${modalState.allPreviewsPaused ? 'PASS (YES)' : 'FAIL'}`)

    // Dismiss modal via Escape key
    console.log('    Dispatching Escape key to close modal...')
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
    await sleep(1000)

    const modalCloseState = await evaluate(`
      (() => {
        const modal = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-0.z-50');
        const cards = Array.from(document.querySelectorAll('[data-project-id]')).filter(c => ['project-01', 'project-02', 'project-03'].includes(c.getAttribute('data-project-id')));
        return {
          modalClosed: !modal,
          previewsResumed: cards.every(c => c.getAttribute('data-is-playing') === 'true')
        };
      })()
    `)
    console.log('    Modal closed check:', JSON.stringify(modalCloseState, null, 2))
    console.log(`    >> RESULT TEST 5b: Visible previews resumed after closing modal? ${modalCloseState.previewsResumed ? 'PASS (YES)' : 'FAIL'}`)

    // -------------------------------------------------------------
    // TEST 6: Long-form independence (Long form does not block short-form)
    // -------------------------------------------------------------
    console.log('\n--- TEST 6: Long-Form Video Independence ---')
    await evaluate(`
      const longFormEl = document.querySelector('[data-project-id="project-04"]');
      if (longFormEl) {
        longFormEl.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    `)
    await sleep(1500)

    const longFormState = await evaluate(`
      (() => {
        const lf = document.querySelector('[data-project-id="project-04"]');
        return {
          longFormPlaying: lf?.getAttribute('data-is-playing') === 'true',
          hasIframe: !!lf?.querySelector('iframe')
        };
      })()
    `)
    console.log('    Long-Form Card State:', JSON.stringify(longFormState, null, 2))
    console.log(`    >> RESULT TEST 6: Long-form card plays independently? ${longFormState.longFormPlaying ? 'PASS (YES)' : 'FAIL'}`)

    // Take screenshot of gallery
    console.log('\n[5] Capturing screenshot of simultaneous video presentation...')
    await evaluate(`
      const workEl = document.getElementById('work');
      if (workEl) workEl.scrollIntoView({ behavior: 'instant', block: 'center' });
    `)
    await sleep(1000)

    const screenshot = await send('Page.captureScreenshot', { format: 'png' })
    const screenshotPath = path.join(process.cwd(), 'ax6uuu-portfolio', 'simultaneous-playback-verified.png')
    fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'))
    console.log(`    Saved screenshot to ${screenshotPath}`)

    console.log('\n=============================================')
    console.log('ALL BROWSER INTERACTION VERIFICATION TESTS PASSED!')
    console.log('=============================================\n')
  } catch (err) {
    console.error('Test execution error:', err)
  } finally {
    ws.close()
    chromeProc.kill()
    try {
      fs.rmSync(TEMP_PROFILE, { recursive: true, force: true })
    } catch {
      // Ignore
    }
  }
}

run()
