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
          className="fixed bottom-8 right-8 w-12 h-12 bg-[#7cd244] text-white rounded-lg shadow-lg hover:bg-[#6db038] transition-all duration-300 flex items-center justify-center z-50 cursor-pointer"
          aria-label="Scroll to top"
        >
          <i className="ri-arrow-up-s-line text-2xl"></i>
        </button>
      )}
    </>
  );
}
