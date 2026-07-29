import { useState, useEffect } from 'react';
import { newsroomCmsApi } from '../../../services/api';
import {
  NEWSROOM_HERO_FALLBACK_BG,
  newsroomContainer,
  newsroomSpinnerClass,
} from '../newsroomLayout';

interface NewsroomHero {
  id: number;
  title: string;
  description?: string;
  backgroundImage?: string;
  isActive: boolean;
}

export default function HeroSection() {
  const [hero, setHero] = useState<NewsroomHero | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHero();
  }, []);

  const loadHero = async () => {
    const fallbackHero: NewsroomHero = {
      id: 1,
      title: 'NEWSROOM',
      description:
        'Get hyped for the latest buzz on our businesses and community initiatives, as well as inspiring stories about the amazing people behind them!',
      backgroundImage: NEWSROOM_HERO_FALLBACK_BG,
      isActive: true,
    };

    try {
      setLoading(true);
      const data = await newsroomCmsApi.getHero();
      if (data && (data.isActive === true || data.isActive === undefined || data.isActive === null)) {
        setHero(data);
      } else {
        setHero(fallbackHero);
      }
    } catch (error) {
      console.error('Failed to fetch newsroom hero section:', error);
      setHero(fallbackHero);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative flex min-h-[min(52dvh,420px)] items-center justify-center overflow-hidden bg-[#1f1f1f] sm:min-h-[min(60dvh,480px)]">
        <div className={newsroomSpinnerClass} aria-hidden />
      </section>
    );
  }

  if (!hero || !hero.isActive) {
    return null;
  }

  return (
    <section
      className="relative flex min-h-[min(52dvh,420px)] items-center justify-center overflow-hidden sm:min-h-[min(60dvh,480px)]"
      aria-labelledby="newsroom-hero-title"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: hero.backgroundImage ? `url(${hero.backgroundImage})` : `url(${NEWSROOM_HERO_FALLBACK_BG})`,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/55"
        aria-hidden
      />

      <div className={`relative z-10 ${newsroomContainer} py-14 text-center sm:py-16`}>
        {/* <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#7cd244] sm:text-sm">
          Media Centre
        </p> */}
        <h1
          id="newsroom-hero-title"
          className="mx-auto max-w-4xl font-serif text-3xl font-medium leading-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]"
        >
          {hero.title}
        </h1>
        {hero.description ? (
          <p
            className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg md:text-xl"
            dangerouslySetInnerHTML={{ __html: hero.description.replace(/\n/g, '<br />') }}
          />
        ) : null}
      </div>
    </section>
  );
}
