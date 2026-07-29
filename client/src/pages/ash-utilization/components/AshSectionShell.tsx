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
  const { classes } = useDarkPageTheme();

  return (
    <AboutSectionShell
      {...props}
      sectionPad={ashSectionPad}
      headerMargin="mb-8 sm:mb-10 lg:mb-12"
      containerClass={ashContainer}
      className={`${showDivider ? classes.divider : ''} ${className}`.trim()}
    />
  );
}

export function AshSpinner() {
  return <BaseSpinner sectionPad={ashSectionPad} containerClass={ashContainer} />;
}

export const AboutSpinner = AshSpinner;
