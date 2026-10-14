import { useLayoutEffect, useRef, type RefObject } from 'react';
import { useSiteTheme } from '../../../components/SiteThemeProvider';
import { gsap, prefersReducedMotion } from '../../about-us/aboutGsap';
import { ashRefexGradientText } from '../../ash-utilization/ashLayout';
import { esgContainer } from '../esgLayout';
import AwardsHighlightsVisual from './AwardsHighlightsVisual';

const ESG_INTRO_WORDS = [
  'At',
  'Refex',
  'Industries',
  'Limited,',
  'we',
  'believe',
  'in',
  'creating',
  'a',
  'better',
  'world',
  'through',
  'sustainable',
  'business',
  'practices.',
  'We',
  'prioritize',
  'People,',
  'Planet,',
  'and',
  'Profit',
  'equally',
  'and',
  'are',
  'committed',
  'to',
  'becoming',
  'a',
  'Future-Ready',
  'ESG',
  'Governance',
  'Enterprise',
  'by',
  '2035',
  'and',
  'Carbon',
  'Neutral',
  'Company',
  'by',
  '2035',
  '(Net',
  'Zero',
  'by',
  '2040).',
];

function EsgHeroCopy({
  introRef,
  isLight,
}: {
  introRef: RefObject<HTMLParagraphElement | null>;
  isLight: boolean;
}) {
  return (
    <div className="min-w-0">
      <h1
        className={`mb-5 font-bold uppercase tracking-[0.12em] text-[2.75rem] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[5rem] ${
          isLight
            ? 'text-[#1f1f1f]'
            : 'text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.7)]'
        }`}
      >
        ESG
      </h1>
      <p
        ref={introRef}
        data-esg-intro
        className={`text-xl font-medium leading-[1.75] sm:text-2xl md:text-[1.65rem] lg:text-[1.85rem] lg:leading-[1.7] ${
          isLight
            ? 'text-[#1f1f1f]'
            : 'text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.65)]'
        }`}
      >
        {ESG_INTRO_WORDS.map((word, index) => {
          const isRefex = word === 'Refex';
          const isLast = index === ESG_INTRO_WORDS.length - 1;

          return (
            <span
              key={`${word}-${index}`}
              data-esg-word
              className={`inline-block will-change-transform ${isRefex ? `font-bold ${ashRefexGradientText}` : ''}`}
            >
              {word}
              {!isLast ? '\u00A0' : ''}
            </span>
          );
        })}
      </p>
    </div>
  );
}

export default function EsgTopSection() {
  const { theme } = useSiteTheme();
  const isLight = theme === 'light';
  const sectionRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLParagraphElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const intro = introRef.current;
    if (!section || !intro) return;

    const words = intro.querySelectorAll<HTMLElement>('[data-esg-word]');
    if (!words.length) return;

    if (prefersReducedMotion()) {
      gsap.set(words, { autoAlpha: 1, y: 0, filter: 'none' });
      return;
    }

    let fallbackTimer = 0;

    const ctx = gsap.context(() => {
      gsap.set(words, { autoAlpha: 0, y: 28, filter: 'blur(8px)' });

      fallbackTimer = window.setTimeout(() => {
        gsap.set(words, { autoAlpha: 1, y: 0, filter: 'none' });
      }, 2800);

      gsap.to(words, {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.55,
        stagger: 0.04,
        ease: 'power3.out',
        delay: 0.65,
        onComplete: () => window.clearTimeout(fallbackTimer),
      });
    }, section);

    return () => {
      window.clearTimeout(fallbackTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="esg-vision"
      className={`relative min-h-[88dvh] overflow-hidden md:min-h-[100dvh] ${
        isLight ? 'bg-white' : 'bg-[#0a0e0c]'
      }`}
    >
      <div
        className={`relative z-10 grid min-h-[88dvh] items-center gap-8 md:min-h-[100dvh] md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] md:gap-10 lg:gap-14 ${esgContainer} pb-12 pt-[calc(var(--header-offset,5.25rem)+1.5rem)] sm:pb-16`}
      >
        <div className="relative z-20 min-w-0">
          <EsgHeroCopy introRef={introRef} isLight={isLight} />
        </div>
        <div className="relative z-10 min-w-0 justify-self-end self-center w-full max-w-[28rem]">
          <AwardsHighlightsVisual placement="hero" />
        </div>
      </div>
    </section>
  );
}
