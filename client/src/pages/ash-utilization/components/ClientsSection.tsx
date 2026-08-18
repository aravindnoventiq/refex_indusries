import { useEffect, useRef, useState } from 'react';
import { ashUtilizationCmsApi } from '../../../services/api';
import { resolveMediaUrl } from '../../../utils/resolveMediaUrl';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { AshSectionShell, AboutSpinner } from './AshSectionShell';
import { gsap, animateAboutItems, prefersReducedMotion } from '../../about-us/aboutGsap';

interface Client {
  id: number;
  category: 'thermal' | 'cement' | 'concessionaires';
  image: string;
  order: number;
  isActive: boolean;
}

const CATEGORY_LABELS: Record<Client['category'], string> = {
  thermal: 'Thermal Power Plant',
  cement: 'Cement Companies',
  concessionaires: 'Concessionaires',
};

const FALLBACK_CLIENTS: Client[] = [
  { id: 1, category: 'thermal', image: 'https://refex.co.in/wp-content/uploads/2024/12/ash-client12.jpg', order: 1, isActive: true },
  { id: 2, category: 'thermal', image: 'https://refex.co.in/wp-content/uploads/2025/02/thermal-client02.jpg', order: 2, isActive: true },
  { id: 3, category: 'thermal', image: 'https://refex.co.in/wp-content/uploads/2025/02/thermal-client05.jpg', order: 3, isActive: true },
  { id: 4, category: 'thermal', image: 'https://refex.co.in/wp-content/uploads/2024/12/ash-client13.jpg', order: 4, isActive: true },
  { id: 5, category: 'thermal', image: 'https://refex.co.in/wp-content/uploads/2025/02/thermal-client03.jpg', order: 5, isActive: true },
  { id: 6, category: 'thermal', image: 'https://refex.co.in/wp-content/uploads/2025/02/thermal-client01.jpg', order: 6, isActive: true },
  { id: 10, category: 'cement', image: 'https://refex.co.in/wp-content/uploads/2024/12/ash-client01.jpg', order: 1, isActive: true },
  { id: 11, category: 'cement', image: 'https://refex.co.in/wp-content/uploads/2024/12/ash-client06.jpg', order: 2, isActive: true },
  { id: 12, category: 'cement', image: 'https://refex.co.in/wp-content/uploads/2025/02/ash-client021.jpg', order: 3, isActive: true },
  { id: 13, category: 'cement', image: 'https://refex.co.in/wp-content/uploads/2025/02/ash-client031.jpg', order: 4, isActive: true },
  { id: 19, category: 'concessionaires', image: 'https://refex.co.in/wp-content/uploads/2025/02/road-client01-1.jpg', order: 1, isActive: true },
  { id: 20, category: 'concessionaires', image: 'https://refex.co.in/wp-content/uploads/2025/02/road-client01.jpg', order: 2, isActive: true },
  { id: 21, category: 'concessionaires', image: 'https://refex.co.in/wp-content/uploads/2025/02/construction-client01.jpg', order: 3, isActive: true },
  { id: 22, category: 'concessionaires', image: 'https://refex.co.in/wp-content/uploads/2025/02/road-client02.jpg', order: 4, isActive: true },
];

function buildMarqueeItems(logos: string[]) {
  if (logos.length === 0) return [];
  // Enough tiles to cover wide viewports without gaps (cement has only 4 logos)
  const minItems = 16;
  const repeats = Math.max(2, Math.ceil(minItems / logos.length));
  return Array.from({ length: repeats }, () => logos).flat();
}

function getHalfWidth(track: HTMLDivElement) {
  const children = Array.from(track.children) as HTMLElement[];
  if (children.length < 2) return track.scrollWidth / 2;

  const half = children.length / 2;
  const style = getComputedStyle(track);
  const gap = parseFloat(style.columnGap || style.gap || '0') || 0;

  let width = 0;
  for (let i = 0; i < half; i += 1) {
    width += children[i].offsetWidth;
    if (i < half - 1) width += gap;
  }

  return width > 0 ? width : track.scrollWidth / 2;
}

