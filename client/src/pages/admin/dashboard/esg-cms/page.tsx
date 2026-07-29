import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import EsgHeroSectionCMS from '../components/EsgHeroSectionCMS';
import EsgRefexOnEsgSectionCMS from '../components/EsgRefexOnEsgSectionCMS';
import EsgSustainableBusinessSectionCMS from '../components/EsgSustainableBusinessSectionCMS';
import EsgPoliciesSectionCMS from '../components/EsgPoliciesSectionCMS';
import EsgReportsSectionCMS from '../components/EsgReportsSectionCMS';
import EsgProgramsSectionCMS from '../components/EsgProgramsSectionCMS';
import EsgSdgSectionCMS from '../components/EsgSdgSectionCMS';
import EsgUnsdgActionsSectionCMS from '../components/EsgUnsdgActionsSectionCMS';
import EsgAwardsSectionCMS from '../components/EsgAwardsSectionCMS';
import EsgCollaborationSectionCMS from '../components/EsgCollaborationSectionCMS';
import EsgGovernanceSectionCMS from '../components/EsgGovernanceSectionCMS';
import EsgHRSectionCMS from '../components/EsgHRSectionCMS';

export default function EsgCMSPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'hero' | 'refexonesg' | 'sustainablebusiness' | 'policies' | 'reports' | 'programs' | 'sdg' | 'unsdgactions' | 'awards' | 'collaboration' | 'governance' | 'hr'>('hero');

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
                <h1 className="text-2xl font-bold text-gray-900">ESG Page CMS</h1>
                <p className="text-sm text-gray-600">Manage ESG page sections</p>
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
                onClick={() => setActiveTab('refexonesg')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'refexonesg'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-text-line mr-2"></i>
                Refex on ESG
              </button>
              <button
                onClick={() => setActiveTab('sustainablebusiness')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'sustainablebusiness'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-leaf-line mr-2"></i>
                Sustainable Business
              </button>
              <button
                onClick={() => setActiveTab('policies')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'policies'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-paper-line mr-2"></i>
                ESG Policies
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'reports'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-text-line mr-2"></i>
                Reports
              </button>
              <button
                onClick={() => setActiveTab('programs')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'programs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-folder-line mr-2"></i>
                Programs
              </button>
              <button
                onClick={() => setActiveTab('sdg')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'sdg'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-global-line mr-2"></i>
                SDG Section
              </button>
              <button
                onClick={() => setActiveTab('unsdgactions')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'unsdgactions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-list-check mr-2"></i>
                UN SDG Actions
              </button>
              <button
                onClick={() => setActiveTab('awards')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'awards'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-award-line mr-2"></i>
                Awards
              </button>
              <button
                onClick={() => setActiveTab('collaboration')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'collaboration'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-handshake-line mr-2"></i>
                Collaboration
              </button>
              <button
                onClick={() => setActiveTab('governance')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'governance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-government-line mr-2"></i>
                Governance
              </button>
              <button
                onClick={() => setActiveTab('hr')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'hr'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-team-line mr-2"></i>
                HR
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'hero' && <EsgHeroSectionCMS />}
          {activeTab === 'refexonesg' && <EsgRefexOnEsgSectionCMS />}
          {activeTab === 'sustainablebusiness' && <EsgSustainableBusinessSectionCMS />}
          {activeTab === 'policies' && <EsgPoliciesSectionCMS />}
          {activeTab === 'reports' && <EsgReportsSectionCMS />}
          {activeTab === 'programs' && <EsgProgramsSectionCMS />}
          {activeTab === 'sdg' && <EsgSdgSectionCMS />}
          {activeTab === 'unsdgactions' && <EsgUnsdgActionsSectionCMS />}
          {activeTab === 'awards' && <EsgAwardsSectionCMS />}
          {activeTab === 'collaboration' && <EsgCollaborationSectionCMS />}
          {activeTab === 'governance' && <EsgGovernanceSectionCMS />}
          {activeTab === 'hr' && <EsgHRSectionCMS />}
        </div>
      </main>
    </div>
  );
}

