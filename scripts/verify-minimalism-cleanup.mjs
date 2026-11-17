import WebSocket from 'ws';
import http from 'http';
import fs from 'fs';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:\\Users\\Tilak\\.gemini\\antigravity\\brain\\69b9d6b8-5377-4eed-9c19-7d05249c38ea';

async function verifyMinimalismCleanup() {
  console.log('=== STARTING FINAL MINIMALISM, CONTACT & VISUAL CLEANUP AUDIT ===\n');

  const chromePort = 9252;
  const userDataDir = 'C:\\Temp\\chrome-cleanup-' + Date.now();
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

  // --- AUDIT 1: CHECK BANNED DECORATIVE TEXT & LABELS ---
  console.log('--- AUDIT 1: BANNED DECORATIVE LABELS CHECK ---');
  const bodyText = await evalExp('document.body.innerText');
  const bannedTerms = [
    'AVAILABLE FOR PROJECTS',
    'DESIGNED WITH INTENTION',
    '© 2026',
    '01 /',
    '02 /',
    '03 /',
    '04 /',
    '01—03',
    'A FRAME FROM THE WORKS',
    'Simultaneous inline previews',
    '16:9 Landscape Cut',
    'Core Principles of Every Cut',
    'Core Capabilities & Disciplines',
    'FREE SAMPLE WORKFLOW',
    'RISK-FREE'
  ];

  let bannedViolations = 0;
  for (const term of bannedTerms) {
    if (bodyText.includes(term)) {
      console.error(`[FAIL] Found banned term in DOM text: "${term}"`);
      bannedViolations++;
    } else {
      console.log(`[PASS] Banned term clean: "${term}"`);
    }
  }

  // --- AUDIT 2: CHECK CONTACT DETAILS & ATTRIBUTES ---
  console.log('\n--- AUDIT 2: CONTACT INFORMATION AUDIT ---');
  const contactAudit = await evalExp(`(() => {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return { error: 'Contact section missing' };
    const links = Array.from(contactSection.querySelectorAll('a'));
    return links.map(a => ({
      href: a.getAttribute('href'),
      text: a.innerText.replace(/\\s+/g, ' ').trim(),
      target: a.getAttribute('target'),
      hasArrow: !!a.querySelector('svg.lucide-arrow-up-right'),
      ariaLabel: a.getAttribute('aria-label')
    }));
  })()`);

  console.log('Contact links found:', JSON.stringify(contactAudit, null, 2));

  const expectedMailto = 'mailto:ashutoshsahu1907@gmail.com?subject=Video%20Editing%20Project%20Inquiry&body=Hi%20Ashutosh%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20I%27m%20interested%20in%20your%20video%20editing%20services.%0A%0AI%27d%20like%20to%20discuss%20a%20project%20with%20you.%20Please%20let%20me%20know%20how%20we%20can%20get%20started.%0A%0ALooking%20forward%20to%20hearing%20from%20you.%0A%0AThanks!';

  const emailRow = contactAudit.find(l => l.text.includes('EMAIL'));
  if (emailRow && emailRow.href === expectedMailto) {
    console.log('[PASS] Email mailto URL matches exact specification');
  } else {
    console.error('[FAIL] Email mailto mismatch:', emailRow?.href);
  }
  if (emailRow && emailRow.text.includes('ashutoshsahu1907@gmail.com')) {
    console.log('[PASS] Email address clearly visible in row');
  } else {
    console.error('[FAIL] Email address missing from text');
  }

  const xRow = contactAudit.find(l => l.text.includes('X'));
  if (xRow && xRow.href === 'https://x.com/x6visuals' && xRow.text.includes('@x6visuals')) {
    console.log('[PASS] X profile updated to @x6visuals / https://x.com/x6visuals');
  } else {
    console.error('[FAIL] X profile mismatch:', xRow);
  }

  const whatsappRow = contactAudit.find(l => l.text.includes('WHATSAPP'));
  if (whatsappRow && whatsappRow.href.includes('wa.me/917849093212') && whatsappRow.text.includes('+91 7849093212')) {
    console.log('[PASS] WhatsApp contact row verified');
  } else {
    console.error('[FAIL] WhatsApp mismatch:', whatsappRow);
  }

  // Verify circular arrows are gone from all contact rows
  const arrowsInContact = contactAudit.filter(l => l.hasArrow);
  if (arrowsInContact.length === 0) {
    console.log('[PASS] All decorative circular arrow icons removed from contact rows');
  } else {
    console.error('[FAIL] Decorative arrow icons still present in contact rows:', arrowsInContact.length);
  }

  // --- AUDIT 3: BACK TO TOP BUTTON ---
  console.log('\n--- AUDIT 3: BACK TO TOP BUTTON AUDIT ---');
  const backToTop = await evalExp(`(() => {
    const contactSection = document.getElementById('contact');
    const btn = contactSection?.querySelector('button[aria-label="Back to top of page"]');
    return {
      exists: !!btn,
      text: btn ? btn.innerText.trim() : null
    };
  })()`);
  console.log('[Back To Top Button]', backToTop);

  // --- AUDIT 4: CAPTURE HIGH-RES SCREENSHOTS ---
  console.log('\n--- AUDIT 4: CAPTURING SECTION SCREENSHOTS ---');

  // Desktop 1440x900
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
  await evalExp('window.scrollTo(0, 0)');
  await new Promise(r => setTimeout(r, 600));

  // 1. Desktop Initial Hero Screen
  await captureScreenshot('clean-desktop-hero-1440.png');

  // 2. Desktop Featured Edits (Short-form)
  await evalExp(`document.getElementById('work').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('clean-desktop-shortform-1440.png');

  // 3. Desktop Long-form Section
  await evalExp(`(() => {
    const h2s = Array.from(document.querySelectorAll('h2'));
    const lf = h2s.find(h => h.innerText.includes('LONG-FORM'));
    if (lf) lf.scrollIntoView({ behavior: 'instant', block: 'start' });
  })()`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('clean-desktop-longform-1440.png');

  // 4. Desktop About Section
  await evalExp(`document.getElementById('about').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('clean-desktop-about-1440.png');

  // 5. Desktop Services Section
  await evalExp(`document.getElementById('services').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('clean-desktop-services-1440.png');

  // 6. Desktop Free Sample CTA Section
  await evalExp(`(() => {
    const h2s = Array.from(document.querySelectorAll('h2'));
    const cta = h2s.find(h => h.innerText.includes('Ready To Make Your Next Video'));
    if (cta) cta.scrollIntoView({ behavior: 'instant', block: 'center' });
  })()`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('clean-desktop-cta-1440.png');

  // 7. Desktop Contact & Footer Section
  await evalExp(`document.getElementById('contact').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('clean-desktop-contact-1440.png');

  // --- MOBILE SCREENSHOTS (375x812) ---
  console.log('\n--- AUDIT 5: CAPTURING MOBILE SCREENSHOTS (375x812) ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
  await evalExp('window.scrollTo(0, 0)');
  await new Promise(r => setTimeout(r, 600));

  // Mobile Hero
  await captureScreenshot('clean-mobile-hero-375.png');

  // Mobile Work
  await evalExp(`document.getElementById('work').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('clean-mobile-work-375.png');

  // Mobile Services
  await evalExp(`document.getElementById('services').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('clean-mobile-services-375.png');

  // Mobile Contact & Footer
  await evalExp(`document.getElementById('contact').scrollIntoView({ behavior: 'instant' })`);
  await new Promise(r => setTimeout(r, 600));
  await captureScreenshot('clean-mobile-contact-375.png');

  // Mobile Drawer Open
  await evalExp('window.scrollTo(0, 0)');
  await new Promise(r => setTimeout(r, 300));
  await evalExp(`(() => {
    const btn = document.querySelector('button[aria-label="Open navigation menu"]');
    if (btn) btn.click();
  })()`);
  await new Promise(r => setTimeout(r, 500));
  await captureScreenshot('clean-mobile-drawer-375.png');

  console.log('\n=== ALL AUDITS & SCREENSHOTS COMPLETED SUCCESSFULLY ===');

  ws.close();
  chrome.kill();
}

verifyMinimalismCleanup().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
