import { useEffect, useRef, useState } from 'react';
import { gsap, animateAboutItems, prefersReducedMotion } from '../../about-us/aboutGsap';
import { AshSectionShell } from './AshSectionShell';

interface Capability {
  icon: string;
  text: string;
}

interface SolutionCard {
  id: string;
  title: string;
  description: string;
  image: string;
  accent: string;
  ring: string;
  border: string;
  iconBg: string;
  icon: string;
  glow: string;
  capabilitiesLabel: string;
  capabilities: Capability[];
}

/** Refex brand card themes — blue, green, orange */
const CARD_THEMES = {
  blue: {
    accent: 'text-[#2978B5]',
    ring: 'ring-2 ring-[#2978B5]/40',
    border: 'border-2 border-[#2978B5]/50 hover:border-[#2978B5]/80',
    iconBg: 'bg-[#2978B5]/20 border border-[#2978B5]/35',
    glow: 'shadow-[0_0_40px_-12px_rgba(41,120,181,0.55)]',
  },
  green: {
    accent: 'text-[#7DC244]',
    ring: 'ring-2 ring-[#7DC244]/40',
    border: 'border-2 border-[#7DC244]/50 hover:border-[#7DC244]/80',
    iconBg: 'bg-[#7DC244]/20 border border-[#7DC244]/35',
    glow: 'shadow-[0_0_40px_-12px_rgba(125,194,68,0.55)]',
  },
  orange: {
    accent: 'text-[#ED6930]',
    ring: 'ring-2 ring-[#ED6930]/40',
    border: 'border-2 border-[#ED6930]/50 hover:border-[#ED6930]/80',
    iconBg: 'bg-[#ED6930]/20 border border-[#ED6930]/35',
    glow: 'shadow-[0_0_40px_-12px_rgba(237,105,48,0.55)]',
  },
} as const;

const SOLUTION_CARDS: SolutionCard[] = [
  {
    id: 'coal-handling',
    title: 'Coal Handling',
    description:
      'End-to-end solutions for efficient coal handling and plant support operations.',
    image: '/ash-utilization/solutions-coal-handling.png',
    ...CARD_THEMES.blue,
    icon: 'ri-truck-line',
    capabilitiesLabel: 'Key Capabilities',
    capabilities: [
      { icon: 'ri-truck-line', text: 'Coal unloading & movement' },
      { icon: 'ri-grid-line', text: 'Segregation of Coal and Stone' },
      { icon: 'ri-building-2-line', text: 'Management of Heavy Machinery' },
      { icon: 'ri-tools-line', text: 'Maintenance of CHP Equipment' },
    ],
  },
  {
    id: 'ash-utilization',
    title: 'Ash Utilization',
    description: 'Converting ash into resources for a stronger, sustainable future.',
    image: '/ash-utilization/solutions-ash-utilization.png',
    ...CARD_THEMES.green,
    icon: 'ri-building-4-line',
    capabilitiesLabel: 'Key Capabilities',
    capabilities: [
      { icon: 'ri-recycle-line', text: 'Comprehensive ash management' },
      { icon: 'ri-landscape-line', text: 'Dyke clearance' },
      { icon: 'ri-route-line', text: 'Multi-modal transportation' },
      { icon: 'ri-links-line', text: 'Industrial utilization network' },
    ],
  },
  {
    id: 'technology-compliance',
    title: 'Technology & Compliance',
    description: 'Intelligent technology with robust compliance for seamless operations.',
    image: '/ash-utilization/solutions-technology.png',
    ...CARD_THEMES.orange,
    icon: 'ri-shield-check-line',
    capabilitiesLabel: 'Key Capabilities',
    capabilities: [
      { icon: 'ri-map-pin-line', text: 'GPS-enabled fleet' },
      { icon: 'ri-line-chart-line', text: 'Digital monitoring' },
      { icon: 'ri-focus-3-line', text: 'Geofencing' },
      { icon: 'ri-shield-check-line', text: 'Regulatory compliance' },
    ],
  },
];

