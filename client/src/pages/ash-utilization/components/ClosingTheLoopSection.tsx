import { useEffect, useRef, useState } from 'react';
import { gsap, animateAboutItems, prefersReducedMotion } from '../../about-us/aboutGsap';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { ashRefexGradientText } from '../ashLayout';
import { AshSectionShell } from './AshSectionShell';

const IMAGE_BASE = '/ash-utilization/closing-the-loop';

interface LoopStep {
  id: string;
  step: string;
  title: string;
  description?: string;
  bullets?: string[];
  image: string;
  color: string;
  icon: string;
}

const LOOP_STEPS: LoopStep[] = [
  {
    id: 'coal-handling',
    step: '01',
    title: 'Coal Handling',
    description: 'Efficient coal handling and movement to power plants.',
    image: `${IMAGE_BASE}/step-01-coal-handling.png`,
    color: '#2978B5',
    icon: 'ri-truck-line',
  },
  {
    id: 'thermal-power-plant',
    step: '02',
    title: 'Thermal Power Plant',
    description: 'Coal is used to generate reliable and uninterrupted power.',
    image: `${IMAGE_BASE}/step-02-thermal-power-plant.png`,
    color: '#4DB5A8',
    icon: 'ri-building-2-line',
  },
  {
    id: 'ash-generation',
    step: '03',
    title: 'Ash Generation',
    description: 'Ash is generated as a by-product during power generation.',
    image: `${IMAGE_BASE}/step-03-ash-generation.png`,
    color: '#3BA99C',
    icon: 'ri-stack-line',
  },
  {
    id: 'ash-evacuation',
    step: '04',
    title: 'Ash Evacuation',
    description: 'Safe and efficient evacuation of ash from plant to dispatch points.',
    image: `${IMAGE_BASE}/step-04-ash-evacuation.png`,
    color: '#7DC244',
    icon: 'ri-truck-line',
  },
  {
    id: 'transportation',
    step: '05',
    title: 'Transportation',
    description:
      'Optimized logistics with GPS-enabled fleet for reliable and on-time delivery.',
    image: `${IMAGE_BASE}/step-05-transportation.png`,
    color: '#A8C840',
    icon: 'ri-route-line',
  },
  {
    id: 'industrial-utilization',
    step: '06',
    title: 'Industrial Utilization',
    bullets: [
      'Cement & concrete',
      'Roads & infrastructure',
      'Mine reclamation',
      'Bricks & blocks',
      'Land development',
    ],
    image: `${IMAGE_BASE}/step-06-industrial-utilization.png`,
    color: '#E8A040',
    icon: 'ri-building-4-line',
  },
  {
    id: 'circular-economy',
    step: '07',
    title: 'Circular Economy Outcomes',
    description:
      'Ash becomes a valuable resource—reducing landfill, conserving natural resources and enabling sustainable growth.',
    image: `${IMAGE_BASE}/step-07-circular-economy.png`,
    color: '#ED6930',
    icon: 'ri-recycle-line',
  },
];

const LOOP_OUTCOMES = [
  {
    title: 'Lower Emissions',
    description: 'Supports cleaner operations and better air quality.',
    icon: 'ri-cloud-line',
    color: '#2978B5',
  },
  {
    title: 'Resource Conservation',
    description: 'Conserves natural resources and reduces dependence on virgin raw materials.',
    icon: 'ri-hand-heart-line',
    color: '#7DC244',
  },
  {
    title: 'Sustainable Infrastructure',
    description: 'Enables durable, eco-friendly infrastructure for the future.',
    icon: 'ri-building-line',
    color: '#E8A040',
  },
  {
    title: 'Circular Economy',
    description: 'Converting by-products into productive resources for a sustainable tomorrow.',
    icon: 'ri-loop-left-line',
    color: '#ED6930',
  },
];

function MobileLoopStepCard({ step }: { step: LoopStep }) {
  return (
    <article
      data-loop-anim
      className="relative overflow-hidden rounded-xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      style={{ borderColor: `${step.color}88` }}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${step.image})` }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/78 to-black/55" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: step.color }}
      />

      <div className="relative z-10 flex gap-4 p-4 sm:p-5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ backgroundColor: step.color }}
        >
          {step.step}
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg border bg-black/35"
              style={{ color: step.color, borderColor: `${step.color}75` }}
            >
              <i className={`${step.icon} text-base text-white`} aria-hidden />
            </span>
            <h3 className="text-sm font-bold uppercase leading-snug tracking-[0.08em] text-white">
              {step.title}
            </h3>
          </div>

          {step.bullets ? (
            <ul className="space-y-1.5 text-sm leading-snug text-white/88">
              {step.bullets.map((item) => (
                <li key={item} className="flex gap-2">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: step.color }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-relaxed text-white/88">{step.description}</p>
          )}
        </div>
      </div>
    </article>
  );
}

