import { useState, useEffect } from 'react';
import { ashUtilizationCmsApi } from '../../../../services/api';

interface HeroSlide {
  image: string;
}

interface WhoWeAreSection {
  id?: number;
  title: string;
  content: string;
  slides: HeroSlide[];
  isActive: boolean;
}

export default function AshUtilizationWhoWeAreSectionCMS() {
  const [section, setSection] = useState<WhoWeAreSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingSlide, setUploadingSlide] = useState<number | null>(null);

  const handleSlideImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
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
        
        const updatedSlides = [...section.slides];
        updatedSlides[index] = { ...updatedSlides[index], image: fullImageUrl };
        setSection({ ...section, slides: updatedSlides });
        setSuccess('Image uploaded successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingSlide(null);
    }
  };

  useEffect(() => {
    loadSection();
  }, []);

  const loadSection = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ashUtilizationCmsApi.getWhoWeAre();
      setSection(data || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load who we are section');
      // Fallback to default data
      setSection({
        title: 'Who we are',
        content: `Refex, a leader in the ash utilization sector since its entry in 2018, specializes in providing ash management services for coalfired power plants, helping them mitigate the environmental pollution caused by coal combustion.

As the largest organized player in India's ash management industry, we have successfully worked across 40+ plants and repurposed the ash generated for construction of roads, highways and embankments; for filling of mines and low-lying areas, and manufacturing of cement and bricks, thereby fostering sustainable infrastructure development.

Known for our reliable, and high-quality services, we employ advanced technologies and extensive network of fleet for the safe collection, transportation, and utilization of ash, with a strong emphasis on sustainability.`,
        slides: [
          { image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/24687ccdb5cb91356b395ecdc1fc5b9e.jpeg' },
          { image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/7c3c2bf683875e07aefd0074156c1eaf.jpeg' },
        ],
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
    if (!section.content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await ashUtilizationCmsApi.saveWhoWeAre(section);
      setSuccess('Who We Are section saved successfully');
      loadSection();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save who we are section');
    }
  };

  const handleAddSlide = () => {
    if (!section) return;
    setSection({
      ...section,
      slides: [...section.slides, { image: '' }],
    });
  };

  const handleRemoveSlide = (index: number) => {
    if (!section) return;
    setSection({
      ...section,
      slides: section.slides.filter((_, i) => i !== index),
    });
  };

  const handleSlideChange = (index: number, field: keyof HeroSlide, value: string) => {
    if (!section) return;
    const updatedSlides = [...section.slides];
    updatedSlides[index] = { ...updatedSlides[index], [field]: value };
    setSection({ ...section, slides: updatedSlides });
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

      {section && (
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
              Content *
            </label>
            <textarea
              value={section.content}
              onChange={(e) => setSection({ ...section, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter content paragraphs (separate paragraphs with double line breaks)"
              rows={8}
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Separate paragraphs with double line breaks (press Enter twice)
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Slides
              </label>
              <button
                type="button"
                onClick={handleAddSlide}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                <i className="ri-add-line mr-1"></i>
                Add Slide
              </button>
            </div>
            <div className="space-y-4">
              {section.slides.map((slide, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-medium text-gray-900">Slide {index + 1}</h5>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlide(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Image *
                    </label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSlideImageUpload(e, index)}
                        disabled={uploadingSlide === index}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          alt={`Slide ${index + 1} Preview`}
                          className="max-w-md h-48 object-cover rounded border border-gray-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {section.slides.length === 0 && (
                <p className="text-gray-500 text-sm">No slides added. Click "Add Slide" to add one.</p>
              )}
            </div>
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
      )}
    </div>
  );
}

