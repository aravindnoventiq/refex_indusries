import type { ReactNode } from 'react';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import {
  AboutSectionShell,
  AboutSpinner as BaseSpinner,
} from '../../about-us/components/AboutSectionShell';
import { ashSectionPad, ashContainer } from '../ashLayout';

interface AshSectionShellProps {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  headerAlign?: 'left' | 'center';
  children: ReactNode;
  className?: string;
  /** Last section can omit bottom border */
  showDivider?: boolean;
}

export function AshSectionShell({
  showDivider = true,
  className = '',
  ...props
}: AshSectionShellProps) {
  const { theme, classes } = useDarkPageTheme();
  const titleClassName =
    theme === 'light'
      ? 'font-bold tracking-[-0.02em] leading-[1.15] text-[#1f1f1f] text-xl sm:text-2xl lg:text-[1.85rem]'
      : 'font-bold tracking-[-0.02em] leading-[1.15] text-white text-xl sm:text-2xl lg:text-[1.85rem]';

  return (
    <AboutSectionShell
      {...props}
      titleClassName={titleClassName}
      sectionPad={ashSectionPad}
      headerMargin="mb-6 sm:mb-8 lg:mb-9"
      containerClass={ashContainer}
      className={`${showDivider ? classes.divider : ''} ${className}`.trim()}
    />
  );
}

export function AshSpinner() {
  return <BaseSpinner sectionPad={ashSectionPad} containerClass={ashContainer} />;
}

export const AboutSpinner = AshSpinner;
