import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../services/api';
import {
  normalizePresenceStates,
  withVerticalCounts,
  type StatePresence,
} from '../data/indiaPresenceData';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import AboutReveal from './AboutReveal';
import { AboutSectionShell, AboutSpinner } from './AboutSectionShell';
import IndiaPresenceMap from './IndiaPresenceMap';

interface AboutPresence {
  id?: number;
  title: string;
  subtitle?: string;
  mapImage?: string;
  presenceTextImage?: string;
  states?: StatePresence[];
  isActive: boolean;
}

function OurPresenceSection() {
  const [presence, setPresence] = useState<AboutPresence | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeVertical, setActiveVertical] = useState<string | null>(null);

  useEffect(() => {
    const fetchPresence = async () => {
      try {
        setLoading(true);
        const data = await aboutCmsApi.getPresence();
        if (data && (data.isActive === true || data.isActive === undefined || data.isActive === null)) {
          setPresence(data);
        } else {
          setPresence({
            title: 'Driving Impact Across India',
            // subtitle: 'Operational footprint across energy, mobility, and renewables',
            isActive: true,
          });
        }
      } catch {
        setPresence({
          title: 'Driving Impact Across India',
          // subtitle: 'Operational footprint across energy, mobility, and renewables',
          isActive: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPresence();
  }, []);

  const { classes } = useDarkPageTheme();
  const { text, imageCard, tabActive, tabInactive } = classes;

  if (loading) {
    return (
      <div id="our-presence">
        <AboutSpinner />
      </div>
    );
  }

  const display = presence || {
    title: 'Driving Impact Across India',
  };
  const mapStates = normalizePresenceStates(presence?.states);
  const verticals = withVerticalCounts(mapStates);

  return (
    <AboutSectionShell
      id="our-presence"
      eyebrow="our presence"
      title={display.title}
      // subtitle={display.subtitle}
    >
      <AboutReveal>
        <figure className={`relative overflow-visible px-5 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5 lg:px-7 lg:pt-7 lg:pb-5 ${imageCard}`}>
          <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-5">
            <span aria-hidden />
            <p className={`mb-3 ${text.label}`}>Business verticals</p>
          </div>

          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-stretch lg:gap-5">
            <div className="flex min-h-[280px] w-full items-stretch sm:min-h-[360px] lg:min-h-[420px]">
              <IndiaPresenceMap fillHeight states={mapStates} />
            </div>

            <aside className="flex min-h-0 flex-col">
              <p className={`mb-3 lg:hidden ${text.label}`}>Business verticals</p>

              <div className="flex flex-1 flex-col justify-center gap-2.5">
                {verticals.map((vertical, index) => {
                  const isActive = activeVertical === vertical.id;
                  return (
                    <article
                      key={vertical.id}
                      className={`group relative overflow-hidden rounded-xl border p-3.5 transition-all duration-300 sm:p-4 ${
                        isActive ? tabActive : tabInactive
                      }`}
                      onMouseEnter={() => setActiveVertical(vertical.id)}
                      onMouseLeave={() => setActiveVertical(null)}
                      onFocus={() => setActiveVertical(vertical.id)}
                      onBlur={() => setActiveVertical(null)}
                      tabIndex={0}
                    >
                      <div
                        className="absolute left-0 top-0 h-full w-1 transition-opacity duration-300"
                        style={{ backgroundColor: vertical.accent, opacity: isActive ? 1 : 0.45 }}
                        aria-hidden
                      />
                      <div className="pl-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className={text.meta}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                            style={{ backgroundColor: `${vertical.accent}22`, color: vertical.accent }}
                          >
                            {vertical.states} states
                          </span>
                        </div>
                        <h3
                          className={`mt-1.5 text-base font-bold leading-snug transition-colors duration-300 sm:text-lg group-hover:text-[#7cd144] ${text.cardTitle}`}
                        >
                          {vertical.name}
                        </h3>
                        <div
                          className={
                            'grid transition-[grid-template-rows,opacity] duration-300 ease-out ' +
                            'grid-rows-[0fr] opacity-0 ' +
                            'group-hover:grid-rows-[1fr] group-hover:opacity-100 ' +
                            'group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100 ' +
                            '[@media(hover:none)]:grid-rows-[1fr] [@media(hover:none)]:opacity-100'
                          }
                        >
                          <p className={`mt-1.5 min-h-0 overflow-hidden ${text.bodySm}`}>
                            {vertical.description}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </aside>
          </div>
        </figure>
      </AboutReveal>
    </AboutSectionShell>
  );
}

export default OurPresenceSection;
