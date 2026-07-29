import { useState, useEffect } from 'react';
import { newsroomCmsApi } from '../../../../services/api';

interface NewsroomHero {
  id?: number;
  title: string;
  description?: string;
  backgroundImage?: string;
  isActive: boolean;
}

export default function NewsroomHeroSectionCMS() {
  const [hero, setHero] = useState<NewsroomHero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');

  useEffect(() => {
    loadHero();
  }, []);

  useEffect(() => {
    if (hero) {
      setBackgroundImageUrl(hero.backgroundImage || '');
    }
  }, [hero]);

  const loadHero = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await newsroomCmsApi.getHero();
      setHero(data || null);
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load hero section');
      }
      // Fallback to default data
      setHero({
        title: 'NEWSROOM',
        description: 'Get hyped for the latest buzz on our businesses and community initiatives, as well as inspiring stories about the amazing people behind them!',
        backgroundImage: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/0343739fb3bc08f14ce39df6b86bba49.jpeg',
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hero) return;

    if (!hero.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      const heroData = {
        ...hero,
        backgroundImage: backgroundImageUrl || hero.backgroundImage,
      };
      await newsroomCmsApi.saveHero(heroData);
      setSuccess('Hero section saved successfully');
      loadHero();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save hero section');
      }
    }
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
        if (hero) {
          setHero({ ...hero, backgroundImage: fullImageUrl });
        }
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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading hero section...</p>
        </div>
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No hero section data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Hero Section</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={hero.title}
            onChange={(e) => setHero({ ...hero, title: e.target.value })}
            placeholder="NEWSROOM"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            rows={4}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={hero.description || ''}
            onChange={(e) => setHero({ ...hero, description: e.target.value })}
            placeholder="Get hyped for the latest buzz on our businesses and community initiatives, as well as inspiring stories about the amazing people behind them!"
          />
          <p className="mt-1 text-sm text-gray-500">
            Use &lt;br /&gt; for line breaks in the description.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Background Image
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Image URL
          </label>
          {backgroundImageUrl ? (
            <div className="space-y-2">
              <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 break-all">
                {backgroundImageUrl}
              </div>
              <div className="mt-2">
                <img
                  src={backgroundImageUrl}
                  alt="Background Preview"
                  className="max-w-md h-auto rounded-lg shadow"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 italic">
              No image uploaded yet. Please upload an image above.
            </div>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            checked={hero.isActive}
            onChange={(e) => setHero({ ...hero, isActive: e.target.checked })}
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Is Active
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Hero Section
          </button>
        </div>
      </form>
    </div>
  );
}

