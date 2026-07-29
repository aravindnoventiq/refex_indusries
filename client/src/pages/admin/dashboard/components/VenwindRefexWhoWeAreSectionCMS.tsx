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

interface VenwindRefexWhoWeAre {
  id?: number;
  title: string;
  content?: string;
  mainImage?: string;
  smallImage?: string;
  isActive: boolean;
}

export default function VenwindRefexWhoWeAreSectionCMS() {
  const [section, setSection] = useState<VenwindRefexWhoWeAre | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingSmallImage, setUploadingSmallImage] = useState(false);

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploadingMainImage(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`http${API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setSection({ ...section, mainImage: data.imageUrl });
      setSuccess('Main image uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingMainImage(false);
    }
  };

  const handleSmallImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploadingSmallImage(true);
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
      setSection({ ...section, smallImage: data.imageUrl });
      setSuccess('Small image uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingSmallImage(false);
    }
  };

  useEffect(() => {
    loadSection();
  }, []);

  const loadSection = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await venwindRefexCmsApi.getWhoWeAre();
      setSection(data || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load who we are section');
      // Fallback to default data
      setSection({
        title: 'Who we are',
        content: `Venwind Refex is a joint venture between Refex and Venwind, committed to revolutionizing wind energy in India through advanced turbine technology and sustainable solutions. With a clear vision to become one of India's leading wind turbine OEMs, we combine global innovation with deep local insights.

Through an exclusive technology license from Vensys Energy AG, Germany, we manufacture cutting-edge 5.3 MW wind turbines featuring a hybrid drivetrain and permanent magnet generator (PMG). This technology is proven worldwide—with over 120 GW of Vensys-powered wind turbines operating across five continents, in a wide range of environments and energy markets.

Our advanced manufacturing facility in India is purpose-built to scale, with a goal of reaching 5 GW in annual production capacity within five years, contributing meaningfully to India's renewable energy targets and the global energy transition.`,
        mainImage: 'https://refex.co.in/wp-content/uploads/2025/06/home-image-600x691-1.jpg',
        smallImage: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/4df2fa160fec066dfccd45c0b0052a39.jpeg',
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
      await venwindRefexCmsApi.saveWhoWeAre(section);
      setSuccess('Who We Are section saved successfully');
      loadSection();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save who we are section');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading who we are section...</p>
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No who we are section data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Who We Are Section</h2>

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
            placeholder="e.g., Who we are"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            value={section.content || ''}
            onChange={(e) => setSection({ ...section, content: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={10}
            placeholder="Enter content text (paragraphs separated by line breaks)..."
          />
          <p className="mt-1 text-sm text-gray-500">Separate paragraphs with line breaks</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Image
          </label>
          <div className="flex items-center gap-4 mb-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageUpload}
              className="hidden"
              id="mainImageUpload"
              disabled={uploadingMainImage}
            />
            <label
              htmlFor="mainImageUpload"
              className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                uploadingMainImage
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {uploadingMainImage ? 'Uploading...' : 'Upload Image'}
            </label>
            {section.mainImage && (
              <span className="text-sm text-gray-600 truncate max-w-md">
                {section.mainImage}
              </span>
            )}
          </div>
          {section.mainImage && (
            <div className="mt-2">
              <img 
                src={getImageUrl(section.mainImage)} 
                alt="Main Image Preview" 
                className="w-full max-w-md h-auto object-cover rounded-lg border border-gray-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Small Image (Top Left)
          </label>
          <div className="flex items-center gap-4 mb-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleSmallImageUpload}
              className="hidden"
              id="smallImageUpload"
              disabled={uploadingSmallImage}
            />
            <label
              htmlFor="smallImageUpload"
              className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                uploadingSmallImage
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {uploadingSmallImage ? 'Uploading...' : 'Upload Image'}
            </label>
            {section.smallImage && (
              <span className="text-sm text-gray-600 truncate max-w-md">
                {section.smallImage}
              </span>
            )}
          </div>
          {section.smallImage && (
            <div className="mt-2">
              <img 
                src={getImageUrl(section.smallImage)} 
                alt="Small Image Preview" 
                className="w-48 h-48 object-cover rounded-lg border border-gray-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
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

