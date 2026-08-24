import { useState } from 'react';
import AdminCmsShell from '../components/AdminCmsShell';
import AdminCmsTabs from '../components/AdminCmsTabs';
import AshUtilizationHeroSectionCMS from '../components/AshUtilizationHeroSectionCMS';
import AshUtilizationClientsSectionCMS from '../components/AshUtilizationClientsSectionCMS';

const TABS = [
  { id: 'hero', label: 'Hero', icon: 'ri-image-line' },
  { id: 'clients', label: 'Clients', icon: 'ri-group-line' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function AshUtilizationCMSPage() {
  const [activeTab, setActiveTab] = useState<TabId>('hero');

  return (
    <AdminCmsShell title="Ash Utilization Page CMS" subtitle="Manage Ash Utilization page sections">
      <AdminCmsTabs tabs={[...TABS]} activeId={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
      {activeTab === 'hero' && <AshUtilizationHeroSectionCMS />}
      {activeTab === 'clients' && <AshUtilizationClientsSectionCMS />}
    </AdminCmsShell>
  );
}
