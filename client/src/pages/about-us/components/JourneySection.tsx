import { useState, useEffect, useRef, useCallback } from 'react';
import { aboutCmsApi } from '../../../services/api';
import { prefersReducedMotion } from '../aboutGsap';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import AboutReveal from './AboutReveal';
import { AboutSectionShell, AboutSpinner } from './AboutSectionShell';

interface AboutJourney {
  id?: number;
  title?: string;
  summary?: string;
  image?: string;
  images?: string[];
  isActive: boolean;
}

const JOURNEY_VIDEO = '/our-journey.mp4';
const FALLBACK_POSTER =
  'https://refex.co.in/wp-content/uploads/2025/08/Our-Journey-new01.jpg';

function JourneyVideo({
  poster,
  label,
}: {
  poster: string;
  label: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const playVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion()) return;

    try {
      await video.play();
      setBlocked(false);
    } catch {
      setBlocked(true);
    }
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const markReady = () => setReady(true);
    video.addEventListener('loadeddata', markReady);
    video.addEventListener('canplay', markReady);
    if (video.readyState >= 2) {
      markReady();
    }

    const readyFallback = window.setTimeout(markReady, 2000);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          void playVideo();
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.1, 0.35, 0.6] },
    );

    io.observe(wrap);
    void playVideo();

    return () => {
      window.clearTimeout(readyFallback);
      video.removeEventListener('loadeddata', markReady);
      video.removeEventListener('canplay', markReady);
      io.disconnect();
      video.pause();
    };
  }, [playVideo]);

  return (
    <div
      ref={wrapRef}
      className="relative min-h-[220px] w-full overflow-hidden rounded-lg bg-black sm:min-h-[280px] md:min-h-[320px]"
    >
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <img
            src={poster}
            alt=""
            aria-hidden
            className="max-h-full max-w-full object-contain opacity-70"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#7cd244]/30 border-t-[#7cd244]" />
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className={`relative z-10 block h-auto w-full object-contain transition-opacity duration-500 ease-out [transform:translateZ(0)] ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
        src={JOURNEY_VIDEO}
        poster={poster}
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-label={label}
      />

      {blocked && ready && (
        <button
          type="button"
          onClick={() => void playVideo()}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 text-sm font-medium text-white transition hover:bg-black/55"
        >
          <span className="rounded-full border border-white/25 bg-black/50 px-4 py-2 backdrop-blur-sm">
            Tap to play journey
          </span>
        </button>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-12 bg-gradient-to-t from-black/45 to-transparent"
      />
    </div>
  );
}

function JourneySection() {
  const [journey, setJourney] = useState<AboutJourney | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        setLoading(true);
        const data = await aboutCmsApi.getAboutJourney();
        if (data && (data.isActive === true || data.isActive === undefined || data.isActive === null)) {
          setJourney(data);
        } else {
          setJourney({
            title: 'Our Journey',
            summary: '',
            isActive: true,
          });
        }
      } catch {
        setJourney({
          title: 'Our Journey',
          summary: '',
          isActive: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJourney();
  }, []);

  const { classes } = useDarkPageTheme();
  const { text, imageCard, borderBottom } = classes;

  if (loading) {
    return (
      <div id="journey">
        <AboutSpinner />
      </div>
    );
  }

  const summary = journey?.summary?.trim();
  const poster = journey?.image || FALLBACK_POSTER;

  return (
    <AboutSectionShell
      id="journey"
      eyebrow="Timeline"
      title={journey?.title || 'Our Journey'}
      subtitle={
        summary ||
        'Milestones that mark Refex’s growth from a focused enterprise to a diversified industrial group.'
      }
    >
      <AboutReveal>
      <div className={`relative overflow-hidden ${imageCard}`}>
        <div className={`flex items-center gap-3 px-5 py-3.5 sm:px-6 ${borderBottom}`}>
          <span className="h-2 w-2 rounded-full bg-[#7cd244]" />
          <p className={text.meta}>Since 2002 · Growing with purpose</p>
        </div>

        <div className="relative bg-black/20 p-3 sm:p-4 md:p-5">
          <JourneyVideo poster={poster} label={journey?.title || 'Our Journey timeline video'} />
        </div>
      </div>
      </AboutReveal>
    </AboutSectionShell>
  );
}

export default JourneySection;
