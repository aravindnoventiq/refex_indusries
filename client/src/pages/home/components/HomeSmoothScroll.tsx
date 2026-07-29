import { useLayoutEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  isMobileViewport,
  prefersReducedMotion,
  setHomeLenis,
  shouldUseLenisSmoothScroll,
  shouldUseNativeScrollTriggerSync,
} from '../homeMotion';
import { setHomeMobileDocumentClass } from '../homeMobile';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

interface HomeSmoothScrollProps {
  children: ReactNode;
}

/**
 * Lenis + GSAP ScrollTrigger on all viewports (touch-tuned on mobile).
 * Reduced motion: native scroll + ScrollTrigger sync only.
 */
export default function HomeSmoothScroll({ children }: HomeSmoothScrollProps) {
  useLayoutEffect(() => {
    document.documentElement.classList.add('home-page');

    const mobile = isMobileViewport();
    setHomeMobileDocumentClass(mobile);

    ScrollTrigger.config({ limitCallbacks: true });

    if (mobile && ScrollTrigger.isTouch === 1) {
      ScrollTrigger.normalizeScroll(true);
    }

    const refresh = () => ScrollTrigger.refresh();
    refresh();
    const refreshTimer = window.setTimeout(refresh, 450);
    window.addEventListener('load', refresh);
    document.fonts?.ready?.then?.(refresh);

    if (prefersReducedMotion() || !shouldUseLenisSmoothScroll()) {
      let scrollRaf: number | null = null;
      const onScroll = () => {
        if (scrollRaf != null) return;
        scrollRaf = window.requestAnimationFrame(() => {
          scrollRaf = null;
          ScrollTrigger.update();
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', onScroll);
        if (scrollRaf != null) window.cancelAnimationFrame(scrollRaf);
        window.clearTimeout(refreshTimer);
        window.removeEventListener('load', refresh);
        if (mobile) ScrollTrigger.normalizeScroll(false);
        ScrollTrigger.clearScrollMemory();
        setHomeMobileDocumentClass(false);
        document.documentElement.classList.remove('home-page');
      };
    }

    const lenis = new Lenis({
      lerp: mobile ? 0.12 : 0.1,
      smoothWheel: !mobile,
      wheelMultiplier: 0.9,
      touchMultiplier: mobile ? 1.35 : 1.1,
      autoRaf: false,
    });

    setHomeLenis(lenis);

    const useNativeSync = shouldUseNativeScrollTriggerSync();

    if (!useNativeSync) {
      const scroller = document.documentElement;

      ScrollTrigger.scrollerProxy(scroller, {
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
        pinType: scroller.style.transform ? 'transform' : 'fixed',
      });

      ScrollTrigger.defaults({ scroller });
    }

    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      setHomeLenis(null);

      if (!useNativeSync) {
        ScrollTrigger.scrollerProxy(document.documentElement);
        ScrollTrigger.defaults({ scroller: window });
      }

      if (mobile) ScrollTrigger.normalizeScroll(false);
      ScrollTrigger.clearScrollMemory();
      setHomeMobileDocumentClass(false);
      document.documentElement.classList.remove('home-page');
    };
  }, []);

  return <>{children}</>;
}
