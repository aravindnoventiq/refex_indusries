import { useState, useEffect } from 'react';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';

export default function R290Page() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const relatedProducts = [
    {
      name: 'R32',
      image: 'https://refex.co.in/wp-content/uploads/2024/01/R32-img-300x300.png',
      link: '/product/r32'
    },
    {
      name: 'R22',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/2-22-img03-300x300.jpg',
      link: '/product/r22'
    },
    {
      name: 'R407C',
      image: 'https://refex.co.in/wp-content/uploads/2024/01/407a-300x300.png',
      link: '/product/r407c'
    }
  ];

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 pt-[var(--header-offset,5.25rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div>
            <div className="bg-gray-200 flex items-center justify-center p-12 rounded-sm">
              <img
                src="https://refex.co.in/wp-content/uploads/2024/12/r-290a.jpg"
                alt="R290"
                className="w-full max-w-md h-auto object-contain"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="font-bold mb-2" style={{ fontSize: '25px', color: '#1f1f1f' }}>R290</p>
              <h1 className="font-bold mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-5xl text-[#1f1f1f]">R290</h1>
              <div className="space-y-4 leading-relaxed mb-8">
                <p style={{ fontSize: '16px', color: '#656567' }}>R290 is refrigerant grade propane and is highly flammable and therefore not suitable for retrofitting existing fluorocarbon refrigerant systems.</p>
                <p style={{ fontSize: '16px', color: '#656567' }}>Normally used in refrigeration and A/C applications where permitted. It is very low GWP and non-ozone depleting.</p>
              </div>
            </div>

            {/* Packaging Accordion */}
            <div className="border-0">
              <button
                onClick={() => toggleAccordion('packaging')}
                className="w-full px-6 py-4 bg-[#79bb42] hover:bg-[#6aa838] text-white font-semibold text-left flex items-center justify-between cursor-pointer whitespace-nowrap rounded-md transition-colors"
              >
                <span className="text-base">PACKAGING:</span>
                <i className={`ri-arrow-${openAccordion === 'packaging' ? 'up' : 'down'}-s-line text-2xl`}></i>
              </button>
              {openAccordion === 'packaging' && (
                <div className="px-6 py-6 bg-white border border-gray-200 border-t-0 rounded-b-md">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <td className="py-3 font-semibold text-gray-900">Weight</td>
                        <td className="py-3 font-semibold text-gray-900">Type</td>
                        <td className="py-3 font-semibold text-gray-900">packages per carton box</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-3 text-gray-700">150gm</td>
                        <td className="py-3 text-gray-700">only pintype</td>
                        <td className="py-3 text-gray-700">20 pcs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-16">
          <div className="mb-4">
            <span className="inline-block rounded-lg font-bold" style={{ backgroundColor: '#7dc144', color: '#ffffff', padding: '20px', fontSize: '16px' }}>Description</span>
          </div>
          <div>
            <div className="space-y-4 leading-relaxed">
              <p style={{ fontSize: '16px', color: '#484848' }}>
                R290 refrigerant is the best functional replacement for them and other CFC and HFC refrigerant alternatives
              </p>
              <p style={{ fontSize: '16px', color: '#484848' }}>
                Refrigerant gas also called Propane, is refrigerant-grade propane gas globally used as an environmentally friendly refrigerant gas. In addition, the R290 is highly flammable. It is an efficient refrigerant that has a low Global Warming Potential (GWP) &amp; it's ODP value is 0.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div>
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
