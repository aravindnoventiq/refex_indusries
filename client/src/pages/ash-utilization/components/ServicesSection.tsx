import { useState, useEffect, useRef } from 'react';
import { ashUtilizationCmsApi } from '../../../services/api';
import { getPlaceholderImage } from '../../../utils/placeholder';
import { AshSectionShell, AboutSpinner } from './AshSectionShell';
import { ashContentGap } from '../ashLayout';
import { homeImageCard, homeVideoText } from '../../home/components/HomeSection';
import { gsap, animateAboutItems, prefersReducedMotion } from '../../about-us/aboutGsap';

interface Service {
  id: number;
  title: string;
  image?: string;
  imagePosition: 'left' | 'right';
  intro?: string;
  subtitle?: string;
  pointsJson?: string[];
  order: number;
  isActive: boolean;
}

const FALLBACK_SERVICES: Service[] = [
  {
    id: 1,
    title: 'Ash Utilisation',
    image: 'https://refex.co.in/wp-content/uploads/2025/06/supply-img01.jpg',
    imagePosition: 'left',
    intro:
      'Ash, if released into the atmosphere, can cause significant environmental harm. Refex plays a vital role in its safe and responsible utilisation by ensuring efficient transportation from plant silos and dykes to designated sites using trucks, hywas, bulkers, and rail rakes. The ash is then utilised at various locations in full compliance with regulatory standards.',
    subtitle:
      'With a strong focus on innovation and environmental stewardship, Refex continues to be a trusted partner in ash management solutions, supporting power plants through:',
    pointsJson: [
      'Extensive network of fleets and vendor partners',
      'Advanced tracking technology, sensors and equipment providing real-time information',
      'Customized solutions tailored to the needs of power plant operators.',
      'Comprehensive utilisation strategy for both Fly Ash and Pond Ash for each power plant',
      'Strong partnerships with cement companies, road concessionaires, brick manufacturers, mine operators and government agencies',
      '100% compliance to MOEF guidelines and Pollution Control Board standards',
    ],
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    title: 'Coal Supply and Handling',
    image: 'https://refex.co.in/wp-content/uploads/2025/06/supply-img02.jpg',
    imagePosition: 'right',
    intro:
      'Refex is dedicated to guaranteeing the seamless and efficient supply of coal to various power plants at competitive prices.',
    subtitle: 'We also provide comprehensive services for over burden excavation and coal yard management encompassing,',
    pointsJson: [
      'Coal handling Plant Room Operations',
      'Segregation of Coal and Stone',
      'Housekeeping',
      'Initial Crushing',
      'Management of Heavy Machinery',
      'Maintenance of CHP Equipment',
    ],
    order: 2,
    isActive: true,
  },
];

function ServiceContent({ service }: { service: Service }) {
  return (
    <div className={`space-y-5 ${homeVideoText.body}`}>
      {service.intro && <p>{service.intro}</p>}
      {service.subtitle && (
        <p className="font-semibold text-white/90">{service.subtitle}</p>
      )}
      {Array.isArray(service.pointsJson) && service.pointsJson.length > 0 && (
        <ul className="space-y-3">
          {service.pointsJson.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f97316]/15 text-[#f97316]">
                <i className="ri-arrow-right-s-line text-sm" />
              </span>
              <span className={homeVideoText.bodySm}>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ServicesSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await ashUtilizationCmsApi.getServices();
        const activeServices = (data || [])
          .filter((item: Service) => item.isActive)
          .sort((a: Service, b: Service) => (a.order || 0) - (b.order || 0));
        setServices(activeServices.length > 0 ? activeServices : FALLBACK_SERVICES);
      } catch {
        setServices(FALLBACK_SERVICES);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (loading || !panelRef.current) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animateAboutItems(panelRef.current!, '[data-about-anim]', { y: 24, stagger: 0.06 });
    }, panelRef);

    return () => ctx.revert();
  }, [loading, activeTab]);

  if (loading) {
    return (
      <div id="services">
        <AboutSpinner />
      </div>
    );
  }

  if (services.length === 0) return null;

  const currentService = services[activeTab];
  if (!currentService) return null;

  const imageBlock = currentService.image && (
    <div data-about-anim className={`overflow-hidden ${homeImageCard}`}>
      <img
        src={currentService.image}
        alt={currentService.title}
        className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            'https://via.placeholder.com/800x500?text=No+Image';
        }}
      />
    </div>
  );

  return (
    <AshSectionShell
      id="services"
      eyebrow="Capabilities"
      title="Our Services"
      headerAlign="center"
    >
      <div ref={panelRef}>
        <div
          data-about-anim
          className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-10 sm:gap-3 lg:mb-12"
        >
          {services.map((service, index) => (
            <button
              key={service.id}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-all sm:px-6 sm:text-base ${
                activeTab === index
                  ? 'border-[#f97316]/60 bg-[#f97316]/15 text-white shadow-[0_0_20px_-6px_rgba(249,115,22,0.5)]'
                  : 'border-white/15 bg-white/5 text-white/70 hover:border-white/25 hover:text-white'
              }`}
            >
              {service.title}
            </button>
          ))}
        </div>

        <div className={`hidden md:grid md:grid-cols-2 md:items-start ${ashContentGap}`}>
          {currentService.imagePosition === 'left' ? (
            <>
              {imageBlock}
              <div data-about-anim key={`content-${activeTab}`}>
                <ServiceContent service={currentService} />
              </div>
            </>
          ) : (
            <>
              <div data-about-anim key={`content-${activeTab}`}>
                <ServiceContent service={currentService} />
              </div>
              {imageBlock}
            </>
          )}
        </div>

        <div className="md:hidden">
          <div data-about-anim className={`mb-6 overflow-hidden ${homeImageCard}`}>
            {currentService.image && (
              <img
                src={currentService.image}
                alt={currentService.title}
                className="aspect-video w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getPlaceholderImage(400, 256, 'No Image');
                }}
              />
            )}
          </div>
          <ServiceContent service={currentService} />
        </div>
      </div>
    </AshSectionShell>
  );
}

export default ServicesSection;
