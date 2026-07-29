import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  HOME_HERO_CHAPTER_COUNT,
  HOME_HERO_ID,
  getHeroPinScrollPx,
  getHeroScrollScrub,
  prefersReducedMotion,
  shouldPinHomeHero,
} from '../homeMotion';
import { HOME_HERO_SENTINEL_ID, useHomeMobile } from '../homeMobile';
import { homeContainer, homeVideoText } from './HomeSection';

gsap.registerPlugin(ScrollTrigger);

export type HeroChapter = {
  brand: string | null;
  lines: string[];
  support?: string;
  cta?: boolean;
};

const CHAPTERS: HeroChapter[] = [
  {
    brand: 'Refex Industries Limited',
    lines: ['Where industrial progress', 'meets sustainable purpose.'],
    support:
      'From transforming industrial by-products into valuable resources to advancing clean mobility and renewable energy, Refex is building solutions for a more resilient tomorrow.',
    cta: true,
  },
  {
    brand: null,
    lines: ['A legacy of industrial excellence.', 'A future shaped by sustainable innovation.'],
  },
  {
    brand: null,
    lines: ['Discover the Refex ecosystem.'],
    support:
      'From circular economy solutions to clean mobility and renewable energy, explore the businesses shaping our sustainable future.',
  },
];

/**
 * Pinned scroll-scrubbed headline chapters — same GSAP experience on mobile & desktop.
 * Reduced motion: first chapter only, no pin.
 */
export default function TerminalHeroChapters() {
  const isMobile = useHomeMobile();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return;

    const chapters = chapterRefs.current.filter(Boolean) as HTMLDivElement[];
    if (chapters.length === 0) return;

    if (prefersReducedMotion()) {
      chapters.forEach((el, i) =>
        gsap.set(el, { opacity: i === 0 ? 1 : 0, visibility: i === 0 ? 'visible' : 'hidden' }),
      );
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(chapters, { opacity: 0, visibility: 'hidden', force3D: true });
      gsap.set(chapters[0], { opacity: 1, visibility: 'visible' });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${getHeroPinScrollPx()}`,
          pin: shouldPinHomeHero() ? pin : false,
          scrub: getHeroScrollScrub(),
          anticipatePin: 0,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 1; i < chapters.length; i++) {
        tl.set(chapters[i - 1], { opacity: 0, visibility: 'hidden' }, i).set(
          chapters[i],
          { opacity: 1, visibility: 'visible' },
          i,
        );
      }
      tl.to({}, { duration: 1 }, HOME_HERO_CHAPTER_COUNT);
    }, root);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [isMobile]);

  return (
    <div ref={rootRef} id={HOME_HERO_ID} className="home-hero-chapters relative">
      <div
        ref={pinRef}
        className="home-hero-pin relative flex min-h-[100svh] items-end pb-8 pt-[calc(var(--header-offset,4.25rem)+1rem)] sm:min-h-[100dvh] sm:pb-10 sm:pt-[calc(var(--header-offset,5.25rem)+1.5rem)] lg:pb-14"
      >
        <div className={`${homeContainer} relative w-full`}>
          <div className="home-hero-copy relative min-h-[14rem] w-full max-w-4xl sm:min-h-[16rem] lg:min-h-[20rem]">
            {CHAPTERS.map((chapter, i) => {
              const HeadlineTag = i === 0 ? 'h1' : 'p';

              return (
                <div
                  key={chapter.lines.join(' ')}
                  ref={(el) => {
                    chapterRefs.current[i] = el;
                  }}
                  className="home-hero-chapter absolute inset-x-0 bottom-0 max-w-4xl"
                  style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? 'visible' : 'hidden' }}
                  aria-hidden={i !== 0}
                >
                  {chapter.brand && (
                    <p className={`${homeVideoText.label} mb-3 sm:mb-4`}>{chapter.brand}</p>
                  )}

                  <HeadlineTag
                    className={`${homeVideoText.titleLg} home-mobile-hero-title max-w-[22ch] sm:max-w-[26ch]`}
                  >
                    {chapter.lines.map((line, lineIndex) => (
                      <span
                        key={line}
                        className={`block ${lineIndex > 0 ? homeVideoText.heroHeadlineMuted : ''}`}
                      >
                        {line}
                      </span>
                    ))}
                  </HeadlineTag>

                  {chapter.support && (
                    <p className={`mt-4 max-w-md sm:mt-5 sm:max-w-lg ${homeVideoText.heroBody}`}>
                      {chapter.support}
                    </p>
                  )}

                  {chapter.cta && (
                    <div className="mt-6 flex flex-wrap items-center gap-4 sm:mt-9">
                      <a
                        href="/about-us"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7cd244] px-6 py-3 text-sm font-semibold text-[#0a0a0a] transition-all hover:gap-3 hover:bg-[#6db038] active:scale-[0.98] sm:w-auto sm:px-7 sm:py-3.5"
                      >
                        Built For What&apos;s Next
                        <i className="ri-arrow-right-line" />
                      </a>
                    </div>
                  )}

                  {i === 0 && (
                    <div
                      className="mt-8 flex items-center gap-3 text-white/45 sm:mt-12"
                      aria-hidden="true"
                    >
                      <span className="h-9 w-px bg-[#7cd144]/55" />
                      <span className="text-[10px] font-medium uppercase tracking-[0.35em] sm:text-[11px]">
                        Scroll
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        id={HOME_HERO_SENTINEL_ID}
        className="pointer-events-none absolute bottom-0 h-px w-full"
        aria-hidden="true"
      />
    </div>
  );
}
