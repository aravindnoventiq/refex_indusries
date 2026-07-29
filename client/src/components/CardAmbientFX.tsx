import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export type AmbientFxVariant = 'ash' | 'leaf' | 'wind';

interface CardAmbientFXProps {
  variant: AmbientFxVariant;
  count?: number;
}

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export default function CardAmbientFX({ variant, count }: CardAmbientFXProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const height = container.offsetHeight || 400;
      const particles = Array.from(container.children) as HTMLElement[];

      particles.forEach((el) => {
        const delay = rand(0, 4);
        const tl = gsap.timeline({ repeat: -1, delay, paused: false });

        if (variant === 'ash') {
          const rise = height * rand(0.9, 1.15);
          gsap.set(el, { y: 0, x: 0, opacity: 0, willChange: 'transform, opacity' });
          tl.to(el, { opacity: 0.85, duration: 0.6, ease: 'sine.out' }, 0)
            .to(el, { y: -rise, duration: rand(5, 8), ease: 'none' }, 0)
            .to(el, { x: rand(-14, 14), duration: rand(1.8, 2.6), repeat: 3, yoyo: true, ease: 'sine.inOut' }, 0)
            .to(el, { opacity: 0, duration: 0.8 }, `-=0.8`);
        } else if (variant === 'leaf') {
          const fall = height * rand(0.9, 1.15);
          gsap.set(el, { y: 0, x: 0, rotation: rand(-20, 20), opacity: 0, willChange: 'transform, opacity' });
          tl.to(el, { opacity: 0.9, duration: 0.5 }, 0)
            .to(el, { y: fall, duration: rand(6, 9), ease: 'none' }, 0)
            .to(el, { x: rand(-12, 12), rotation: `+=${rand(80, 200)}`, duration: rand(2, 3), repeat: 3, yoyo: true, ease: 'sine.inOut' }, 0)
            .to(el, { opacity: 0, duration: 0.7 }, `-=0.7`);
        } else {
          const travel = (container.offsetWidth || 400) * 1.4;
          gsap.set(el, { x: -travel * 0.5, opacity: 0, willChange: 'transform, opacity' });
          tl.to(el, { opacity: 0.55, duration: 0.3 }, 0)
            .to(el, { x: travel * 0.5, duration: rand(2.5, 4), ease: 'none' }, 0)
            .to(el, { opacity: 0, duration: 0.4 }, `-=0.4`);
        }
      });

      return () => {
        gsap.killTweensOf(particles);
      };
    });

    return () => mm.revert();
  }, [variant]);

  const n = count ?? (variant === 'wind' ? 6 : variant === 'leaf' ? 7 : 12);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-[6]"
      aria-hidden="true"
    >
      {Array.from({ length: n }).map((_, i) => {
        if (variant === 'ash') {
          const size = rand(2, 4);
          return (
            <span
              key={i}
              className="absolute rounded-full bg-white/70 blur-[0.5px]"
              style={{ width: size, height: size, left: `${rand(5, 95)}%`, top: '96%' }}
            />
          );
        }
        if (variant === 'leaf') {
          return (
            <i
              key={i}
              className="ri-leaf-fill absolute text-emerald-400/80"
              style={{ fontSize: rand(10, 16), left: `${rand(5, 95)}%`, top: '-8%' }}
            />
          );
        }
        return (
          <span
            key={i}
            className="absolute h-px rounded-full"
            style={{
              width: rand(60, 140),
              top: `${rand(10, 90)}%`,
              left: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
            }}
          />
        );
      })}
    </div>
  );
}
