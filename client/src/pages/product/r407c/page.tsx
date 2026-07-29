import { useState, useEffect } from 'react';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';

export default function R407CPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const images = [
    'https://refex.co.in/wp-content/uploads/2024/01/407a.png',
    'https://refex.co.in/wp-content/uploads/2024/12/407c-all.jpg',
    'https://refex.co.in/wp-content/uploads/2024/12/407c-01.jpg',
    'https://refex.co.in/wp-content/uploads/2024/12/407c-02.jpg'
  ];

  const relatedProducts = [
    {
      name: 'R290',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/r-290a-300x300.jpg',
      link: '/product/r290'
    },
    {
      name: 'R600A',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/r-600a-300x300.jpg',
      link: '/product/r600a'
    },
    {
      name: 'R404A',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/404a-img-300x300.jpg',
      link: '/product/r404a'
    }
  ];

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-[4/5] flex items-center justify-center">
              <img
                src={images[selectedImage]}
                alt="R407C"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`bg-gray-100 rounded-lg overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                    selectedImage === index ? 'border-green-600' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`R407C ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="font-bold mb-2" style={{ fontSize: '25px', color: '#1f1f1f' }}>R407C</p>
              <h1 className="font-bold mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-5xl text-[#1f1f1f]">R407C</h1>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2" style={{ fontSize: '16px', color: '#656567' }}>–</span>
                  <span style={{ fontSize: '16px', color: '#656567' }}>Non-ozone depleting refrigerant.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ fontSize: '16px', color: '#656567' }}>–</span>
                  <span style={{ fontSize: '16px', color: '#656567' }}>Designed for use in residential and commercial air conditioning systems.</span>
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
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 font-semibold text-gray-900">Small</td>
                          <td className="py-3 text-gray-700">9 Kg</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 font-semibold text-gray-900">Big</td>
                          <td className="py-3 text-gray-700">60 Kg</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold text-gray-900">Tonner</td>
                          <td className="py-3 text-gray-700">825 Kg</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Properties Accordion */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleAccordion('properties')}
                  className="w-full px-6 py-4 bg-[#79bb42] hover:bg-[#6aa838] text-white font-semibold text-left flex items-center justify-between cursor-pointer whitespace-nowrap transition-colors"
                >
                  <span>PROPERTIES</span>
                  <i className={`ri-arrow-${openAccordion === 'properties' ? 'up' : 'down'}-s-line text-xl`}></i>
                </button>
                {openAccordion === 'properties' && (
                  <div className="px-6 py-4 bg-white">
                    <table className="w-full mb-4">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 font-semibold text-gray-900">Composition</td>
                          <td className="py-3 text-gray-700">R-134a (52%) R-125 (25%) R-32 (23%)</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 font-semibold text-gray-900">Type</td>
                          <td className="py-3 text-gray-700">HFC Zeotropic blend</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 font-semibold text-gray-900">ASHRAE safety classification</td>
                          <td className="py-3 text-gray-700">A1-non-toxic and non-flammable</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 font-semibold text-gray-900">GWP*</td>
                          <td className="py-3 text-gray-700">1774</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold text-gray-900">Recommended lubricant</td>
                          <td className="py-3 text-gray-700">POE</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-xs text-gray-500">
                      *GWP value for 100-Year time horizons according to IPCC 2007 Fourth Assessment Report.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Product MSDS */}
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
              <i className="ri-file-pdf-2-fill text-3xl text-red-600"></i>
              <a
                href="https://refex.co.in/wp-content/uploads/2025/01/407C-MSDS.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-[#7cd244] font-medium transition-colors"
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
              A blend of R-32, R-125, and R-134a that has very similar properties to R-22 in air conditioning equipment. R-407C has the closest property match to R-22 in an air conditioning retrofit project compared to other blends on the market. It can also be used in medium temp R-22 refrigeration systems. R-407C has a 10°F temperature glide. New systems built with R-407C must have POE lubricants, and retrofitted R-22 systems would need the residual oil flushed with POE.
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
