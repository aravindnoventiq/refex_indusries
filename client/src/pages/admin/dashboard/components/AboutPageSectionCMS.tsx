import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../../services/api';

interface AboutPageSection {
  id?: number;
  title: string;
  content: string;
  isActive: boolean;
}

export default function AboutPageSectionCMS() {
  const [section, setSection] = useState<AboutPageSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadSection();
  }, []);

  const loadSection = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await aboutCmsApi.getAboutPageSection();
      setSection(data || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load about section');
      // For demo: use existing data from AboutSection
      setSection({
        title: 'About Us',
        content: `Refex Industries Limited is a dynamic, diversified enterprise with strategic interests in refrigerant gases, coal and ash management, power trading, clean mobility, and renewable energy. We are committed to sustainability, innovation, and long-term value creation across sectors critical to India's growth.

We specialize in eco-friendly refrigerant gas trading with multiple cylinder size options, offering reliable and sustainable cooling solutions. In the energy domain, Refex provides integrated services for responsible coal supply, handling and ash utilization. With a Category-I license for interstate power trading, we enable electricity transactions across the country.

Refex Green Mobility Limited, our clean mobility arm, offers four-wheeler vehicles running on clean fuel along with a technology-enabled platform and a professional driver partner to serve the corporates and demand aggregator platforms.

Our renewable energy subsidiary, Venwind , focuses on revolutionising wind energy manufacturing in India through cutting-edge technology, localised production and sustainable growth.

Together, our businesses drive impactful, scalable solutions aligned with a cleaner, more efficient future`,
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const sectionData: AboutPageSection = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      setError('');
      setSuccess('');
      
      await aboutCmsApi.saveAboutPageSection(sectionData);
      setSuccess('About section updated successfully!');
      loadSection();
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save about section');
      // For demo: update local state if backend is not available
      setSection(sectionData);
      setSuccess('About section updated (demo mode)!');
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading about section...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">About Section CMS</h2>
          <p className="text-gray-600 mt-1">Manage the About section of the About Us page</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-edit-line mr-2"></i>
          {section ? 'Edit About Section' : 'Create About Section'}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Current Section Preview */}
      {section && !showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current About Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <p className="text-gray-900 text-xl font-bold">{section.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <div className="text-gray-900 whitespace-pre-line space-y-4">
                {section.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  section.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {section.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Edit About Section</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={section?.title || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    required
                    rows={12}
                    defaultValue={section?.content || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter content here. Use double line breaks to separate paragraphs."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use double line breaks (press Enter twice) to separate paragraphs
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={section?.isActive !== false}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save About Section
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

