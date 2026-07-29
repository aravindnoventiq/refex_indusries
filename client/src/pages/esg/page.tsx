import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from '../about-us/aboutGsap';
import { scrollToPageSection } from '../about-us/goToAboutSection';
import { resolveEsgSectionHash } from '../../utils/footerLinks';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import ScrollToTop from '../home/components/ScrollToTop';
import EsgTopSection from './components/EsgTopSection';
import SustainabilityPillarsSection from './components/SustainabilityPillarsSection';
import SustainabilityVision2035Section from './components/SustainabilityVision2035Section';
import SustainableWellBeingSection from './components/SustainableWellBeingSection';
import EsgNatureShowcaseSection from './components/EsgNatureShowcaseSection';
import SustainableDevelopmentGoalsIntroSection from './components/SustainableDevelopmentGoalsIntroSection';
import ESGPoliciesSection from './components/ESGPoliciesSection';
import ReportsSection from './components/ReportsSection';
import UNSDGActionsSection from './components/UNSDGActionsSection';
import AwardsSection from './components/AwardsSection';
import CollaborationSection from './components/CollaborationSection';
import GovernanceSection from './components/GovernanceSection';
import HRSection from './components/HRSection';
import { esgBgWhite, esgSectionDivider } from './esgLayout';

export default function ESGPage() {
  const location = useLocation();

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const timers = [150, 600, 1500, 3000].map((delay) => window.setTimeout(refresh, delay));
    window.addEventListener('load', refresh);
    window.addEventListener('orientationchange', refresh);
    window.addEventListener('resize', refresh);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener('load', refresh);
      window.removeEventListener('orientationchange', refresh);
      window.removeEventListener('resize', refresh);
    };
  }, []);

  useEffect(() => {
    const hash = resolveEsgSectionHash(location.hash.replace('#', ''));
    if (hash) {
      const scrollTimer = window.setTimeout(() => scrollToPageSection(hash), 450);
      return () => window.clearTimeout(scrollTimer);
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <div className={`site-page-light min-h-screen overflow-x-clip ${esgBgWhite} font-['Open_Sans',sans-serif] text-[#1f1f1f]`}>
      <Header />
      <main>
        {/* Act 1 — Intro & strategy */}
        <EsgTopSection />
        <SustainabilityPillarsSection />
        <SustainabilityVision2035Section />

        <div className={esgSectionDivider} aria-hidden />

        {/* Act 2 — Impact */}
        <SustainableWellBeingSection />
        {/* <EsgNatureShowcaseSection /> */}

        <div className={esgSectionDivider} aria-hidden />

        {/* Act 3 — SDGs */}
        <SustainableDevelopmentGoalsIntroSection />
        <UNSDGActionsSection />

        <div className={esgSectionDivider} aria-hidden />

        {/* Act 4 — Recognition & partners */}
        <AwardsSection />
        <CollaborationSection />

        <div className={esgSectionDivider} aria-hidden />

        {/* Act 5 — Documents & governance */}
        <ESGPoliciesSection />
        <ReportsSection />
        <GovernanceSection />
        <HRSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
