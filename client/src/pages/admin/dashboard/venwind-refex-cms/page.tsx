import { useState } from 'react';
import AdminCmsShell from '../components/AdminCmsShell';
import AdminCmsTabs from '../components/AdminCmsTabs';
import VenwindRefexHeroSectionCMS from '../components/VenwindRefexHeroSectionCMS';
import VenwindRefexWhoWeAreSectionCMS from '../components/VenwindRefexWhoWeAreSectionCMS';
import VenwindRefexWhyChooseUsSectionCMS from '../components/VenwindRefexWhyChooseUsSectionCMS';
import VenwindRefexTechnicalSpecsSectionCMS from '../components/VenwindRefexTechnicalSpecsSectionCMS';
import VenwindRefexVisitWebsiteSectionCMS from '../components/VenwindRefexVisitWebsiteSectionCMS';

const TABS = [
  { id: 'hero', label: 'Hero', icon: 'ri-image-line' },
  { id: 'whoweare', label: 'Who We Are', icon: 'ri-team-line' },
  { id: 'whychooseus', label: 'Why Choose Us', icon: 'ri-star-line' },
  { id: 'technicalspecs', label: 'Technical Specs', icon: 'ri-settings-3-line' },
  { id: 'visitwebsite', label: 'Visit Website', icon: 'ri-external-link-line' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function VenwindRefexCMSPage() {
  const [activeTab, setActiveTab] = useState<TabId>('hero');

  return (
    <AdminCmsShell title="Venwind Refex Page CMS" subtitle="Manage Venwind Refex page sections">
      <AdminCmsTabs tabs={[...TABS]} activeId={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
      {activeTab === 'hero' && <VenwindRefexHeroSectionCMS />}
      {activeTab === 'whoweare' && <VenwindRefexWhoWeAreSectionCMS />}
      {activeTab === 'whychooseus' && <VenwindRefexWhyChooseUsSectionCMS />}
      {activeTab === 'technicalspecs' && <VenwindRefexTechnicalSpecsSectionCMS />}
      {activeTab === 'visitwebsite' && <VenwindRefexVisitWebsiteSectionCMS />}
    </AdminCmsShell>
  );
}
