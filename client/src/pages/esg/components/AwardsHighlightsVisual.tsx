import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useSiteTheme } from '../../../components/SiteThemeProvider';
import { gsap, prefersReducedMotion } from '../../about-us/aboutGsap';

const HUMMINGBIRD_VIDEO = '/esg/hummingbird.mp4';
/** White pixels replaced with #0a0e0c to match ESG section bg in dark theme */
const HUMMINGBIRD_VIDEO_DARK = '/esg/hummingbird-dark.mp4?v=2';
const BRANCH_IMAGE = '/esg/branch.png';

type AwardsHighlightsVisualProps = {
  placement?: 'section' | 'hero';
};

export default function AwardsHighlightsVisual({
  placement = 'section',
}: AwardsHighlightsVisualProps) {
  const { theme } = useSiteTheme();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const branchRef = useRef<HTMLDivElement | null>(null);
  const birdRef = useRef<HTMLVideoElement | null>(null);
  const isHero = placement === 'hero';
  const birdSrc = theme === 'dark' ? HUMMINGBIRD_VIDEO_DARK : HUMMINGBIRD_VIDEO;

  const playVideo = useCallback(async () => {
    if (prefersReducedMotion()) return;
    const video = birdRef.current;
    if (!video) return;
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

  useEffect(() => {
    const video = birdRef.current;
    if (!video) return;
    video.load();
    void playVideo();
  }, [birdSrc, playVideo]);

  useLayoutEffect(() => {
    const bird = birdRef.current;
    const branch = branchRef.current;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (bird) {
        gsap.to(bird, {
          y: -10,
          duration: isHero ? 2.4 : 3.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
      if (branch) {
        gsap.to(branch, {
          rotation: 0.6,
          duration: 5.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          transformOrigin: '88% 58%',
        });
      }
    }, wrapRef);

    return () => ctx.revert();
  }, [isHero]);

  const birdVideo = (
    <video
      ref={birdRef}
      src={birdSrc}
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      className="block h-auto w-full origin-center object-contain"
    />
  );

  const branchImage = (
    <img
      src={BRANCH_IMAGE}
      alt=""
      className="block h-auto w-full"
      loading={isHero ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
  );

  return (
    <div
      ref={wrapRef}
      className={
        isHero
          ? 'esg-awards-nature-visual esg-awards-nature-visual--hero relative w-full overflow-visible'
          : 'esg-awards-nature-visual mb-6 flex w-full justify-end overflow-hidden sm:mb-8'
      }
      aria-hidden
    >
      {isHero ? (
        <div className="relative mx-auto aspect-[5/4] w-full max-w-[28rem]">
          {
          <div className="esg-awards-nature-canvas">
          <div className="relative flex items-end justify-end gap-0.5 sm:gap-2">
            <div className="esg-awards-bird relative z-10 mb-[6%] w-[min(42vw,210px)] shrink-0 sm:mb-[7%] sm:w-[230px] md:w-[250px]">
              {birdVideo}
            </div>
            
            <div
              ref={branchRef}
              className="esg-awards-branch pointer-events-none relative w-[min(62vw,360px)] shrink-0 sm:w-[400px] lg:w-[440px]"
            >
              {branchImage}
            </div>
          </div>
        </div>}
        </div>
      ) : (
        <div className="esg-awards-nature-canvas">
          {/* <div className="relative flex items-end justify-end gap-0.5 sm:gap-2">
            <div className="esg-awards-bird relative z-10 mb-[6%] w-[min(42vw,210px)] shrink-0 sm:mb-[7%] sm:w-[230px] md:w-[250px]">
              {birdVideo}
            </div>
            <div
              ref={branchRef}
              className="esg-awards-branch pointer-events-none relative w-[min(62vw,360px)] shrink-0 sm:w-[400px] lg:w-[440px]"
            >
              {branchImage}
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
}
