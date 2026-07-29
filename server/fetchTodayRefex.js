import { BSE } from 'nse-bse-api';
import fs from 'fs';
import path from 'path';

const BSE_SCRIP = '531260';
const DATA_FILE = 'refexrenew_bse_data.json';

const bse = new BSE({
  downloadFolder: './downloads',
  timeout: 15000
});

function parseBhavcopyCsv(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const out = [];

  const headers = lines[0].split(',');
  const scIdx = headers.findIndex(c => /scode/i.test(c));
  const closeIdx = headers.findIndex(c => /close/i.test(c));
  const dateIdx = headers.findIndex(c => /date/i.test(c));

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols[scIdx] === BSE_SCRIP) {
      out.push({
        date: cols[dateIdx],
        close: parseFloat(cols[closeIdx])
      });
      break;
    }
  }

  return out;
}

async function fetchToday() {
  const today = new Date();

  if (today.getDay() === 0 || today.getDay() === 6) {
    console.log('Weekend - no data');
    return;
  }

  const folder = path.resolve('./downloads');

  try {
    const filePath = await bse.bhavcopyReport(today, folder);
    const rows = parseBhavcopyCsv(filePath);

    if (!rows.length) {
      console.log('No data found');
      return;
    }

    let existing = [];
    if (fs.existsSync(DATA_FILE)) {
      existing = JSON.parse(fs.readFileSync(DATA_FILE));
    }

    const exists = existing.find(r => r.date === rows[0].date);
    if (!exists) {
      existing.unshift(rows[0]);
      fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));
      console.log('✅ Added today data');
    } else {
      console.log('Already exists');
    }

  } catch (err) {
    console.log('Error:', err.message);
  }
}

fetchToday();