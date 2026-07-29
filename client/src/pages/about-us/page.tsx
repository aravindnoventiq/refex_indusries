import { useEffect } from 'react';
import { useSiteTheme } from '../../components/SiteThemeProvider';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import ScrollToTop from '../home/components/ScrollToTop';
import AboutSection from './components/AboutSection';
import MissionVisionSection from './components/MissionVisionSection';
import CoreValuesSection from './components/CoreValuesSection';
import BoardMembersSection from './components/BoardMembersSection';
import CommitteesSection from './components/CommitteesSection';
import LeadershipTeamSection from './components/LeadershipTeamSection';
import OurPresenceSection from './components/OurPresenceSection';
import JourneySection from './components/JourneySection';
import { goToAboutSection } from './goToAboutSection';

/**
 * About Us — dark / light theme with full-page gradient background.
 */
export default function AboutUsPage() {
  const { theme } = useSiteTheme();

  useEffect(() => {
    document.documentElement.classList.add('about-us-page');
    return () => document.documentElement.classList.remove('about-us-page');
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const t = window.setTimeout(() => goToAboutSection(hash), 280);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      className="dark-page-root about-us-page about-us-page-bg min-h-screen transition-colors duration-300"
      data-theme={theme}
      style={{ fontFamily: '"Open Sans", sans-serif' }}
    >
      <Header />
      <main className="pt-[var(--header-offset,5.25rem)]">
        <AboutSection />
        <MissionVisionSection />
        <CoreValuesSection />
        <BoardMembersSection />
        <CommitteesSection />
        <LeadershipTeamSection />
        <OurPresenceSection />
        <JourneySection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
