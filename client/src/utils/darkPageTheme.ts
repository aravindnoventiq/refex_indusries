export type DarkPageTheme = 'dark' | 'light';
export type SiteTheme = DarkPageTheme;

/** Single site-wide theme preference */
export const SITE_THEME_STORAGE_KEY = 'refex-site-theme';

/** @deprecated Page-scoped keys — migrated to SITE_THEME_STORAGE_KEY */
export const DARK_PAGE_THEME_STORAGE_KEYS = {
  'about-us': 'refex-about-us-theme',
  'ash-utilization': 'refex-ash-utilization-theme',
} as const;

export type DarkPageThemePage = keyof typeof DARK_PAGE_THEME_STORAGE_KEYS;

export function readSiteTheme(): SiteTheme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(SITE_THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;

  const legacyAbout = window.localStorage.getItem(DARK_PAGE_THEME_STORAGE_KEYS['about-us']);
  const legacyAsh = window.localStorage.getItem(DARK_PAGE_THEME_STORAGE_KEYS['ash-utilization']);
  if (legacyAbout === 'light' || legacyAsh === 'light') return 'light';
  if (legacyAbout === 'dark' || legacyAsh === 'dark') return 'dark';

  return 'light';
}

export function persistSiteTheme(theme: SiteTheme) {
  window.localStorage.setItem(SITE_THEME_STORAGE_KEY, theme);
}

/** @deprecated Use readSiteTheme */
export function readStoredTheme(_page?: DarkPageThemePage): DarkPageTheme {
  return readSiteTheme();
}

/** @deprecated Use persistSiteTheme */
export function persistTheme(_page: DarkPageThemePage, theme: DarkPageTheme) {
  persistSiteTheme(theme);
}

/** Typography tokens — dark matches homeVideoText; light matches investors sage palette */
export const darkPageText = {
  dark: {
    label:
      'inline-block text-[10px] font-semibold uppercase tracking-[0.3em] text-[#7cd144] sm:text-[11px] sm:tracking-[0.32em]',
    title:
      'font-bold tracking-[-0.02em] leading-[1.12] text-white [text-shadow:0_1px_18px_rgba(0,0,0,0.45)] ' +
      'text-[1.65rem] sm:text-[2.15rem] md:text-[2.65rem] lg:text-[3rem]',
    titleLg:
      'font-bold tracking-[-0.03em] leading-[1.1] text-white ' +
      '[text-shadow:0_2px_32px_rgba(0,0,0,0.95),0_1px_3px_rgba(0,0,0,0.85),0_0_1px_rgba(0,0,0,1)] ' +
      'text-[1.65rem] sm:text-[2.2rem] md:text-[2.65rem] lg:text-[3rem]',
    cardTitle:
      'font-bold tracking-[-0.015em] leading-snug text-white text-lg sm:text-xl lg:text-[1.35rem]',
    body:
      'leading-relaxed text-white/80 [text-shadow:0_1px_10px_rgba(0,0,0,0.35)] text-[0.9375rem] sm:text-base',
    bodySm: 'leading-relaxed text-white/70 text-sm sm:text-[0.9375rem]',
    meta: 'font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 sm:text-[11px]',
    link: 'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7cd244] transition-all duration-300 hover:gap-3',
  },
  light: {
    label:
      'inline-block text-[10px] font-semibold uppercase tracking-[0.3em] text-[#4C8C2B] sm:text-[11px] sm:tracking-[0.32em]',
    title:
      'font-bold tracking-[-0.02em] leading-[1.12] text-[#1f1f1f] ' +
      'text-[1.65rem] sm:text-[2.15rem] md:text-[2.65rem] lg:text-[3rem]',
    titleLg:
      'font-bold tracking-[-0.03em] leading-[1.1] text-[#1f1f1f] ' +
      'text-[1.65rem] sm:text-[2.2rem] md:text-[2.65rem] lg:text-[3rem]',
    cardTitle:
      'font-bold tracking-[-0.015em] leading-snug text-[#1f1f1f] text-lg sm:text-xl lg:text-[1.35rem]',
    body: 'leading-relaxed text-[#484848] text-[0.9375rem] sm:text-base',
    bodySm: 'leading-relaxed text-[#5a5a5a] text-sm sm:text-[0.9375rem]',
    meta: 'font-mono text-[10px] uppercase tracking-[0.2em] text-[#6b7a63] sm:text-[11px]',
    link: 'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#2d5016] transition-all duration-300 hover:gap-3 hover:text-[#4C8C2B]',
  },
} as const;

export const darkPageSurface = {
  dark: 'border border-white/10 bg-white/[0.04]',
  light: 'border border-[#dfe9d8] bg-[#f3f7ef]',
} as const;

export const darkPageSurfaceStrong = {
  dark: 'border border-white/15 bg-white/[0.07] backdrop-blur-md',
  light: 'border border-[#cfdccb] bg-white shadow-sm',
} as const;

export const darkPageCard = {
  dark: 'overflow-hidden rounded-2xl border border-white/10 bg-[#05070a] shadow-[0_30px_80px_-24px_rgba(0,0,0,0.6)]',
  light: 'overflow-hidden rounded-2xl border border-[#dfe9d8] bg-white shadow-[0_12px_40px_rgba(45,80,22,0.08)]',
} as const;

