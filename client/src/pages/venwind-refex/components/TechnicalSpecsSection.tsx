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

interface Spec {
  id: number;
  value: string;
  label: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export default function TechnicalSpecsSection() {
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        setLoading(true);
        const data = await venwindRefexCmsApi.getTechnicalSpecs();
        const activeSpecs = (data || [])
          .filter((item: Spec) => item.isActive)
          .sort((a: Spec, b: Spec) => (a.order || 0) - (b.order || 0));
        setSpecs(activeSpecs);
      } catch (error) {
        console.error('Failed to fetch technical specs:', error);
        // Fallback to default data if API fails
        setSpecs([
          {
            id: 1,
            icon: 'https://refex.co.in/wp-content/uploads/2025/06/swept-area-new.svg',
            value: '26016 m2',
            label: 'Swept Area',
            order: 1,
            isActive: true,
          },
          {
            id: 2,
            icon: 'https://refex.co.in/wp-content/uploads/2025/06/hub-height-new.svg',
            value: '130m',
            label: 'Hub Height',
            order: 2,
            isActive: true,
          },
          {
            id: 3,
            icon: 'https://refex.co.in/wp-content/uploads/2025/06/cut-in-wind-new.svg',
            value: '2.5 m/s',
            label: 'Cut-in Wind Speed',
            order: 3,
            isActive: true,
          },
          {
            id: 4,
            icon: 'https://refex.co.in/wp-content/uploads/2025/06/IECs-Class-new.svg',
            value: 'IEC S',
            label: 'Class',
            order: 4,
            isActive: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecs();
  }, []);

  if (loading) {
    return (
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading technical specs...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (specs.length === 0) {
    return null;
  }

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 
            className="font-bold uppercase tracking-wide" 
            style={{ fontSize: '34px', color: '#1f1f1f', lineHeight: '1.68' }}
            data-aos="fade-right"
          >
            Technical Specifications
          </h2>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {specs.map((spec) => (
            <div
              key={spec.id}
              className="flex flex-col items-center text-center p-8 rounded-lg"
            >
              {spec.icon && (
                <div className="mb-6">
                  <img
                    src={getFullUrl(spec.icon)}
                    alt={spec.label}
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=Icon';
                    }}
                  />
                </div>
              )}
              <h3 className="font-bold mb-2" style={{ fontSize: '26px', color: '#000000' }}>
                {spec.value}
              </h3>
              <p className="font-medium" style={{ fontSize: '17px', color: '#222222' }}>
                {spec.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
