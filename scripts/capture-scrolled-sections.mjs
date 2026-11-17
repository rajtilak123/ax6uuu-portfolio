import WebSocket from 'ws';
import http from 'http';
import fs from 'fs';
import { spawn } from 'child_process';

async function capture() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9234',
    '--user-data-dir=C:\\Temp\\chrome-scroll-cap-' + Date.now(),
    'http://localhost:5173'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const tabs = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9234/json', res => {
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
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Scroll targets: selector and filename
  const targets = [
    { name: '01-hero', selector: 'header' },
    { name: '02-shortform', selector: '#work' },
    { name: '03-longform', selector: '[data-project-id="project-04"]' },
    { name: '04-about', selector: '#about' },
    { name: '05-services', selector: '#services' },
    { name: '06-cta', selector: 'section:has(h2:contains("Ready To Make"))' },
    { name: '07-contact', selector: '#contact' }
  ];

  for (const t of targets) {
    await send('Runtime.evaluate', {
      expression: `(() => {
        let el = document.getElementById("${t.selector.replace('#', '')}") || document.querySelector("${t.selector}");
        if (!el && "${t.name}" === "06-cta") {
          const h2s = Array.from(document.querySelectorAll('h2'));
          const h2 = h2s.find(h => h.textContent.includes('Ready To Make'));
          el = h2 ? h2.closest('section') : null;
        }
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 900));

    const shot = await send('Page.captureScreenshot', {
      format: 'png'
    });

    fs.writeFileSync(`C:\\Users\\Tilak\\.gemini\\antigravity\\brain\\69b9d6b8-5377-4eed-9c19-7d05249c38ea\\section-${t.name}.png`, Buffer.from(shot.data, 'base64'));
    console.log(`Saved section-${t.name}.png`);
  }

  ws.close();
  chrome.kill();
}

capture().catch(console.error);
