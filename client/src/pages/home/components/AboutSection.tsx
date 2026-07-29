import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../services/api';
import { HomeLoading, HomeSection, homeVideoText } from './HomeSection';

interface AboutSectionData {
  id: number;
  title: string;
  content: string;
  color?: string;
  order: number;
  isActive: boolean;
}

export default function AboutSection() {
  const [section, setSection] = useState<AboutSectionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSection = async () => {
      try {
        setLoading(true);
        const data = await aboutCmsApi.getSections();
        const activeSection = (data || [])
          .filter((s: AboutSectionData) => s.isActive)
          .sort((a: AboutSectionData, b: AboutSectionData) => (a.order || 0) - (b.order || 0))[0];
        setSection(activeSection || null);
      } catch (error) {
        console.error('Failed to fetch about section:', error);
        setSection({
          id: 0,
          title: 'ABOUT US',
          content:
            "Refex Industries Limited is a dynamic, diversified enterprise with strategic interests in refrigerant gases, coal and ash management, power trading, clean mobility, and renewable energy. We are committed to sustainability, innovation, and long-term value creation across sectors critical to India's growth.",
          color: '#7abc43',
          order: 1,
          isActive: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSection();
  }, []);

  if (loading) return <HomeLoading />;
  if (!section) return null;

  const accent = section.color || '#7cd244';

  return (
    <HomeSection id="about" label="Why Refex" title="Built by operators who want a new industry standard.">
      <div className="max-w-3xl">
        <p className={`mb-10 text-lg sm:text-xl lg:text-2xl ${homeVideoText.body}`}>{section.content}</p>
        <a
          href="/about-us"
          className="inline-flex w-fit items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] transition-all hover:gap-3 sm:px-9 sm:py-4"
          style={{ backgroundColor: accent, color: '#0a0a0a' }}
        >
          Discover More
          <i className="ri-arrow-right-line" />
        </a>
      </div>
    </HomeSection>
  );
}
