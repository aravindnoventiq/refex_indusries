import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  HERO_VIDEOS,
  HOME_HERO_ID,
  HOME_POSTER,
  MOBILE_HERO_VIDEOS,
  getHeroPinScrollPx,
  getHomeSeekFps,
  getHomeVideoObjectPosition,
  getHeroVideoSrc,
  isWebKit,
  shouldUseStaticHomeBackground,
} from '../homeMotion';
import { useHomeMobile } from '../homeMobile';
import HomeHeroVideoFrame from './HomeHeroVideoFrame';

gsap.registerPlugin(ScrollTrigger);

function getFrameStep(seekFps: number): number {
  return 1 / seekFps;
}

function quantizeTime(seconds: number, duration: number, frameStep: number): number {
  const clamped = Math.max(0, Math.min(seconds, Math.max(duration - frameStep, 0)));
  return Math.round(clamped / frameStep) * frameStep;
}

function seekVideo(video: HTMLVideoElement, time: number) {
  const fastSeek = (video as HTMLVideoElement & { fastSeek?: (t: number) => void }).fastSeek;
  if (typeof fastSeek === 'function' && !isWebKit()) {
    fastSeek.call(video, time);
  } else {
    video.currentTime = time;
  }
}

function waitForVideoMetadata(video: HTMLVideoElement, timeoutMs = 4000): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) return Promise.resolve();

  return new Promise((resolve) => {
    const finish = () => {
      video.removeEventListener('loadedmetadata', finish);
      video.removeEventListener('loadeddata', finish);
      window.clearTimeout(timer);
      resolve();
    };

    const timer = window.setTimeout(finish, timeoutMs);
    video.addEventListener('loadedmetadata', finish, { once: true });
    video.addEventListener('loadeddata', finish, { once: true });
  });
}

async function primeVideoFrame(video: HTMLVideoElement): Promise<void> {
  video.muted = true;
  video.playsInline = true;
  video.setAttribute('webkit-playsinline', 'true');
  video.preload = 'auto';
  video.loop = false;

  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    video.pause();
    return;
  }

  if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) {
    video.load();
  }

  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });

  if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
    try {
      await video.play();
    } catch {
      /* Safari may abort */
    }
  }

  await waitForVideoMetadata(video, isWebKit() ? 5000 : 2500);
  video.pause();
  try {
    seekVideo(video, 0);
  } catch {
    /* ignore */
  }
}

function showVideo(video: HTMLVideoElement) {
  video.style.visibility = 'visible';
  gsap.set(video, { autoAlpha: 1, zIndex: 2, visibility: 'visible' });
}

function hideVideo(video: HTMLVideoElement) {
  gsap.set(video, { autoAlpha: 0, zIndex: 0 });
  video.style.visibility = 'hidden';
  if (!video.paused) video.pause();
}

function HomeBackgroundOverlay({ staticMode }: { staticMode?: boolean }) {
  return (
    <div
      className={`home-bg-overlay absolute inset-0 [transform:translateZ(0)] ${
        staticMode ? 'home-static-bg-overlay' : ''
      }`}
      style={
        staticMode
          ? undefined
          : {
              opacity: 0.92,
              background: [
                'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.08) 38%, rgba(0,0,0,0.35) 100%)',
                'linear-gradient(to right, rgba(0,0,0,0.28) 0%, transparent 55%, rgba(0,0,0,0.2) 100%)',
                'radial-gradient(ellipse at 28% 82%, rgba(124,210,68,0.08) 0%, transparent 52%)',
                'radial-gradient(ellipse at 72% 18%, rgba(56,130,197,0.06) 0%, transparent 48%)',
              ].join(', '),
            }
      }
    />
  );
}

function resolveVideoSrc(index: number, isMobile: boolean): string {
  return getHeroVideoSrc(index, isMobile);
}

