import WebSocket from 'ws';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

async function runAudit() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9232',
    '--user-data-dir=C:\\Temp\\chrome-audit-' + Date.now(),
    'http://localhost:5173'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const tabs = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9232/json', res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });

  const targetTab = tabs.find(t => t.type === 'page' && t.url.includes('5173')) || tabs[0];
  console.log('Target tab URL:', targetTab.url);

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
  await send('DOM.enable');

  const viewports = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'laptop-1280', width: 1280, height: 800 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'mobile-375', width: 375, height: 812 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'large-1920', width: 1920, height: 1080 }
  ];

  const results = {};

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768
    });
    await new Promise(r => setTimeout(r, 800));

    const script = `(() => {
      const elements = Array.from(document.querySelectorAll('header, section, footer')).map(el => {
        const r = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);
        return {
          tag: el.tagName,
          id: el.id || el.getAttribute('aria-label') || 'unnamed',
          top: Math.round(r.top + window.scrollY),
          height: Math.round(r.height),
          paddingTop: cs.paddingTop,
          paddingBottom: cs.paddingBottom,
          marginTop: cs.marginTop,
          marginBottom: cs.marginBottom
        };
      });

      const root = document.documentElement;
      const body = document.body;
      const scrollWidth = Math.max(root.scrollWidth, body.scrollWidth);
      const innerWidth = window.innerWidth;
      const hasHorizontalOverflow = scrollWidth > innerWidth + 1;

      // Check card measurements in video gallery
      const cards = Array.from(document.querySelectorAll('[data-project-id]')).map(c => {
        const cr = c.getBoundingClientRect();
        return {
          id: c.getAttribute('data-project-id'),
          width: Math.round(cr.width),
          height: Math.round(cr.height),
          aspectRatio: (cr.width / cr.height).toFixed(2)
        };
      });

      return {
        hasHorizontalOverflow,
        scrollWidth,
        innerWidth,
        elements,
        cards
      };
    })()`;

    try {
      const evalRes = await send('Runtime.evaluate', {
        expression: script,
        returnByValue: true
      });
      if (evalRes.exceptionDetails) {
        console.error('Script exception in', vp.name, evalRes.exceptionDetails);
      } else {
        results[vp.name] = evalRes.result ? evalRes.result.value : evalRes.value;
      }
    } catch (err) {
      console.error('Error on vp', vp.name, err);
    }
  }

  console.log(JSON.stringify(results, null, 2));
  fs.writeFileSync('C:\\Users\\Tilak\\.gemini\\antigravity\\brain\\69b9d6b8-5377-4eed-9c19-7d05249c38ea\\audit-results.json', JSON.stringify(results, null, 2));

  ws.close();
  chrome.kill();
}

runAudit().catch(console.error);
