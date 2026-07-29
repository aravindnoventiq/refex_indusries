
import { useState, useEffect } from 'react';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';
import ScrollToTop from '../../home/components/ScrollToTop';

export default function R404AProductPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const productImages = [
    'https://refex.co.in/wp-content/uploads/2024/12/404a-img.jpg',
    'https://refex.co.in/wp-content/uploads/2024/12/R-2201-galler-01.jpg',
    'https://refex.co.in/wp-content/uploads/2024/12/R-2201-galler-03.jpg',
    'https://refex.co.in/wp-content/uploads/2024/12/R-2203.jpg',
  ];

  const relatedProducts = [
    {
      name: 'Copper Tubes',
      image: 'https://refex.co.in/wp-content/uploads/2024/04/copper-tubes01.jpg',
      link: '/product/copper-tubes',
    },
    {
      name: 'R32',
      image: 'https://refex.co.in/wp-content/uploads/2024/01/R32-img.png',
      link: '/product/r32',
    },
    {
      name: 'R290',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/r-290a.jpg',
      link: '/product/r290',
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
                  alt="R404A"
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
                      alt={`R404A - Image ${index + 1}`}
                      className="w-full h-24 object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div>
              <p className="font-bold mb-2" style={{ fontSize: '25px', color: '#1f1f1f' }}>R404A</p>
              <h1 className="font-bold mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-5xl text-[#1f1f1f]">R404A</h1>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <span style={{ fontSize: '16px', color: '#656567' }}>
                    – Non-ozone depleting refrigerant, near-azeotropic blend.
                  </span>
                </li>
                <li className="flex items-start">
                  <span style={{ fontSize: '16px', color: '#656567' }}>
                    – Well suited refrigerant for a variety of Medium and low-temperature refrigeration applications.
                  </span>
                </li>
                <li className="flex items-start">
                  <span style={{ fontSize: '16px', color: '#656567' }}>
                    – R404a has a very low temperature glide* (less than 1℃) which makes it often suitable for flooded evaporated technology.
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
                          <td className="py-3 text-gray-700">8 Kg</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 text-gray-700 font-medium">Big</td>
                          <td className="py-3 text-gray-700">45 Kg</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-gray-700 font-medium">Tonner</td>
                          <td className="py-3 text-gray-700">650 Kg</td>
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
                          <td className="py-3 text-gray-700">R-143a (52%) R-125 (44%) R-134a (4%)</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 text-gray-700 font-medium">Type</td>
                          <td className="py-3 text-gray-700">HFC Near-azeotropic blend</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 text-gray-700 font-medium">ASHRAE safety classification</td>
                          <td className="py-3 text-gray-700">A1-non-toxic and non-flammable</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-3 text-gray-700 font-medium">GWP*</td>
                          <td className="py-3 text-gray-700">3922</td>
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
                  href="https://refex.co.in/wp-content/uploads/2025/02/R404-MSDS.pdf"
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
          <div className="mb-20">
            <div className="mb-4">
              <span className="inline-block rounded-lg font-bold text-2xl" style={{ backgroundColor: '#7dc144', color: '#ffffff', padding: '20px' }}>Description</span>
            </div>
            <div>
              <p className="leading-relaxed" style={{ fontSize: '16px', color: '#484848' }}>
                A blend of R-125, R-143a, and R-134a intended for low and medium temperature refrigeration applications where R-502 was previously used. Most new supermarket and refrigeration equipment has been built for an HFC such as R-404A, R-507, or R-407A. It is also possible to retrofit charge R-507 systems with R-404A. R-404A has slightly lower pressures than R-507 (from the small amount of R-134a added), and generally both blends have slightly higher pressures than R-502. R-404A requires polyolester (POE) lubricant, which is usually charged into new equipment. If retrofitting existing equipment, the original oil must be replaced with POE.
              </p>
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
