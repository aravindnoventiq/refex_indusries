import { useState, useEffect, useCallback } from 'react';
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

interface Impact {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export default function OurImpactSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(500);
  const [itemWidth, setItemWidth] = useState(280);

  useEffect(() => {
    const fetchImpacts = async () => {
      try {
        setLoading(true);
        const data = await refrigerantGasCmsApi.getImpacts();
        const activeImpacts = (data || [])
          .filter((item: Impact) => item.isActive)
          .sort((a: Impact, b: Impact) => (a.order || 0) - (b.order || 0));
        setImpacts(activeImpacts);
      } catch (error) {
        console.error('Failed to fetch impacts:', error);
        // Fallback to default data if API fails
        setImpacts([
          {
            id: 1,
            icon: 'https://refex.co.in/wp-content/uploads/2024/12/dealers.svg',
            title: '450 +',
            description: 'Dealers and Distributions',
            order: 1,
            isActive: true,
          },
          {
            id: 2,
            icon: 'https://refex.co.in/wp-content/uploads/2024/12/warehouse.svg',
            title: 'Delhi & Mumbai',
            description: 'Warehouses',
            order: 2,
            isActive: true,
          },
          {
            id: 3,
            icon: 'https://refex.co.in/wp-content/uploads/2024/11/refrigerant.svg',
            title: 'Tamil Nadu',
            description: 'Refilling Facility',
            order: 3,
            isActive: true,
          },
          {
            id: 4,
            icon: 'https://refex.co.in/wp-content/uploads/2024/12/company.svg',
            title: '1st Company',
            description: 'To introduce disposable Cans\nProvide 450 ml Refilling Cans',
            order: 4,
            isActive: true,
          },
          {
            id: 5,
            icon: 'https://refex.co.in/wp-content/uploads/2024/12/can.svg',
            title: 'Range of Products',
            description: 'R32, R134A, R404A, R407C, R410A, R22, R290, R600a, HC Blend and Butane',
            order: 5,
            isActive: true,
          },
          {
            id: 6,
            icon: 'https://refex.co.in/wp-content/uploads/2024/12/iso.svg',
            title: '1st ISO Certified',
            description: 'Refrigerant Gas filling unit in India',
            order: 6,
            isActive: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchImpacts();
  }, []);

  // Calculate item width based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemWidth(250);
      } else if (window.innerWidth < 768) {
        setItemWidth(260);
      } else if (window.innerWidth < 1024) {
        setItemWidth(270);
      } else {
        setItemWidth(280);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigate to next slide
  const goToNext = useCallback(() => {
    if (isTransitioning || impacts.length === 0) return;
    setIsTransitioning(true);
    const isLastItem = currentIndex === impacts.length - 1;
    // Extra time when looping from last to first
    const duration = isLastItem ? 1000 : 500;
    setTransitionDuration(duration);
    setCurrentIndex((prev) => (prev + 1) % impacts.length);
    setTimeout(() => setIsTransitioning(false), duration);
  }, [isTransitioning, impacts.length, currentIndex]);

  // Auto-play functionality - continuous
  useEffect(() => {
    if (impacts.length === 0) return;

    const interval = setInterval(() => {
      goToNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [impacts.length, goToNext]);

  // Create extended array for infinite loop effect (3x the items)
  const getExtendedImpacts = () => {
    if (impacts.length === 0) return [];
    return [...impacts, ...impacts, ...impacts];
  };

  // Calculate the offset to place active item at the start (left)
  const getTransformOffset = () => {
    if (impacts.length === 0) return 0;
    const gap = 32; // gap between items (gap-8 = 2rem = 32px)
    const totalItemWidth = itemWidth + gap;
    
    // Add offset for the middle set of items (since we have 3 sets)
    const middleSetOffset = impacts.length * totalItemWidth;
    
    // Calculate the position to place current item at the start
    const translateX = -(currentIndex * totalItemWidth) - middleSetOffset;
    
    return translateX;
  };

  if (loading) {
    return (
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading impacts...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (impacts.length === 0) {
    return null;
  }

  const extendedImpacts = getExtendedImpacts();

  return (
    <section className="bg-gray-100 py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bold uppercase tracking-wide" style={{ fontSize: '34px', color: '#1f1f1f' }}>
            Our Impact
          </h2>
        </div>

        <div className="relative">
          {/* Slider Container */}
          <div className="overflow-hidden">
            <div 
              className="flex gap-8 ease-out"
              style={{ 
                transform: `translateX(${getTransformOffset()}px)`,
                transition: `transform ${transitionDuration}ms ease-out`,
              }}
            >
              {extendedImpacts.map((impact, index) => (
                <div
                  key={`${impact.id}-${index}`}
                  className="flex-shrink-0 p-8 text-center"
                  style={{ 
                    width: `${itemWidth}px`,
                  }}
                >
                  {impact.icon && (
                    <div className="flex justify-center mb-6">
                      <img
                        src={getFullUrl(impact.icon)}
                        alt={impact.title}
                        className="w-16 h-16 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=Icon';
                        }}
                      />
                    </div>
                  )}
                  <h3 className="font-bold mb-3 text-center whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: '26px', color: '#000000' }}>
                    {impact.title}
                  </h3>
                  {impact.description && (
                    <p className="leading-relaxed whitespace-pre-line text-center" style={{ fontSize: '17px', color: '#222222' }}>
                      {impact.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
