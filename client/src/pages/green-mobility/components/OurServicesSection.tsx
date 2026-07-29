import { useState, useEffect } from 'react';
import { greenMobilityCmsApi } from '../../../services/api';
import scanQrCode from '../../../../public/Qr.png';

interface Feature {
  icon: string;
  title: string;
}

interface RideType {
  icon: string;
  title: string;
}

interface Button {
  text: string;
  link: string;
}

interface OurService {
  id: number;
  title: string;
  image?: string;
  description?: string;
  additionalText?: string;
  featuresJson?: Feature[];
  rideTypesJson?: RideType[];
  citiesJson?: string[];
  buttonsJson?: Button[];
  order: number;
  isActive: boolean;
}

export default function OurServicesSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [services, setServices] = useState<OurService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string>('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await greenMobilityCmsApi.getOurServices();
      const activeServices = (data || []).filter((service: OurService) => service.isActive);
      setServices(activeServices);
      // Reset active tab if current tab is out of bounds
      if (activeTab >= activeServices.length) {
        setActiveTab(0);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
      // Fallback to default data
      setServices([
        {
          id: 1,
          title: 'EMPLOYEE TRANSPORTATION',
          image: 'https://refex.co.in/wp-content/uploads/2024/12/rgml-reliable.png',
          description: 'Our Employee Transfer service provides efficient and reliable transportation with multiple customizable models designed to meet the unique needs of each organization. Our employee commute service ensures a safe and seamless experience with clean cars and verified, professional drivers.',
          additionalText: 'We are the most preferred mobility partner for leading MNCs, helping them transition to cleaner mobility solutions that align with their sustainability goals.',
          featuresJson: [
            { icon: 'ri-money-dollar-circle-line', title: 'Cost Savings' },
            { icon: 'ri-calendar-check-line', title: 'Easy Booking' },
            { icon: 'ri-map-pin-line', title: 'Live-Tracking' },
          ],
          order: 0,
          isActive: true,
        },
        {
          id: 2,
          title: 'ON-CALL / ON-DEMAND RIDES',
          image: 'https://refex.co.in/wp-content/uploads/2024/12/rgml-reliable.png',
          description: 'Refex Green Mobility offers flexible and customizable on-call ride packages for corporates and events designed to meet varying distance and time requirements. Choose from options such as 4hr/40km, 8hr/80km, or 10hr/100km, with the ability to tailor services based on your specific needs.',
          rideTypesJson: [
            { icon: 'ri-car-line', title: 'LOCAL RIDES' },
            { icon: 'ri-plane-line', title: 'AIRPORT RIDES' },
          ],
          citiesJson: ['Chennai', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Delhi'],
          order: 1,
          isActive: true,
        },
        {
          id: 3,
          title: 'CORPORATE AIRPORT TRANSFERS',
          image: 'https://refex.co.in/wp-content/uploads/2024/12/rgml-reliable.png',
          description: 'Individual travellers can conveniently book airport rides through the Refex Mobility app and Website for a hassle-free experience. Available in Chennai, Bangalore, Mumbai, Hyderabad, Delhi.',
          additionalText: 'Individual travelers can conveniently book airport rides through the Refex eVeelz app and Website for a hassle free experience.',
          buttonsJson: [
            { text: 'Download App', link: 'https://refex.co.in/wp-content/uploads/2024/12/Qr-code-eveelz.png' },
            { text: 'Book Airport Taxi', link: 'https://booking.eveelz.in/' },
          ],
          order: 2,
          isActive: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20" style={{ backgroundColor: '#f3f3f3' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </section>
    );
  }

  const sortedServices = [...services].sort((a, b) => (a.order || 0) - (b.order || 0));

  if (sortedServices.length === 0) {
    return (
      <section className="py-20" style={{ backgroundColor: '#f3f3f3' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            No services available.
          </div>
      </section>
    );
  }

  return (
    <section className="py-20" style={{ backgroundColor: '#f3f3f3' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
          <h2 className="font-bold mb-4 uppercase" style={{ fontSize: '34px', color: '#1f1f1f', lineHeight: '1.68' }}>Our Services</h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {sortedServices.map((service, index) => (
            <button
              key={service.id}
              onClick={() => setActiveTab(index)}
              className={`px-8 py-4 font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                activeTab === index
                  ? 'bg-[#7dc144] text-white'
                  : 'hover:bg-[#7dc144] hover:text-white'
              }`}
              style={{ 
                borderRadius: '9999px',
                fontSize: '17px',
                color: activeTab === index ? '#ffffff' : '#1f1f1f'
              }}
            >
              {service.title}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white">
          {sortedServices.map((service, index) => (
            <div
              key={service.id}
              className={`${activeTab === index ? 'block' : 'hidden'}`}
            >
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${index === 1 ? 'items-start' : 'items-center'}`}>
                {/* Image */}
                <div className={index === 1 ? 'order-2 lg:order-2' : 'order-2 lg:order-1'}>
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`${index === 1 ? 'order-1 lg:order-1' : 'order-1 lg:order-2'} flex flex-col justify-start px-6 py-8 lg:px-8 lg:py-12`}>
                  <div className="space-y-6">
                    {service.description && (
                      <p className="leading-relaxed" style={{ fontSize: '16px', color: '#484848' }}>
                        {service.description}
                      </p>
                    )}

                    {service.additionalText && (
                      <p className="leading-relaxed" style={{ fontSize: '16px', color: '#484848' }}>
                        {service.additionalText}
                      </p>
                    )}

                    {/* Features for Employee Transportation */}
                    {service.featuresJson && service.featuresJson.length > 0 && (
                      <div className="space-y-4 mt-8">
                        {service.featuresJson.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#14B8A6]/10 flex items-center justify-center flex-shrink-0">
                              <i className={`${feature.icon} text-2xl`} style={{ color: '#7dc144' }}></i>
                            </div>
                            <h3 className="font-semibold" style={{ fontSize: '17px', color: '#3f3f3f' }}>
                              {feature.title}
                            </h3>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Ride Types for On-Call Rides */}
                    {service.rideTypesJson && service.rideTypesJson.length > 0 && (
                      <div className="space-y-6 mt-8">
                        <div className="flex flex-wrap gap-4">
                          {service.rideTypesJson.map((type, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-lg"
                            >
                              <i className={`${type.icon} text-xl`} style={{ color: '#7dc144' }}></i>
                              <span className="font-semibold text-gray-900">
                                {type.title}
                              </span>
                            </div>
                          ))}
                        </div>

                        {service.citiesJson && service.citiesJson.length > 0 && (
                          <div className="mt-6">
                            <h4 className="font-semibold mb-4" style={{ fontSize: '22px', color: '#7dc144' }}>
                              Available In Major Cities
                            </h4>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                              {service.citiesJson.map((city, idx) => (
                                <span
                                  key={idx}
                                  className="font-medium rounded"
                                  style={{ 
                                    backgroundColor: '#83E03461',
                                    color: '#429100',
                                    fontSize: '18px',
                                    padding: '11px 25px',
                                    textAlign: 'center'
                                  }}
                                >
                                  {city}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Buttons for Airport Transfers */}
                    {service.buttonsJson && service.buttonsJson.length > 0 && (
                      <div className="flex flex-wrap gap-4 mt-8">
                        {service.buttonsJson.map((button, idx) => {
                          const isDownloadApp = button.text.toLowerCase().includes('download app');
                          
                          if (isDownloadApp) {
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  setModalImageUrl(button.link);
                                  setShowModal(true);
                                }}
                                className="group inline-flex items-center gap-2 px-8 py-4 text-white font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer"
                                style={{ backgroundColor: '#7dc144', borderRadius: '5px' }}
                              >
                                {button.text}
                                <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1"></i>
                              </button>
                            );
                          }
                          
                          return (
                            <a
                              key={idx}
                              href={button.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-2 px-8 py-4 text-white font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer"
                              style={{ backgroundColor: '#7dc144', borderRadius: '5px' }}
                            >
                              {button.text}
                              <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1"></i>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-2 shadow-lg"
              aria-label="Close modal"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
            
            {/* QR Code Image */}
            <div className="p-4">
              <img
                src={scanQrCode}
                alt="Download App QR Code"
                className="w-full h-auto rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
