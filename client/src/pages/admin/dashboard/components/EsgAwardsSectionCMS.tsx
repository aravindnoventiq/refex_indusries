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

interface Award {
  id?: number;
  image: string;
  title: string;
  order: number;
  isActive: boolean;
}

interface AwardsSectionHeader {
  id?: number;
  title: string;
  isActive: boolean;
}

export default function EsgAwardsSectionCMS() {
  const [header, setHeader] = useState<AwardsSectionHeader | null>(null);
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showHeaderForm, setShowHeaderForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingAward) return;

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
      setEditingAward({ ...editingAward, image: data.imageUrl });
      setSuccess('Image uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [headerData, awardsData] = await Promise.all([
        esgCmsApi.getAwardsSection(),
        esgCmsApi.getAwards(),
      ]);
      setHeader(headerData || null);
      setAwards(awardsData || []);
    } catch (err: any) {
      // Only show error if it's not a server availability issue
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load awards section');
      }
      // Fallback to default data
      setHeader({
        title: 'Awards & Accolades',
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAward = () => {
    setEditingAward({
      image: '',
      title: '',
      order: awards.length,
      isActive: true,
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEditAward = (award: Award) => {
    setEditingAward({ ...award });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteAward = async (id: number) => {
    if (!confirm('Are you sure you want to delete this award?')) {
      return;
    }
    try {
      await esgCmsApi.deleteAward(id);
      setSuccess('Award deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot delete: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to delete award');
      }
    }
  };

  const handleSaveAward = async () => {
    if (!editingAward) return;
    
    if (!editingAward.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!editingAward.image.trim()) {
      setError('Image URL is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (editingAward.id) {
        await esgCmsApi.updateAward(editingAward.id, editingAward);
        setSuccess('Award updated successfully');
      } else {
        await esgCmsApi.createAward(editingAward);
        setSuccess('Award created successfully');
      }
      
      setShowForm(false);
      setEditingAward(null);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save award');
      }
    }
  };

  const handleSaveHeader = async () => {
    if (!header) return;
    
    if (!header.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await esgCmsApi.saveAwardsSection(header);
      setSuccess('Section header saved successfully');
      setShowHeaderForm(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save section header');
      }
    }
  };

  const handleToggleActive = async (award: Award) => {
    try {
      await esgCmsApi.updateAward(award.id!, {
        ...award,
        isActive: !award.isActive,
      });
      loadData();
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot update: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to update award');
      }
    }
  };

  const handleOrderChange = async (award: Award, newOrder: number) => {
    try {
      await esgCmsApi.updateAward(award.id!, {
        ...award,
        order: newOrder,
      });
      loadData();
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot update: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to update order');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading awards section...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Awards Section</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHeaderForm(!showHeaderForm)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showHeaderForm ? 'Cancel' : 'Edit Header'}
          </button>
          <button
            onClick={handleAddAward}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line mr-2"></i>
            Add Award
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Header Form */}
      {showHeaderForm && header && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Section Header</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={header.title}
                onChange={(e) => setHeader({ ...header, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Awards & Accolades"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="headerActive"
                checked={header.isActive}
                onChange={(e) => setHeader({ ...header, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="headerActive" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveHeader}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Header
              </button>
              <button
                onClick={() => setShowHeaderForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Award Form */}
      {showForm && editingAward && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingAward.id ? 'Edit Award' : 'Add New Award'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={editingAward.title}
                onChange={(e) => setEditingAward({ ...editingAward, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Award Title"
              />
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
                  id="awardImageUpload"
                  disabled={uploadingImage}
                />
                <label
                  htmlFor="awardImageUpload"
                  className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    uploadingImage
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </label>
                {editingAward.image && (
                  <span className="text-sm text-gray-600 truncate max-w-md">
                    {editingAward.image}
                  </span>
                )}
              </div>
              {editingAward.image && (
                <img
                  src={getImageUrl(editingAward.image)}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-contain rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={editingAward.order}
                  onChange={(e) => setEditingAward({ ...editingAward, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="awardActive"
                  checked={editingAward.isActive}
                  onChange={(e) => setEditingAward({ ...editingAward, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="awardActive" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveAward}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingAward.id ? 'Update Award' : 'Create Award'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingAward(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Awards List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Awards ({awards.length})</h3>
        {awards.length === 0 ? (
          <p className="text-gray-500">No awards added yet. Click "Add Award" to create one.</p>
        ) : (
          <div className="space-y-4">
            {awards
              .sort((a, b) => a.order - b.order)
              .map((award) => (
                <div
                  key={award.id}
                  className={`p-4 border rounded-lg ${award.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {award.image && (
                          <img
                            src={getImageUrl(award.image)}
                            alt={award.title}
                            className="w-24 h-24 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900">{award.title}</h4>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${award.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {award.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          Order: {award.order}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditAward(award)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleToggleActive(award)}
                        className={`px-3 py-1 rounded transition-colors ${
                          award.isActive
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        <i className={award.isActive ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                      </button>
                      <button
                        onClick={() => handleOrderChange(award, Math.max(0, award.order - 1))}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        disabled={award.order === 0}
                      >
                        <i className="ri-arrow-up-line"></i>
                      </button>
                      <button
                        onClick={() => handleOrderChange(award, award.order + 1)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <i className="ri-arrow-down-line"></i>
                      </button>
                      <button
                        onClick={() => award.id && handleDeleteAward(award.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

