import { useState, useEffect, useMemo } from 'react';
import { aboutCmsApi } from '../../../services/api';
import { FALLBACK_ABOUT_CONTENT } from '../aboutFallbacks';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { ABOUT_REVEAL_STAGGER_MS } from '../useAboutReveal';
import AboutReveal from './AboutReveal';
import { AboutSectionShell, AboutSpinner } from './AboutSectionShell';

const LOGO_DARK = '/brand/logo-refex-header.svg';
const LOGO_LIGHT = '/brand/logo-refex.svg';

const BUSINESS_LINES = [
  {
    title: 'Ash & Coal Handling',
    text: 'Integrated coal handling and sustainable ash utilisation for thermal power plants.',
  },
  {
    title: 'Clean Mobility',
    text: 'Technology-enabled transportation through Refex Green Mobility Limited.',
  },
  {
    title: 'Renewable Energy',
    text: 'Wind energy manufacturing and engineering excellence through Venwind Refex.',
  },
] as const;

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

function foundedYearFrom(text: string): string {
  const match = text.match(/\b((?:19|20)\d{2})\b/);
  return match?.[1] ?? '2002';
}

function displayTitle(cmsTitle?: string): string {
  const title = (cmsTitle || '').trim();
  if (!title || /^about\s*us$/i.test(title)) return 'Who We Are';
  return title;
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
          setSection({ title: 'Who We Are', content: FALLBACK_ABOUT_CONTENT, isActive: true });
        } else {
          setSection(data);
        }
      } catch {
        setSection({ title: 'Who We Are', content: FALLBACK_ABOUT_CONTENT, isActive: true });
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
  const { text, surfaceStrong } = classes;
  const logoSrc = theme === 'light' ? LOGO_LIGHT : LOGO_DARK;
  const yearTone = theme === 'light' ? 'text-[#1f1f1f]' : 'text-white';
  const yearMuted = theme === 'light' ? 'text-[#6b7a63]' : 'text-white/50';
  const glow = theme === 'light' ? 'bg-[#4C8C2B]/10' : 'bg-[#7cd244]/12';
  const rail = theme === 'light' ? 'bg-[#4C8C2B]' : 'bg-[#7cd244]';

  if (loading) {
    return (
      <div id="about">
        <AboutSpinner />
      </div>
    );
  }

  const title = displayTitle(section?.title);
  const [lead, ...rest] = paragraphs;
  const foundedYear = foundedYearFrom(lead || FALLBACK_ABOUT_CONTENT);

  return (
    <AboutSectionShell
      id="about"
      title={title}
      sectionPad="pt-10 pb-10 sm:pt-14 sm:pb-14 lg:pt-16 lg:pb-16 xl:pt-20 xl:pb-16"
    >
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16 xl:gap-20">
        <AboutReveal>
          <div className="relative">
            <div
              aria-hidden
              className={`pointer-events-none absolute -left-8 -top-10 h-36 w-36 rounded-full blur-3xl ${glow}`}
            />
            <p
              className={`relative font-bold tracking-[-0.06em] leading-none ${yearTone} text-[4.5rem] sm:text-[5.5rem] lg:text-[6.5rem]`}
            >
              {foundedYear}
            </p>
            <p className={`mt-3 text-xs font-semibold uppercase tracking-[0.28em] ${yearMuted}`}>
              Founded
            </p>
            <img
              src={logoSrc}
              alt="Refex Industries Limited"
              loading="lazy"
              className="mt-8 h-auto w-[148px] object-contain sm:w-[168px]"
            />
          </div>
        </AboutReveal>

        <article>
          {lead && (
            <AboutReveal delay={ABOUT_REVEAL_STAGGER_MS}>
              <p
                className={`text-[1.2rem] font-medium leading-[1.45] tracking-[-0.02em] sm:text-[1.4rem] sm:leading-[1.4] lg:text-[1.55rem] ${
                  theme === 'light' ? 'text-[#1f1f1f]' : 'text-white'
                }`}
              >
                {lead}
              </p>
            </AboutReveal>
          )}

          {rest.length > 0 && (
            <div className={`mt-6 space-y-4 sm:mt-8 sm:space-y-5 ${text.body}`}>
              {rest.map((paragraph, index) => (
                <AboutReveal key={index} delay={(index + 2) * ABOUT_REVEAL_STAGGER_MS}>
                  <p className="max-w-2xl text-[0.98rem] leading-[1.8] sm:text-[1.05rem] sm:leading-[1.85]">
                    {paragraph}
                  </p>
                </AboutReveal>
              ))}
            </div>
          )}
        </article>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-3 lg:mt-14 lg:gap-5">
        {BUSINESS_LINES.map((line, index) => (
          <AboutReveal key={line.title} delay={(index + 1) * ABOUT_REVEAL_STAGGER_MS}>
            <article className={`relative h-full overflow-hidden rounded-xl p-5 sm:p-6 ${surfaceStrong}`}>
              <div aria-hidden className={`absolute left-0 top-0 h-full w-[3px] ${rail}`} />
              <h3 className={text.cardTitle}>{line.title}</h3>
              <p className={`mt-3 ${text.bodySm}`}>{line.text}</p>
            </article>
          </AboutReveal>
        ))}
      </div>
    </AboutSectionShell>
  );
}
