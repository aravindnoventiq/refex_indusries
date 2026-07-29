import { useState, useEffect } from 'react';
import { greenMobilityCmsApi } from '../../../services/api';

interface HeroSlide {
  image: string;
}

interface GreenMobilityHero {
  id?: number;
  title: string;
  subtitle?: string;
  slides: HeroSlide[];
  isActive: boolean;
}

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hero, setHero] = useState<GreenMobilityHero | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        setLoading(true);
        const data = await greenMobilityCmsApi.getHero();
        if (data && (data.isActive === true || data.isActive === undefined || data.isActive === null)) {
          setHero(data);
        } else {
          // Fallback to default data
          setHero({
            title: 'Refex Mobility',
            subtitle: 'The Most Trusted, Sustainable Mobility Partner in India',
            slides: [
              { image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/e3bf83d0ca42ec3e1b21d62acc25a3cd.jpeg' },
              { image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/ffa03b0c227885e7d623744243542115.jpeg' },
            ],
            isActive: true,
          });
        }
      } catch (error) {
        console.error('Failed to fetch hero:', error);
        // Fallback to default data if API fails
        setHero({
          title: 'Refex Mobility',
          subtitle: 'The Most Trusted, Sustainable Mobility Partner in India',
          slides: [
            { image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/e3bf83d0ca42ec3e1b21d62acc25a3cd.jpeg' },
            { image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/ffa03b0c227885e7d623744243542115.jpeg' },
          ],
          isActive: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  useEffect(() => {
    if (!hero || !hero.slides || hero.slides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % hero.slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [hero]);

  if (loading) {
    return (
      <div className="relative flex min-h-[280px] h-[min(600px,55vh)] sm:h-[min(600px,65vh)] items-center justify-center overflow-hidden bg-gray-200 mt-[var(--header-offset,5.25rem)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading hero section...</p>
        </div>
      </div>
    );
  }

  if (!hero || !hero.slides || hero.slides.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full min-h-[280px] h-[min(600px,55vh)] sm:h-[min(600px,65vh)] overflow-hidden mt-[var(--header-offset,5.25rem)]">
      {/* Slides */}
      {hero.slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        </div>
      ))}

      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-end pb-8 sm:pb-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="mb-2 animate-fadeInUp text-2xl font-bold text-[#83e034] sm:mb-3 sm:text-3xl lg:text-4xl">
              {hero.title}
            </h1>
            {hero.subtitle && (
              <p className="animate-fadeInUp text-base text-white sm:text-lg lg:text-xl" style={{ animationDelay: '0.2s' }}>
                {hero.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
