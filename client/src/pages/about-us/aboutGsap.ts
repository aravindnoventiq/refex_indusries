import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function refreshAboutScrollTriggers() {
  if (typeof window === 'undefined') return;
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

function revealVisible(elements: gsap.TweenTarget) {
  gsap.set(elements, { autoAlpha: 1, y: 0, clearProps: 'transform' });
}

/** Card/grid reveal — used by ash-utilization sections only */
export function animateAboutItems(
  container: HTMLElement,
  selector = '[data-about-anim]',
  opts?: { y?: number; stagger?: number; start?: string },
) {
  const items = container.querySelectorAll(selector);
  if (!items.length) return;

  if (prefersReducedMotion()) {
    revealVisible(items);
    return;
  }

  const tween = gsap.fromTo(
    items,
    { autoAlpha: 0, y: opts?.y ?? 20 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.75,
      stagger: opts?.stagger ?? 0.07,
      ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: {
        trigger: container,
        start: opts?.start ?? 'top 90%',
        once: true,
        invalidateOnRefresh: true,
      },
    },
  );

  refreshAboutScrollTriggers();
  return tween;
}
