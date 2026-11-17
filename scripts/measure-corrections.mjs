import WebSocket from 'ws';
import http from 'http';
import { spawn } from 'child_process';

async function measure() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9241',
    '--user-data-dir=C:\\Temp\\chrome-measure-' + Date.now(),
    'http://localhost:5173'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  const tabs = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9241/json', res => {
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

  const viewports = [[1440, 900], [1280, 800], [1920, 1080], [375, 812], [390, 844]];
  for (const [w, h] of viewports) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 600 });
    await new Promise(r => setTimeout(r, 500));
    const data = await evalExp(`(() => {
      const nav = document.querySelector('header');
      const work = document.getElementById('work');
      const featuredHeading = work ? work.querySelector('h2') : null;
      const longFormCard = document.querySelector('[data-project-id="project-04"]');
      const about = document.getElementById('about');
      const aboutH2 = about ? about.querySelector('h2') : null;
      return {
        viewport: '${w}x${h}',
        navHeight: nav ? nav.getBoundingClientRect().height : null,
        workTop: work ? Math.round(work.getBoundingClientRect().top) : null,
        featuredHeadingTop: featuredHeading ? Math.round(featuredHeading.getBoundingClientRect().top) : null,
        featuredHeadingVisibleInInitialViewport: featuredHeading ? (featuredHeading.getBoundingClientRect().top < ${h}) : null,
        longFormCardBottom: longFormCard ? Math.round(longFormCard.getBoundingClientRect().bottom + window.scrollY) : null,
        aboutTop: about ? Math.round(about.getBoundingClientRect().top + window.scrollY) : null,
        aboutH2Top: aboutH2 ? Math.round(aboutH2.getBoundingClientRect().top + window.scrollY) : null,
        longFormToAboutGap: (about && longFormCard) ? Math.round((about.getBoundingClientRect().top + window.scrollY) - (longFormCard.getBoundingClientRect().bottom + window.scrollY)) : null
      };
    })()`);
    console.log(JSON.stringify(data, null, 2));
  }
  chrome.kill();
}
measure();
