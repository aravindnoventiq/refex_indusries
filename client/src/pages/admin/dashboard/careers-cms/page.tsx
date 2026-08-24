import { useState } from 'react';
import AdminCmsShell from '../components/AdminCmsShell';
import AdminCmsTabs from '../components/AdminCmsTabs';
import CareersPageCMS from '../components/CareersPageCMS';

const TABS = [
  { id: 'hero', label: 'Hero', icon: 'ri-image-line' },
  { id: 'life', label: 'Life at Refex', icon: 'ri-group-line' },
  { id: 'why', label: 'Why Choose Refex', icon: 'ri-star-line' },
  { id: 'talent', label: 'Talent Network', icon: 'ri-user-add-line' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function CareersCMSPage() {
  const [activeTab, setActiveTab] = useState<TabId>('hero');

  return (
    <AdminCmsShell title="Careers Page CMS" subtitle="Manage Careers page sections">
      <AdminCmsTabs tabs={[...TABS]} activeId={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
      <CareersPageCMS activeTab={activeTab} />
    </AdminCmsShell>
  );
}
