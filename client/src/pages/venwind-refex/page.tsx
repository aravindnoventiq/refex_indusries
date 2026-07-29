import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import ScrollToTop from '../home/components/ScrollToTop';
import HeroSection from './components/HeroSection';
import WhoWeAreSection from './components/WhoWeAreSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import TechnicalSpecsSection from './components/TechnicalSpecsSection';
import VisitWebsiteSection from './components/VisitWebsiteSection';

export default function VenwindRefexPage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
      delay: 0,
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: '"Open Sans", sans-serif' }}>
      <Header />
      <main className="pt-[var(--header-offset,5.25rem)]">
        <HeroSection />
        <WhoWeAreSection />
        <WhyChooseUsSection />
        <TechnicalSpecsSection />
        <VisitWebsiteSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