export const darkPageImageCard = {
  dark:
    'group overflow-hidden rounded-xl border border-white/16 bg-[#0a0e0c]/78 shadow-none transition-colors duration-300 hover:border-white/28 hover:bg-[#0a0e0c]/88',
  light:
    'group overflow-hidden rounded-xl border border-[#dfe9d8] bg-white shadow-[0_8px_28px_rgba(45,80,22,0.06)] transition-colors duration-300 hover:border-[#4C8C2B]/35 hover:shadow-[0_12px_36px_rgba(45,80,22,0.1)]',
} as const;

export const darkPageDivider = {
  dark: 'border-b border-white/10',
  light: 'border-b border-[#dfe9d8]',
} as const;

export const darkPageModal = {
  dark: 'relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e0c] shadow-2xl',
  light:
    'relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-[#dfe9d8] bg-white shadow-2xl',
} as const;

export const darkPageModalClose = {
  dark: 'flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-xl text-white transition hover:bg-white/20',
  light:
    'flex h-9 w-9 items-center justify-center rounded-lg bg-[#f3f7ef] text-xl text-[#1f1f1f] transition hover:bg-[#eef5e8]',
} as const;

export const darkPageSpinner = {
  dark: 'animate-spin rounded-full border-2 border-white/20 border-t-[#7cd144]',
  light: 'animate-spin rounded-full border-2 border-[#dfe7da] border-t-[#4C8C2B]',
} as const;

export const darkPageLeadBox = {
  dark:
    'rounded-lg border border-white/10 bg-white/[0.04] px-4 py-4 text-base font-medium leading-[1.75] text-white/90 sm:px-5 sm:py-5 sm:text-[17px] md:text-lg md:leading-[1.8]',
  light:
    'rounded-lg border border-[#dfe9d8] bg-white px-4 py-4 text-base font-medium leading-[1.75] text-[#1f1f1f] sm:px-5 sm:py-5 sm:text-[17px] md:text-lg md:leading-[1.8]',
} as const;

export const darkPageHighlight = {
  dark:
    'rounded-r-lg border-l-[3px] border-[#7cd244] bg-[#7cd244]/[0.06] px-4 py-3.5 text-sm font-medium leading-[1.75] text-white/85 sm:px-5 sm:py-4 sm:text-[15px] md:text-base md:leading-[1.8]',
  light:
    'rounded-r-lg border-l-[3px] border-[#4C8C2B] bg-[#eef5e8] px-4 py-3.5 text-sm font-medium leading-[1.75] text-[#1f1f1f] sm:px-5 sm:py-4 sm:text-[15px] md:text-base md:leading-[1.8]',
} as const;

export const darkPageAccentRule = {
  dark: 'h-px w-12 bg-[#7cd144]',
  light: 'h-px w-12 bg-[#4C8C2B]',
} as const;

export const darkPageTabActive = {
  dark: 'border-white/25 bg-white/[0.08]',
  light: 'border-[#4C8C2B]/40 bg-[#eef5e8]',
} as const;

export const darkPageTabInactive = {
  dark: 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]',
  light: 'border-[#dfe9d8] bg-white hover:border-[#4C8C2B]/30 hover:bg-[#f3f7ef]',
} as const;

export const darkPagePanel = {
  dark: 'overflow-hidden rounded-xl border border-white/12 bg-white/[0.04] backdrop-blur-md',
  light: 'overflow-hidden rounded-xl border border-[#dfe9d8] bg-white shadow-sm',
} as const;

export const darkPageBorderTop = {
  dark: 'border-t border-white/10',
  light: 'border-t border-[#dfe9d8]',
} as const;

export const darkPageBorderBottom = {
  dark: 'border-b border-white/10',
  light: 'border-b border-[#dfe9d8]',
} as const;

export const darkPageListDivide = {
  dark: 'divide-y divide-white/[0.06]',
  light: 'divide-y divide-[#dfe9d8]',
} as const;

export const darkPageCategoryMuted = {
  dark: 'text-white/40',
  light: 'text-[#6b7a63]',
} as const;

export const darkPageModalOverlay = {
  dark: 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm',
  light: 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm',
} as const;

export const darkPageDirectorshipPanel = {
  dark: 'overflow-hidden rounded-xl border border-white/10',
  light: 'overflow-hidden rounded-xl border border-[#dfe9d8]',
} as const;

export const darkPageDirectorshipBody = {
  dark: 'bg-white/[0.04] px-5 py-4',
  light: 'bg-[#f3f7ef] px-5 py-4',
} as const;

export function getDarkPageClasses(theme: DarkPageTheme) {
  return {
    text: darkPageText[theme],
    surface: darkPageSurface[theme],
    surfaceStrong: darkPageSurfaceStrong[theme],
    card: darkPageCard[theme],
    imageCard: darkPageImageCard[theme],
    divider: darkPageDivider[theme],
    modal: darkPageModal[theme],
    modalClose: darkPageModalClose[theme],
    spinner: darkPageSpinner[theme],
    leadBox: darkPageLeadBox[theme],
    highlight: darkPageHighlight[theme],
    accentRule: darkPageAccentRule[theme],
    tabActive: darkPageTabActive[theme],
    tabInactive: darkPageTabInactive[theme],
    panel: darkPagePanel[theme],
    borderTop: darkPageBorderTop[theme],
    borderBottom: darkPageBorderBottom[theme],
    listDivide: darkPageListDivide[theme],
    categoryMuted: darkPageCategoryMuted[theme],
    modalOverlay: darkPageModalOverlay[theme],
    directorshipPanel: darkPageDirectorshipPanel[theme],
    directorshipBody: darkPageDirectorshipBody[theme],
  };
}
