export const CONTACT_HERO_BG = '/contact/hero-bg.png';

export const contactContainer = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';

export const contactSectionPad = 'py-14 sm:py-16 lg:py-20';

export const contactInputClass =
  'w-full rounded-xl border border-[#dfe7da] bg-white px-4 py-3 text-sm text-[#1f1f1f] outline-none transition-colors focus:border-[#4C8C2B] focus:ring-2 focus:ring-[#4C8C2B]/15';

export const contactLabelClass = 'mb-2 block text-sm font-medium text-[#2d5016]';

export const contactCardClass =
  'overflow-hidden rounded-[1.35rem] border border-[#e3ebe0] bg-white shadow-[0_12px_40px_rgba(45,80,22,0.08)]';

/** Registered office — Refex Towers, Nungambakkam */
export const REFEX_TOWERS_MAP_LABEL =
  'Refex Towers, Sterling Road, Nungambakkam, Chennai – 600034';

/** Google Maps embed centered on Refex Towers */
export const DEFAULT_REFEX_TOWERS_MAP_EMBED_URL =
  'https://maps.google.com/maps?q=Refex+Towers,+313+Sterling+Road,+Nungambakkam,+Chennai,+Tamil+Nadu+600034&hl=en&z=17&output=embed';

export function decodeContactMapEmbedUrl(url?: string | null): string {
  return (url || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

export function resolveContactMapEmbedUrl(url?: string | null): string {
  const decoded = decodeContactMapEmbedUrl(url);
  if (!decoded || !/^https?:\/\/.+(maps|google\.com)/i.test(decoded)) {
    return DEFAULT_REFEX_TOWERS_MAP_EMBED_URL;
  }
  return decoded;
}
