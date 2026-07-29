import { useState, useEffect } from 'react';
import { esgCmsApi } from '../../../../services/api';

const API_BASE_URL = "";

const getImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
};

interface SustainableBusinessSection {
  id?: number;
  title: string;
  content?: string;
  image?: string;
  isActive: boolean;
}

export default function EsgSustainableBusinessSectionCMS() {
  const [section, setSection] = useState<SustainableBusinessSection | null>(null);
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
      setSection({ ...section, image: data.imageUrl });
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
      const data = await esgCmsApi.getSustainableBusiness();
      setSection(data || null);
    } catch (err: any) {
      // Only show error if it's not a server availability issue
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load Sustainable Business section');
      }
      // Fallback to default data
      setSection({
        title: 'Sustainable Business Model',
        content: `In the fast-evolving landscape of the business world, only a handful of companies manage to transcend the boundaries of their niche and ascend to the coveted status of a regime. Refex Industries Limited stands tall among such remarkable success stories that have taken India to the world – from our humble beginnings in a specialized market in refrigerant gases to becoming a major entity working across diverse business verticals. Refex Industries Limited's business model is pivotal to sustainability, innovation, and offering eco-friendly solutions.

Alongside these efforts, our ash handling division continues to mitigate environmental risks and climate change by facilitating mine rehabilitation, recycling coal ash and ensuring material circularity, converting degraded land into usable spaces, and reducing the strain on agricultural and forest areas.

Refex Green Mobility Limited (RGML), a subsidiary of Refex Industries Limited (RIL), proudly emerged into the mobility space during the fiscal year 2022-23, making a profound statement of Refex Group's unwavering dedication to embracing a green business model and making substantial contributions to combat climate change.

Venwind Refex is advancing India's clean energy transition through sustainable wind turbine manufacturing. In collaboration with global technology leaders, we deliver efficient, reliable, and environmentally responsible solutions—driven by local production and a strong supply chain to enable scalable, low-carbon growth.`,
        image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/4378e87ea65febdcf15274ee7cb74af4.jpeg',
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
      await esgCmsApi.saveSustainableBusiness(section);
      setSuccess('Sustainable Business section saved successfully');
      loadSection();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save Sustainable Business section');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading Sustainable Business section...</p>
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No Sustainable Business section data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sustainable Business Section</h2>

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
            placeholder="e.g., Sustainable Business Model"
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
            rows={12}
            placeholder="Enter content text (paragraphs separated by line breaks)..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Separate paragraphs with line breaks. You can use &lt;strong&gt; tags for bold text.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>
          <div className="flex items-center gap-4 mb-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="imageUpload"
              disabled={uploadingImage}
            />
            <label
              htmlFor="imageUpload"
              className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                uploadingImage
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {uploadingImage ? 'Uploading...' : 'Upload Image'}
            </label>
            {section.image && (
              <span className="text-sm text-gray-600 truncate max-w-md">
                {section.image}
              </span>
            )}
          </div>
          {section.image && (
            <div className="mt-2">
              <img 
                src={getImageUrl(section.image)} 
                alt="Image Preview" 
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

