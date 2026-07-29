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

interface Product {
  id: number;
  image: string;
  name: string;
  link: string;
  order: number;
  isActive: boolean;
}

export default function OurProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await refrigerantGasCmsApi.getProducts();
        const activeProducts = (data || [])
          .filter((item: Product) => item.isActive)
          .sort((a: Product, b: Product) => (a.order || 0) - (b.order || 0));
        setProducts(activeProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Fallback to default data if API fails
        setProducts([
          {
            id: 1,
            image: 'https://refex.co.in/wp-content/uploads/2024/12/2-22-img03.jpg',
            name: 'R22',
            link: '/product/r22',
            order: 1,
            isActive: true,
          },
          {
            id: 2,
            image: 'https://refex.co.in/wp-content/uploads/2024/12/404a-img.jpg',
            name: 'R404A',
            link: '/product/r404a',
            order: 2,
            isActive: true,
          },
          {
            id: 3,
            image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/2cd30431e93d87e60025af1c06527b77.jpeg',
            name: 'HFC-134A',
            link: '/product/hfc-134a',
            order: 3,
            isActive: true,
          },
          {
            id: 4,
            image: 'https://refex.co.in/wp-content/uploads/2024/01/R32-img.png',
            name: 'R32',
            link: '/product/r32',
            order: 4,
            isActive: true,
          },
          {
            id: 5,
            image: 'https://refex.co.in/wp-content/uploads/2024/01/407a.png',
            name: 'R407C',
            link: '/product/r407c',
            order: 5,
            isActive: true,
          },
          {
            id: 6,
            image: 'https://refex.co.in/wp-content/uploads/2024/01/410a-img.jpg',
            name: 'R410A',
            link: '/product/r410a',
            order: 6,
            isActive: true,
          },
          {
            id: 7,
            image: 'https://refex.co.in/wp-content/uploads/2024/12/r-600a.jpg',
            name: 'R600A',
            link: '/product/r600a',
            order: 7,
            isActive: true,
          },
          {
            id: 8,
            image: 'https://refex.co.in/wp-content/uploads/2024/12/r-290a.jpg',
            name: 'R290',
            link: '/product/r290',
            order: 8,
            isActive: true,
          },
          {
            id: 9,
            image: 'https://refex.co.in/wp-content/uploads/2024/12/hydrocarbon.jpg',
            name: 'Hydrocarbon',
            link: '/product/hydrocarbon',
            order: 9,
            isActive: true,
          },
          {
            id: 10,
            image: 'https://refex.co.in/wp-content/uploads/2024/12/butane.jpg',
            name: 'Butane',
            link: '/product/butane',
            order: 10,
            isActive: true,
          },
          {
            id: 11,
            image: 'https://refex.co.in/wp-content/uploads/2024/04/copper-tubes01.jpg',
            name: 'Copper Tubes',
            link: '/product/copper-tubes',
            order: 11,
            isActive: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (link: string) => {
    try {
      if (typeof window.REACT_APP_NAVIGATE === 'function') {
        window.REACT_APP_NAVIGATE(link);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  if (loading) {
    return (
      <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
          <h2 className="font-bold uppercase tracking-wide" style={{ fontSize: '34px', color: '#1f1f1f' }}>
            Our Products
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
              onClick={() => handleProductClick(product.link)}
            >
              <div className="relative overflow-hidden bg-gray-100">
                <img
                  src={getFullUrl(product.image)}
                  alt={product.name}
                  className="object-cover transition-transform duration-500"
                  style={{ width: '590px', height: '400px' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x320?text=No+Image';
                  }}
                />
              </div>

              <div className="p-6 bg-white">
                <h3 className="text-xl font-bold text-center text-black group-hover:text-[#7cd144] transition-colors duration-300">
                  {product.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