function LoopStepCard({
  step,
  isActive,
  onActivate,
  onDeactivate,
}: {
  step: LoopStep;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const showDetails = isActive;

  return (
    <article
      data-loop-anim
      className="group relative h-[17.5rem] w-[10.25rem] shrink-0 snap-start cursor-pointer overflow-hidden rounded-xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[border-color,box-shadow] duration-300 sm:h-[18rem] sm:w-[10.75rem] lg:h-[17.5rem] lg:w-full lg:min-w-0"
      style={{
        borderColor: showDetails ? `${step.color}ee` : `${step.color}70`,
        boxShadow: showDetails
          ? `0 8px 32px rgba(0,0,0,0.45), 0 0 24px -4px ${step.color}77`
          : undefined,
      }}
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
      aria-expanded={showDetails}
      aria-label={step.title}
    >
      <div
        aria-hidden
        className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${
          showDetails ? 'scale-105' : 'scale-100 group-hover:scale-[1.03]'
        }`}
        style={{ backgroundImage: `url(${step.image})` }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/90"
      />
      <div
        aria-hidden
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          showDetails ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: step.color }}
      />

      <div className="relative z-10 flex h-full flex-col p-3 sm:p-3.5">
        <span
          className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white sm:left-3.5 sm:top-3.5 sm:h-7 sm:w-7 sm:text-[10px]"
          style={{ backgroundColor: step.color }}
        >
          {step.step}
        </span>

        <div
          className={`flex flex-1 flex-col items-center justify-center px-1 pt-5 text-center transition-opacity duration-300 ${
            showDetails ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
          }`}
        >
          <span
            className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg border bg-black/35 backdrop-blur-sm sm:h-9 sm:w-9"
            style={{ color: step.color, borderColor: `${step.color}75` }}
          >
            <i className={`${step.icon} text-base text-white sm:text-lg`} aria-hidden />
          </span>
          <h3 className="text-[9px] font-bold uppercase leading-snug tracking-[0.1em] text-white sm:text-[10px] lg:text-[9px] xl:text-[10px]">
            {step.title}
          </h3>
        </div>

        <div
          className={`absolute inset-x-3 bottom-3 transition-all duration-300 ease-out sm:inset-x-3.5 sm:bottom-3.5 ${
            showDetails
              ? 'translate-y-0 opacity-100'
              : 'pointer-events-none translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
          }`}
        >
          <div
            className="max-h-[9.5rem] overflow-y-auto rounded-lg border p-2 backdrop-blur-sm scrollbar-hide sm:max-h-[10rem] sm:p-2.5"
            style={{ borderColor: `${step.color}88`, backgroundColor: 'rgba(0,0,0,0.72)' }}
          >
            {step.bullets ? (
              <ul className="space-y-0.5 text-[9px] leading-snug text-white/90 sm:text-[10px] lg:text-[9px] xl:text-[10px]">
                {step.bullets.map((item) => (
                  <li key={item} className="flex gap-1">
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: step.color }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[9px] leading-snug text-white/90 sm:text-[10px] lg:text-[9px] xl:text-[10px]">
                {step.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function ClosingTheLoopSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { classes } = useDarkPageTheme();
  const { text, panel, borderBottom, surface } = classes;

  const cardProps = (stepId: string) => ({
    isActive: activeId === stepId,
    onActivate: () => setActiveId(stepId),
    onDeactivate: () => setActiveId((prev) => (prev === stepId ? null : prev)),
  });

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animateAboutItems(sectionRef.current!, '[data-loop-anim]', { y: 28, stagger: 0.07 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <AshSectionShell
      id="closing-the-loop"
      title="Closing The Loop"
      headerAlign="center"
    >
      <div ref={sectionRef}>
        <div data-loop-anim className="mx-auto mb-4 max-w-4xl text-center">
          <h3 className={`text-xl font-bold leading-snug sm:text-2xl lg:text-[1.75rem] ${text.cardTitle}`}>
            From{' '}
            <span style={{ color: '#2978B5' }}>Ash</span> to{' '}
            <span style={{ color: '#2978B5' }}>Asset</span>. Building a{' '}
            <span className={ashRefexGradientText}>Sustainable Tomorrow</span>.
          </h3>
        </div>

        <p
          data-loop-anim
          className={`mx-auto mb-10 max-w-3xl text-center sm:mb-12 ${text.body}`}
        >
          Refex enables the transition from linear waste management to a circular resource
          ecosystem by ensuring that ash generated at thermal power plants is efficiently
          evacuated, transported, and utilized across multiple industrial applications.
        </p>

        {/* Mobile / tablet — vertical stack with full step copy */}
        <div data-loop-anim className="flex flex-col gap-4 lg:hidden">
          {LOOP_STEPS.map((step) => (
            <MobileLoopStepCard key={step.id} step={step} />
          ))}
        </div>

        {/* Desktop — all 7 cards fit within section container */}
        <div
          data-loop-anim
          className="hidden gap-2 lg:grid lg:grid-cols-7 xl:gap-2.5"
        >
          {LOOP_STEPS.map((step) => (
            <LoopStepCard key={step.id} step={step} {...cardProps(step.id)} />
          ))}
        </div>

        <div
          data-loop-anim
          className={`mt-8 overflow-hidden sm:mt-10 ${panel}`}
        >
          <div className={`px-4 py-3 text-center sm:px-6 sm:py-3.5 ${borderBottom}`}>
            <h4 className={`text-sm font-bold sm:text-base ${text.cardTitle}`}>
              The Loop We Close Creates{' '}
              <span className={ashRefexGradientText}>A Better Future</span>
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-2 sm:gap-4 sm:p-5 lg:grid-cols-4 lg:gap-6 lg:p-6">
            {LOOP_OUTCOMES.map((outcome) => (
              <div
                key={outcome.title}
                className="flex flex-col items-center px-4 py-4 text-center sm:px-5 sm:py-5 lg:px-6 lg:py-6"
              >
                <span
                  className={`mb-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${surface}`}
                  style={{ color: outcome.color }}
                >
                  <i className={`${outcome.icon} text-base sm:text-lg`} aria-hidden />
                </span>
                <h5 className={`mb-1 text-xs font-bold uppercase leading-tight tracking-[0.12em] sm:text-sm ${text.cardTitle}`}>
                  {outcome.title}
                </h5>
                <p className={`text-xs leading-snug sm:text-sm ${text.bodySm}`}>
                  {outcome.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AshSectionShell>
  );
}

export default ClosingTheLoopSection;
