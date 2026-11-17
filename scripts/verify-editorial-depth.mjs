import WebSocket from 'ws';
import http from 'http';
import fs from 'fs';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:\\Users\\Tilak\\.gemini\\antigravity\\brain\\69b9d6b8-5377-4eed-9c19-7d05249c38ea';

async function verifyEditorialDepth() {
  console.log('=== STARTING EDITORIAL VISUAL DEPTH & BORDER REFINEMENT AUDIT ===\n');

  const chromePort = 9254;
  const userDataDir = 'C:\\Temp\\chrome-depth-' + Date.now();
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${chromePort}`,
    `--user-data-dir=${userDataDir}`,
    'http://localhost:5173'
  ]);
  await new Promise(r => setTimeout(r, 2500));

  let tabs;
  try {
    tabs = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${chromePort}/json`, res => {
        let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });
  } catch (err) {
    console.error('Failed to connect to Chrome:', err);
    chrome.kill();
    return;
  }

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

  // Wait for initial render
  await new Promise(r => setTimeout(r, 3000));

  const evalExp = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true });
    return res.result ? res.result.value : res.value;
  };

  const captureScreenshot = async (filename, clip = null) => {
    const params = { format: 'png' };
    if (clip) params.clip = clip;
    const { data } = await send('Page.captureScreenshot', params);
    fs.writeFileSync(`${ARTIFACT_DIR}\\${filename}`, Buffer.from(data, 'base64'));
    console.log(`[Captured] ${filename}`);
  };

  // --- DESKTOP 1440x900 SCREENSHOTS ---
  console.log('--- 1. DESKTOP 1440x900 SCREENSHOTS ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  await evalExp('window.scrollTo(0, 0)');
  await new Promise(r => setTimeout(r, 600));

  // 1. Hero with subtle boundary
  await captureScreenshot('depth-desktop-hero-1440.png');

  // 2. Video Gallery - Short Form
  await evalExp(`document.getElementById('work').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('depth-desktop-shortform-1440.png');

  // 3. Video Gallery - Long Form
  await evalExp(`(() => {
    const h2s = Array.from(document.querySelectorAll('h2'));
    const lf = h2s.find(h => h.innerText.includes('LONG-FORM'));
    if (lf) lf.scrollIntoView({ behavior: 'instant', block: 'start' });
  })()`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('depth-desktop-longform-1440.png');

  // 4. About Section - Philosophy Cards with refined borders
  await evalExp(`document.getElementById('about').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('depth-desktop-about-1440.png');

  // 5. Services Section - Ledger rows & Frame visual
  await evalExp(`document.getElementById('services').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('depth-desktop-services-1440.png');

  // 6. Free Sample CTA - Electric blue border & edge glow
  await evalExp(`(() => {
    const h2s = Array.from(document.querySelectorAll('h2'));
    const cta = h2s.find(h => h.innerText.includes('Ready To Make Your Next Video'));
    if (cta) cta.scrollIntoView({ behavior: 'instant', block: 'center' });
  })()`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('depth-desktop-cta-1440.png');

  // 7. Contact Section - Refined border rows & footer
  await evalExp(`document.getElementById('contact').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('depth-desktop-contact-1440.png');

  // --- MOBILE 375x812 SCREENSHOTS ---
  console.log('\n--- 2. MOBILE 375x812 SCREENSHOTS ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
  await evalExp('window.scrollTo(0, 0)');
  await new Promise(r => setTimeout(r, 600));

  // Mobile Hero
  await captureScreenshot('depth-mobile-hero-375.png');

  // Mobile Work
  await evalExp(`document.getElementById('work').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('depth-mobile-work-375.png');

  // Mobile Services
  await evalExp(`document.getElementById('services').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('depth-mobile-services-375.png');

  // Mobile Contact & Footer
  await evalExp(`document.getElementById('contact').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('depth-mobile-contact-375.png');

  console.log('\n=== ALL EDITORIAL DEPTH SCREENSHOTS CAPTURED SUCCESSFULLY ===');

  ws.close();
  chrome.kill();
}

verifyEditorialDepth().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
