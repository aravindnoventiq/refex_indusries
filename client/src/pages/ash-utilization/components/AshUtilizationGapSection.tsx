import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, shouldUseLightMotion } from '../../about-us/aboutGsap';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { ashRefexGradientText } from '../ashLayout';
import { AshSectionShell } from './AshSectionShell';

const PAIRS = [
  {
    challenge: 'Legacy ash accumulation in dykes',
    need: 'Large-scale evacuation & dyke clearance capabilities',
  },
  {
    challenge: 'Evolving & complex regulatory requirements',
    need: 'Robust regulatory compliance systems',
  },
  {
    challenge: 'Fragmented utilization channels',
    need: 'Extensive industrial utilization network',
  },
  {
    challenge: 'Traceability & monitoring gaps',
    need: 'Technology-enabled monitoring',
  },
  {
    challenge: 'Siloed logistics',
    need: 'Comprehensive ash management model',
  },
] as const;

function AshUtilizationGapSection() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { theme, classes } = useDarkPageTheme();
  const { text, imageCard, surface } = classes;
  const isDark = theme === 'dark';

  const muteLabel = isDark ? 'text-white/40' : 'text-[#1f1f1f]/40';
  const challengeTone = isDark ? 'text-white/65' : 'text-[#1f1f1f]/62';
  const needTone = isDark ? 'text-white' : 'text-[#1f1f1f]';
  const panel =
    isDark
      ? 'from-[#7cd244]/[0.07] via-transparent to-transparent'
      : 'from-[#7cd244]/[0.09] via-transparent to-transparent';
  const nodeRing = isDark ? 'ring-[#7cd244]/35' : 'ring-[#7cd244]/40';
  const spineTrack = isDark ? 'bg-white/10' : 'bg-black/[0.08]';
  const shellPad = 'p-5 sm:p-7 lg:p-9 xl:p-10';
  const itemPad = 'rounded-xl px-4 py-3.5 sm:px-5 sm:py-4';

  useEffect(() => {
    if (!rootRef.current || prefersReducedMotion() || shouldUseLightMotion()) return;

    const ctx = gsap.context(() => {
      const root = rootRef.current!;
      const spineFill = root.querySelector<HTMLElement>('[data-gap-spine-fill]');
      const labels = root.querySelectorAll<HTMLElement>('[data-gap-labels]');
      const rows = gsap.utils.toArray<HTMLElement>('[data-gap-row]');
      const callout = root.querySelector<HTMLElement>('[data-gap-callout]');
      const glow = root.querySelector<HTMLElement>('[data-gap-glow]');

      gsap.set(labels, { autoAlpha: 0, y: 16 });
      gsap.set(callout, { autoAlpha: 0, y: 28 });
      if (glow) gsap.set(glow, { autoAlpha: 0, scale: 0.85 });
      if (spineFill) gsap.set(spineFill, { scaleY: 0, transformOrigin: 'top center' });

      rows.forEach((row) => {
        const challenge = row.querySelector<HTMLElement>('[data-gap-challenge]');
        const need = row.querySelector<HTMLElement>('[data-gap-need]');
        const node = row.querySelector<HTMLElement>('[data-gap-node]');
        const beam = row.querySelectorAll<HTMLElement>('[data-gap-beam]');
        if (challenge) gsap.set(challenge, { autoAlpha: 0, x: -48 });
        if (need) gsap.set(need, { autoAlpha: 0, x: 48 });
        if (node) gsap.set(node, { autoAlpha: 0, scale: 0.35 });
        if (beam.length) gsap.set(beam, { scaleX: 0 });
      });

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 82%',
          once: true,
        },
      });

      if (glow) {
        intro.to(glow, { autoAlpha: 1, scale: 1, duration: 1.1, ease: 'power2.out' }, 0);
      }
      intro.to(labels, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.1);

      if (spineFill) {
        intro.to(
          spineFill,
          { scaleY: 1, duration: 1.35, ease: 'power2.inOut' },
          0.15,
        );
      }

      rows.forEach((row, i) => {
        const challenge = row.querySelector<HTMLElement>('[data-gap-challenge]');
        const need = row.querySelector<HTMLElement>('[data-gap-need]');
        const node = row.querySelector<HTMLElement>('[data-gap-node]');
        const beam = row.querySelectorAll<HTMLElement>('[data-gap-beam]');
        const at = 0.35 + i * 0.16;

        if (challenge) {
          intro.to(
            challenge,
            { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out' },
            at,
          );
        }
        if (need) {
          intro.to(
            need,
            { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out' },
            at + 0.05,
          );
        }
        if (beam.length) {
          intro.to(
            beam,
            {
              scaleX: 1,
              duration: 0.55,
              stagger: 0.04,
              ease: 'power2.out',
            },
            at + 0.08,
          );
        }
        if (node) {
          intro.to(
            node,
            { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.2)' },
            at + 0.18,
          );
          intro.to(
            node,
            {
              boxShadow: '0 0 0 10px rgba(124,210,68,0.12), 0 0 28px rgba(124,210,68,0.35)',
              duration: 0.5,
              yoyo: true,
              repeat: 1,
              ease: 'sine.inOut',
            },
            at + 0.35,
          );
        }
      });

      if (callout) {
        intro.to(
          callout,
          { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out' },
          0.35 + rows.length * 0.16,
        );
      }

      // Soft ambient pulse on the center glow
      if (glow) {
        gsap.to(glow, {
          opacity: 0.55,
          duration: 2.8,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: root,
            start: 'top 85%',
            end: 'bottom top',
            toggleActions: 'play pause resume pause',
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <AshSectionShell id="ash-utilization-gap" title="Bridging India's Ash Utilization Gap">
      <div ref={rootRef} className="relative isolate">
        <div className={`relative overflow-hidden ${imageCard} ${shellPad}`}>
          {/* Atmospheric bridge glow */}
          <div
            data-gap-glow
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-6 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[#7cd244]/15 blur-3xl sm:top-2 sm:h-[30rem] sm:w-[30rem]"
          />

          <div
            aria-hidden
            className={`pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r ${panel}`}
          />
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l ${panel}`}
          />

          {/* Column labels */}
          <div
            data-gap-labels
            className="relative z-[1] mb-4 hidden grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] items-end gap-x-3 px-1 md:grid lg:mb-5 lg:gap-x-6"
          >
            <p className={`pb-3 text-[11px] font-semibold uppercase tracking-[0.24em] ${muteLabel}`}>
              The Challenge
            </p>
            <p className="pb-3 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7cd244]">
              Bridge
            </p>
            <p className={`pb-3 text-[11px] font-semibold uppercase tracking-[0.24em] ${muteLabel}`}>
              The Need
            </p>
          </div>

          <div className="relative z-[1]">
            {/* Vertical spine */}
            <div
              aria-hidden
              className={`pointer-events-none absolute bottom-6 left-1/2 top-2 hidden w-px -translate-x-1/2 md:block ${spineTrack}`}
            >
              <div
                data-gap-spine-fill
                className="h-full w-full origin-top bg-gradient-to-b from-[#7cd244]/20 via-[#7cd244] to-[#7cd244]/25"
              />
            </div>

            <ul className="relative m-0 list-none space-y-3 p-0 sm:space-y-4">
              {PAIRS.map((pair, index) => {
                const n = String(index + 1).padStart(2, '0');
                return (
                  <li key={pair.challenge} data-gap-row className="relative">
                    {/* Mobile card */}
                    <div className={`relative overflow-hidden md:hidden ${imageCard} ${itemPad}`}>
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#7cd244]/[0.06] to-transparent"
                      />
                      <div className="relative">
                        <div className="mb-2 flex items-center gap-2.5">
                          <span className="font-mono text-[11px] tabular-nums text-[#7cd244]">{n}</span>
                          <span className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${muteLabel}`}>
                            Challenge
                          </span>
                        </div>
                        <p data-gap-challenge className={`text-[0.98rem] leading-snug ${challengeTone}`}>
                          {pair.challenge}
                        </p>

                        <div className="my-4 flex items-center gap-3" aria-hidden>
                          <span
                            data-gap-beam
                            className="h-px flex-1 origin-left bg-gradient-to-r from-transparent to-[#7cd244]/70"
                          />
                          <span
                            data-gap-node
                            className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#7cd244] text-white shadow-[0_0_24px_rgba(124,210,68,0.45)] ring-4 ${nodeRing}`}
                          >
                            <i className="ri-arrow-down-line text-sm" />
                          </span>
                          <span
                            data-gap-beam
                            className="h-px flex-1 origin-right bg-gradient-to-l from-transparent to-[#7cd244]/70"
                          />
                        </div>

                        <p className={`mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${muteLabel}`}>
                          Need
                        </p>
                        <p data-gap-need className={`text-[1.02rem] font-semibold leading-snug ${needTone}`}>
                          {pair.need}
                        </p>
                      </div>
                    </div>

                    {/* Desktop bridge row with cards */}
                    <div className="group hidden grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] items-center gap-x-3 lg:gap-x-6 md:grid">
                      <div
                        data-gap-challenge
                        className={`min-w-0 text-right ${surface} ${itemPad}`}
                      >
                        <span className="mb-1.5 block font-mono text-[11px] tabular-nums tracking-wider text-[#7cd244]/80">
                          {n}
                        </span>
                        <p
                          className={`text-[0.98rem] leading-snug transition-colors duration-300 group-hover:text-[#7cd244] lg:text-[1.05rem] ${challengeTone}`}
                        >
                          {pair.challenge}
                        </p>
                      </div>

                      <div className="relative flex items-center justify-center" aria-hidden>
                        <span
                          data-gap-beam
                          className="absolute right-1/2 mr-4 h-px w-[calc(50%-0.75rem)] origin-right bg-gradient-to-l from-[#7cd244] to-transparent"
                        />
                        <span
                          data-gap-beam
                          className="absolute left-1/2 ml-4 h-px w-[calc(50%-0.75rem)] origin-left bg-gradient-to-r from-[#7cd244] to-transparent"
                        />
                        <span
                          data-gap-node
                          className={`relative z-[1] flex h-10 w-10 items-center justify-center rounded-full bg-[#7cd244] text-white shadow-[0_0_22px_rgba(124,210,68,0.4)] ring-4 transition-transform duration-300 group-hover:scale-110 ${nodeRing}`}
                        >
                          <i className="ri-arrow-right-line text-lg" />
                        </span>
                      </div>

                      <div data-gap-need className={`min-w-0 ${surface} ${itemPad}`}>
                        <p
                          className={`text-[1.02rem] font-semibold leading-snug tracking-[-0.01em] transition-colors duration-300 group-hover:text-[#7cd244] lg:text-[1.08rem] ${needTone}`}
                        >
                          {pair.need}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div data-gap-callout className={`relative z-[1] mt-8 sm:mt-10 ${surface} ${itemPad} text-center sm:px-8 sm:py-6`}>
            <div
              aria-hidden
              className="mx-auto mb-4 h-px w-24 bg-gradient-to-r from-transparent via-[#7cd244] to-transparent"
            />
            <p className={`text-xl leading-relaxed tracking-[-0.015em] sm:text-2xl ${text.body}`}>
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
