import { useEffect, useRef, useState } from 'react';
import { esgCmsApi } from '../../../services/api';
import { gsap, prefersReducedMotion } from '../../about-us/aboutGsap';
import { esgBrandGreen, esgContainer } from '../esgLayout';
import { getFullUrl } from '../esgUtils';
import EsgSectionLoader from './EsgSectionLoader';

interface EsgHero {
  id: number;
  title: string;
  description1?: string;
  description2?: string;
  backgroundImage?: string;
  button1Text?: string;
  button1Link?: string;
  button2Text?: string;
  button2Link?: string;
  isActive: boolean;
}

const FALLBACK_HERO: EsgHero = {
  id: 1,
  title: 'ESG',
  description1: "At Refex, we're constantly changing from the inside to change the world outside.",
  description2: 'Learn how our business strives to make a difference.',
  backgroundImage: 'https://refex.co.in/wp-content/uploads/2024/12/esg-banner.jpg',
  button1Text: 'Download Sustainability Report',
  button1Link: 'https://refex.co.in/wp-content/uploads/2025/02/Sustainability-Report-2023-24.pdf',
  button2Text: 'BRSR Report',
  button2Link: 'https://refex.co.in/wp-content/uploads/2025/09/BRSR.pdf',
  isActive: true,
};

export default function HeroSection() {
  const [hero, setHero] = useState<EsgHero | null>(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        setLoading(true);
        const data = await esgCmsApi.getHero();
        if (data && (data.isActive === true || data.isActive === undefined)) {
          setHero(data);
        } else {
          setHero(FALLBACK_HERO);
        }
      } catch (error) {
        console.error('Failed to fetch hero section:', error);
        setHero(FALLBACK_HERO);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || loading || !hero) return;

    if (prefersReducedMotion()) {
      gsap.set(section.querySelectorAll('[data-esg-hero-anim]'), { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll('[data-esg-hero-anim]'), {
        autoAlpha: 0,
        y: 24,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [loading, hero]);

  if (loading) return <EsgSectionLoader label="Loading hero section..." />;
  if (!hero) return null;

  return (
    <section
      ref={sectionRef}
      id="esg-hero"
      className="relative flex min-h-[520px] items-center overflow-hidden sm:min-h-[580px] lg:min-h-[650px]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: hero.backgroundImage
            ? `url(${getFullUrl(hero.backgroundImage)})`
            : undefined,
          backgroundColor: hero.backgroundImage ? undefined : '#1f2937',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/40 to-black/25" />
      </div>

      <div className={`relative z-10 ${esgContainer}`}>
        <div className="flex flex-col gap-10 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-3xl" data-esg-hero-anim>
            <h2 className="mb-4 text-4xl font-bold sm:text-[42px]" style={{ color: esgBrandGreen }}>
              {hero.title}
            </h2>
            {hero.description1 && (
              <p className="mb-1 text-lg leading-relaxed text-white sm:text-xl">{hero.description1}</p>
            )}
            {hero.description2 && (
              <p className="text-lg leading-relaxed text-white/90 sm:text-xl">{hero.description2}</p>
            )}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row lg:min-w-[330px] lg:flex-col" data-esg-hero-anim>
            {hero.button1Text && hero.button1Link && (
              <a
                href={getFullUrl(hero.button1Link)}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full bg-[#7dc144] px-8 py-4 text-lg font-semibold text-white transition-colors duration-300 hover:bg-[#5ea027]"
              >
                <span>{hero.button1Text}</span>
                <i className="ri-arrow-right-line text-xl transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
            {hero.button2Text && hero.button2Link && (
              <a
                href={getFullUrl(hero.button2Link)}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full bg-[#7dc144] px-8 py-4 text-lg font-semibold text-white transition-colors duration-300 hover:bg-[#5ea027]"
              >
                <span>{hero.button2Text}</span>
                <i className="ri-arrow-right-line text-xl transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
