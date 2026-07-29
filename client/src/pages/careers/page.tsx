import { useEffect } from 'react';
import { siteMainClass, sitePageFont, sitePageLightClass } from '../../utils/siteLayout';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import ScrollToTop from '../home/components/ScrollToTop';
import CareersHeroSection from './components/CareersHeroSection';
import LifeAsRefexianSection from './components/LifeAsRefexianSection';
import WhyChooseRefexSection from './components/WhyChooseRefexSection';
import TalentNetworkSection from './components/TalentNetworkSection';

export default function CareersPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={sitePageLightClass} style={sitePageFont}>
      <Header />
      <main className={siteMainClass}>
        <CareersHeroSection
          id="careers-hero-title"
          as="h1"
          eyebrow="Careers"
          title="Ready to Make Your Mark?"
          subtitle="Build a meaningful career with a purpose-driven organization shaping a cleaner, greener tomorrow across India."
          showCta
        />
        <LifeAsRefexianSection />
        <WhyChooseRefexSection />
        <TalentNetworkSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
