import type { ReactNode } from 'react';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { homeContainer } from '../../home/components/HomeSection';
import AboutReveal from './AboutReveal';

/** Tighter vertical rhythm than home page sections */
export const aboutSectionPad = 'py-8 sm:py-12 lg:py-14 xl:py-16';

interface AboutSectionShellProps {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  headerAlign?: 'left' | 'center';
  children: ReactNode;
  className?: string;
  sectionPad?: string;
  headerMargin?: string;
  containerClass?: string;
}

/** About section shell — editorial React scroll reveal */
export function AboutSectionShell({
  id,
  eyebrow,
  title,
  subtitle,
  headerAlign = 'left',
  children,
  className = '',
  sectionPad = aboutSectionPad,
  headerMargin = 'mb-5 sm:mb-7 lg:mb-9',
  containerClass = homeContainer,
}: AboutSectionShellProps) {
  const { classes } = useDarkPageTheme();
  const { text, accentRule } = classes;
  const align = headerAlign === 'center' ? 'text-center mx-auto' : '';

  return (
    <section id={id} className={`relative ${sectionPad} ${className}`}>
      <div className={containerClass}>
        <header className={`${headerMargin} ${headerAlign === 'center' ? 'text-center' : ''}`}>
          <div className={`max-w-3xl ${align}`}>
            {eyebrow && (
              <AboutReveal delay={0}>
                <span className={`block ${text.label} mb-2.5 sm:mb-3`}>{eyebrow}</span>
              </AboutReveal>
            )}
            <AboutReveal delay={eyebrow ? 80 : 0}>
              <h2 className={text.title}>{title}</h2>
            </AboutReveal>
            <AboutReveal variant="rule" delay={160}>
              <div
                aria-hidden
                className={`mt-3 ${accentRule} ${headerAlign === 'center' ? 'mx-auto' : ''}`}
              />
            </AboutReveal>
            {subtitle && (
              <AboutReveal delay={240}>
                <p
                  className={`mt-3 max-w-2xl sm:mt-4 ${text.body} ${
                    headerAlign === 'center' ? 'mx-auto' : ''
                  }`}
                >
                  {subtitle}
                </p>
              </AboutReveal>
            )}
          </div>
        </header>
        <div className="relative">{children}</div>
      </div>
    </section>
  );
}

export function AboutSpinner({
  sectionPad = aboutSectionPad,
  containerClass = homeContainer,
}: {
  sectionPad?: string;
  containerClass?: string;
}) {
  const { classes } = useDarkPageTheme();

  return (
    <div className={`${sectionPad} ${containerClass}`}>
      <div className={`h-8 w-8 ${classes.spinner}`} />
    </div>
  );
}
