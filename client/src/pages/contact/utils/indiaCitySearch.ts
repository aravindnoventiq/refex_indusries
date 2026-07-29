/**
 * Preferred order when the search box is empty (subset; only entries present in `all` are shown first).
 */
const TOP_INDIA_CITIES_ORDER = [
  'Mumbai, Maharashtra',
  'Delhi, Delhi',
  'Bengaluru, Karnataka',
  'Bangalore, Karnataka',
  'Hyderabad, Telangana',
  'Chennai, Tamil Nadu',
  'Kolkata, West Bengal',
  'Pune, Maharashtra',
  'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan',
  'Surat, Gujarat',
  'Lucknow, Uttar Pradesh',
  'Kanpur, Uttar Pradesh',
  'Nagpur, Maharashtra',
  'Indore, Madhya Pradesh',
  'Thane, Maharashtra',
  'Bhopal, Madhya Pradesh',
  'Visakhapatnam, Andhra Pradesh',
  'Patna, Bihar',
  'Vadodara, Gujarat',
];

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

function isSubsequence(haystack: string, needle: string): boolean {
  if (!needle) return true;
  let i = 0;
  for (let j = 0; j < haystack.length && i < needle.length; j += 1) {
    if (haystack[j] === needle[i]) i += 1;
  }
  return i === needle.length;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const row = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i += 1) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= n; j += 1) {
      const tmp = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = tmp;
    }
  }
  return row[n];
}

/**
 * When query is empty: top cities first (if present), then the rest alphabetically (capped).
 * When query is set: fuzzy-ranked matches (capped).
 */
export function rankIndiaCityOptions(all: string[], queryRaw: string, emptyCap = 400, searchCap = 80): string[] {
  const unique = Array.from(new Set(all.map((s) => s.trim()).filter(Boolean)));
  const q = normalize(queryRaw);

  if (!q) {
    const set = new Set(unique);
    const topFirst = TOP_INDIA_CITIES_ORDER.filter((c) => set.has(c));
    const rest = unique.filter((c) => !topFirst.includes(c)).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
    return [...topFirst, ...rest].slice(0, emptyCap);
  }

  const scored: { label: string; score: number }[] = [];
  for (const label of unique) {
    const norm = normalize(label);
    if (!norm.includes(q) && !isSubsequence(norm, q)) continue;

    let score = 0;
    if (norm.startsWith(q)) score += 120;
    else if (norm.includes(q)) score += 80;
    if (isSubsequence(norm, q)) score += 40;

    const window = norm.slice(0, Math.min(norm.length, q.length + 12));
    const dist = levenshtein(window, q);
    score -= Math.min(dist, 18);

    scored.push({ label, score });
  }

  scored.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }));
  return scored.slice(0, searchCap).map((s) => s.label);
}
