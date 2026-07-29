import { useState, useEffect, useRef } from 'react';
import { homeCmsApi } from '../../../services/api';
import { prefersReducedMotion } from '../homeMotion';
import { HomeSection, homeContentText } from './HomeSection';

interface Statistic {
  id: number;
  title: string;
  value: string;
  description: string;
  order: number;
  isActive: boolean;
}

function parseNumericStat(value: string): { end: number; suffix: string } | null {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return null;
  return { end: parseInt(match[1], 10), suffix: match[2] };
}

export default function AtGlanceSection() {
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef(new Map<number, HTMLSpanElement>());
  const animatedRef = useRef(false);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await homeCmsApi.getStatistics();
        const activeStats = (data || [])
          .filter((s: Statistic) => s.isActive)
          .sort((a: Statistic, b: Statistic) => (a.order || 0) - (b.order || 0));
        setStatistics(activeStats);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        setStatistics([
          { id: 1, title: 'Years of Legacy', value: '24+', description: 'Years of Legacy', order: 1, isActive: true },
          { id: 2, title: 'People', value: '1000+', description: 'People', order: 2, isActive: true },
          { id: 3, title: 'Pan India Presence', value: 'Pan India', description: 'Presence', order: 3, isActive: true },
        ]);
      }
    };
    fetchStatistics();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || statistics.length === 0 || animatedRef.current) return;

    const numericStats = statistics
      .map((stat) => ({ stat, parsed: parseNumericStat(stat.value) }))
      .filter((entry): entry is { stat: Statistic; parsed: { end: number; suffix: string } } => entry.parsed != null);

    const setFinalValues = () => {
      numericStats.forEach(({ stat, parsed }) => {
        const el = valueRefs.current.get(stat.id);
        if (el) el.textContent = `${parsed.end}${parsed.suffix}`;
      });
    };

    if (numericStats.length === 0) return;

    if (prefersReducedMotion()) {
      setFinalValues();
      animatedRef.current = true;
      return;
    }

    let rafId = 0;
    let startTime = 0;
    const durationMs = 1200;

    const easeOut = (t: number) => 1 - (1 - t) ** 3;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const t = Math.min(1, (now - startTime) / durationMs);
      const eased = easeOut(t);

      numericStats.forEach(({ stat, parsed }) => {
        const el = valueRefs.current.get(stat.id);
        if (!el) return;
        const value = Math.round(parsed.end * eased);
        el.textContent = `${value}${parsed.suffix}`;
      });

      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        animatedRef.current = true;
        io.disconnect();
        rafId = requestAnimationFrame(tick);
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(section);

    return () => {
      io.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [statistics]);

  if (statistics.length === 0) return null;

  return (
    <HomeSection id="glance" label="Driving Impact At Scale" title="Refex Footprint" headerAlign="center">
      <div ref={sectionRef} className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-12">
        {statistics.map((stat, i) => {
          const parsed = parseNumericStat(stat.value);

          return (
            <div
              key={stat.id}
              className={`text-center ${
                i < statistics.length - 1
                  ? 'border-b border-white/10 pb-8 sm:border-b-0 sm:border-r sm:border-white/10 sm:pb-0 sm:pr-6'
                  : ''
              }`}
            >
              <div className={homeContentText.statValue}>
                {parsed ? (
                  <span
                    ref={(node) => {
                      if (node) valueRefs.current.set(stat.id, node);
                      else valueRefs.current.delete(stat.id);
                    }}
                  >
                    0{parsed.suffix}
                  </span>
                ) : (
                  stat.value
                )}
              </div>
              <div className={`uppercase tracking-[0.18em] text-[10px] sm:text-[11px] ${homeContentText.bodySm}`}>
                {stat.description || stat.title}
              </div>
            </div>
          );
        })}
      </div>
    </HomeSection>
  );
}
