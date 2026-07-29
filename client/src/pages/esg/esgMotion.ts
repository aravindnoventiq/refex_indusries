import { useEffect, useState, type RefObject } from 'react';
import {
  isCoarsePointer,
  isMobileViewport,
  mobileScrollStart,
  prefersReducedMotion,
} from '../../utils/responsive';

export { isMobileViewport, isCoarsePointer, prefersReducedMotion };

/** Easier scroll-trigger start on small screens so reveals fire reliably */
export function esgScrollStart(desktop = 'top 78%') {
  return mobileScrollStart(desktop);
}

export function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return coarse;
}

export function useEsgReveal(
  ref: RefObject<HTMLElement | null>,
  active = true,
) {
  const [revealed, setRevealed] = useState(
    () => prefersReducedMotion() || isMobileViewport(),
  );

  useEffect(() => {
    if (!active || prefersReducedMotion()) {
      setRevealed(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    if (isMobileViewport()) {
      const timer = window.setTimeout(() => setRevealed(true), 150);
      return () => window.clearTimeout(timer);
    }

    const fallback = window.setTimeout(() => setRevealed(true), 3000);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
          window.clearTimeout(fallback);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 8% 0px' },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [active, ref]);

  return revealed;
}

export function useEsgVisibleCount(desktop: number, mobile = 1) {
  const [count, setCount] = useState(() => (isMobileViewport() ? mobile : desktop));

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setCount(mq.matches ? mobile : desktop);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [desktop, mobile]);

  return count;
}
