import { useEffect, useRef } from 'react';
import { gsap, animateAboutItems, prefersReducedMotion } from '../../about-us/aboutGsap';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { AshSectionShell } from './AshSectionShell';

interface PlatformColumn {
  id: string;
  step: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  accent: string;
  iconBg: string;
  glow: string;
  sheen: string;
}

const PLATFORM_COLUMNS: PlatformColumn[] = [
  {
    id: 'plant-integration',
    step: '01',
    title: 'Plant Integration',
    description:
      'Seamless integration with existing plant ash systems for efficient onsite operations.',
    icon: 'ri-building-2-line',
    color: '#2978B5',
    accent: 'text-[#2978B5]',
    iconBg: 'bg-[#2978B5]/20 border-[#2978B5]/35',
    glow: 'shadow-[inset_0_0_0_1px_rgba(41,120,181,0.25),0_0_32px_-8px_rgba(41,120,181,0.35)]',
    sheen: 'from-[#2978B5]/18 via-[#2978B5]/5',
  },
  {
    id: 'evacuation-infrastructure',
    step: '02',
    title: 'Evacuation Infrastructure',
    description:
      'Dedicated fleet, bulkers, rail loading infrastructure, and high-volume evacuation capability.',
    icon: 'ri-truck-line',
    color: '#7DC244',
    accent: 'text-[#7DC244]',
    iconBg: 'bg-[#7DC244]/20 border-[#7DC244]/35',
    glow: 'shadow-[inset_0_0_0_1px_rgba(125,194,68,0.25),0_0_32px_-8px_rgba(125,194,68,0.35)]',
    sheen: 'from-[#7DC244]/18 via-[#7DC244]/5',
  },
  {
    id: 'industrial-utilization-network',
    step: '03',
    title: 'Industrial Utilization Network',
    description:
      'Strong partnerships across cement, infrastructure, mining, and construction sectors to maximize ash utilization.',
    icon: 'ri-links-line',
    color: '#ED6930',
    accent: 'text-[#ED6930]',
    iconBg: 'bg-[#ED6930]/20 border-[#ED6930]/35',
    glow: 'shadow-[inset_0_0_0_1px_rgba(237,105,48,0.25),0_0_32px_-8px_rgba(237,105,48,0.35)]',
    sheen: 'from-[#ED6930]/18 via-[#ED6930]/5',
  },
  {
    id: 'digital-operations-compliance',
    step: '04',
    title: 'Digital Operations & Compliance',
    description:
      'Real-time GPS tracking, geofencing, fuel sensors, digital monitoring, automated reporting, and complete regulatory compliance.',
    icon: 'ri-radar-line',
    color: '#4DB5A8',
    accent: 'text-[#4DB5A8]',
    iconBg: 'bg-[#4DB5A8]/20 border-[#4DB5A8]/35',
    glow: 'shadow-[inset_0_0_0_1px_rgba(77,181,168,0.25),0_0_32px_-8px_rgba(77,181,168,0.35)]',
    sheen: 'from-[#4DB5A8]/18 via-[#4DB5A8]/5',
  },
];

function PlatformTitleCell({
  col,
  index,
}: {
  col: PlatformColumn;
  index: number;
}) {
  const { theme } = useDarkPageTheme();
  const columnBorder =
    theme === 'dark' ? 'border-r border-white/10' : 'border-r border-[#dfe9d8]';
  const isLast = index === PLATFORM_COLUMNS.length - 1;

  return (
    <div
      data-platform-anim
      className={`relative flex h-full flex-col ${!isLast ? columnBorder : ''}`}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(90deg, ${col.color}, ${col.color}66)` }}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${col.sheen} to-transparent`}
      />
      <div className="relative flex h-full flex-col px-4 py-5 xl:px-5 xl:py-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border backdrop-blur-sm ${col.iconBg}`}
          >
            <i className={`${col.icon} text-lg ${col.accent}`} aria-hidden />
          </span>
          <span
            className={`font-mono text-[10px] font-semibold uppercase tracking-[0.28em] ${col.accent}`}
          >
            {col.step}
          </span>
        </div>
        <h3
          className={`mt-auto min-h-[2.75rem] text-[0.875rem] font-bold leading-snug xl:min-h-[3rem] xl:text-[0.9375rem] ${col.accent}`}
        >
          {col.title}
        </h3>
      </div>
    </div>
  );
}

