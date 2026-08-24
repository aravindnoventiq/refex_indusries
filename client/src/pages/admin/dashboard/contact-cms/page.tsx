import { useState } from 'react';
import AdminCmsShell from '../components/AdminCmsShell';
import AdminCmsTabs from '../components/AdminCmsTabs';
import ContactHeroSectionCMS from '../components/ContactHeroSectionCMS';
import ContactOfficeAddressesCMS from '../components/ContactOfficeAddressesCMS';
import ContactFormCMS from '../components/ContactFormCMS';

const TABS = [
  { id: 'hero', label: 'Hero', icon: 'ri-image-line' },
  { id: 'office-addresses', label: 'Office Addresses', icon: 'ri-map-pin-line' },
  { id: 'form', label: 'Contact Form', icon: 'ri-mail-line' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function ContactCMSPage() {
  const [activeTab, setActiveTab] = useState<TabId>('hero');

  return (
    <AdminCmsShell title="Contact Page CMS" subtitle="Manage Contact page sections">
      <AdminCmsTabs tabs={[...TABS]} activeId={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
      {activeTab === 'hero' && <ContactHeroSectionCMS />}
      {activeTab === 'office-addresses' && <ContactOfficeAddressesCMS />}
      {activeTab === 'form' && <ContactFormCMS />}
    </AdminCmsShell>
  );
}
