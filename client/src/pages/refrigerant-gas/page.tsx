import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import HeroSection from './components/HeroSection';
import WhoWeAreSection from './components/WhoWeAreSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import ProductTabsSection from './components/ProductTabsSection';
import OurImpactSection from './components/OurImpactSection';
import OurProductsSection from './components/OurProductsSection';
import ClientsSection from './components/ClientsSection';

export default function RefrigerantGasPage() {
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
        <ProductTabsSection />
        <OurImpactSection />
        <OurProductsSection />
        <ClientsSection />
      </main>
      <Footer />
    </div>
  );
}
