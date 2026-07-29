import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import VenwindRefexHeroSectionCMS from '../components/VenwindRefexHeroSectionCMS';
import VenwindRefexWhoWeAreSectionCMS from '../components/VenwindRefexWhoWeAreSectionCMS';
import VenwindRefexWhyChooseUsSectionCMS from '../components/VenwindRefexWhyChooseUsSectionCMS';
import VenwindRefexTechnicalSpecsSectionCMS from '../components/VenwindRefexTechnicalSpecsSectionCMS';
import VenwindRefexVisitWebsiteSectionCMS from '../components/VenwindRefexVisitWebsiteSectionCMS';

export default function VenwindRefexCMSPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'hero' | 'whoweare' | 'whychooseus' | 'technicalspecs' | 'visitwebsite'>('hero');

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
                <h1 className="text-2xl font-bold text-gray-900">Venwind Refex Page CMS</h1>
                <p className="text-sm text-gray-600">Manage Venwind Refex page sections</p>
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
                onClick={() => setActiveTab('technicalspecs')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'technicalspecs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-settings-3-line mr-2"></i>
                Technical Specs
              </button>
              <button
                onClick={() => setActiveTab('visitwebsite')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'visitwebsite'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-global-line mr-2"></i>
                Visit Website
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'hero' && <VenwindRefexHeroSectionCMS />}
          {activeTab === 'whoweare' && <VenwindRefexWhoWeAreSectionCMS />}
          {activeTab === 'whychooseus' && <VenwindRefexWhyChooseUsSectionCMS />}
          {activeTab === 'technicalspecs' && <VenwindRefexTechnicalSpecsSectionCMS />}
          {activeTab === 'visitwebsite' && <VenwindRefexVisitWebsiteSectionCMS />}
        </div>
      </main>
    </div>
  );
}

