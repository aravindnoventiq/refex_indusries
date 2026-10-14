import { useState, useEffect } from 'react';
import { homeCmsApi } from '../../../services/api';
import { HomeLoading, HomeSection, homeExpandableBodyNested, homeMobileStack, useHomeTheme } from './HomeSection';

interface FlipCard {
  id: number;
  title: string;
  description: string;
  link: string;
  order: number;
  isActive: boolean;
}

const CAREERS_URL = '/careers/';

const FALLBACK_CARDS: FlipCard[] = [
  {
    id: 1,
    title: 'Sustainability & ESG',
    description:
      'Advancing sustainable progress through circular economy solutions, responsible business practices, and a commitment to creating lasting value.',
    link: '/esg/',
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    title: 'Investors',
    description:
      'Stay informed with our latest financial results, investor presentations, stock information, and corporate announcements.',
    link: '/investors/',
    order: 2,
    isActive: true,
  },
  {
    id: 3,
    title: 'Life At Refex',
    description:
      'Great businesses are built by great people. At Refex, we foster an environment where talent is empowered, collaboration is celebrated, and every individual has the opportunity to make a meaningful impact.',
    link: CAREERS_URL,
    order: 3,
    isActive: true,
  },
];

export default function FlipCardsSection() {
  const { text, mobileCard, cardTitleHover } = useHomeTheme();
  const [cards, setCards] = useState<FlipCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const data = await homeCmsApi.getFlipCards();
        const activeCards = (data || [])
          .filter((card: FlipCard) => card.isActive)
          .sort((a: FlipCard, b: FlipCard) => (a.order || 0) - (b.order || 0));
        setCards(activeCards.length > 0 ? activeCards : FALLBACK_CARDS);
      } catch (error) {
        console.error('Failed to fetch flip cards:', error);
        setCards(FALLBACK_CARDS);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  if (loading) return <HomeLoading />;
  if (cards.length === 0) return null;

  return (
    <HomeSection
      id="careers"
      title="Join us in creating a sustainable future for India"
      subtitle="Where ambition meets opportunities"
      compact
    >
      <div className="mb-5 sm:mb-8">
        <a
          href={CAREERS_URL}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7cd244] px-5 py-3 text-sm font-semibold text-[#0a0a0a] transition-all hover:gap-3 hover:bg-[#6db038] sm:w-auto sm:justify-start sm:px-8 sm:py-3.5"
        >
          Explore Careers at Refex Industries
          <i className="ri-arrow-right-line" />
        </a>
      </div>

      <div className={`${homeMobileStack} sm:grid-cols-2 lg:grid-cols-3 lg:gap-12`}>
        {cards.map((card) => (
          <article
            key={card.id}
            className={`${mobileCard} border-l-0 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:border-l sm:border-[#7cd144]/50 sm:pl-6`}
          >
            <div className="group/title outline-none sm:mt-0" tabIndex={0}>
              <h3
                className={`${text.cardTitle} cursor-default transition-colors duration-300 ${cardTitleHover}`}
              >
                {card.title}
              </h3>
              <div className={homeExpandableBodyNested}>
                <p className={`mt-2 min-h-0 overflow-hidden sm:mt-2.5 ${text.bodySm}`}>
                  {card.description}
                </p>
              </div>
            </div>
            <a href={card.link} className={`mt-3.5 sm:mt-5 ${text.link}`}>
              Learn More
              <i className="ri-arrow-right-line" />
            </a>
          </article>
        ))}
      </div>
    </HomeSection>
  );
}