/** Hero-only scroll-scrubbed video — clipped to the pinned hero, not the full page. */
export default function HomeScrollVideo() {
  const isMobile = useHomeMobile();
  const bgRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const heroTriggerRef = useRef<ScrollTrigger | null>(null);
  const [staticBackground, setStaticBackground] = useState(shouldUseStaticHomeBackground);
  const [heroVideoReady, setHeroVideoReady] = useState(false);

  const posterObjectPosition = getHomeVideoObjectPosition(
    isMobile ? MOBILE_HERO_VIDEOS[0] : HERO_VIDEOS[0],
    0,
  );

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMode = () => setStaticBackground(motionMq.matches);
    syncMode();
    motionMq.addEventListener('change', syncMode);
    return () => motionMq.removeEventListener('change', syncMode);
  }, []);

  useEffect(() => {
    setHeroVideoReady(false);
  }, [isMobile]);

  useLayoutEffect(() => {
    if (staticBackground) return;

    const hero = document.getElementById(HOME_HERO_ID);
    if (!hero) return;

    const videos = videoRefs.current.filter(Boolean) as HTMLVideoElement[];
    if (!videos.length) return;

    const seekFps = getHomeSeekFps();
    const frameStep = getFrameStep(seekFps);
    const seekThreshold = frameStep * 0.5;

    videos.forEach((v, i) => (i === 0 ? showVideo(v) : hideVideo(v)));

    const durations = videos.map(() => 0);
    const ready = videos.map(() => false);
    const lastSeekTimes = videos.map(() => -1);
    const isSeeking = videos.map(() => false);
    const queuedTimes: Array<number | null> = videos.map(() => null);

    let scrubEnabled = false;
    let activeIndex = 0;
    let cancelled = false;

    const primeClip = async (index: number) => {
      const v = videos[index];
      if (!v || ready[index] || v.dataset.priming === '1') return;
      v.dataset.priming = '1';
      await primeVideoFrame(v);
      delete v.dataset.priming;
      if (cancelled) return;
      markReady(index, v);
    };

    const markReady = (index: number, v: HTMLVideoElement) => {
      durations[index] = v.duration || 0;
      ready[index] = Number.isFinite(durations[index]) && durations[index] > 0;
      if (ready[0]) enableScrub();
      if (index === 0 && ready[0]) setHeroVideoReady(true);
      if (scrubEnabled && heroTriggerRef.current) {
        applyFrame(heroTriggerRef.current.progress);
      }
    };

    const enableScrub = () => {
      if (scrubEnabled || !ready[0]) return;
      scrubEnabled = true;
      videos.forEach((clip, i) => {
        clip.pause();
        if (clip.readyState >= HTMLMediaElement.HAVE_METADATA) seekVideo(clip, 0);
        if (i === 0) showVideo(clip);
        else hideVideo(clip);
      });
      if (heroTriggerRef.current) applyFrame(heroTriggerRef.current.progress);
    };

    void primeClip(0);
    if (isWebKit()) {
      videos.forEach((_, i) => {
        if (i > 0) void primeClip(i);
      });
    } else {
      videos.forEach((_, i) => {
        if (i > 0) {
          if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(() => void primeClip(i), { timeout: 1200 });
          } else {
            window.setTimeout(() => void primeClip(i), 120);
          }
        }
      });
    }

    const flushSeek = (index: number) => {
      if (!scrubEnabled || queuedTimes[index] == null) return;
      const target = queuedTimes[index]!;
      queuedTimes[index] = null;
      if (Math.abs(lastSeekTimes[index] - target) < seekThreshold) return;
      lastSeekTimes[index] = target;
      isSeeking[index] = true;
      seekVideo(videos[index], target);
    };

    const cleanups = videos.map((v, index) => {
      const onSeeked = () => {
        isSeeking[index] = false;
        if (queuedTimes[index] != null) flushSeek(index);
      };
      const onReady = () => {
        if (!ready[index]) markReady(index, v);
      };
      v.addEventListener('seeked', onSeeked);
      v.addEventListener('loadedmetadata', onReady);
      return () => {
        v.removeEventListener('seeked', onSeeked);
        v.removeEventListener('loadedmetadata', onReady);
      };
    });

    const applyFrame = (progress: number) => {
      if (!scrubEnabled) return;
      const scrubProgress = Math.min(Math.max(progress, 0), 1);
      const segmentCount = videos.length;
      const segmentSize = 1 / segmentCount;
      const index = Math.min(Math.floor(scrubProgress / segmentSize), segmentCount - 1);
      const local = segmentSize > 0 ? (scrubProgress - index * segmentSize) / segmentSize : 0;

      if (index !== activeIndex) {
        videos.forEach((v, i) => (i === index ? showVideo(v) : hideVideo(v)));
        activeIndex = index;
        if (!ready[index]) void primeClip(index);
      }

      if (ready[index]) {
        queuedTimes[index] = quantizeTime(local * durations[index], durations[index], frameStep);
        if (!isSeeking[index]) flushSeek(index);
      }
    };

    const heroTrigger = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: () => `+=${getHeroPinScrollPx()}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => applyFrame(self.progress),
      onRefresh: (self) => applyFrame(self.progress),
    });
    heroTriggerRef.current = heroTrigger;

    applyFrame(heroTrigger.progress);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) return;
        videos.forEach((clip) => {
          if (!clip.paused) clip.pause();
        });
      },
      { threshold: 0.08 },
    );
    visibilityObserver.observe(hero);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 350);

    return () => {
      cancelled = true;
      window.clearTimeout(refreshTimer);
      visibilityObserver.disconnect();
      heroTriggerRef.current = null;
      heroTrigger.kill();
      cleanups.forEach((c) => c());
    };
  }, [staticBackground, isMobile]);

  const handleVideoError = (index: number) => {
    const video = videoRefs.current[index];
    if (!video || !isMobile) return;
    const fallback = HERO_VIDEOS[index];
    if (!fallback || video.src.includes(fallback)) return;
    video.src = fallback;
    video.style.objectPosition = getHomeVideoObjectPosition(fallback, index);
    void primeVideoFrame(video);
  };

  return (
    <div
      ref={bgRef}
      className={`home-scroll-video-bg pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#05070a] isolate ${
        isMobile ? 'home-scroll-video-bg--mobile' : '[contain:strict]'
      }`}
      aria-hidden
    >
      {staticBackground ? (
        <HomeHeroVideoFrame isMobile={isMobile}>
          <img
            src={HOME_POSTER}
            alt=""
            aria-hidden="true"
            decoding="async"
            fetchPriority="high"
            className="home-hero-poster absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: posterObjectPosition }}
          />
        </HomeHeroVideoFrame>
      ) : (
        <HomeHeroVideoFrame isMobile={isMobile}>
          {!heroVideoReady && (
            <img
              src={HOME_POSTER}
              alt=""
              aria-hidden="true"
              decoding="async"
              fetchPriority="high"
              className={`home-hero-poster absolute inset-0 z-[1] h-full w-full object-cover ${
                isMobile ? '' : 'object-[center_38%] sm:object-[center_42%] lg:object-center'
              }`}
              style={{ objectPosition: posterObjectPosition }}
            />
          )}
          {HERO_VIDEOS.map((src, index) => {
            const videoSrc = resolveVideoSrc(index, isMobile);
            const objectPosition = getHomeVideoObjectPosition(videoSrc, index);

            return (
              <video
                key={`${src}-${isMobile ? 'mobile' : 'desktop'}`}
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src={videoSrc}
                poster={index === 0 ? HOME_POSTER : undefined}
                muted
                playsInline
                preload={index === 0 ? 'auto' : isWebKit() ? 'auto' : 'metadata'}
                disablePictureInPicture
                aria-hidden="true"
                className={`home-hero-bg-video absolute inset-0 h-full w-full object-cover [transform:translateZ(0)] ${
                  isMobile ? '' : 'object-[center_38%] sm:object-[center_42%] lg:object-center'
                }`}
                style={{
                  visibility: index === 0 ? 'visible' : 'hidden',
                  objectPosition,
                }}
                onError={() => handleVideoError(index)}
              />
            );
          })}
        </HomeHeroVideoFrame>
      )}
      <HomeBackgroundOverlay staticMode={staticBackground} />
    </div>
  );
}
