import { useState, useEffect } from 'react';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';
import ScrollToTop from '../../home/components/ScrollToTop';

export default function R22ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const productImages = [
    'https://refex.co.in/wp-content/uploads/2024/12/2-22-img03.jpg',
    'https://refex.co.in/wp-content/uploads/2024/12/2-22-img03.jpg',
    'https://refex.co.in/wp-content/uploads/2024/12/2-22-img02.jpg',
    'https://refex.co.in/wp-content/uploads/2024/12/r-22-imgall.jpg',
  ];

  const relatedProducts = [
    {
      name: 'R404A',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/404a-img.jpg',
      link: '/product/r404a',
    },
    {
      name: 'Copper Tubes',
      image: 'https://refex.co.in/wp-content/uploads/2024/04/copper-tubes01.jpg',
      link: '/product/copper-tubes',
    },
    {
      name: 'Hydrocarbon',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/hydrocarbon.jpg',
      link: '/product/hydrocarbon',
    },
  ];

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <>
      <Header />
      <ScrollToTop />

      <div className="pt-[var(--header-offset,5.25rem)] pb-10 sm:pb-16 lg:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Product Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Left - Product Images */}
            <div>
              {/* Main Image */}
              <div className="bg-gray-100 mb-4 overflow-hidden">
                <img
                  src={productImages[selectedImage]}
                  alt="R22"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-gray-100 cursor-pointer overflow-hidden border-2 ${
                      selectedImage === index ? 'border-[#7cd244]' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`R22 - Image ${index + 1}`}
                      className="w-full h-24 object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div>
              <p className="font-bold mb-2" style={{ fontSize: '25px', color: '#1f1f1f' }}>R22</p>
              <h1 className="font-bold mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-5xl text-[#1f1f1f]">R22</h1>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <span style={{ fontSize: '16px', color: '#656567' }}>
                    – Used as a propellant and refrigerant as an alternative to the highly ozone-depleting CFC-11 and CFC-12.
                  </span>
                </li>
                <li className="flex items-start">
                  <span style={{ fontSize: '16px', color: '#656567' }}>
                    – Designed for Room Air conditioners, Commercial and Industrial Refrigeration Units , Chillers, and intermediates for Life science.
                  </span>
                </li>
              </ul>

              {/* Accordion - Packaging */}
              <div className="mb-4">
                <button
                  onClick={() => toggleAccordion('packaging')}
                  className="w-full bg-[#79bb42] text-white px-6 py-4 rounded-lg flex items-center justify-between hover:bg-[#6aa838] transition-colors"
                >
                  <span className="font-semibold">PACKAGING:</span>
                  <i className={`ri-arrow-${openAccordion === 'packaging' ? 'up' : 'down'}-s-line text-xl`}></i>
                </button>
                {openAccordion === 'packaging' && (
                  <div className="bg-white border border-gray-200 p-6 mt-2 rounded-lg">
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 text-gray-700 font-medium">Small</td>
                          <td className="py-3 text-gray-700">10 Kg</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 text-gray-700 font-medium">Big</td>
                          <td className="py-3 text-gray-700">61 Kg</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-gray-700 font-medium">Tonner</td>
                          <td className="py-3 text-gray-700">710 Kg</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Accordion - Properties */}
              <div className="mb-8">
                <button
                  onClick={() => toggleAccordion('properties')}
                  className="w-full bg-[#79bb42] text-white px-6 py-4 rounded-lg flex items-center justify-between hover:bg-[#6aa838] transition-colors"
                >
                  <span className="font-semibold">PROPERTIES</span>
                  <i className={`ri-arrow-${openAccordion === 'properties' ? 'up' : 'down'}-s-line text-xl`}></i>
                </button>
                {openAccordion === 'properties' && (
                  <div className="bg-white border border-gray-200 p-6 mt-2 rounded-lg">
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 text-gray-700 font-medium">Composition</td>
                          <td className="py-3 text-gray-700">Chlorodifluoromethane</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 text-gray-700 font-medium">Type</td>
                          <td className="py-3 text-gray-700">HCFC Azeotropic</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 text-gray-700 font-medium">ASHRAE safety classification</td>
                          <td className="py-3 text-gray-700">A1-non-toxic and non-flammable</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 text-gray-700 font-medium">GWP*</td>
                          <td className="py-3 text-gray-700">1700</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-gray-700 font-medium">Recommended lubricant</td>
                          <td className="py-3 text-gray-700">POE</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-xs text-gray-500 mt-4">
                      *GWP value for 100-Year time horizons according to IPCC 2007 Fourth Assessment Report.
                    </p>
                  </div>
                )}
              </div>

              {/* Product MSDS */}
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                <i className="ri-file-pdf-2-fill text-3xl text-red-600"></i>
                <a
                  href="https://refex.co.in/wp-content/uploads/2025/01/R22-MSDS.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-[#7cd244] transition-colors font-medium"
                >
                  Product MSDS
                </a>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((product, index) => (
                <div
                  key={index}
                  className="cursor-pointer"
                >
                  <div className="bg-gray-100 mb-4 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-96 object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 hover:text-[#7cd244] transition-colors text-center">
                    {product.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
