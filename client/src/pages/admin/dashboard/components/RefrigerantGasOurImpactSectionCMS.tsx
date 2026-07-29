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

interface Impact {
  id?: number;
  title: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export default function RefrigerantGasOurImpactSectionCMS() {
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingImpact, setEditingImpact] = useState<Impact | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingImpact) return;

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
      setEditingImpact({ ...editingImpact, icon: data.imageUrl });
      setSuccess('Icon uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    loadImpacts();
  }, []);

  const loadImpacts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await refrigerantGasCmsApi.getImpacts();
      setImpacts(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load impacts');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingImpact({
      title: '',
      description: '',
      icon: '',
      order: impacts.length,
      isActive: true,
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEdit = (impact: Impact) => {
    setEditingImpact({ ...impact });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this impact?')) {
      return;
    }
    try {
      await refrigerantGasCmsApi.deleteImpact(id);
      setSuccess('Impact deleted successfully');
      loadImpacts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete impact');
    }
  };

  const handleSave = async () => {
    if (!editingImpact) return;
    
    if (!editingImpact.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (editingImpact.id) {
        await refrigerantGasCmsApi.updateImpact(editingImpact.id, editingImpact);
        setSuccess('Impact updated successfully');
      } else {
        await refrigerantGasCmsApi.createImpact(editingImpact);
        setSuccess('Impact created successfully');
      }
      
      setShowForm(false);
      setEditingImpact(null);
      loadImpacts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save impact');
    }
  };

  const handleToggleActive = async (impact: Impact) => {
    try {
      await refrigerantGasCmsApi.updateImpact(impact.id!, {
        ...impact,
        isActive: !impact.isActive,
      });
      loadImpacts();
    } catch (err: any) {
      setError(err.message || 'Failed to update impact');
    }
  };

  const handleOrderChange = async (impact: Impact, newOrder: number) => {
    try {
      await refrigerantGasCmsApi.updateImpact(impact.id!, {
        ...impact,
        order: newOrder,
      });
      loadImpacts();
    } catch (err: any) {
      setError(err.message || 'Failed to update order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading impacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Our Impact - Stats Management</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add Impact
        </button>
      </div>

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

      {showForm && editingImpact && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingImpact.id ? 'Edit Impact' : 'Add Impact'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={editingImpact.title}
                onChange={(e) => setEditingImpact({ ...editingImpact, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 450 +, Delhi & Mumbai, Tamil Nadu"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={editingImpact.description || ''}
                onChange={(e) => setEditingImpact({ ...editingImpact, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Dealers and Distributions, Warehouses, Refilling Facility"
                rows={3}
              />
              <p className="mt-1 text-sm text-gray-500">You can use \n for line breaks</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon Image
              </label>
              <div className="flex items-center gap-4 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="iconImageUpload"
                  disabled={uploadingImage}
                />
                <label
                  htmlFor="iconImageUpload"
                  className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    uploadingImage
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Icon'}
                </label>
                {editingImpact.icon && (
                  <span className="text-sm text-gray-600 truncate max-w-md">
                    {editingImpact.icon}
                  </span>
                )}
              </div>
              {editingImpact.icon && (
                <div className="mt-2">
                  <img 
                    src={getImageUrl(editingImpact.icon)} 
                    alt="Icon Preview" 
                    className="w-16 h-16 object-contain rounded border border-gray-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                value={editingImpact.order}
                onChange={(e) => setEditingImpact({ ...editingImpact, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={editingImpact.isActive}
                onChange={(e) => setEditingImpact({ ...editingImpact, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingImpact(null);
                setError('');
              }}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Icon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {impacts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No impacts found. Click "Add Impact" to create one.
                </td>
              </tr>
            ) : (
              impacts
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((impact) => (
                  <tr key={impact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {impact.icon ? (
                        <img 
                          src={getImageUrl(impact.icon)} 
                          alt={impact.title}
                          className="w-16 h-16 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=No+Icon';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          No Icon
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{impact.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">{impact.description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={impact.order}
                        onChange={(e) => handleOrderChange(impact, parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(impact)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          impact.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {impact.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(impact)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <i className="ri-edit-line"></i> Edit
                      </button>
                      <button
                        onClick={() => impact.id && handleDelete(impact.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <i className="ri-delete-bin-line"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

