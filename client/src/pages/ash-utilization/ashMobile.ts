import { useEffect, useState } from 'react';
import { MOBILE_MAX_WIDTH, isMobileViewport } from '../../utils/responsive';

/** Reactively tracks mobile viewport for ash-utilization page. */
export function useAshMobile(): boolean {
  const [mobile, setMobile] = useState(() => isMobileViewport());

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return mobile;
}

/** Card body — always expanded on mobile; hover/focus on desktop */
export const ashExpandablePanel =
  'transition-all duration-500 ease-out ' +
  'max-h-0 translate-y-4 opacity-0 ' +
  'max-md:max-h-none max-md:translate-y-0 max-md:opacity-100 ' +
  'md:group-hover:max-h-[420px] md:group-hover:translate-y-0 md:group-hover:opacity-100';

/** Description that hides on desktop hover — stays on mobile */
export const ashCardDescription = (hidden: boolean) =>
  `mt-2 text-sm leading-relaxed text-white/75 transition-all duration-500 sm:text-[0.9375rem] ` +
  `${hidden ? 'max-md:max-h-none max-md:opacity-100 max-h-0 overflow-hidden opacity-0 md:group-hover:max-h-0 md:group-hover:opacity-0' : 'max-h-24 opacity-100 md:group-hover:max-h-0 md:group-hover:overflow-hidden md:group-hover:opacity-0'}`;
