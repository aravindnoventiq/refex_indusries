import { useEffect, useRef, useState } from 'react';
import { greenMobilityCmsApi } from '../../../services/api';
import { resolveMediaUrl } from '../../../utils/resolveMediaUrl';

interface Client {
  id: number;
  image: string;
  order: number;
  isActive: boolean;
}

export default function ClientsSection() {
  const clientsRef = useRef<HTMLDivElement>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await greenMobilityCmsApi.getClients();
      const activeClients = (data || []).filter((client: Client) => client.isActive);
      setClients(activeClients);
    } catch (err) {
      console.error('Failed to load clients:', err);
      // Fallback to default data
      setClients([
        {
          id: 1,
          image: 'https://refex.co.in/wp-content/uploads/2024/12/rgml-client01.jpg',
          order: 0,
          isActive: true,
        },
        {
          id: 2,
          image: 'https://refex.co.in/wp-content/uploads/2024/12/rgml-client02.jpg',
          order: 1,
          isActive: true,
        },
        {
          id: 3,
          image: 'https://refex.co.in/wp-content/uploads/2024/12/rgml-client03.jpg',
          order: 2,
          isActive: true,
        },
        {
          id: 4,
          image: 'https://refex.co.in/wp-content/uploads/2024/12/rgml-client04.jpg',
          order: 3,
          isActive: true,
        },
        {
          id: 5,
          image: 'https://refex.co.in/wp-content/uploads/2024/12/rgml-client05.jpg',
          order: 4,
          isActive: true,
        },
        {
          id: 6,
          image: 'https://refex.co.in/wp-content/uploads/2024/12/rgml-client06.jpg',
          order: 5,
          isActive: true,
        },
        {
          id: 7,
          image: 'https://refex.co.in/wp-content/uploads/2024/12/rgml-client07.jpg',
          order: 6,
          isActive: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clients.length === 0) return;

    let animationFrameId: number;

    const animate = () => {
      if (clientsRef.current) {
        clientsRef.current.scrollLeft += 1;
        if (clientsRef.current.scrollLeft >= clientsRef.current.scrollWidth / 2) {
          clientsRef.current.scrollLeft = 0;
        }
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    if (clientsRef.current) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [clients]);

  if (loading) {
    return (
      <div className="py-10 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  const sortedClients = [...clients].sort((a, b) => (a.order || 0) - (b.order || 0));
  const clientImages = sortedClients.map((c) => resolveMediaUrl(c.image));

  if (clientImages.length === 0) {
    return (
      <div className="py-10 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 py-12">
            No clients available.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bold mb-4" style={{ fontSize: '34px', color: '#1f1f1f', lineHeight: '1.68' }}>
            Our Clientele
          </h2>
        </div>

        <div className="overflow-hidden">
          <div
            ref={clientsRef}
            className="flex gap-8 overflow-x-hidden"
            style={{ scrollBehavior: 'auto' }}
          >
            {[...clientImages, ...clientImages].map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="flex-shrink-0 w-48 h-32 flex items-center justify-center p-4"
              >
                <img
                  src={image}
                  alt={`Client ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
