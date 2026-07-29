import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import AboutHeroSectionCMS from '../components/AboutHeroSectionCMS';
import StickyNavCMS from '../components/StickyNavCMS';
import AboutPageSectionCMS from '../components/AboutPageSectionCMS';
import MissionVisionSectionCMS from '../components/MissionVisionSectionCMS';
import CoreValuesSectionCMS from '../components/CoreValuesSectionCMS';
import BoardMembersSectionCMS from '../components/BoardMembersSectionCMS';
import CommitteesSectionCMS from '../components/CommitteesSectionCMS';
import LeadershipTeamSectionCMS from '../components/LeadershipTeamSectionCMS';
import OurPresenceSectionCMS from '../components/OurPresenceSectionCMS';
import JourneySectionCMS from '../components/JourneySectionCMS';

export default function AboutCMSPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'hero' | 'stickynav' | 'aboutsection' | 'missionvision' | 'corevalues' | 'boardmembers' | 'committees' | 'leadershipteam' | 'presence' | 'journey'>('hero');

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
                <h1 className="text-2xl font-bold text-gray-900">About Us Page CMS</h1>
                <p className="text-sm text-gray-600">Manage About Us page sections</p>
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
                onClick={() => setActiveTab('stickynav')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'stickynav'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-menu-line mr-2"></i>
                Sticky Navigation
              </button>
              <button
                onClick={() => setActiveTab('aboutsection')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'aboutsection'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-text-line mr-2"></i>
                About Section
              </button>
              <button
                onClick={() => setActiveTab('missionvision')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'missionvision'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-eye-line mr-2"></i>
                Vision & Mission
              </button>
              <button
                onClick={() => setActiveTab('corevalues')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'corevalues'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-star-line mr-2"></i>
                Core Values
              </button>
              <button
                onClick={() => setActiveTab('boardmembers')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'boardmembers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-team-line mr-2"></i>
                Board Members
              </button>
              <button
                onClick={() => setActiveTab('committees')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'committees'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-group-line mr-2"></i>
                Committees
              </button>
              <button
                onClick={() => setActiveTab('leadershipteam')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'leadershipteam'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-user-star-line mr-2"></i>
                Leadership Team
              </button>
              <button
                onClick={() => setActiveTab('presence')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'presence'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-map-pin-line mr-2"></i>
                Our Presence
              </button>
              <button
                onClick={() => setActiveTab('journey')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'journey'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-roadmap-line mr-2"></i>
                Journey
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'hero' && <AboutHeroSectionCMS />}
          {activeTab === 'stickynav' && <StickyNavCMS />}
          {activeTab === 'aboutsection' && <AboutPageSectionCMS />}
          {activeTab === 'missionvision' && <MissionVisionSectionCMS />}
          {activeTab === 'corevalues' && <CoreValuesSectionCMS />}
          {activeTab === 'boardmembers' && <BoardMembersSectionCMS />}
          {activeTab === 'committees' && <CommitteesSectionCMS />}
          {activeTab === 'leadershipteam' && <LeadershipTeamSectionCMS />}
          {activeTab === 'presence' && <OurPresenceSectionCMS />}
          {activeTab === 'journey' && <JourneySectionCMS />}
        </div>
      </main>
    </div>
  );
}

