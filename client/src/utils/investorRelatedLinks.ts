/** Live-site / CMS slugs that map to the dedicated local routes. */
const INVESTOR_SLUG_ALIASES: Record<string, string> = {
  'recording-transcripts-of-post-earnings-quarterly-calls': 'recording-transcripts',
  'familiarization-programme-for-independent-directors': 'familiarization-programme',
};

export function extractInvestorSlug(href: string): string {
  if (!href || !href.trim()) return '';
  const trimmed = href.trim();
  try {
    const path = /^https?:\/\//i.test(trimmed)
      ? new URL(trimmed).pathname
      : trimmed.split(/[?#]/)[0];
    const cleaned = path.replace(/\/+$/, '');
    const match = cleaned.match(/\/investors\/([^/]+)$/i) || cleaned.match(/\/investors\/([^/]+)/i);
    if (match) return match[1].toLowerCase();
    if (!cleaned.includes('/')) return cleaned.toLowerCase();
    return '';
  } catch {
    return '';
  }
}

export function canonicalInvestorSlug(slug: string): string {
  const value = slug.toLowerCase().replace(/\/+$/, '');
  return INVESTOR_SLUG_ALIASES[value] || value;
}

/** Turn CMS, live-site, or alias hrefs into a local `/investors/:slug` path. */
export function canonicalizeInvestorHref(href: string): string {
  const slug = canonicalInvestorSlug(extractInvestorSlug(href));
  if (!slug) return href?.trim() || '';
  return `/investors/${slug}`;
}

export function investorPathsMatch(currentPath: string, href: string): boolean {
  return canonicalizeInvestorHref(currentPath) === canonicalizeInvestorHref(href);
}

/**
 * Normalize investor section links so duplicates (CMS + fallback merge, or DB duplicates)
 * collapse to one entry per /investors/:slug target.
 */
export function normalizeInvestorLinkKey(href: string): string {
  if (!href || !href.trim()) return '';
  const slug = canonicalInvestorSlug(extractInvestorSlug(href));
  if (slug) return `investor:${slug}`;
  const trimmed = href.trim();
  try {
    if (/^https?:\/\//i.test(trimmed)) return `url:${trimmed.toLowerCase()}`;
    return `path:${trimmed.replace(/\/$/, '').toLowerCase()}`;
  } catch {
    return trimmed.toLowerCase();
  }
}

export function isSmartOdrHref(href: string): boolean {
  return normalizeInvestorLinkKey(href) === 'investor:smart-odr';
}

export function dedupeInvestorRelatedLinks<T extends { href: string; displayOrder?: number }>(
  links: T[],
): T[] {
  const sorted = [...links].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  const seen = new Set<string>();
  const out: T[] = [];
  for (const link of sorted) {
    const key = normalizeInvestorLinkKey(link.href);
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(link);
  }
  return out;
}
