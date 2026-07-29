import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../about-us/aboutGsap';
import { esgContainer } from '../esgLayout';

const NATURE_VIDEO = '/esg/nature-showcase.mp4?v=202607271628';

const CLOSING_TEXT =
  'Together, these initiatives reflect Refex Group’s commitment to building resilient communities, conserving natural ecosystems, and driving sustainable development as we work towards our long-term goal of positively impacting 1 million lives.';

export default function EsgNatureShowcaseSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoWrapRef = useRef<HTMLDivElement | null>(null);
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
    const wrap = videoWrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const markReady = () => setReady(true);
    video.addEventListener('loadeddata', markReady);
    video.addEventListener('canplay', markReady);
    if (video.readyState >= 2) markReady();

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) void playVideo();
        else video.pause();
      },
      { threshold: [0, 0.1, 0.35] },
    );

    io.observe(wrap);
    void playVideo();

    return () => {
      video.removeEventListener('loadeddata', markReady);
      video.removeEventListener('canplay', markReady);
      io.disconnect();
      video.pause();
    };
  }, [playVideo]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const videoEl = section.querySelector<HTMLElement>('[data-nature-video]');
    const closing = section.querySelector<HTMLElement>('[data-nature-closing]');

    if (prefersReducedMotion()) {
      if (videoEl) gsap.set(videoEl, { autoAlpha: 1, y: 0, scale: 1 });
      if (closing) gsap.set(closing, { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      if (videoEl) gsap.set(videoEl, { autoAlpha: 0, y: 28, scale: 0.98 });
      if (closing) gsap.set(closing, { autoAlpha: 0, y: 20 });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          if (videoEl) {
            gsap.to(videoEl, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'power3.out',
            });
          }
          if (closing) {
            gsap.to(closing, {
              autoAlpha: 1,
              y: 0,
              duration: 0.85,
              delay: 0.35,
              ease: 'power3.out',
            });
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="esg-nature-showcase"
      className="relative overflow-hidden bg-[#fbfbf8]"
      aria-labelledby="esg-nature-closing"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-[10%] top-[8%] h-[38vw] max-h-[420px] w-[38vw] max-w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(76,140,43,0.08),transparent_70%)] blur-3xl" />
        <div className="absolute -right-[6%] bottom-[6%] h-[32vw] max-h-[360px] w-[32vw] max-w-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(76,140,43,0.06),transparent_70%)] blur-3xl" />
      </div>

      <div className={`relative mx-auto ${esgContainer} py-10 sm:py-14 lg:py-16`}>
        <div
          ref={videoWrapRef}
          data-nature-video
          className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-[#fbfbf8]"
        >
          {!ready && (
            <div
              className="absolute inset-0 z-10 flex min-h-[280px] items-center justify-center bg-[#f3f3f0] sm:min-h-[360px] md:min-h-[420px]"
              aria-hidden
            >
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#4C8C2B]/25 border-t-[#4C8C2B]" />
            </div>
          )}
          <video
            ref={videoRef}
            src={NATURE_VIDEO}
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            className={`block h-auto w-full object-contain transition-opacity duration-700 ${
              ready ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="Birds, butterfly and nature animation"
          />
        </div>

        <p
          id="esg-nature-closing"
          data-nature-closing
          className="mx-auto mt-10 max-w-4xl text-center text-base leading-relaxed text-[#4a4a4a] sm:mt-12 sm:text-lg sm:leading-[1.75]"
        >
          {CLOSING_TEXT}
        </p>
      </div>
    </section>
  );
}
