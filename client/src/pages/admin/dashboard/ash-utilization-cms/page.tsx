import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import AshUtilizationHeroSectionCMS from '../components/AshUtilizationHeroSectionCMS';
import AshUtilizationWhoWeAreSectionCMS from '../components/AshUtilizationWhoWeAreSectionCMS';
import AshUtilizationWhyChooseUsSectionCMS from '../components/AshUtilizationWhyChooseUsSectionCMS';
import AshUtilizationOurImpactSectionCMS from '../components/AshUtilizationOurImpactSectionCMS';
import AshUtilizationServicesSectionCMS from '../components/AshUtilizationServicesSectionCMS';
import AshUtilizationClientsSectionCMS from '../components/AshUtilizationClientsSectionCMS';

export default function AshUtilizationCMSPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'hero' | 'whoweare' | 'whychooseus' | 'ourimpact' | 'services' | 'clients'>('hero');

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
                <h1 className="text-2xl font-bold text-gray-900">Ash Utilization Page CMS</h1>
                <p className="text-sm text-gray-600">Manage Ash Utilization page sections</p>
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
                onClick={() => setActiveTab('services')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'services'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-service-line mr-2"></i>
                Services
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
          {activeTab === 'hero' && <AshUtilizationHeroSectionCMS />}
          {activeTab === 'whoweare' && <AshUtilizationWhoWeAreSectionCMS />}
          {activeTab === 'whychooseus' && <AshUtilizationWhyChooseUsSectionCMS />}
          {activeTab === 'ourimpact' && <AshUtilizationOurImpactSectionCMS />}
          {activeTab === 'services' && <AshUtilizationServicesSectionCMS />}
          {activeTab === 'clients' && <AshUtilizationClientsSectionCMS />}
        </div>
      </main>
    </div>
  );
}

