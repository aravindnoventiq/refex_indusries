/** Canonical mobile breakpoint — matches Tailwind `md` (768px) minus one. */
export const MOBILE_MAX_WIDTH = 767;

export function isMobileViewport(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches
  );
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function isCoarsePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
}

/** Skip heavy GSAP / scroll-scrub — use static or IO-only reveals instead. */
export function shouldUseLightMotion(): boolean {
  return prefersReducedMotion() || isMobileViewport();
}

/** Easier scroll-trigger start on small screens so reveals fire reliably. */
export function mobileScrollStart(desktop = 'top 78%'): string {
  return isMobileViewport() ? 'top 92%' : desktop;
}
