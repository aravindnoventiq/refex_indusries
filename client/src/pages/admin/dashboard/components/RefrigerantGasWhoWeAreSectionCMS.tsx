import { useState, useEffect } from 'react';
import { refrigerantGasCmsApi } from '../../../../services/api';

const API_BASE_URL = "";

const getImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
};

interface RefrigerantGasWhoWeAre {
  id?: number;
  title: string;
  content?: string;
  mainImage?: string;
  isActive: boolean;
}

export default function RefrigerantGasWhoWeAreSectionCMS() {
  const [section, setSection] = useState<RefrigerantGasWhoWeAre | null>(null);
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
      setSection({ ...section, mainImage: data.imageUrl });
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
      const data = await refrigerantGasCmsApi.getWhoWeAre();
      setSection(data || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load who we are section');
      // Fallback to default data
      setSection({
        title: 'Who we are',
        content: `Refex Industries Limited, established in 2002, is a pioneer in eco-friendly refrigerant gases across India. We specialize in replacing harmful CFCs and HCFCs with environmentally friendly alternatives. Our product range includes refrigerants, foam-blowing agents, and aerosol propellants, backed by advanced technology that sets industry standards.

With over 22 years of experience, Refex has built a sterling reputation for delivering eco-friendly refrigerant solutions that exceed industry standards. Their emphasis on innovation and sustainability has positioned them as a premier supplier in the HVAC and refrigeration sectors.

Refex is known for superior quality, reliability, and commitment to sustainability. Our innovative approach and reliable logistics network ensure rapid delivery and customer satisfaction. We continue to set industry benchmarks, driven by sustainability and technological advancement.`,
        mainImage: 'https://refex.co.in/wp-content/uploads/2025/08/ref-about-us-1.jpg',
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
      await refrigerantGasCmsApi.saveWhoWeAre(section);
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
              onChange={handleImageUpload}
              className="hidden"
              id="mainImageUpload"
              disabled={uploadingImage}
            />
            <label
              htmlFor="mainImageUpload"
              className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                uploadingImage
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {uploadingImage ? 'Uploading...' : 'Upload Image'}
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

