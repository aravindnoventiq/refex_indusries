import { useState, useEffect } from 'react';
import { venwindRefexCmsApi } from '../../../services/api';

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

interface VenwindRefexHero {
  id: number;
  title: string;
  description?: string;
  backgroundImage?: string;
  isActive: boolean;
}

export default function HeroSection() {
  const [hero, setHero] = useState<VenwindRefexHero | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHero();
  }, []);

  const loadHero = async () => {
    try {
      setLoading(true);
      const data = await venwindRefexCmsApi.getHero();
      if (data && (data.isActive === true || data.isActive === undefined || data.isActive === null)) {
        setHero(data);
      } else {
        setHero(null);
      }
    } catch (err) {
      console.error('Failed to load hero section:', err);
      // Fallback to default data
      setHero({
        id: 1,
        title: 'Venwind Refex',
        description: 'Explore the power of cutting-edge manufacturing technology in partnership with Vensys Energy AG, Germany',
        backgroundImage: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/8ca77e6a99de702492a68fcdb3ec6557.jpeg',
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative flex items-center justify-center overflow-hidden bg-gray-200" style={{ height: '590px' }}>
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </section>
    );
  }

  if (!hero) {
    return null;
  }

  return (
    <section className="relative flex items-end justify-start overflow-hidden" style={{ height: '590px' }}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: hero.backgroundImage
            ? `url(${getFullUrl(hero.backgroundImage)})`
            : undefined,
          backgroundColor: hero.backgroundImage ? undefined : '#1f2937',
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content - Positioned at bottom left */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-12">
        <div className="max-w-2xl ml-0">
          <h1 
            className="font-bold mb-4 uppercase tracking-wide" 
            style={{ fontSize: '40px', color: '#83e034' }}
            data-aos="fade-right"
          >
            {hero.title}
          </h1>
          {hero.description && (
            <p 
              className="text-white font-light" 
              style={{ fontSize: '20px' }}
              data-aos="fade-right"
              data-aos-delay="100"
            >
              {hero.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
