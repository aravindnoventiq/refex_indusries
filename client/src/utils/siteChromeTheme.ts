import type { SiteTheme } from './darkPageTheme';

/** Logo for header bar — white mark on dark, green mark on light. */
export function getHeaderLogoUrl(theme: SiteTheme, cmsLogoUrl?: string | null): string {
  const remoteOfficialLogo = 'https://refex.co.in/wp-content/uploads/2024/07/logo-refex.svg';
  const useBrandLogo =
    !cmsLogoUrl ||
    cmsLogoUrl === remoteOfficialLogo ||
    cmsLogoUrl.includes('logo-refex.svg') ||
    cmsLogoUrl.includes('logo-refex-header.svg');

  if (!useBrandLogo) return cmsLogoUrl;

  return theme === 'dark' ? '/brand/logo-refex-header.svg' : '/brand/logo-refex.svg';
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
