import { useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CMS_MODULE_GROUPS, CMS_MODULES, SITE_PAGES } from './cmsModules';
import AdminCmsShell from './components/AdminCmsShell';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.user_type === 'InvestorsCMS') {
      navigate('/admin/dashboard/investors-cms', { replace: true });
    }
  }, [user, navigate]);

  const modules =
    user?.user_type === 'InvestorsCMS'
      ? CMS_MODULES.filter((module) => module.href.includes('investors-cms'))
      : CMS_MODULES;

  return (
    <AdminCmsShell
      title="CMS Dashboard"
      subtitle={`Welcome back, ${user?.first_name || user?.email || 'Admin'}`}
      showBack={false}
    >
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[#d9e2d4] bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-[#5c6658]">Public pages with CMS</p>
          <p className="mt-1 text-2xl font-bold text-[#1f1f1f]">{SITE_PAGES.length}</p>
        </div>
        <div className="rounded-lg border border-[#d9e2d4] bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-[#5c6658]">Signed in as</p>
          <p className="mt-1 truncate text-lg font-semibold text-[#1f1f1f]">{user?.email}</p>
        </div>
        <div className="rounded-lg border border-[#d9e2d4] bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-[#5c6658]">Role</p>
          <p className="mt-1 text-lg font-semibold text-[#1f1f1f]">{user?.role || user?.user_type || 'Admin'}</p>
        </div>
      </div>

      <div className="space-y-8">
        {CMS_MODULE_GROUPS.map((group) => {
          const groupModules = modules.filter((module) => module.group === group.id);
          if (groupModules.length === 0) return null;

          return (
            <section key={group.id} className="overflow-hidden rounded-lg border border-[#d9e2d4] bg-white shadow-sm">
              <div className="border-b border-[#d9e2d4] px-6 py-5">
                <h2 className="text-xl font-bold text-[#1f1f1f]">{group.label}</h2>
                <p className="mt-1 text-sm text-[#5c6658]">{group.description}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
                {groupModules.map((module) => (
                  <button
                    key={module.href}
                    type="button"
                    onClick={() => navigate(module.href)}
                    className="rounded-lg border border-[#d9e2d4] p-4 text-left transition-colors hover:border-[#7cd244] hover:bg-[#7cd244]/10"
                  >
                    <i className={`${module.icon} mb-2 text-2xl text-[#7cd244]`} />
                    <h3 className="font-semibold text-[#1f1f1f]">{module.name}</h3>
                    <p className="mt-1 text-sm text-[#5c6658]">{module.description}</p>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-[#d9e2d4] bg-white shadow-sm">
        <div className="border-b border-[#d9e2d4] px-6 py-5">
          <h2 className="text-xl font-bold text-[#1f1f1f]">All public pages</h2>
          <p className="mt-1 text-sm text-[#5c6658]">Every live page maps to a CMS editor.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f4f6f3] text-[#5c6658]">
              <tr>
                <th className="px-6 py-3 font-medium">Page</th>
                <th className="px-6 py-3 font-medium">URL</th>
                <th className="px-6 py-3 font-medium">CMS</th>
              </tr>
            </thead>
            <tbody>
              {SITE_PAGES.map((page) => (
                <tr key={page.path} className="border-t border-[#e8eee4]">
                  <td className="px-6 py-3 font-medium text-[#1f1f1f]">{page.name}</td>
                  <td className="px-6 py-3 text-[#5c6658]">{page.path}</td>
                  <td className="px-6 py-3">
                    <button
                      type="button"
                      onClick={() => navigate(page.cms)}
                      className="font-medium text-[#4f8f2a] hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminCmsShell>
  );
}
