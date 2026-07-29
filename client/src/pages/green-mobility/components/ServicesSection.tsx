import { useState, useEffect } from 'react';
import { greenMobilityCmsApi } from '../../../services/api';
import { getPlaceholderImage } from '../../../utils/placeholder';

interface Service {
  id: number;
  title: string;
  image?: string;
  imagePosition: 'left' | 'right';
  subtitle?: string;
  pointsJson?: string[];
  order: number;
  isActive: boolean;
}

function ServicesSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await greenMobilityCmsApi.getServices();
        const activeServices = (data || [])
          .filter((item: Service) => item.isActive)
          .sort((a: Service, b: Service) => (a.order || 0) - (b.order || 0));
        setServices(activeServices);
        // Set default active tab to first service if available
        if (activeServices.length > 0) {
          setActiveTab(0);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
        // Fallback to default data if API fails
        setServices([
          {
            id: 1,
            title: 'Reliable Transport Solution',
            image: 'https://refex.co.in/wp-content/uploads/2024/12/rgml-reliable.png',
            imagePosition: 'left',
            subtitle: 'We provide bundled offerings –',
            pointsJson: [
              'Corporate transport solutions',
              'Complete in-house fleet management',
              'Technology-integrated operations',
              'Premium experience with well-trained, courteous chauffeurs',
              'End-to-end route mapping for transport efficiency',
              'Real-time, tech-driven vehicle monitoring',
              'Ensured employee safety and security'
            ],
            order: 1,
            isActive: true,
          },
          {
            id: 2,
            title: 'Leveraging Technology',
            image: 'https://refex.co.in/wp-content/uploads/2024/12/rgml-leverage.jpg',
            imagePosition: 'left',
            pointsJson: [
              'End-to-end monitoring via a command and control centre',
              'Battery Management System',
              'Exclusive App available for Commuters, Drivers, Corporate Supervisors',
              'Alerts and notifications, routing algorithms (safety measures), instant billing, etc.',
              'Analytics dashboard'
            ],
            order: 2,
            isActive: true,
          },
          {
            id: 3,
            title: 'Safety Guaranteed',
            image: 'https://refex.co.in/wp-content/uploads/2024/12/rgml-safety.jpg',
            imagePosition: 'left',
            subtitle: 'We ensure the complete safety of your employees and commuters and have in place a very robust protocol and practices.',
            pointsJson: [
              'Complete background verification of our drivers',
              'Highly trained and skilful chauffeurs',
              'Digital remote monitoring, speed governance, and GPS',
              'Regular medical screening and fitness checks of our Chauffeurs',
              'Regular behavioural training for our Chauffeurs to sensitize them on how to deal with the LGBT community, persons with special abilities, and elderly persons',
              'Swift action on complaints received through our helpline number'
            ],
            order: 3,
            isActive: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading services...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return null;
  }

  const currentService = services[activeTab];

  if (!currentService) {
    return null;
  }

  return (
    <div className="py-20 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop Tabs */}
        <div className="hidden md:block">
          <div className="flex w-full gap-4 mb-12">
            {services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => setActiveTab(index)}
                className={`flex-1 font-semibold transition-all whitespace-nowrap cursor-pointer relative group ${
                  activeTab === index
                    ? 'bg-[#e4e4e4] text-gray-900'
                    : 'text-gray-700'
                }`}
                style={{ padding: '15px 50px', fontSize: '24px' }}
              >
                {service.title}
                {activeTab !== index && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#7cd144] transition-all duration-300 group-hover:w-full"></span>
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {currentService.imagePosition === 'left' ? (
              <>
                <div 
                  className="order-1"
                  data-aos="fade-right"
                  data-aos-duration="800"
                  key={`image-${activeTab}`}
                >
                  {currentService.image && (
                    <div className="rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={currentService.image}
                        alt={currentService.title}
                        className="w-full h-[500px] object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x500?text=No+Image';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div 
                  className="order-2"
                  data-aos="fade-left"
                  data-aos-duration="800"
                  key={`content-${activeTab}`}
                >
                  <div className="space-y-6">
                    {currentService.subtitle && (
                      <h6 className="text-gray-700 leading-relaxed font-semibold" style={{ fontSize: '18px' }}>
                        {currentService.subtitle}
                      </h6>
                    )}
                    {Array.isArray(currentService.pointsJson) && currentService.pointsJson.length > 0 && (
                      <ul className="space-y-4">
                        {currentService.pointsJson.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                              <i className="ri-arrow-right-s-line text-xl" style={{ color: '#7cd144' }}></i>
                            </span>
                            <p className="text-gray-700 leading-relaxed flex-1" style={{ fontSize: '18px' }}>
                              {point}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div 
                  className="order-1"
                  data-aos="fade-right"
                  data-aos-duration="800"
                  key={`content-${activeTab}`}
                >
                  <div className="space-y-6">
                    {currentService.subtitle && (
                      <h6 className="text-gray-700 leading-relaxed font-semibold" style={{ fontSize: '18px' }}>
                        {currentService.subtitle}
                      </h6>
                    )}
                    {Array.isArray(currentService.pointsJson) && currentService.pointsJson.length > 0 && (
                      <ul className="space-y-4">
                        {currentService.pointsJson.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                              <i className="ri-arrow-right-s-line text-xl" style={{ color: '#7cd144' }}></i>
                            </span>
                            <p className="text-gray-700 leading-relaxed flex-1" style={{ fontSize: '18px' }}>
                              {point}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div 
                  className="order-2"
                  data-aos="fade-left"
                  data-aos-duration="800"
                  key={`image-${activeTab}`}
                >
                  {currentService.image && (
                    <div className="rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={currentService.image}
                        alt={currentService.title}
                        className="w-full h-[500px] object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x500?text=No+Image';
                        }}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden space-y-4">
          {services.map((service, index) => (
            <div key={service.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <button
                onClick={() => setActiveTab(activeTab === index ? -1 : index)}
                className="w-full px-6 py-4 text-left font-semibold text-gray-900 flex items-center justify-between cursor-pointer"
              >
                {service.title}
                <i className={`ri-arrow-${activeTab === index ? 'up' : 'down'}-s-line text-xl`}></i>
              </button>
              
              {activeTab === index && (
                <div className="px-6 pb-6">
                  {service.image && (
                    <div className="mb-6">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-64 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getPlaceholderImage(400, 256, 'No Image');
                        }}
                      />
                    </div>
                  )}
                  <div className="space-y-4">
                    {service.subtitle && (
                      <h6 className="text-gray-700 leading-relaxed font-semibold" style={{ fontSize: '18px' }}>
                        {service.subtitle}
                      </h6>
                    )}
                    {Array.isArray(service.pointsJson) && service.pointsJson.length > 0 && (
                      <ul className="space-y-3">
                        {service.pointsJson.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <i className="ri-arrow-right-s-line text-lg" style={{ color: '#7cd144' }}></i>
                            </span>
                            <p className="text-gray-700 leading-relaxed text-sm flex-1" style={{ fontSize: '18px' }}>
                              {point}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServicesSection;
