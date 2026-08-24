import { useState } from 'react';
import AdminCmsShell from '../components/AdminCmsShell';
import AdminCmsTabs from '../components/AdminCmsTabs';
import GreenMobilityHeroSectionCMS from '../components/GreenMobilityHeroSectionCMS';
import GreenMobilityWhoWeAreSectionCMS from '../components/GreenMobilityWhoWeAreSectionCMS';
import GreenMobilityBrandValuesSectionCMS from '../components/GreenMobilityBrandValuesSectionCMS';
import GreenMobilityWhyChooseUsSectionCMS from '../components/GreenMobilityWhyChooseUsSectionCMS';
import GreenMobilityServicesSectionCMS from '../components/GreenMobilityServicesSectionCMS';
import GreenMobilityOurImpactSectionCMS from '../components/GreenMobilityOurImpactSectionCMS';
import GreenMobilityOurServicesSectionCMS from '../components/GreenMobilityOurServicesSectionCMS';
import GreenMobilityClientsSectionCMS from '../components/GreenMobilityClientsSectionCMS';
import GreenMobilitySustainabilitySectionCMS from '../components/GreenMobilitySustainabilitySectionCMS';
import GreenMobilityTestimonialsSectionCMS from '../components/GreenMobilityTestimonialsSectionCMS';

const TABS = [
  { id: 'hero', label: 'Hero', icon: 'ri-image-line' },
  { id: 'whoweare', label: 'Who We Are', icon: 'ri-team-line' },
  { id: 'brandvalues', label: 'Brand Values', icon: 'ri-heart-line' },
  { id: 'whychooseus', label: 'Why Choose Us', icon: 'ri-star-line' },
  { id: 'services', label: 'Services', icon: 'ri-service-line' },
  { id: 'ourimpact', label: 'Our Impact', icon: 'ri-bar-chart-line' },
  { id: 'ourservices', label: 'Our Services', icon: 'ri-list-check' },
  { id: 'clients', label: 'Clients', icon: 'ri-group-line' },
  { id: 'sustainability', label: 'Sustainability', icon: 'ri-leaf-line' },
  { id: 'testimonials', label: 'Testimonials', icon: 'ri-chat-quote-line' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function GreenMobilityCMSPage() {
  const [activeTab, setActiveTab] = useState<TabId>('hero');

  return (
    <AdminCmsShell title="Green Mobility Page CMS" subtitle="Manage Green Mobility page sections">
      <AdminCmsTabs tabs={[...TABS]} activeId={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
      {activeTab === 'hero' && <GreenMobilityHeroSectionCMS />}
      {activeTab === 'whoweare' && <GreenMobilityWhoWeAreSectionCMS />}
      {activeTab === 'brandvalues' && <GreenMobilityBrandValuesSectionCMS />}
      {activeTab === 'whychooseus' && <GreenMobilityWhyChooseUsSectionCMS />}
      {activeTab === 'services' && <GreenMobilityServicesSectionCMS />}
      {activeTab === 'ourimpact' && <GreenMobilityOurImpactSectionCMS />}
      {activeTab === 'ourservices' && <GreenMobilityOurServicesSectionCMS />}
      {activeTab === 'clients' && <GreenMobilityClientsSectionCMS />}
      {activeTab === 'sustainability' && <GreenMobilitySustainabilitySectionCMS />}
      {activeTab === 'testimonials' && <GreenMobilityTestimonialsSectionCMS />}
    </AdminCmsShell>
  );
}
