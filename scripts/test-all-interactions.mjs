import WebSocket from 'ws';
import http from 'http';
import { spawn } from 'child_process';

async function testAll() {
  console.log('--- STARTING COMPREHENSIVE QA INTERACTION SUITE ---');

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9235',
    '--user-data-dir=C:\\Temp\\chrome-qa-' + Date.now(),
    'http://localhost:5173'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const tabs = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9235/json', res => {
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
  await send('Runtime.enable');

  const evalExp = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true });
    return res.result ? res.result.value : res.value;
  };

  // 1. Desktop 1440x900 viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // TEST 1: Simultaneous Short-Form Autoplay
  console.log('\n[Test 1] Testing simultaneous short-form video autoplay...');
  await evalExp(`document.getElementById('work').scrollIntoView({ behavior: 'instant', block: 'center' });`);
  await new Promise(r => setTimeout(r, 1200));

  const autoplayStatus = await evalExp(`(() => {
    const cards = Array.from(document.querySelectorAll('[data-project-id^="project-0"]')).slice(0, 3);
    return cards.map(c => ({
      id: c.getAttribute('data-project-id'),
      isPlayingAttr: c.getAttribute('data-is-playing'),
      hasIframe: !!c.querySelector('iframe'),
      badgeText: c.querySelector('.bg-electric')?.textContent || ''
    }));
  })()`);
  console.log('Short-form autoplay status:', JSON.stringify(autoplayStatus, null, 2));

  // TEST 2: Long-Form Video Autoplay
  console.log('\n[Test 2] Testing long-form video autoplay on scroll...');
  await evalExp(`document.querySelector('[data-project-id="project-04"]').scrollIntoView({ behavior: 'instant', block: 'center' });`);
  await new Promise(r => setTimeout(r, 1200));

  const longformStatus = await evalExp(`(() => {
    const c = document.querySelector('[data-project-id="project-04"]');
    return {
      id: c.getAttribute('data-project-id'),
      isPlayingAttr: c.getAttribute('data-is-playing'),
      hasIframe: !!c.querySelector('iframe')
    };
  })()`);
  console.log('Long-form status:', JSON.stringify(longformStatus, null, 2));

  // TEST 3: Modal Lightbox Open & Close
  console.log('\n[Test 3] Testing video modal lightbox interaction...');
  // Click project-01 card
  await evalExp(`document.querySelector('[data-project-id="project-01"]').click();`);
  await new Promise(r => setTimeout(r, 600));

  const modalOpenStatus = await evalExp(`(() => {
    const dialog = document.querySelector('[role="dialog"]');
    const iframe = dialog ? dialog.querySelector('iframe') : null;
    return {
      isOpen: !!dialog,
      iframeSrc: iframe ? iframe.src : null,
      bodyOverflow: document.body.style.overflow
    };
  })()`);
  console.log('Modal opened:', JSON.stringify(modalOpenStatus, null, 2));

  // Close modal via Escape key
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', windowsVirtualKeyCode: 27 });
  await new Promise(r => setTimeout(r, 500));

  const modalCloseStatus = await evalExp(`(() => {
    const dialog = document.querySelector('[role="dialog"]');
    return {
      isOpen: !!dialog,
      bodyOverflow: document.body.style.overflow
    };
  })()`);
  console.log('Modal closed via Escape:', JSON.stringify(modalCloseStatus, null, 2));

  // TEST 4: Contact Link URLs & Phone Numbers
  console.log('\n[Test 4] Verifying contact links & WhatsApp number...');
  const contactLinks = await evalExp(`(() => {
    const links = Array.from(document.querySelectorAll('#contact a[href]')).map(a => ({
      text: a.textContent.trim(),
      href: a.getAttribute('href'),
      target: a.getAttribute('target')
    }));
    return links;
  })()`);
  console.log('Contact links:', JSON.stringify(contactLinks, null, 2));

  // TEST 5: Free Sample CTA WhatsApp URL
  console.log('\n[Test 5] Verifying Free Sample CTA button URL...');
  const ctaBtn = await evalExp(`(() => {
    const a = document.querySelector('section:has(h2) a[href*="wa.me"]');
    return {
      href: a ? a.getAttribute('href') : null,
      text: a ? a.textContent.trim() : null
    };
  })()`);
  console.log('CTA button:', JSON.stringify(ctaBtn, null, 2));

  // TEST 6: Mobile Drawer Navigation (375x812)
  console.log('\n[Test 6] Testing mobile navigation drawer on 375x812...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 500));

  // Click hamburger button
  await evalExp(`document.querySelector('header button[aria-label*="navigation"]').click();`);
  await new Promise(r => setTimeout(r, 500));

  const mobileDrawerOpen = await evalExp(`(() => {
    const nav = document.querySelector('header nav[aria-label="Mobile navigation"]');
    return {
      hasDrawer: !!nav,
      links: nav ? Array.from(nav.querySelectorAll('a')).map(a => a.textContent.trim()) : [],
      bodyOverflow: document.body.style.overflow
    };
  })()`);
  console.log('Mobile drawer opened:', JSON.stringify(mobileDrawerOpen, null, 2));

  // Close mobile drawer
  await evalExp(`document.querySelector('header button[aria-label*="navigation"]').click();`);
  await new Promise(r => setTimeout(r, 400));

  const mobileDrawerClosed = await evalExp(`(() => {
    const nav = document.querySelector('header nav[aria-label="Mobile navigation"]');
    return {
      hasDrawer: !!nav,
      bodyOverflow: document.body.style.overflow
    };
  })()`);
  console.log('Mobile drawer closed:', JSON.stringify(mobileDrawerClosed, null, 2));

  console.log('\n--- ALL QA INTERACTION TESTS COMPLETED SUCCESSFULLY ---');

  ws.close();
  chrome.kill();
}

testAll().catch(console.error);
