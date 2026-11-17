import WebSocket from 'ws';
import http from 'http';
import fs from 'fs';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:\\Users\\Tilak\\.gemini\\antigravity\\brain\\69b9d6b8-5377-4eed-9c19-7d05249c38ea';

async function verifyPolish() {
  console.log('=== STARTING FINAL BRAND & NAVIGATION POLISH AUDIT ===');

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9249',
    '--user-data-dir=C:\\Temp\\chrome-polish-' + Date.now(),
    'http://localhost:5173'
  ]);
  await new Promise(r => setTimeout(r, 2000));

  const tabs = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9249/json', res => {
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

  // Wait for initial render
  await new Promise(r => setTimeout(r, 3000));

  const evalExp = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true });
    return res.result ? res.result.value : res.value;
  };

  // 1. Desktop 1440x900 Navbar Audit
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await evalExp('window.scrollTo(0, 0)');
  await new Promise(r => setTimeout(r, 1000));

  const desktopAudit = await evalExp(`(() => {
    const header = document.querySelector('header');
    const wordmark = header ? header.querySelector('[aria-label="ax6uuu logo"]') : null;
    const avatar = header ? header.querySelector('img[alt="ax6uuu brand avatar"]') : null;
    const videoEditorTag = header ? header.querySelector('span.border-l') : null;
    const hireMeBtn = Array.from(header.querySelectorAll('a')).find(a => a.textContent.includes('HIRE ME'));
    const navLinks = Array.from(header.querySelectorAll('nav a')).map(a => ({
      text: a.innerText.trim(),
      href: a.getAttribute('href')
    }));

    const wmStyle = wordmark ? window.getComputedStyle(wordmark) : {};
    return {
      wordmark: {
        text: wordmark ? wordmark.innerText : null,
        tag: wordmark ? wordmark.tagName.toLowerCase() : null,
        fontFamily: wmStyle.fontFamily,
        fontWeight: wmStyle.fontWeight,
        fontSize: wmStyle.fontSize,
        color: wmStyle.color,
        letterSpacing: wmStyle.letterSpacing,
      },
      avatarPresent: Boolean(avatar),
      avatarSrc: avatar ? avatar.getAttribute('src') : null,
      videoEditorLabel: videoEditorTag ? videoEditorTag.innerText.trim() : null,
      hireMeButton: {
        text: hireMeBtn ? hireMeBtn.innerText.trim() : null,
        href: hireMeBtn ? hireMeBtn.getAttribute('href') : null,
        target: hireMeBtn ? hireMeBtn.getAttribute('target') : null,
        rel: hireMeBtn ? hireMeBtn.getAttribute('rel') : null,
      },
      navLinks
    };
  })()`);
  console.log('[1. Desktop Navbar Audit]:', JSON.stringify(desktopAudit, null, 2));

  // Capture Desktop Navbar Screenshot (Focusing on top header + hero)
  const ssNavbar = await send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 1440, height: 400, scale: 1 }
  });
  fs.writeFileSync(`${ARTIFACT_DIR}\\navbar-desktop-polished.png`, Buffer.from(ssNavbar.data, 'base64'));
  console.log('Saved navbar-desktop-polished.png');

  // Full Desktop Hero Screenshot
  const ssHero = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${ARTIFACT_DIR}\\desktop-initial-hero-polished.png`, Buffer.from(ssHero.data, 'base64'));
  console.log('Saved desktop-initial-hero-polished.png');

  // 2. Mobile 375x812 Navbar Audit
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await evalExp('window.scrollTo(0, 0)');
  await new Promise(r => setTimeout(r, 800));

  const mobileNavbarAudit = await evalExp(`(() => {
    const header = document.querySelector('header');
    const wordmark = header ? header.querySelector('[aria-label="ax6uuu logo"]') : null;
    const hireMeBtn = Array.from(header.querySelectorAll('a')).find(a => a.textContent.includes('HIRE ME'));
    const menuBtn = header ? header.querySelector('button[aria-label*="navigation menu"]') : null;
    const wmStyle = wordmark ? window.getComputedStyle(wordmark) : {};
    return {
      wordmarkText: wordmark ? wordmark.innerText : null,
      wordmarkFontSize: wmStyle.fontSize,
      hireMeButton: {
        href: hireMeBtn ? hireMeBtn.getAttribute('href') : null,
        target: hireMeBtn ? hireMeBtn.getAttribute('target') : null,
        rel: hireMeBtn ? hireMeBtn.getAttribute('rel') : null,
      },
      hasMenuButton: Boolean(menuBtn),
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
    };
  })()`);
  console.log('[2. Mobile Navbar Audit]:', JSON.stringify(mobileNavbarAudit, null, 2));

  const ssMobClosed = await send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 375, height: 350, scale: 1 }
  });
  fs.writeFileSync(`${ARTIFACT_DIR}\\navbar-mobile-polished.png`, Buffer.from(ssMobClosed.data, 'base64'));
  console.log('Saved navbar-mobile-polished.png');

  // 3. Open Mobile Drawer and audit
  await evalExp(`(() => {
    const btn = document.querySelector('button[aria-label*="navigation menu"]');
    if (btn) btn.click();
  })()`);
  await new Promise(r => setTimeout(r, 500));

  const mobileDrawerAudit = await evalExp(`(() => {
    const drawer = document.querySelector('nav[aria-label="Mobile navigation"]')?.closest('div');
    const links = drawer ? Array.from(drawer.querySelectorAll('nav a')).map(a => a.innerText.trim()) : [];
    const drawerHireMe = drawer ? Array.from(drawer.querySelectorAll('a')).find(a => a.textContent.includes('HIRE ME')) : null;
    return {
      isOpen: Boolean(drawer),
      links,
      drawerHireMeHref: drawerHireMe ? drawerHireMe.getAttribute('href') : null,
      drawerHireMeTarget: drawerHireMe ? drawerHireMe.getAttribute('target') : null,
      drawerHireMeRel: drawerHireMe ? drawerHireMe.getAttribute('rel') : null,
    };
  })()`);
  console.log('[3. Mobile Drawer Audit]:', JSON.stringify(mobileDrawerAudit, null, 2));

  const ssMobOpen = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${ARTIFACT_DIR}\\navbar-mobile-drawer-polished.png`, Buffer.from(ssMobOpen.data, 'base64'));
  console.log('Saved navbar-mobile-drawer-polished.png');

  // 4. Test Hover Interaction on Desktop Navbar Wordmark and HIRE ME
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await evalExp('window.scrollTo(0, 0)');
  await new Promise(r => setTimeout(r, 300));

  const wordmarkBox = await evalExp(`(() => {
    const a = document.querySelector('header a[aria-label="ax6uuu homepage"]');
    if (!a) return null;
    const r = a.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  })()`);

  if (wordmarkBox) {
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: wordmarkBox.x, y: wordmarkBox.y });
    await new Promise(r => setTimeout(r, 300));
    const ssHover = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 400, height: 100, scale: 1 }
    });
    fs.writeFileSync(`${ARTIFACT_DIR}\\navbar-wordmark-hover.png`, Buffer.from(ssHover.data, 'base64'));
    console.log('Saved navbar-wordmark-hover.png');
  }

  chrome.kill();
  console.log('=== POLISH AUDIT COMPLETED ===');
}
verifyPolish();
