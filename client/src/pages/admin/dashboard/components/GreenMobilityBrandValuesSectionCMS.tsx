import { useState, useEffect } from 'react';
import { greenMobilityCmsApi } from '../../../../services/api';

interface BrandValue {
  id?: number;
  title: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export default function GreenMobilityBrandValuesSectionCMS() {
  const [values, setValues] = useState<BrandValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingValue, setEditingValue] = useState<BrandValue | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);

  const handleIconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editingValue) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be less than 10MB');
      return;
    }

    try {
      setUploadingIcon(true);
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
        
        setEditingValue({ ...editingValue, icon: fullImageUrl });
        setSuccess('Icon uploaded successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload icon');
    } finally {
      setUploadingIcon(false);
    }
  };

  useEffect(() => {
    loadValues();
  }, []);

  const loadValues = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await greenMobilityCmsApi.getBrandValues();
      setValues(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load brand values');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingValue({
      title: '',
      icon: '',
      order: values.length,
      isActive: true,
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEdit = (value: BrandValue) => {
    setEditingValue({ ...value });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this brand value?')) {
      return;
    }
    try {
      await greenMobilityCmsApi.deleteBrandValue(id);
      setSuccess('Brand value deleted successfully');
      loadValues();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete brand value');
    }
  };

  const handleSave = async () => {
    if (!editingValue) return;
    
    if (!editingValue.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (editingValue.id) {
        await greenMobilityCmsApi.updateBrandValue(editingValue.id, editingValue);
        setSuccess('Brand value updated successfully');
      } else {
        await greenMobilityCmsApi.createBrandValue(editingValue);
        setSuccess('Brand value created successfully');
      }
      
      setShowForm(false);
      setEditingValue(null);
      loadValues();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save brand value');
    }
  };

  const handleToggleActive = async (value: BrandValue) => {
    try {
      await greenMobilityCmsApi.updateBrandValue(value.id!, {
        ...value,
        isActive: !value.isActive,
      });
      loadValues();
    } catch (err: any) {
      setError(err.message || 'Failed to update brand value');
    }
  };

  const handleOrderChange = async (value: BrandValue, newOrder: number) => {
    try {
      await greenMobilityCmsApi.updateBrandValue(value.id!, {
        ...value,
        order: newOrder,
      });
      loadValues();
    } catch (err: any) {
      setError(err.message || 'Failed to update order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading brand values...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Brand Values Management</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add Brand Value
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

      {showForm && editingValue && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingValue.id ? 'Edit Brand Value' : 'Add Brand Value'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={editingValue.title}
                onChange={(e) => setEditingValue({ ...editingValue, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., RELIABILITY, SUSTAINABILITY, SAFETY"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Icon Image
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  disabled={uploadingIcon}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {uploadingIcon && (
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Uploading...
                  </div>
                )}
              </div>
              {editingValue.icon && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1 break-all">Path: {editingValue.icon}</p>
                  <img 
                    src={editingValue.icon} 
                    alt="Icon Preview" 
                    className="w-24 h-24 object-contain rounded border border-gray-300 bg-[#FF6B35] p-2"
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
                value={editingValue.order}
                onChange={(e) => setEditingValue({ ...editingValue, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={editingValue.isActive}
                onChange={(e) => setEditingValue({ ...editingValue, isActive: e.target.checked })}
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
                setEditingValue(null);
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
            {values.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No brand values found. Click "Add Brand Value" to create one.
                </td>
              </tr>
            ) : (
              values
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((value) => (
                  <tr key={value.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {value.icon ? (
                        <div className="w-16 h-16 flex items-center justify-center bg-[#FF6B35] rounded-lg p-2">
                          <img 
                            src={value.icon} 
                            alt={value.title}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=No+Icon';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                          No Icon
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{value.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={value.order}
                        onChange={(e) => handleOrderChange(value, parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          value.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {value.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(value)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <i className="ri-edit-line"></i> Edit
                      </button>
                      <button
                        onClick={() => value.id && handleDelete(value.id)}
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

