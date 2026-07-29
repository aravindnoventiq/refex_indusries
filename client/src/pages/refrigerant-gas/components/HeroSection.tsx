import { useState, useEffect } from 'react';
import { refrigerantGasCmsApi } from '../../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const getFullUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`;
  }
  return `${API_BASE_URL}/${url}`;
};

interface HeroSlide {
  image: string;
}

interface RefrigerantGasHero {
  id?: number;
  title: string;
  subtitle?: string;
  slides: HeroSlide[];
  isActive: boolean;
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hero, setHero] = useState<RefrigerantGasHero | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        setLoading(true);
        const data = await refrigerantGasCmsApi.getHero();
        if (data && (data.isActive === true || data.isActive === undefined || data.isActive === null)) {
          setHero(data);
        } else {
          // Fallback to default data
          setHero({
            title: 'Refrigerant Gas',
            subtitle: 'Pioneers and Conscious Innovators in the Refrigerant gas Industry',
            slides: [
              { image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/7e65098f2c805c7d0751bf300f7141ee.jpeg' },
              { image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/9e9a1a363940562c00be40d288cae320.jpeg' },
            ],
            isActive: true,
          });
        }
      } catch (error) {
        console.error('Failed to fetch hero:', error);
        // Fallback to default data if API fails
        setHero({
          title: 'Refrigerant Gas',
          subtitle: 'Pioneers and Conscious Innovators in the Refrigerant gas Industry',
          slides: [
            { image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/7e65098f2c805c7d0751bf300f7141ee.jpeg' },
            { image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/9e9a1a363940562c00be40d288cae320.jpeg' },
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
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gray-200">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading hero section...</p>
        </div>
      </section>
    );
  }

  if (!hero || !hero.slides || hero.slides.length === 0) {
    return null;
  }

  return (
    <section className="relative h-[600px] flex items-end overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        {hero.slides.map((slide, index) => (
          <img
            key={index}
            src={getFullUrl(slide.image)}
            alt="Refrigerant Gas"
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1920x600?text=Image+Not+Found';
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
        <div className="max-w-2xl ml-0">
          <h1 
            className="font-bold mb-4 uppercase tracking-wide" 
            style={{ fontSize: '40px', color: '#83e034' }}
            data-aos="fade-right"
          >
            {hero.title}
          </h1>
          {hero.subtitle && (
            <p 
              className="text-white font-light" 
              style={{ fontSize: '20px' }}
              data-aos="fade-right"
              data-aos-delay="100"
            >
              {hero.subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
