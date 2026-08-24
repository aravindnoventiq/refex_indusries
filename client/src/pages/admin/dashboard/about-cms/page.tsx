import { useState } from 'react';
import AdminCmsShell from '../components/AdminCmsShell';
import AdminCmsTabs from '../components/AdminCmsTabs';
import AboutPageSectionCMS from '../components/AboutPageSectionCMS';
import MissionVisionSectionCMS from '../components/MissionVisionSectionCMS';
import CoreValuesSectionCMS from '../components/CoreValuesSectionCMS';
import BoardMembersSectionCMS from '../components/BoardMembersSectionCMS';
import CommitteesSectionCMS from '../components/CommitteesSectionCMS';
import LeadershipTeamSectionCMS from '../components/LeadershipTeamSectionCMS';
import OurPresenceSectionCMS from '../components/OurPresenceSectionCMS';
import JourneySectionCMS from '../components/JourneySectionCMS';

const TABS = [
  { id: 'aboutsection', label: 'About Section', icon: 'ri-file-text-line' },
  { id: 'missionvision', label: 'Vision & Mission', icon: 'ri-eye-line' },
  { id: 'corevalues', label: 'Core Values', icon: 'ri-star-line' },
  { id: 'boardmembers', label: 'Board Members', icon: 'ri-team-line' },
  { id: 'committees', label: 'Committees', icon: 'ri-group-line' },
  { id: 'leadershipteam', label: 'Leadership Team', icon: 'ri-user-star-line' },
  { id: 'presence', label: 'Our Presence', icon: 'ri-map-pin-line' },
  { id: 'journey', label: 'Journey', icon: 'ri-roadmap-line' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function AboutCMSPage() {
  const [activeTab, setActiveTab] = useState<TabId>('aboutsection');

  return (
    <AdminCmsShell title="About Us Page CMS" subtitle="Manage About Us page sections">
      <AdminCmsTabs tabs={[...TABS]} activeId={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
      {activeTab === 'aboutsection' && <AboutPageSectionCMS />}
      {activeTab === 'missionvision' && <MissionVisionSectionCMS />}
      {activeTab === 'corevalues' && <CoreValuesSectionCMS />}
      {activeTab === 'boardmembers' && <BoardMembersSectionCMS />}
      {activeTab === 'committees' && <CommitteesSectionCMS />}
      {activeTab === 'leadershipteam' && <LeadershipTeamSectionCMS />}
      {activeTab === 'presence' && <OurPresenceSectionCMS />}
      {activeTab === 'journey' && <JourneySectionCMS />}
    </AdminCmsShell>
  );
}
