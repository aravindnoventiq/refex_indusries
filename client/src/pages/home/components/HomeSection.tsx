import type { ReactNode } from 'react';
import { useSiteTheme } from '../../../components/SiteThemeProvider';
import { resolveMediaUrl } from '../../../utils/resolveMediaUrl';

/**
 * Shared home typography — Terminal-style hierarchy over the scroll video.
 * Sizes stay readable on mobile without overpowering long headlines.
 */
export const homeVideoText = {
  label:
    'inline-block text-xs font-semibold uppercase tracking-[0.22em] text-[#7cd144] sm:text-sm sm:tracking-[0.24em]',
  title:
    'font-bold tracking-[-0.02em] leading-[1.12] text-white [text-shadow:0_1px_18px_rgba(0,0,0,0.45)] ' +
    'text-[2.15rem] sm:text-[2.85rem] md:text-[3.4rem] lg:text-[3.9rem]',
  titleLg:
    'font-bold tracking-[-0.03em] leading-[1.08] text-white ' +
    '[text-shadow:0_2px_32px_rgba(0,0,0,0.95),0_1px_3px_rgba(0,0,0,0.85),0_0_1px_rgba(0,0,0,1)] ' +
    'text-[2.15rem] sm:text-[2.9rem] md:text-[3.4rem] lg:text-[3.9rem]',
  heroHeadlineMuted: 'text-white/95',
  heroBody:
    'leading-relaxed text-white/90 [text-shadow:0_1px_16px_rgba(0,0,0,0.9),0_1px_2px_rgba(0,0,0,0.8)] text-[0.875rem] sm:text-base',
  cardTitle:
    'font-bold tracking-[-0.015em] leading-snug text-white text-base sm:text-xl lg:text-[1.35rem]',
  body: 'leading-relaxed text-white/80 [text-shadow:0_1px_10px_rgba(0,0,0,0.35)] text-[0.9375rem] sm:text-base',
  bodySm: 'leading-relaxed text-white/70 text-sm sm:text-[0.9375rem]',
  meta: 'font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 sm:text-[11px]',
  link: 'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7cd244] transition-all duration-300 hover:gap-3',
  divider: 'border-white/15',
} as const;

/** Brighter typography for sections after the hero video finishes scrubbing */
export const homeContentText = {
  label:
    'inline-block text-xs font-semibold uppercase tracking-[0.22em] text-[#8ee04f] sm:text-sm sm:tracking-[0.24em] [text-shadow:0_0_18px_rgba(124,210,68,0.4)]',
  title:
    'font-bold tracking-[-0.02em] leading-[1.12] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.7),0_0_1px_rgba(255,255,255,0.2)] ' +
    'text-[2.15rem] sm:text-[2.85rem] md:text-[3.4rem] lg:text-[3.9rem]',
  cardTitle:
    'font-bold tracking-[-0.015em] leading-snug text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.55)] text-[0.9375rem] sm:text-xl lg:text-[1.35rem]',
  body:
    'leading-relaxed text-white/95 [text-shadow:0_1px_10px_rgba(0,0,0,0.55)] text-[0.9375rem] sm:text-base',
  bodySm: 'leading-relaxed text-white/88 [text-shadow:0_1px_8px_rgba(0,0,0,0.45)] text-sm sm:text-[0.9375rem]',
  meta: 'font-mono text-[10px] uppercase tracking-[0.2em] text-white/72 sm:text-[11px]',
  link: 'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8ee04f] transition-all duration-300 hover:gap-3 hover:text-[#9ef05a]',
  statValue:
    'mb-2 font-bold tracking-[-0.03em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.65),0_0_1px_rgba(255,255,255,0.15)] text-3xl sm:text-5xl lg:text-[3.5rem]',
} as const;

