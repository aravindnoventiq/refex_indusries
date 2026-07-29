import { useState, useEffect } from 'react';
import { greenMobilityCmsApi } from '../../../../services/api';

interface HeroSlide {
  image: string;
}

interface GreenMobilityHero {
  id?: number;
  title: string;
  subtitle?: string;
  slides: HeroSlide[];
  isActive: boolean;
}

export default function GreenMobilityHeroSectionCMS() {
  const [hero, setHero] = useState<GreenMobilityHero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingSlide, setUploadingSlide] = useState<number | null>(null);

  const handleSlideImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file || !hero) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be less than 10MB');
      return;
    }

    try {
      setUploadingSlide(index);
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
        
        const updatedSlides = [...hero.slides];
        updatedSlides[index] = { ...updatedSlides[index], image: fullImageUrl };
        setHero({ ...hero, slides: updatedSlides });
        setSuccess('Image uploaded successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingSlide(null);
    }
  };

  useEffect(() => {
    loadHero();
  }, []);

  const loadHero = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await greenMobilityCmsApi.getHero();
      setHero(data || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load hero section');
      // Fallback to default data
      setHero({
        title: 'Refex Mobility',
        subtitle: 'The Most Trusted, Sustainable Mobility Partner in India',
        slides: [
          { image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/e3bf83d0ca42ec3e1b21d62acc25a3cd.jpeg' },
          { image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/ffa03b0c227885e7d623744243542115.jpeg' },
        ],
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
      await greenMobilityCmsApi.saveHero(hero);
      setSuccess('Hero section saved successfully');
      loadHero();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save hero section');
    }
  };

  const handleAddSlide = () => {
    if (!hero) return;
    setHero({
      ...hero,
      slides: [...hero.slides, { image: '' }],
    });
  };

  const handleRemoveSlide = (index: number) => {
    if (!hero) return;
    setHero({
      ...hero,
      slides: hero.slides.filter((_, i) => i !== index),
    });
  };

  const handleSlideChange = (index: number, field: keyof HeroSlide, value: string) => {
    if (!hero) return;
    const updatedSlides = [...hero.slides];
    updatedSlides[index] = { ...updatedSlides[index], [field]: value };
    setHero({ ...hero, slides: updatedSlides });
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
        <p className="text-gray-500">No hero data available. Please create one.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Green Mobility Hero Section</h2>

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
            value={hero.title}
            onChange={(e) => setHero({ ...hero, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Refex Mobility"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle
          </label>
          <input
            type="text"
            value={hero.subtitle || ''}
            onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., The Most Trusted, Sustainable Mobility Partner in India"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Slides
            </label>
            <button
              type="button"
              onClick={handleAddSlide}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <i className="ri-add-line mr-2"></i>
              Add Slide
            </button>
          </div>

          <div className="space-y-4">
            {hero.slides.map((slide, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-gray-700">Slide {index + 1}</span>
                  {hero.slides.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSlide(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image *
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSlideImageUpload(e, index)}
                      disabled={uploadingSlide === index}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {uploadingSlide === index && (
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        Uploading...
                      </div>
                    )}
                  </div>
                  {slide.image && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1 break-all">Path: {slide.image}</p>
                      <img
                        src={slide.image}
                        alt={`Slide ${index + 1}`}
                        className="w-full max-w-md h-48 object-cover rounded border border-gray-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {hero.slides.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No slides added. Click "Add Slide" to add one.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={hero.isActive}
            onChange={(e) => setHero({ ...hero, isActive: e.target.checked })}
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
            onClick={loadHero}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

