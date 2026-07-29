import { useState, useEffect } from 'react';
import { homeCmsApi } from '../../../services/api';
import { HomeLoading, HomeSection, homeImageCard, homeContentText, getHomeImageUrl } from './HomeSection';

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
      label="Latest Updates"
      title="Newsroom"
      compact
      headerExtra={
        <a href="/newsroom/" className={`${homeContentText.link} shrink-0`}>
          View All
          <i className="ri-arrow-right-line" />
        </a>
      }
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {news.slice(0, 6).map((item) => (
          <a key={item.id} href={item.link} className={`${homeImageCard} flex flex-col`}>
            <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
              <img
                src={getHomeImageUrl(item.image)}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {item.category && (
                <span className="absolute left-3 top-3 bg-[#7cd244] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#0a0a0a]">
                  {item.category}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col border-t border-white/10 p-4 sm:p-5">
              <h3 className="line-clamp-3 text-[0.95rem] font-semibold leading-snug text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.5)] transition-colors group-hover:text-[#8ee04f] sm:text-base">
                {item.title}
              </h3>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#7cd244]">
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
