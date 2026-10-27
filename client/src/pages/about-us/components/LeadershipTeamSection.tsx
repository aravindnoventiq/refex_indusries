import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../services/api';
import { resolveMediaUrl } from '../../../utils/resolveMediaUrl';
import { FALLBACK_LEADERSHIP } from '../aboutFallbacks';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { ABOUT_REVEAL_STAGGER_MS } from '../useAboutReveal';
import AboutReveal from './AboutReveal';
import { AboutSectionShell, AboutSpinner } from './AboutSectionShell';

interface Leader {
  id: number;
  name: string;
  position: string;
  image?: string;
  linkedin?: string;
  biography?: string;
  order: number;
  isActive: boolean;
}

const ANIL_NAME = /anil\s+s\.?\s+kulkarni/i;

function withAnilKulkarni(leaders: Leader[]): Leader[] {
  if (leaders.some((leader) => ANIL_NAME.test(leader.name))) return leaders;
  const anil = FALLBACK_LEADERSHIP.find((leader) => ANIL_NAME.test(leader.name));
  if (!anil) return leaders;
  return [...leaders, anil].sort((a, b) => (a.order || 0) - (b.order || 0));
}

function LeadershipTeamSection() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setLoading(true);
        const data = await aboutCmsApi.getLeadershipTeam();
        const activeLeaders = (data || [])
          .filter((item: Leader) => item.isActive !== false)
          .filter((item: Leader) => !/gagan\s+bihari\s+pattnaik/i.test(item.name))
          .filter((item: Leader) => !/jaya\s+krishna/i.test(item.name))
          .sort((a: Leader, b: Leader) => (a.order || 0) - (b.order || 0));

        // CMS is source of truth when any active leaders exist
        setLeaders(withAnilKulkarni(activeLeaders.length > 0 ? activeLeaders : FALLBACK_LEADERSHIP));
      } catch {
        setLeaders(withAnilKulkarni(FALLBACK_LEADERSHIP));
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  const { classes } = useDarkPageTheme();
  const { text, imageCard, modal, modalClose, borderTop, modalOverlay } = classes;

  useEffect(() => {
    if (!selectedLeader) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedLeader(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [selectedLeader]);

  if (loading) {
    return (
      <div id="leadership-team">
        <AboutSpinner />
      </div>
    );
  }

  const displayLeaders = withAnilKulkarni(leaders.length > 0 ? leaders : FALLBACK_LEADERSHIP);

  return (
    <AboutSectionShell
      id="leadership-team"
      // eyebrow="People"
      title="Leadership Team"
      // subtitle="Operators and specialists driving execution across Refex’s businesses."
    >
      <div className="mx-auto grid max-w-5xl grid-cols-2 items-stretch gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 lg:gap-4">
        {displayLeaders.map((leader, index) => (
          <AboutReveal key={leader.id} delay={index * ABOUT_REVEAL_STAGGER_MS} className="h-full">
          <button
            type="button"
            className="group flex h-full w-full text-left"
            onClick={() => setSelectedLeader(leader)}
          >
            <div className={`flex h-full w-full flex-col ${imageCard}`}>
              <div className="relative aspect-square w-full shrink-0 overflow-hidden">
                <img
                  src={resolveMediaUrl(leader.image)}
                  alt={leader.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/300x400?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-4 translate-y-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  View profile
                </span>
              </div>
              <div className={`relative flex min-h-[4.5rem] flex-1 flex-col justify-center px-3 py-3 text-center ${borderTop}`}>
                <div className="absolute left-1/2 top-0 h-0.5 w-0 -translate-x-1/2 bg-[#7cd244] transition-all duration-300 group-hover:w-10" />
                <h3 className={`line-clamp-2 text-sm ${text.cardTitle}`}>{leader.name}</h3>
                <p className={`mt-1 line-clamp-2 text-xs ${text.bodySm}`}>
                  {leader.position}
                </p>
              </div>
            </div>
          </button>
          </AboutReveal>
        ))}
      </div>

      {selectedLeader && (
        <div
          className={modalOverlay}
          data-about-modal
          onClick={() => setSelectedLeader(null)}
        >
          <div
            className={modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedLeader(null)}
              className={`absolute right-3 top-3 z-20 ${modalClose}`}
              aria-label="Close"
            >
              ×
            </button>

            <div className="grid max-h-[90vh] overflow-y-auto md:grid-cols-[150px_1fr]">
              <div className="relative h-40 bg-black/30 md:h-auto md:max-h-[22rem]">
                <img
                  src={resolveMediaUrl(selectedLeader.image)}
                  alt={selectedLeader.name}
                  className="h-full w-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/300x400?text=No+Image';
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:hidden">
                  <h2 className="mt-1 font-bold tracking-[-0.015em] leading-snug text-lg text-white sm:text-xl">
                    {selectedLeader.name}
                  </h2>
                </div>
              </div>

              <div className="px-6 py-7 sm:px-8 sm:py-9">
                <div className="hidden md:block">
                  <h2 className={text.titleLg}>{selectedLeader.name}</h2>
                  <p className={`mt-1.5 ${text.body}`}>{selectedLeader.position}</p>
                </div>
                <p className={`mt-2 md:hidden ${text.bodySm}`}>{selectedLeader.position}</p>

                {selectedLeader.linkedin?.trim() && (
                  <a
                    href={selectedLeader.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a66c2] transition hover:opacity-90"
                    aria-label="LinkedIn profile"
                  >
                    <i className="ri-linkedin-fill text-xl text-white" />
                  </a>
                )}

                <div className={`mt-5 space-y-3 pt-5 ${borderTop} ${text.body}`}>
                  {(selectedLeader.biography?.trim() || 'Biography will be updated soon.')
                    .split('\n')
                    .map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AboutSectionShell>
  );
}

export default LeadershipTeamSection;
