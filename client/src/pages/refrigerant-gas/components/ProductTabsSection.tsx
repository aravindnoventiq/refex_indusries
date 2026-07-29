import { useState, useEffect } from 'react';
import { refrigerantGasCmsApi } from '../../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const getFullUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`;
  }
  return `${API_BASE_URL}/${url}`;
};

interface Tab {
  id: number;
  tabId: string;
  label: string;
  image?: string;
  order: number;
  isActive: boolean;
}

interface TabPoint {
  id: number;
  tabId: string;
  title?: string;
  description?: string;
  order: number;
  isActive: boolean;
}

export default function ProductTabsSection() {
  const [activeTab, setActiveTab] = useState<string>('quality');
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [points, setPoints] = useState<TabPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tabsData, pointsData] = await Promise.all([
          refrigerantGasCmsApi.getProductTabs(),
          refrigerantGasCmsApi.getProductTabPoints(),
        ]);
        const activeTabs = (tabsData || [])
          .filter((t: Tab) => t.isActive)
          .sort((a: Tab, b: Tab) => (a.order || 0) - (b.order || 0));
        setTabs(activeTabs);
        if (activeTabs.length > 0) {
          setActiveTab(activeTabs[0].tabId);
        }
        setPoints(pointsData || []);
      } catch (error) {
        console.error('Failed to fetch product tabs:', error);
        // Fallback to default data
        setTabs([
          { id: 1, tabId: 'quality', label: 'Product Quality', image: 'https://refex.co.in/wp-content/uploads/2024/12/product-quality-img.jpg', order: 1, isActive: true },
          { id: 2, tabId: 'safety', label: 'Product Safety', image: 'https://refex.co.in/wp-content/uploads/2024/12/product-safet-new.jpg', order: 2, isActive: true },
          { id: 3, tabId: 'applications', label: 'Product Applications', image: 'https://refex.co.in/wp-content/uploads/2024/12/product-application-new.jpg', order: 3, isActive: true },
        ]);
        setPoints([
          { id: 1, tabId: 'quality', title: 'Purity and Commitment', description: 'Our refrigerants are >99.9% pure. Refex is fundamentally committed to ensuring the quality of our materials from filling to customer service, meeting safety, quality, and performance expectations.', order: 1, isActive: true },
          { id: 2, tabId: 'quality', title: 'Continuous Improvement', description: 'We are dedicated to continuous improvement, innovation, and implementation, staying in pace with market revolutions.', order: 2, isActive: true },
          { id: 3, tabId: 'quality', title: 'Customer Satisfaction', description: 'Our success stands on the pillars of Quality, Delivery, and Customer Satisfaction.', order: 3, isActive: true },
          { id: 4, tabId: 'quality', title: 'Quality Assurance', description: 'Each customer receives a Certificate of Analysis conforming to the highest quality standards for all our processes. Products are tested and analyzed before and after refilling in our state-of-the-art laboratory.', order: 4, isActive: true },
          { id: 5, tabId: 'safety', title: 'Dedicated Storage Facilities', description: 'Each product has a dedicated, secure storage facility approved by Facilities that maintains 100% compliance with required regulations and is equipped with the best safety devices.', order: 1, isActive: true },
          { id: 6, tabId: 'safety', title: 'ISO Certification', description: 'Certified with ISO 14001:2015. Products are tested and analyzed for gas purity and moisture content before and after filling, ensuring the quality of both our cylinders and customers\' cylinders before filling.', order: 2, isActive: true },
          { id: 7, tabId: 'safety', title: 'Quality Refilling', description: 'At Refex, quality and safety are paramount. Every gas cylinder is stored in PESO and PCB-approved facilities and undergoes rigorous testing in our ISO 14001:2015 certified in-house lab. We ensure each product meets strict purity and moisture standards before and after refilling, using top-grade fabricators and adhering to full regulatory compliance for safe, reliable refilling.', order: 3, isActive: true },
          { id: 8, tabId: 'safety', title: 'Cylinder Refurbishment', description: 'Takes special precautions for cylinders. Our refurbishment system is a benchmark in the industry, including internal cleaning, internal drying, removal of old paint and repainting on every rotation, and valve replacement.', order: 4, isActive: true },
          { id: 9, tabId: 'applications', title: '', description: 'Commercial & Domestic Refrigeration', order: 1, isActive: true },
          { id: 10, tabId: 'applications', title: '', description: 'Commercial & Domestic Air Conditioning', order: 2, isActive: true },
          { id: 11, tabId: 'applications', title: '', description: 'Chillers for Buildings & Large Systems', order: 3, isActive: true },
          { id: 12, tabId: 'applications', title: '', description: 'Automotive Air Conditioning', order: 4, isActive: true },
          { id: 13, tabId: 'applications', title: '', description: 'Industrial Refrigeration', order: 5, isActive: true },
          { id: 14, tabId: 'applications', title: '', description: 'Cold Storage Refrigeration', order: 6, isActive: true },
          { id: 15, tabId: 'applications', title: '', description: 'Food Processing', order: 7, isActive: true },
          { id: 16, tabId: 'applications', title: '', description: 'Aerosol Propellants', order: 8, isActive: true },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getImage = () => {
    const currentTab = tabs.find(t => t.tabId === activeTab);
    const fallback = 'https://refex.co.in/wp-content/uploads/2024/12/product-quality-img.jpg';
    return getFullUrl(currentTab?.image || fallback);
  };

  const getPointsForTab = (tabId: string) => {
    return points
      .filter(p => p.tabId === tabId && p.isActive)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  if (loading) {
    return (
      <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center py-10 sm:py-16 lg:py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading product tabs...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (tabs.length === 0) {
    return null;
  }

  const currentTabPoints = getPointsForTab(activeTab);
  const currentTab = tabs.find(t => t.tabId === activeTab);

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
      {/* Desktop Tabs */}
        <div className="hidden md:block">
          <div className="flex justify-center gap-4 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.tabId)}
                className={`font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer relative group ${
                  activeTab === tab.tabId
                    ? ''
                    : ''
                }`}
                style={{
                  padding: '15px 50px',
                  fontSize: '24px',
                  color: '#1f1f1f',
                  backgroundColor: activeTab === tab.tabId ? '#f3f3f3' : 'transparent'
                }}
              >
                {tab.label}
                {activeTab !== tab.tabId && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#7dc144] transition-all duration-300 group-hover:w-full"></span>
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div>
              {currentTab?.image && (
                <img
                  src={getFullUrl(currentTab.image)}
                  alt={currentTab.label}
                  className="w-full h-auto rounded-lg shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                  }}
                />
              )}
            </div>

            {/* Right - Content */}
            <div>
              {currentTabPoints.length > 0 && (
                <div className="space-y-6">
                  {currentTabPoints.map((point) => (
                    <div key={point.id} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <i className="ri-arrow-right-s-line text-2xl text-[#7cd244]"></i>
                      </div>
                      <div>
                        {point.title && (
                          <h3 className="font-bold mb-2" style={{ fontSize: '21px', color: '#1f1f1f' }}>
                            {point.title}
                          </h3>
                        )}
                        {point.description && (
                          <p className="leading-relaxed" style={{ 
                            fontSize: activeTab === 'applications' ? '21px' : '18px', 
                            color: '#000000',
                            fontWeight: activeTab === 'applications' ? 'bold' : 'normal'
                          }}>
                            {point.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden space-y-4">
          {tabs.map((tab) => {
            const tabPoints = getPointsForTab(tab.tabId);
            return (
              <div key={tab.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveTab(activeTab === tab.tabId ? '' : tab.tabId)}
                  className="w-full px-6 py-4 bg-gray-50 text-left font-semibold text-gray-900 flex items-center justify-between cursor-pointer"
                >
                  {tab.label}
                  <i className={`ri-arrow-${activeTab === tab.tabId ? 'up' : 'down'}-s-line text-xl`}></i>
                </button>
                
                {activeTab === tab.tabId && (
                  <div className="p-6 bg-white">
                    {tab.image && (
                      <div className="mb-6">
                        <img
                          src={getFullUrl(tab.image)}
                          alt={tab.label}
                          className="w-full h-auto rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                          }}
                        />
                      </div>
                    )}
                    
                    {tabPoints.length > 0 && (
                      <div className="space-y-6">
                        {tabPoints.map((point) => (
                          <div key={point.id} className="flex gap-4">
                            <div className="flex-shrink-0">
                              <i className="ri-arrow-right-s-line text-2xl text-[#7cd244]"></i>
                            </div>
                            <div>
                              {point.title && (
                                <h3 className="font-bold mb-2" style={{ fontSize: '21px', color: '#1f1f1f' }}>
                                  {point.title}
                                </h3>
                              )}
                              {point.description && (
                                <p className="leading-relaxed" style={{ 
                                  fontSize: tab.tabId === 'applications' ? '21px' : '18px', 
                                  color: '#000000',
                                  fontWeight: tab.tabId === 'applications' ? 'bold' : 'normal'
                                }}>
                                  {point.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
