import { useState, useEffect } from 'react';
import { venwindRefexCmsApi } from '../../../../services/api';

const API_BASE_URL = "";

const getImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
};

interface VisitWebsiteSection {
  id?: number;
  title: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  isActive: boolean;
}

export default function VenwindRefexVisitWebsiteSectionCMS() {
  const [section, setSection] = useState<VisitWebsiteSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !section) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setSection({ ...section, backgroundImage: data.imageUrl });
      setSuccess('Image uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    loadSection();
  }, []);

  const loadSection = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await venwindRefexCmsApi.getVisitWebsite();
      setSection(data || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load visit website section');
      // Fallback to default data
      setSection({
        title: 'To know more about Venwind Refex, click on',
        buttonText: 'Visit Website',
        buttonLink: 'https://venwindrefex.com/',
        backgroundImage: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/bce13c2e4c879e6e4c5988c20f219c90.jpeg',
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!section) return;

    if (!section.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await venwindRefexCmsApi.saveVisitWebsite(section);
      setSuccess('Visit website section saved successfully');
      loadSection();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save visit website section');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading visit website section...</p>
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No visit website section data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit Website Section</h2>

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
            value={section.title}
            onChange={(e) => setSection({ ...section, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., To know more about Venwind Refex, click on"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Note: You can use HTML tags like &lt;span&gt; for styling specific words (e.g., &lt;span className="text-[#7cd244]"&gt;Venwind Refex&lt;/span&gt;)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Image
          </label>
          <div className="flex items-center gap-4 mb-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="backgroundImageUpload"
              disabled={uploadingImage}
            />
            <label
              htmlFor="backgroundImageUpload"
              className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                uploadingImage
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {uploadingImage ? 'Uploading...' : 'Upload Image'}
            </label>
            {section.backgroundImage && (
              <span className="text-sm text-gray-600 truncate max-w-md">
                {section.backgroundImage}
              </span>
            )}
          </div>
          {section.backgroundImage && (
            <div className="mt-2">
              <img 
                src={getImageUrl(section.backgroundImage)} 
                alt="Background Preview" 
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Button Text
          </label>
          <input
            type="text"
            value={section.buttonText || ''}
            onChange={(e) => setSection({ ...section, buttonText: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Visit Website"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Button Link
          </label>
          <input
            type="text"
            value={section.buttonLink || ''}
            onChange={(e) => setSection({ ...section, buttonLink: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://venwindrefex.com/"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={section.isActive}
            onChange={(e) => setSection({ ...section, isActive: e.target.checked })}
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
            onClick={loadSection}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

