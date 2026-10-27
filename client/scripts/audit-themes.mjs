import { chromium } from 'playwright';

const BASE = process.env.AUDIT_BASE || 'http://localhost:3000';

const PAGES = [
  '/',
  '/about-us',
  '/ash-utilization',
  '/ready-mix-concrete',
  '/green-mobility',
  '/venwind-refex',
  '/esg',
  '/newsroom',
  '/contact',
  '/careers',
  '/privacy-policy',
  '/terms-of-use',
  '/investors',
  '/investors/key-managerial-personnel',
  '/investors/financial-information',
  '/investors/annual-reports',
  '/investors/policies',
  '/investors/general-meeting-updates',
  '/investors/investor-presentation',
  '/investors/code-of-fair-disclosure-upsi',
  '/investors/credit-ratings',
  '/investors/recording-transcripts',
  '/investors/recording-transcripts-of-post-earnings-quarterly-calls',
  '/investors/disclosure-of-material-events-or-information',
  '/investors/stock-exchange-quarterly-compliance',
  '/investors/familiarization-programme',
  '/investors/familiarization-programme-for-independent-directors',
  '/investors/terms-and-conditions-of-appointment-of-id',
  '/investors/ipo',
  '/investors/rights-issue',
  '/investors/financial-statement-of-subsidiary',
  '/investors/annual-return',
  '/investors/book-closure-of-members-register-record-date',
  '/investors/secretarial-compliance-report',
  '/investors/investor-information',
  '/investors/registrar-transfer-agent',
  '/investors/newspaper-publication',
  '/investors/unpaid-dividend-list-and-iepf-shares',
  '/investors/disclosures-under-sast-regulations-2011',
  '/investors/employee-stock-option-scheme',
  '/investors/monitoring-agency-report',
  '/investors/statement-of-deviation',
  '/investors/csr-activities',
  '/investors/charter-documents',
  '/investors/scheme-of-amalgamation-arrangement',
  '/investors/smart-odr',
  '/product/r22',
  '/product/r404a',
  '/product/hfc-134a',
  '/product/r32',
  '/product/r407c',
  '/product/r410a',
  '/product/r600a',
  '/product/r290',
  '/product/hydrocarbon',
  '/product/butane',
  '/product/copper-tubes',
];

function samplePage() {
  const parse = (value) => {
    const match = String(value || '').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return null;
    return {
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3]),
      a: match[4] === undefined ? 1 : Number(match[4]),
    };
  };

  const composite = (fg, bg) => ({
    r: Math.round(fg.r * fg.a + bg.r * (1 - fg.a)),
    g: Math.round(fg.g * fg.a + bg.g * (1 - fg.a)),
    b: Math.round(fg.b * fg.a + bg.b * (1 - fg.a)),
    a: 1,
  });

  const channel = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };

  const lum = (c) => 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);

  const ratio = (a, b) => {
    const l1 = lum(a);
    const l2 = lum(b);
    const light = Math.max(l1, l2);
    const dark = Math.min(l1, l2);
    return (light + 0.05) / (dark + 0.05);
  };

  const backdrop = (el) => {
    let node = el;
    let bg = { r: 255, g: 255, b: 255, a: 1 };
    const chain = [];
    while (node && node !== document.documentElement) {
      const style = getComputedStyle(node);
      const color = parse(style.backgroundColor);
      if (color && color.a > 0.05) chain.push(color);
      if (style.backgroundImage && style.backgroundImage !== 'none') return null;
      node = node.parentElement;
    }
    const body = parse(getComputedStyle(document.body).backgroundColor);
    if (body && body.a > 0.9) bg = body;
    for (let i = chain.length - 1; i >= 0; i -= 1) bg = composite(chain[i], bg);
    return bg;
  };

  const issues = [];
  const seen = new Set();
  const nodes = document.querySelectorAll('h1,h2,h3,h4,p,a,button,span,li,label,td,th');
  nodes.forEach((el) => {
    if (issues.length >= 12) return;
    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) return;
    const rect = el.getBoundingClientRect();
    if (rect.width < 8 || rect.height < 8) return;
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const text = (el.innerText || '').replace(/\s+/g, ' ').trim();
    if (text.length < 3 || text.length > 90) return;
    if (el.querySelector('h1,h2,h3,h4,p,a,button,span,li')) {
      if (!/^(h1|h2|h3|h4|p|a|button|label)$/i.test(el.tagName)) return;
    }
    const fg = parse(style.color);
    const bg = backdrop(el);
    if (!fg || !bg) return;
    const solid = composite(fg, bg);
    const score = ratio(solid, bg);
    const size = parseFloat(style.fontSize) || 16;
    const weight = Number(style.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.5 && weight >= 700);
    const minimum = large ? 3 : 4.5;
    if (score >= minimum) return;
    const key = `${text.slice(0, 48)}|${Math.round(score * 10)}`;
    if (seen.has(key)) return;
    seen.add(key);
    issues.push({
      text: text.slice(0, 70),
      tag: el.tagName.toLowerCase(),
      contrast: Number(score.toFixed(2)),
      minimum,
      color: style.color,
      size,
    });
  });

  return {
    theme: document.documentElement.dataset.theme || '',
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    textLength: (document.body.innerText || '').replace(/\s+/g, ' ').trim().length,
    title: document.title,
    issues,
  };
}

