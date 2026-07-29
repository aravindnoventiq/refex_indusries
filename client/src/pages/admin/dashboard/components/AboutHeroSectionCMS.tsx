import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../../services/api';

interface AboutHero {
  id?: number;
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage: string;
  logoCards?: Array<{ name: string; logoUrl: string; link?: string }>;
  isActive: boolean;
}

export default function AboutHeroSectionCMS() {
  const [hero, setHero] = useState<AboutHero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');

  useEffect(() => {
    loadHero();
  }, []);

  const loadHero = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await aboutCmsApi.getHero();
      setHero(data || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load hero section');
      // For demo: use existing data from HeroSection
      setHero({
        title: 'A Story of Passion, Determination, and Growth',
        subtitle: '',
        description: '',
        backgroundImage: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/53db3ce33636656bd3b6d29ea93a1205.png',
        logoCards: [],
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Parse logoCards if provided
    let logoCards: Array<{ name: string; logoUrl: string; link?: string }> = [];
    const logoCardsJson = formData.get('logoCards') as string;
    if (logoCardsJson) {
      try {
        logoCards = JSON.parse(logoCardsJson);
      } catch (e) {
        setError('Invalid JSON format for logo cards');
        return;
      }
    }

    const heroData: AboutHero = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string || undefined,
      description: formData.get('description') as string || undefined,
      backgroundImage: backgroundImageUrl,
      logoCards: logoCards.length > 0 ? logoCards : undefined,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      setError('');
      setSuccess('');
      
      await aboutCmsApi.saveHero(heroData);
      setSuccess('Hero section updated successfully!');
      loadHero();
      setShowForm(false);
      setBackgroundImageUrl('');
    } catch (err: any) {
      setError(err.message || 'Failed to save hero section');
      // For demo: update local state if backend is not available
      setHero(heroData);
      setSuccess('Hero section updated (demo mode)!');
      setShowForm(false);
      setBackgroundImageUrl('');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setBackgroundImageUrl('');
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be less than 10MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError('');

      const formData = new FormData();
      formData.append('image', file);

      const apiBaseUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiBaseUrl}/api/upload/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      if (data.success && data.imageUrl) {
        const fullImageUrl = data.imageUrl.startsWith('http') 
          ? data.imageUrl 
          : `${apiBaseUrl}${data.imageUrl}`;
        
        setBackgroundImageUrl(fullImageUrl);
        setSuccess('Image uploaded successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading hero section...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">About Us Hero Section CMS</h2>
          <p className="text-gray-600 mt-1">Manage the hero section of the About Us page</p>
        </div>
        <button
          onClick={() => {
            setBackgroundImageUrl(hero?.backgroundImage || '');
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-edit-line mr-2"></i>
          {hero ? 'Edit Hero Section' : 'Create Hero Section'}
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

      {/* Current Hero Preview */}
      {hero && !showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <p className="text-gray-900">{hero.title}</p>
            </div>
            {hero.subtitle && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <p className="text-gray-900">{hero.subtitle}</p>
              </div>
            )}
            {hero.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900">{hero.description}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
              <img
                src={hero.backgroundImage}
                alt="Background preview"
                className="w-full h-64 object-cover rounded-lg border border-gray-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=No+Image';
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  hero.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {hero.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Edit Hero Section</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={hero?.title || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    defaultValue={hero?.subtitle || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={hero?.description || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Background Image
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {uploadingImage && (
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Uploading...
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Upload an image file (max 10MB)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Background Image URL *
                  </label>
                  {backgroundImageUrl ? (
                    <div className="space-y-2">
                      <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700 break-all">
                        {backgroundImageUrl}
                      </div>
                      <div className="mt-2">
                        <img
                          src={backgroundImageUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover border border-gray-300 rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-500 italic">
                      No image uploaded yet. Please upload an image above.
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo Cards (JSON format - optional)
                  </label>
                  <textarea
                    name="logoCards"
                    rows={4}
                    defaultValue={hero?.logoCards ? JSON.stringify(hero.logoCards, null, 2) : ''}
                    placeholder='[{"name": "Logo 1", "logoUrl": "https://...", "link": "https://..."}]'
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: Array of logo cards with name, logoUrl, and optional link
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={hero?.isActive !== false}
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
                    Save Hero Section
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

