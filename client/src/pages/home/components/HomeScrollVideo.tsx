import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  HERO_VIDEOS,
  HOME_HERO_ID,
  HOME_POSTER,
  MOBILE_MAX_WIDTH,
  getHeroPinScrollPx,
  shouldUseStaticHomeBackground,
} from '../homeMotion';

gsap.registerPlugin(ScrollTrigger);

const SEEK_FPS = 10;
const FRAME_STEP = 1 / SEEK_FPS;

interface HomeScrollVideoProps {
  children: ReactNode;
}

function quantizeTime(seconds: number, duration: number): number {
  const clamped = Math.max(0, Math.min(seconds, Math.max(duration - FRAME_STEP, 0)));
  return Math.round(clamped / FRAME_STEP) * FRAME_STEP;
}

function seekVideo(video: HTMLVideoElement, time: number) {
  const fastSeek = (video as HTMLVideoElement & { fastSeek?: (t: number) => void }).fastSeek;
  if (typeof fastSeek === 'function') {
    fastSeek.call(video, time);
  } else {
    video.currentTime = time;
  }
}

function hideVideo(video: HTMLVideoElement) {
  gsap.set(video, { autoAlpha: 0, zIndex: 0 });
  video.style.visibility = 'hidden';
  if (!video.paused) video.pause();
}

function showVideo(video: HTMLVideoElement) {
  video.style.visibility = 'visible';
  gsap.set(video, { autoAlpha: 1, zIndex: 2 });
}

function HomeBackgroundOverlay({ postHero }: { postHero: boolean }) {
  return (
    <div
      className="absolute inset-0 transition-[opacity,background] duration-700 ease-out [transform:translateZ(0)]"
      style={{
        opacity: postHero ? 1 : 0.92,
        background: postHero
          ? [
              'linear-gradient(to bottom, rgba(5,7,10,0.72) 0%, rgba(5,7,10,0.55) 45%, rgba(5,7,10,0.78) 100%)',
              'linear-gradient(to right, rgba(5,7,10,0.45) 0%, rgba(5,7,10,0.2) 55%, rgba(5,7,10,0.4) 100%)',
              'radial-gradient(ellipse at 28% 82%, rgba(124,210,68,0.12) 0%, transparent 52%)',
              'radial-gradient(ellipse at 72% 18%, rgba(56,130,197,0.08) 0%, transparent 48%)',
            ].join(', ')
          : [
              'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.08) 38%, rgba(0,0,0,0.35) 100%)',
              'linear-gradient(to right, rgba(0,0,0,0.28) 0%, transparent 55%, rgba(0,0,0,0.2) 100%)',
              'radial-gradient(ellipse at 28% 82%, rgba(124,210,68,0.08) 0%, transparent 52%)',
              'radial-gradient(ellipse at 72% 18%, rgba(56,130,197,0.06) 0%, transparent 48%)',
            ].join(', '),
      }}
    />
  );
}

/**
 * Full-page scroll-scrubbed background — one clip per segment, hard-cut (no ghost overlap).
 */