async function audit(browser, theme) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript((value) => {
    localStorage.setItem('refex-site-theme', value);
  }, theme);
  const page = await context.newPage();
  const results = [];

  for (const path of PAGES) {
    const consoleErrors = [];
    const onConsole = (msg) => {
      if (msg.type() !== 'error') return;
      const text = msg.text();
      if (/Failed to load resource|favicon|api\/cms|ERR_CONNECTION|status of 500/i.test(text)) return;
      consoleErrors.push(text.slice(0, 180));
    };
    page.on('console', onConsole);
    const pageErrors = [];
    const onPageError = (error) => pageErrors.push(String(error).slice(0, 180));
    page.on('pageerror', onPageError);

    let status = 0;
    try {
      const response = await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      status = response ? response.status() : 0;
      await page.waitForTimeout(700);
      const close = page.getByRole('button', { name: 'Close modal' });
      if (await close.count()) {
        await close.first().click({ timeout: 1000 }).catch(() => {});
        await page.waitForTimeout(200);
      }
      const samples = [];
      for (const y of [0, 0.45, 0.9]) {
        await page.evaluate((ratio) => {
          const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
          window.scrollTo(0, max * ratio);
        }, y);
        await page.waitForTimeout(180);
        samples.push(await page.evaluate(samplePage));
      }
      const merged = [];
      const seen = new Set();
      samples.forEach((sample) => {
        sample.issues.forEach((issue) => {
          const key = issue.text;
          if (seen.has(key)) return;
          seen.add(key);
          merged.push(issue);
        });
      });
      const last = samples[samples.length - 1] || { theme: '', overflow: 0, textLength: 0, title: '' };
      results.push({
        path,
        status,
        theme: last.theme,
        overflow: Math.max(...samples.map((sample) => sample.overflow)),
        textLength: last.textLength,
        title: last.title,
        contrast: merged.slice(0, 6),
        consoleErrors: [...new Set(consoleErrors)].slice(0, 3),
        pageErrors: [...new Set(pageErrors)].slice(0, 3),
      });
    } catch (error) {
      results.push({
        path,
        status,
        theme: '',
        overflow: 0,
        textLength: 0,
        title: '',
        contrast: [],
        consoleErrors: [],
        pageErrors: [String(error).slice(0, 180)],
      });
    }

    page.off('console', onConsole);
    page.off('pageerror', onPageError);
  }

  await context.close();
  return results;
}

const browser = await chromium.launch({ headless: true });
const report = {};
for (const theme of ['light', 'dark']) {
  report[theme] = await audit(browser, theme);
}
await browser.close();

const lines = [];
for (const theme of ['light', 'dark']) {
  const rows = report[theme];
  const badTheme = rows.filter((row) => row.theme !== theme);
  const crashed = rows.filter((row) => row.pageErrors.length || row.status >= 400 || row.textLength < 40);
  const overflow = rows.filter((row) => row.overflow > 8);
  const contrast = rows.filter((row) => row.contrast.length);
  lines.push(`\n## ${theme}`);
  lines.push(`pages ${rows.length}, theme mismatches ${badTheme.length}, crashes ${crashed.length}, overflow ${overflow.length}, contrast ${contrast.length}`);
  badTheme.forEach((row) => lines.push(`THEME ${row.path} got ${row.theme || 'none'}`));
  crashed.forEach((row) => lines.push(`FAIL ${row.path} status=${row.status} text=${row.textLength} ${row.pageErrors.join(' | ')}`));
  overflow.forEach((row) => lines.push(`OVERFLOW ${row.path} +${row.overflow}px`));
  contrast.forEach((row) => {
    lines.push(`CONTRAST ${row.path}`);
    row.contrast.forEach((issue) => {
      lines.push(`  ${issue.contrast}:1 < ${issue.minimum} ${issue.tag} "${issue.text}"`);
    });
  });
  rows
    .filter((row) => row.consoleErrors.length)
    .forEach((row) => lines.push(`CONSOLE ${row.path} ${row.consoleErrors.join(' | ')}`));
}

console.log(lines.join('\n'));
