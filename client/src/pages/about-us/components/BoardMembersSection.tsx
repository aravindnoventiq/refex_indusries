import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../services/api';
import { FALLBACK_BOARD_MEMBERS, enrichBoardMembers } from '../aboutFallbacks';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { ABOUT_REVEAL_STAGGER_MS } from '../useAboutReveal';
import AboutReveal from './AboutReveal';
import { AboutSectionShell, AboutSpinner } from './AboutSectionShell';

interface BoardMember {
  id: number;
  name: string;
  position: string;
  image?: string;
  biography?: string;
  linkedin?: string;
  directorshipDetails?: string;
  order: number;
  isActive: boolean;
}

function parseDirectorshipLines(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^\d+\.\s*/, ''));
}

function BoardMembersSection() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);
  const [showDirectorship, setShowDirectorship] = useState(false);

  useEffect(() => {
    const fetchBoardMembers = async () => {
      try {
        setLoading(true);
        const data = await aboutCmsApi.getBoardMembers();
        const activeMembers = (data || [])
          .filter((item: BoardMember) => item.isActive !== false)
          .sort((a: BoardMember, b: BoardMember) => (a.order || 0) - (b.order || 0));

        const enriched = enrichBoardMembers(
          activeMembers.length > 0 ? activeMembers : FALLBACK_BOARD_MEMBERS,
          FALLBACK_BOARD_MEMBERS,
        );
        setBoardMembers(enriched);
      } catch {
        setBoardMembers(FALLBACK_BOARD_MEMBERS);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardMembers();
  }, []);

  const { classes } = useDarkPageTheme();
  const {
    text,
    imageCard,
    modal,
    modalClose,
    borderTop,
    modalOverlay,
    directorshipPanel,
    directorshipBody,
  } = classes;

  useEffect(() => {
    if (!selectedMember) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selectedMember]);

  if (loading) {
    return (
      <div id="board-members">
        <AboutSpinner />
      </div>
    );
  }

  const members = (boardMembers.length > 0 ? boardMembers : FALLBACK_BOARD_MEMBERS).map((m) => ({
    ...m,
    image:
      m.image && m.image.startsWith('/')
        ? `https://refex.co.in${m.image}`
        : m.image,
  }));

  return (
    <AboutSectionShell
      id="board-members"
      // eyebrow="Governance"
      title="Board Members"
      // subtitle="Experienced leaders guiding strategy, compliance, and long-term value creation."
    >
      <div className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
        {members.map((member, index) => (
          <AboutReveal key={member.id} delay={index * ABOUT_REVEAL_STAGGER_MS} className="h-full">
            <button
              type="button"
              className="group flex h-full w-full text-left"
            onClick={() => {
              setSelectedMember(member);
              setShowDirectorship(false);
            }}
          >
            <div className={`flex h-full w-full flex-col ${imageCard}`}>
              <div className="relative aspect-[3/3.6] w-full shrink-0 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/300x400?text=No+Image')
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-4 translate-y-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  View profile
                </span>
              </div>
              <div className={`relative flex min-h-[4.75rem] flex-1 flex-col justify-center px-3 py-3 text-center sm:min-h-[5.25rem] sm:px-4 sm:py-3.5 ${borderTop}`}>
                <div className="absolute left-1/2 top-0 h-0.5 w-0 -translate-x-1/2 bg-[#7cd244] transition-all duration-300 group-hover:w-10" />
                <h3 className={`line-clamp-2 text-sm sm:text-base ${text.cardTitle}`}>
                  {member.name}
                </h3>
                <p className={`mt-1 line-clamp-2 text-xs sm:text-sm ${text.bodySm}`}>
                  {member.position}
                </p>
              </div>
            </div>
          </button>
          </AboutReveal>
        ))}
      </div>

      {selectedMember && (
        <div
          className={modalOverlay}
          data-about-modal
          onClick={() => {
            setSelectedMember(null);
            setShowDirectorship(false);
          }}
        >
          <div
            className={modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setSelectedMember(null);
                setShowDirectorship(false);
              }}
              className={`absolute right-3 top-3 z-20 ${modalClose}`}
              aria-label="Close"
            >
              ×
            </button>

            <div className="grid max-h-[90vh] overflow-y-auto md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
              <div className="relative min-h-[220px] bg-black/30 md:min-h-full">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="h-full w-full object-cover object-top"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/300x400?text=No+Image')
                  }
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:hidden">
                  <p className={text.label}>Board Member</p>
                  <h2 className="mt-1 font-bold tracking-[-0.015em] leading-snug text-lg text-white sm:text-xl">
                    {selectedMember.name}
                  </h2>
                </div>
              </div>

              <div className="px-6 py-7 sm:px-8 sm:py-9">
                <div className="hidden md:block">
                  <p className={text.label}>Board Member</p>
                  <h2 className={`mt-2 ${text.titleLg}`}>{selectedMember.name}</h2>
                  <p className={`mt-1.5 ${text.body}`}>{selectedMember.position}</p>
                </div>
                <p className={`mt-2 md:hidden ${text.bodySm}`}>{selectedMember.position}</p>

                {selectedMember.linkedin?.trim() && (
                  <a
                    href={selectedMember.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a66c2] transition hover:opacity-90"
                    aria-label="LinkedIn profile"
                  >
                    <i className="ri-linkedin-fill text-xl text-white" />
                  </a>
                )}

                <div className={`mt-5 space-y-3 pt-5 ${borderTop} ${text.body}`}>
                  {(selectedMember.biography?.trim() || 'Biography will be updated soon.')
                    .split('\n')
                    .map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                </div>

                <div className={`mt-6 ${directorshipPanel}`}>
                  <button
                    type="button"
                    onClick={() => setShowDirectorship(!showDirectorship)}
                    className="flex w-full items-center justify-between bg-[#7cd244] px-5 py-3.5 text-left text-sm font-semibold uppercase tracking-wide text-[#0a0a0a] transition hover:bg-[#6db038]"
                  >
                    Directorship Details
                    <span className="text-lg leading-none">{showDirectorship ? '−' : '+'}</span>
                  </button>
                  {showDirectorship && (
                    <div className={directorshipBody}>
                      <ol className={`list-decimal space-y-2 pl-5 ${text.body}`}>
                        {parseDirectorshipLines(
                          selectedMember.directorshipDetails?.trim() ||
                            'No directorship details available.',
                        ).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AboutSectionShell>
  );
}

export default BoardMembersSection;
