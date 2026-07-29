import { useState, useEffect } from 'react';
import { getHomeScrollY, scrollHomeToTop, subscribeHomeLenis } from '../homeMotion';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(getHomeScrollY() > 300);
    };

    let detachScroll: (() => void) | undefined;

    const unsubscribe = subscribeHomeLenis((lenis) => {
      detachScroll?.();
      detachScroll = undefined;

      if (lenis) {
        lenis.on('scroll', updateVisibility);
        detachScroll = () => lenis.off('scroll', updateVisibility);
      } else {
        window.addEventListener('scroll', updateVisibility, { passive: true });
        detachScroll = () => window.removeEventListener('scroll', updateVisibility);
      }

      updateVisibility();
    });

    return () => {
      detachScroll?.();
      unsubscribe();
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollHomeToTop}
          className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg bg-[#7cd244] text-white shadow-lg transition-all duration-300 hover:bg-[#6db038] sm:bottom-8 sm:right-8 sm:h-12 sm:w-12"
          aria-label="Scroll to top"
        >
          <i className="ri-arrow-up-s-line text-2xl"></i>
        </button>
      )}
    </>
  );
}
