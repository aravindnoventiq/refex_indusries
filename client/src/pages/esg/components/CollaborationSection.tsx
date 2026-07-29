import { useEffect, useRef, useState } from 'react';
import { Handshake, Users, UserRound, type LucideIcon } from 'lucide-react';
import { esgCmsApi } from '../../../services/api';
import { prefersReducedMotion } from '../../about-us/aboutGsap';
import { esgContainer, esgScrollMargin, esgSectionPad } from '../esgLayout';
import { useCoarsePointer, useEsgReveal } from '../esgMotion';
import { getFullUrl } from '../esgUtils';
import EsgSectionHeader from './EsgSectionHeader';
import EsgSectionLoader from './EsgSectionLoader';

interface DevelopmentalOrg {
  id: number;
  title: string;
  logo: string;
  content: string;
  order: number;
  isActive: boolean;
}

interface MainCollaboration {
  id: number;
  title: string;
  logo: string;
  content?: string;
  largeImage?: string;
  isActive: boolean;
}

interface CollaborationSectionHeader {
  id: number;
  title: string;
  isActive: boolean;
}

type PartnerCard = {
  id: string;
  title: string;
  logo: string;
  content: string;
  icon: LucideIcon;
};

const FALLBACK_HEADER: CollaborationSectionHeader = {
  id: 1,
  title: 'Collaboration & Membership',
  isActive: true,
};

const FALLBACK_MAIN: MainCollaboration = {
  id: 1,
  title: 'United Nations Global Compact – Network India (UNGC NI)',
  logo: 'https://refex.co.in/wp-content/uploads/2025/02/global-compact-india.jpg',
  content:
    'The UN Global Compact Network India serves as a vital platform for advancing the ten universally endorsed principles within the Indian business landscape. These principles, integral to fostering sustainable and responsible corporate citizenship, align with broader global objectives like the Millennium Development Goals (MDGs) and post-2015 development agendas.',
  isActive: true,
};

const FALLBACK_ORGS: DevelopmentalOrg[] = [
  {
    id: 1,
    title: 'Damooga Foundation',
    logo: 'https://refex.co.in/wp-content/uploads/2025/02/images-1.png',
    content:
      'Damooga Foundation is a leading IT-enabled environmental NGO in India. Founded in 2014, it is driven by a group of young and passionate nature lovers. Damooga collaborates with individuals, corporate houses, educational and non-educational institutions, social groups and communities, NGOs, social entrepreneurs, and anyone committed to creating a positive impact on society and the environment.',
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    title: 'Friends of Tribals Society',
    logo: 'https://refex.co.in/wp-content/uploads/2025/06/FTS-logo.jpg',
    content:
      'Friends of Tribals Society (FTS), established in 1989 and based in Kolkata, is a non-profit organization dedicated to uplifting underprivileged rural and tribal communities across India. Operating through 37 chapters in 25 states, its flagship initiative—the One Teacher School (OTS) or Ekal Vidyalaya—provides non-formal primary education to children aged 4 to 14. These schools focus on five key areas: functional literacy, healthcare, development education, empowerment, and value-based education (Sanskar). FTS was honored with the Gandhi Peace Prize in 2017 for its impactful grassroots work.',
    order: 2,
    isActive: true,
  },
];

const PARTNER_ICONS: LucideIcon[] = [Handshake, Users, UserRound];

function buildPartnerCards(
  main: MainCollaboration | null,
  orgs: DevelopmentalOrg[],
): PartnerCard[] {
  const cards: PartnerCard[] = [];

  if (main && main.isActive !== false) {
    cards.push({
      id: `main-${main.id}`,
      title: main.title,
      logo: main.logo,
      content: main.content || '',
      icon: PARTNER_ICONS[0],
    });
  }

  orgs.forEach((org, index) => {
    cards.push({
      id: `org-${org.id}`,
      title: org.title,
      logo: org.logo,
      content: org.content,
      icon: PARTNER_ICONS[index + 1] ?? UserRound,
    });
  });

  return cards;
}

