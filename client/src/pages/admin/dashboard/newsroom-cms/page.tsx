import { useState } from 'react';
import AdminCmsShell from '../components/AdminCmsShell';
import AdminCmsTabs from '../components/AdminCmsTabs';
import NewsroomHeroSectionCMS from '../components/NewsroomHeroSectionCMS';
import NewsroomPressReleasesCMS from '../components/NewsroomPressReleasesCMS';
import NewsroomEventsCMS from '../components/NewsroomEventsCMS';
import NewsroomTabsCMS from '../components/NewsroomTabsCMS';

const TABS = [
  { id: 'hero', label: 'Hero', icon: 'ri-image-line' },
  { id: 'press-releases', label: 'Press Releases', icon: 'ri-newspaper-line' },
  { id: 'events', label: 'Events', icon: 'ri-calendar-event-line' },
  { id: 'tabs', label: 'Tabs', icon: 'ri-folder-line' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function NewsroomCMSPage() {
  const [activeTab, setActiveTab] = useState<TabId>('hero');

  return (
    <AdminCmsShell title="Newsroom Page CMS" subtitle="Manage Newsroom page sections">
      <AdminCmsTabs tabs={[...TABS]} activeId={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
      {activeTab === 'hero' && <NewsroomHeroSectionCMS />}
      {activeTab === 'press-releases' && <NewsroomPressReleasesCMS />}
      {activeTab === 'events' && <NewsroomEventsCMS />}
      {activeTab === 'tabs' && <NewsroomTabsCMS />}
    </AdminCmsShell>
  );
}
