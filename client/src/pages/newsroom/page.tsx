import { Suspense } from 'react';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import HeroSection from './components/HeroSection';
import NewsroomTabs from './components/NewsroomTabs';
import ScrollToTop from '../home/components/ScrollToTop';
import { newsroomMainClass, newsroomPageClass, newsroomPageFont } from './newsroomLayout';

export default function NewsroomPage() {
  return (
    <div className={newsroomPageClass} style={newsroomPageFont}>
      <Header />
      <main className={newsroomMainClass}>
        <Suspense fallback={<div className="min-h-screen" />}>
          <HeroSection />
          <NewsroomTabs />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
