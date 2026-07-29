import { useState, useEffect, useRef } from 'react';
import { homeCmsApi } from '../../../services/api';
import { metaFor } from '../../../utils/businessMeta';
import { resolveBusinessLink } from '../../../utils/businessNavLinks';
import { prefersReducedMotion } from '../homeMotion';
import { HomeLoading, HomeSection, homeContentText, homeMobileCard, homeExpandableBody, homeRevealCard, homeMobileStack } from './HomeSection';

interface Business {
  id: number;
  title: string;
  description: string;
  link: string;
  order: number;
  isActive: boolean;
}

const PATHWAY_LABELS = ['CORE OPERATIONS', 'SUSTAINABLE FLEETS', 'CLEAN ENERGY'] as const;

/** Explore link colors by pathway order: orange, green, blue */
const EXPLORE_COLORS = ['#f97316', '#7cd144', '#3b82f6'] as const;

export default function BusinessSection() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const data = await homeCmsApi.getOfferings();
        const activeBusinesses = (data || [])
          .filter((item: any) => item.isActive)
          .map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            link: resolveBusinessLink(item.title, item.link || '/'),
            order: item.order || 0,
            isActive: item.isActive,
          }))
          .sort((a: Business, b: Business) => (a.order || 0) - (b.order || 0));
        setBusinesses(activeBusinesses);
      } catch (error) {
        console.error('Failed to fetch businesses:', error);
        setBusinesses([
          {
            id: 1,
            title: 'Ash Utilisation & Coal Handling',
            description:
              'Building sustainable industrial ecosystems through ash recovery, reuse, and resource-efficient operations.',
            link: '/ash-utilization',
            order: 1,
            isActive: true,
          },
          {
            id: 2,
            title: 'Refex Mobility',
            description:
              'Offering tailored mobility services for corporate commuting and daily rides, with a focus on sustainability through electric four-wheeler fleets.',
            link: 'https://refexmobility.com/',
            order: 2,
            isActive: true,
          },
          {
            id: 3,
            title: 'Venwind Refex',
            description:
              'Aiming to drive sustainable wind energy adoption nationwide with advanced 5.3 MW wind turbine manufacturing in India.',
            link: 'https://venwindrefex.com/',
            order: 3,
            isActive: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (loading || !listRef.current) return;

    if (prefersReducedMotion()) {
      setRevealed(true);
      return;
    }

    const node = listRef.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '48px 0px' },
    );

    io.observe(node);
    return () => io.disconnect();
  }, [loading, businesses.length]);

  if (loading) return <HomeLoading />;
  if (businesses.length === 0) return null;

  return (
    <HomeSection id="businesses" label="What We Do" afterHero>
      <div ref={listRef} className={`${homeMobileStack} sm:grid-cols-3 lg:gap-10`}>
        {businesses.map((business, index) => {
          const meta = metaFor(business.title);
          const pathway = PATHWAY_LABELS[index] || meta.tag;
          const exploreColor = EXPLORE_COLORS[index % EXPLORE_COLORS.length];
          const isExternal = /^https?:\/\//i.test(business.link);

          return (
            <article
              key={business.id}
              data-pathway
              className={
                `${homeMobileCard} group flex flex-col outline-none ${homeRevealCard(revealed)} ` +
                'sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:border-t sm:border-white/20 sm:pt-5 ' +
                'hover:border-white/40 sm:hover:border-white/40'
              }
              style={{ transitionDelay: revealed ? `${index * 70}ms` : '0ms' }}
              tabIndex={0}
            >
              <span className={homeContentText.meta}>
                {String(index + 1).padStart(2, '0')} · {pathway}
              </span>
              <h3 className={`mt-2 sm:mt-3 ${homeContentText.cardTitle}`}>{business.title}</h3>

              <div className={homeExpandableBody}>
                <p className={`mt-2 min-h-0 overflow-hidden sm:mt-3 ${homeContentText.bodySm}`}>
                  {business.description}
                </p>
              </div>

              <a
                href={business.link}
                {...(isExternal
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="mt-3.5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all hover:gap-3 sm:mt-5"
                style={{ color: exploreColor }}
              >
                Explore
                <i className="ri-arrow-right-line text-sm" />
              </a>
            </article>
          );
        })}
      </div>
    </HomeSection>
  );
}
