import { useState, useEffect } from 'react';
import { greenMobilityCmsApi } from '../../../services/api';

interface Impact {
  id: number;
  number: string;
  label: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export default function OurImpactSection() {
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImpacts();
  }, []);

  const loadImpacts = async () => {
    try {
      setLoading(true);
      const data = await greenMobilityCmsApi.getImpacts();
      const activeImpacts = (data || []).filter((impact: Impact) => impact.isActive);
      setImpacts(activeImpacts);
    } catch (err) {
      console.error('Failed to load impacts:', err);
      // Fallback to default data
      setImpacts([
        {
          id: 1,
          icon: 'https://refex.co.in/wp-content/uploads/2024/12/leased.svg',
          number: '436.16 lakh / 4.36+ crore',
          label: 'e-Kms covered',
          order: 0,
          isActive: true,
        },
        {
          id: 2,
          icon: 'https://refex.co.in/wp-content/uploads/2024/12/dealers.svg',
          number: '19+ lakh',
          label: 'Happy Riders',
          order: 1,
          isActive: true,
        },
        {
          id: 3,
          icon: 'https://refex.co.in/wp-content/uploads/2024/11/fleet.svg',
          number: '7.6+ lakh',
          label: 'Rides Completed',
          order: 2,
          isActive: true,
        },
        {
          id: 4,
          icon: 'https://refex.co.in/wp-content/uploads/2024/11/Co2.svg',
          number: '28.35+ lakh kg',
          label: 'Tailpipe CO₂ abated',
          order: 3,
          isActive: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-10 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </section>
    );
  }

  const sortedImpacts = [...impacts].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section className="py-10 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bold mb-4 uppercase" style={{ fontSize: '34px', color: '#1f1f1f', lineHeight: '1.68' }}>Our Impact</h2>
        </div>

        {sortedImpacts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No impact statistics available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {sortedImpacts.map((impact) => (
              <div key={impact.id} className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 flex items-center justify-center">
                    {impact.icon ? (
                      <img
                        src={impact.icon}
                        alt={impact.label}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                        No Icon
                      </div>
                    )}
                  </div>
                </div>
                <div className="font-bold mb-2" style={{ fontSize: '26px', color: '#000000' }}>{impact.number}</div>
                <div style={{ fontSize: '17px', color: '#222222' }}>{impact.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
