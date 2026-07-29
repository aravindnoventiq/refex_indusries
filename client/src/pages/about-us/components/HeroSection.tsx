import { useState, useEffect, useRef } from 'react';
import { aboutCmsApi } from '../../../services/api';
import { gsap, SplitText, prefersReducedMotion, isMobileViewport } from '../aboutGsap';
import { aboutSectionContainer } from '../aboutLayout';

interface AboutHero {
  id?: number;
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage: string;
  logoCards?: Array<{ name: string; logoUrl: string; link?: string }>;
  isActive: boolean;
}

const FALLBACK_BG =
  'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/53db3ce33636656bd3b6d29ea93a1205.png';

export default function HeroSection() {
  const [hero, setHero] = useState<AboutHero | null>(null);
  const [loading, setLoading] = useState(true);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        setLoading(true);
        const data = await aboutCmsApi.getHero();
        if (!data || data.isActive === false) {
          setHero({
            title: 'A Story of Passion, Determination, and Growth',
            subtitle: '',
            description: '',
            backgroundImage: FALLBACK_BG,
            logoCards: [],
            isActive: true,
          });
        } else {
          setHero(data);
        }
      } catch {
        setHero({
          title: 'A Story of Passion, Determination, and Growth',
          subtitle: '',
          description: '',
          backgroundImage: FALLBACK_BG,
          logoCards: [],
          isActive: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  useEffect(() => {
    if (loading || !rootRef.current) return;
    if (prefersReducedMotion() || isMobileViewport()) {
      gsap.set(rootRef.current.querySelectorAll('[data-hero-anim], [data-hero-title]'), {
        autoAlpha: 1,
        y: 0,
        yPercent: 0,
        rotateX: 0,
      });
      return;
    }

    const root = rootRef.current;
    const titleEl = root.querySelector<HTMLElement>('[data-hero-title]');
    const bg = root.querySelector<HTMLElement>('[data-hero-bg]');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.12 });

      tl.fromTo(
        root.querySelectorAll('[data-hero-anim]'),
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          immediateRender: false,
        },
      );

      if (titleEl) {
        try {
          const split = SplitText.create(titleEl, {
            type: 'words,chars',
            wordsClass: 'about-split-word',
            charsClass: 'about-split-char',
            aria: 'auto',
          });
          tl.fromTo(
            split.chars,
            { autoAlpha: 0, yPercent: 60, rotateX: -45 },
            {
              autoAlpha: 1,
              yPercent: 0,
              rotateX: 0,
              duration: 0.65,
              stagger: 0.02,
              ease: 'power3.out',
              immediateRender: false,
            },
            '-=0.5',
          );
        } catch {
          tl.fromTo(
            titleEl,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out', immediateRender: false },
            '-=0.5',
          );
        }
      }

      if (bg) {
        gsap.fromTo(
          bg,
          { scale: 1.08 },
          { scale: 1, duration: 1.4, ease: 'power2.out', immediateRender: false },
        );
        gsap.to(bg, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, [loading, hero?.title]);

  const display = hero || {
    title: 'A Story of Passion, Determination, and Growth',
    backgroundImage: FALLBACK_BG,
  };

  return (
    <div
      ref={rootRef}
      className="relative h-[min(58vh,480px)] min-h-[280px] overflow-hidden sm:h-[min(70vh,560px)] sm:min-h-[320px]"
    >
      <div
        data-hero-bg
        className="absolute inset-0 bg-cover bg-top bg-no-repeat will-change-transform"
        style={{ backgroundImage: `url(${display.backgroundImage || FALLBACK_BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />

      <div className={`relative z-10 flex h-full items-end pb-10 lg:pb-14 ${aboutSectionContainer}`}>
        <div className="max-w-3xl text-left" style={{ perspective: '700px' }}>
          <p
            data-hero-anim
            data-hero-eyebrow
            className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#7cd244]"
          >
            About Refex
          </p>
          {display.subtitle && (
            <h5 data-hero-anim data-hero-subtitle className="mb-2 text-sm font-medium text-white/85">
              {display.subtitle}
            </h5>
          )}
          <h1
            data-hero-title
            className="text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl md:text-4xl"
          >
            {display.title}
          </h1>
          {display.description && (
            <p
              data-hero-anim
              data-hero-desc
              className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80"
            >
              {display.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
