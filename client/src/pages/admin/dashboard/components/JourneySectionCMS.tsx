import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../../services/api';

interface AboutJourney {
  id?: number;
  title?: string;
  summary?: string;
  image?: string;
  images?: string[];
  isActive: boolean;
}

export default function JourneySectionCMS() {
  const [journey, setJourney] = useState<AboutJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !journey) return;

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
        
        setJourney({ ...journey, image: fullImageUrl });
        setSuccess('Image uploaded successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    loadJourney();
  }, []);

  const loadJourney = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await aboutCmsApi.getAboutJourney();
      setJourney(data || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load journey section');
      // Fallback to default data
      setJourney({
        title: 'Our Journey',
        summary: '',
        image: 'https://refex.co.in/wp-content/uploads/2025/08/Our-Journey-new01.jpg',
        images: [],
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!journey) return;

    try {
      setError('');
      setSuccess('');
      await aboutCmsApi.saveAboutJourney(journey);
      setSuccess('Journey section saved successfully');
      loadJourney();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save journey section');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading journey section...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Journey Section</h2>

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

      {journey && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={journey.title || ''}
              onChange={(e) => setJourney({ ...journey, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Our Journey"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary
            </label>
            <textarea
              value={journey.summary || ''}
              onChange={(e) => setJourney({ ...journey, summary: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Optional summary text"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Journey Image
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {uploadingImage && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Uploading...
                </div>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">Upload an image file (max 10MB)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Journey Image URL *
            </label>
            {journey.image ? (
              <div className="space-y-2">
                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 break-all">
                  {journey.image}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  This is the main image displayed in the journey section. If multiple images are provided, this will be used as the primary image.
                </p>
                <div className="mt-2">
                  <img 
                    src={journey.image} 
                    alt="Journey Preview" 
                    className="max-w-full h-auto rounded border border-gray-300"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Images (JSON Array)
            </label>
            <textarea
              value={Array.isArray(journey.images) ? JSON.stringify(journey.images, null, 2) : ''}
              onChange={(e) => {
                try {
                  const parsed = e.target.value ? JSON.parse(e.target.value) : [];
                  setJourney({ ...journey, images: Array.isArray(parsed) ? parsed : [] });
                } catch {
                  // Invalid JSON, keep as is
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder='["https://example.com/image1.jpg", "https://example.com/image2.jpg"]'
              rows={4}
            />
            <p className="mt-1 text-sm text-gray-500">
              Optional: Provide additional images as a JSON array. These can be used for carousels or galleries.
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={journey.isActive}
              onChange={(e) => setJourney({ ...journey, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={loadJourney}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

