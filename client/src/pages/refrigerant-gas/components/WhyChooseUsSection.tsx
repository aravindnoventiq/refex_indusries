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
        const data = await refrigerantGasCmsApi.getWhyChooseUs();
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
            icon: 'https://refex.co.in/wp-content/uploads/2024/12/superior-quality-2.png',
            title: 'Superior Quality',
            description: 'Adherence to the highest standards, surpassing industry expectations.',
            order: 1,
            isActive: true,
          },
          {
            id: 2,
            icon: 'https://refex.co.in/wp-content/uploads/2024/12/eco-friendly-2.png',
            title: 'Eco-Friendly Solutions',
            description: 'Environmentally friendly products aligning with global sustainability goals.',
            order: 2,
            isActive: true,
          },
          {
            id: 3,
            icon: 'https://refex.co.in/wp-content/uploads/2024/12/cutting-edge-tech-2.png',
            title: 'Cutting-Edge Technology',
            description: 'Advanced technology ensures the finest quality products.',
            order: 3,
            isActive: true,
          },
          {
            id: 4,
            icon: 'https://refex.co.in/wp-content/uploads/2024/12/competitive-price-2.png',
            title: 'Competitive Pricing',
            description: 'Market-leading prices without compromising on quality.',
            order: 4,
            isActive: true,
          },
          {
            id: 5,
            icon: 'https://refex.co.in/wp-content/uploads/2024/12/reliable-delivery-2.png',
            title: 'Reliable Delivery',
            description: 'Well-connected logistics ensure timely and reliable delivery.',
            order: 5,
            isActive: true,
          },
          {
            id: 6,
            icon: 'https://refex.co.in/wp-content/uploads/2024/12/experience-2.png',
            title: 'Extensive Experience',
            description: 'With two decades of experience, we have the expertise to meet your needs effectively.',
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
      <section className="py-12" style={{ backgroundColor: '#f3f3f3' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
    <section className="py-12" style={{ backgroundColor: '#f3f3f3' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
          <h2 
            className="font-bold uppercase tracking-wide" 
            style={{ fontSize: '34px', color: '#1f1f1f' }}
            data-aos="fade-right"
          >
            Why choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white p-8 rounded-lg border border-gray-300 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <div className="flex flex-col">
                {feature.icon && (
                  <div className="mb-6">
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
                <h3 className="font-bold mb-4" style={{ fontSize: '24px', color: '#1f1f1f' }}>
                  {feature.title}
                </h3>
                {feature.description && (
                  <p className="leading-relaxed" style={{ fontSize: '17px', color: '#1f1f1f' }}>
                    {feature.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
