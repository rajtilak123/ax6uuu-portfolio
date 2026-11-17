import WebSocket from 'ws';
import http from 'http';
import fs from 'fs';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:\\Users\\Tilak\\.gemini\\antigravity\\brain\\69b9d6b8-5377-4eed-9c19-7d05249c38ea';

async function verifyAndCapture() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9246',
    '--user-data-dir=C:\\Temp\\chrome-hero-check-' + Date.now(),
    'http://localhost:5173'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const tabs = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9246/json', res => {
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

  const viewports = [[1920, 1080], [1440, 900], [1280, 800], [375, 812], [390, 844]];
  for (const [w, h] of viewports) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 600 });
    await evalExp('window.scrollTo(0, 0)');
    await new Promise(r => setTimeout(r, 600));

    const metrics = await evalExp(`(() => {
      const h1 = document.querySelector('h1');
      const p = h1 ? h1.nextElementSibling : null;
      const btn1 = document.querySelector('.max-w-5xl a[href="#contact"]') || document.querySelector('a[href="#contact"]');
      const btn2 = document.querySelector('.max-w-5xl a[href="#work"]') || document.querySelector('a[href="#work"]');
      const h1Style = h1 ? window.getComputedStyle(h1) : {};
      const pStyle = p ? window.getComputedStyle(p) : {};
      const btn1Style = btn1 ? window.getComputedStyle(btn1) : {};
      const btn2Style = btn2 ? window.getComputedStyle(btn2) : {};
      const work = document.getElementById('work');
      return {
        viewport: '${w}x${h}',
        h1FontSize: h1Style.fontSize,
        h1LineHeight: h1Style.lineHeight,
        h1FontWeight: h1Style.fontWeight,
        h1Text: h1 ? h1.innerText : null,
        pFontSize: pStyle.fontSize,
        pLineHeight: pStyle.lineHeight,
        btn1Height: btn1 ? Math.round(btn1.getBoundingClientRect().height) : null,
        btn1Padding: btn1Style.padding,
        btn1FontSize: btn1Style.fontSize,
        btn2Height: btn2 ? Math.round(btn2.getBoundingClientRect().height) : null,
        workTop: work ? Math.round(work.getBoundingClientRect().top) : null,
        workVisibleInInitialViewport: work ? (work.getBoundingClientRect().top < ${h}) : null,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
      };
    })()`);
    console.log(JSON.stringify(metrics, null, 2));

    if (w === 1440) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`${ARTIFACT_DIR}\\hero-typography-final-1440.png`, Buffer.from(res.data, 'base64'));
      console.log('Saved hero-typography-final-1440.png');
    }
    if (w === 1920) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`${ARTIFACT_DIR}\\hero-typography-final-1920.png`, Buffer.from(res.data, 'base64'));
      console.log('Saved hero-typography-final-1920.png');
    }
  }
  chrome.kill();
}
verifyAndCapture();
