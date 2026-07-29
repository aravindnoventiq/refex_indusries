import { useState, useEffect } from 'react';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';

export default function CopperTubesPage() {
  const [isPackagingOpen, setIsPackagingOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const relatedProducts = [
    {
      name: 'R290',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/r-290a-300x300.jpg',
      link: '/product/r290'
    },
    {
      name: 'R22',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/2-22-img03-300x300.jpg',
      link: '/product/r22'
    },
    {
      name: 'R404A',
      image: 'https://refex.co.in/wp-content/uploads/2024/12/404a-img-300x300.jpg',
      link: '/product/r404a'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-[var(--header-offset,5.25rem)] pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="w-full">
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src="https://refex.co.in/wp-content/uploads/2024/04/copper-tubes01.jpg" 
                  alt="Copper Tubes"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <p className="font-bold mb-2" style={{ fontSize: '25px', color: '#1f1f1f' }}>Copper Tubes</p>
              <h1 className="font-bold mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-5xl text-[#1f1f1f]">Copper Tubes</h1>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="mr-2" style={{ fontSize: '16px', color: '#656567' }}>–</span>
                  <span style={{ fontSize: '16px', color: '#656567' }}>Flexible and easy to bend</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ fontSize: '16px', color: '#656567' }}>–</span>
                  <span style={{ fontSize: '16px', color: '#656567' }}>Advanced Eddy Current testing for defect-free, flawless tubes</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ fontSize: '16px', color: '#656567' }}>–</span>
                  <span style={{ fontSize: '16px', color: '#656567' }}>100% RoHS Compliance</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ fontSize: '16px', color: '#656567' }}>–</span>
                  <span style={{ fontSize: '16px', color: '#656567' }}>Bright annealed finish and the inside 100% carbon-free</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ fontSize: '16px', color: '#656567' }}>–</span>
                  <span style={{ fontSize: '16px', color: '#656567' }}>All tubes are electronically tested by the Eddy Current method</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ fontSize: '16px', color: '#656567' }}>–</span>
                  <span style={{ fontSize: '16px', color: '#656567' }}>Premium quality copper tube</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2" style={{ fontSize: '16px', color: '#656567' }}>–</span>
                  <span style={{ fontSize: '16px', color: '#656567' }}>Manufactured as per International and National Standards suitable for all types of refrigerants</span>
                </li>
              </ul>

              {/* Packaging Accordion */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setIsPackagingOpen(!isPackagingOpen)}
                  className="w-full px-6 py-4 text-left font-semibold text-white flex items-center justify-between bg-[#79bb42] hover:bg-[#6aa838] transition-colors whitespace-nowrap"
                >
                  <span>PACKAGING:</span>
                  <i className={`ri-arrow-${isPackagingOpen ? 'up' : 'down'}-s-line text-xl`}></i>
                </button>
                
                {isPackagingOpen && (
                  <div className="px-6 py-4 bg-white border-t border-gray-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 font-semibold text-gray-900">Copper Tube</th>
                          <th className="text-left py-2 font-semibold text-gray-900">Each Weight</th>
                          <th className="text-left py-2 font-semibold text-gray-900">Per Box</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 text-gray-700">1/4 inch/mm</td>
                          <td className="py-2 text-gray-700">1.2</td>
                          <td className="py-2 text-gray-700">15</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 text-gray-700">1/2 inch/mm</td>
                          <td className="py-2 text-gray-700">3.2</td>
                          <td className="py-2 text-gray-700">7</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 text-gray-700">3/8 inch/mm</td>
                          <td className="py-2 text-gray-700">2.2</td>
                          <td className="py-2 text-gray-700">9</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-700">5/8 inch/mm</td>
                          <td className="py-2 text-gray-700">4.2</td>
                          <td className="py-2 text-gray-700">5</td>
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
              <p className="leading-relaxed" style={{ fontSize: '16px', color: '#484848' }}>
                We are proud to be a trusted provider of high-quality copper tubes for refrigeration, air conditioning, and plumbing applications. Our tubes are designed for durability and reliability, meeting industry standards. We offer a wide range of sizes and variations to cater to different project needs.
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
      </main>

      <Footer />
    </div>
  );
}
