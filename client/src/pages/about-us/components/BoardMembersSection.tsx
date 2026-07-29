import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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

  const closeModal = useCallback(() => {
    setSelectedMember(null);
    setShowDirectorship(false);
  }, []);

  useEffect(() => {
    if (!selectedMember) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selectedMember]);

  useEffect(() => {
    if (!selectedMember) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedMember, closeModal]);

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

  const modalNode =
    selectedMember &&
    createPortal(
      <div
        className={`${modalOverlay} z-[120] items-end p-0 sm:items-center sm:p-4`}
        data-about-modal
        onClick={closeModal}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedMember.name} — ${selectedMember.position}`}
          className={`${modal} flex max-h-[92dvh] w-full max-w-4xl flex-col rounded-t-2xl sm:max-h-[min(90vh,880px)] sm:rounded-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={closeModal}
            className={`absolute right-3 top-3 z-30 sm:right-4 sm:top-4 ${modalClose}`}
            aria-label="Close profile"
          >
            ×
          </button>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:grid md:grid-cols-[minmax(220px,280px)_1fr] md:grid-rows-1">
            {/* Photo column — compact on mobile, full height on desktop */}
            <div className="relative shrink-0 md:h-full md:min-h-0">
              <div className="aspect-[5/4] max-h-[36vh] w-full overflow-hidden sm:max-h-[40vh] md:aspect-auto md:h-full md:max-h-none">
                <img
                  src={selectedMember.image}
                  alt=""
                  className="h-full w-full object-cover object-top"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/300x400?text=No+Image')
                  }
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-5 pb-4 pt-10 md:hidden">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7cd244]">
                  Board Member
                </p>
                <h2 className="mt-1 font-bold leading-snug tracking-[-0.015em] text-white text-lg sm:text-xl">
                  {selectedMember.name}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm leading-snug text-white/85">
                  {selectedMember.position}
                </p>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
              <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-7 sm:pb-7 sm:pt-6 md:py-7 md:pl-7 md:pr-8 lg:py-8">
                <div className="hidden pr-10 md:block">
                  <p className={text.label}>Board Member</p>
                  <h2 className={`mt-2 ${text.titleLg}`}>
                    {selectedMember.name}
                  </h2>
                  <p className={`mt-1.5 ${text.body}`}>{selectedMember.position}</p>
                </div>

                {selectedMember.linkedin?.trim() && (
                  <a
                    href={selectedMember.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#0a66c2] transition hover:opacity-90 md:mt-5"
                    aria-label={`${selectedMember.name} on LinkedIn`}
                  >
                    <i className="ri-linkedin-fill text-xl text-white" />
                  </a>
                )}

                <div className={`mt-4 space-y-3 sm:mt-5 sm:space-y-4 sm:pt-5 md:mt-6 ${borderTop} ${text.body}`}>
                  {(selectedMember.biography?.trim() || 'Biography will be updated soon.')
                    .split('\n')
                    .filter(Boolean)
                    .map((p, i) => (
                      <p key={i} className="text-[0.9375rem] leading-[1.75] sm:text-base">
                        {p}
                      </p>
                    ))}
                </div>

                <div className={`mt-5 sm:mt-6 ${directorshipPanel}`}>
                  <button
                    type="button"
                    onClick={() => setShowDirectorship(!showDirectorship)}
                    aria-expanded={showDirectorship}
                    className="flex min-h-[48px] w-full items-center justify-between gap-3 bg-[#7cd244] px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.12em] text-[#0a0a0a] transition hover:bg-[#6db038] sm:px-5 sm:text-sm sm:tracking-wide"
                  >
                    <span>Directorship Details</span>
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/10 text-lg leading-none"
                      aria-hidden
                    >
                      {showDirectorship ? '−' : '+'}
                    </span>
                  </button>
                  {showDirectorship && (
                    <div className={`${directorshipBody} max-h-[40vh] overflow-y-auto sm:max-h-none`}>
                      <ol className={`list-decimal space-y-2.5 pl-5 ${text.body} marker:font-semibold`}>
                        {parseDirectorshipLines(
                          selectedMember.directorshipDetails?.trim() ||
                            'No directorship details available.',
                        ).map((item, index) => (
                          <li key={index} className="pl-1 leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      <AboutSectionShell
        id="board-members"
        title="Board Members"
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
                  <div
                    className={`relative flex min-h-[4.75rem] flex-1 flex-col justify-center px-3 py-3 text-center sm:min-h-[5.25rem] sm:px-4 sm:py-3.5 ${borderTop}`}
                  >
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
      </AboutSectionShell>
      {modalNode}
    </>
  );
}

export default BoardMembersSection;
