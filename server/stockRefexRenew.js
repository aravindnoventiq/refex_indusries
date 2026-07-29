/**
 * REFEXRENEW is BSE-only. This module delegates to stockRefexRenewBse.
 */
const { getRefexRenewBseData } = require('./stockRefexRenewBse');

async function getRefexRenewData() {
  return getRefexRenewBseData();
}

module.exports = { getRefexRenewData };

if (require.main === module) {
  getRefexRenewData().then((r) => {
    console.log('\n📊 Result:', r.success ? 'SUCCESS' : 'FAILED');
    if (r.records) console.log(`📈 Records: ${r.records}`);
    if (r.error) console.log(`❌ Error: ${r.error}`);
  });
}