function PartnerCardItem({
  partner,
  isExpanded,
  isDimmed,
  alwaysShowContent,
  onActivate,
}: {
  partner: PartnerCard;
  isExpanded: boolean;
  isDimmed: boolean;
  alwaysShowContent: boolean;
  onActivate: () => void;
}) {
  const Icon = partner.icon;
  const showContent = alwaysShowContent || isExpanded;
  const isHighlighted = alwaysShowContent || isExpanded;

  return (
    <article
      data-collab-card
      className={`flex h-full flex-col rounded-[1.35rem] border-2 bg-white px-5 py-7 transition-all duration-500 ease-out sm:px-6 sm:py-8 ${
        isHighlighted
          ? 'border-[#4C8C2B]/70 shadow-[0_20px_50px_rgba(76,140,43,0.14)]'
          : 'border-[#e3ebe0] shadow-[0_10px_30px_rgba(0,0,0,0.04)]'
      } ${
        isDimmed
          ? 'scale-[0.98] opacity-35 grayscale-[0.35]'
          : 'scale-100 opacity-100 grayscale-0'
      }`}
      onMouseEnter={alwaysShowContent ? undefined : onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onActivate();
        }
      }}
      tabIndex={0}
      aria-expanded={isExpanded}
    >
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#4C8C2B] text-white shadow-[0_8px_20px_rgba(76,140,43,0.25)]">
        <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
      </div>

      <h3 className="mb-5 text-center text-base font-bold leading-snug text-[#4C8C2B] sm:text-lg">
        {partner.title}
      </h3>

      {partner.logo && (
        <div className="mb-2 flex min-h-[100px] flex-1 items-center justify-center sm:min-h-[120px]">
          <img
            src={getFullUrl(partner.logo)}
            alt={partner.title}
            loading="lazy"
            className="max-h-24 w-full max-w-[220px] object-contain sm:max-h-28"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      <div
        className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-out ${
          showContent ? 'mt-4 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          {partner.content && (
            <p className="border-t border-[#e3ebe0] pt-4 text-center text-[14px] leading-[1.7] text-[#3a3a3a] sm:text-[15px]">
              {partner.content}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export default function CollaborationSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [sectionHeader, setSectionHeader] = useState<CollaborationSectionHeader | null>(null);
  const [mainCollaboration, setMainCollaboration] = useState<MainCollaboration | null>(null);
  const [orgs, setOrgs] = useState<DevelopmentalOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const touchUi = useCoarsePointer();
  const motionReady = useEsgReveal(sectionRef, !loading);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      let sectionHeaderData = null;
      let mainCollabData = null;
      let orgsData: DevelopmentalOrg[] = [];

      try {
        sectionHeaderData = await esgCmsApi.getCollaborationSection();
      } catch (err: unknown) {
        console.warn('Failed to fetch collaboration section header:', err);
      }

      try {
        mainCollabData = await esgCmsApi.getMainCollaboration();
      } catch (err: unknown) {
        console.warn('Failed to fetch main collaboration:', err);
      }

      try {
        orgsData = await esgCmsApi.getDevelopmentalOrgs();
      } catch (err: unknown) {
        console.warn('Failed to fetch developmental organizations:', err);
      }

      if (
        sectionHeaderData &&
        (sectionHeaderData.isActive === true ||
          sectionHeaderData.isActive === undefined ||
          sectionHeaderData.isActive === null)
      ) {
        setSectionHeader(sectionHeaderData);
      } else {
        setSectionHeader(FALLBACK_HEADER);
      }

      if (
        mainCollabData &&
        (mainCollabData.isActive === true ||
          mainCollabData.isActive === undefined ||
          mainCollabData.isActive === null)
      ) {
        setMainCollaboration(mainCollabData);
      } else {
        setMainCollaboration(FALLBACK_MAIN);
      }

      const activeOrgs = (orgsData || [])
        .filter((org) => org.isActive)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      setOrgs(activeOrgs.length > 0 ? activeOrgs : FALLBACK_ORGS);
    } catch (error) {
      console.error('Failed to fetch collaboration section:', error);
      setSectionHeader(FALLBACK_HEADER);
      setMainCollaboration(FALLBACK_MAIN);
      setOrgs(FALLBACK_ORGS);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <EsgSectionLoader label="Loading collaboration section..." />;
  }

  const displayHeader = sectionHeader || FALLBACK_HEADER;
  const displayMain = mainCollaboration || FALLBACK_MAIN;
  const partners = buildPartnerCards(displayMain, orgs);

  if (partners.length === 0) {
    return null;
  }

  const motionReadyResolved = motionReady || prefersReducedMotion();
  const hasActive = !touchUi && activeId !== null;

  return (
    <section
      ref={sectionRef}
      id="collaboration-membership"
      className={`relative overflow-hidden bg-[#f3f3f3] ${esgSectionPad} ${esgScrollMargin}`}
      aria-labelledby="collaboration-section-title"
      onMouseLeave={touchUi ? undefined : () => setActiveId(null)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-8 h-40 w-56 opacity-[0.18] sm:h-52 sm:w-72"
      >
        <svg viewBox="0 0 280 120" fill="none" className="h-full w-full">
          <path
            d="M0 80 C40 20 80 100 120 60 C160 20 200 90 280 40"
            stroke="#4C8C2B"
            strokeWidth="3"
          />
          <path
            d="M0 100 C50 50 90 110 140 70 C190 30 230 100 280 60"
            stroke="#4C8C2B"
            strokeWidth="2"
            opacity="0.6"
          />
        </svg>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-8 h-40 w-56 opacity-[0.18] sm:h-52 sm:w-72"
      >
        <svg viewBox="0 0 280 120" fill="none" className="h-full w-full">
          <path
            d="M0 40 C60 90 100 30 150 70 C200 110 240 40 280 80"
            stroke="#4C8C2B"
            strokeWidth="3"
          />
          <path
            d="M0 60 C70 100 110 40 160 80 C210 120 250 50 280 100"
            stroke="#4C8C2B"
            strokeWidth="2"
            opacity="0.6"
          />
        </svg>
      </div>

      <div className={`relative z-10 ${esgContainer}`}>
        <EsgSectionHeader
          badgeIcon={Handshake}
          badgeLabel="Partnerships"
          accent="green"
          title={displayHeader.title}
          titleId="collaboration-section-title"
          motionReady={motionReadyResolved}
        />

        <div
          className={`mx-auto grid max-w-6xl items-stretch gap-5 transition-all duration-700 delay-150 ease-out sm:gap-6 md:grid-cols-3 ${
            motionReadyResolved ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {partners.map((partner, index) => (
            <div
              key={partner.id}
              className="flex h-full transition-all duration-700 ease-out"
              style={{ transitionDelay: motionReadyResolved ? `${index * 100}ms` : '0ms' }}
            >
              <PartnerCardItem
                partner={partner}
                isExpanded={activeId === partner.id}
                isDimmed={hasActive && activeId !== partner.id}
                alwaysShowContent={touchUi}
                onActivate={() => setActiveId((current) => (current === partner.id ? null : partner.id))}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
