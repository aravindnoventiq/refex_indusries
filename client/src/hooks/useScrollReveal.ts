import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  /** CSS selector (relative to the container) for items to stagger in. Defaults to direct children. */
  selector?: string;
  y?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  /** Re-run the reveal setup when this changes (e.g. once async data has rendered items) */
  deps?: unknown[];
}

/**
 * Attaches a ref to a container; when it scrolls into view its target
 * children fade + slide up in a staggered sequence, once.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  selector,
  y = 40,
  stagger = 0.12,
  duration = 0.8,
  start = 'top 85%',
  deps = [],
}: ScrollRevealOptions = {}) {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = selector
      ? Array.from(container.querySelectorAll(selector))
      : Array.from(container.children);

    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start,
            once: true,
          },
        }
      );
    }, container);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}
