import WebSocket from 'ws';
import http from 'http';
import fs from 'fs';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:\\Users\\Tilak\\.gemini\\antigravity\\brain\\69b9d6b8-5377-4eed-9c19-7d05249c38ea';

async function capture() {
  console.log('--- CAPTURING CORRECTIONS SCREENSHOTS ---');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9242',
    '--user-data-dir=C:\\Temp\\chrome-cap-' + Date.now(),
    'http://localhost:5173'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  const tabs = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9242/json', res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });
  const targetTab = tabs.find(t => t.type === 'page' && t.url.includes('5173')) || tabs[0];
  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
  await new Promise(r => ws.on('open', r));
  let id = 1;
  const send = (method, params = {}) => new Promise(res => {
    const curId = id++;
    const handler = (msg) => {
      const data = JSON.parse(msg);
      if (data.id === curId) { ws.off('message', handler); res(data.result); }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });
  await send('Page.enable');
  await send('Runtime.enable');

  const evalExp = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true });
    return res.result ? res.result.value : res.value;
  };

  const takeScreenshot = async (filename) => {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const fullPath = `${ARTIFACT_DIR}\\${filename}`;
    fs.writeFileSync(fullPath, buffer);
    console.log(`Saved screenshot: ${fullPath}`);
  };

  // 1. Initial Desktop Screen showing ONLY the Hero (1440x900)
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await evalExp('window.scrollTo(0, 0)');
  await new Promise(r => setTimeout(r, 1000));
  await takeScreenshot('correction-01-hero-initial-1440.png');

  // 1b. Initial Desktop Screen at 1280x800
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await evalExp('window.scrollTo(0, 0)');
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('correction-01b-hero-initial-1280.png');

  // 1c. Initial Desktop Screen at 1920x1080
  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await evalExp('window.scrollTo(0, 0)');
  await new Promise(r => setTimeout(r, 600));
  await takeScreenshot('correction-01c-hero-initial-1920.png');

  // 2. Screenshot after scrolling to Featured Edits (1440x900)
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await evalExp('document.getElementById("work").scrollIntoView({ behavior: "instant" })');
  await new Promise(r => setTimeout(r, 1200));
  await takeScreenshot('correction-02-scrolled-featured-edits.png');

  // 3. Screenshot showing Long-Form video followed by About section with improved separation
  await evalExp('(() => { const lf = document.querySelector(\'[data-project-id="project-04"]\'); if (lf) lf.scrollIntoView({ behavior: "instant", block: "center" }); })()');
  await new Promise(r => setTimeout(r, 1000));
  await takeScreenshot('correction-03-longform-to-about-separation.png');

  // 4. Mobile initial screen at 375x812
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await evalExp('window.scrollTo(0, 0)');
  await new Promise(r => setTimeout(r, 800));
  await takeScreenshot('correction-04-mobile-hero-375.png');

  chrome.kill();
  console.log('Capture complete!');
}
capture();
