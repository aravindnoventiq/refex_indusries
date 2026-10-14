import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, FileText } from 'lucide-react';
import { esgCmsApi } from '../../../services/api';
import { prefersReducedMotion } from '../../about-us/aboutGsap';
import { esgContainer, esgScrollMargin, esgSectionPad } from '../esgLayout';
import { useEsgReveal } from '../esgMotion';
import { getFullUrl } from '../esgUtils';
import EsgSectionHeader from './EsgSectionHeader';
import EsgSectionLoader from './EsgSectionLoader';

interface HrItem {
  id: number;
  title: string;
  image?: string;
  link: string;
  order: number;
  isActive: boolean;
}

interface HrSectionHeader {
  id: number;
  title: string;
  isActive: boolean;
}

const HR_IMAGE = '/esg/hr-background.jpg';

const FALLBACK_HEADER: HrSectionHeader = {
  id: 1,
  title: 'HR',
  isActive: true,
};

const FALLBACK_ITEMS: HrItem[] = [
  {
    id: 1,
    title: 'Employee Benefits and ESOP',
    image: HR_IMAGE,
    link: 'https://refex.co.in/wp-content/uploads/2025/02/ESOP-Disclosure-2023-24.pdf',
    order: 1,
    isActive: true,
  },
];

const CARD_ACCENTS = ['#4C8C2B', '#0072CE', '#F39200'] as const;

function HrCard({
  item,
  index,
  revealed,
}: {
  item: HrItem;
  index: number;
  revealed: boolean;
}) {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#e3ebe0] bg-white shadow-[0_18px_50px_rgba(76,140,43,0.08)] transition-all duration-700 ease-out hover:-translate-y-1.5 hover:shadow-[0_26px_64px_rgba(76,140,43,0.14)] ${
        revealed ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{
        transitionDelay: revealed ? `${140 + index * 100}ms` : '0ms',
        ['--card-accent' as string]: accent,
      }}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[var(--card-accent)] transition-transform duration-500 group-hover:scale-x-100"
      />

      <div className="relative aspect-[4/3] overflow-hidden bg-[#f7faf5]">
        <img
          src={getFullUrl(item.image || HR_IMAGE)}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1f1f1f]/55 via-[#1f1f1f]/10 to-transparent"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
          <h3 className="text-lg font-bold leading-snug text-white drop-shadow-sm sm:text-xl">
            {item.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <a
          href={getFullUrl(item.link)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-between gap-3 rounded-xl border border-[#e3ebe0] bg-[#f7faf5] px-4 py-3.5 transition-all duration-300 hover:border-[var(--card-accent)] hover:bg-white hover:shadow-[0_8px_24px_rgba(76,140,43,0.08)]"
        >
          <span className="inline-flex items-center gap-2">
            <FileText
              className="h-4 w-4 transition-colors"
              style={{ color: accent }}
              strokeWidth={2}
              aria-hidden
            />
            <span className="text-sm font-semibold transition-colors" style={{ color: accent }}>
              View Report
            </span>
          </span>
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundColor: accent }}
          >
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
          </span>
        </a>
      </div>
    </article>
  );
}

export default function HRSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [header, setHeader] = useState<HrSectionHeader | null>(null);
  const [items, setItems] = useState<HrItem[]>([]);
  const [loading, setLoading] = useState(true);
  const motionReady = useEsgReveal(sectionRef, !loading);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      let headerData = null;
      let itemsData: HrItem[] = [];

      try {
        headerData = await esgCmsApi.getHrSection();
      } catch (err: unknown) {
        console.warn('Failed to fetch HR section header:', err);
      }

      try {
        itemsData = await esgCmsApi.getHrItems();
      } catch (err: unknown) {
        console.warn('Failed to fetch HR items:', err);
      }

      if (
        headerData &&
        (headerData.isActive === true ||
          headerData.isActive === undefined ||
          headerData.isActive === null)
      ) {
        setHeader(headerData);
      } else {
        setHeader(FALLBACK_HEADER);
      }

      const activeItems = (itemsData || [])
        .filter((item) => item.isActive)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      setItems(activeItems.length > 0 ? activeItems : FALLBACK_ITEMS);
    } catch (error) {
      console.error('Failed to fetch HR section:', error);
      setHeader(FALLBACK_HEADER);
      setItems(FALLBACK_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <EsgSectionLoader label="Loading HR section..." />;
  }

  const displayHeader = header || FALLBACK_HEADER;

  if (items.length === 0) {
    return null;
  }

  const motionReadyResolved = motionReady || prefersReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="hr"
      className={`relative overflow-hidden bg-[#f3f3f3] ${esgSectionPad} ${esgScrollMargin}`}
      aria-labelledby="hr-section-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-12 h-72 w-72 rounded-full bg-[#F39200]/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-[#4C8C2B]/8 blur-3xl"
      />

      <div className={`relative z-10 ${esgContainer}`}>
        <EsgSectionHeader
          title={displayHeader.title}
          titleId="hr-section-title"
          motionReady={motionReadyResolved}
        />

        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
          {items.map((item, index) => (
            <HrCard
              key={item.id}
              item={item}
              index={index}
              revealed={motionReadyResolved}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
