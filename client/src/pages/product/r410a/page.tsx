
import { useState, useEffect } from 'react';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';
import withProductCms from '../withProductCms';

function R410APage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const images = [
    'https://refex.co.in/wp-content/uploads/2024/01/410a-img.jpg',
    'https://refex.co.in/wp-content/uploads/2024/12/410-A-all.jpg',
    'https://refex.co.in/wp-content/uploads/2024/12/410-A-01.jpg',
    'https://refex.co.in/wp-content/uploads/2024/12/410-A-02.jpg'
  ];

  const relatedProducts = [
    {
      name: 'R404A',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/404a-img-300x300.jpg',
      link: '/product/r404a'
    },
    {
      name: 'R290',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/r-290a-300x300.jpg',
      link: '/product/r290'
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
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-[4/5] flex items-center justify-center">
              <img
                src={images[selectedImage]}
                alt="R410A"
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
                    alt={`R410A ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="font-bold mb-2" style={{ fontSize: '25px', color: '#1f1f1f' }}>R410A</p>
              <h1 className="font-bold mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-5xl text-[#1f1f1f]">R410A</h1>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2" style={{ fontSize: '16px', color: '#656567' }}>–</span>
                  <span style={{ fontSize: '16px', color: '#656567' }}>Non-ozone depleting refrigerant, near-azeotropic blend.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ fontSize: '16px', color: '#656567' }}>–</span>
                  <span style={{ fontSize: '16px', color: '#656567' }}>Developed for air conditioning as well as some medium temperature refrigeration applications.</span>
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
                          <td className="py-3 text-gray-700">8 Kg</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 font-semibold text-gray-900">Big</td>
                          <td className="py-3 text-gray-700">45 Kg</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold text-gray-900">Tonner</td>
                          <td className="py-3 text-gray-700">710 Kg</td>
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
                          <td className="py-3 text-gray-700">r-125 (50%) r-32 (50%)</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 font-semibold text-gray-900">Type</td>
                          <td className="py-3 text-gray-700">HFC Near-azeotropic blend</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 font-semibold text-gray-900">ASHRAE safety classification</td>
                          <td className="py-3 text-gray-700">A1-non-toxic and non-flammable</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 font-semibold text-gray-900">GWP*</td>
                          <td className="py-3 text-gray-700">2088</td>
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
                href="https://refex.co.in/wp-content/uploads/2025/01/410-MSDS.pdf"
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
              A blend of R-32 and R-125 that nearly forms an azeotrope, which means it has extremely low temperature glide and almost no fractionation potential. This blend has about 60% higher pressure than R-22 in air conditioning applications, and therefore should be used only in new equipment specifically designed to handle the pressure. Systems designed for R-410A will have smaller components (heat exchangers, compressor, etc.) to perform the same cooling job compared to R-22. R-410A will require POE lubricants. Retrofitting R-22 equipment is not recommended under any circumstances.
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

export default withProductCms('r410a', R410APage);
