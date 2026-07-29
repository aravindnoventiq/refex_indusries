import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { getHomeLenis } from '../homeMotion';

interface WelcomeModalProps {
  imageUrl?: string;
}

function lockPageScroll() {
  const html = document.documentElement;
  const body = document.body;
  const lenis = getHomeLenis();

  const prev = {
    htmlOverflow: html.style.overflow,
    bodyOverflow: body.style.overflow,
    bodyPaddingRight: body.style.paddingRight,
  };

  lenis?.stop();

  const scrollbarWidth = window.innerWidth - html.clientWidth;
  html.style.overflow = 'hidden';
  body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`;
  }

  return () => {
    lenis?.start();
    html.style.overflow = prev.htmlOverflow;
    body.style.overflow = prev.bodyOverflow;
    body.style.paddingRight = prev.bodyPaddingRight;
  };
}

export default function WelcomeModal({ imageUrl }: WelcomeModalProps) {
  const [showModal, setShowModal] = useState(false);
  const noticeImage = imageUrl || '/first.jpg';

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showModal) return;

    const unlock = lockPageScroll();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      unlock();
      window.removeEventListener('keydown', onKey);
    };
  }, [showModal, closeModal]);

  if (!showModal) return null;

  const defaultImage =
    'https://via.placeholder.com/800x600?text=Welcome+to+Refex+Industries';

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex animate-in items-center justify-center bg-black/70 p-3 duration-300 fade-in sm:p-4"
      onClick={closeModal}
    >
      <div
        className="theme-keep-light relative flex max-h-[min(92dvh,920px)] w-full max-w-4xl animate-in flex-col overflow-hidden rounded-lg bg-white shadow-2xl duration-300 zoom-in-95 sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeModal}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white p-2 text-gray-600 shadow-lg transition-all hover:bg-gray-100 hover:text-gray-900 sm:right-4 sm:top-4"
          aria-label="Close modal"
        >
          <i className="ri-close-line text-3xl font-bold"></i>
        </button>

        <div
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]"
        >
          <div className="p-4 pt-12 sm:pt-4">
            <img
              src={noticeImage}
              alt="Welcome"
              className="h-auto w-full rounded-lg"
              loading="eager"
              decoding="async"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultImage;
              }}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
