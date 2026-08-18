import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Globe2 } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../../about-us/aboutGsap';
import { esgContainer, esgScrollMargin, esgSectionPad } from '../esgLayout';
import { esgScrollStart } from '../esgMotion';
import { esgCmsApi } from '../../../services/api';

const SDG_IMAGE = '/esg/sdg-global-goals.png?v=2';

const SDG_PARAGRAPHS = [
  'Meaningful progress is achieved when economic growth, environmental responsibility, and social impact advance together. Our sustainability journey is guided by the United Nations Sustainable Development Goals (SDGs), creating value not only for our stakeholders but also for the communities and ecosystems that support our growth.',
  'As a participant of the United Nations Global Compact (UNGC), we remain committed to ethical business practices, responsible resource management, and collaborative action that contributes to a more inclusive, sustainable, and future-ready world.',
];

export default function SustainableDevelopmentGoalsIntroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [imageSrc, setImageSrc] = useState(SDG_IMAGE);
  const [paragraphs, setParagraphs] = useState(SDG_PARAGRAPHS);

  useEffect(() => {
    esgCmsApi
      .getSdgSection()
      .then((data) => {
        if (data?.image) setImageSrc(data.image);
        if (data?.content) {
          const parts = String(data.content)
            .split(/\n\s*\n/)
            .map((part: string) => part.trim())
            .filter(Boolean);
          if (parts.length) setParagraphs(parts);
        }
      })
      .catch(() => undefined);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      gsap.set(
        section.querySelectorAll(
          '[data-sdg-badge], [data-sdg-title], [data-sdg-subtitle], [data-sdg-paragraph], [data-sdg-image-wrap], [data-sdg-ungc]',
        ),
        { autoAlpha: 1, y: 0, x: 0, scale: 1 },
      );
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: esgScrollStart('top 82%'),
          once: true,
        },
      });

      tl.from('[data-sdg-badge]', { autoAlpha: 0, y: 16, duration: 0.5, ease: 'power2.out' })
        .from('[data-sdg-title]', { autoAlpha: 0, y: 28, duration: 0.65, ease: 'power3.out' }, '-=0.2')
        .from('[data-sdg-subtitle]', { autoAlpha: 0, y: 18, duration: 0.55, ease: 'power2.out' }, '-=0.35')
        .from('[data-sdg-paragraph]', {
          autoAlpha: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        }, '-=0.25')
        .from(
          '[data-sdg-image-wrap]',
          { autoAlpha: 0, x: 40, scale: 0.96, duration: 0.75, ease: 'power3.out' },
          '-=0.45',
        )
        .from('[data-sdg-ungc]', { autoAlpha: 0, y: 12, duration: 0.45, ease: 'power2.out' }, '-=0.3');
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sustainable-development-goals"
      className={`relative overflow-hidden bg-[#f3f3f3] ${esgSectionPad} ${esgScrollMargin}`}
      aria-labelledby="sdg-intro-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#0072CE]/6 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#4C8C2B]/8 blur-3xl"
      />

      <div className={`relative z-10 ${esgContainer}`}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div>
            <div
              data-sdg-badge
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0072CE]/20 bg-[#0072CE]/8 px-3 py-1.5"
            >
              <Globe2 className="h-4 w-4 text-[#0072CE]" strokeWidth={2} />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0072CE]">
                UN SDGs · UNGC
              </span>
            </div>

            <h2
              id="sdg-intro-title"
              data-sdg-title
              className="text-3xl font-bold uppercase tracking-[0.06em] text-[#2b2b2b] sm:text-4xl lg:text-[2.35rem]"
            >
              Sustainable <span className="text-[#0072CE]">Development Goals</span>
            </h2>

            <p
              data-sdg-subtitle
              className="mt-5 text-lg font-medium leading-snug text-[#4C8C2B] sm:text-xl"
            >
              Advancing Sustainable Development Through Purposeful Action
            </p>

            <div className="mt-6 space-y-4 sm:mt-8">
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  data-sdg-paragraph
                  className="text-[15px] leading-[1.75] text-[#4a4a4a] sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <p
              data-sdg-ungc
              className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-[#888]"
            >
              Aligned with United Nations Sustainable Development Goals
            </p>
          </div>

          <div
            data-sdg-image-wrap
            className="relative overflow-hidden rounded-[1.35rem] border border-[#e3ebe0] bg-white p-4 shadow-[0_18px_50px_rgba(0,0,0,0.08)] sm:p-5"
          >
            <img
              src={imageSrc}
              alt="The Global Goals for Sustainable Development — 17 United Nations SDGs"
              loading="lazy"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
