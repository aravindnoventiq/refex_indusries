import { useState, useEffect } from 'react';
import { homeCmsApi } from '../../../../services/api';

interface NewsItem {
  id?: number;
  title: string;
  image: string;
  link: string;
  category?: string;
  publishedDate?: string;
  order: number;
  isActive: boolean;
}

export default function NewsroomSectionCMS() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrlFromUpload, setImageUrlFromUpload] = useState(false);

  useEffect(() => {
    loadNewsItems();
  }, []);

  const loadNewsItems = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await homeCmsApi.getNewsItems();
      setNewsItems(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load news items');
      // For demo: use existing data from NewsroomSection
      setNewsItems([
        {
          id: 1,
          title: 'Dinesh Agarwal, CEO of Refex Group, on ET Now',
          image: 'https://refex.co.in/wp-content/uploads/2025/11/newsroom-thumbnail-video.jpg',
          link: '/press_releases/dinesh-agarwal-ceo-of-refex-group-on-et-now/',
          category: 'Press Release',
          order: 1,
          isActive: true,
        },
        {
          id: 2,
          title: 'Refex Mobility expands operations to Delhi NCR',
          image: 'https://refex.co.in/wp-content/uploads/2025/11/Refex-Mobility-expands.jpg',
          link: '/press_releases/refex-mobility-expands-operations-to-delhi-ncr/',
          category: 'Press Release',
          order: 2,
          isActive: true,
        },
        {
          id: 3,
          title: 'Refex eVeelz rebrands as Refex Mobility; to consolidate focus on existing Tier-1 market',
          image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/2675d7edc8e086e4c4be378eba93a660.jpeg',
          link: '/press_releases/refex-eveelz-rebrands-as-refex-mobility-to-consolidate-focus-on-existing-tier-1-market/',
          category: 'Press Release',
          order: 3,
          isActive: true,
        },
        {
          id: 4,
          title: 'Refex Group is the Official Sponsor of Chennai Super Kings',
          image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/d674bfc0dcb4ffb4355d91b67e0eb3b3.jpeg',
          link: '/press_releases/refex-group-is-the-official-sponsor-of-chennai-super-kings/',
          category: 'Press Release',
          order: 4,
          isActive: true,
        },
        {
          id: 5,
          title: 'Uber partners with Chennai-based Refex Green Mobility to deploy 1,000 EVs across cities',
          image: 'https://refex.co.in/wp-content/uploads/2025/07/press-release02.jpg',
          link: '/press_releases/uber-partners-with-chennai-based-refex-green-mobility-to-deploy-1000-evs-across-cities/',
          category: 'Press Release',
          order: 5,
          isActive: true,
        },
        {
          id: 6,
          title: 'Refex Group Strengthens Leadership in Sustainability at UNGCNI Annual Convention 2025',
          image: 'https://refex.co.in/wp-content/uploads/2025/07/press-release04.jpg',
          link: '/press_releases/refex-group-strengthens-leadership-in-sustainability-at-ungcni-annual-convention-2025/',
          category: 'Press Release',
          order: 6,
          isActive: true,
        },
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
    const newsItem: NewsItem = {
      title: formData.get('title') as string,
      image: imageUrl,
      link: formData.get('link') as string,
      category: formData.get('category') as string || undefined,
      publishedDate: formData.get('publishedDate') as string || undefined,
      order: parseInt(formData.get('order') as string) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      setError('');
      setSuccess('');
      
      if (editingItem?.id) {
        await homeCmsApi.updateNewsItem(editingItem.id, newsItem);
        setSuccess('News item updated successfully!');
      } else {
        await homeCmsApi.createNewsItem(newsItem);
        setSuccess('News item created successfully!');
      }
      
      setShowForm(false);
      setEditingItem(null);
      setImageUrl('');
      setImageUrlFromUpload(false);
      loadNewsItems();
    } catch (err: any) {
      setError(err.message || 'Failed to save news item');
      // For demo: update local state if backend is not available
      if (editingItem?.id) {
        setNewsItems(newsItems.map(n => n.id === editingItem.id ? { ...newsItem, id: editingItem.id } : n));
        setSuccess('News item updated (demo mode)!');
        setShowForm(false);
        setEditingItem(null);
        setImageUrl('');
      } else {
        const newItem = { ...newsItem, id: Date.now() };
        setNewsItems([...newsItems, newItem]);
        setSuccess('News item created (demo mode)!');
        setShowForm(false);
        setEditingItem(null);
        setImageUrl('');
      }
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setImageUrl(item.image || '');
    setImageUrlFromUpload(false);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
      setError('');
      await homeCmsApi.deleteNewsItem(id);
      setSuccess('News item deleted successfully!');
      loadNewsItems();
    } catch (err: any) {
      setError(err.message || 'Failed to delete news item');
      // For demo: update local state if backend is not available
      setNewsItems(newsItems.filter(n => n.id !== id));
      setSuccess('News item deleted (demo mode)!');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    setImageUrl('');
    setImageUrlFromUpload(false);
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

  const sortedNewsItems = [...newsItems].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Newsroom Section CMS</h2>
          <p className="text-gray-600 mt-1">Manage news items for the home page</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setImageUrl('');
            setImageUrlFromUpload(false);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add New News Item
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
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit News Item' : 'Add New News Item'}
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
                  defaultValue={editingItem?.title || ''}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Refex Group wins Excellence Award"
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
                      className="mt-2 w-full h-64 object-cover rounded-lg border border-gray-200"
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
                  Link *
                </label>
                <input
                  type="text"
                  name="link"
                  defaultValue={editingItem?.link || ''}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., /press_releases/article-title/ or /newsroom/article"
                />
                <p className="text-xs text-gray-500 mt-1">Relative URL path to the full article</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    defaultValue={editingItem?.category || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select Category</option>
                    <option value="Press Release">Press Release</option>
                    <option value="News">News</option>
                    <option value="Event">Event</option>
                    <option value="Announcement">Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Published Date
                  </label>
                  <input
                    type="date"
                    name="publishedDate"
                    defaultValue={editingItem?.publishedDate ? new Date(editingItem.publishedDate).toISOString().split('T')[0] : ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  defaultValue={editingItem?.order || 0}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editingItem?.isActive !== false}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Active (show on website)</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingItem ? 'Update News Item' : 'Create News Item'}
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

      {/* News Items List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading news items...</p>
        </div>
      ) : sortedNewsItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <i className="ri-newspaper-line text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">No news items found. Add your first news item to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Link
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
                {sortedNewsItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-md">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.category && (
                        <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded">
                          {item.category}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-blue-600 truncate max-w-xs">{item.link}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded">
                        {item.order || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          item.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <i className="ri-edit-line"></i> Edit
                      </button>
                      <button
                        onClick={() => item.id && handleDelete(item.id)}
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

