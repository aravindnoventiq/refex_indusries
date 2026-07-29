import { useEffect, useRef, useState } from 'react';
import { Trophy } from 'lucide-react';
import { esgCmsApi } from '../../../services/api';
import { prefersReducedMotion } from '../../about-us/aboutGsap';
import { esgContainer, esgScrollMargin, esgSectionPad } from '../esgLayout';
import { useEsgReveal, useEsgVisibleCount } from '../esgMotion';
import { getFullUrl } from '../esgUtils';
import EsgSectionHeader from './EsgSectionHeader';
import EsgSectionLoader from './EsgSectionLoader';
import AwardsHighlightsVisual from './AwardsHighlightsVisual';

interface Award {
  id: number;
  image: string;
  title: string;
  order: number;
  isActive: boolean;
}

interface AwardsSectionHeader {
  id: number;
  title: string;
  isActive: boolean;
}

export default function AwardsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [header, setHeader] = useState<AwardsSectionHeader | null>(null);
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardsActive, setCardsActive] = useState(true);
  const motionReady = useEsgReveal(sectionRef, !loading && awards.length > 0);
  const visibleCount = useEsgVisibleCount(3, 1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Default fallback data
    const fallbackHeader: AwardsSectionHeader = {
      id: 1,
      title: 'Awards & Accolades',
      isActive: true,
    };

    const fallbackAwards: Award[] = [
      {
        id: 1,
        image: 'https://refex.co.in/wp-content/uploads/2024/11/ESG_CSR_Award_01-Medium-300x295-1.png',
        title: 'Most Diversified Sustainable Company (India) by The Business Concept',
        order: 1,
        isActive: true,
      },
      {
        id: 2,
        image: 'https://refex.co.in/wp-content/uploads/2024/11/Sustainability-report-award-Medium-300x225-1.png',
        title: 'Bronze Prize of Asia\'s Best Integrated Report for our First-ever Sustainability Report by AIRA',
        order: 2,
        isActive: true,
      },
      {
        id: 3,
        image: 'https://refex.co.in/wp-content/uploads/2025/02/green-apple-award01.png',
        title: 'International Green Apple Environment Award 2024',
        order: 3,
        isActive: true,
      },
      {
        id: 4,
        image: 'https://refex.co.in/wp-content/uploads/2025/02/waste-managemnet-award01.png',
        title: 'Best Waste Management Solution Award',
        order: 4,
        isActive: true,
      },
      {
        id: 5,
        image: 'https://refex.co.in/wp-content/uploads/2025/02/esg-excellence-award01.png',
        title: 'ESG Excellence Award by ESG Grit Awards',
        order: 5,
        isActive: true,
      },
    ];

    try {
      setLoading(true);

      // Try to fetch data, but handle errors gracefully
      let headerData = null;
      let awardsData: Award[] = [];

      try {
        headerData = await esgCmsApi.getAwardsSection();
      } catch (err: any) {
        console.warn('Failed to fetch awards section header:', err.message);
        headerData = null;
      }

      try {
        awardsData = await esgCmsApi.getAwards();
      } catch (err: any) {
        console.warn('Failed to fetch awards:', err.message);
        awardsData = [];
      }

      // Use API data if available and active, otherwise use fallback
      if (headerData && (headerData.isActive === true || headerData.isActive === undefined || headerData.isActive === null)) {
        setHeader(headerData);
      } else {
        setHeader(fallbackHeader);
      }

      const activeAwards = (awardsData || [])
        .filter((award: Award) => award.isActive)
        .sort((a: Award, b: Award) => (a.order || 0) - (b.order || 0));

      // If no active awards from API, use fallback
      if (activeAwards.length === 0) {
        setAwards(fallbackAwards);
      } else {
        setAwards(activeAwards);
      }
    } catch (error: any) {
      console.error('Failed to fetch awards section:', error);
      // Fallback to default data on any error
      setHeader(fallbackHeader);
      setAwards(fallbackAwards);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (awards.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % awards.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [awards.length]);

  useEffect(() => {
    if (!motionReady || prefersReducedMotion()) {
      setCardsActive(true);
      return;
    }

    setCardsActive(false);
    const frame = requestAnimationFrame(() => {
      setCardsActive(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [currentSlide, motionReady]);

  if (loading) {
    return <EsgSectionLoader label="Loading awards section..." />;
  }

  if (awards.length === 0) {
    return null;
  }

  // Ensure we have a header (use default if not available)
  const displayHeader = header || {
    id: 1,
    title: 'Awards & Accolades',
    isActive: true,
  };

  const visibleAwards = [];
  for (let i = 0; i < visibleCount; i++) {
    visibleAwards.push(awards[(currentSlide + i) % awards.length]);
  }

  const motionReadyResolved = motionReady || prefersReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="awards-accolades"
      className={`relative overflow-hidden bg-white ${esgSectionPad} ${esgScrollMargin}`}
      aria-labelledby="awards-section-title"
    >
      <div className={`relative z-10 ${esgContainer}`}>
        <EsgSectionHeader
          badgeIcon={Trophy}
          badgeLabel="Recognition"
          accent="orange"
          title={displayHeader.title}
          titleId="awards-section-title"
          motionReady={motionReadyResolved}
          className="mb-6 sm:mb-8"
        />

        <div
          className={`transition-all duration-700 delay-100 ease-out overflow-visible ${
            motionReadyResolved ? 'translate-y-0 opacity-100' : 'opacity-100'
          }`}
        >
          <AwardsHighlightsVisual />
        </div>

        <div
          className={`relative transition-all duration-700 delay-200 ease-out ${
            motionReadyResolved ? 'translate-y-0 opacity-100' : 'opacity-100'
          }`}
        >
          <div
            className={`grid gap-6 md:gap-8 ${
              visibleCount === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'md:grid-cols-3'
            }`}
          >
            {visibleAwards.map((award, index) => (
              <article
                key={`${currentSlide}-${award.id}-${index}`}
                className={`group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-[#e3ebe0] bg-white shadow-[0_16px_44px_rgba(76,140,43,0.07)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#4C8C2B]/25 hover:shadow-[0_22px_56px_rgba(76,140,43,0.12)] ${
                  cardsActive ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-5 scale-[0.97] opacity-0'
                }`}
                style={{
                  transitionDelay: cardsActive ? `${index * 90}ms` : '0ms',
                }}
              >
                <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden esg-soft-gradient bg-gradient-to-b from-[#f7faf5] to-white px-6 py-8 sm:min-h-[240px]">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 40%, rgba(76,140,43,0.08) 0%, transparent 68%)',
                    }}
                  />
                  <img
                    src={getFullUrl(award.image)}
                    alt={award.title}
                    loading="lazy"
                    className="relative z-[1] h-auto max-h-48 w-full max-w-[199px] object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 items-center border-t border-[#e3ebe0] p-6">
                  <p className="w-full text-center text-[14px] font-medium leading-[1.65] text-[#535a5e] sm:text-[15px]">
                    {award.title}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2.5">
            {awards.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to award slide ${index + 1}`}
                aria-current={currentSlide === index}
                onClick={() => setCurrentSlide(index)}
                className={`rounded-full transition-all duration-300 ease-out ${
                  currentSlide === index
                    ? 'h-3 w-3 scale-110 bg-[#6cc24a] shadow-[0_0_0_4px_rgba(108,194,74,0.2)]'
                    : 'h-2.5 w-2.5 scale-100 border border-[#cccccc] bg-white hover:scale-110 hover:border-[#6cc24a]/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
