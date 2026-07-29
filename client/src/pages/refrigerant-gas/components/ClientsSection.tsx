import { useEffect, useRef, useState } from 'react';
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

interface Client {
  id: number;
  image: string;
  order: number;
  isActive: boolean;
}

export default function ClientsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await refrigerantGasCmsApi.getClients();
        const activeClients = (data || [])
          .filter((client: Client) => client.isActive)
          .sort((a: Client, b: Client) => (a.order || 0) - (b.order || 0));
        setClients(activeClients);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        // Fallback to default data if API fails
        setClients([
          {
            id: 1,
            image: 'https://refex.co.in/wp-content/uploads/2024/12/client-logo01.jpg',
            order: 1,
            isActive: true,
          },
          {
            id: 2,
            image: 'https://refex.co.in/wp-content/uploads/2024/12/client-logo02.jpg',
            order: 2,
            isActive: true,
          },
          {
            id: 3,
            image: 'https://refex.co.in/wp-content/uploads/2024/12/client-logo03.jpg',
            order: 3,
            isActive: true,
          },
          {
            id: 4,
            image: 'https://refex.co.in/wp-content/uploads/2024/12/client-logo04.jpg',
            order: 4,
            isActive: true,
          },
          {
            id: 5,
            image: 'https://refex.co.in/wp-content/uploads/2024/12/client-logo06.jpg',
            order: 5,
            isActive: true,
          },
          {
            id: 6,
            image: 'https://refex.co.in/wp-content/uploads/2024/12/client-logo07.jpg',
            order: 6,
            isActive: true,
          },
          {
            id: 7,
            image: 'https://refex.co.in/wp-content/uploads/2024/12/client-logo08.jpg',
            order: 7,
            isActive: true,
          },
          {
            id: 8,
            image: 'https://refex.co.in/wp-content/uploads/2024/12/client-logo09.jpg',
            order: 8,
            isActive: true,
          },
          {
            id: 9,
            image: 'https://refex.co.in/wp-content/uploads/2024/12/client-logo05.jpg',
            order: 9,
            isActive: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    if (clients.length === 0) return;

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollSpeed = 1;

    const scroll = () => {
      scrollAmount += scrollSpeed;
      if (scrollAmount >= scrollContainer.scrollWidth / 2) {
        scrollAmount = 0;
      }
      scrollContainer.scrollLeft = scrollAmount;
    };

    const intervalId = setInterval(scroll, 30);

    return () => clearInterval(intervalId);
  }, [clients]);

  if (loading) {
    return (
      <section className="py-10 sm:py-16 lg:py-20" style={{ backgroundColor: '#f3f3f3' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center py-10 sm:py-16 lg:py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading clients...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (clients.length === 0) {
    return null;
  }

  const clientImages = clients.map(c => c.image);

  return (
    <section className="py-10 sm:py-16 lg:py-20" style={{ backgroundColor: '#f3f3f3' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
          <h2 className="font-bold uppercase tracking-wide" style={{ fontSize: '34px', color: '#1f1f1f' }}>
            Our Clientele
          </h2>
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-12 overflow-x-hidden"
            style={{ scrollBehavior: 'auto' }}
          >
            {/* Duplicate the clients array for seamless loop */}
            {[...clientImages, ...clientImages].map((clientImage, index) => (
              <div
                key={`${clientImage}-${index}`}
                className="flex-shrink-0 w-48 h-24 flex items-center justify-center bg-white rounded-lg shadow-sm p-4"
              >
                <img
                  src={getFullUrl(clientImage)}
                  alt={`Client ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/192x96?text=No+Image';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
