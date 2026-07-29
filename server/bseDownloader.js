const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function downloadBSEExcel() {
  const downloadPath = path.join(__dirname, 'downloads');
  if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath);

  const browser = await puppeteer.launch({
    headless: false, // 🔥 IMPORTANT (BSE blocks headless sometimes)
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.goto(
    'https://www.bseindia.com/markets/equity/EQReports/StockPrcHistori.aspx?expandable=7&scripcode=532884&flag=sp',
    { waitUntil: 'networkidle2', timeout: 60000 }
  );

  await page.waitForSelector('#ContentPlaceHolder1_txtFromDate');

  const fromDate = getOneYearAgo();
  const toDate = getToday();

  // Set date values
  await page.evaluate((from, to) => {
    document.querySelector('#ContentPlaceHolder1_txtFromDate').value = from;
    document.querySelector('#ContentPlaceHolder1_txtToDate').value = to;
  }, fromDate, toDate);

  // Submit
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#ContentPlaceHolder1_btnSubmit')
  ]);

  // 🔥 WAIT FOR DOWNLOAD EVENT
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 60000 }),
    page.click('#ContentPlaceHolder1_btnDownload')
  ]);

  const filePath = path.join(downloadPath, download.suggestedFilename());
  await download.saveAs(filePath);

  console.log('✅ Excel downloaded:', filePath);

  await browser.close();
}

function getToday() {
  return formatDate(new Date());
}

function getOneYearAgo() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return formatDate(d);
}

function formatDate(d) {
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

module.exports = downloadBSEExcel;
