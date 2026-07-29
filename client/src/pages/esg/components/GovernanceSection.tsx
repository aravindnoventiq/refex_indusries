import { useEffect, useRef, useState } from 'react';
import { Download, FileBarChart, Leaf, Scale, Users, type LucideIcon } from 'lucide-react';
import { esgCmsApi } from '../../../services/api';
import { prefersReducedMotion } from '../../about-us/aboutGsap';
import { esgContainer, esgScrollMargin } from '../esgLayout';
import { useEsgReveal } from '../esgMotion';
import { getFullUrl } from '../esgUtils';
import EsgSectionHeader from './EsgSectionHeader';
import EsgSectionLoader from './EsgSectionLoader';

interface GovernanceItem {
  id: number;
  title: string;
  link: string;
  order: number;
  isActive: boolean;
}

interface GovernanceSectionHeader {
  id: number;
  title: string;
  isActive: boolean;
}

const GOVERNANCE_BG = '/esg/governance-background.png';

const FALLBACK_HEADER: GovernanceSectionHeader = {
  id: 1,
  title: 'Governance',
  isActive: true,
};

const FALLBACK_ITEMS: GovernanceItem[] = [
  {
    id: 1,
    title: 'Grievance Mechanism',
    link: 'https://refex.co.in/wp-content/uploads/2025/02/Refex-Grievance-Redressal-Policy-01-06-2024.pdf',
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    title: 'Annual Report',
    link: 'https://refex.co.in/wp-content/uploads/2025/07/RIL_23rd_AR_FY24-25.pdf',
    order: 2,
    isActive: true,
  },
  {
    id: 3,
    title: 'BRSR Report',
    link: 'https://refex.co.in/wp-content/uploads/2025/09/BRSR.pdf',
    order: 3,
    isActive: true,
  },
];

const ORB_ICONS: LucideIcon[] = [Users, FileBarChart, Leaf];

function formatOrbTitle(title: string): string {
  if (title === 'BRSR') return 'BRSR Report';
  if (title === 'Annual Reports') return 'Annual Report';
  return title;
}

function GovernanceOrb({
  index,
  title,
  link,
  icon: Icon,
  revealed,
  delayMs,
}: {
  index: number;
  title: string;
  link: string;
  icon: LucideIcon;
  revealed: boolean;
  delayMs: number;
}) {
  return (
    <a
      href={getFullUrl(link)}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative mx-auto flex aspect-square w-full max-w-[13.5rem] flex-col items-center justify-center rounded-full px-5 py-6 text-center transition-all duration-700 ease-out sm:max-w-[15rem] lg:max-w-[16.5rem] esg-orb-link ${
        revealed ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'
      } hover:scale-[1.04]`}
      style={{
        transitionDelay: revealed ? `${delayMs}ms` : '0ms',
        background:
          'radial-gradient(circle at 32% 24%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.55) 36%, rgba(255,255,255,0.28) 68%, rgba(255,255,255,0.18) 100%)',
        boxShadow:
          'inset -10px -14px 28px rgba(255,255,255,0.75), inset 10px 10px 24px rgba(76,140,43,0.06), 0 18px 44px rgba(0,0,0,0.14)',
        border: '1px solid rgba(255,255,255,0.72)',
        backdropFilter: 'blur(6px)',
      }}
      aria-label={`Download ${title}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[12%] rounded-full border border-white/50 opacity-70"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-[18%] top-[14%] h-8 w-10 rotate-[-24deg] rounded-full bg-white/55 blur-[2px]"
      />

      <Icon
        className="relative z-[1] mb-3 h-9 w-9 text-[#2d5016] transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10"
        strokeWidth={1.6}
        aria-hidden
      />
      <span className="relative z-[1] px-1 text-sm font-semibold leading-snug text-[#2d5016] sm:text-[15px]">
        {index}. {formatOrbTitle(title)}
      </span>
      <Download
        className="relative z-[1] mt-3 h-5 w-5 text-[#2d5016]/85 transition-transform duration-300 group-hover:translate-y-0.5"
        strokeWidth={2}
        aria-hidden
      />
    </a>
  );
}

export default function GovernanceSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [header, setHeader] = useState<GovernanceSectionHeader | null>(null);
  const [items, setItems] = useState<GovernanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const motionReady = useEsgReveal(sectionRef, !loading);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      let headerData = null;
      let itemsData: GovernanceItem[] = [];

      try {
        headerData = await esgCmsApi.getGovernanceSection();
      } catch (err: unknown) {
        console.warn('Failed to fetch governance section header:', err);
      }

      try {
        itemsData = await esgCmsApi.getGovernanceItems();
      } catch (err: unknown) {
        console.warn('Failed to fetch governance items:', err);
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
      console.error('Failed to fetch governance section:', error);
      setHeader(FALLBACK_HEADER);
      setItems(FALLBACK_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <EsgSectionLoader label="Loading governance section..." />;
  }

  const displayHeader = header || FALLBACK_HEADER;

  if (items.length === 0) {
    return null;
  }

  const motionReadyResolved = motionReady || prefersReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="governance"
      className={`relative min-h-[620px] overflow-hidden sm:min-h-[680px] lg:min-h-[720px] ${esgScrollMargin}`}
      aria-labelledby="governance-section-title"
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={GOVERNANCE_BG}
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d5016]/55 via-[#2d5016]/25 to-[#1a2e10]/40" />
      </div>

      <div className={`relative z-10 px-4 py-14 sm:px-6 sm:py-16 lg:py-20 ${esgContainer}`}>
        <EsgSectionHeader
          badgeIcon={Scale}
          badgeLabel="Corporate Governance"
          accent="green"
          title={displayHeader.title}
          titleId="governance-section-title"
          motionReady={motionReadyResolved}
          onDark
          className="lg:mb-14"
        />

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
          {items.map((item, index) => (
            <GovernanceOrb
              key={item.id}
              index={index + 1}
              title={item.title}
              link={item.link}
              icon={ORB_ICONS[index] ?? FileBarChart}
              revealed={motionReadyResolved}
              delayMs={180 + index * 120}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
