import { useEffect } from 'react';
import { useSiteTheme } from '../../components/SiteThemeProvider';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import ScrollToTop from '../home/components/ScrollToTop';
import HeroSection from './components/HeroSection';
import EndToEndSolutionsSection from './components/EndToEndSolutionsSection';
import AshUtilizationGapSection from './components/AshUtilizationGapSection';
import BuiltForScaleSection from './components/BuiltForScaleSection';
import RefexExecutionPlatformSection from './components/RefexExecutionPlatformSection';
import ClosingTheLoopSection from './components/ClosingTheLoopSection';
import ClientsSection from './components/ClientsSection';
import { ScrollTrigger } from '../about-us/aboutGsap';

export default function AshUtilizationPage() {
  const { theme } = useSiteTheme();

  useEffect(() => {
    document.documentElement.classList.add('ash-utilization-page');
    return () => document.documentElement.classList.remove('ash-utilization-page');
  }, []);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 400);
    window.addEventListener('load', refresh);
    document.fonts?.ready?.then?.(refresh);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('load', refresh);
    };
  }, []);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 120);
    return () => window.clearTimeout(t);
  }, [theme]);

  return (
    <div
      className="dark-page-root ash-utilization-page ash-utilization-page-bg min-h-screen transition-colors duration-300"
      data-theme={theme}
      style={{ fontFamily: '"Open Sans", sans-serif' }}
    >
      <Header />
      <main className="pt-[var(--header-offset,5.25rem)]">
        <HeroSection />
        <EndToEndSolutionsSection />
        <AshUtilizationGapSection />
        <BuiltForScaleSection />
        <RefexExecutionPlatformSection />
        <ClosingTheLoopSection />
        <ClientsSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
