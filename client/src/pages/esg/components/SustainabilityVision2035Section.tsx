import { useLayoutEffect, useRef } from 'react';
import {
  Award,
  Globe2,
  Leaf,
  Recycle,
  ShieldCheck,
  Target,
  Users,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { gsap, prefersReducedMotion } from '../../about-us/aboutGsap';
import { esgContainer, esgScrollMargin, esgSectionHeading } from '../esgLayout';
import { esgScrollStart } from '../esgMotion';

const SECTION_BG = '/esg/esg-background.png';

type VisionItem = { icon: LucideIcon; text: string };

type VisionPillar = {
  id: string;
  title: string;
  color: string;
  icon: LucideIcon;
  items: VisionItem[];
};

const VISION_PILLARS: VisionPillar[] = [
  {
    id: 'environment',
    title: 'Environment',
    color: '#4C8C2B',
    icon: Leaf,
    items: [
      { icon: Leaf, text: 'Carbon Neutral Company by 2035 (Net Zero by 2040)' },
      { icon: Globe2, text: 'Water Positive Status by 2035 (Achieve by 2030)' },
      { icon: Recycle, text: '100% Circular Economy Enterprise by 2035' },
      { icon: Wind, text: '50% Green Energy Across Operations (at Group Level)' },
    ],
  },
  {
    id: 'social',
    title: 'Social',
    color: '#F39200',
    icon: Users,
    items: [
      { icon: ShieldCheck, text: 'LTIR ≤ 0.2* by 2035 | Zero Harm (LTIR: Lost Time Injury Rate)' },
      { icon: Users, text: 'Positively Impact 1 Million Lives' },
    ],
  },
  {
    id: 'governance',
    title: 'Governance',
    color: '#0072CE',
    icon: Target,
    items: [
      { icon: Target, text: 'Future-Ready ESG Governance Enterprise by 2035' },
      { icon: Award, text: 'Top Workplace in India by 2035' },
    ],
  },
];

const VISION_FOOTER = [
  { icon: Target, label: 'Future-Ready by 2035', color: '#0072CE' },
  { icon: Leaf, label: 'Carbon Neutral by 2035', color: '#4C8C2B' },
  { icon: Zap, label: 'Net Zero by 2040', color: '#F39200' },
];

function VisionPillarCard({ pillar }: { pillar: VisionPillar }) {
  const Icon = pillar.icon;

  return (
    <article
      data-vision-card
      data-vision-id={pillar.id}
      className="esg-pillar-card flex h-full flex-col rounded-2xl border border-white/70 bg-white/88 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur-md sm:p-7"
    >
      <div className="mb-5 flex items-center gap-3">
        <div
          data-vision-icon
          className="esg-pillar-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 bg-white shadow-sm"
          style={{ borderColor: pillar.color, color: pillar.color }}
        >
          <Icon className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <h3
          data-vision-title
          className="text-xl font-bold uppercase tracking-wide"
          style={{ color: pillar.color }}
        >
          {pillar.title}
        </h3>
      </div>

      <ul className="space-y-4">
        {pillar.items.map((item) => {
          const ItemIcon = item.icon;
          return (
            <li key={item.text} data-vision-item className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${pillar.color}18`, color: pillar.color }}
              >
                <ItemIcon className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="text-[15px] leading-relaxed text-[#2b2b2b]">{item.text}</span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default function SustainabilityVision2035Section() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const title = section.querySelector<HTMLElement>('[data-vision-header-title]');
    const intro = section.querySelector<HTMLElement>('[data-vision-header-intro]');
    const cards = gsap.utils.toArray<HTMLElement>('[data-vision-card]', section);
    const items = gsap.utils.toArray<HTMLElement>('[data-vision-item]', section);
    const footer = section.querySelector<HTMLElement>('[data-vision-footer]');
    const bg = section.querySelector<HTMLElement>('[data-vision-bg]');

    if (prefersReducedMotion()) {
      gsap.set([title, intro, ...cards, ...items, footer, bg], {
        autoAlpha: 1,
        y: 0,
        x: 0,
        scale: 1,
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set([title, intro, footer], { autoAlpha: 0, y: 28 });
      gsap.set(cards, { autoAlpha: 0, y: 56, scale: 0.94 });
      cards.forEach((card, index) => {
        gsap.set(card, { x: index === 0 ? -36 : index === 2 ? 36 : 0 });
      });
      gsap.set(items, { autoAlpha: 0, x: -18 });
      gsap.set(section.querySelectorAll('[data-vision-icon]'), { scale: 0.6, autoAlpha: 0 });
      gsap.set(section.querySelectorAll('[data-vision-title]'), { autoAlpha: 0, y: 12 });

      if (bg) {
        gsap.fromTo(
          bg,
          { scale: 1.12 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: esgScrollStart(),
          once: true,
        },
      });

      if (title) {
        tl.to(title, { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out' });
      }

      if (intro) {
        tl.to(intro, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.45');
      }

      tl.to(
        cards,
        {
          autoAlpha: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.14,
          ease: 'power3.out',
        },
        '-=0.1',
      );

      tl.to(
        section.querySelectorAll('[data-vision-icon]'),
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.14,
          ease: 'back.out(1.7)',
        },
        '-=0.55',
      );

      tl.to(
        section.querySelectorAll('[data-vision-title]'),
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.14,
          ease: 'power2.out',
        },
        '-=0.4',
      );

      tl.to(
        items,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: 'power2.out',
        },
        '-=0.2',
      );

      if (footer) {
        tl.fromTo(
          footer,
          { autoAlpha: 0, y: 24, scaleX: 0.92 },
          {
            autoAlpha: 1,
            y: 0,
            scaleX: 1,
            duration: 0.65,
            ease: 'power3.out',
            transformOrigin: 'center center',
          },
          '-=0.1',
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sustainability-vision-2035"
      className={`relative overflow-hidden bg-white ${esgScrollMargin}`}
      aria-labelledby="vision-2035-title"
    >
      <div
        data-vision-bg
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: `url(${SECTION_BG})` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 esg-section-overlay bg-gradient-to-b from-white via-white/92 to-white/78"
      />

      <div className={`relative z-10 overflow-hidden py-16 sm:py-20 lg:py-24 xl:py-28 ${esgContainer}`}>
        <header className="mx-auto mb-10 max-w-4xl text-center sm:mb-12">
          <h2
            id="vision-2035-title"
            data-vision-header-title
            className={esgSectionHeading}
          >
            Sustainable <span className="text-[#4C8C2B]">Business Model</span>
          </h2>
        </header>

        <div className="grid gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">
          {VISION_PILLARS.map((pillar) => (
            <VisionPillarCard key={pillar.id} pillar={pillar} />
          ))}
        </div>

        <div
          data-vision-footer
          className="esg-pillar-footer mt-8 grid gap-4 rounded-xl border border-[#d9e8d2] bg-white/90 px-4 py-5 shadow-sm backdrop-blur-sm sm:mt-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-[#d9e8d2] sm:px-6"
        >
          {VISION_FOOTER.map((item) => {
            const FooterIcon = item.icon;
            return (
              <div
                key={item.label}
                className="flex min-h-[4.5rem] items-center justify-center gap-3.5 px-3 py-4 text-left sm:min-h-[5.25rem] sm:justify-center sm:px-5 sm:text-center"
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm sm:h-14 sm:w-14"
                  style={{ borderColor: `${item.color}55`, color: item.color }}
                >
                  <FooterIcon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.9} />
                </span>
                <span
                  className="text-lg font-bold leading-snug tracking-tight sm:text-xl lg:text-[1.45rem]"
                  style={{ color: item.color }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
