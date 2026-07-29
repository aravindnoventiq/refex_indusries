import { useEffect, useRef, useState } from 'react';
import { Download, Gift, Users, type LucideIcon } from 'lucide-react';
import { esgCmsApi } from '../../../services/api';
import { prefersReducedMotion } from '../../about-us/aboutGsap';
import { esgContainer, esgScrollMargin } from '../esgLayout';
import { useEsgReveal } from '../esgMotion';
import { getFullUrl } from '../esgUtils';
import EsgSectionHeader from './EsgSectionHeader';
import EsgSectionLoader from './EsgSectionLoader';

interface HrItem {
  id: number;
  title: string;
  link: string;
  order: number;
  isActive: boolean;
}

interface HrSectionHeader {
  id: number;
  title: string;
  isActive: boolean;
}

const HR_BG = '/esg/hr-background.jpg';

const FALLBACK_HEADER: HrSectionHeader = {
  id: 1,
  title: 'HR',
  isActive: true,
};

const FALLBACK_ITEMS: HrItem[] = [
  {
    id: 1,
    title: 'Employee Benefits and ESOP',
    link: 'https://refex.co.in/wp-content/uploads/2025/02/ESOP-Disclosure-2023-24.pdf',
    order: 1,
    isActive: true,
  },
];

const HR_ICONS: LucideIcon[] = [Gift];

function HrOrb({
  index,
  title,
  link,
  icon: Icon,
  revealed,
  delayMs,
  featured,
}: {
  index: number;
  title: string;
  link: string;
  icon: LucideIcon;
  revealed: boolean;
  delayMs: number;
  featured: boolean;
}) {
  return (
    <a
      href={getFullUrl(link)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative mx-auto flex aspect-square w-full flex-col items-center justify-center rounded-full px-5 py-6 text-center transition-all duration-700 ease-out hover:scale-[1.04] esg-orb-link ${
        featured
          ? 'max-w-[15rem] sm:max-w-[17rem] lg:max-w-[18.5rem]'
          : 'max-w-[13.5rem] sm:max-w-[15rem] lg:max-w-[16.5rem]'
      } ${revealed ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'}`}
      style={{
        transitionDelay: revealed ? `${delayMs}ms` : '0ms',
        background:
          'radial-gradient(circle at 32% 24%, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.58) 36%, rgba(255,248,240,0.32) 68%, rgba(255,240,225,0.22) 100%)',
        boxShadow:
          'inset -10px -14px 28px rgba(255,255,255,0.75), inset 10px 10px 24px rgba(243,146,0,0.08), 0 18px 44px rgba(0,0,0,0.16)',
        border: '1px solid rgba(255,255,255,0.78)',
        backdropFilter: 'blur(6px)',
      }}
      aria-label={`Download ${title}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[12%] rounded-full border border-[#F39200]/25 opacity-80"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-[18%] top-[14%] h-8 w-10 rotate-[-24deg] rounded-full bg-white/60 blur-[2px]"
      />

      <Icon
        className="relative z-[1] mb-3 h-9 w-9 text-[#b45309] transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10"
        strokeWidth={1.6}
        aria-hidden
      />
      <span className="relative z-[1] px-1 text-sm font-semibold leading-snug text-[#9a3412] sm:text-[15px]">
        {index}. {title}
      </span>
      <Download
        className="relative z-[1] mt-3 h-5 w-5 text-[#b45309]/85 transition-transform duration-300 group-hover:translate-y-0.5"
        strokeWidth={2}
        aria-hidden
      />
    </a>
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
  const isSingleItem = items.length === 1;

  return (
    <section
      ref={sectionRef}
      id="hr"
      className={`relative min-h-[560px] overflow-hidden sm:min-h-[620px] lg:min-h-[660px] ${esgScrollMargin}`}
      aria-labelledby="hr-section-title"
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={HR_BG}
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#F39200]/35 via-[#2d5016]/45 to-[#1a2e10]/55" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/20 to-transparent"
      />

      <div className={`relative z-10 px-4 py-14 sm:px-6 sm:py-16 lg:py-20 ${esgContainer}`}>
        <EsgSectionHeader
          badgeIcon={Users}
          badgeLabel="People & Talent"
          accent="orange"
          title={displayHeader.title}
          titleId="hr-section-title"
          motionReady={motionReadyResolved}
          onDark
          className="lg:mb-14"
        />

        <div
          className={`mx-auto grid max-w-5xl gap-8 ${
            isSingleItem
              ? 'grid-cols-1 justify-items-center'
              : 'sm:grid-cols-2 lg:grid-cols-3'
          } sm:gap-6 lg:gap-10`}
        >
          {items.map((item, index) => (
            <HrOrb
              key={item.id}
              index={index + 1}
              title={item.title}
              link={item.link}
              icon={HR_ICONS[index] ?? Gift}
              revealed={motionReadyResolved}
              delayMs={180 + index * 120}
              featured={isSingleItem}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
