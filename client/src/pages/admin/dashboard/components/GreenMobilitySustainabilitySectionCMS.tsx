import { useState, useEffect } from 'react';
import { greenMobilityCmsApi } from '../../../../services/api';

interface SustainabilitySection {
  id?: number;
  title: string;
  description?: string;
  additionalText?: string;
  backgroundImage?: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
}

export default function GreenMobilitySustainabilitySectionCMS() {
  const [section, setSection] = useState<SustainabilitySection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !section) return;

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
        
        setSection({ ...section, backgroundImage: fullImageUrl });
        setSuccess('Image uploaded successfully');
      }
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
      const data = await greenMobilityCmsApi.getSustainability();
      setSection(data || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load sustainability section');
      // Fallback to default data
      setSection({
        title: 'Sustainable Mobility Redefined',
        description: 'With Refex Mobility, embrace a new standard in urban commuting. Our cleaner-fuelled vehicles, from comfortable sedans to premium SUVs, are tailored for efficiency and environmental responsibility.',
        additionalText: 'Whether it\'s for daily commute or corporate bookings, we have the right vehicles',
        backgroundImage: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/e57ce7d6f24f55590012a6b3f116efd9.jpeg',
        buttonText: 'Visit Website',
        buttonLink: 'https://refexmobility.com/',
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
      await greenMobilityCmsApi.saveSustainability(section);
      setSuccess('Sustainability section saved successfully');
      loadSection();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save sustainability section');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading sustainability section...</p>
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No sustainability section data found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sustainability Section</h2>

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
            placeholder="e.g., Sustainable Mobility Redefined"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={section.description || ''}
            onChange={(e) => setSection({ ...section, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Main description text..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Text
          </label>
          <textarea
            value={section.additionalText || ''}
            onChange={(e) => setSection({ ...section, additionalText: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Additional text (second paragraph)..."
          />
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
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {uploadingImage && (
              <div className="flex items-center text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Uploading...
              </div>
            )}
          </div>
          {section.backgroundImage && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1 break-all">Path: {section.backgroundImage}</p>
              <img 
                src={section.backgroundImage} 
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
            placeholder="https://example.com"
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

