import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';

import withProductCms from '../withProductCms';

const HFC134APage = () => {
  const [mainImage, setMainImage] = useState('https://refex.co.in/wp-content/uploads/2024/12/HFC.jpg');
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const thumbnails = [
    'https://refex.co.in/wp-content/uploads/2024/12/HFC.jpg',
    'https://refex.co.in/wp-content/uploads/2024/12/134a-03.jpg',
    'https://refex.co.in/wp-content/uploads/2024/12/134a-02.jpg',
    'https://refex.co.in/wp-content/uploads/2024/12/134a-all.jpg'
  ];

  const relatedProducts = [
    {
      name: 'Hydrocarbon',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/hydrocarbon.jpg',
      link: '/product/hydrocarbon'
    },
    {
      name: 'Copper Tubes',
      image: 'https://refex.co.in/wp-content/uploads/2024/04/copper-tubes01.jpg',
      link: '/product/copper-tubes'
    },
    {
      name: 'R32',
      image: 'https://refex.co.in/wp-content/uploads/2024/01/R32-img.png',
      link: '/product/r32'
    }
  ];

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 pt-[var(--header-offset,5.25rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={mainImage} 
                alt="HFC-134A" 
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {thumbnails.map((thumb, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(thumb)}
                  className={`border-2 rounded-lg overflow-hidden transition-all ${
                    mainImage === thumb ? 'border-green-600' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img 
                    src={thumb} 
                    alt={`HFC-134A ${index + 1}`} 
                    className="w-full h-auto object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <p className="font-bold mb-2" style={{ fontSize: '25px', color: '#1f1f1f' }}>HFC-134A</p>
            <h1 className="font-bold mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-5xl text-[#1f1f1f]">HFC-134A</h1>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span style={{ fontSize: '16px', color: '#656567' }}>– Non-ozone depleting refrigerant.</span>
              </li>
              <li className="flex items-start">
                <span style={{ fontSize: '16px', color: '#656567' }}>– Efficient refrigerant in various air conditioning and medium temperature refrigerant applications.</span>
              </li>
              <li className="flex items-start">
                <span style={{ fontSize: '16px', color: '#656567' }}>– One of the components of fluoro refrigerant blends (407C,404A).</span>
              </li>
            </ul>

            {/* Packaging Accordion */}
            <div className="mb-4">
              <button
                onClick={() => toggleAccordion('packaging')}
                className="w-full bg-[#79bb42] text-white px-6 py-4 rounded-lg flex items-center justify-between hover:bg-[#6aa838] transition-colors"
              >
                <span className="font-semibold">PACKAGING:</span>
                <i className={`ri-arrow-${activeAccordion === 'packaging' ? 'up' : 'down'}-s-line text-xl`}></i>
              </button>
              {activeAccordion === 'packaging' && (
                <div className="bg-white border border-gray-200 rounded-b-lg p-6 mt-1">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 font-semibold text-gray-700">Small</td>
                        <td className="py-3 text-gray-600">10 Kg</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 font-semibold text-gray-700">Big</td>
                        <td className="py-3 text-gray-600">62 Kg</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-semibold text-gray-700">Tonner</td>
                        <td className="py-3 text-gray-600">850 Kg</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Properties Accordion */}
            <div className="mb-8">
              <button
                onClick={() => toggleAccordion('properties')}
                className="w-full bg-[#79bb42] text-white px-6 py-4 rounded-lg flex items-center justify-between hover:bg-[#6aa838] transition-colors"
              >
                <span className="font-semibold">PROPERTIES</span>
                <i className={`ri-arrow-${activeAccordion === 'properties' ? 'up' : 'down'}-s-line text-xl`}></i>
              </button>
              {activeAccordion === 'properties' && (
                <div className="bg-white border border-gray-200 rounded-b-lg p-6 mt-1">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 font-semibold text-gray-700">Composition</td>
                        <td className="py-3 text-gray-600">HFC-134A (100%)</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 font-semibold text-gray-700">Type</td>
                        <td className="py-3 text-gray-600">HFC Single component fluid</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 font-semibold text-gray-700">ASHRAE safety classification</td>
                        <td className="py-3 text-gray-600">A1-non-toxic and non-flammable</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-3 font-semibold text-gray-700">GWP*</td>
                        <td className="py-3 text-gray-600">1430</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-semibold text-gray-700">Recommended lubricant</td>
                        <td className="py-3 text-gray-600">POE or PAG (auto)</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-xs text-gray-500 mt-4">*GWP value for 100-Year time horizons according to IPCC 2007 Fourth Assessment Report.</p>
                </div>
              )}
            </div>

            {/* Product MSDS */}
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
              <i className="ri-file-pdf-2-fill text-3xl text-red-600"></i>
              <a 
                href="https://refex.co.in/wp-content/uploads/2025/01/R134a-MSDS.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-[#7cd244] transition-colors font-medium"
              >
                Product MSDS
              </a>
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
              Since the phaseout of R-12, HFC-134A has grown to become the standard refrigerant choice for household appliances, small self-contained refrigeration units, very large chillers, and automotive air conditioning. It is also a component in many refrigerant blends on the market. HFC-134A is an HFC refrigerant, which requires polyolester (POE) lubricant to be used in the compressor.
            </p>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((product, index) => (
              <Link 
                key={index} 
                to={product.link}
                className="group"
              >
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-96 object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center group-hover:text-[#7cd244] transition-colors">
                  {product.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default withProductCms('hfc-134a', HFC134APage);
