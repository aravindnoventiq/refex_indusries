import { useState, useEffect } from 'react';
import { venwindRefexCmsApi } from '../../../services/api';

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

interface Feature {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export default function WhyChooseUsSection() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const data = await venwindRefexCmsApi.getWhyChooseUs();
        const activeFeatures = (data || [])
          .filter((item: Feature) => item.isActive)
          .sort((a: Feature, b: Feature) => (a.order || 0) - (b.order || 0));
        setFeatures(activeFeatures);
      } catch (error) {
        console.error('Failed to fetch features:', error);
        // Fallback to default data if API fails
        setFeatures([
          {
            id: 1,
            icon: 'https://refex.co.in/wp-content/uploads/2025/06/icon012.svg',
            title: 'Hybrid Drive-Train for Superior Efficiency',
            description: 'Gearbox + medium-speed PMG delivers high performance, reliability, and energy efficiency',
            order: 1,
            isActive: true,
          },
          {
            id: 2,
            icon: 'https://refex.co.in/wp-content/uploads/2025/06/icon03.svg',
            title: 'Globally Proven Technology',
            description: 'Deployed in Australia, South Africa, Brazil, and the Middle East, proving reliability across diverse conditions',
            order: 2,
            isActive: true,
          },
          {
            id: 3,
            icon: 'https://refex.co.in/wp-content/uploads/2025/06/icon014.svg',
            title: 'Rapid Deployment',
            description: 'Designed for fast manufacturing and installation to meet tight project schedules',
            order: 3,
            isActive: true,
          },
          {
            id: 4,
            icon: 'https://refex.co.in/wp-content/uploads/2025/06/icon015.svg',
            title: 'Lower Operational Costs',
            description: 'Hybrid system reduces maintenance and enhances reliability, cutting long-term Opex',
            order: 4,
            isActive: true,
          },
          {
            id: 5,
            icon: 'https://refex.co.in/wp-content/uploads/2025/06/icon016.svg',
            title: 'Reduced BOP Costs',
            description: 'Larger WTG sizes cut infrastructure needs, delivering 20–25% savings',
            order: 5,
            isActive: true,
          },
          {
            id: 6,
            icon: 'https://refex.co.in/wp-content/uploads/2025/06/save-money.svg',
            title: 'Lower LCOE',
            description: 'Improved technology and BOP savings drive down energy costs',
            order: 6,
            isActive: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  if (loading) {
    return (
      <section className="py-20" style={{ backgroundColor: '#f3f3f3' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading features...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (features.length === 0) {
    return null;
  }

  return (
    <section className="py-20" style={{ backgroundColor: '#f3f3f3' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 
            className="font-bold uppercase tracking-wide" 
            style={{ fontSize: '34px', color: '#1f1f1f', lineHeight: '1.68' }}
            data-aos="fade-right"
          >
            Why choose Us
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white p-8 rounded-lg border border-gray-300 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="flex flex-col">
                {feature.icon && (
                  <div className="mb-4">
                    <img
                      src={getFullUrl(feature.icon)}
                      alt={feature.title}
                      className="w-20 h-20 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=Icon';
                      }}
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-bold mb-4" style={{ fontSize: '24px', color: '#1f1f1f' }}>
                    {feature.title}
                  </h3>
                  {feature.description && (
                    <p className="leading-relaxed" style={{ fontSize: '17px', color: '#484848' }}>
                      {feature.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
