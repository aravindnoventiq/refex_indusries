import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { gsap, prefersReducedMotion } from '../../about-us/aboutGsap';
import { ashRefexGradientText } from '../../ash-utilization/ashLayout';
import { esgContainer } from '../esgLayout';

const ESG_VIDEO = '/esg/lotus-swan-intro.mp4';

const ESG_INTRO_WORDS = [
  'At',
  'Refex',
  'Industries',
  'Limited,',
  'we',
  'believe',
  'in',
  'creating',
  'a',
  'better',
  'world',
  'through',
  'sustainable',
  'business',
  'practices.',
  'We',
  'prioritize',
  'People,',
  'Planet,',
  'and',
  'Profit',
  'equally',
  'and',
  'are',
  'committed',
  'to',
  'becoming',
  'a',
  'Future-Ready',
  'ESG',
  'Governance',
  'Enterprise',
  'by',
  '2035',
  'and',
  'Carbon',
  'Neutral',
  'Company',
  'by',
  '2035',
  '(Net',
  'Zero',
  'by',
  '2040).',
];

function EsgHeroCopy({ introRef }: { introRef: RefObject<HTMLParagraphElement | null> }) {
  return (
    <div className="max-w-5xl">
      <p
        ref={introRef}
        data-esg-intro
        className="text-lg font-medium leading-[1.75] text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.65)] sm:text-xl md:text-[1.35rem] lg:text-[1.425rem] lg:leading-[1.78]"
      >
        {ESG_INTRO_WORDS.map((word, index) => {
          const isRefex = word === 'Refex';
          const isLast = index === ESG_INTRO_WORDS.length - 1;

          return (
            <span
              key={`${word}-${index}`}
              data-esg-word
              className={`inline-block will-change-transform ${isRefex ? `font-bold ${ashRefexGradientText}` : ''}`}
            >
              {word}
              {!isLast ? '\u00A0' : ''}
            </span>
          );
        })}
      </p>
    </div>
  );
}

function EsgHeroVideo({ eager = false }: { eager?: boolean }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);

  const playVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion()) return;
    try {
      await video.play();
    } catch {
      /* autoplay blocked */
    }
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const markReady = () => setReady(true);
    video.addEventListener('loadeddata', markReady);
    video.addEventListener('canplay', markReady);
    if (video.readyState >= 2) markReady();

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.05) void playVideo();
        else video.pause();
      },
      { threshold: [0, 0.05, 0.2] },
    );

    io.observe(wrap);
    if (eager) void playVideo();

    return () => {
      video.removeEventListener('loadeddata', markReady);
      video.removeEventListener('canplay', markReady);
      io.disconnect();
      video.pause();
    };
  }, [eager, playVideo]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden bg-[#050505]">
      <video
        ref={videoRef}
        src={ESG_VIDEO}
        muted
        loop
        playsInline
        preload={eager ? 'auto' : 'metadata'}
        disablePictureInPicture
        className={`absolute inset-0 h-full w-full scale-[1.02] object-cover object-center transition-opacity duration-500 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Lotus to swan sustainability animation"
      />
      {!ready && <div className="absolute inset-0 animate-pulse bg-white/5" aria-hidden />}
    </div>
  );
}

export default function EsgTopSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLParagraphElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const intro = introRef.current;
    if (!section || !intro) return;

    const words = intro.querySelectorAll<HTMLElement>('[data-esg-word]');
    if (!words.length) return;

    if (prefersReducedMotion()) {
      gsap.set(words, { autoAlpha: 1, y: 0, filter: 'none' });
      return;
    }

    let fallbackTimer = 0;

    const ctx = gsap.context(() => {
      gsap.set(words, { autoAlpha: 0, y: 28, filter: 'blur(8px)' });

      fallbackTimer = window.setTimeout(() => {
        gsap.set(words, { autoAlpha: 1, y: 0, filter: 'none' });
      }, 2800);

      gsap.to(words, {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.55,
        stagger: 0.04,
        ease: 'power3.out',
        delay: 0.65,
        onComplete: () => window.clearTimeout(fallbackTimer),
      });
    }, section);

    return () => {
      window.clearTimeout(fallbackTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="esg-vision"
      className="relative min-h-[88dvh] overflow-hidden bg-[#050505] md:min-h-[100dvh]"
    >
      <div className="absolute inset-0">
        <EsgHeroVideo eager />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[min(62vh,560px)] bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(124,210,68,0.12),transparent_62%)]"
      />

      <div
        className={`relative z-30 flex min-h-[88dvh] flex-col justify-end md:min-h-[100dvh] ${esgContainer} pb-10 pt-[calc(var(--header-offset,5.25rem)+1.5rem)] sm:pb-12`}
      >
        <EsgHeroCopy introRef={introRef} />
      </div>
    </section>
  );
}
