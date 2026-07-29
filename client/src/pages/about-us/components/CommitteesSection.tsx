import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../services/api';
import { COMMITTEE_NAME_COLOR, FALLBACK_COMMITTEES } from '../aboutFallbacks';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { ABOUT_REVEAL_STAGGER_MS } from '../useAboutReveal';
import AboutReveal from './AboutReveal';
import { AboutSectionShell, AboutSpinner } from './AboutSectionShell';

interface CommitteeMember {
  id: number;
  name: string;
  designation: string;
  category: string;
  order: number;
  isActive: boolean;
}

interface Committee {
  id: number;
  name: string;
  order: number;
  isActive: boolean;
  members: CommitteeMember[];
}

function isChair(category: string) {
  return /chair/i.test(category);
}

function CommitteesSection() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        setLoading(true);
        const data = await aboutCmsApi.getCommittees();
        const activeCommittees = (data || [])
          .filter((c: Committee) => c.isActive !== false)
          .sort((a: Committee, b: Committee) => (a.order || 0) - (b.order || 0));
        setCommittees(activeCommittees.length > 0 ? activeCommittees : FALLBACK_COMMITTEES);
      } catch {
        setCommittees(FALLBACK_COMMITTEES);
      } finally {
        setLoading(false);
      }
    };

    fetchCommittees();
  }, []);

  const { classes } = useDarkPageTheme();
  const { text, imageCard, borderBottom, listDivide, categoryMuted } = classes;

  if (loading) {
    return (
      <div id="committees">
        <AboutSpinner />
      </div>
    );
  }

  const displayCommittees = committees.length > 0 ? committees : FALLBACK_COMMITTEES;

  return (
    <AboutSectionShell
      id="committees"
      // eyebrow="Oversight"
      title="Composition of Committees"
      // subtitle="Board committees that guide audit, remuneration, stakeholder relations, and responsible governance."
    >
      <div>
        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:gap-6">
          {displayCommittees.map((committee, index) => {
            const activeMembers = (committee.members || [])
              .filter((m) => m.isActive !== false)
              .sort((a, b) => (a.order || 0) - (b.order || 0));

            return (
              <AboutReveal key={committee.id || index} delay={index * ABOUT_REVEAL_STAGGER_MS}>
              <article
                className={`group relative flex h-full flex-col border-l-2 border-[#7cd244]/60 ${imageCard}`}
              >
                <header className={`px-5 py-4 pl-6 sm:px-6 sm:pl-7 ${borderBottom}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3
                        className="font-bold tracking-[-0.015em] leading-snug text-lg sm:text-xl lg:text-[1.35rem]"
                        style={{ color: COMMITTEE_NAME_COLOR }}
                      >
                        {committee.name}
                      </h3>
                    </div>
                    <span className={`shrink-0 ${text.meta}`}>
                      {activeMembers.length}{' '}
                      {activeMembers.length === 1 ? 'member' : 'members'}
                    </span>
                  </div>
                </header>

                <ul className={`flex flex-1 flex-col px-5 py-1 pl-6 sm:px-6 sm:pl-7 ${listDivide}`}>
                  {activeMembers.map((member, idx) => {
                    const chair = isChair(member.category);
                    return (
                      <li
                        key={member.id || idx}
                        className="py-3.5"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <p className={`text-sm sm:text-[15px] ${text.cardTitle}`}>
                              {member.name}
                            </p>
                            <span
                              className={
                                'text-[10px] font-semibold uppercase tracking-[0.16em] ' +
                                (chair ? 'text-[#7cd244]' : categoryMuted)
                              }
                            >
                              {member.category}
                            </span>
                          </div>
                          <p className={`mt-0.5 text-xs sm:text-sm ${text.bodySm}`}>
                            {member.designation}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </article>
              </AboutReveal>
            );
          })}
        </div>
      </div>
    </AboutSectionShell>
  );
}

export default CommitteesSection;
