import { useState, useEffect } from 'react';
import { homeCmsApi } from '../../../services/api';
import { HomeLoading, HomeSection, homeContentText } from './HomeSection';

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
      label="Careers"
      title="Join us in creating a sustainable future for India"
      subtitle="Where ambition meets opportunities"
      compact
    >
      <div className="mb-6 sm:mb-8">
        <a
          href={CAREERS_URL}
          className="inline-flex items-center gap-2 rounded-full bg-[#7cd244] px-6 py-3 text-sm font-semibold text-[#0a0a0a] transition-all hover:gap-3 hover:bg-[#6db038] sm:px-8 sm:py-3.5"
        >
          Explore Careers at Refex Industries
          <i className="ri-arrow-right-line" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {cards.map((card, index) => (
          <article key={card.id} className="border-l border-[#7cd144]/50 pl-5 sm:pl-6">
            <span className={homeContentText.meta}>{String(index + 1).padStart(2, '0')}</span>
            <div className="group/title mt-2.5 outline-none" tabIndex={0}>
              <h3
                className={`${homeContentText.cardTitle} cursor-default transition-colors duration-300 group-hover/title:text-[#8ee04f] group-focus-within/title:text-[#8ee04f]`}
              >
                {card.title}
              </h3>
              <div
                className={
                  'grid transition-[grid-template-rows,opacity] duration-300 ease-out ' +
                  'grid-rows-[0fr] opacity-0 ' +
                  'group-hover/title:grid-rows-[1fr] group-hover/title:opacity-100 ' +
                  'group-focus-within/title:grid-rows-[1fr] group-focus-within/title:opacity-100 ' +
                  '[@media(hover:none)]:grid-rows-[1fr] [@media(hover:none)]:opacity-100'
                }
              >
                <p className={`mt-2.5 min-h-0 overflow-hidden ${homeContentText.bodySm}`}>
                  {card.description}
                </p>
              </div>
            </div>
            <a href={card.link} className={`mt-5 ${homeContentText.link}`}>
              Learn More
              <i className="ri-arrow-right-line" />
            </a>
          </article>
        ))}
      </div>
    </HomeSection>
  );
}
