import { useEffect, useRef } from 'react';
import { gsap, animateAboutItems, prefersReducedMotion } from '../../about-us/aboutGsap';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { ashRefexGradientText } from '../ashLayout';
import { AshSectionShell } from './AshSectionShell';

const IMAGE_BASE = '/ash-utilization/closing-the-loop';

interface LoopStep {
  id: string;
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
    title: 'Coal Handling',
    description: 'Efficient coal handling and movement to power plants.',
    image: `${IMAGE_BASE}/step-01-coal-handling.png`,
    color: '#2978B5',
    icon: 'ri-truck-line',
  },
  {
    id: 'thermal-power-plant',
    title: 'Thermal Power Plant',
    description: 'Coal is used to generate reliable and uninterrupted power.',
    image: `${IMAGE_BASE}/step-02-thermal-power-plant.png`,
    color: '#4DB5A8',
    icon: 'ri-building-2-line',
  },
  {
    id: 'ash-generation',
    title: 'Ash Generation',
    description: 'Ash is generated as a by-product during power generation.',
    image: `${IMAGE_BASE}/step-03-ash-generation.png`,
    color: '#3BA99C',
    icon: 'ri-stack-line',
  },
  {
    id: 'ash-evacuation',
    title: 'Ash Evacuation',
    description: 'Safe and efficient evacuation of ash from plant to dispatch points.',
    image: `${IMAGE_BASE}/step-04-ash-evacuation.png`,
    color: '#7DC244',
    icon: 'ri-truck-line',
  },
  {
    id: 'transportation',
    title: 'Transportation',
    description:
      'Optimized logistics with GPS-enabled fleet for reliable and on-time delivery.',
    image: `${IMAGE_BASE}/step-05-transportation.png`,
    color: '#A8C840',
    icon: 'ri-route-line',
  },
  {
    id: 'industrial-utilization',
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

function ClosingTheLoopSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { classes } = useDarkPageTheme();
  const { text, panel } = classes;

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

        {/* Mobile / tablet — vertical stack */}
        <div data-loop-anim className="flex flex-col gap-4 lg:hidden">
          {LOOP_STEPS.map((step) => (
            <MobileLoopStepCard key={step.id} step={step} />
          ))}
          <div className={`mt-2 px-4 py-5 text-center ${panel}`}>
            <h4 className={`text-sm font-bold sm:text-base ${text.cardTitle}`}>
              The Loop We Close Creates <span className={ashRefexGradientText}>A Better Future</span>
            </h4>
          </div>
        </div>

        {/* Desktop — circular loop */}
        <div data-loop-anim className="relative mx-auto hidden aspect-square w-full max-w-[760px] lg:block">
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#7DC244]/70"
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7DC244]/25"
          />

          {LOOP_STEPS.map((step, index) => {
            const angle = (index / LOOP_STEPS.length) * Math.PI * 2 - Math.PI / 2;
            const radius = 38;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            return (
              <article
                key={step.id}
                className="absolute w-[7.25rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border bg-black/80 xl:w-[8rem]"
                style={{ left: `${x}%`, top: `${y}%`, borderColor: step.color }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 bg-cover bg-center opacity-80"
                  style={{ backgroundImage: `url(${step.image})` }}
                />
                <div className="absolute inset-0 bg-black/55" />
                <div className="relative flex min-h-[5.5rem] flex-col items-center justify-center gap-1.5 px-2 py-3 text-center">
                  <i className={`${step.icon} text-base text-white`} aria-hidden />
                  <h3 className="text-[10px] font-bold uppercase leading-tight tracking-[0.06em] text-white">
                    {step.title}
                  </h3>
                </div>
              </article>
            );
          })}

          <div className="absolute left-1/2 top-1/2 flex w-[34%] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
            <h4 className={`text-sm font-bold leading-snug xl:text-base ${text.cardTitle}`}>
              The Loop We Close Creates{' '}
              <span className={ashRefexGradientText}>A Better Future</span>
            </h4>
            <ul className="mt-3 space-y-1.5">
              {LOOP_OUTCOMES.map((outcome) => (
                <li key={outcome.title} className={`text-[11px] leading-snug xl:text-xs ${text.bodySm}`}>
                  <span className="font-semibold" style={{ color: outcome.color }}>
                    {outcome.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AshSectionShell>
  );
}

export default ClosingTheLoopSection;
