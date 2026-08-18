import { useEffect, useState } from 'react';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import ScrollToTop from '../home/components/ScrollToTop';
import HeroSection from './components/HeroSection';
import ContentSection from './components/ContentSection';
import { legalCmsApi } from '../../services/api';

export default function TermsOfUsePage() {
  const [heroTitle, setHeroTitle] = useState('TERMS OF USE');
  const [html, setHtml] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    legalCmsApi
      .getBySlug('terms-of-use')
      .then((data) => {
        if (data?.heroTitle) setHeroTitle(data.heroTitle);
        if (data?.contentHtml) setHtml(data.contentHtml);
      })
      .catch(() => undefined);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-[var(--header-offset,5.25rem)]">
        <HeroSection title={heroTitle} />
        {html ? (
          <div className="bg-white py-16">
            <div
              className="prose mx-auto max-w-7xl px-5 sm:px-6 lg:px-8"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        ) : (
          <ContentSection />
        )}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
