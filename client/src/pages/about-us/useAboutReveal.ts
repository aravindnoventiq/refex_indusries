import { useEffect, useRef, useState } from 'react';
import { isMobileViewport, prefersReducedMotion } from '../../utils/responsive';

type UseAboutRevealOptions = {
  threshold?: number;
  rootMargin?: string;
};

export function useAboutReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseAboutRevealOptions = {},
) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(() => prefersReducedMotion() || isMobileViewport());

  useEffect(() => {
    if (prefersReducedMotion() || isMobileViewport()) {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin ?? '0px 0px -5% 0px',
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options.rootMargin, options.threshold]);

  return { ref, isVisible };
}

export const ABOUT_REVEAL_STAGGER_MS = 70;
