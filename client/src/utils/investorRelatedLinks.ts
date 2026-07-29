/**
 * Normalize investor section links so duplicates (CMS + fallback merge, or DB duplicates)
 * collapse to one entry per /investors/:slug target.
 */
export function normalizeInvestorLinkKey(href: string): string {
  if (!href || !href.trim()) return '';
  const trimmed = href.trim();
  try {
    if (/^https?:\/\//i.test(trimmed)) {
      const u = new URL(trimmed);
      const path = u.pathname.replace(/\/$/, '');
      const m = path.match(/\/investors\/([^/]+)$/i);
      if (m) return `investor:${m[1].toLowerCase()}`;
      return `url:${trimmed.toLowerCase()}`;
    }
    const path = trimmed.replace(/\/$/, '');
    const m = path.match(/\/investors\/([^/]+)$/i) || path.match(/\/investors\/([^/]+)/i);
    if (m) return `investor:${m[1].toLowerCase()}`;
    return `path:${path.toLowerCase()}`;
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
