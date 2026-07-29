import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../about-us/aboutGsap';

const HUMMINGBIRD_VIDEO = '/esg/hummingbird.mp4';
const BRANCH_IMAGE = '/esg/branch.png';

export default function AwardsHighlightsVisual() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const branchRef = useRef<HTMLDivElement | null>(null);
  const birdRef = useRef<HTMLVideoElement | null>(null);

  const playVideo = useCallback(async () => {
    const video = birdRef.current;
    if (!video || prefersReducedMotion()) return;
    try {
      await video.play();
    } catch {
      /* autoplay blocked */
    }
  }, []);

  const pauseVideo = useCallback(() => {
    birdRef.current?.pause();
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void playVideo();
        else pauseVideo();
      },
      { threshold: 0.12 },
    );

    io.observe(wrap);
    void playVideo();
    return () => io.disconnect();
  }, [pauseVideo, playVideo]);

  useLayoutEffect(() => {
    const branch = branchRef.current;
    if (!branch || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(branch, {
        rotation: 0.6,
        duration: 5.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        transformOrigin: '88% 58%',
      });
    }, branch);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="theme-keep-light mb-6 flex w-full justify-end sm:mb-8" aria-hidden>
      <div className="relative flex items-end justify-end gap-1 sm:gap-2">
        <div className="relative z-10 mb-[6%] w-[min(42vw,210px)] shrink-0 sm:mb-[7%] sm:w-[230px] md:w-[250px]">
          <video
            ref={birdRef}
            src={HUMMINGBIRD_VIDEO}
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            className="block h-auto w-full origin-center scale-[1.03] object-contain [mix-blend-mode:multiply]"
          />
        </div>

        <div
          ref={branchRef}
          className="pointer-events-none relative w-[min(62vw,360px)] shrink-0 sm:w-[400px] lg:w-[440px]"
        >
          <img
            src={BRANCH_IMAGE}
            alt=""
            className="block h-auto w-full [mix-blend-mode:lighten]"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
