import Header from './components/Header';
import HomeSmoothScroll from './components/HomeSmoothScroll';
import TerminalHeroChapters from './components/TerminalHeroChapters';
import BusinessSection from './components/BusinessSection';
import AtGlanceSection from './components/AtGlanceSection';
import FlipCardsSection from './components/FlipCardsSection';
import NewsroomSection from './components/NewsroomSection';
import AwardsSection from './components/AwardsSection';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import WelcomeModal from './components/WelcomeModal';
import { useSiteTheme } from '../../components/SiteThemeProvider';

export default function HomePage() {
  const { theme } = useSiteTheme();

  return (
    <HomeSmoothScroll>
      <div
        className={`home-page-root min-h-screen transition-colors duration-300 ${
          theme === 'light' ? 'home-page-root--light' : 'home-page-root--dark'
        }`}
        data-theme={theme}
        style={{ fontFamily: '"Open Sans", sans-serif' }}
      >
        <Header />
        <main className="overflow-x-hidden sm:overflow-x-clip">
          <TerminalHeroChapters />
          <div
            className={`home-post-hero-content relative z-10 divide-y ${
              theme === 'light'
                ? 'divide-[#dfe9d8]'
                : 'divide-white/[0.06] sm:divide-white/[0.1]'
            }`}
          >
            <BusinessSection />
            <AtGlanceSection />
            <FlipCardsSection />
            <NewsroomSection />
            <AwardsSection />
          </div>
        </main>
        <Footer />
        <ScrollToTop />
        <WelcomeModal />
      </div>
    </HomeSmoothScroll>
  );
}
