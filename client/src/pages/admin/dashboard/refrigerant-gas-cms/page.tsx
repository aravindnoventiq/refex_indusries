import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import RefrigerantGasHeroSectionCMS from '../components/RefrigerantGasHeroSectionCMS';
import RefrigerantGasWhoWeAreSectionCMS from '../components/RefrigerantGasWhoWeAreSectionCMS';
import RefrigerantGasWhyChooseUsSectionCMS from '../components/RefrigerantGasWhyChooseUsSectionCMS';
import RefrigerantGasProductTabsSectionCMS from '../components/RefrigerantGasProductTabsSectionCMS';
import RefrigerantGasOurImpactSectionCMS from '../components/RefrigerantGasOurImpactSectionCMS';
import RefrigerantGasOurProductsSectionCMS from '../components/RefrigerantGasOurProductsSectionCMS';
import RefrigerantGasClientsSectionCMS from '../components/RefrigerantGasClientsSectionCMS';

export default function RefrigerantGasCMSPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'hero' | 'whoweare' | 'whychooseus' | 'producttabs' | 'ourimpact' | 'ourproducts' | 'clients'>('hero');

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                <i className="ri-arrow-left-line text-xl"></i>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Refrigerant Gas Page CMS</h1>
                <p className="text-sm text-gray-600">Manage Refrigerant Gas page sections</p>
              </div>
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
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('hero')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'hero'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-image-line mr-2"></i>
                Hero Section
              </button>
              <button
                onClick={() => setActiveTab('whoweare')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'whoweare'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-team-line mr-2"></i>
                Who We Are
              </button>
              <button
                onClick={() => setActiveTab('whychooseus')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'whychooseus'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-star-line mr-2"></i>
                Why Choose Us
              </button>
              <button
                onClick={() => setActiveTab('producttabs')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'producttabs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-layout-grid-line mr-2"></i>
                Product Tabs
              </button>
              <button
                onClick={() => setActiveTab('ourimpact')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'ourimpact'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-bar-chart-line mr-2"></i>
                Our Impact
              </button>
              <button
                onClick={() => setActiveTab('ourproducts')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'ourproducts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-shopping-bag-line mr-2"></i>
                Our Products
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'clients'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-group-line mr-2"></i>
                Clients
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'hero' && <RefrigerantGasHeroSectionCMS />}
          {activeTab === 'whoweare' && <RefrigerantGasWhoWeAreSectionCMS />}
          {activeTab === 'whychooseus' && <RefrigerantGasWhyChooseUsSectionCMS />}
          {activeTab === 'producttabs' && <RefrigerantGasProductTabsSectionCMS />}
          {activeTab === 'ourimpact' && <RefrigerantGasOurImpactSectionCMS />}
          {activeTab === 'ourproducts' && <RefrigerantGasOurProductsSectionCMS />}
          {activeTab === 'clients' && <RefrigerantGasClientsSectionCMS />}
        </div>
      </main>
    </div>
  );
}

