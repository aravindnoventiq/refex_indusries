import { useEffect } from 'react';
import { siteMainClass, sitePageFont, sitePageLightClass } from '../../utils/siteLayout';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import HeroSection from './components/HeroSection';
import OfficeAddresses from './components/OfficeAddresses';
import ContactForm from './components/ContactForm';
import ScrollToTop from '../home/components/ScrollToTop';

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={sitePageLightClass} style={sitePageFont}>
      <Header />
      <main className={siteMainClass}>
        <HeroSection />
        <OfficeAddresses />
        <ContactForm />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
