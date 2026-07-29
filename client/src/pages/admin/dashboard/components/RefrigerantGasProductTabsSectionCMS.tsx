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

interface ProductTab {
  id?: number;
  tabId: string;
  label: string;
  image?: string;
  order: number;
  isActive: boolean;
}

interface ProductTabPoint {
  id?: number;
  tabId: string;
  title?: string;
  description?: string;
  order: number;
  isActive: boolean;
}

export default function RefrigerantGasProductTabsSectionCMS() {
  const [tabs, setTabs] = useState<ProductTab[]>([]);
  const [points, setPoints] = useState<ProductTabPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTabId, setActiveTabId] = useState<string>('quality');
  const [editingTab, setEditingTab] = useState<ProductTab | null>(null);
  const [editingPoint, setEditingPoint] = useState<ProductTabPoint | null>(null);
  const [showTabForm, setShowTabForm] = useState(false);
  const [showPointForm, setShowPointForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingTab) return;

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
      setEditingTab({ ...editingTab, image: data.imageUrl });
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
      const [tabsData, pointsData] = await Promise.all([
        refrigerantGasCmsApi.getProductTabs(),
        refrigerantGasCmsApi.getProductTabPoints(),
      ]);
      setTabs(tabsData || []);
      setPoints(pointsData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTab = () => {
    setEditingTab({
      tabId: '',
      label: '',
      image: '',
      order: tabs.length,
      isActive: true,
    });
    setShowTabForm(true);
    setError('');
    setSuccess('');
  };

  const handleEditTab = (tab: ProductTab) => {
    setEditingTab({ ...tab });
    setShowTabForm(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteTab = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tab? All points for this tab will also be deleted.')) {
      return;
    }
    try {
      await refrigerantGasCmsApi.deleteProductTab(id);
      setSuccess('Tab deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete tab');
    }
  };

  const handleSaveTab = async () => {
    if (!editingTab) return;
    
    if (!editingTab.tabId.trim()) {
      setError('Tab ID is required');
      return;
    }
    if (!editingTab.label.trim()) {
      setError('Label is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (editingTab.id) {
        await refrigerantGasCmsApi.updateProductTab(editingTab.id, editingTab);
        setSuccess('Tab updated successfully');
      } else {
        await refrigerantGasCmsApi.createProductTab(editingTab);
        setSuccess('Tab created successfully');
      }
      
      setShowTabForm(false);
      setEditingTab(null);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save tab');
    }
  };

  const handleAddPoint = () => {
    setEditingPoint({
      tabId: activeTabId,
      title: '',
      description: '',
      order: points.filter(p => p.tabId === activeTabId).length,
      isActive: true,
    });
    setShowPointForm(true);
    setError('');
    setSuccess('');
  };

  const handleEditPoint = (point: ProductTabPoint) => {
    setEditingPoint({ ...point });
    setShowPointForm(true);
    setError('');
    setSuccess('');
  };

  const handleDeletePoint = async (id: number) => {
    if (!confirm('Are you sure you want to delete this point?')) {
      return;
    }
    try {
      await refrigerantGasCmsApi.deleteProductTabPoint(id);
      setSuccess('Point deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete point');
    }
  };

  const handleSavePoint = async () => {
    if (!editingPoint) return;
    
    if (!editingPoint.tabId.trim()) {
      setError('Tab ID is required');
      return;
    }
    if (!editingPoint.title && !editingPoint.description) {
      setError('Either title or description is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (editingPoint.id) {
        await refrigerantGasCmsApi.updateProductTabPoint(editingPoint.id, editingPoint);
        setSuccess('Point updated successfully');
      } else {
        await refrigerantGasCmsApi.createProductTabPoint(editingPoint);
        setSuccess('Point created successfully');
      }
      
      setShowPointForm(false);
      setEditingPoint(null);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save point');
    }
  };

  const handleToggleTabActive = async (tab: ProductTab) => {
    try {
      await refrigerantGasCmsApi.updateProductTab(tab.id!, {
        ...tab,
        isActive: !tab.isActive,
      });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update tab');
    }
  };

  const handleTogglePointActive = async (point: ProductTabPoint) => {
    try {
      await refrigerantGasCmsApi.updateProductTabPoint(point.id!, {
        ...point,
        isActive: !point.isActive,
      });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update point');
    }
  };

  const handleOrderChange = async (point: ProductTabPoint, newOrder: number) => {
    try {
      await refrigerantGasCmsApi.updateProductTabPoint(point.id!, {
        ...point,
        order: newOrder,
      });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading product tabs...</p>
        </div>
      </div>
    );
  }

  const activeTabPoints = points
    .filter(p => p.tabId === activeTabId && p.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const activeTabs = tabs.filter(t => t.isActive).sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Product Tabs Management</h2>
        <button
          onClick={handleAddTab}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add Tab
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

      {/* Tab Management */}
      {showTabForm && editingTab && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingTab.id ? 'Edit Tab' : 'Add Tab'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tab ID * (e.g., quality, safety, applications)
              </label>
              <input
                type="text"
                value={editingTab.tabId}
                onChange={(e) => setEditingTab({ ...editingTab, tabId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., quality"
                required
                disabled={!!editingTab.id}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label *
              </label>
              <input
                type="text"
                value={editingTab.label}
                onChange={(e) => setEditingTab({ ...editingTab, label: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Product Quality"
                required
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
                  id="tabImageUpload"
                  disabled={uploadingImage}
                />
                <label
                  htmlFor="tabImageUpload"
                  className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    uploadingImage
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </label>
                {editingTab.image && (
                  <span className="text-sm text-gray-600 truncate max-w-md">
                    {editingTab.image}
                  </span>
                )}
              </div>
              {editingTab.image && (
                <div className="mt-2">
                  <img 
                    src={getImageUrl(editingTab.image)} 
                    alt="Image Preview" 
                    className="w-full max-w-md h-auto object-cover rounded-lg border border-gray-300"
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
                value={editingTab.order}
                onChange={(e) => setEditingTab({ ...editingTab, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="tabIsActive"
                checked={editingTab.isActive}
                onChange={(e) => setEditingTab({ ...editingTab, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="tabIsActive" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSaveTab}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowTabForm(false);
                setEditingTab(null);
                setError('');
              }}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tabs List */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Tabs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {activeTabs.map((tab) => (
            <div
              key={tab.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                activeTabId === tab.tabId
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setActiveTabId(tab.tabId)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-900">{tab.label}</h4>
                  <p className="text-sm text-gray-600">ID: {tab.tabId}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTab(tab);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <i className="ri-edit-line"></i>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      tab.id && handleDeleteTab(tab.id);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Points Management for Active Tab */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Points for "{activeTabs.find(t => t.tabId === activeTabId)?.label || activeTabId}"
          </h3>
          <button
            onClick={handleAddPoint}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <i className="ri-add-line mr-2"></i>
            Add Point
          </button>
        </div>

        {showPointForm && editingPoint && (
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              {editingPoint.id ? 'Edit Point' : 'Add Point'}
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tab ID *
                </label>
                <select
                  value={editingPoint.tabId}
                  onChange={(e) => setEditingPoint({ ...editingPoint, tabId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {activeTabs.map(tab => (
                    <option key={tab.id} value={tab.tabId}>{tab.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Optional - leave empty for applications tab)
                </label>
                <input
                  type="text"
                  value={editingPoint.title || ''}
                  onChange={(e) => setEditingPoint({ ...editingPoint, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Purity and Commitment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={editingPoint.description || ''}
                  onChange={(e) => setEditingPoint({ ...editingPoint, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Enter description..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={editingPoint.order}
                  onChange={(e) => setEditingPoint({ ...editingPoint, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pointIsActive"
                  checked={editingPoint.isActive}
                  onChange={(e) => setEditingPoint({ ...editingPoint, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="pointIsActive" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSavePoint}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowPointForm(false);
                  setEditingPoint(null);
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
              {activeTabPoints.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No points found for this tab. Click "Add Point" to create one.
                  </td>
                </tr>
              ) : (
                activeTabPoints.map((point) => (
                  <tr key={point.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{point.title || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-md truncate">{point.description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={point.order}
                        onChange={(e) => handleOrderChange(point, parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePointActive(point)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          point.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {point.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditPoint(point)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <i className="ri-edit-line"></i> Edit
                      </button>
                      <button
                        onClick={() => point.id && handleDeletePoint(point.id)}
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
    </div>
  );
}

