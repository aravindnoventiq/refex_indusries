import { useEffect } from 'react';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import ScrollToTop from '../home/components/ScrollToTop';
import HeroSection from './components/HeroSection';
import StockQuote from './components/StockQuote';
import StockChart from './components/StockChart';
import RelatedLinks from './components/RelatedLinks';
import HistoricalStockQuote from './components/HistoricalStockQuote';
import WelcomeModal from '../home/components/WelcomeModal';
import { investorMainClass, investorPageClass, investorPageFont } from './investorLayout';

export default function InvestorsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={investorPageClass} style={investorPageFont}>
      <Header />
      <main className={investorMainClass}>
        <HeroSection withHeaderOffset={false} />
        <StockQuote />
        <StockChart />
        <HistoricalStockQuote />
        <RelatedLinks />
      </main>
      <Footer />
      <WelcomeModal />
      <ScrollToTop />
    </div>
  );
}
