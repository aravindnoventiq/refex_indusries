import { useState, useEffect } from 'react';
import { greenMobilityCmsApi } from '../../../services/api';

interface SustainabilitySection {
  id: number;
  title: string;
  description?: string;
  additionalText?: string;
  backgroundImage?: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
}

export default function SustainabilitySection() {
  const [section, setSection] = useState<SustainabilitySection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSection();
  }, []);

  const loadSection = async () => {
    try {
      setLoading(true);
      const data = await greenMobilityCmsApi.getSustainability();
      if (data && (data.isActive === true || data.isActive === undefined || data.isActive === null)) {
        setSection(data);
      } else {
        setSection(null);
      }
    } catch (err) {
      console.error('Failed to load sustainability section:', err);
      // Fallback to default data
      setSection({
        id: 1,
        title: 'Sustainable Mobility Redefined',
        description: 'With Refex Mobility, embrace a new standard in urban commuting. Our cleaner-fuelled vehicles, from comfortable sedans to premium SUVs, are tailored for efficiency and environmental responsibility.',
        additionalText: 'Whether it\'s for daily commute or corporate bookings, we have the right vehicles',
        backgroundImage: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/e57ce7d6f24f55590012a6b3f116efd9.jpeg',
        buttonText: 'Visit Website',
        buttonLink: 'https://refexmobility.com/',
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-200 flex items-center" style={{ height: '336px' }}>
        <div className="max-w-7xl mx-auto px-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!section) {
    return null;
  }

  return (
    <div 
      className="bg-cover bg-center relative flex items-center"
      style={{ 
        height: '336px',
        backgroundImage: section.backgroundImage ? `url(${section.backgroundImage})` : undefined,
        backgroundColor: section.backgroundImage ? undefined : '#1f2937',
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="font-bold mb-6" 
            style={{ fontSize: '34px', color: '#6ae700', lineHeight: '1.68' }}
            data-aos="fade-right"
          >
            {section.title}
          </h2>
          {section.description && (
            <p className="text-white mb-4 leading-relaxed" style={{ fontSize: '18px' }}>
              {section.description}
            </p>
          )}
          {section.additionalText && (
            <p className="text-white mb-8 leading-relaxed" style={{ fontSize: '18px' }}>
              {section.additionalText}
            </p>
          )}
          {section.buttonText && section.buttonLink && (
            <a
              href={section.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-white px-8 py-4 font-semibold transition-colors cursor-pointer whitespace-nowrap"
              style={{ backgroundColor: '#7dc144', borderRadius: '9999px' }}
            >
              {section.buttonText}
              <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1"></i>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
