import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LayoutGrid, List, Target } from 'lucide-react';
import { esgCmsApi } from '../../../services/api';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../about-us/aboutGsap';
import { esgContainer, esgScrollMargin, esgSectionPad } from '../esgLayout';
import { esgScrollStart } from '../esgMotion';
import { getFullUrl } from '../esgUtils';
import EsgSectionHeader from './EsgSectionHeader';
import EsgSectionLoader from './EsgSectionLoader';

interface UnsdgAction {
  id: number;
  icon: string;
  title: string;
  points: string[];
  video?: string;
  order: number;
  isActive: boolean;
}

interface UnsdgActionsSectionHeader {
  id: number;
  title: string;
  isActive: boolean;
}

const FALLBACK_HEADER: UnsdgActionsSectionHeader = {
  id: 1,
  title: 'Driving Impact Through UN SDGs',
  isActive: true,
};

const FALLBACK_SDGS: UnsdgAction[] = [
  {
    id: 1,
    icon: 'https://refex.co.in/wp-content/uploads/2024/12/sdg03.png',
    title: 'Good Health and Well-being',
    points: [
      'Certified to ISO 45001:2018, demonstrating a robust Occupational Health and Safety Management System.',
      'Mission Zero Harm initiative with a target to achieve a Lost Time Injury Rate (LTIR) ≤ 0.2 by 2035.',
      'Regular health awareness, safety training, mental well-being sessions, and employee counseling programs.',
      'Provided healthcare services, including first aid, nursing support, health check-ups and BLS training, benefiting around 600+ students.',
    ],
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    icon: 'https://refex.co.in/wp-content/uploads/2025/06/sdg041.png',
    title: 'Quality Education',
    points: [
      'Merit scholarship and financial support to 5 Children in Ramakrishna Mission School, Chennai',
      'Supported 130 tribal schools across 130 villages in Chhattisgarh, benefiting around 3250 children by improving access to quality early education.',
      'In Bhasma, Sundargarh district, support extended to a residential school for 45 students, including orphans and children from underprivileged backgrounds.',
    ],
    order: 2,
    isActive: true,
  },
  {
    id: 3,
    icon: 'https://refex.co.in/wp-content/uploads/2025/02/sdg04.png',
    title: 'Gender Equality',
    points: [
      'Currently, women make up 12% of our workforce, and we aim to increase this representation to 15% within the next two years.',
      'Implemented a \'Wellness Work from Home\' choice, enabling women to prioritize self-care during their menstrual cycle.',
    ],
    order: 3,
    isActive: true,
  },
  {
    id: 4,
    icon: 'https://refex.co.in/wp-content/uploads/2024/12/sdg06.png',
    title: 'Clean Water & Sanitation',
    points: [
      'Our "Nirmal Jal" initiative strives to ensure accessible clean water by rejuvenating dependent water bodies and rainwater harvesting.',
      'Installed a 250 LPH RO water purification unit with a 3-year AMC at Chennai Middle School, providing access to safe drinking water for 310 students.',
      'Achieve Water Positive status by 2035 under Refex Sustainability Vision 2035.',
    ],
    video: 'https://www.youtube.com/embed/Jlk4HC70Jek?rel=0&modestbranding=1&showinfo=0&controls=0',
    order: 4,
    isActive: true,
  },
  {
    id: 5,
    icon: 'https://refex.co.in/wp-content/uploads/2024/12/sdg07.png',
    title: 'Affordable & Clean Energy',
    points: [
      '50% Green Energy Across Operations (at group level) by 2035 as part of Refex\'s Sustainability Vision.',
      'Operating a 68 MW solar power facility at the Bhilai Plant, and supplying uninterrupted solar energy to South East Central Railway through a power purchase agreement (PPA)',
      'Incorporated smart grid systems to elevate the efficiency and dependability of the solar power plant',
      'Set up and commissioned two 1MW - 2MWH-BESS Solar Plant at Pratapur and Siachen for Indian Army',
      'Installed a 43 kWp rooftop solar PV system at the Chennai Corporate Office, generating approximately 51,600 kWh of renewable electricity annually.',
    ],
    order: 5,
    isActive: true,
  },
  {
    id: 6,
    icon: 'https://refex.co.in/wp-content/uploads/2025/02/sdg09.png',
    title: 'Industry, Innovation and Infrastructure',
    points: [
      'Venwind Refex is focused on advancing India\'s clean energy future by manufacturing sustainable wind turbines to deliver scalable, low-carbon energy solutions.',
      'Continued investments in digital technologies, fleet telematics, and operational efficiency.',
    ],
    order: 6,
    isActive: true,
  },
  {
    id: 7,
    icon: 'https://refex.co.in/wp-content/uploads/2025/02/sdg10.png',
    title: 'Reduced Inequalities',
    points: [
      'Workforce Experience Blend: A harmonious mix of youthful energy and seasoned expertise among Refexians',
      'We offer regional religious holidays that cater to their diverse festive observances, with a holiday calendar tailored to respect individual religious inclinations.',
      'We have well-rounded diversity within our organization, embracing a harmonious mix of religious, linguistic, geographical, and age variations.',
    ],
    order: 7,
    isActive: true,
  },
  {
    id: 8,
    icon: 'https://refex.co.in/wp-content/uploads/2025/02/sdg11.png',
    title: 'Sustainable Cities and Communities',
    points: [
      'Refex Green Mobility expanded its fleet by adding 182 electric vehicles and 15 CNG-petrol vehicles during FY 2025–26.',
      'Provides clean mobility solutions across major Indian cities, reducing emissions and supporting sustainable urban transportation.',
    ],
    order: 8,
    isActive: true,
  },
  {
    id: 9,
    icon: 'https://refex.co.in/wp-content/uploads/2024/12/sdg12.png',
    title: 'Responsible Consumption & Production',
    points: [
      'Ash utilization business facilitates eco-friendly disposal and management of ash, partnering with the cement manufacturing plant, brick manufacturer, and block industries, ensuring circularity of material and GHG emission reduction.',
    ],
    order: 9,
    isActive: true,
  },
  {
    id: 10,
    icon: 'https://refex.co.in/wp-content/uploads/2024/12/sdg13.png',
    title: 'Climate Action',
    points: [
      'Target to achieve 50% Green Energy Across Operations (at group level) through the increased adoption and utilization of renewable energy across company operations.',
      'Target to become a Carbon Neutral Company by 2035 (Net Zero by 2040)',
      'Implementing climate action initiatives through afforestation, agroforestry and mangrove restoration projects.',
    ],
    order: 10,
    isActive: true,
  },
  {
    id: 11,
    icon: 'https://refex.co.in/wp-content/uploads/2025/02/sdg15.png',
    title: 'Life on Land',
    points: [
      'Planted 10,000 saplings as of FY 2025-26.',
      'Completed mangrove restoration at Uyyalikuppam, Kalpakkam, with 5,000 saplings planted during FY 2025-26.',
    ],
    order: 11,
    isActive: true,
  },
  {
    id: 12,
    icon: 'https://refex.co.in/wp-content/uploads/2024/12/sdg17.png',
    title: 'Partnerships for the Goals',
    points: [
      'Refex is proud to be part of the United Nations Global Compact (UNGC). By joining forces with other partners, we\'re committed to ethical business practices and addressing the most pressing social and environmental issues',
      'We\'ve built a strong network of partners in the cement, brick, and block industries, local governments, educational institutions, concrete producers, road contractors, NGO, power plant operators and other industrial houses to promote and achieve UNSDG',
    ],
    order: 12,
    isActive: true,
  },
];