/** Post-hero typography for light site theme */
export const homeContentTextLight = {
  label:
    'inline-block text-xs font-semibold uppercase tracking-[0.22em] text-[#4C8C2B] sm:text-sm sm:tracking-[0.24em]',
  title:
    'font-bold tracking-[-0.02em] leading-[1.12] text-[#1f1f1f] ' +
    'text-[2.15rem] sm:text-[2.85rem] md:text-[3.4rem] lg:text-[3.9rem]',
  cardTitle:
    'font-bold tracking-[-0.015em] leading-snug text-[#1f1f1f] text-[0.9375rem] sm:text-xl lg:text-[1.35rem]',
  body: 'leading-relaxed text-[#484848] text-[0.9375rem] sm:text-base',
  bodySm: 'leading-relaxed text-[#5a5a5a] text-sm sm:text-[0.9375rem]',
  meta: 'font-mono text-[10px] uppercase tracking-[0.2em] text-[#6b7a63] sm:text-[11px]',
  link: 'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#2d5016] transition-all duration-300 hover:gap-3 hover:text-[#4C8C2B]',
  statValue:
    'mb-2 font-bold tracking-[-0.03em] text-[#1f1f1f] text-3xl sm:text-5xl lg:text-[3.5rem]',
} as const;

const HOME_MOBILE_CARD_LIGHT =
  'rounded-xl border border-[#dfe9d8] bg-white px-4 py-3.5 shadow-[0_8px_28px_rgba(45,80,22,0.06)] sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none';

const HOME_IMAGE_CARD_LIGHT =
  'group overflow-hidden rounded-xl border border-[#dfe9d8] bg-white shadow-[0_8px_28px_rgba(45,80,22,0.06)] transition-colors duration-300 hover:border-[#4C8C2B]/35 hover:shadow-[0_12px_36px_rgba(45,80,22,0.1)]';

/** Theme-aware tokens for home sections below the hero */
export function useHomeTheme() {
  const { theme } = useSiteTheme();
  const isLight = theme === 'light';

  return {
    theme,
    isLight,
    text: isLight ? homeContentTextLight : homeContentText,
    mobileCard: isLight ? HOME_MOBILE_CARD_LIGHT : homeMobileCard,
    imageCard: isLight ? HOME_IMAGE_CARD_LIGHT : homeImageCard,
    imageCardMobile: isLight ? 'max-md:rounded-lg max-md:border-[#dfe9d8]' : homeImageCardMobile,
    hairline: isLight ? 'border-[#dfe9d8]' : 'border-white/10',
    businessRule: isLight
      ? 'sm:border-t sm:border-[#dfe9d8] hover:border-[#4C8C2B]/35 sm:hover:border-[#4C8C2B]/35'
      : 'sm:border-t sm:border-white/20 hover:border-white/40 sm:hover:border-white/40',
    awardImageBg: isLight ? 'bg-[#f3f7ef]' : 'bg-black/30',
    cardTitleHover: isLight
      ? 'group-hover/title:text-[#4C8C2B] group-focus-within/title:text-[#4C8C2B]'
      : 'group-hover/title:text-[#8ee04f] group-focus-within/title:text-[#8ee04f]',
    newsTitle: isLight
      ? 'text-[#1f1f1f] transition-colors group-hover:text-[#4C8C2B]'
      : 'text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.5)] transition-colors group-hover:text-[#8ee04f]',
    spinner: isLight
      ? 'h-8 w-8 animate-spin rounded-full border-2 border-[#dfe7da] border-t-[#4C8C2B]'
      : 'h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#7cd144]',
  };
}

export const homeSectionPad = 'py-8 sm:py-14 lg:py-20 xl:py-24';
export const homeSectionPadAfterHero = 'pt-6 pb-8 sm:pt-10 sm:pb-14 lg:pt-12 lg:pb-20';
export const homeSectionPadCompact = 'py-5 sm:py-8 lg:py-10';
export const homeContainer = 'mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8';

/** Card body — always expanded on mobile; hover/focus on desktop */
export const homeExpandableBody =
  'grid transition-[grid-template-rows,opacity] duration-300 ease-out ' +
  'grid-rows-[0fr] opacity-0 max-md:grid-rows-[1fr] max-md:opacity-100 ' +
  'group-hover:grid-rows-[1fr] group-hover:opacity-100 ' +
  'group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100';

/** Card body nested under a title group (FlipCards) */
export const homeExpandableBodyNested =
  'grid transition-[grid-template-rows,opacity] duration-300 ease-out ' +
  'grid-rows-[0fr] opacity-0 max-md:grid-rows-[1fr] max-md:opacity-100 ' +
  'group-hover/title:grid-rows-[1fr] group-hover/title:opacity-100 ' +
  'group-focus-within/title:grid-rows-[1fr] group-focus-within/title:opacity-100';

