import { useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CMS_MODULES, SITE_PAGES } from './cmsModules';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

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
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CMS Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {user?.first_name || user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-600">Public pages with CMS</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{SITE_PAGES.length}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-600">Signed in as</p>
            <p className="mt-1 truncate text-lg font-semibold text-gray-900">{user?.email}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-600">Role</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{user?.role || user?.user_type || 'Admin'}</p>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Site CMS</h2>
            <p className="mt-1 text-sm text-gray-600">
              Edit every public page from one place. Changes publish to the live site after save.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <button
                key={module.href}
                type="button"
                onClick={() => navigate(module.href)}
                className={`rounded-lg border-2 border-gray-200 p-4 text-left transition-colors ${module.hover}`}
              >
                <i className={`${module.icon} mb-2 text-2xl`} />
                <h3 className="font-semibold text-gray-900">{module.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{module.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">All public pages</h2>
            <p className="mt-1 text-sm text-gray-600">Every live page maps to a CMS editor.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 font-medium">Page</th>
                  <th className="px-6 py-3 font-medium">URL</th>
                  <th className="px-6 py-3 font-medium">CMS</th>
                </tr>
              </thead>
              <tbody>
                {SITE_PAGES.map((page) => (
                  <tr key={page.path} className="border-t border-gray-100">
                    <td className="px-6 py-3 font-medium text-gray-900">{page.name}</td>
                    <td className="px-6 py-3 text-gray-600">{page.path}</td>
                    <td className="px-6 py-3">
                      <button
                        type="button"
                        onClick={() => navigate(page.cms)}
                        className="font-medium text-blue-600 hover:underline"
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
      </main>
    </div>
  );
}
