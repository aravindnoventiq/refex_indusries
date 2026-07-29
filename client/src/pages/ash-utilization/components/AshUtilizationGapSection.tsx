import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../about-us/aboutGsap';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { ashRefexGradientText } from '../ashLayout';
import { AshSectionShell } from './AshSectionShell';

const CHALLENGE_ITEMS = [
  'Legacy ash accumulation in dykes',
  'Evolving & complex regulatory requirements',
  'Fragmented utilization channels',
  'Traceability & monitoring gaps',
  'Siloed logistics',
];

const NEED_ITEMS = [
  'Large-scale evacuation & dyke clearance capabilities',
  'Robust regulatory compliance systems',
  'Extensive industrial utilization network',
  'Technology-enabled monitoring',
  'Comprehensive ash management model',
];

const CHALLENGE = {
  accent: 'text-[#EF5350]',
  iconBg: 'bg-[#EF5350]/20 border border-[#EF5350]/35',
  columnBorder: 'border-[#EF5350]/25 bg-[#EF5350]/[0.06]',
  bar: 'border-l-[5px] border-l-[#EF5350]',
};

const NEED = {
  accent: 'text-[#7DC244]',
  iconBg: 'bg-[#7DC244]/20 border border-[#7DC244]/35',
  columnBorder: 'border-[#7DC244]/25 bg-[#7DC244]/[0.06]',
  bar: 'border-l-[5px] border-l-[#7DC244]',
};

function GapListItem({
  text,
  barClass,
  animAttr,
  surfaceClass,
  bodySmClass,
}: {
  text: string;
  barClass: string;
  animAttr: 'data-gap-challenge-item' | 'data-gap-need-item';
  surfaceClass: string;
  bodySmClass: string;
}) {
  return (
    <li
      {...{ [animAttr]: true }}
      className={`rounded-lg px-4 py-3.5 text-sm leading-snug sm:px-5 sm:py-4 sm:text-[0.9375rem] ${surfaceClass} ${bodySmClass} ${barClass}`}
    >
      {text}
    </li>
  );
}

function AshUtilizationGapSection() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const { classes } = useDarkPageTheme();
  const { text, imageCard, surface, surfaceStrong } = classes;

  useEffect(() => {
    if (!gridRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const root = gridRef.current!;
      const challenge = root.querySelector<HTMLElement>('[data-gap-challenge]');
      const need = root.querySelector<HTMLElement>('[data-gap-need]');
      const callout = root.querySelector<HTMLElement>('[data-gap-callout]');
      const arrow = root.querySelector<HTMLElement>('[data-gap-arrow]');
      const challengeItems = root.querySelectorAll<HTMLElement>('[data-gap-challenge-item]');
      const needItems = root.querySelectorAll<HTMLElement>('[data-gap-need-item]');

      gsap.set([challenge, need, callout, arrow].filter(Boolean), { autoAlpha: 0 });
      gsap.set(challengeItems, { autoAlpha: 0, x: -20 });
      gsap.set(needItems, { autoAlpha: 0, x: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 80%',
          once: true,
        },
      });

      tl.fromTo(
        challenge,
        { autoAlpha: 0, x: -64 },
        { autoAlpha: 1, x: 0, duration: 0.8, ease: 'power3.out' },
      )
        .fromTo(
          need,
          { autoAlpha: 0, x: 64 },
          { autoAlpha: 1, x: 0, duration: 0.8, ease: 'power3.out' },
          '<0.12',
        )
        .fromTo(
          challengeItems,
          { autoAlpha: 0, x: -20 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: 'power2.out',
          },
          '-=0.4',
        )
        .fromTo(
          needItems,
          { autoAlpha: 0, x: 20 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: 'power2.out',
          },
          '<',
        );

      if (arrow) {
        tl.fromTo(
          arrow,
          { autoAlpha: 0, y: -10, scale: 0.85 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2)' },
          '-=0.25',
        );
      }

      tl.fromTo(
        callout,
        { autoAlpha: 0, y: 32, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' },
        arrow ? '-=0.1' : '-=0.15',
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <AshSectionShell
      id="ash-utilization-gap"
      title="Bridging India's Ash Utilization Gap"
    >
      <div ref={gridRef}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
          {/* The Challenge */}
          <div
            data-gap-challenge
            className={`rounded-2xl border-2 p-5 sm:p-6 lg:p-7 ${CHALLENGE.columnBorder}`}
          >
            <div className="mb-5 flex items-start gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold ${CHALLENGE.accent} ${CHALLENGE.iconBg}`}
              >
                i
              </span>
              <div>
                <h3 className={text.cardTitle}>The Challenge</h3>
                <p className={`mt-1 text-sm sm:text-[0.9375rem] ${CHALLENGE.accent}`}>
                  Barriers to effective ash utilisation
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {CHALLENGE_ITEMS.map((item) => (
                <GapListItem
                  key={item}
                  text={item}
                  barClass={CHALLENGE.bar}
                  animAttr="data-gap-challenge-item"
                  surfaceClass={surface}
                  bodySmClass={text.bodySm}
                />
              ))}
            </ul>
          </div>

          {/* The Need */}
          <div
            data-gap-need
            className={`rounded-2xl border-2 p-5 sm:p-6 lg:p-7 ${NEED.columnBorder}`}
          >
            <div className="mb-5 flex items-start gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${NEED.accent} ${NEED.iconBg}`}
              >
                <i className="ri-check-line text-lg" aria-hidden />
              </span>
              <div>
                <h3 className={text.cardTitle}>The Need</h3>
                <p className={`mt-1 text-sm sm:text-[0.9375rem] ${NEED.accent}`}>
                  Specialized execution capabilities required
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {NEED_ITEMS.map((item) => (
                <GapListItem
                  key={item}
                  text={item}
                  barClass={NEED.bar}
                  animAttr="data-gap-need-item"
                  surfaceClass={surface}
                  bodySmClass={text.bodySm}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile arrow */}
        <div data-gap-arrow className="my-4 flex justify-center md:hidden" aria-hidden>
          <span className={`flex h-10 w-10 items-center justify-center rounded-full ${surfaceStrong}`}>
            <i className="ri-arrow-down-line text-xl opacity-70" />
          </span>
        </div>

        {/* Bottom callout */}
        <div data-gap-callout className="relative mt-8 flex justify-center sm:mt-10">
          <div
            className="absolute -top-3 left-1/2 hidden h-0 w-0 -translate-x-1/2 border-x-[14px] border-b-[14px] border-x-transparent border-b-white/12 md:block"
            aria-hidden
          />
          <div
            className={`relative w-full max-w-3xl px-6 py-5 text-center sm:px-10 sm:py-6 ${imageCard}`}
          >
            <p className={`text-base sm:text-lg ${text.body}`}>
              This execution gap is where{' '}
              <span className={ashRefexGradientText}>Refex</span> operates.
            </p>
          </div>
        </div>
      </div>
    </AshSectionShell>
  );
}

export default AshUtilizationGapSection;
