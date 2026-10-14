import type { ReactNode } from 'react';
import { esgSectionHeading } from '../esgLayout';

type EsgSectionHeaderProps = {
  title: ReactNode;
  titleId: string;
  motionReady?: boolean;
  align?: 'center' | 'left';
  onDark?: boolean;
  description?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function EsgSectionHeader({
  title,
  titleId,
  motionReady = true,
  align = 'center',
  onDark = false,
  description,
  className = '',
  children,
}: EsgSectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto max-w-4xl' : 'max-w-4xl';

  return (
    <header
      className={`mb-10 transition-all duration-700 ease-out sm:mb-12 ${alignClass} ${className} ${
        motionReady ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <h2
        id={titleId}
        className={
          onDark
            ? 'text-[2.35rem] font-bold uppercase tracking-[0.06em] text-white sm:text-[2.85rem] lg:text-[3.9rem]'
            : esgSectionHeading
        }
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-5 text-base leading-relaxed sm:text-[17px] ${
            onDark ? 'text-white/85' : 'text-[#484848]'
          } ${align === 'center' ? 'text-center' : 'text-left'}`}
        >
          {description}
        </p>
      )}

      {children}
    </header>
  );
}
