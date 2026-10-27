import { useState, useEffect, useRef } from 'react';
import { homeCmsApi } from '../../../services/api';
import { metaFor } from '../../../utils/businessMeta';
import {
  READY_MIX_CONCRETE_PATH,
  REFEX_MOBILITY_URL,
  VENWIND_REFEX_URL,
} from '../../../utils/businessNavLinks';
import { prefersReducedMotion } from '../homeMotion';
import { HomeSection, homeExpandableBody, homeRevealCard, homeMobileStack, useHomeTheme } from './HomeSection';

interface Business {
  id: number;
  title: string;
  description: string;
  link: string;
  order: number;
  isActive: boolean;
}

const PATHWAY_LABELS = [
  'CORE OPERATIONS',
  'READY MIX',
  'SUSTAINABLE FLEETS',
  'CLEAN ENERGY',
] as const;

/** Explore link colors follow Refex brand: orange, green, blue, leaf */
const EXPLORE_COLORS = ['#ED6930', '#4C8C2B', '#0072CE', '#7DC244'] as const;

const PLACEHOLDER = 'Content to be updated.';

const CANONICAL_VERTICALS: Business[] = [
  {
    id: 1,
    title: 'Ash Utilisation & Coal Handling',
    description: PLACEHOLDER,
    link: '/ash-utilization',
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    title: 'Ready Mix Concrete',
    description: PLACEHOLDER,
    link: READY_MIX_CONCRETE_PATH,
    order: 2,
    isActive: true,
  },
  {
    id: 3,
    title: 'Green Mobility',
    description: PLACEHOLDER,
    link: REFEX_MOBILITY_URL,
    order: 3,
    isActive: true,
  },
  {
    id: 4,
    title: 'Venwind Refex',
    description: PLACEHOLDER,
    link: VENWIND_REFEX_URL,
    order: 4,
    isActive: true,
  },
];

function offeringMatches(vertical: Business, offering: { title?: string; link?: string }) {
  const link = String(offering.link || '').toLowerCase();
  const title = String(offering.title || '').toLowerCase();
  const verticalLink = vertical.link.toLowerCase();
  if (link && (link === verticalLink || verticalLink.includes(link) || link.includes('ready-mix'))) {
    if (vertical.title.toLowerCase().includes('ready') && /ready|rmc|concrete/.test(`${title} ${link}`)) return true;
    if (link === verticalLink) return true;
  }
  if (vertical.title.toLowerCase().includes('ash') && /ash|coal/.test(title)) return true;
  if (vertical.title.toLowerCase().includes('ready') && /ready|rmc|concrete/.test(title)) return true;
  if (vertical.title.toLowerCase().includes('mobility') && /mobility/.test(title)) return true;
  if (vertical.title.toLowerCase().includes('venwind') && /venwind|wind|renew/.test(title)) return true;
  return title === vertical.title.toLowerCase();
}

export default function BusinessSection() {
  const { text, mobileCard, businessRule } = useHomeTheme();
  const [businesses, setBusinesses] = useState(CANONICAL_VERTICALS);
  const [revealed, setRevealed] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    homeCmsApi
      .getOfferings()
      .then((rows) => {
        if (cancelled || !Array.isArray(rows)) return;
        const active = rows.filter((row) => row && row.isActive !== false);
        setBusinesses(
          CANONICAL_VERTICALS.map((vertical) => {
            const match = active.find((offering) => offeringMatches(vertical, offering));
            const description = String(match?.description || '').trim();
            return description ? { ...vertical, description } : vertical;
          }),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!listRef.current) return;

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
  }, [businesses.length]);

  return (
    <HomeSection id="business" title="What We Do" afterHero>
      <div ref={listRef} className={`${homeMobileStack} sm:grid-cols-2 lg:grid-cols-4 lg:gap-8`}>
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
                `${mobileCard} group flex flex-col outline-none ${homeRevealCard(revealed)} ` +
                `sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:pt-5 ${businessRule}`
              }
              style={{ transitionDelay: revealed ? `${index * 70}ms` : '0ms' }}
              tabIndex={0}
            >
              <span className={text.meta}>
                {pathway}
              </span>
              <h3 className={`mt-2 sm:mt-3 ${text.cardTitle}`}>{business.title}</h3>

              <div className={homeExpandableBody}>
                <p className={`mt-2 min-h-0 overflow-hidden sm:mt-3 ${text.bodySm}`}>
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
