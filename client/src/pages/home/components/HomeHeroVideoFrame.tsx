import type { CSSProperties, ReactNode } from 'react';

import { getHomeHeroAspectRatio } from '../homeMotion';

interface HomeHeroVideoFrameProps {
  isMobile: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Responsive hero media shell — 9:16 cover on mobile, 16:9 on desktop.
 * Video/img children keep direct refs for GSAP scroll-scrub.
 */
export default function HomeHeroVideoFrame({
  isMobile,
  className = '',
  style,
  children,
}: HomeHeroVideoFrameProps) {
  const aspectRatio = getHomeHeroAspectRatio(isMobile);

  return (
    <div
      className={`home-hero-video-frame pointer-events-none ${
        isMobile ? 'home-hero-video-frame--mobile' : 'home-hero-video-frame--desktop'
      } ${className}`}
      style={{ aspectRatio, ...style }}
      aria-hidden
    >
      {children}
    </div>
  );
}
