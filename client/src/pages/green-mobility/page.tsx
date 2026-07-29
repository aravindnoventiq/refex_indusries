import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import HeroSection from './components/HeroSection';
import WhoWeAreSection from './components/WhoWeAreSection';
import BrandValuesSection from './components/BrandValuesSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import ServicesSection from './components/ServicesSection';
import OurImpactSection from './components/OurImpactSection';
import OurServicesSection from './components/OurServicesSection';
import ClientsSection from './components/ClientsSection';
import SustainabilitySection from './components/SustainabilitySection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from '../home/components/Footer';
import Header from '../home/components/Header';
import ScrollToTop from '../home/components/ScrollToTop';

export default function GreenMobilityPage() {
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
    <div className="min-h-screen overflow-x-clip bg-white" style={{ fontFamily: '"Open Sans", sans-serif' }}>
      <Header />
      <main>
        <HeroSection />
      <WhoWeAreSection />
      <BrandValuesSection />
      <WhyChooseUsSection />
      <ServicesSection />
      <OurImpactSection />
      <OurServicesSection />
      <ClientsSection />
      <SustainabilitySection />
      <TestimonialsSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
