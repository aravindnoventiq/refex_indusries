import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../services/api';
import { FALLBACK_COMMITTEES } from '../aboutFallbacks';
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

  const { theme, classes } = useDarkPageTheme();
  const { text } = classes;
  const shell =
    theme === 'light'
      ? 'overflow-hidden rounded-xl border border-[#dfe9d8] bg-white'
      : 'overflow-hidden rounded-xl border border-white/15 bg-white/[0.04]';
  const rowBorder = theme === 'light' ? 'border-[#eef3ea]' : 'border-white/10';
  const nameBar = theme === 'light' ? 'bg-[#f3f7ef] text-[#2d5016]' : 'bg-white/[0.06] text-[#7cd244]';

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
      <div className={shell}>
        {displayCommittees.map((committee, index) => {
          const activeMembers = (committee.members || [])
            .filter((m) => m.isActive !== false)
            .filter((m) => !/sachin\s+navtosh\s+jha/i.test(m.name))
            .filter((m) => !/chief of staff/i.test(m.designation || ''))
            .sort((a, b) => (a.order || 0) - (b.order || 0));

          return (
            <AboutReveal key={committee.id || index} delay={index * ABOUT_REVEAL_STAGGER_MS}>
              <section className={index > 0 ? `border-t ${rowBorder}` : ''}>
                <h3 className={`px-4 py-2 text-sm font-semibold tracking-[-0.01em] sm:px-5 ${nameBar}`}>
                  {committee.name}
                </h3>
                <ul>
                  {activeMembers.map((member, idx) => (
                    <li
                      key={member.id || idx}
                      className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-t px-4 py-2 text-sm sm:flex-nowrap sm:px-5 ${rowBorder}`}
                    >
                      <span className={`font-medium ${text.cardTitle}`}>{member.name}</span>
                      <span className={`text-xs sm:text-[13px] ${text.bodySm}`}>{member.designation}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </AboutReveal>
          );
        })}
      </div>
    </AboutSectionShell>
  );
}

export default CommitteesSection;
