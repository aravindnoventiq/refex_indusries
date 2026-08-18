import { useEffect, useState } from 'react';
import { siteMainClass, sitePageFont, sitePageLightClass } from '../../utils/siteLayout';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import ScrollToTop from '../home/components/ScrollToTop';
import CareersHeroSection from './components/CareersHeroSection';
import LifeAsRefexianSection from './components/LifeAsRefexianSection';
import WhyChooseRefexSection from './components/WhyChooseRefexSection';
import TalentNetworkSection from './components/TalentNetworkSection';
import { careersCmsApi } from '../../services/api';
import { FALLBACK_CAREERS_PAGE, mergeCareersPage, type CareersPageContent } from './careersFallbacks';

export default function CareersPage() {
  const [content, setContent] = useState<CareersPageContent>(FALLBACK_CAREERS_PAGE);

  useEffect(() => {
    window.scrollTo(0, 0);
    careersCmsApi
      .get()
      .then((data) => setContent(mergeCareersPage(data)))
      .catch(() => setContent(FALLBACK_CAREERS_PAGE));
  }, []);

  return (
    <div className={sitePageLightClass} style={sitePageFont}>
      <Header />
      <main className={siteMainClass}>
        <CareersHeroSection
          id="careers-hero-title"
          as="h1"
          eyebrow={content.heroEyebrow}
          title={content.heroTitle}
          subtitle={content.heroSubtitle}
          backgroundImage={content.heroBackground}
          ctaText={content.heroCtaText}
          showCta
        />
        <LifeAsRefexianSection
          eyebrow={content.lifeEyebrow}
          title={content.lifeTitle}
          subtitle={content.lifeSubtitle}
          image={content.lifeImage}
        />
        <WhyChooseRefexSection
          title={content.whyTitle}
          subtitle={content.whySubtitle}
          backgroundImage={content.whyBackground}
          cards={content.whyCards}
          values={content.whyValues}
        />
        <TalentNetworkSection
          eyebrow={content.talentEyebrow}
          title={content.talentTitle}
          backgroundImage={content.talentBackground}
          formTitle={content.formTitle}
          formSubtitle={content.formSubtitle}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
