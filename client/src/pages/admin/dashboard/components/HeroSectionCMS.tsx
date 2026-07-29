import { useState, useEffect } from 'react';
import { homeCmsApi } from '../../../../services/api';

interface HeroSlide {
  id?: number;
  title: string;
  image: string;
  order: number;
  isActive: boolean;
}

export default function HeroSectionCMS() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrlFromUpload, setImageUrlFromUpload] = useState(false);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await homeCmsApi.getSlides();
      setSlides(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load slides');
      // For demo: use mock data if backend is not available
      setSlides([
        { id: 1, title: 'Ash Utilization And Coal Handling', image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/0c27f725583f8aa18523ff9ba98c7283.png', order: 1, isActive: true },
        { id: 2, title: 'Green Mobility', image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/5e71896259f48aee41bb484bef88a501.png', order: 2, isActive: true },
        { id: 3, title: 'Venwind Refex', image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/d1f932b601a9dab855d409f970966b38.png', order: 3, isActive: true },
        { id: 4, title: 'Refrigerant Gas', image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/09e6f2b1e185a6c3f96a07b03bf381bc.png', order: 4, isActive: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageUrl) {
      setError('Please upload an image');
      return;
    }
    const formData = new FormData(e.currentTarget);
    const slide: HeroSlide = {
      title: formData.get('title') as string,
      image: imageUrl,
      order: parseInt(formData.get('order') as string) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      setError('');
      setSuccess('');
      
      if (editingSlide?.id) {
        await homeCmsApi.updateSlide(editingSlide.id, slide);
        setSuccess('Slide updated successfully!');
      } else {
        await homeCmsApi.createSlide(slide);
        setSuccess('Slide created successfully!');
      }
      
      setShowForm(false);
      setEditingSlide(null);
      setImageUrl('');
      setImageUrlFromUpload(false);
      loadSlides();
    } catch (err: any) {
      setError(err.message || 'Failed to save slide');
      // For demo: update local state if backend is not available
      if (editingSlide?.id) {
        setSlides(slides.map(s => s.id === editingSlide.id ? { ...slide, id: editingSlide.id } : s));
        setSuccess('Slide updated (demo mode)!');
        setShowForm(false);
        setEditingSlide(null);
        setImageUrl('');
      } else {
        const newSlide = { ...slide, id: Date.now() };
        setSlides([...slides, newSlide]);
        setSuccess('Slide created (demo mode)!');
        setShowForm(false);
        setEditingSlide(null);
        setImageUrl('');
      }
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setImageUrl(slide.image || '');
    setImageUrlFromUpload(false);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      setError('');
      await homeCmsApi.deleteSlide(id);
      setSuccess('Slide deleted successfully!');
      loadSlides();
    } catch (err: any) {
      setError(err.message || 'Failed to delete slide');
      // For demo: update local state if backend is not available
      setSlides(slides.filter(s => s.id !== id));
      setSuccess('Slide deleted (demo mode)!');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSlide(null);
    setImageUrl('');
    setImageUrlFromUpload(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    // Validate file size (10MB limit)
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
        // Use the full URL from the server
        const fullImageUrl = data.imageUrl.startsWith('http') 
          ? data.imageUrl 
          : `${apiBaseUrl}${data.imageUrl}`;
        
        setImageUrl(fullImageUrl);
        setImageUrlFromUpload(true);
        setSuccess('Image uploaded successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const sortedSlides = [...slides].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hero Section CMS</h2>
          <p className="text-gray-600 mt-1">Manage hero slider slides for the home page</p>
        </div>
        <button
          onClick={() => {
            setEditingSlide(null);
            setImageUrl('');
            setImageUrlFromUpload(false);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add New Slide
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingSlide ? 'Edit Slide' : 'Add New Slide'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingSlide?.title || ''}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter slide title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
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
                  Image URL *
                </label>
                {imageUrl ? (
                  <div className="space-y-2">
                    <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 break-all">
                      {imageUrl}
                    </div>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="mt-2 w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 italic">
                    No image uploaded yet. Please upload an image above.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  defaultValue={editingSlide?.order || 0}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editingSlide?.isActive !== false}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Active (show on website)</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingSlide ? 'Update Slide' : 'Create Slide'}
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
      )}

      {/* Slides List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading slides...</p>
        </div>
      ) : sortedSlides.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <i className="ri-image-line text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">No slides found. Add your first slide to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedSlides.map((slide) => (
                  <tr key={slide.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-20 h-12 object-cover rounded border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x48?text=No+Image';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{slide.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded">
                        {slide.order || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          slide.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {slide.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(slide)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <i className="ri-edit-line"></i> Edit
                      </button>
                      <button
                        onClick={() => slide.id && handleDelete(slide.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <i className="ri-delete-bin-line"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

