import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  esgBadgeClasses,
  esgBadgeStyle,
  esgBadgeTextStyle,
  esgSectionHeading,
  type EsgAccentColor,
} from '../esgLayout';

type EsgSectionHeaderProps = {
  badgeIcon: LucideIcon;
  badgeLabel: string;
  accent: EsgAccentColor;
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
  badgeIcon: BadgeIcon,
  badgeLabel,
  accent,
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
  const badgeWrapClass = align === 'center' ? 'flex justify-center' : '';
  const accentColor = onDark ? undefined : esgBadgeTextStyle(accent).color;

  return (
    <header
      className={`mb-10 transition-all duration-700 ease-out sm:mb-12 ${alignClass} ${className} ${
        motionReady ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
        <div className={`mb-4 ${badgeWrapClass}`}>
        <div
          className={`esg-section-badge ${esgBadgeClasses(accent, onDark)}`}
          style={esgBadgeStyle(accent, onDark)}
        >
          <BadgeIcon
            className="h-4 w-4"
            style={onDark ? { color: '#b8e986' } : { color: accentColor }}
            strokeWidth={2}
            aria-hidden
          />
          <span
            className="text-[11px] font-bold uppercase tracking-[0.14em]"
            style={esgBadgeTextStyle(accent, onDark)}
          >
            {badgeLabel}
          </span>
        </div>
      </div>

      <h2
        id={titleId}
        className={
          onDark
            ? 'text-3xl font-bold uppercase tracking-[0.06em] text-white sm:text-4xl lg:text-[2.35rem]'
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
