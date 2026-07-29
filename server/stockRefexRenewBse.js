import { BSE } from 'nse-bse-api';
import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import axios from 'axios';

const BSE_SCRIP = '531260'; // REFEXRENEW
const DATA_FILE = 'refexrenew_bse_data.json';

// Check for --today flag
// Usage: node stockRefexRenewBse.js          => Full 1-year download
//        node stockRefexRenewBse.js --today  => Today only, merge with existing
const todayOnly = process.argv.includes('--today');
console.log(`\n🔷 REFEXRENEW BSE Data Fetcher ${todayOnly ? '(Today Only)' : '(Full Year)'}\n`);

const bse = new BSE({
  downloadFolder: './downloads',
  timeout: 15000
});

function formatDateForBSE(date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function formatDateYYYYMMDD(date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${y}${m}${d}`;
}

function parseBseDate(str) {
  if (!str) return '';
  const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
  if (str.includes('-')) {
    const p = str.split('-');
    if (p.length === 3 && months[p[1]]) return `${p[2]}-${months[p[1]]}-${p[0].padStart(2, '0')}`;
  }
  if (str.includes('/')) {
    const [d, m, y] = str.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return str;
}

const bseHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.5',
  'Origin': 'https://www.bseindia.com',
  'Referer': 'https://www.bseindia.com/'
};

// Axios instance with insecureHTTPParser (handles BSE's malformed headers)
const bseClient = axios.create({
  timeout: 20000,
  headers: bseHeaders,
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  insecureHTTPParser: true
});

async function fetchViaStockPriceHist() {
  const to = new Date();
  const from = new Date(to.getFullYear() - 1, to.getMonth(), to.getDate());
  const url = 'https://api.bseindia.com/BseIndiaAPI/api/StockPriceHist/w';
  try {
    const { data } = await bseClient.get(url, {
      params: {
        scripcode: BSE_SCRIP,
        fromdate: formatDateForBSE(from),
        todate: formatDateForBSE(to)
      }
    });
    const arr = Array.isArray(data) ? data : (data && data.Table) ? data.Table : [];
    if (!arr.length) return null;
    return arr.map(item => ({
      date: parseBseDate(item.trd_date || item.Date || ''),
      symbol: 'REFEXRENEW',
      open: parseFloat(item.openprice || item.open || 0),
      high: parseFloat(item.highprice || item.high || 0),
      low: parseFloat(item.lowprice || item.low || 0),
      close: parseFloat(item.closeprice || item.close || 0),
      volume: parseInt(item.tottrdqty || item.volume || 0),
      tradeValue: parseFloat(item.tottrdval || item.tradeValue || 0),
      noOfTrades: parseInt(item.totaltrades || item.noOfTrades || 0),
      exchange: 'BSE'
    }));
  } catch (e) {
    console.warn('StockPriceHist failed:', e.message);
    return null;
  }
}

async function fetchViaStockPriceCSV() {
  const to = new Date();
  const from = new Date(to.getFullYear() - 1, to.getMonth(), to.getDate());
  const url = 'https://api.bseindia.com/BseIndiaAPI/api/StockPriceCSVDownload/w';
  try {
    const { data } = await bseClient.get(url, {
      params: {
        scripcode: BSE_SCRIP,
        fromdate: formatDateForBSE(from),
        todate: formatDateForBSE(to),
        segment: 'Equity',
        flag: '0'
      },
      responseType: 'text'
    });
    const txt = (data || '').trim();
    if (!txt) return null;
    const lines = txt.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return null;
    const h = lines[0].split(',').map(s => s.trim().replace(/"/g, ''));
    const out = [];
    for (let i = 1; i < lines.length; i++) {
      const v = lines[i].split(',').map(s => s.trim().replace(/"/g, ''));
      if (v.length < 8) continue;
      const row = {};
      h.forEach((k, j) => { row[k] = v[j]; });
      const date = parseBseDate(row['Date'] || row['DATE'] || '');
      if (!date) continue;
      out.push({
        date,
        symbol: 'REFEXRENEW',
        open: parseFloat(row['Open'] || row['OPEN'] || row['Open Price'] || 0),
        high: parseFloat(row['High'] || row['HIGH'] || row['High Price'] || 0),
        low: parseFloat(row['Low'] || row['LOW'] || row['Low Price'] || 0),
        close: parseFloat(row['Close'] || row['CLOSE'] || row['Close Price'] || 0),
        volume: parseInt(row['No.of Shares'] || row['Volume'] || row['No. of Shares'] || 0),
        tradeValue: parseFloat(row['Turnover'] || row['Turnover (Rs.)'] || row['TURNOVER'] || 0),
        noOfTrades: parseInt(row['No. of Trades'] || row['Trades'] || 0),
        exchange: 'BSE'
      });
    }
    return out.length ? out : null;
  } catch (e) {
    console.warn('StockPriceCSV failed:', e.message);
    return null;
  }
}

function parseBhavcopyCsv(filePath) {
  const out = [];
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return out;
  const h = lines[0].split(',').map(s => s.trim().replace(/"/g, ''));
  const scIdx = h.findIndex(c => /fininstrmid|sc_code|scode|code/i.test(c));
  const dateIdx = h.findIndex(c => /traddt|trad_dt|date/i.test(c));
  const openIdx = h.findIndex(c => /opnpric|^open$/i.test(c));
  const highIdx = h.findIndex(c => /hghpric|^high$/i.test(c));
  const lowIdx = h.findIndex(c => /lwpric|^low$/i.test(c));
  const closeIdx = h.findIndex(c => /clspric|^close$/i.test(c));
  const volIdx = h.findIndex(c => /ttltradgvol|no_of_shrs|volume|qty/i.test(c));
  const turnIdx = h.findIndex(c => /ttltrfval|net_turnov|turnover/i.test(c));
  const trdIdx = h.findIndex(c => /ttlnboftxsexctd|no_trades|trades/i.test(c));
  if (scIdx < 0 || closeIdx < 0) return out;
  for (let i = 1; i < lines.length; i++) {
    const v = lines[i].split(',').map(s => s.trim().replace(/"/g, ''));
    const code = String(v[scIdx] || '').trim();
    if (code !== BSE_SCRIP) continue;
    const rowDate = dateIdx >= 0 && v[dateIdx] ? String(v[dateIdx]).slice(0, 10) : '';
    if (!rowDate) continue;
    out.push({
      date: rowDate,
      symbol: 'REFEXRENEW',
      open: parseFloat(v[openIdx] || 0),
      high: parseFloat(v[highIdx] || 0),
      low: parseFloat(v[lowIdx] || 0),
      close: parseFloat(v[closeIdx] || 0),
      volume: parseInt(v[volIdx] || 0),
      tradeValue: parseFloat(v[turnIdx] || 0),
      noOfTrades: parseInt(v[trdIdx] || 0),
      exchange: 'BSE'
    });
    break;
  }
  return out;
}

async function fetchViaBhavcopy() {
  const folder = path.resolve('./downloads');
  const out = [];
  const seen = new Set();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const existing = fs.readdirSync(folder).filter(f => /^BhavCopy_BSE_CM_0_0_0_\d{8}_F_0000\.CSV$/i.test(f));
  for (const f of existing) {
    const rows = parseBhavcopyCsv(path.join(folder, f));
    for (const r of rows) {
      if (r.date && !seen.has(r.date)) {
        seen.add(r.date);
        out.push(r);
      }
    }
  }

  await new Promise(r => setTimeout(r, 1500));
  const maxDays = 400;
  const maxTradingDays = 260;
  const delayMs = () => 1800 + Math.floor(Math.random() * 1200);
  const pauseEvery = 10;
  const pauseSec = 8;
  let downloaded = 0;
  let consecutiveFails = 0;
  console.log('  Filling up to 1 year of bhavcopy (downloading missing trading days, anti-block delays)...');
  for (let n = 0; n < maxDays && downloaded < maxTradingDays; n++) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    if (d < oneYearAgo) break;
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const yyyymmdd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (seen.has(yyyymmdd)) continue;
    try {
      const filePath = await bse.bhavcopyReport(d, folder);
      const rows = parseBhavcopyCsv(filePath);
      for (const r of rows) {
        if (r.date && !seen.has(r.date)) {
          seen.add(r.date);
          out.push(r);
        }
      }
      downloaded++;
      consecutiveFails = 0;
      if (downloaded % 20 === 0) console.log(`  Bhavcopy: downloaded ${downloaded} days...`);
      await new Promise(r => setTimeout(r, delayMs()));
      if (downloaded > 0 && downloaded % pauseEvery === 0) {
        console.log(`  Pausing ${pauseSec}s to avoid BSE block...`);
        await new Promise(r => setTimeout(r, pauseSec * 1000));
      }
    } catch (err) {
      consecutiveFails++;
      const msg = (err.message || '').toLowerCase();
      const isBlock = /429|403|block|rate|timeout|ECONNABORTED|refused/i.test(msg);
      if (isBlock && consecutiveFails <= 3) {
        const backoff = 25 + Math.floor(Math.random() * 20);
        console.warn(`  BSE block/rate-limit? Backing off ${backoff}s then retrying...`);
        await new Promise(r => setTimeout(r, backoff * 1000));
        n--;
        continue;
      }
      if (!msg.includes('404') && !msg.includes('unavailable')) {
        console.warn('  Bhavcopy', yyyymmdd, err.message);
      }
      await new Promise(r => setTimeout(r, delayMs()));
    }
  }

  if (!out.length) return null;
  out.sort((a, b) => new Date(b.date) - new Date(a.date));
  return out;
}

async function fetchBseHistorical() {
  let data = await fetchViaStockPriceHist();
  if (data && data.length) {
    console.log('✅ REFEXRENEW from StockPriceHist:', data.length, 'records');
    return data;
  }
  data = await fetchViaStockPriceCSV();
  if (data && data.length) {
    console.log('✅ REFEXRENEW from StockPriceCSV:', data.length, 'records');
    return data;
  }
  console.log('🔄 BSE APIs no data; trying bhavcopy...');
  data = await fetchViaBhavcopy();
  if (data && data.length) {
    console.log('✅ REFEXRENEW from bhavcopy:', data.length, 'records');
    return data;
  }
  return null;
}

// Load existing data from file
function loadExistingData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not load existing data:', e.message);
  }
  return [];
}

// Fetch today's data only (single bhavcopy download)
async function fetchTodayData() {
  const folder = path.resolve('./downloads');
  const today = new Date(); // Use actual current date
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Skip weekends
  if (today.getDay() === 0 || today.getDay() === 6) {
    console.log('Today is weekend, no trading data available.');
    return null;
  }

  console.log(`Fetching today's data (${todayStr})...`);
  
  try {
    const filePath = await bse.bhavcopyReport(today, folder);
    const rows = parseBhavcopyCsv(filePath);
    if (rows.length > 0) {
      console.log('✅ Today data fetched:', rows[0]);
      return rows[0];
    }
    console.log('No REFEXRENEW data in today bhavcopy.');
    return null;
  } catch (err) {
    // If 404, bhavcopy not yet published (usually after 6-7 PM IST)
    if (err.message?.includes('404')) {
      console.log(`Today's bhavcopy (${todayStr}) not yet available. BSE publishes after market close (~6-7 PM IST).`);
    } else {
      console.warn('Could not fetch today bhavcopy:', err.message);
    }
    return null;
  }
}

// Merge today's data with existing and save
function mergeAndSave(existingData, newRecord) {
  if (!newRecord) {
    console.log('No new data to add.');
    return existingData;
  }
  
  const seen = new Set(existingData.map(r => r.date));
  
  if (seen.has(newRecord.date)) {
    console.log(`Data for ${newRecord.date} already exists. No update needed.`);
    return existingData;
  }
  
  // Add new record at the beginning (most recent first)
  const merged = [newRecord, ...existingData];
  merged.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2));
  console.log(`✅ Added ${newRecord.date} data. Total: ${merged.length} records. Saved: ${DATA_FILE}`);
  
  return merged;
}

// --- run ---
const quote = await bse.quote(BSE_SCRIP);
console.log('BSE REFEXRENEW quote:', quote);

if (todayOnly) {
  // TODAY ONLY MODE: download today's data and merge with existing file
  console.log('\n📅 TODAY ONLY MODE');
  const existingData = loadExistingData();
  console.log(`Existing records: ${existingData.length}`);
  
  const todayData = await fetchTodayData();
  mergeAndSave(existingData, todayData);
} else {
  // FULL MODE: download 1 year of data
  console.log('\n📊 FULL MODE (1 year data)');
  const historical = await fetchBseHistorical();
  console.log('BSE REFEXRENEW historical:', historical ? `${historical.length} records` : 'no data');

  if (historical && historical.length) {
    console.log('Sample:', historical[0]);
    fs.writeFileSync(DATA_FILE, JSON.stringify(historical, null, 2));
    console.log('Saved:', DATA_FILE);
  } else {
    console.log('No data to save. Run again or check BSE.');
  }
}
