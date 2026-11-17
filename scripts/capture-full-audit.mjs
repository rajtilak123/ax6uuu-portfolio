import WebSocket from 'ws';
import http from 'http';
import fs from 'fs';
import { spawn } from 'child_process';

async function capture() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9233',
    '--user-data-dir=C:\\Temp\\chrome-cap-' + Date.now(),
    'http://localhost:5173'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const tabs = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9233/json', res => {
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

  const configs = [
    { name: 'desktop-hero', width: 1440, height: 900, clip: { x: 0, y: 0, width: 1440, height: 900, scale: 1 } },
    { name: 'desktop-gallery', width: 1440, height: 900, clip: { x: 0, y: 700, width: 1440, height: 1000, scale: 1 } },
    { name: 'desktop-longform', width: 1440, height: 900, clip: { x: 0, y: 1600, width: 1440, height: 800, scale: 1 } },
    { name: 'desktop-about', width: 1440, height: 900, clip: { x: 0, y: 2300, width: 1440, height: 900, scale: 1 } },
    { name: 'desktop-services', width: 1440, height: 900, clip: { x: 0, y: 3150, width: 1440, height: 1000, scale: 1 } },
    { name: 'desktop-cta-contact', width: 1440, height: 900, clip: { x: 0, y: 4150, width: 1440, height: 1100, scale: 1 } }
  ];

  for (const cfg of configs) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: cfg.width,
      height: cfg.height,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 600));

    const shot = await send('Page.captureScreenshot', {
      clip: cfg.clip
    });
    fs.writeFileSync(`C:\\Users\\Tilak\\.gemini\\antigravity\\brain\\69b9d6b8-5377-4eed-9c19-7d05249c38ea\\audit-${cfg.name}.png`, Buffer.from(shot.data, 'base64'));
    console.log(`Captured audit-${cfg.name}.png`);
  }

  ws.close();
  chrome.kill();
}

capture().catch(console.error);
