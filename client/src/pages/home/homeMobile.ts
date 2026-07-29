import { useMediaQuery } from 'react-responsive';

import { MOBILE_MAX_WIDTH } from '../../utils/responsive';

export const HOME_HERO_SENTINEL_ID = 'home-hero-sentinel';

/** Tracks mobile viewport via react-responsive — home hero/layout only. */
export function useHomeMobile(): boolean {
  return useMediaQuery({ maxWidth: MOBILE_MAX_WIDTH });
}

export function setHomeMobileDocumentClass(enabled: boolean) {
  document.documentElement.classList.toggle('home-mobile', enabled);
}
