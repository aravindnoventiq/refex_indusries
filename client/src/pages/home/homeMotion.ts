import type Lenis from 'lenis';

import {
  MOBILE_MAX_WIDTH,
  isMobileViewport,
  prefersReducedMotion,
} from '../../utils/responsive';

export { MOBILE_MAX_WIDTH, isMobileViewport, prefersReducedMotion };

export const HOME_POSTER = '/home/bg-poster.jpg';
export const HOME_HERO_ID = 'home-hero-scrub';
export const HOME_HERO_CHAPTER_COUNT = 3;

/** Desktop — scroll-scrub masters (1280×720). */
export const HERO_VIDEOS = [
  '/home/bg-01-tipper-ash.mp4',
  '/home/bg-04-ev-mobility.mp4',
  '/home/bg-02-wind-trucks.mp4',
  '/home/bg-07-tipper-ash.mp4',
] as const;

/** Mobile — 540×960 portrait clips tuned for phone hero. */
export const MOBILE_HERO_VIDEOS = [
  '/home/mobile/bg-01-tipper-ash.mp4',
  '/home/mobile/bg-04-ev-mobility.mp4',
  '/home/mobile/bg-02-wind-trucks.mp4',
  '/home/mobile/bg-07-tipper-ash.mp4',
] as const;

export const MOBILE_HERO_ASPECT = '9 / 16';
export const DESKTOP_HERO_ASPECT = '16 / 9';

/** Per-clip vertical focal point on mobile portrait cover. */
export const MOBILE_HERO_OBJECT_POSITIONS = [
  'center 42%',
  'center 44%',
  'center 46%',
  'center 42%',
] as const;

/** @deprecated Use MOBILE_HERO_OBJECT_POSITIONS */
export const MOBILE_DESKTOP_FALLBACK_OBJECT_POSITIONS = MOBILE_HERO_OBJECT_POSITIONS;

export function getHeroVideoSrc(index: number, isMobile = isMobileViewport()): string {
  const desktop = HERO_VIDEOS[index] ?? HERO_VIDEOS[0];
  if (isMobile) return MOBILE_HERO_VIDEOS[index] ?? desktop;
  return desktop;
}

export function getHomeHeroAspectRatio(isMobile = isMobileViewport()): string {
  return isMobile ? MOBILE_HERO_ASPECT : DESKTOP_HERO_ASPECT;
}

export function isMobileHeroPortraitSrc(src: string): boolean {
  return src.includes('/home/mobile/');
}

export function getHomeVideoObjectPosition(src?: string, index = 0): string {
  if (!isMobileViewport()) return 'center center';
  if (src && isMobileHeroPortraitSrc(src)) {
    return MOBILE_HERO_OBJECT_POSITIONS[index] ?? 'center center';
  }
  return MOBILE_HERO_OBJECT_POSITIONS[index] ?? 'center center';
}

export function getHeroPinScrollPx(): number {
  if (typeof window === 'undefined') return 3000;
  const factor = isMobileViewport() ? 2.65 : HOME_HERO_CHAPTER_COUNT - 0.15;
  return Math.round(window.innerHeight * factor);
}

export function isSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|FxiOS|EdgiOS|EdgA|Edg|OPR|Opera|SamsungBrowser/i.test(ua);
}

export function isWebKit(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /AppleWebKit/i.test(navigator.userAgent);
}

export function shouldUseNativeScrollTriggerSync(): boolean {
  return isWebKit() || isMobileViewport();
}

/** Poster fallback only for reduced motion — mobile uses scroll-scrub video like desktop. */
export function shouldUseStaticHomeBackground(): boolean {
  return prefersReducedMotion();
}

export function shouldUseLenisSmoothScroll(): boolean {
  return !prefersReducedMotion();
}

export function shouldPinHomeHero(): boolean {
  return !prefersReducedMotion();
}

export function getHomeSeekFps(): number {
  return isMobileViewport() ? 8 : 10;
}

export function getHeroScrollScrub(): number | true {
  return isMobileViewport() ? 0.55 : true;
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
