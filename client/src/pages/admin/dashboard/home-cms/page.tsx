import { useState } from 'react';
import AdminCmsShell from '../components/AdminCmsShell';
import AdminCmsTabs from '../components/AdminCmsTabs';
import BusinessSectionCMS from '../components/BusinessSectionCMS';
import AtGlanceSectionCMS from '../components/AtGlanceSectionCMS';
import FlipCardsSectionCMS from '../components/FlipCardsSectionCMS';
import NewsroomSectionCMS from '../components/NewsroomSectionCMS';
import AwardsSectionCMS from '../components/AwardsSectionCMS';

const TABS = [
  { id: 'business', label: 'Business', icon: 'ri-building-line' },
  { id: 'atglance', label: 'At a Glance', icon: 'ri-bar-chart-line' },
  { id: 'flipcards', label: 'Flip Cards', icon: 'ri-flip-horizontal-line' },
  { id: 'newsroom', label: 'Newsroom', icon: 'ri-newspaper-line' },
  { id: 'awards', label: 'Awards', icon: 'ri-award-line' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function HomeCMSPage() {
  const [activeTab, setActiveTab] = useState<TabId>('business');

  return (
    <AdminCmsShell title="Home Page CMS" subtitle="Manage home page sections">
      <AdminCmsTabs tabs={[...TABS]} activeId={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
      {activeTab === 'business' && <BusinessSectionCMS />}
      {activeTab === 'atglance' && <AtGlanceSectionCMS />}
      {activeTab === 'flipcards' && <FlipCardsSectionCMS />}
      {activeTab === 'newsroom' && <NewsroomSectionCMS />}
      {activeTab === 'awards' && <AwardsSectionCMS />}
    </AdminCmsShell>
  );
}
