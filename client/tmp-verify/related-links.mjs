import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const expected = [
  'Key Managerial Personnel',
  'Financial Information',
  'Annual Reports',
  'General Meeting Updates',
  'Investor Presentation',
  'Code of fair Disclosure UPSI',
  'Policies',
  'Credit Ratings',
  'Recording & Transcripts of Post Earnings / Quarterly Calls',
  'Disclosure of Material Events or Information',
  'Stock Exchange Quarterly Compliance',
  'Familiarization Programme for Independent Directors',
  'Terms and Conditions of Appointment of ID',
  'IPO',
  'Rights Issue',
  'Financial Statement of Subsidiary',
  'Annual Return',
  'Book Closure of Members Register / Record Date',
  'Secretarial Compliance Report',
  'Investor Information',
  'Registrar & Transfer Agent',
  'Newspaper Publication',
  'Unpaid Dividend List and IEPF Shares',
  'Disclosures under SAST Regulations 2011',
  'Employee Stock Option Scheme',
  'Monitoring Agency Report',
  'Statement of Deviation',
  'CSR Activities',
  'Charter Documents',
  'Scheme of Amalgamation / Arrangement',
];

const dir = path.dirname(fileURLToPath(import.meta.url));
await mkdir(dir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

async function closeModal() {
  await page.waitForTimeout(700);
  const close = page.getByLabel('Close modal');
  if (await close.isVisible().catch(() => false)) {
    await close.click();
    await page.waitForTimeout(300);
  }
}

await page.goto('http://localhost:3000/investors', { waitUntil: 'domcontentloaded', timeout: 60000 });
await closeModal();
await page.locator('#investor-compliance').waitFor({ timeout: 25000 });
await page.locator('#investor-compliance').scrollIntoViewIfNeeded();
await page.waitForSelector('#investor-compliance nav a', { timeout: 20000 });

const links = await page.$$eval('#investor-compliance nav a', (as) =>
  as.map((a) => ({ text: (a.textContent || '').trim(), href: a.getAttribute('href') || '' })),
);

const names = links.map((l) => l.text);
const missing = expected.filter((n) => !names.includes(n));
const extra = names.filter((n) => !expected.includes(n));

console.log(JSON.stringify({ count: links.length, missing, extra, links }, null, 2));
await page.screenshot({ path: path.join(dir, 'related-links.png'), fullPage: true });

const sample = [
  'Key Managerial Personnel',
  'Recording & Transcripts of Post Earnings / Quarterly Calls',
  'Familiarization Programme for Independent Directors',
  'Scheme of Amalgamation / Arrangement',
];

for (const name of sample) {
  const href = links.find((l) => l.text === name)?.href;
  if (!href) {
    console.log('CLICK_FAIL', name, 'missing href');
    continue;
  }
  const res = await page.goto(`http://localhost:3000${href}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await closeModal();
  const body = await page.locator('h1, h2').first().textContent().catch(() => '');
  console.log('CLICK', name, href, res?.status(), page.url(), (body || '').trim());
}

await browser.close();

if (missing.length || extra.length || links.length !== expected.length) {
  process.exit(1);
}
