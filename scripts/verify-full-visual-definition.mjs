import WebSocket from 'ws';
import http from 'http';
import fs from 'fs';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:\\Users\\Tilak\\.gemini\\antigravity\\brain\\69b9d6b8-5377-4eed-9c19-7d05249c38ea';

async function verifyFullDefinition() {
  console.log('=== STARTING FULL WEBSITE VISUAL DEFINITION & BORDER REFINEMENT AUDIT ===\n');

  const chromePort = 9256;
  const userDataDir = 'C:\\Temp\\chrome-definition-' + Date.now();
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

  // --- 1. DESKTOP 1440x900 SECTION SCREENSHOTS ---
  console.log('--- 1. DESKTOP 1440x900 SECTION AUDIT ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  await evalExp('window.scrollTo(0, 0)');
  await new Promise(r => setTimeout(r, 600));

  // Hero Section
  await captureScreenshot('defined-desktop-hero-1440.png');

  // Work - Short Form
  await evalExp(`document.getElementById('work').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('defined-desktop-work-shortform-1440.png');

  // Work - Long Form
  await evalExp(`(() => {
    const h2s = Array.from(document.querySelectorAll('h2'));
    const lf = h2s.find(h => h.innerText.includes('LONG-FORM'));
    if (lf) lf.scrollIntoView({ behavior: 'instant', block: 'start' });
  })()`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('defined-desktop-work-longform-1440.png');

  // About Section
  await evalExp(`document.getElementById('about').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('defined-desktop-about-1440.png');

  // Services Section
  await evalExp(`document.getElementById('services').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('defined-desktop-services-1440.png');

  // Free Sample CTA
  await evalExp(`(() => {
    const h2s = Array.from(document.querySelectorAll('h2'));
    const cta = h2s.find(h => h.innerText.includes('Ready To Make Your Next Video'));
    if (cta) cta.scrollIntoView({ behavior: 'instant', block: 'center' });
  })()`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('defined-desktop-cta-1440.png');

  // Contact Section & Footer
  await evalExp(`document.getElementById('contact').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('defined-desktop-contact-1440.png');

  // --- 2. RESPONSIVE BREAKPOINT CHECKS ---
  console.log('\n--- 2. RESPONSIVE BREAKPOINT AUDITS ---');

  // Breakpoint 1: 1366px Laptop Desktop
  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1.5, mobile: false });
  await evalExp('window.scrollTo(0, 0)');
  await new Promise(r => setTimeout(r, 500));
  await captureScreenshot('defined-laptop-hero-1366.png');

  // Breakpoint 2: 768px Tablet
  await send('Emulation.setDeviceMetricsOverride', { width: 768, height: 1024, deviceScaleFactor: 2, mobile: false });
  await evalExp('window.scrollTo(0, 0)');
  await new Promise(r => setTimeout(r, 500));
  await captureScreenshot('defined-tablet-hero-768.png');

  // Breakpoint 3: 390px iPhone 14
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
  await evalExp('window.scrollTo(0, 0)');
  await new Promise(r => setTimeout(r, 500));
  await captureScreenshot('defined-mobile-hero-390.png');

  // Breakpoint 4: 375px iPhone SE / Mini
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
  await evalExp('window.scrollTo(0, 0)');
  await new Promise(r => setTimeout(r, 500));
  await captureScreenshot('defined-mobile-hero-375.png');

  await evalExp(`document.getElementById('work').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 500));
  await captureScreenshot('defined-mobile-work-375.png');

  await evalExp(`document.getElementById('services').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 500));
  await captureScreenshot('defined-mobile-services-375.png');

  await evalExp(`document.getElementById('contact').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 500));
  await captureScreenshot('defined-mobile-contact-375.png');

  console.log('\n=== ALL FULL VISUAL DEFINITION SCREENSHOTS CAPTURED SUCCESSFULLY ===');

  ws.close();
  chrome.kill();
}

verifyFullDefinition().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
