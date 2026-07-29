import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import HeroSectionCMS from '../components/HeroSectionCMS';
import AboutSectionCMS from '../components/AboutSectionCMS';
import BusinessSectionCMS from '../components/BusinessSectionCMS';
import AtGlanceSectionCMS from '../components/AtGlanceSectionCMS';
import FlipCardsSectionCMS from '../components/FlipCardsSectionCMS';
import NewsroomSectionCMS from '../components/NewsroomSectionCMS';
import AwardsSectionCMS from '../components/AwardsSectionCMS';

export default function HomeCMSPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'business' | 'atglance' | 'flipcards' | 'newsroom' | 'awards' | 'offerings' | 'statistics' | 'regulatory'>('hero');

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
                <h1 className="text-2xl font-bold text-gray-900">Home Page CMS</h1>
                <p className="text-sm text-gray-600">Manage home page sections</p>
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
                onClick={() => setActiveTab('about')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'about'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-text-line mr-2"></i>
                About Section
              </button>
              <button
                onClick={() => setActiveTab('business')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'business'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-building-line mr-2"></i>
                Business Section
              </button>
              <button
                onClick={() => setActiveTab('atglance')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'atglance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-bar-chart-line mr-2"></i>
                At a Glance
              </button>
              <button
                onClick={() => setActiveTab('flipcards')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'flipcards'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-flip-horizontal-line mr-2"></i>
                Flip Cards
              </button>
              <button
                onClick={() => setActiveTab('newsroom')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'newsroom'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-newspaper-line mr-2"></i>
                Newsroom
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
                onClick={() => setActiveTab('offerings')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'offerings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-list-check mr-2"></i>
                Offerings
              </button>
              <button
                onClick={() => setActiveTab('statistics')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'statistics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-bar-chart-line mr-2"></i>
                Statistics
              </button>
              <button
                onClick={() => setActiveTab('regulatory')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'regulatory'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-shield-line mr-2"></i>
                Regulatory
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'hero' && <HeroSectionCMS />}
          {activeTab === 'about' && <AboutSectionCMS />}
          {activeTab === 'business' && <BusinessSectionCMS />}
          {activeTab === 'atglance' && <AtGlanceSectionCMS />}
          {activeTab === 'flipcards' && <FlipCardsSectionCMS />}
          {activeTab === 'newsroom' && <NewsroomSectionCMS />}
          {activeTab === 'awards' && <AwardsSectionCMS />}
          {activeTab === 'offerings' && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <i className="ri-list-check text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">Offerings CMS coming soon...</p>
            </div>
          )}
          {activeTab === 'statistics' && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <i className="ri-bar-chart-line text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">Statistics CMS coming soon...</p>
            </div>
          )}
          {activeTab === 'regulatory' && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <i className="ri-file-shield-line text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">Regulatory CMS coming soon...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

