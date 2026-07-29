import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ashUtilizationCmsApi } from '../../../services/api';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { prefersReducedMotion } from '../../about-us/aboutGsap';
import {
  ashContainer,
  ashHeroTextPad,
  ashRefexGradientText,
} from '../ashLayout';

gsap.registerPlugin(ScrollTrigger);

interface HeroSlide {
  image?: string;
  video?: string;
}

interface AshUtilizationHero {
  id?: number;
  title: string;
  subtitle?: string;
  slides: HeroSlide[];
  isActive: boolean;
}

const HERO_VIDEO = '/ash-utilization/hero.mp4';

const COLLAGE_VIDEOS = [
  '/ash-utilization/collage-1.mp4',
  '/ash-utilization/collage-2.mp4',
  '/ash-utilization/collage-3.mp4',
  '/ash-utilization/collage-4.mp4',
  '/ash-utilization/collage-5.mp4',
] as const;

const SCROLL_TRACK_VH = 300;
const COLLAPSE_SCALE = 0.58;
const COLLAPSE_Y_VH = -22;
const CONTENT_FADE_END = 0.32;
/** Scale stays at 1 until text fade completes — avoids side gaps on the hero video */
const COLLAPSE_START = CONTENT_FADE_END;

const FALLBACK_HERO: AshUtilizationHero = {
  title: "Leading India's Ash Transformation",
  subtitle:
    "Refex Industries is India's largest organized ash utilization company, delivering coal handling, end-to-end ash utilization solutions & other ancillary services for thermal power plants. By combining operational excellence, technology, and a strong industrial utilization network, we transform ash from an operational liability into a valuable resource, supporting regulatory compliance, circular economy objectives, and sustainable infrastructure development.",
  slides: [{ video: HERO_VIDEO }, ...COLLAGE_VIDEOS.map((video) => ({ video }))],
  isActive: true,
};

function slideVideoUrl(slide: HeroSlide): string | null {
  if (slide.video) return slide.video;
  if (slide.image && /\.(mp4|webm|mov)(\?|$)/i.test(slide.image)) return slide.image;
  return null;
}

function buildVideoSet(slides: HeroSlide[]) {
  const urls = slides.map(slideVideoUrl).filter(Boolean) as string[];
  const hero = urls[0] || HERO_VIDEO;
  const collage = COLLAGE_VIDEOS.map((fallback, index) => urls[index + 1] || fallback);

  return {
    hero,
    topLeft: collage[0],
    topRight: collage[1],
    centerLeft: collage[2],
    centerRight: collage[3],
    bottomLeft: collage[0],
    bottomRight: collage[4],
  };
}

function AshVideo({
  src,
  eager = false,
}: {
  src: string;
  eager?: boolean;
}) {
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
        if (entry.isIntersecting && entry.intersectionRatio > 0.05) {
          void playVideo();
        } else {
          video.pause();
        }
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
  }, [eager, playVideo, src]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden bg-[#050505]">
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload={eager ? 'auto' : 'metadata'}
        disablePictureInPicture
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
      {!ready && <div className="absolute inset-0 bg-white/5 animate-pulse" aria-hidden />}
    </div>
  );
}

function VideoPanel({
  src,
  panelRef,
  style,
  eager = false,
}: {
  src: string;
  panelRef?: (el: HTMLDivElement | null) => void;
  style: CSSProperties;
  eager?: boolean;
}) {
  return (
    <div ref={panelRef} className="absolute top-0 h-full overflow-hidden" style={style}>
      <AshVideo src={src} eager={eager} />
    </div>
  );
}

