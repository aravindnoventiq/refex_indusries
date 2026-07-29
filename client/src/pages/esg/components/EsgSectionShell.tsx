import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../about-us/aboutGsap';
import { esgContainer, esgSectionPad } from '../esgLayout';

interface EsgSectionShellProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  animate?: boolean;
}

export default function EsgSectionShell({
  id,
  className = '',
  containerClassName = '',
  children,
  animate = true,
}: EsgSectionShellProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !animate) return;

    const items = section.querySelectorAll<HTMLElement>('[data-esg-anim]');
    if (!items.length) return;

    if (prefersReducedMotion()) {
      gsap.set(items, { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(items, {
        autoAlpha: 0,
        y: 28,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 84%',
          once: true,
        },
      });
    }, section);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [animate]);

  return (
    <section ref={sectionRef} id={id} className={`${esgSectionPad} ${className}`.trim()}>
      <div className={`${esgContainer} ${containerClassName}`.trim()}>{children}</div>
    </section>
  );
}
