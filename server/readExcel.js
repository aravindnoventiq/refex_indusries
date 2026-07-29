const XLSX = require('xlsx');
const path = require('path');

function readLatestExcel() {
  const filePath = path.join(__dirname, 'downloads');

  const files = require('fs')
    .readdirSync(filePath)
    .filter(f => f.endsWith('.xls') || f.endsWith('.xlsx'));

  if (!files.length) return [];

  const latestFile = files.sort().pop();

  const workbook = XLSX.readFile(path.join(filePath, latestFile));
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  return XLSX.utils.sheet_to_json(sheet);
}

module.exports = readLatestExcel;