function ClientLogoMarquee({
  logos,
  direction = 1,
  duration = 28,
}: {
  logos: string[];
  direction?: 1 | -1;
  duration?: number;
}) {
  const { theme, classes } = useDarkPageTheme();
  const { imageCard } = classes;
  const fadeLeft =
    theme === 'dark'
      ? 'bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent'
      : 'bg-gradient-to-r from-white via-white/90 to-transparent';
  const fadeRight =
    theme === 'dark'
      ? 'bg-gradient-to-l from-[#050505] via-[#050505]/90 to-transparent'
      : 'bg-gradient-to-l from-white via-white/90 to-transparent';
  const trackRef = useRef<HTMLDivElement | null>(null);
  const loopRef = useRef<gsap.core.Tween | null>(null);
  const items = buildMarqueeItems(logos);
  const loopItems = [...items, ...items];

  useEffect(() => {
    const track = trackRef.current;
    if (!track || logos.length === 0) return;

    let resizeTimer: number | undefined;

    const startLoop = () => {
      loopRef.current?.kill();

      const halfWidth = getHalfWidth(track);
      if (halfWidth <= 0) return;

      if (prefersReducedMotion()) {
        gsap.set(track, { x: 0 });
        return;
      }

      // Reverse: start offset left, move right → seamless loop back to -halfWidth
      if (direction > 0) {
        gsap.set(track, { x: 0 });
        loopRef.current = gsap.to(track, {
          x: -halfWidth,
          duration,
          ease: 'none',
          repeat: -1,
        });
      } else {
        gsap.set(track, { x: -halfWidth });
        loopRef.current = gsap.to(track, {
          x: 0,
          duration,
          ease: 'none',
          repeat: -1,
        });
      }
    };

    const scheduleStart = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(startLoop, 100);
    };

    scheduleStart();

    const images = track.querySelectorAll('img');
    let pending = images.length;

    const onImagesReady = () => {
      pending -= 1;
      if (pending <= 0) scheduleStart();
    };

    if (pending === 0) {
      scheduleStart();
    } else {
      images.forEach((img) => {
        if (img.complete) onImagesReady();
        else img.addEventListener('load', onImagesReady, { once: true });
      });
    }

    const ro = new ResizeObserver(scheduleStart);
    ro.observe(track);

    return () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      loopRef.current?.kill();
      ro.disconnect();
    };
  }, [logos, direction, duration, loopItems.length]);

  if (logos.length === 0) return null;

  return (
    <div
      className="group/marquee relative overflow-hidden"
      onMouseEnter={() => loopRef.current?.pause()}
      onMouseLeave={() => loopRef.current?.resume()}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-16 md:w-20 ${fadeLeft}`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-16 md:w-20 ${fadeRight}`}
      />

      <div
        ref={trackRef}
        className="flex w-max gap-4 py-1 will-change-transform"
      >
        {loopItems.map((client, index) => (
          <div
            key={`${client}-${index}`}
            className={`flex h-28 w-44 shrink-0 items-center justify-center rounded-xl p-4 sm:h-32 sm:w-48 ${imageCard}`}
          >
            <img
              src={client}
              alt=""
              loading="lazy"
              className="max-h-full max-w-full object-contain brightness-110 contrast-110"
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = '0.3';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientsSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { classes } = useDarkPageTheme();
  const { text } = classes;
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await ashUtilizationCmsApi.getClients();
        const active = (data || []).filter((item: Client) => item.isActive);
        setClients(active.length > 0 ? active : FALLBACK_CLIENTS);
      } catch {
        setClients(FALLBACK_CLIENTS);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const thermalClients = clients
    .filter((c) => c.category === 'thermal')
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((c) => resolveMediaUrl(c.image));

  const cementClients = clients
    .filter((c) => c.category === 'cement')
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((c) => resolveMediaUrl(c.image));

  const concessionairesClients = clients
    .filter((c) => c.category === 'concessionaires')
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((c) => resolveMediaUrl(c.image));

  useEffect(() => {
    if (loading || !sectionRef.current) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animateAboutItems(sectionRef.current!, '[data-about-anim]', { y: 20, stagger: 0.1 });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, clients.length]);

  if (loading) {
    return (
      <div id="clients">
        <AboutSpinner />
      </div>
    );
  }

  const groups = [
    { key: 'thermal' as const, clients: thermalClients, direction: 1 as const, duration: 32 },
    { key: 'cement' as const, clients: cementClients, direction: -1 as const, duration: 28 },
    {
      key: 'concessionaires' as const,
      clients: concessionairesClients,
      direction: 1 as const,
      duration: 26,
    },
  ].filter((g) => g.clients.length > 0);

  if (groups.length === 0) return null;

  return (
    <AshSectionShell
      id="clients"
      // eyebrow="Partnerships"
      title="Our Clientele"
      headerAlign="center"
      showDivider={false}
    >
      <div ref={sectionRef} className="space-y-8 sm:space-y-10 lg:space-y-12">
        {groups.map((group) => (
          <div key={group.key} data-about-anim>
            <h3 className={`mb-5 text-center ${text.cardTitle}`}>
              {CATEGORY_LABELS[group.key]}
            </h3>

            {/* Full-bleed marquee within padded section */}
            <div className="relative left-1/2 w-[100vw] max-w-none -translate-x-1/2 overflow-hidden sm:w-screen">
              <ClientLogoMarquee
                logos={group.clients}
                direction={group.direction}
                duration={group.duration}
              />
            </div>
          </div>
        ))}
      </div>
    </AshSectionShell>
  );
}

export default ClientsSection;
