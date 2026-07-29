import { useLayoutEffect, useRef } from 'react';
import {
  BarChart3,
  Globe2,
  GraduationCap,
  Handshake,
  Leaf,
  Recycle,
  ShieldCheck,
  Sprout,
  Target,
  TrendingUp,
  Users,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import { gsap, prefersReducedMotion } from '../../about-us/aboutGsap';
import { esgContainer, esgScrollMargin } from '../esgLayout';
import { esgScrollStart } from '../esgMotion';

const PILLARS_BG = '/esg/sustainability-pillars-bg.png';

type PillarItem = { icon: LucideIcon; text: string };

type Pillar = {
  id: string;
  title: string;
  color: string;
  icon: LucideIcon;
  items: PillarItem[];
};

const PILLARS: Pillar[] = [
  {
    id: 'people',
    title: 'People',
    color: '#F39200',
    icon: Users,
    items: [
      { icon: Users, text: 'Empowering our people & communities' },
      { icon: ShieldCheck, text: 'Ensuring health, safety & well-being' },
      { icon: GraduationCap, text: 'Nurturing talent & fostering growth' },
    ],
  },
  {
    id: 'planet',
    title: 'Planet',
    color: '#4C8C2B',
    icon: Globe2,
    items: [
      { icon: Recycle, text: 'Driving resource efficiency & circular economy' },
      { icon: Wind, text: 'Investing in clean energy & green technologies' },
      { icon: Leaf, text: 'Minimizing our environmental footprint' },
    ],
  },
  {
    id: 'profit',
    title: 'Profit',
    color: '#0072CE',
    icon: BarChart3,
    items: [
      { icon: TrendingUp, text: 'Creating long-term value for stakeholders' },
      { icon: Sprout, text: 'Driving innovation & operational excellence' },
      { icon: Handshake, text: 'Building responsible & resilient businesses' },
    ],
  },
];

const FOOTER_ITEMS = [
  { icon: Recycle, label: 'Circular Economy Business Model' },
  { icon: Globe2, label: 'Carbon-Neutral Future' },
  { icon: Target, label: 'Better World. Sustainable Tomorrow.' },
];

function PillarCard({ pillar }: { pillar: Pillar }) {
  const Icon = pillar.icon;

  return (
    <article
      data-pillar-card
      data-pillar-id={pillar.id}
      className="esg-pillar-card flex h-full flex-col rounded-2xl border border-white/70 bg-white/88 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur-md sm:p-7"
    >
      <div className="mb-5 flex items-center gap-3">
        <div
          data-pillar-icon
          className="esg-pillar-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 bg-white shadow-sm"
          style={{ borderColor: pillar.color, color: pillar.color }}
        >
          <Icon className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <h3
          data-pillar-title
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
            <li key={item.text} data-pillar-item className="flex items-start gap-3">
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

export default function SustainabilityPillarsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const title = section.querySelector<HTMLElement>('[data-pillars-title]');
    const intro = section.querySelector<HTMLElement>('[data-pillars-intro]');
    const cards = gsap.utils.toArray<HTMLElement>('[data-pillar-card]', section);
    const items = gsap.utils.toArray<HTMLElement>('[data-pillar-item]', section);
    const footer = section.querySelector<HTMLElement>('[data-pillars-footer]');
    const bg = section.querySelector<HTMLElement>('[data-pillars-bg]');
    const overlay = section.querySelector<HTMLElement>('[data-pillars-overlay]');

    if (prefersReducedMotion()) {
      gsap.set([title, intro, ...cards, ...items, footer, bg, overlay], {
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
      gsap.set(section.querySelectorAll('[data-pillar-icon]'), { scale: 0.6, autoAlpha: 0 });
      gsap.set(section.querySelectorAll('[data-pillar-title]'), { autoAlpha: 0, y: 12 });

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
        section.querySelectorAll('[data-pillar-icon]'),
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
        section.querySelectorAll('[data-pillar-title]'),
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
    <section ref={sectionRef} id="sustainability-pillars" className={`relative overflow-hidden bg-white ${esgScrollMargin}`}>
      <div
        data-pillars-bg
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: `url(${PILLARS_BG})` }}
      />
      <div
        data-pillars-overlay
        aria-hidden
        className="pointer-events-none absolute inset-0 esg-section-overlay bg-gradient-to-b from-white via-white/92 to-white/78"
      />

      <div className={`relative z-10 overflow-hidden py-16 sm:py-20 lg:py-24 xl:py-28 ${esgContainer}`}>
        <header data-pillars-header className="mx-auto mb-10 max-w-4xl text-center sm:mb-12">
          <h2
            data-pillars-title
            className="text-3xl font-bold uppercase tracking-[0.08em] text-[#2b2b2b] sm:text-4xl lg:text-[2.35rem]"
          >
            Our <span className="text-[#F39200]">Sustainability</span> Pillars
          </h2>
          <p
            data-pillars-intro
            className="mt-5 text-base leading-relaxed text-[#4a4a4a] sm:text-lg"
          >
            At Refex Industries Limited, we believe in creating a better world through sustainable
            business practices. We prioritize{' '}
            <span className="font-semibold text-[#F39200]">People</span>,{' '}
            <span className="font-semibold text-[#4C8C2B]">Planet</span>, and{' '}
            <span className="font-semibold text-[#0072CE]">Profit</span> equally and are committed to
            becoming an ESG champion and carbon-neutral company.
          </p>
        </header>

        <div data-pillars-grid className="grid gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">
          {PILLARS.map((pillar) => (
            <PillarCard key={pillar.id} pillar={pillar} />
          ))}
        </div>

        <div
          data-pillars-footer
          className="esg-pillar-footer mt-8 grid gap-4 rounded-xl border border-[#d9e8d2] bg-white/90 px-4 py-5 shadow-sm backdrop-blur-sm sm:mt-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-[#d9e8d2] sm:px-6"
        >
          {FOOTER_ITEMS.map((item) => {
            const FooterIcon = item.icon;
            return (
              <div
                key={item.label}
                data-pillar-footer-item
                className="flex items-center justify-center gap-3 px-2 py-2 text-center sm:px-4"
              >
                <FooterIcon className="h-5 w-5 shrink-0 text-[#4C8C2B]" strokeWidth={2} />
                <span className="text-xs font-semibold uppercase tracking-[0.06em] text-[#4C8C2B] sm:text-[11px] lg:text-xs">
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
