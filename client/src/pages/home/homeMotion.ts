import type Lenis from 'lenis';

export const MOBILE_MAX_WIDTH = 767;
export const HOME_POSTER = '/home/bg-poster.jpg';
export const HOME_HERO_ID = 'home-hero-scrub';
export const HOME_HERO_CHAPTER_COUNT = 3;

/** Hero background clips — one per scroll segment (hard-cut, no crossfade) */
export const HERO_VIDEOS = [
  '/home/bg-01-tipper-ash.mp4',
  '/home/bg-04-ev-mobility.mp4',
  '/home/bg-02-wind-trucks.mp4',
  '/home/bg-07-tipper-ash.mp4',
] as const;

export function getHeroPinScrollPx(): number {
  if (typeof window === 'undefined') return 3000;
  return Math.round(window.innerHeight * (HOME_HERO_CHAPTER_COUNT - 0.15));
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isMobileViewport(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;
}

/** Static poster instead of scroll-scrubbed video on mobile or reduced motion. */
export function shouldUseStaticHomeBackground(): boolean {
  return prefersReducedMotion() || isMobileViewport();
}

let homeLenis: Lenis | null = null;
const homeLenisListeners = new Set<(lenis: Lenis | null) => void>();

export function setHomeLenis(instance: Lenis | null) {
  homeLenis = instance;
  homeLenisListeners.forEach((listener) => listener(instance));
}

export function getHomeLenis(): Lenis | null {
  return homeLenis;
}

export function subscribeHomeLenis(listener: (lenis: Lenis | null) => void) {
  homeLenisListeners.add(listener);
  listener(homeLenis);
  return () => homeLenisListeners.delete(listener);
}

export function scrollHomeToTop() {
  if (homeLenis) {
    homeLenis.scrollTo(0, { duration: prefersReducedMotion() ? 0 : 1.2 });
    return;
  }
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

export function getHomeScrollY(): number {
  return homeLenis?.scroll ?? window.scrollY ?? window.pageYOffset ?? 0;
}
