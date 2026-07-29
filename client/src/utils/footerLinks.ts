import { resolveBusinessLink } from './businessNavLinks';

/** Legacy ESG hash targets mapped to current section ids */
const ESG_HASH_ALIASES: Record<string, string> = {
  'refex-esg': 'esg-vision',
};

/** Canonical footer targets — link labels unchanged, routes always correct */
export const FOOTER_INVESTOR_LINKS: Record<string, string> = {
  'Financial Results': '/investors/financial-information',
  'Annual Reports': '/investors/annual-reports',
  'Notice of Board Meetings': '/investors/general-meeting-updates',
  Policies: '/investors/policies',
  'Credit Ratings': '/investors/credit-ratings',
  'Investor Information': '/investors/investor-information',
  'Newspaper Publication': '/investors/newspaper-publication',
};

/** Footer order on refex.co.in/investors */
export const FOOTER_INVESTOR_LINKS_ORDER = [
  'Financial Results',
  'Annual Reports',
  'Notice of Board Meetings',
  'Policies',
  'Credit Ratings',
  'Investor Information',
  'Newspaper Publication',
] as const;

const INVESTOR_FOOTER_SLUGS = new Set(
  Object.values(FOOTER_INVESTOR_LINKS).map((href) => href.replace(/^\/investors\//, '')),
);

/** Legacy CMS / production slug aliases */
const INVESTOR_SLUG_ALIASES: Record<string, string> = {
  'financial-results': 'financial-information',
  'financial-information': 'financial-information',
  'notice-of-board-meetings': 'general-meeting-updates',
  'board-meetings': 'general-meeting-updates',
  'general-meeting-updates': 'general-meeting-updates',
  policies: 'policies',
  'credit-ratings': 'credit-ratings',
  'investor-information': 'investor-information',
  'newspaper-publication': 'newspaper-publication',
  'annual-reports': 'annual-reports',
};

export function isInvestorsFooterSection(title: string): boolean {
  const normalized = (title || '').trim().toLowerCase();
  return normalized === 'investors' || normalized === 'investor' || normalized === 'investor relations';
}

export function getFooterInvestorLinks(): FooterLinkLike[] {
  return FOOTER_INVESTOR_LINKS_ORDER.map((name) => ({
    name,
    href: FOOTER_INVESTOR_LINKS[name],
  }));
}

function resolveInvestorFooterSlug(href: string): string | null {
  const internal = stripToInternalPath(href || '');
  const match = internal.match(/\/investors\/([^/?#]+)/i);
  if (!match) return null;

  const slug = match[1].replace(/\/+$/, '').toLowerCase();
  const canonical = INVESTOR_SLUG_ALIASES[slug] || slug;
  return INVESTOR_FOOTER_SLUGS.has(canonical) ? canonical : null;
}

export const FOOTER_SUSTAINABILITY_LINKS: Record<string, string> = {
  'Refex on ESG': '/esg#refex-esg',
  'ESG Policies': '/esg#esg-policies',
};

export function resolveEsgSectionHash(hash: string): string {
  return ESG_HASH_ALIASES[hash] || hash;
}

function resolveHashAlias(path: string, hash: string): string {
  if (!hash) return hash;
  if (path.replace(/\/+$/, '') === '/esg') {
    return resolveEsgSectionHash(hash);
  }
  return hash;
}

function stripToInternalPath(href: string): string {
  const trimmed = (href || '').trim();
  if (!/^https?:\/\//i.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./i, '');
    const allowedHosts = new Set(['refex.co.in']);
    if (typeof window !== 'undefined') {
      allowedHosts.add(window.location.hostname.replace(/^www\./i, ''));
    }
    if (allowedHosts.has(host)) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    /* ignore malformed URLs */
  }

  return trimmed;
}

/** Pick the canonical route for known footer labels (Investors / Sustainability). */
export function resolveFooterLinkHref(name: string, href?: string | null): string {
  const trimmedName = (name || '').trim();
  const canonicalByName =
    FOOTER_INVESTOR_LINKS[trimmedName] ?? FOOTER_SUSTAINABILITY_LINKS[trimmedName];

  if (canonicalByName) {
    return normalizeFooterHref(canonicalByName, trimmedName);
  }

  const slug = href ? resolveInvestorFooterSlug(href) : null;
  if (slug) {
    return normalizeFooterHref(`/investors/${slug}`, trimmedName);
  }

  const canonical = stripToInternalPath(href || '');
  return normalizeFooterHref(canonical, trimmedName);
}

/** Normalize footer / nav hrefs for React Router (no trailing slash on internal paths). */
export function normalizeFooterHref(href: string, linkName?: string): string {
  const trimmed = stripToInternalPath(href || '').trim();
  if (
    !trimmed ||
    /^https?:\/\//i.test(trimmed) ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }

  const isInvestorPath = /\/investors\//i.test(trimmed);
  const resolved =
    linkName && !isInvestorPath ? resolveBusinessLink(linkName, trimmed) : trimmed;

  const hashIndex = resolved.indexOf('#');
  const pathPart = hashIndex >= 0 ? resolved.slice(0, hashIndex) : resolved;
  let hash = hashIndex >= 0 ? resolved.slice(hashIndex + 1) : '';

  let path = pathPart.replace(/\/+$/, '') || '/';
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  hash = resolveHashAlias(path, hash);

  return hash ? `${path}#${hash}` : path;
}

export function isExternalFooterHref(href: string): boolean {
  const trimmed = (href || '').trim();
  return (
    /^https?:\/\//i.test(trimmed) ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  );
}

export function parseFooterHref(
  href: string,
  linkName?: string,
): {
  path: string;
  hash: string;
  isExternal: boolean;
} {
  const normalized = normalizeFooterHref(href, linkName);
  if (isExternalFooterHref(normalized)) {
    return { path: normalized, hash: '', isExternal: true };
  }

  const hashIndex = normalized.indexOf('#');
  const pathPart = hashIndex >= 0 ? normalized.slice(0, hashIndex) : normalized;
  const hash = hashIndex >= 0 ? normalized.slice(hashIndex + 1) : '';

  return {
    path: pathPart.replace(/\/+$/, '') || '/',
    hash,
    isExternal: false,
  };
}

export type FooterLinkLike = { name: string; href: string; target?: string };

export function normalizeFooterLink<T extends FooterLinkLike>(link: T): T {
  return {
    ...link,
    href: resolveFooterLinkHref(link.name, link.href),
  };
}

/** Apply canonical hrefs while preserving CMS link order and labels. */
export function mergeFooterSectionLinks<T extends FooterLinkLike>(
  links: T[],
  canonicalByName: Record<string, string>,
): T[] {
  if (!links?.length) {
    return Object.entries(canonicalByName).map(([name, href]) =>
      normalizeFooterLink({ name, href } as T),
    );
  }

  return links.map((link) => {
    const canonical = canonicalByName[link.name];
    return normalizeFooterLink({
      ...link,
      href: canonical ?? link.href,
    });
  });
}
