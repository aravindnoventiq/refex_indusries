import { useState, useEffect, useRef } from 'react';
import { ashUtilizationCmsApi } from '../../../services/api';
import { AshSectionShell, AboutSpinner } from './AshSectionShell';
import { homeImageCard, homeVideoText } from '../../home/components/HomeSection';
import { gsap, animateAboutItems, prefersReducedMotion } from '../../about-us/aboutGsap';

interface Impact {
  id: number;
  number: string;
  label: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

const FALLBACK_STATS: Impact[] = [
  {
    id: 1,
    icon: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/2fbba1b40464605ef45109b08ba5f402.png',
    number: '2000+',
    label: 'Fleet network',
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    icon: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/03b83a9256266b6870f5183167c8508f.png',
    number: '40+',
    label: 'Power projects',
    order: 2,
    isActive: true,
  },
  {
    id: 3,
    icon: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/a89554bfd8530b5648a0e4d24dfeb8cc.png',
    number: '70,000 MT',
    label: 'Ash handled daily',
    order: 3,
    isActive: true,
  },
  {
    id: 4,
    icon: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/e8074c5c8a93d2409fbc4388c739414c.png',
    number: '15+',
    label: 'Presence in states',
    order: 4,
    isActive: true,
  },
];

function OurImpactSection() {
  const [stats, setStats] = useState<Impact[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchImpacts = async () => {
      try {
        setLoading(true);
        const data = await ashUtilizationCmsApi.getImpacts();
        const activeImpacts = (data || [])
          .filter((item: Impact) => item.isActive)
          .sort((a: Impact, b: Impact) => (a.order || 0) - (b.order || 0));
        setStats(activeImpacts.length > 0 ? activeImpacts : FALLBACK_STATS);
      } catch {
        setStats(FALLBACK_STATS);
      } finally {
        setLoading(false);
      }
    };

    fetchImpacts();
  }, []);

  useEffect(() => {
    if (loading || !gridRef.current) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animateAboutItems(gridRef.current!, '[data-about-anim]', { y: 20, stagger: 0.08 });
    }, gridRef);

    return () => ctx.revert();
  }, [loading, stats.length]);

  if (loading) {
    return (
      <div id="our-impact">
        <AboutSpinner />
      </div>
    );
  }

  if (stats.length === 0) return null;

  return (
    <AshSectionShell
      id="our-impact"
      eyebrow="Scale"
      title="Our Impact"
      headerAlign="center"
    >
      <div
        ref={gridRef}
        className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5"
      >
        {stats.map((stat) => (
          <div
            key={stat.id}
            data-about-anim
            className={`flex flex-col items-center px-4 py-8 text-center sm:px-6 ${homeImageCard}`}
          >
            {stat.icon && (
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 p-3">
                <img
                  src={stat.icon}
                  alt=""
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/80x80?text=Icon';
                  }}
                />
              </div>
            )}
            <div className={`mb-1 text-2xl font-bold text-[#f97316] sm:text-3xl`}>
              {stat.number}
            </div>
            <div className={homeVideoText.bodySm}>{stat.label}</div>
          </div>
        ))}
      </div>
    </AshSectionShell>
  );
}

export default OurImpactSection;
