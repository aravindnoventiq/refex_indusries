/**
 * Collect /uploads/... paths referenced by live CMS APIs (UAT or local).
 * Usage: node scripts/collect_upload_refs.js https://uat.refex.co.in
 */
const base = process.argv[2] || 'https://uat.refex.co.in';

const endpoints = [
  '/api/cms/header',
  '/api/cms/footer',
  '/api/cms/home/slides',
  '/api/cms/home/offerings',
  '/api/cms/home/awards',
  '/api/cms/home/flip-cards',
  '/api/cms/home/news-items',
  '/api/cms/home/statistics',
  '/api/cms/about/presence',
  '/api/cms/about/hero',
  '/api/cms/esg/hero',
  '/api/cms/esg/sdg-section',
  '/api/cms/esg/programs',
  '/api/cms/esg/awards',
  '/api/cms/esg/reports',
  '/api/cms/esg/policies',
  '/api/cms/esg/refex-on-esg',
  '/api/cms/esg/sustainable-business',
  '/api/cms/ash-utilization/hero',
  '/api/cms/green-mobility/hero',
  '/api/cms/venwind-refex/hero',
  '/api/cms/newsroom/hero',
  '/api/cms/contact/hero',
  '/api/cms/investors/hero',
];

function walk(value, out) {
  if (value == null) return;
  if (typeof value === 'string') {
    const m = value.match(/\/uploads\/[^\s"'`]+/g);
    if (m) m.forEach((p) => out.add(p.split('?')[0]));
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v) => walk(v, out));
    return;
  }
  if (typeof value === 'object') {
    Object.values(value).forEach((v) => walk(v, out));
  }
}

(async () => {
  const refs = new Set();
  for (const ep of endpoints) {
    try {
      const res = await fetch(`${base}${ep}`);
      const json = await res.json();
      walk(json, refs);
      console.log(`${res.status} ${ep}`);
    } catch (e) {
      console.log(`FAIL ${ep} ${e.message}`);
    }
  }
  const list = [...refs].sort();
  console.log(`\nFound ${list.length} upload refs`);
  list.forEach((p) => console.log(p));
})();
