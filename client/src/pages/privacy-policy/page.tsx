
import React, { useEffect } from 'react';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import ScrollToTop from '../home/components/ScrollToTop';
import HeroSection from './components/HeroSection';
import ContentSection from './components/ContentSection';

const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[var(--header-offset,5.25rem)]">
        <HeroSection />
        <ContentSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default PrivacyPolicyPage;
