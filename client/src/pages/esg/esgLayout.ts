/** Shared layout tokens for the ESG page */
export const esgContainer =
  'mx-auto w-full max-w-[90rem] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12';

export const esgSectionPad = 'py-14 sm:py-16 lg:py-20';

export const esgScrollMargin = 'scroll-mt-[calc(var(--header-offset,5.25rem)+0.75rem)]';

export const esgSectionTitle =
  'text-3xl font-semibold tracking-tight text-[#1f1f1f] sm:text-[2.125rem]';

export const esgSectionHeading =
  'text-3xl font-bold uppercase tracking-[0.06em] text-[#2b2b2b] sm:text-4xl lg:text-[2.35rem]';

export const esgSectionSubtitle = 'text-base leading-relaxed text-[#484848]';

export const esgBgWhite = 'bg-white';

export const esgBgLight = 'bg-[#f3f3f3]';

export const esgBgMuted = 'bg-[#ececec]';

export const esgBrandGreen = '#7DC244';

export const esgSectionDivider = 'border-t border-black/8';

export const esgCardBase =
  'overflow-hidden rounded-[1.35rem] border border-[#e3ebe0] bg-white shadow-[0_18px_50px_rgba(76,140,43,0.08)] transition-all duration-700 ease-out hover:-translate-y-1.5 hover:shadow-[0_26px_64px_rgba(76,140,43,0.14)]';

export const esgBrandColors = {
  green: '#4C8C2B',
  orange: '#F39200',
  blue: '#0072CE',
  darkGreen: '#2d5016',
} as const;

export type EsgAccentColor = keyof typeof esgBrandColors;

export function esgBadgeClasses(accent: EsgAccentColor, onDark = false): string {
  const color = esgBrandColors[accent];
  if (onDark) {
    return `inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur-sm`;
  }
  return `inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm`;
}

export function esgBadgeStyle(
  accent: EsgAccentColor,
  onDark = false,
): { borderColor?: string; backgroundColor?: string } {
  if (onDark) {
    return {};
  }
  const color = esgBrandColors[accent];
  return {
    borderColor: `${color}40`,
    backgroundColor: accent === 'green' ? '#f7faf5' : 'rgba(255,255,255,0.8)',
  };
}

export function esgBadgeTextStyle(
  accent: EsgAccentColor,
  onDark = false,
): { color: string } {
  if (onDark) {
    return { color: 'rgba(255,255,255,0.9)' };
  }
  return { color: esgBrandColors[accent] };
}
