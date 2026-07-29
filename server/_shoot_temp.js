const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));

  try {
    await page.click('[aria-label="Close modal"]');
  } catch (e) {}
  await new Promise((r) => setTimeout(r, 300));

  // scroll to the "Our Businesses" section
  const found = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Our Businesses'));
    if (heading) {
      heading.scrollIntoView({ block: 'start' });
      return true;
    }
    return false;
  });
  await new Promise((r) => setTimeout(r, 3000));

  try {
    await page.click('[aria-label="Close modal"]');
  } catch (e) {}
  await new Promise((r) => setTimeout(r, 300));

  const outDir = 'C:/Users/ARAVIN~1/AppData/Local/Temp/claude/d--projects-Refex-Industries-Ltd/209066e7-92b4-4c5f-9696-ca2ec487ab71/scratchpad';
  await page.screenshot({ path: outDir + '/business-section.png', fullPage: false });

  const sectionEl = await page.evaluateHandle(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Our Businesses'));
    return heading.closest('section');
  });
  await sectionEl.asElement().screenshot({ path: outDir + '/business-section-full.png' });

  console.log('found heading:', found);
  await browser.close();
})();
