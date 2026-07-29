import {
  createElement,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';
import { useAboutReveal } from '../useAboutReveal';

type AboutRevealVariant = 'fade-up' | 'rule';

type AboutRevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: AboutRevealVariant;
  style?: CSSProperties;
};

export default function AboutReveal<T extends ElementType = 'div'>({
  as,
  children,
  className = '',
  delay = 0,
  variant = 'fade-up',
  style,
}: AboutRevealProps<T>) {
  const Tag = as ?? 'div';
  const { ref, isVisible } = useAboutReveal<HTMLElement>();

  const variantClass = variant === 'rule' ? 'about-reveal-rule' : 'about-reveal-up';

  return createElement(
    Tag,
    {
      ref,
      className: `about-reveal ${variantClass} ${isVisible ? 'is-visible' : ''} ${className}`.trim(),
      style: {
        ...style,
        ...(delay > 0 ? { transitionDelay: `${delay}ms` } : undefined),
      },
    },
    children,
  );
}
