import { useState } from 'react';
import AdminCmsShell from '../components/AdminCmsShell';
import AdminCmsTabs from '../components/AdminCmsTabs';
import EsgPoliciesSectionCMS from '../components/EsgPoliciesSectionCMS';
import EsgReportsSectionCMS from '../components/EsgReportsSectionCMS';
import EsgSdgSectionCMS from '../components/EsgSdgSectionCMS';
import EsgUnsdgActionsSectionCMS from '../components/EsgUnsdgActionsSectionCMS';
import EsgAwardsSectionCMS from '../components/EsgAwardsSectionCMS';
import EsgCollaborationSectionCMS from '../components/EsgCollaborationSectionCMS';
import EsgGovernanceSectionCMS from '../components/EsgGovernanceSectionCMS';
import EsgHRSectionCMS from '../components/EsgHRSectionCMS';

const TABS = [
  { id: 'policies', label: 'Policies', icon: 'ri-file-list-3-line' },
  { id: 'reports', label: 'Reports', icon: 'ri-file-chart-line' },
  { id: 'sdg', label: 'SDG Copy', icon: 'ri-earth-line' },
  { id: 'unsdgactions', label: 'UNSDG Actions', icon: 'ri-flag-line' },
  { id: 'awards', label: 'Awards', icon: 'ri-award-line' },
  { id: 'collaboration', label: 'Collaboration', icon: 'ri-handshake-line' },
  { id: 'governance', label: 'Governance', icon: 'ri-government-line' },
  { id: 'hr', label: 'HR', icon: 'ri-user-heart-line' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function EsgCMSPage() {
  const [activeTab, setActiveTab] = useState<TabId>('policies');

  return (
    <AdminCmsShell title="ESG Page CMS" subtitle="Manage ESG page sections">
      <AdminCmsTabs tabs={[...TABS]} activeId={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
      {activeTab === 'policies' && <EsgPoliciesSectionCMS />}
      {activeTab === 'reports' && <EsgReportsSectionCMS />}
      {activeTab === 'sdg' && <EsgSdgSectionCMS />}
      {activeTab === 'unsdgactions' && <EsgUnsdgActionsSectionCMS />}
      {activeTab === 'awards' && <EsgAwardsSectionCMS />}
      {activeTab === 'collaboration' && <EsgCollaborationSectionCMS />}
      {activeTab === 'governance' && <EsgGovernanceSectionCMS />}
      {activeTab === 'hr' && <EsgHRSectionCMS />}
    </AdminCmsShell>
  );
}
