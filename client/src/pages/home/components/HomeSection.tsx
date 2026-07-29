import type { ReactNode } from 'react';

/**
 * Shared home typography — Terminal-style hierarchy over the scroll video.
 * Sizes stay readable on mobile without overpowering long headlines.
 */
export const homeVideoText = {
  label:
    'inline-block text-[10px] font-semibold uppercase tracking-[0.3em] text-[#7cd144] sm:text-[11px] sm:tracking-[0.32em]',
  title:
    'font-bold tracking-[-0.02em] leading-[1.12] text-white [text-shadow:0_1px_18px_rgba(0,0,0,0.45)] ' +
    'text-[1.65rem] sm:text-[2.15rem] md:text-[2.65rem] lg:text-[3rem]',
  titleLg:
    'font-bold tracking-[-0.03em] leading-[1.1] text-white ' +
    '[text-shadow:0_2px_32px_rgba(0,0,0,0.95),0_1px_3px_rgba(0,0,0,0.85),0_0_1px_rgba(0,0,0,1)] ' +
    'text-[1.65rem] sm:text-[2.2rem] md:text-[2.65rem] lg:text-[3rem]',
  heroHeadlineMuted: 'text-white/95',
  heroBody:
    'leading-relaxed text-white/90 [text-shadow:0_1px_16px_rgba(0,0,0,0.9),0_1px_2px_rgba(0,0,0,0.8)] text-[0.9375rem] sm:text-base',
  cardTitle:
    'font-bold tracking-[-0.015em] leading-snug text-white text-lg sm:text-xl lg:text-[1.35rem]',
  body: 'leading-relaxed text-white/80 [text-shadow:0_1px_10px_rgba(0,0,0,0.35)] text-[0.9375rem] sm:text-base',
  bodySm: 'leading-relaxed text-white/70 text-sm sm:text-[0.9375rem]',
  meta: 'font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 sm:text-[11px]',
  link: 'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7cd244] transition-all duration-300 hover:gap-3',
  divider: 'border-white/15',
} as const;

/** Brighter typography for sections after the hero video finishes scrubbing */
export const homeContentText = {
  label:
    'inline-block text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8ee04f] sm:text-[11px] sm:tracking-[0.32em] [text-shadow:0_0_18px_rgba(124,210,68,0.4)]',
  title:
    'font-bold tracking-[-0.02em] leading-[1.12] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.7),0_0_1px_rgba(255,255,255,0.2)] ' +
    'text-[1.65rem] sm:text-[2.15rem] md:text-[2.65rem] lg:text-[3rem]',
  cardTitle:
    'font-bold tracking-[-0.015em] leading-snug text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.55)] text-lg sm:text-xl lg:text-[1.35rem]',
  body:
    'leading-relaxed text-white/95 [text-shadow:0_1px_10px_rgba(0,0,0,0.55)] text-[0.9375rem] sm:text-base',
  bodySm: 'leading-relaxed text-white/88 [text-shadow:0_1px_8px_rgba(0,0,0,0.45)] text-sm sm:text-[0.9375rem]',
  meta: 'font-mono text-[10px] uppercase tracking-[0.2em] text-white/72 sm:text-[11px]',
  link: 'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8ee04f] transition-all duration-300 hover:gap-3 hover:text-[#9ef05a]',
  statValue:
    'mb-2.5 font-bold tracking-[-0.03em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.65),0_0_1px_rgba(255,255,255,0.15)] text-4xl sm:text-5xl lg:text-[3.5rem]',
} as const;

export const homeSectionPad = 'py-10 sm:py-14 lg:py-20 xl:py-24';
export const homeSectionPadAfterHero = 'pt-8 pb-10 sm:pt-10 sm:pb-14 lg:pt-12 lg:pb-20';
export const homeSectionPadCompact = 'py-6 sm:py-8 lg:py-10';
export const homeContainer = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/** Resolve CMS / upload image paths for home sections */
export function getHomeImageUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}/${url}`;
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
}: HomeSectionProps) {
  const text = vibrant ? homeContentText : homeVideoText;
  const align = headerAlign === 'center' ? 'text-center mx-auto' : '';
  const labelOnly = Boolean(label) && !title && !subtitle && !headerExtra;
  const sectionPad = compact
    ? homeSectionPadCompact
    : afterHero
      ? homeSectionPadAfterHero
      : homeSectionPad;
  const headerGap = compact ? 'mb-4 sm:mb-6 lg:mb-7' : labelOnly ? 'mb-5 sm:mb-7' : 'mb-6 sm:mb-9 lg:mb-10';

  return (
    <section id={id} className={`relative ${sectionPad} ${className}`}>
      <div className={homeContainer}>
        {(label || title || subtitle || headerExtra) && (
          <header
            className={`flex flex-col gap-3 sm:gap-4 ${headerGap} ${
              headerExtra ? 'sm:flex-row sm:items-end sm:justify-between' : ''
            }`}
          >
            <div className={`max-w-3xl ${align}`}>
              {label && (
                <span className={`block ${text.label} mb-2.5 sm:mb-3`}>{label}</span>
              )}
              {title && (
                <h2 className={`${text.title} ${label ? 'mt-0' : ''}`}>{title}</h2>
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
  return (
    <section className={`${homeSectionPad} ${className}`}>
      <div className={homeContainer}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#7cd144]" />
      </div>
    </section>
  );
}