/** Scroll-reveal cards — visible immediately on mobile */
export const homeRevealCard = (revealed: boolean) =>
  `transition-[opacity,transform] duration-500 ease-out max-md:translate-y-0 max-md:opacity-100 ${
    revealed ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
  }`;

/** Card shell — compact on mobile, open layout on sm+ */
export const homeMobileCard =
  'rounded-xl border border-white/12 bg-[#0a0e0c]/75 px-4 py-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.28)] sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none';

/** Vertical card stacks on mobile */
export const homeMobileStack = 'flex flex-col gap-3 sm:grid sm:gap-8';

/** Horizontal snap row — news, awards, etc. on small screens */
export const homeMobileSnapRow =
  'home-mobile-snap-row -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:gap-6';

/** Snap card width — shows next-card peek on typical phones */
export const homeMobileSnapItem =
  'home-mobile-snap-item w-[252px] max-w-[78vw] shrink-0 snap-start sm:w-auto sm:max-w-none';

/** Compact image tile for news / awards on mobile */
export const homeImageCardMobile =
  'max-md:rounded-lg max-md:border-white/14';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/** Resolve CMS / upload image paths for home sections */
export function getHomeImageUrl(url?: string): string {
  return resolveMediaUrl(url, API_BASE_URL);
}

/** Dark glass tile for image media over the scroll video */
export const homeImageCard =
  'group overflow-hidden rounded-xl border border-white/16 bg-[#0a0e0c]/78 shadow-none transition-colors duration-300 hover:border-white/28 hover:bg-[#0a0e0c]/88';

interface HomeSectionProps {
  id?: string;
  label?: string;
  title?: string;
  subtitle?: string;
  headerAlign?: 'left' | 'center';
  headerExtra?: ReactNode;
  children: ReactNode;
  className?: string;
  afterHero?: boolean;
  compact?: boolean;
  /** Brighter text for content after hero video — default true */
  vibrant?: boolean;
  titleClassName?: string;
}

/** Section wrapper tuned for readability over the full-page video background */
export function HomeSection({
  id,
  label,
  title,
  subtitle,
  headerAlign = 'left',
  headerExtra,
  children,
  className = '',
  afterHero = false,
  compact = false,
  vibrant = true,
  titleClassName = '',
}: HomeSectionProps) {
  const { text: themedText } = useHomeTheme();
  const text = vibrant ? themedText : homeVideoText;
  const align = headerAlign === 'center' ? 'text-center mx-auto' : '';
  const labelOnly = Boolean(label) && !title && !subtitle && !headerExtra;
  const sectionPad = compact
    ? homeSectionPadCompact
    : afterHero
      ? homeSectionPadAfterHero
      : homeSectionPad;
  const headerGap = compact
    ? 'mb-4 sm:mb-6 lg:mb-7'
    : labelOnly
      ? 'mb-4 sm:mb-7'
      : 'mb-5 sm:mb-9 lg:mb-10';

  return (
    <section id={id} className={`relative ${sectionPad} ${className}`}>
      <div className={homeContainer}>
        {(label || title || subtitle || headerExtra) && (
          <header
            className={`flex flex-col gap-2.5 sm:gap-4 ${headerGap} ${
              headerExtra ? 'sm:flex-row sm:items-end sm:justify-between' : ''
            }`}
          >
            <div className={`max-w-3xl ${align}`}>
              {label && (
                <span className={`block ${text.label} mb-2.5 sm:mb-3`}>{label}</span>
              )}
              {title && (
                <h2 className={`${text.title} ${label ? 'mt-0' : ''} ${titleClassName}`}>{title}</h2>
              )}
              {subtitle && (
                <p
                  className={`mt-3 max-w-2xl sm:mt-4 ${text.body} ${
                    headerAlign === 'center' ? 'mx-auto' : ''
                  }`}
                >
                  {subtitle}
                </p>
              )}
            </div>
            {headerExtra}
          </header>
        )}

        <div className="relative">{children}</div>
      </div>
    </section>
  );
}

interface HomeLoadingProps {
  className?: string;
}

export function HomeLoading({ className = '' }: HomeLoadingProps) {
  const { spinner } = useHomeTheme();
  return (
    <section className={`${homeSectionPad} ${className}`}>
      <div className={homeContainer}>
        <div className={spinner} />
      </div>
    </section>
  );
}