type ViewMode = 'grid' | 'list';

function SdgGridTile({
  sdg,
  isActive,
  onSelect,
}: {
  sdg: UnsdgAction;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      data-unsdg-grid-item
      data-sdg-id={sdg.id}
      onClick={onSelect}
      className={`group flex h-full flex-col overflow-hidden rounded-[1.15rem] border bg-white text-center shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(76,140,43,0.14)] ${
        isActive
          ? 'border-[#0072CE] ring-2 ring-[#0072CE]/25'
          : 'border-[#e3ebe0]'
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#f7faf5]">
        <img
          src={getFullUrl(sdg.icon)}
          alt={sdg.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03] sm:p-4"
        />
      </div>
      <div className="flex flex-1 flex-col items-center p-4 sm:p-5">
        <h3 className="line-clamp-3 text-sm font-bold leading-snug text-[#1f1f1f]">
          {sdg.title}
        </h3>
        {/* <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4C8C2B]">
          {sdg.points.length} {sdg.points.length === 1 ? 'action' : 'actions'}
        </span> */}
      </div>
    </button>
  );
}

function SdgActionCard({ sdg, highlighted }: { sdg: UnsdgAction; highlighted?: boolean }) {
  return (
    <article
      id={`unsdg-action-${sdg.id}`}
      data-unsdg-card
      data-sdg-id={sdg.id}
      className={`group overflow-hidden rounded-[1.35rem] border bg-white shadow-[0_18px_50px_rgba(76,140,43,0.08)] transition-all duration-500 hover:shadow-[0_24px_60px_rgba(76,140,43,0.12)] ${
        highlighted ? 'border-[#0072CE] ring-2 ring-[#0072CE]/20' : 'border-[#e3ebe0]'
      }`}
    >
      <div className="grid lg:grid-cols-[minmax(0,34%)_1fr]">
        <div
          data-unsdg-icon-wrap
          className="relative flex min-h-[200px] items-center justify-center overflow-hidden bg-[#f7faf5] p-5 sm:min-h-[240px] sm:p-6 lg:min-h-0 lg:p-8"
        >
          <img
            data-unsdg-icon
            src={getFullUrl(sdg.icon)}
            alt={sdg.title}
            loading="lazy"
            className="max-h-[220px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.02] sm:max-h-[260px] lg:max-h-[280px]"
          />
        </div>

        <div data-unsdg-content className="border-t border-[#e3ebe0] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-9">
          <h3
            data-unsdg-title
            className="mb-5 text-xl font-bold leading-tight tracking-tight text-[#1f1f1f] sm:text-[1.35rem]"
          >
            {sdg.title}
          </h3>

          <ul className="space-y-3">
            {sdg.points.map((point) => (
              <li
                key={point.slice(0, 48)}
                data-unsdg-point
                className="relative pl-4 text-[14px] leading-[1.7] text-[#3a3a3a] sm:text-[15px]"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-[0.55rem] h-1.5 w-1.5 rounded-full bg-[#4C8C2B]"
                />
                {point}
              </li>
            ))}
          </ul>

          {sdg.video && (
            <div data-unsdg-video className="mt-6 overflow-hidden rounded-xl border border-[#e3ebe0] bg-[#f7faf5]">
              <div className="aspect-video">
                <iframe
                  title={`${sdg.title} video`}
                  src={sdg.video}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function UNSDGActionsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [header, setHeader] = useState<UnsdgActionsSectionHeader | null>(null);
  const [sdgs, setSdgs] = useState<UnsdgAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeSdgId, setActiveSdgId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      let headerData = null;
      let actionsData: UnsdgAction[] = [];

      try {
        headerData = await esgCmsApi.getUnsdgActionsSection();
      } catch (err: unknown) {
        console.warn('Failed to fetch UN SDG Actions section header:', err);
      }

      try {
        actionsData = await esgCmsApi.getUnsdgActions();
      } catch (err: unknown) {
        console.warn('Failed to fetch UN SDG Actions:', err);
      }

      if (headerData && (headerData.isActive === true || headerData.isActive === undefined || headerData.isActive === null)) {
        setHeader(headerData);
      } else {
        setHeader(FALLBACK_HEADER);
      }

      const activeActions = (actionsData || [])
        .filter((action) => action.isActive)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      setSdgs(activeActions.length > 0 ? activeActions : FALLBACK_SDGS);
    } catch (error) {
      console.error('Failed to fetch UN SDG Actions section:', error);
      setHeader(FALLBACK_HEADER);
      setSdgs(FALLBACK_SDGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode !== 'list' || activeSdgId == null) return;

    const timer = window.setTimeout(() => {
      document.getElementById(`unsdg-action-${activeSdgId}`)?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'center',
      });
    }, 320);

    return () => window.clearTimeout(timer);
  }, [viewMode, activeSdgId]);

  const handleGridSelect = (sdgId: number) => {
    setActiveSdgId(sdgId);
    switchView('list');
  };

  const animateViewEnter = (mode: ViewMode) => {
    const container = mode === 'grid' ? gridRef.current : listRef.current;
    if (!container || prefersReducedMotion()) return;

    const items =
      mode === 'grid'
        ? container.querySelectorAll('[data-unsdg-grid-item]')
        : container.querySelectorAll('[data-unsdg-card]');

    gsap.set(container, { autoAlpha: 1, y: 0, clearProps: 'opacity,visibility,transform' });
    gsap.set(items, { autoAlpha: 1, clearProps: 'opacity,visibility,transform' });
    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 24, scale: mode === 'grid' ? 0.96 : 1 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        stagger: mode === 'grid' ? 0.05 : 0.08,
        ease: mode === 'grid' ? 'back.out(1.4)' : 'power3.out',
        onComplete: () => ScrollTrigger.refresh(),
      },
    );
  };

  const switchView = (mode: ViewMode) => {
    if (mode === viewMode) return;

    const outgoing = viewMode === 'grid' ? gridRef.current : listRef.current;
    const incoming = mode === 'grid' ? gridRef.current : listRef.current;

    if (!outgoing || prefersReducedMotion()) {
      if (outgoing) gsap.set(outgoing, { clearProps: 'all' });
      if (incoming) gsap.set(incoming, { autoAlpha: 1, y: 0, clearProps: 'all' });
      setViewMode(mode);
      return;
    }

    gsap.to(outgoing, {
      autoAlpha: 0,
      y: -12,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        gsap.set(outgoing, { clearProps: 'all' });
        if (incoming) gsap.set(incoming, { autoAlpha: 1, y: 0 });
        setViewMode(mode);
      },
    });
  };

  useEffect(() => {
    if (loading || sdgs.length === 0) return;

    const frame = requestAnimationFrame(() => {
      animateViewEnter(viewMode);
    });

    return () => cancelAnimationFrame(frame);
  }, [viewMode, loading, sdgs.length]);

  useLayoutEffect(() => {
    if (loading || sdgs.length === 0) return;

    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      gsap.set(
        section.querySelectorAll('[data-unsdg-header], [data-unsdg-grid-item], [data-unsdg-card]'),
        { autoAlpha: 1, y: 0, x: 0, scale: 1 },
      );
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from('[data-unsdg-header]', {
        autoAlpha: 0,
        y: 28,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: esgScrollStart('top 84%'),
          once: true,
        },
      });

      gsap.from('[data-unsdg-toggle]', {
        autoAlpha: 0,
        y: 16,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: esgScrollStart('top 82%'),
          once: true,
        },
      });
    }, section);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [loading, sdgs]);

  if (loading) {
    return <EsgSectionLoader label="Loading UN SDG Actions section..." />;
  }

  if (sdgs.length === 0) {
    return null;
  }

  const displayHeader = header || FALLBACK_HEADER;

  return (
    <section
      ref={sectionRef}
      id="un-sdg-actions"
      className={`relative overflow-hidden bg-white ${esgSectionPad} ${esgScrollMargin}`}
      aria-labelledby="unsdg-actions-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#0072CE]/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-[#4C8C2B]/8 blur-3xl"
      />

      <div className={`relative z-10 ${esgContainer}`}>
        <div data-unsdg-header>
          <EsgSectionHeader
            badgeIcon={Target}
            badgeLabel="Global Goals in Practice"
            accent="blue"
            title={
              displayHeader.title.includes('Actions') ? (
                <>
                  UN SDGs and our <span className="text-[#0072CE]">Actions</span>
                </>
              ) : (
                displayHeader.title
              )
            }
            titleId="unsdg-actions-title"
          />
        </div>

        <div
          data-unsdg-toggle
          className="mb-8 flex justify-center sm:mb-10"
          role="tablist"
          aria-label="SDG actions view"
        >
          <div className="inline-flex rounded-full border border-[#e3ebe0] bg-white p-1 shadow-sm">
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'grid'}
              onClick={() => switchView('grid')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5 ${
                viewMode === 'grid'
                  ? 'bg-[#0072CE] text-white shadow-sm'
                  : 'text-[#484848] hover:text-[#0072CE]'
              }`}
            >
              <LayoutGrid className="h-4 w-4" strokeWidth={2} />
              Grid View
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'list'}
              onClick={() => switchView('list')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5 ${
                viewMode === 'list'
                  ? 'bg-[#0072CE] text-white shadow-sm'
                  : 'text-[#484848] hover:text-[#0072CE]'
              }`}
            >
              <List className="h-4 w-4" strokeWidth={2} />
              Detail View
            </button>
          </div>
        </div>

        <div
          ref={gridRef}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4'
              : 'hidden opacity-100'
          }
          role="tabpanel"
          aria-hidden={viewMode !== 'grid'}
        >
          {sdgs.map((sdg) => (
            <SdgGridTile
              key={sdg.id}
              sdg={sdg}
              isActive={activeSdgId === sdg.id}
              onSelect={() => handleGridSelect(sdg.id)}
            />
          ))}
        </div>

        <div
          ref={listRef}
          className={viewMode === 'list' ? 'space-y-8 sm:space-y-10' : 'hidden opacity-100'}
          role="tabpanel"
          aria-hidden={viewMode !== 'list'}
        >
          {sdgs.map((sdg) => (
            <SdgActionCard
              key={sdg.id}
              sdg={sdg}
              highlighted={activeSdgId === sdg.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