function PlatformDescriptionCell({
  col,
  index,
}: {
  col: PlatformColumn;
  index: number;
}) {
  const { theme, classes } = useDarkPageTheme();
  const { text } = classes;
  const columnBorder =
    theme === 'dark' ? 'border-r border-white/10' : 'border-r border-[#dfe9d8]';
  const isLast = index === PLATFORM_COLUMNS.length - 1;

  return (
    <div
      data-platform-anim
      className={`group/col relative flex h-full min-h-[9.5rem] flex-col ${!isLast ? columnBorder : ''}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-6 left-1/2 h-20 w-[80%] -translate-x-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: `${col.color}22` }}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${col.sheen} to-transparent opacity-60`}
      />
      <div className="relative flex h-full px-4 py-5 xl:px-5 xl:py-6">
        <p className={`text-sm leading-[1.6] xl:text-[0.9375rem] ${text.body}`}>
          {col.description}
        </p>
      </div>
    </div>
  );
}

function PlatformColumnCard({ col }: { col: PlatformColumn }) {
  const { classes } = useDarkPageTheme();
  const { text, panel } = classes;

  return (
    <article
      data-platform-anim
      className={`relative flex flex-col overflow-hidden ${panel} ${col.glow}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(90deg, ${col.color}, ${col.color}88)` }}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${col.sheen} to-transparent`}
      />
      <div className={`relative flex items-start gap-3 px-5 py-5 ${classes.borderBottom}`}>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${col.iconBg}`}
        >
          <i className={`${col.icon} text-xl ${col.accent}`} aria-hidden />
        </span>
        <div className="min-w-0">
          <span className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${col.accent}`}>
            Step {col.step}
          </span>
          <h3 className={`mt-1 ${text.cardTitle}`}>{col.title}</h3>
        </div>
      </div>
      <div className="relative px-5 py-5">
        <p className={`text-sm leading-relaxed ${text.body}`}>{col.description}</p>
      </div>
    </article>
  );
}

function RefexExecutionPlatformSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { theme, classes } = useDarkPageTheme();
  const { surfaceStrong, borderBottom } = classes;
  const glassShell = `${surfaceStrong} relative overflow-hidden rounded-2xl`;
  const gridDivider = borderBottom;
  const sheenLine =
    theme === 'dark'
      ? 'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent'
      : 'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#dfe9d8] to-transparent';

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animateAboutItems(sectionRef.current!, '[data-platform-anim]', { y: 28, stagger: 0.09 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <AshSectionShell
      id="refex-execution-platform"
      title="Refex Execution Platform"
      subtitle="Integrated capabilities across plant operations, evacuation, industrial utilization, and digital compliance — delivered through one execution platform."
    >
      <div ref={sectionRef}>
        {/* Desktop — unified 4-column platform grid */}
        <div className={`hidden lg:block ${glassShell}`}>
          <div aria-hidden className={sheenLine} />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[#2978B5]/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 top-1/3 h-56 w-56 rounded-full bg-[#ED6930]/10 blur-3xl"
          />

          <div className={`grid grid-cols-4 items-stretch ${gridDivider}`}>
            {PLATFORM_COLUMNS.map((col, index) => (
              <PlatformTitleCell key={`${col.id}-title`} col={col} index={index} />
            ))}
          </div>

          <div className="grid grid-cols-4 items-stretch">
            {PLATFORM_COLUMNS.map((col, index) => (
              <PlatformDescriptionCell key={`${col.id}-desc`} col={col} index={index} />
            ))}
          </div>
        </div>

        {/* Mobile / tablet */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
          {PLATFORM_COLUMNS.map((col) => (
            <PlatformColumnCard key={col.id} col={col} />
          ))}
        </div>
      </div>
    </AshSectionShell>
  );
}

export default RefexExecutionPlatformSection;
