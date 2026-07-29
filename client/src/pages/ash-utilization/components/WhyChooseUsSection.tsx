import { useState, useEffect, useRef } from 'react';
import { ashUtilizationCmsApi } from '../../../services/api';
import { AshSectionShell, AboutSpinner } from './AshSectionShell';
import { homeImageCard, homeVideoText } from '../../home/components/HomeSection';
import { gsap, animateAboutItems, prefersReducedMotion } from '../../about-us/aboutGsap';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

const FALLBACK_FEATURES: Feature[] = [
  {
    id: 1,
    icon: 'https://refex.co.in/wp-content/uploads/2024/12/superior-quality-2.png',
    title: 'Expertise in Managing Large-Scale Projects',
    description: 'Proven capability to handle complex operations efficiently.',
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    icon: 'https://refex.co.in/wp-content/uploads/2024/12/eco-friendly-2.png',
    title: 'Centralized Operations',
    description:
      'Digital work orders, sensor-based diesel management, centralized data collection, and GPS fleet tracking for seamless execution.',
    order: 2,
    isActive: true,
  },
  {
    id: 3,
    icon: 'https://refex.co.in/wp-content/uploads/2024/12/driver.png',
    title: 'Customer Centricity',
    description: 'Tailored solutions with transparent communication.',
    order: 3,
    isActive: true,
  },
  {
    id: 4,
    icon: 'https://refex.co.in/wp-content/uploads/2024/12/competitive-price-2.png',
    title: 'Safety & Compliance',
    description: 'Highest safety standards with full regulatory adherence.',
    order: 4,
    isActive: true,
  },
  {
    id: 5,
    icon: 'https://refex.co.in/wp-content/uploads/2024/12/money-currency.svg',
    title: 'Efficiency & Reliability',
    description: 'Fast, reliable ash services with minimal disruption.',
    order: 5,
    isActive: true,
  },
  {
    id: 6,
    icon: 'https://refex.co.in/wp-content/uploads/2024/12/cutting-edge-tech-2.png',
    title: 'Innovation & Adaptability',
    description: 'Adoption of new technologies and flexibility to evolving customer needs.',
    order: 6,
    isActive: true,
  },
  {
    id: 7,
    icon: 'https://refex.co.in/wp-content/uploads/2024/12/experience-2.png',
    title: 'Environmental Responsibility',
    description: 'Sustainable, regulation-compliant ash management practices.',
    order: 7,
    isActive: true,
  },
  {
    id: 8,
    icon: 'https://refex.co.in/wp-content/uploads/2024/12/competitive-price-2.png',
    title: 'Cost-Effective Solutions',
    description: 'Affordable services designed to meet power plant budgets.',
    order: 8,
    isActive: true,
  },
];

function WhyChooseUsSection() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const data = await ashUtilizationCmsApi.getFeatures();
        const activeFeatures = (data || [])
          .filter((item: Feature) => item.isActive)
          .sort((a: Feature, b: Feature) => (a.order || 0) - (b.order || 0));
        setFeatures(activeFeatures.length > 0 ? activeFeatures : FALLBACK_FEATURES);
      } catch {
        setFeatures(FALLBACK_FEATURES);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  useEffect(() => {
    if (loading || !gridRef.current) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      animateAboutItems(gridRef.current!, '[data-about-anim]', { y: 24, stagger: 0.06 });
    }, gridRef);

    return () => ctx.revert();
  }, [loading, features.length]);

  if (loading) {
    return (
      <div id="why-choose-us">
        <AboutSpinner />
      </div>
    );
  }

  if (features.length === 0) return null;

  return (
    <AshSectionShell
      id="why-choose-us"
      eyebrow="Strengths"
      title="Why Choose Us"
      headerAlign="center"
      subtitle="Technology-led operations, regulatory compliance, and scale across India's power sector."
    >
      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
      >
        {features.map((feature) => (
          <div
            key={feature.id}
            data-about-anim
            className={`group flex h-full flex-col p-5 sm:p-6 ${homeImageCard}`}
          >
            {feature.icon && (
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-[#f97316]/25 bg-[#f97316]/10 p-2 transition-colors group-hover:border-[#f97316]/45">
                <img
                  src={feature.icon}
                  alt=""
                  className="h-full w-full object-contain brightness-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/64x64?text=Icon';
                  }}
                />
              </div>
            )}
            <h3 className={`mb-2 ${homeVideoText.cardTitle}`}>{feature.title}</h3>
            <p className={`flex-1 ${homeVideoText.bodySm}`}>{feature.description}</p>
            <div className="mt-4 h-0.5 w-0 bg-[#f97316] transition-all duration-300 group-hover:w-10" />
          </div>
        ))}
      </div>
    </AshSectionShell>
  );
}

export default WhyChooseUsSection;
