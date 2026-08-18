import type { SiteTheme } from './darkPageTheme';

const BRAND_LOGO_LIGHT = '/brand/logo-refex.svg';
const BRAND_LOGO_DARK = '/brand/logo-refex-header.svg';
const REMOTE_OFFICIAL_LOGO = 'https://refex.co.in/wp-content/uploads/2024/07/logo-refex.svg';

function isUsableCmsLogo(url: string): boolean {
  // Prefer local brand assets over missing CMS upload files (common on UAT).
  if (url.includes('/uploads/')) return false;
  if (url === REMOTE_OFFICIAL_LOGO) return false;
  if (url.includes('logo-refex.svg') || url.includes('logo-refex-header.svg')) return false;
  return true;
}

/** Logo for header bar — white mark on dark, green mark on light. */
export function getHeaderLogoUrl(theme: SiteTheme, cmsLogoUrl?: string | null): string {
  const brand = theme === 'dark' ? BRAND_LOGO_DARK : BRAND_LOGO_LIGHT;
  if (!cmsLogoUrl || !isUsableCmsLogo(cmsLogoUrl)) return brand;
  return cmsLogoUrl;
}

export function getBrandHeaderLogoUrl(theme: SiteTheme): string {
  return theme === 'dark' ? BRAND_LOGO_DARK : BRAND_LOGO_LIGHT;
}

export function getHeaderNavLinkClass(theme: SiteTheme, active: boolean, isLongLabel: boolean) {
  const size = isLongLabel
    ? 'max-w-[8.5rem] text-center text-[9px] leading-tight tracking-[0.08em] whitespace-normal xl:max-w-[9.5rem] xl:text-[10px]'
    : 'text-[11px] tracking-[0.12em] lg:text-[12px]';

  const color = active
    ? 'text-[#7cd244]'
    : theme === 'dark'
      ? 'text-white/85 hover:text-white'
      : 'text-[#2d5016]/88 hover:text-[#2d5016]';

  return `relative flex items-center gap-1 py-1.5 font-semibold uppercase transition-colors duration-300 cursor-pointer ${size} ${color}`;
}

export function getHeaderMobileLinkClass(theme: SiteTheme, active: boolean) {
  if (active) return 'text-[#7cd244]';
  return theme === 'dark'
    ? 'text-white/90 hover:text-[#7cd244]'
    : 'text-[#2d5016]/90 hover:text-[#7cd244]';
}

export function getHeaderMobileSubLinkClass(theme: SiteTheme) {
  return theme === 'dark'
    ? 'text-white/75 hover:text-[#7cd244]'
    : 'text-[#484848] hover:text-[#7cd244]';
}
