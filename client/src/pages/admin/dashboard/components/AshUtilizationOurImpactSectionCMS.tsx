import { useState, useEffect } from 'react';
import { ashUtilizationCmsApi } from '../../../../services/api';

interface Impact {
  id?: number;
  number: string;
  label: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export default function AshUtilizationOurImpactSectionCMS() {
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingImpact, setEditingImpact] = useState<Impact | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);

  const handleIconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editingImpact) return;

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
        
        setEditingImpact({ ...editingImpact, icon: fullImageUrl });
        setSuccess('Icon uploaded successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload icon');
    } finally {
      setUploadingIcon(false);
    }
  };

  useEffect(() => {
    loadImpacts();
  }, []);

  const loadImpacts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ashUtilizationCmsApi.getImpacts();
      setImpacts(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load impacts');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingImpact({
      number: '',
      label: '',
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
    if (!confirm('Are you sure you want to delete this impact stat?')) {
      return;
    }
    try {
      await ashUtilizationCmsApi.deleteImpact(id);
      setSuccess('Impact stat deleted successfully');
      loadImpacts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete impact stat');
    }
  };

  const handleSave = async () => {
    if (!editingImpact) return;
    
    if (!editingImpact.number.trim()) {
      setError('Number is required');
      return;
    }
    if (!editingImpact.label.trim()) {
      setError('Label is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (editingImpact.id) {
        await ashUtilizationCmsApi.updateImpact(editingImpact.id, editingImpact);
        setSuccess('Impact stat updated successfully');
      } else {
        await ashUtilizationCmsApi.createImpact(editingImpact);
        setSuccess('Impact stat created successfully');
      }
      
      setShowForm(false);
      setEditingImpact(null);
      loadImpacts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save impact stat');
    }
  };

  const handleToggleActive = async (impact: Impact) => {
    try {
      await ashUtilizationCmsApi.updateImpact(impact.id!, {
        ...impact,
        isActive: !impact.isActive,
      });
      loadImpacts();
    } catch (err: any) {
      setError(err.message || 'Failed to update impact stat');
    }
  };

  const handleOrderChange = async (impact: Impact, newOrder: number) => {
    try {
      await ashUtilizationCmsApi.updateImpact(impact.id!, {
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
          <p className="mt-4 text-gray-600">Loading impact stats...</p>
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
          Add Impact Stat
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
            {editingImpact.id ? 'Edit Impact Stat' : 'Add Impact Stat'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number *
              </label>
              <input
                type="text"
                value={editingImpact.number}
                onChange={(e) => setEditingImpact({ ...editingImpact, number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 2000+, 40+, 70,000 MT, 15+"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label *
              </label>
              <input
                type="text"
                value={editingImpact.label}
                onChange={(e) => setEditingImpact({ ...editingImpact, label: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Fleet network, Power projects, Ash handled daily"
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
              {editingImpact.icon && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1 break-all">Path: {editingImpact.icon}</p>
                  <img 
                    src={editingImpact.icon} 
                    alt="Icon Preview" 
                    className="w-20 h-20 object-contain rounded border border-gray-300"
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
                Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Label
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
                  No impact stats found. Click "Add Impact Stat" to create one.
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
                          src={impact.icon} 
                          alt={impact.label}
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48?text=No+Icon';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          No Icon
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{impact.number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{impact.label}</div>
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

