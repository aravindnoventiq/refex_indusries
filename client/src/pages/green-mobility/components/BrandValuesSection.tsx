import { useState, useEffect } from 'react';
import { greenMobilityCmsApi } from '../../../services/api';

interface BrandValue {
  id: number;
  title: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

function BrandValuesSection() {
  const [values, setValues] = useState<BrandValue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchValues = async () => {
      try {
        setLoading(true);
        const data = await greenMobilityCmsApi.getBrandValues();
        const activeValues = (data || [])
          .filter((item: BrandValue) => item.isActive)
          .sort((a: BrandValue, b: BrandValue) => (a.order || 0) - (b.order || 0));
        setValues(activeValues);
      } catch (error) {
        console.error('Failed to fetch brand values:', error);
        // Fallback to default data if API fails
        setValues([
          {
            id: 1,
            icon: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/c2c6d33309ccb0487f7cfdacdd0d0b58.png',
            title: 'RELIABILITY',
            order: 1,
            isActive: true,
          },
          {
            id: 2,
            icon: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/354f6a3ba64db048e981dad094115f27.png',
            title: 'SUSTAINABILITY',
            order: 2,
            isActive: true,
          },
          {
            id: 3,
            icon: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/acf5c792e0eef91b506ef26c3c3b27df.png',
            title: 'SAFETY',
            order: 3,
            isActive: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchValues();
  }, []);

  if (loading) {
    return (
      <div className="py-10 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-10 sm:py-16 lg:py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading brand values...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (values.length === 0) {
    return null;
  }

  return (
    <div className="py-10 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="font-bold mb-4" 
            style={{ fontSize: '34px', color: '#1f1f1f', lineHeight: '1.68' }}
            data-aos="fade-right"
          >
            Our Brand Values
          </h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {values.map((value, index) => (
            <div key={value.id} className={`flex flex-col items-center ${index < values.length - 1 ? 'pr-8 md:pr-16 border-r border-gray-300' : ''}`}>
              {value.icon && (
                <div className="flex items-center justify-center mb-4  rounded-lg p-4" style={{ width: '160px', height: '160px' }}>
                  <img
                    src={value.icon}
                    alt={value.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/160x160?text=Icon';
                    }}
                  />
                </div>
              )}
              <h3 className="text-center" style={{ fontSize: '20px', color: '#1f1f1f' }}>
                {value.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrandValuesSection;
