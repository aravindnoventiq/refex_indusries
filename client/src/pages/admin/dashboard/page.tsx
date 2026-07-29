import { useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // If user is InvestorsCMS, redirect to investors-cms page
  useEffect(() => {
    if (user?.user_type === 'InvestorsCMS') {
      navigate('/admin/dashboard/investors-cms', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.first_name || user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <i className="ri-user-line text-2xl text-blue-600"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CMS Pages</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <i className="ri-file-text-line text-2xl text-green-600"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <i className="ri-box-3-line text-2xl text-purple-600"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">News & Events</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <i className="ri-newspaper-line text-2xl text-orange-600"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user?.user_type !== 'InvestorsCMS' && (
                <>
              <button
                onClick={() => navigate('/admin/dashboard/home-cms')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
              >
                <i className="ri-home-4-line text-2xl text-blue-600 mb-2"></i>
                <h3 className="font-semibold text-gray-900">Manage Home CMS</h3>
                <p className="text-sm text-gray-600 mt-1">Edit home page content</p>
              </button>

              <button
                onClick={() => navigate('/admin/dashboard/about-cms')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left"
              >
                <i className="ri-file-edit-line text-2xl text-green-600 mb-2"></i>
                <h3 className="font-semibold text-gray-900">Manage About CMS</h3>
                <p className="text-sm text-gray-600 mt-1">Edit about page content</p>
              </button>

              <button
                onClick={() => navigate('/admin/dashboard/ash-utilization-cms')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors text-left"
              >
                <i className="ri-fire-line text-2xl text-yellow-600 mb-2"></i>
                <h3 className="font-semibold text-gray-900">Manage Ash Utilization CMS</h3>
                <p className="text-sm text-gray-600 mt-1">Edit ash utilization page content</p>
              </button>

              <button
                onClick={() => navigate('/admin/dashboard/green-mobility-cms')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left"
              >
                <i className="ri-car-line text-2xl text-green-600 mb-2"></i>
                <h3 className="font-semibold text-gray-900">Manage Green Mobility CMS</h3>
                <p className="text-sm text-gray-600 mt-1">Edit green mobility page content</p>
              </button>

              <button
                onClick={() => navigate('/admin/dashboard/venwind-refex-cms')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors text-left"
              >
                <i className="ri-windy-line text-2xl text-teal-600 mb-2"></i>
                <h3 className="font-semibold text-gray-900">Manage Venwind Refex CMS</h3>
                <p className="text-sm text-gray-600 mt-1">Edit venwind refex page content</p>
              </button>
              <button
                onClick={() => navigate('/admin/dashboard/refrigerant-gas-cms')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
              >
                <i className="ri-flask-line text-2xl text-blue-600 mb-2"></i>
                <h3 className="font-semibold text-gray-900">Manage Refrigerant Gas CMS</h3>
                <p className="text-sm text-gray-600 mt-1">Edit Refrigerant Gas page content</p>
              </button>

              <button
                onClick={() => navigate('/admin/dashboard/esg-cms')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-left"
              >
                <i className="ri-leaf-line text-2xl text-emerald-600 mb-2"></i>
                <h3 className="font-semibold text-gray-900">Manage ESG CMS</h3>
                <p className="text-sm text-gray-600 mt-1">Edit ESG page content</p>
              </button>

              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left">
                <i className="ri-box-3-line text-2xl text-purple-600 mb-2"></i>
                <h3 className="font-semibold text-gray-900">Manage Products</h3>
                <p className="text-sm text-gray-600 mt-1">Add or edit products</p>
              </button>

              <button
                onClick={() => navigate('/admin/dashboard/newsroom-cms')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-left"
              >
                <i className="ri-newspaper-line text-2xl text-orange-600 mb-2"></i>
                <h3 className="font-semibold text-gray-900">Manage Newsroom CMS</h3>
                <p className="text-sm text-gray-600 mt-1">Edit Newsroom page content</p>
              </button>

              <button
                onClick={() => navigate('/admin/dashboard/contact-cms')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-left"
              >
                <i className="ri-mail-line text-2xl text-indigo-600 mb-2"></i>
                <h3 className="font-semibold text-gray-900">Manage Contact CMS</h3>
                <p className="text-sm text-gray-600 mt-1">Edit Contact page content</p>
              </button>

              <button
                onClick={() => navigate('/admin/dashboard/header-cms')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-colors text-left"
              >
                <i className="ri-menu-line text-2xl text-cyan-600 mb-2"></i>
                <h3 className="font-semibold text-gray-900">Manage Header CMS</h3>
                <p className="text-sm text-gray-600 mt-1">Edit header logo, navigation, and stock info</p>
              </button>

              <button
                onClick={() => navigate('/admin/dashboard/footer-cms')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-slate-500 hover:bg-slate-50 transition-colors text-left"
              >
                <i className="ri-footer-line text-2xl text-slate-600 mb-2"></i>
                <h3 className="font-semibold text-gray-900">Manage Footer CMS</h3>
                <p className="text-sm text-gray-600 mt-1">Edit footer sections, links, and contact information</p>
              </button>

              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors text-left">
                <i className="ri-leaf-line text-2xl text-red-600 mb-2"></i>
                <h3 className="font-semibold text-gray-900">Manage ESG</h3>
                <p className="text-sm text-gray-600 mt-1">Edit ESG content</p>
              </button>

              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-left">
                <i className="ri-settings-3-line text-2xl text-indigo-600 mb-2"></i>
                <h3 className="font-semibold text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600 mt-1">Manage system settings</p>
              </button>
                </>
              )}

              {/* Investors CMS - Available to all users */}
              <button
                onClick={() => navigate('/admin/dashboard/investors-cms')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors text-left"
              >
                <i className="ri-line-chart-line text-2xl text-amber-600 mb-2"></i>
                <h3 className="font-semibold text-gray-900">Manage Investors CMS</h3>
                <p className="text-sm text-gray-600 mt-1">Edit Investors page content</p>
              </button>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">User Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{user?.email}</span>
            </div>
            {user?.first_name && (
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-900">
                  {user.first_name} {user.last_name || ''}
                </span>
              </div>
            )}
            {user?.role && (
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium text-gray-900">{user.role}</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

