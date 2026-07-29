import Header from './components/Header';
import HomeScrollVideo from './components/HomeScrollVideo';
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

export default function HomePage() {
  return (
    <HomeSmoothScroll>
      <div className="site-page-dark text-[#f5f5f5]" style={{ fontFamily: '"Open Sans", sans-serif' }}>
        <Header />
        <HomeScrollVideo>
          <main className="home-post-hero-content overflow-x-hidden divide-y divide-white/[0.06] sm:overflow-x-clip sm:divide-white/[0.1]">
            <TerminalHeroChapters />
            <BusinessSection />
            <AtGlanceSection />
            <FlipCardsSection />
            <NewsroomSection />
            <AwardsSection />
          </main>
          <Footer />
        </HomeScrollVideo>
        <ScrollToTop />
        <WelcomeModal />
      </div>
    </HomeSmoothScroll>
  );
}
