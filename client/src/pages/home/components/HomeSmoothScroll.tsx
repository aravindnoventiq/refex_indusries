import { useLayoutEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, setHomeLenis } from '../homeMotion';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

const SCROLLER = document.documentElement;

interface HomeSmoothScrollProps {
  children: ReactNode;
}

/**
 * Lenis smooth scroll on the home page, synced with GSAP ScrollTrigger.
 * useLayoutEffect ensures Lenis + scrollerProxy exist before child ScrollTriggers mount.
 */
export default function HomeSmoothScroll({ children }: HomeSmoothScrollProps) {
  useLayoutEffect(() => {
    document.documentElement.classList.add('home-page');
    ScrollTrigger.config({ limitCallbacks: true });

    if (prefersReducedMotion()) {
      return () => {
        document.documentElement.classList.remove('home-page');
      };
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      autoRaf: false,
    });

    setHomeLenis(lenis);

    ScrollTrigger.scrollerProxy(SCROLLER, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: SCROLLER.style.transform ? 'transform' : 'fixed',
    });

    ScrollTrigger.defaults({ scroller: SCROLLER });

    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    refresh();
    const refreshTimer = window.setTimeout(refresh, 450);
    window.addEventListener('load', refresh);
    document.fonts?.ready?.then?.(refresh);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      setHomeLenis(null);
      ScrollTrigger.scrollerProxy(SCROLLER);
      ScrollTrigger.defaults({ scroller: window });
      ScrollTrigger.clearScrollMemory();
      document.documentElement.classList.remove('home-page');
    };
  }, []);

  return <>{children}</>;
}
