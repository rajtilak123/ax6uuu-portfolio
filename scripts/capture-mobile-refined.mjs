import WebSocket from 'ws';
import http from 'http';
import fs from 'fs';
import { spawn } from 'child_process';

async function captureMobile() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9236',
    '--user-data-dir=C:\\Temp\\chrome-mob-refine-' + Date.now(),
    'http://localhost:5173'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const tabs = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9236/json', res => {
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
      if (data.id === curId) {
        ws.off('message', handler);
        res(data.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });

  const mobileTargets = [
    { name: 'mobile-hero', selector: 'header' },
    { name: 'mobile-gallery', selector: '#work' },
    { name: 'mobile-services', selector: '#services' },
    { name: 'mobile-contact', selector: '#contact' }
  ];

  for (const t of mobileTargets) {
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById("${t.selector.replace('#', '')}") || document.querySelector("${t.selector}");
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });

    await new Promise(r => setTimeout(r, 900));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`C:\\Users\\Tilak\\.gemini\\antigravity\\brain\\69b9d6b8-5377-4eed-9c19-7d05249c38ea\\refined-${t.name}.png`, Buffer.from(shot.data, 'base64'));
    console.log(`Saved refined-${t.name}.png`);
  }

  ws.close();
  chrome.kill();
}

captureMobile().catch(console.error);