function InteractiveSolutionCard({
  card,
  isActive,
  onActivate,
  onDeactivate,
}: {
  card: SolutionCard;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const showCapabilities = isActive;

  return (
    <article
      data-about-anim
      className={`group relative min-h-[420px] overflow-hidden rounded-2xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-500 sm:min-h-[480px] lg:min-h-[520px] ${card.border} ${
        isActive ? `${card.ring} ${card.glow}` : ''
      }`}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate();
        }
      }}
      tabIndex={0}
      role="button"
      aria-expanded={showCapabilities}
      aria-label={`${card.title} — view capabilities`}
    >
      {/* Full-card background image */}
      <img
        src={card.image}
        alt=""
        loading="lazy"
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ${
          showCapabilities ? 'scale-105' : 'scale-100 group-hover:scale-[1.04]'
        }`}
      />

      {/* Base gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-black/80" />

      {/* Hover overlay — deepens when capabilities show */}
      <div
        className={`absolute inset-0 bg-black/55 transition-opacity duration-500 ${
          showCapabilities ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'
        }`}
      />

      {/* Content */}
      <div className="preserve-dark-overlay relative z-10 flex min-h-[420px] flex-col p-5 sm:min-h-[480px] sm:p-6 lg:min-h-[520px]">
        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl backdrop-blur-sm sm:h-12 sm:w-12 ${card.iconBg}`}
          >
            <i className={`${card.icon} text-xl ${card.accent}`} aria-hidden />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold tracking-[-0.015em] leading-snug text-white text-lg sm:text-xl lg:text-[1.35rem]">
              {card.title}
            </h3>
            <p
              className={`mt-2 text-sm leading-relaxed text-white/75 transition-all duration-500 sm:text-[0.9375rem] ${
                showCapabilities
                  ? 'max-h-0 overflow-hidden opacity-0'
                  : 'max-h-24 opacity-100 md:group-hover:max-h-0 md:group-hover:overflow-hidden md:group-hover:opacity-0'
              }`}
            >
              {card.description}
            </p>
          </div>
        </div>

        <div className="flex-1" />

        {/* Capabilities — revealed on hover / tap */}
        <div
          className={`transition-all duration-500 ease-out ${
            showCapabilities
              ? 'max-h-[420px] translate-y-0 opacity-100'
              : 'max-h-0 translate-y-4 opacity-0 md:group-hover:max-h-[420px] md:group-hover:translate-y-0 md:group-hover:opacity-100'
          }`}
        >
          <div
            className={`rounded-xl border-2 bg-black/55 p-4 backdrop-blur-md sm:p-5 ${card.border}`}
          >
            <p className={`mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] ${card.accent}`}>
              {card.capabilitiesLabel}
            </p>
            <ul className="space-y-3">
              {card.capabilities.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ${card.accent}`}
                  >
                    <i className={`${item.icon} text-base`} aria-hidden />
                  </span>
                  <span className="pt-1 text-sm leading-snug text-white/90 sm:text-[0.9375rem]">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

function EndToEndSolutionsSection() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!gridRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animateAboutItems(gridRef.current!, '[data-about-anim]', { y: 32, stagger: 0.1 });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <AshSectionShell
      id="end-to-end-solutions"
      // eyebrow="Integrated Services"
      title="End-to-End Solutions. One Trusted Partner."
      subtitle="We provide integrated solutions across the entire ash management value chain, enabling thermal power plants to manage coal movement, ash evacuation, transportation, utilization, and compliance through a single execution partner."
    >
      <div ref={gridRef} className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6 lg:gap-7">
        {SOLUTION_CARDS.map((card) => (
          <InteractiveSolutionCard
            key={card.id}
            card={card}
            isActive={activeId === card.id}
            onActivate={() => setActiveId(card.id)}
            onDeactivate={() => setActiveId((prev) => (prev === card.id ? null : prev))}
          />
        ))}
      </div>
    </AshSectionShell>
  );
}

export default EndToEndSolutionsSection;
