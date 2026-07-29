import { useEffect, useRef, useState } from 'react';
import { gsap, animateAboutItems, prefersReducedMotion } from '../../about-us/aboutGsap';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { AshSectionShell } from './AshSectionShell';

interface ScaleStat {
  id: number;
  value: string;
  label: string;
  color: string;
}

const SCALE_STATS: ScaleStat[] = [
  { id: 1, value: '450+', label: 'Lakh MT ASH handled', color: '#2978B5' },
  { id: 2, value: '40+', label: 'Thermal Power Plants', color: '#7DC244' },
  { id: 3, value: '14+', label: 'States', color: '#ED6930' },
];

function getDisplayValue(stat: ScaleStat, counts: Record<number, number>) {
  const numericValue = parseInt(stat.value, 10);
  if (!Number.isNaN(numericValue)) {
    const count = counts[stat.id] ?? 0;
    const suffix = stat.value.replace(String(numericValue), '');
    return `${count}${suffix}`;
  }
  return stat.value;
}

function BuiltForScaleSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { theme, classes } = useDarkPageTheme();
  const { text } = classes;
  const statDivider =
    theme === 'dark'
      ? 'border-b border-white/10 pb-8 sm:border-b-0 sm:border-r sm:border-white/10 sm:pb-0 sm:pr-6 lg:pr-10'
      : 'border-b border-[#dfe9d8] pb-8 sm:border-b-0 sm:border-r sm:border-[#dfe9d8] sm:pb-0 sm:pr-6 lg:pr-10';
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || hasAnimated) return;

        setHasAnimated(true);
        SCALE_STATS.forEach((stat) => {
          const endValue = parseInt(stat.value, 10);
          if (Number.isNaN(endValue)) return;

          let startValue = 0;
          const increment = endValue > 100 ? 10 : 1;
          const interval = endValue > 100 ? 20 : 50;

          const timer = window.setInterval(() => {
            startValue += increment;
            if (startValue >= endValue) {
              setCounts((prev) => ({ ...prev, [stat.id]: endValue }));
              window.clearInterval(timer);
            } else {
              setCounts((prev) => ({ ...prev, [stat.id]: startValue }));
            }
          }, interval);
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animateAboutItems(sectionRef.current!, '[data-scale-anim]', { y: 28, stagger: 0.12 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <AshSectionShell id="built-for-scale" title="Built for Scale" headerAlign="center">
      <div
        ref={sectionRef}
        className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-12"
      >
        {SCALE_STATS.map((stat, index) => (
          <div
            key={stat.id}
            data-scale-anim
            className={`text-center ${index < SCALE_STATS.length - 1 ? statDivider : ''}`}
          >
            <div
              className="mb-2.5 text-4xl font-bold tracking-[-0.03em] sm:text-5xl lg:text-[3.5rem]"
              style={{
                color: stat.color,
                textShadow: `0 1px 24px ${stat.color}55`,
              }}
            >
              {getDisplayValue(stat, counts)}
            </div>
            <div
              className="mx-auto mb-3 h-0.5 w-8 rounded-full"
              style={{ backgroundColor: stat.color }}
              aria-hidden
            />
            <div
              className={`uppercase tracking-[0.18em] text-[10px] sm:text-[11px] ${text.bodySm}`}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </AshSectionShell>
  );
}

export default BuiltForScaleSection;
