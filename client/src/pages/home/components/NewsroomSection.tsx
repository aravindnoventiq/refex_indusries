import { useState, useEffect } from 'react';
import { homeCmsApi } from '../../../services/api';
import { HomeLoading, HomeSection, getHomeImageUrl, homeMobileSnapRow, homeMobileSnapItem, useHomeTheme } from './HomeSection';

interface NewsItem {
  id: number;
  title: string;
  image: string;
  link: string;
  category?: string;
  publishedDate?: string;
  order: number;
  isActive: boolean;
}

const fallbackNews: NewsItem[] = [
  {
    id: 1,
    title: 'Dinesh Agarwal, CEO of Refex Group, on ET Now',
    image: 'https://refex.co.in/wp-content/uploads/2025/11/newsroom-thumbnail-video.jpg',
    link: '/press_releases/dinesh-agarwal-ceo-of-refex-group-on-et-now/',
    category: 'Press Release',
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    title: 'Refex Mobility expands operations to Delhi NCR',
    image: 'https://refex.co.in/wp-content/uploads/2025/11/Refex-Mobility-expands.jpg',
    link: '/press_releases/refex-mobility-expands-operations-to-delhi-ncr/',
    category: 'Press Release',
    order: 2,
    isActive: true,
  },
  {
    id: 3,
    title: 'Refex eVeelz rebrands as Refex Mobility',
    image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/2675d7edc8e086e4c4be378eba93a660.jpeg',
    link: '/press_releases/refex-eveelz-rebrands-as-refex-mobility-to-consolidate-focus-on-existing-tier-1-market/',
    category: 'Press Release',
    order: 3,
    isActive: true,
  },
];

export default function NewsroomSection() {
  const { text, imageCard, imageCardMobile, hairline, newsTitle } = useHomeTheme();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await homeCmsApi.getNewsItems();
        const activeNews = (data || [])
          .filter((item: NewsItem) => item.isActive)
          .sort((a: NewsItem, b: NewsItem) => (a.order || 0) - (b.order || 0));
        setNews(activeNews.length > 0 ? activeNews : fallbackNews);
      } catch (error) {
        console.error('Failed to fetch news items:', error);
        setNews(fallbackNews);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return <HomeLoading />;
  if (news.length === 0) return null;

  return (
    <HomeSection
      id="newsroom"
      title="Newsroom"
      compact
      headerExtra={
        <a href="/newsroom/" className={`${text.link} shrink-0`}>
          View All
          <i className="ri-arrow-right-line" />
        </a>
      }
    >
      <div className={`${homeMobileSnapRow} sm:grid-cols-2 sm:gap-3 lg:grid-cols-4 lg:gap-4`}>
        {news.slice(0, 6).map((item) => (
          <a
            key={item.id}
            href={item.link}
            className={`${homeMobileSnapItem} ${imageCard} ${imageCardMobile} flex flex-col`}
          >
            <div className="relative aspect-[16/8] overflow-hidden bg-black/40 sm:aspect-[16/7]">
              <img
                src={getHomeImageUrl(item.image)}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {item.category && (
                <span className="absolute left-2.5 top-2.5 bg-[#7cd244] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#0a0a0a] sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]">
                  {item.category}
                </span>
              )}
            </div>
            <div className={`flex flex-1 flex-col border-t p-2.5 sm:p-3 ${hairline}`}>
              <h3 className={`line-clamp-2 text-[0.8rem] font-semibold leading-snug sm:text-[0.8125rem] ${newsTitle}`}>
                {item.title}
              </h3>
              <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7cd244] sm:mt-3 sm:text-xs">
                Read More
                <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </HomeSection>
  );
}
