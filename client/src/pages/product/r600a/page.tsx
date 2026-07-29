import { useState, useEffect } from 'react';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';

export default function R600APage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const images = [
    'https://refex.co.in/wp-content/uploads/2024/12/r-600a.jpg'
  ];

  const relatedProducts = [
    {
      name: 'R22',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/2-22-img03-300x300.jpg',
      link: '/product/r22'
    },
    {
      name: 'HFC-134A',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/HFC-300x300.jpg',
      link: '/product/hfc-134a'
    },
    {
      name: 'R290',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/r-290a-300x300.jpg',
      link: '/product/r290'
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
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-[4/5] flex items-center justify-center">
              <img
                src={images[selectedImage]}
                alt="R600A"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="font-bold mb-2" style={{ fontSize: '25px', color: '#1f1f1f' }}>R600A</p>
              <h1 className="font-bold mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-5xl text-[#1f1f1f]">R600A</h1>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2" style={{ fontSize: '16px', color: '#656567' }}>–</span>
                  <span style={{ fontSize: '16px', color: '#656567' }}>R600a (Iso-Butane) is refrigerant grade Iso-Butane used as a replacement for R12 and R134a in a variety of high temperature refrigeration applications.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ fontSize: '16px', color: '#656567' }}>–</span>
                  <span style={{ fontSize: '16px', color: '#656567' }}>R600a (Iso-Butane) is a hydrocarbon that is becoming increasingly popular due to its low Global Warming Potential (GWP).</span>
                </li>
              </ul>
            </div>

            {/* Packaging Accordion */}
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleAccordion('packaging')}
                  className="w-full px-6 py-4 bg-[#79bb42] hover:bg-[#6aa838] text-white font-semibold text-left flex items-center justify-between cursor-pointer whitespace-nowrap transition-colors"
                >
                  <span>PACKAGING:</span>
                  <i className={`ri-arrow-${openAccordion === 'packaging' ? 'up' : 'down'}-s-line text-xl`}></i>
                </button>
                {openAccordion === 'packaging' && (
                  <div className="px-6 py-4 bg-white">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-3 text-left font-semibold text-gray-900">Weight</th>
                          <th className="py-3 text-left font-semibold text-gray-900">Type</th>
                          <th className="py-3 text-left font-semibold text-gray-900">packages per carton box</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-3 text-gray-700">200gm</td>
                          <td className="py-3 text-gray-700">only pintype</td>
                          <td className="py-3 text-gray-700">50 pcs</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-16">
          <div className="mb-4">
            <span className="inline-block rounded-lg font-bold" style={{ backgroundColor: '#7dc144', color: '#ffffff', padding: '20px', fontSize: '16px' }}>Description</span>
          </div>
          <div>
            <p className="leading-relaxed" style={{ fontSize: '16px', color: '#484848' }}>
              R600a (isobutane) is refrigerant grade isobutane used as a replacement for R12 and R134a in a variety of high-temperature refrigeration applications.
            </p>
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
