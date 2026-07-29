import { useState, useEffect, useMemo } from 'react';
import { aboutCmsApi } from '../../../services/api';
import { FALLBACK_ABOUT_CONTENT } from '../aboutFallbacks';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { ABOUT_REVEAL_STAGGER_MS } from '../useAboutReveal';
import AboutReveal from './AboutReveal';
import { AboutSectionShell, AboutSpinner } from './AboutSectionShell';

const LOGO_DARK = '/brand/logo-refex-header.svg';
const LOGO_LIGHT = '/brand/logo-refex.svg';

interface AboutPageSection {
  id?: number;
  title: string;
  content: string;
  isActive: boolean;
}

function toParagraphs(raw: string): string[] {
  const normalized = raw.replace(/\r\n/g, '\n').trim();
  const byBlank = normalized
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  if (byBlank.length > 1) return byBlank;
  return normalized
    .split(/\n+/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

export default function AboutSection() {
  const [section, setSection] = useState<AboutPageSection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSection = async () => {
      try {
        setLoading(true);
        const data = await aboutCmsApi.getAboutPageSection();
        if (!data || data.isActive === false || !String(data.content || '').trim()) {
          setSection({ title: 'About Us', content: FALLBACK_ABOUT_CONTENT, isActive: true });
        } else {
          setSection(data);
        }
      } catch {
        setSection({ title: 'About Us', content: FALLBACK_ABOUT_CONTENT, isActive: true });
      } finally {
        setLoading(false);
      }
    };
    fetchSection();
  }, []);

  const paragraphs = useMemo(
    () => toParagraphs(section?.content || FALLBACK_ABOUT_CONTENT),
    [section?.content],
  );

  const { classes, theme } = useDarkPageTheme();
  const { text, surface, surfaceStrong, leadBox, highlight } = classes;
  const logoSrc = theme === 'light' ? LOGO_LIGHT : LOGO_DARK;
  const logoCardClass = theme === 'light' ? surfaceStrong : surface;

  if (loading) {
    return (
      <div id="about">
        <AboutSpinner />
      </div>
    );
  }

  const title = section?.title || 'About Us';
  const [lead, ...rest] = paragraphs;

  return (
    <AboutSectionShell id="about" eyebrow="Who We Are" title={title}>
      <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] md:items-stretch md:gap-10 lg:gap-14">
        <AboutReveal delay={0} className="h-full">
          <div
            className={`relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-xl p-6 sm:min-h-[220px] sm:p-8 md:min-h-0 md:rounded-lg ${logoCardClass}`}
          >
            <div
              aria-hidden
              className="absolute left-0 top-0 h-full w-[3px] bg-[#7cd244]"
            />
            <div
              aria-hidden
              className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl ${
                theme === 'light' ? 'bg-[#4C8C2B]/8' : 'bg-[#7cd244]/10'
              }`}
            />
            <div className="flex flex-1 items-center justify-center py-3 sm:py-4">
              <img
                src={logoSrc}
                alt="Refex Industries Limited"
                loading="lazy"
                className="h-auto w-full max-w-[200px] object-contain sm:max-w-[240px] md:max-w-[260px]"
              />
            </div>
          </div>
        </AboutReveal>

        <article className="flex flex-col gap-4 sm:gap-5">
          <AboutReveal delay={ABOUT_REVEAL_STAGGER_MS}>
            <p className={leadBox}>
              {lead}
            </p>
          </AboutReveal>
          {rest.map((paragraph, index) => {
            const isClose = index === rest.length - 1;
            return (
              <AboutReveal key={index} delay={(index + 2) * ABOUT_REVEAL_STAGGER_MS}>
                <p
                  className={
                    isClose
                      ? highlight
                      : `text-sm leading-[1.75] sm:text-[15px] sm:leading-[1.8] md:text-base ${text.bodySm}`
                  }
                >
                  {paragraph}
                </p>
              </AboutReveal>
            );
          })}
        </article>
      </div>
    </AboutSectionShell>
  );
}
