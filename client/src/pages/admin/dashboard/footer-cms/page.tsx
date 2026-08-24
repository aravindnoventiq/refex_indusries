import AdminCmsShell from '../components/AdminCmsShell';
import FooterCMS from '../components/FooterCMS';

export default function FooterCMSPage() {
  return (
    <AdminCmsShell
      title="Footer CMS"
      subtitle="Manage footer sections, links, social media, and contact information"
    >
      <FooterCMS />
    </AdminCmsShell>
  );
}
