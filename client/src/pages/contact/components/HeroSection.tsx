import { useState, useEffect } from 'react';
import { contactCmsApi } from '../../../services/api';
import { CONTACT_HERO_BG, contactContainer } from '../contactLayout';

interface ContactHero {
  id: number;
  title: string;
  description?: string;
  backgroundImage?: string;
  isActive: boolean;
}

const FALLBACK_HERO: ContactHero = {
  id: 1,
  title: "Partnering with India's Thermal Ecosystem for Responsible Ash Utilization",
  description:
    'Join us in creating a sustainable future through innovative circular economy solutions. Together, we can transform industrial by-products into valuable infrastructure resources.',
  backgroundImage: CONTACT_HERO_BG,
  isActive: true,
};

export default function HeroSection() {
  const [hero, setHero] = useState<ContactHero | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHero();
  }, []);

  const loadHero = async () => {
    try {
      setLoading(true);
      const data = await contactCmsApi.getHero();
      if (data && (data.isActive === true || data.isActive === undefined || data.isActive === null)) {
        setHero(data);
      } else {
        setHero(FALLBACK_HERO);
      }
    } catch (error) {
      console.error('Failed to fetch Contact Hero section:', error);
      setHero(FALLBACK_HERO);
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <section className="relative flex min-h-[min(72dvh,680px)] items-center justify-center bg-[#1f1f1f]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-[#7cd244]" />
          <p className="mt-4 text-white/80">Loading...</p>
        </div>
      </section>
    );
  }

  if (!hero || !hero.isActive) {
    return null;
  }

  const backgroundImage = hero.backgroundImage || CONTACT_HERO_BG;

  return (
    <section
      className="relative flex min-h-[min(100dvh,920px)] items-center justify-center overflow-hidden"
      aria-labelledby="contact-hero-title"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50"
        aria-hidden
      />

      <div className={`relative z-10 ${contactContainer} py-16 text-center sm:py-20`}>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#7cd244] sm:text-sm">
          Contact Us
        </p>
        <h1
          id="contact-hero-title"
          className="mx-auto max-w-4xl font-serif text-3xl font-medium leading-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]"
        >
          {hero.title}
        </h1>
        {hero.description ? (
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg md:text-xl">
            {hero.description}
          </p>
        ) : null}
        <button
          type="button"
          onClick={scrollToForm}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2d5016] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(45,80,22,0.35)] transition-all hover:bg-[#234015] hover:gap-3 sm:px-10 sm:text-base"
        >
          Get in Touch
          <i className="ri-arrow-down-line text-lg" aria-hidden />
        </button>
      </div>
    </section>
  );
}