export default function HomeScrollVideo({ children }: HomeScrollVideoProps) {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [staticBackground, setStaticBackground] = useState(shouldUseStaticHomeBackground);
  const [postHero, setPostHero] = useState(false);

  useEffect(() => {
    const mobileMq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncMode = () => {
      setStaticBackground(mobileMq.matches || motionMq.matches);
    };

    syncMode();
    mobileMq.addEventListener('change', syncMode);
    motionMq.addEventListener('change', syncMode);

    return () => {
      mobileMq.removeEventListener('change', syncMode);
      motionMq.removeEventListener('change', syncMode);
    };
  }, []);

  useEffect(() => {
    if (staticBackground) return;

    const page = pageRef.current;
    if (!page) return;

    const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[];
    if (!videos.length) return;

    videos.forEach((video, i) => {
      if (i === 0) showVideo(video);
      else hideVideo(video);
    });

    const durations = videos.map(() => 0);
    const ready = videos.map(() => false);
    const lastSeekTimes = videos.map(() => -1);
    const isSeeking = videos.map(() => false);
    const queuedTimes: Array<number | null> = videos.map(() => null);

    let scrubEnabled = false;
    let activeIndex = 0;

    const scheduleIdle = (cb: () => void) => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(cb, { timeout: 1200 });
      } else {
        window.setTimeout(cb, 120);
      }
    };

    const ensureLoaded = (index: number) => {
      const video = videos[index];
      if (!video || video.readyState >= 1 || video.dataset.loading === '1') return;

      video.dataset.loading = '1';
      scheduleIdle(() => {
        if (video.readyState < 1) {
          video.preload = 'auto';
          video.load();
        }
        delete video.dataset.loading;
      });
    };

    const markReady = (index: number, video: HTMLVideoElement) => {
      durations[index] = video.duration || 0;
      ready[index] = durations[index] > 0;

      if (!scrubEnabled && ready[0]) {
        scrubEnabled = true;
        videos.forEach((clip) => {
          if (clip.readyState >= 1) {
            clip.pause();
            clip.currentTime = 0;
          }
        });
        showVideo(videos[0]);
      }

      if (ready[0]) {
        scheduleIdle(() => {
          videos.forEach((_, clipIndex) => {
            if (clipIndex > 0) ensureLoaded(clipIndex);
          });
        });
      }
    };

    const flushSeek = (index: number) => {
      if (!scrubEnabled || queuedTimes[index] == null) return;

      const target = queuedTimes[index]!;
      queuedTimes[index] = null;

      if (Math.abs(lastSeekTimes[index] - target) < FRAME_STEP * 0.5) return;

      lastSeekTimes[index] = target;
      isSeeking[index] = true;
      seekVideo(videos[index], target);
    };

    const requestSeek = (index: number, time: number) => {
      if (!scrubEnabled || !ready[index]) return;
      queuedTimes[index] = quantizeTime(time, durations[index]);
      if (!isSeeking[index]) flushSeek(index);
    };

    const cleanups = videos.map((video, index) => {
      const onSeeked = () => {
        isSeeking[index] = false;
        if (queuedTimes[index] != null) flushSeek(index);
      };

      const onReady = () => markReady(index, video);

      video.addEventListener('seeked', onSeeked);
      video.addEventListener('loadedmetadata', onReady);
      if (video.readyState >= 1) onReady();

      return () => {
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('loadedmetadata', onReady);
      };
    });

    const applyFrame = (progress: number) => {
      if (!scrubEnabled) return;

      const scrubProgress = Math.min(Math.max(progress, 0), 1);
      const segmentCount = videos.length;
      const segmentSize = 1 / segmentCount;
      const index = Math.min(Math.floor(scrubProgress / segmentSize), segmentCount - 1);
      const segmentStart = index * segmentSize;
      const local = segmentSize > 0 ? (scrubProgress - segmentStart) / segmentSize : 0;

      if (index !== activeIndex) {
        videos.forEach((video, i) => {
          if (i === index) showVideo(video);
          else hideVideo(video);
        });
        activeIndex = index;
      }

      ensureLoaded(index);
      requestSeek(index, local * durations[index]);
    };

    const bindPageScrub = () => {
      return ScrollTrigger.create({
        trigger: page,
        start: 'top top',
        end: 'bottom bottom',
        invalidateOnRefresh: true,
        onUpdate: (self) => applyFrame(self.progress),
      });
    };

    const bindPostHero = () => {
      const hero = document.getElementById(HOME_HERO_ID);
      if (!hero) return undefined;

      return ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: () => `+=${getHeroPinScrollPx()}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => setPostHero(self.progress >= 0.98),
        onLeave: () => setPostHero(true),
        onEnterBack: () => setPostHero(false),
      });
    };

    let pageTrigger = bindPageScrub();
    let postHeroTrigger = bindPostHero();
    const retryTimer =
      !pageTrigger || !postHeroTrigger
        ? window.setTimeout(() => {
            if (!pageTrigger) pageTrigger = bindPageScrub();
            if (!postHeroTrigger) postHeroTrigger = bindPostHero();
          }, 100)
        : undefined;

    let resizeTimer: number | undefined;
    const onResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    };

    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      if (resizeTimer) window.clearTimeout(resizeTimer);
      if (retryTimer) window.clearTimeout(retryTimer);
      pageTrigger?.kill();
      postHeroTrigger?.kill();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [staticBackground]);

  return (
    <div ref={pageRef} className="relative">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070a] isolate [contain:strict]">
        {staticBackground ? (
          <img
            src={HOME_POSTER}
            alt=""
            aria-hidden="true"
            decoding="async"
            fetchPriority="high"
            className={
              'absolute inset-0 h-full w-full object-cover object-[center_38%] transition-[opacity,filter] duration-700 ease-out sm:object-[center_42%] lg:object-center ' +
              (postHero || staticBackground ? 'opacity-45 brightness-[0.62] saturate-[0.85]' : 'opacity-100')
            }
          />
        ) : (
          HERO_VIDEOS.map((src, index) => (
            <video
              key={src}
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src={src}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
              className={
                'absolute inset-0 h-full w-full object-cover object-[center_38%] [transform:translateZ(0)] transition-[opacity,filter] duration-700 ease-out sm:object-[center_42%] lg:object-center ' +
                (postHero ? 'opacity-45 brightness-[0.62] saturate-[0.85]' : 'opacity-100')
              }
              style={{ visibility: index === 0 ? 'visible' : 'hidden' }}
            />
          ))
        )}
        <HomeBackgroundOverlay postHero={postHero || staticBackground} />
      </div>

      <div className={`relative z-10 ${postHero || staticBackground ? 'home-post-hero' : ''}`}>{children}</div>
    </div>
  );
}
