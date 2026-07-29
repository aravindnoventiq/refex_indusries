import { useState, useEffect } from 'react';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';

export default function ButanePage() {
  const [isPackagingOpen, setIsPackagingOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const relatedProducts = [
    {
      id: 1,
      name: 'Copper Tubes',
      image: 'https://refex.co.in/wp-content/uploads/2024/04/copper-tubes01-300x300.jpg',
      link: '/product/copper-tubes'
    },
    {
      id: 2,
      name: 'Hydrocarbon',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/hydrocarbon-300x300.jpg',
      link: '/product/hydrocarbon'
    },
    {
      id: 3,
      name: 'HFC-134A',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/HFC-300x300.jpg',
      link: '/product/hfc-134a'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Product Image */}
          <div className="w-full">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img
                src="https://refex.co.in/wp-content/uploads/2024/12/butane.jpg"
                alt="Butane"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <p className="font-bold mb-2" style={{ fontSize: '25px', color: '#1f1f1f' }}>Butane</p>
            <h1 className="font-bold mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-5xl text-[#1f1f1f]">Butane</h1>

            {/* Packaging Accordion */}
            <div className="mb-6">
              <button
                onClick={() => setIsPackagingOpen(!isPackagingOpen)}
                className="w-full bg-[#79bb42] text-white px-6 py-4 rounded-lg flex items-center justify-between hover:bg-[#6aa838] transition-colors"
              >
                <span className="font-semibold">PACKAGING:</span>
                <i className={`ri-arrow-${isPackagingOpen ? 'up' : 'down'}-s-line text-xl`}></i>
              </button>
              
              {isPackagingOpen && (
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Weight</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">packages per carton box</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-600 border-b">200gm</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-b">only pintype</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-b">25 pcs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((product) => (
              <div key={product.id}>
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-96 object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center">
                  {product.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
