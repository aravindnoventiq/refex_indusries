import { useState, useEffect } from 'react';
import { investorsCmsApi } from '../../../services/api';
import {
  INVESTOR_HERO_FALLBACK_BG,
  investorContainer,
  investorSpinnerClass,
} from '../investorLayout';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

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

interface HeroSectionProps {
  title?: string;
  withHeaderOffset?: boolean;
}

interface InvestorHero {
  id?: number;
  title: string;
  backgroundImage?: string;
  isActive: boolean;
}

export default function HeroSection({ title: propTitle, withHeaderOffset = true }: HeroSectionProps) {
  const [heroData, setHeroData] = useState<InvestorHero | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    try {
      const data = await investorsCmsApi.getHero();
      if (data && data.isActive) {
        setHeroData(data);
      } else {
        setHeroData({
          title: propTitle || 'Investors',
          backgroundImage: INVESTOR_HERO_FALLBACK_BG,
          isActive: true,
        });
      }
    } catch {
      setHeroData({
        title: propTitle || 'Investors',
        backgroundImage: INVESTOR_HERO_FALLBACK_BG,
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const displayTitle = propTitle || heroData?.title || 'Investors';
  const backgroundImage = getFullUrl(heroData?.backgroundImage || INVESTOR_HERO_FALLBACK_BG);

  if (loading) {
    return (
      <section className="relative flex min-h-[min(52dvh,420px)] items-center justify-center overflow-hidden bg-[#1f1f1f] sm:min-h-[min(60dvh,480px)]">
        <div className={investorSpinnerClass} aria-hidden />
      </section>
    );
  }

  return (
    <section
      className={`relative flex min-h-[min(52dvh,420px)] items-center justify-center overflow-hidden sm:min-h-[min(60dvh,480px)] ${
        withHeaderOffset ? 'mt-[var(--header-offset,5.25rem)]' : ''
      }`}
      aria-labelledby="investor-hero-title"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/55"
        aria-hidden
      />

      <div className={`relative z-10 ${investorContainer} py-14 text-center sm:py-16`}>
        {/* <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#7cd244] sm:text-sm">
          Investor Relations
        </p> */}
        <h1
          id="investor-hero-title"
          className="mx-auto max-w-4xl font-serif text-3xl font-medium leading-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]"
        >
          {displayTitle}
        </h1>
      </div>
    </section>
  );
}