function HeroContent({
  titleParts,
  subtitle,
  compact = false,
}: {
  titleParts: { lead: string; accent: string };
  subtitle?: string;
  compact?: boolean;
}) {
  const { classes } = useDarkPageTheme();
  const { text } = classes;

  return (
    <div className={compact ? 'max-w-3xl' : 'max-w-4xl'}>
      <span className={`${text.label} tracking-[0.35em]`}>Ash &amp; Coal Handling</span>

      <h1
        className={`mt-4 font-bold leading-[1.08] tracking-[-0.03em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.55)] sm:mt-5 ${
          compact
            ? 'text-[1.75rem] sm:text-[2.15rem]'
            : 'text-[2rem] sm:text-[2.65rem] md:text-[3rem] lg:text-[3.35rem]'
        }`}
      >
        {titleParts.accent ? (
          <>
            <span className="block">{titleParts.lead}</span>
            <span className={`mt-1 block ${ashRefexGradientText}`}>{titleParts.accent}</span>
          </>
        ) : (
          titleParts.lead
        )}
      </h1>

      {subtitle && (
        <p
          className={`mt-4 max-w-3xl leading-relaxed text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.65)] sm:mt-5 ${
            compact ? `${text.bodySm} line-clamp-4` : text.body
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function VenwindScrollVideoCollage({
  videos,
  content,
}: {
  videos: ReturnType<typeof buildVideoSet>;
  content: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    const grid = gridRef.current;
    const contentEl = contentRef.current;
    if (!track || !grid) return;

    const reduced = prefersReducedMotion();
    const desktopMq = window.matchMedia('(min-width: 768px)');

    let ctx: gsap.Context | undefined;

    const setup = () => {
      ctx?.revert();
      ctx = undefined;

      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === track) st.kill();
      });

      const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[];

      if (reduced && desktopMq.matches) {
        gsap.set(grid, { scale: 1, y: 0, transformOrigin: 'center center' });
        gsap.set(panels, { clipPath: 'inset(0px round 0px)' });
        if (contentEl) gsap.set(contentEl, { autoAlpha: 1, y: 0 });
        return;
      }

      if (reduced || !desktopMq.matches) {
        gsap.set(grid, { clearProps: 'all' });
        gsap.set(panels, { clearProps: 'all' });
        if (contentEl) gsap.set(contentEl, { clearProps: 'all' });
        return;
      }

      gsap.set(grid, { scale: 1, y: 0, transformOrigin: 'center center' });
      gsap.set(panels, { clipPath: 'inset(0px round 0px)' });
      if (contentEl) gsap.set(contentEl, { autoAlpha: 1, y: 0 });

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.45,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const collapseY = (window.innerHeight * COLLAPSE_Y_VH) / 100;
            const collapseP =
              p <= COLLAPSE_START
                ? 0
                : gsap.utils.clamp(0, 1, (p - COLLAPSE_START) / (1 - COLLAPSE_START));

            const scale = gsap.utils.interpolate(1, COLLAPSE_SCALE, collapseP);
            const y = gsap.utils.interpolate(0, collapseY, collapseP);
            const radius = gsap.utils.interpolate(0, 10, collapseP);
            const clip = `inset(0px round ${radius}px)`;

            gsap.set(grid, { scale, y });
            panels.forEach((panel) => gsap.set(panel, { clipPath: clip }));

            if (contentEl) {
              const fadeP = gsap.utils.clamp(0, 1, p / CONTENT_FADE_END);
              gsap.set(contentEl, {
                autoAlpha: 1 - fadeP,
                y: gsap.utils.interpolate(0, -28, fadeP),
              });
            }
          },
        });
      }, track);
    };

    setup();

    let resizeTimer: number | undefined;
    const onResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setup();
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener('resize', onResize, { passive: true });
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      window.clearTimeout(refreshTimer);
      if (resizeTimer) window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      ctx?.revert();
    };
  }, [videos]);

  const panelSlot = (index: number) => (el: HTMLDivElement | null) => {
    panelRefs.current[index] = el;
  };

  const panelWidth: CSSProperties = { width: '100%' };

  return (
    <>
      {/* Desktop — sticky scroll collage with content overlay */}
      <div
        ref={trackRef}
        className="relative hidden w-full md:block"
        style={{ height: `${SCROLL_TRACK_VH}vh` }}
      >
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#050505]">
          {/* Bottom gradient scrim for readable text */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[min(58vh,520px)] bg-gradient-to-t from-[#050505] via-[#050505]/88 to-transparent"
          />

          {/* Hero copy — fades out as collage forms */}
          <div
            ref={contentRef}
            className={`absolute inset-x-0 bottom-0 z-30 ${ashContainer} pb-10 pt-16 sm:pb-12 sm:pt-20`}
          >
            {content}
          </div>

          {/* Video grid — percentage offsets keep collapse aligned at any width */}
          <div className="absolute inset-0">
            <div
              ref={gridRef}
              className="relative h-full w-full origin-center will-change-transform"
            >
              {/* Top row */}
              <div className="absolute inset-x-0 h-full" style={{ top: '-100%' }}>
                <VideoPanel
                  panelRef={panelSlot(0)}
                  src={videos.topLeft}
                  style={{ ...panelWidth, left: '-50%' }}
                />
                <VideoPanel
                  panelRef={panelSlot(1)}
                  src={videos.topRight}
                  style={{ ...panelWidth, left: '50%' }}
                />
              </div>

              {/* Center row — hero visible first */}
              <div className="relative h-full w-full">
                <VideoPanel
                  panelRef={panelSlot(2)}
                  src={videos.centerLeft}
                  style={{ ...panelWidth, left: '-100%' }}
                />
                <VideoPanel
                  panelRef={panelSlot(3)}
                  src={videos.hero}
                  eager
                  style={{ ...panelWidth, left: '0%' }}
                />
                <VideoPanel
                  panelRef={panelSlot(4)}
                  src={videos.centerRight}
                  style={{ ...panelWidth, left: '100%' }}
                />
              </div>

              {/* Bottom row */}
              <div className="absolute inset-x-0 h-full" style={{ top: '100%' }}>
                <VideoPanel
                  panelRef={panelSlot(5)}
                  src={videos.bottomLeft}
                  style={{ ...panelWidth, left: '-50%' }}
                />
                <VideoPanel
                  panelRef={panelSlot(6)}
                  src={videos.bottomRight}
                  style={{ ...panelWidth, left: '50%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile — copy above full-bleed video grid */}
      <div className="md:hidden">
        <div className={`${ashContainer} ${ashHeroTextPad}`}>{content}</div>
        <div className="pb-12 sm:pb-16">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#050505]">
            <AshVideo src={videos.hero} eager />
          </div>
          <div className="mt-0.5 grid grid-cols-2 gap-0.5 sm:gap-1">
            {[
              videos.topLeft,
              videos.topRight,
              videos.centerLeft,
              videos.centerRight,
              videos.bottomLeft,
              videos.bottomRight,
            ].map((src, index) => (
              <figure
                key={`${src}-${index}`}
                className="relative aspect-[4/3] overflow-hidden bg-[#050505]"
              >
                <AshVideo src={src} />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function HeroSection() {
  const { classes } = useDarkPageTheme();
  const { spinner, divider } = classes;
  const [hero, setHero] = useState<AshUtilizationHero | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        setLoading(true);
        const data = await ashUtilizationCmsApi.getHero();
        if (data && data.isActive !== false) {
          setHero(data);
        } else {
          setHero(FALLBACK_HERO);
        }
      } catch {
        setHero(FALLBACK_HERO);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  useEffect(() => {
    if (loading) return;
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(timer);
  }, [loading, hero]);

  const display = hero || FALLBACK_HERO;
  const title = display.title || FALLBACK_HERO.title;
  const subtitle = display.subtitle || FALLBACK_HERO.subtitle;
  const videos = buildVideoSet(display.slides?.length ? display.slides : FALLBACK_HERO.slides);

  const titleParts = title.includes('Ash Transformation')
    ? {
        lead: "Leading India's",
        accent: 'Ash Transformation',
      }
    : { lead: title, accent: '' };

  const heroContent = (
    <HeroContent titleParts={titleParts} subtitle={subtitle} compact={false} />
  );

  const mobileContent = (
    <HeroContent titleParts={titleParts} subtitle={subtitle} compact />
  );

  return (
    <section id="hero" className={`preserve-dark-text relative overflow-x-clip ${divider}`}>
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_0%_30%,rgba(249,115,22,0.14),transparent_58%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_20%,rgba(124,210,68,0.08),transparent_55%)]" />

      {loading ? (
        <div className={`relative flex min-h-[420px] items-center justify-center ${ashContainer}`}>
          <div className={`h-10 w-10 ${spinner}`} />
        </div>
      ) : (
        <VenwindScrollVideoCollage
          videos={videos}
          content={
            <>
              <div className="hidden md:block">{heroContent}</div>
              <div className="md:hidden">{mobileContent}</div>
            </>
          }
        />
      )}
    </section>
  );
}

export default HeroSection;
