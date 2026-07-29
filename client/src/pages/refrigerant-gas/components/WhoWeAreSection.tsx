import { useState, useEffect } from 'react';
import { refrigerantGasCmsApi } from '../../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const getFullUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`;
  }
  return `${API_BASE_URL}/${url}`;
};

interface RefrigerantGasWhoWeAre {
  id: number;
  title: string;
  content?: string;
  mainImage?: string;
  isActive: boolean;
}

export default function WhoWeAreSection() {
  const [section, setSection] = useState<RefrigerantGasWhoWeAre | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSection();
  }, []);

  const loadSection = async () => {
    try {
      setLoading(true);
      const data = await refrigerantGasCmsApi.getWhoWeAre();
      if (data && (data.isActive === true || data.isActive === undefined || data.isActive === null)) {
        setSection(data);
      } else {
        setSection(null);
      }
    } catch (err) {
      console.error('Failed to load who we are section:', err);
      // Fallback to default data
      setSection({
        id: 1,
        title: 'Who we are',
        content: `Refex Industries Limited, established in 2002, is a pioneer in eco-friendly refrigerant gases across India. We specialize in replacing harmful CFCs and HCFCs with environmentally friendly alternatives. Our product range includes refrigerants, foam-blowing agents, and aerosol propellants, backed by advanced technology that sets industry standards.

With over 22 years of experience, Refex has built a sterling reputation for delivering eco-friendly refrigerant solutions that exceed industry standards. Their emphasis on innovation and sustainability has positioned them as a premier supplier in the HVAC and refrigeration sectors.

Refex is known for superior quality, reliability, and commitment to sustainability. Our innovative approach and reliable logistics network ensure rapid delivery and customer satisfaction. We continue to set industry benchmarks, driven by sustainability and technological advancement.`,
        mainImage: 'https://refex.co.in/wp-content/uploads/2025/08/ref-about-us-1.jpg',
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!section) {
    return null;
  }

  // Split content into paragraphs by double line breaks or single line breaks
  const paragraphs = section.content
    ? section.content.split(/\n\s*\n/).filter(p => p.trim())
    : [];

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="relative">
              {section.mainImage ? (
                <img
                  src={getFullUrl(section.mainImage)}
                  alt="Refex Industries"
                  className="w-full max-w-full rounded-lg object-cover shadow-lg aspect-[830/350] sm:aspect-auto sm:max-h-[350px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex aspect-[830/350] w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500 shadow-lg">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <h2
              className="mb-6 text-2xl font-bold uppercase tracking-wide text-[#1f1f1f] sm:mb-8 sm:text-3xl lg:text-[2.125rem]"
              data-aos="fade-right"
            >
              {section.title}
            </h2>
            {paragraphs.length > 0 ? (
              <div className="space-y-6 leading-relaxed" style={{ fontSize: '16px', color: '#484848' }}>
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))}
              </div>
            ) : (
              <div className="italic" style={{ fontSize: '16px', color: '#484848' }}>No content available.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
