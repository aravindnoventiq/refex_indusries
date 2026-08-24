import AdminCmsShell from '../components/AdminCmsShell';
import HeaderCMS from '../components/HeaderCMS';

export default function HeaderCMSPage() {
  return (
    <AdminCmsShell
      title="Header CMS"
      subtitle="Manage header logo, navigation, stock info, and contact button"
    >
      <HeaderCMS />
    </AdminCmsShell>
  );
}
