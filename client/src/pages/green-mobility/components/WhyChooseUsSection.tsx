import { useState, useEffect } from 'react';
import { greenMobilityCmsApi } from '../../../services/api';

interface Feature {
  id: number;
  title: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

function WhyChooseUsSection() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const data = await greenMobilityCmsApi.getWhyChooseUs();
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
            icon: 'https://refex.co.in/wp-content/uploads/2024/12/sanitize.png',
            title: 'Clean, sanitized and well-maintained vehicles',
            order: 1,
            isActive: true,
          },
          {
            id: 2,
            icon: 'https://refex.co.in/wp-content/uploads/2024/12/driver.png',
            title: 'Professionally trained and compliant chauffeurs',
            order: 2,
            isActive: true,
          },
          {
            id: 3,
            icon: 'https://refex.co.in/wp-content/uploads/2024/12/app-icon.png',
            title: 'Robust travel safety features available',
            order: 3,
            isActive: true,
          },
          {
            id: 4,
            icon: 'https://refex.co.in/wp-content/uploads/2024/12/sustainibility.png',
            title: 'Tech-driven trip management tools',
            order: 4,
            isActive: true,
          },
          {
            id: 5,
            icon: 'https://refex.co.in/wp-content/uploads/2025/07/remove.svg',
            title: 'Zero cancellation',
            order: 5,
            isActive: true,
          },
          {
            id: 6,
            icon: 'https://refex.co.in/wp-content/uploads/2025/07/box.svg',
            title: 'Customized packages to suit your needs',
            order: 6,
            isActive: true,
          },
          {
            id: 7,
            icon: 'https://refex.co.in/wp-content/uploads/2025/07/truck.svg',
            title: 'Centralized management for the entire fleet',
            order: 7,
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
      <div className="py-20 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading features...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (features.length === 0) {
    return null;
  }

  return (
    <div className="py-20 bg-[#F5F5F5]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="font-bold mb-4" 
            style={{ fontSize: '34px', color: '#1f1f1f', lineHeight: '1.68' }}
            data-aos="fade-right"
          >
            Why choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white border border-gray-300 rounded-lg p-6 transition-transform duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="flex flex-col items-start">
                {feature.icon && (
                  <div className="w-16 h-16 flex-shrink-0 flex items-center justify-start mb-4">
                    <img
                      src={feature.icon}
                      alt={feature.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=Icon';
                      }}
                    />
                  </div>
                )}
                <div className="w-full">
                  <h3 className="font-bold" style={{ fontSize: '24px', color: '#1f1f1f' }}>
                    {feature.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WhyChooseUsSection;
