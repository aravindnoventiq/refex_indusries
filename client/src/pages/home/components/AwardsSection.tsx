import { useState, useEffect, useRef } from 'react';
import { homeCmsApi } from '../../../services/api';
import { prefersReducedMotion } from '../homeMotion';
import { HomeSection, getHomeImageUrl, HomeLoading, homeRevealCard, useHomeTheme } from './HomeSection';

interface Award {
  id: number;
  title: string;
  image: string;
  order: number;
  isActive: boolean;
}

const fallbackAwards: Award[] = [
  {
    id: 1,
    title: 'Best Organisations for Women 2024 Award by ET Now',
    image: 'https://refex.co.in/wp-content/uploads/2024/11/BEST-ORGANISATIONS-FOR-WOMEN-2024-With-Work-force-1-300x281-1.png',
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    title: 'Most Diversified Sustainable Company (India) by The Business Concept, UK',
    image: 'https://refex.co.in/wp-content/uploads/2024/11/ESG_CSR_Award_01-Medium-300x295-1.png',
    order: 2,
    isActive: true,
  },
  {
    id: 3,
    title: "Bronze Prize of Asia's Best Integrated Report by AIRA",
    image: 'https://refex.co.in/wp-content/uploads/2024/11/Sustainability-report-award-Medium-300x225-1.png',
    order: 3,
    isActive: true,
  },
  {
    id: 4,
    title: 'Gold Stevie Award Winner — Conglomerates (Medium Size)',
    image: 'https://refex.co.in/wp-content/uploads/2024/11/Gold-Stieve-Refex.png',
    order: 4,
    isActive: true,
  },
  {
    id: 5,
    title: 'International Green Apple Environment Award 2024',
    image: 'https://refex.co.in/wp-content/uploads/2025/02/green-apple-award01.png',
    order: 5,
    isActive: true,
  },
  {
    id: 6,
    title: 'Best Waste Management Solution Award',
    image: 'https://refex.co.in/wp-content/uploads/2025/02/waste-managemnet-award01.png',
    order: 6,
    isActive: true,
  },
  {
    id: 7,
    title: 'ESG Excellence Award by ESG Grit Awards',
    image: 'https://refex.co.in/wp-content/uploads/2025/02/esg-excellence-award01.png',
    order: 7,
    isActive: true,
  },
];

export default function AwardsSection() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setLoading(true);
        const data = await homeCmsApi.getAwards();
        const activeAwards = (data || [])
          .filter((item: Award) => item.isActive)
          .sort((a: Award, b: Award) => (a.order || 0) - (b.order || 0));
        setAwards(activeAwards.length > 0 ? activeAwards : fallbackAwards);
      } catch (error) {
        console.error('Failed to fetch awards:', error);
        setAwards(fallbackAwards);
      } finally {
        setLoading(false);
      }
    };
    fetchAwards();
  }, []);

  useEffect(() => {
    if (loading || !gridRef.current) return;

    if (prefersReducedMotion()) {
      setRevealed(true);
      return;
    }

    const node = gridRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '48px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loading, awards.length]);

  const { text, imageCard, imageCardMobile, hairline, awardImageBg } = useHomeTheme();

  if (loading) return <HomeLoading />;
  if (awards.length === 0) return null;

  const loop = [...awards, ...awards];

  return (
    <HomeSection
      id="awards"
      title="Awards & Accolades"
      subtitle="Recognized for quality, sustainability, and innovation across our businesses."
      compact
    >
      <div ref={gridRef} className="relative overflow-hidden">
        <div className={`award-marquee-track flex w-max gap-3 sm:gap-4 ${homeRevealCard(revealed)}`}>
          {loop.map((award, index) => (
            <article
              key={`${award.id}-${index}`}
              className={`${imageCard} ${imageCardMobile} flex w-[9.5rem] shrink-0 flex-col sm:w-[11rem]`}
            >
              <div className={`flex h-20 items-center justify-center p-2.5 sm:h-24 ${awardImageBg}`}>
                <img
                  src={getHomeImageUrl(award.image)}
                  alt={award.title}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className={`flex min-h-[3.25rem] flex-1 items-start border-t p-2 ${hairline}`}>
                <p className={`line-clamp-3 w-full text-center text-[11px] font-medium leading-snug ${text.bodySm}`}>
                  {award.title}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </HomeSection>
  );
}
