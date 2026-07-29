import { useState, useEffect } from 'react';
import { newsroomCmsApi } from '../../../../services/api';

interface PressRelease {
  id?: number;
  title: string;
  date: string;
  source: string;
  image: string;
  link: string;
  isVideo?: boolean;
  order: number;
  isActive: boolean;
}

export default function NewsroomPressReleasesCMS() {
  const [releases, setReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingRelease, setEditingRelease] = useState<PressRelease | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await newsroomCmsApi.getPressReleases();
      setReleases(data || []);
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load press releases');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddRelease = () => {
    setEditingRelease({
      title: '',
      date: '',
      source: '',
      image: '',
      link: '',
      isVideo: false,
      order: releases.length,
      isActive: true,
    });
    setImageUrl('');
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEditRelease = (release: PressRelease) => {
    setEditingRelease({ ...release });
    setImageUrl(release.image || '');
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteRelease = async (id: number) => {
    if (!confirm('Are you sure you want to delete this press release?')) {
      return;
    }
    try {
      await newsroomCmsApi.deletePressRelease(id);
      setSuccess('Press release deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot delete: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to delete press release');
      }
    }
  };

  const handleSaveRelease = async () => {
    if (!editingRelease) return;
    
    if (!editingRelease.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!editingRelease.date.trim()) {
      setError('Date is required');
      return;
    }
    if (!editingRelease.source.trim()) {
      setError('Source is required');
      return;
    }
    if (!imageUrl.trim()) {
      setError('Image is required. Please upload an image.');
      return;
    }
    if (!editingRelease.link.trim()) {
      setError('Link URL is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      const releaseData = {
        ...editingRelease,
        image: imageUrl,
      };
      
      if (editingRelease.id) {
        await newsroomCmsApi.updatePressRelease(editingRelease.id, releaseData);
        setSuccess('Press release updated successfully');
      } else {
        await newsroomCmsApi.createPressRelease(releaseData);
        setSuccess('Press release created successfully');
      }
      
      setShowForm(false);
      setEditingRelease(null);
      setImageUrl('');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save press release');
      }
    }
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
        setSuccess('Image uploaded successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleToggleActive = async (release: PressRelease) => {
    try {
      await newsroomCmsApi.updatePressRelease(release.id!, {
        ...release,
        isActive: !release.isActive,
      });
      loadData();
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot update: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to update press release');
      }
    }
  };

  const handleOrderChange = async (release: PressRelease, newOrder: number) => {
    try {
      await newsroomCmsApi.updatePressRelease(release.id!, {
        ...release,
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
          <p className="mt-4 text-gray-600">Loading press releases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Press Releases</h2>
        <button
          onClick={handleAddRelease}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add Press Release
        </button>
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

      {/* Form */}
      {showForm && editingRelease && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingRelease.id ? 'Edit Press Release' : 'Add New Press Release'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={editingRelease.title}
                onChange={(e) => setEditingRelease({ ...editingRelease, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Press Release Title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="text"
                  value={editingRelease.date}
                  onChange={(e) => setEditingRelease({ ...editingRelease, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="November 11, 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source *
                </label>
                <input
                  type="text"
                  value={editingRelease.source}
                  onChange={(e) => setEditingRelease({ ...editingRelease, source: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ET NOW"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image *
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
                Image URL
              </label>
              {imageUrl ? (
                <div className="space-y-2">
                  <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 break-all">
                    {imageUrl}
                  </div>
                  <div className="mt-2">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 italic">
                  No image uploaded yet. Please upload an image above.
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link URL *
              </label>
              <input
                type="text"
                value={editingRelease.link}
                onChange={(e) => setEditingRelease({ ...editingRelease, link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/article"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={editingRelease.order}
                  onChange={(e) => setEditingRelease({ ...editingRelease, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="isVideo"
                  checked={editingRelease.isVideo || false}
                  onChange={(e) => setEditingRelease({ ...editingRelease, isVideo: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isVideo" className="ml-2 text-sm text-gray-700">
                  Is Video
                </label>
              </div>
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingRelease.isActive}
                  onChange={(e) => setEditingRelease({ ...editingRelease, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveRelease}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingRelease.id ? 'Update Release' : 'Create Release'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingRelease(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Releases List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Press Releases ({releases.length})</h3>
        {releases.length === 0 ? (
          <p className="text-gray-500">No press releases added yet. Click "Add Press Release" to create one.</p>
        ) : (
          <div className="space-y-4">
            {releases
              .sort((a, b) => {
                // Sort by order first, then by date descending
                if (a.order !== b.order) {
                  return a.order - b.order;
                }
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return dateB - dateA;
              })
              .map((release) => (
                <div
                  key={release.id}
                  className={`p-4 border rounded-lg ${release.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {release.image && (
                          <img
                            src={release.image}
                            alt={release.title}
                            className="w-24 h-24 object-cover rounded-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{release.title}</h4>
                          <p className="text-sm text-gray-600">{release.date} • {release.source}</p>
                          {release.isVideo && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                              Video
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 break-all">{release.link}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded ${release.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {release.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          Order: {release.order}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditRelease(release)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleToggleActive(release)}
                        className={`px-3 py-1 rounded transition-colors ${
                          release.isActive
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        <i className={release.isActive ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                      </button>
                      <button
                        onClick={() => handleOrderChange(release, Math.max(0, release.order - 1))}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        disabled={release.order === 0}
                      >
                        <i className="ri-arrow-up-line"></i>
                      </button>
                      <button
                        onClick={() => handleOrderChange(release, release.order + 1)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <i className="ri-arrow-down-line"></i>
                      </button>
                      <button
                        onClick={() => release.id && handleDeleteRelease(release.id)}
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

