import { useState, useEffect } from 'react';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';

export default function HydrocarbonPage() {
  const [isPackagingOpen, setIsPackagingOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const relatedProducts = [
    {
      name: 'R600A',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/r-600a-300x300.jpg',
      link: '/product/r600a'
    },
    {
      name: 'R22',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/2-22-img03-300x300.jpg',
      link: '/product/r22'
    },
    {
      name: 'HFC-134A',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/HFC-300x300.jpg',
      link: '/product/hfc-134a'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 pt-[var(--header-offset,5.25rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="w-full">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src="https://refex.co.in/wp-content/uploads/2024/12/hydrocarbon.jpg"
                alt="Hydrocarbon"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <p className="font-bold mb-2" style={{ fontSize: '25px', color: '#1f1f1f' }}>Hydrocarbon</p>
            <h1 className="font-bold mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-5xl text-[#1f1f1f]">Hydrocarbon</h1>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="leading-relaxed" style={{ fontSize: '16px', color: '#656567' }}>
                  – HC Blend is a refrigerant gas consisting of a blend of isobutane (R600a) and propane (R290)
                </span>
              </li>
              <li className="flex items-start">
                <span className="leading-relaxed" style={{ fontSize: '16px', color: '#656567' }}>
                  – It is primarily used in small commercial refrigeration and air conditioning systems
                </span>
              </li>
              <li className="flex items-start">
                <span className="leading-relaxed" style={{ fontSize: '16px', color: '#656567' }}>
                  It is compatible with most common refrigeration material lubricants. HC Blend is an efficient refrigerant with a low GWP and an ODP value of 0.
                </span>
              </li>
            </ul>

            {/* Packaging Accordion */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setIsPackagingOpen(!isPackagingOpen)}
                className="w-full px-6 py-4 flex items-center justify-between bg-[#79bb42] text-white rounded-lg hover:bg-[#6aa838] transition-colors cursor-pointer"
              >
                <span className="font-semibold text-base">PACKAGING:</span>
                <i className={`ri-arrow-${isPackagingOpen ? 'up' : 'down'}-s-line text-xl`}></i>
              </button>
              
              {isPackagingOpen && (
                <div className="px-6 py-4 bg-white">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 px-4 font-semibold text-gray-900">Weight</td>
                        <td className="py-3 px-4 font-semibold text-gray-900">Type</td>
                        <td className="py-3 px-4 font-semibold text-gray-900">packages per carton box</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-700">170gm</td>
                        <td className="py-3 px-4 text-gray-700">only pintype</td>
                        <td className="py-3 px-4 text-gray-700">24 pcs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="pt-[var(--header-offset,5.25rem)]">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related products</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((product, index) => (
              <div key={index}>
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
        </section>
      </div>

      <Footer />
    </div>
  );
}
