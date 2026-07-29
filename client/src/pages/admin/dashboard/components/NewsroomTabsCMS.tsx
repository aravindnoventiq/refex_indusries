import { useState, useEffect } from 'react';
import { newsroomCmsApi } from '../../../../services/api';

interface NewsroomTab {
  id?: number;
  key: string;
  label: string;
  order: number;
  isActive: boolean;
  isDefault: boolean;
}

export default function NewsroomTabsCMS() {
  const [tabs, setTabs] = useState<NewsroomTab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingTab, setEditingTab] = useState<NewsroomTab | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await newsroomCmsApi.getTabs();
      setTabs(data || []);
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load tabs');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTab = () => {
    setEditingTab({
      key: '',
      label: '',
      order: tabs.length,
      isActive: true,
      isDefault: false,
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEditTab = (tab: NewsroomTab) => {
    setEditingTab({ ...tab });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteTab = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tab?')) {
      return;
    }
    try {
      await newsroomCmsApi.deleteTab(id);
      setSuccess('Tab deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot delete: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to delete tab');
      }
    }
  };

  const handleSaveTab = async () => {
    if (!editingTab) return;
    
    if (!editingTab.key.trim()) {
      setError('Key is required');
      return;
    }
    if (!editingTab.label.trim()) {
      setError('Label is required');
      return;
    }

    // Validate key format (should be lowercase, no spaces, alphanumeric and hyphens)
    const keyRegex = /^[a-z0-9-]+$/;
    if (!keyRegex.test(editingTab.key)) {
      setError('Key must be lowercase, alphanumeric, and can contain hyphens only');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (editingTab.id) {
        await newsroomCmsApi.updateTab(editingTab.id, editingTab);
        setSuccess('Tab updated successfully');
      } else {
        await newsroomCmsApi.createTab(editingTab);
        setSuccess('Tab created successfully');
      }
      
      setShowForm(false);
      setEditingTab(null);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save tab');
      }
    }
  };

  const handleToggleActive = async (tab: NewsroomTab) => {
    try {
      await newsroomCmsApi.updateTab(tab.id!, {
        ...tab,
        isActive: !tab.isActive,
      });
      loadData();
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot update: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to update tab');
      }
    }
  };

  const handleToggleDefault = async (tab: NewsroomTab) => {
    try {
      await newsroomCmsApi.updateTab(tab.id!, {
        ...tab,
        isDefault: !tab.isDefault,
      });
      loadData();
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot update: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to update default tab');
      }
    }
  };

  const handleOrderChange = async (tab: NewsroomTab, newOrder: number) => {
    try {
      await newsroomCmsApi.updateTab(tab.id!, {
        ...tab,
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
          <p className="mt-4 text-gray-600">Loading tabs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Newsroom Tabs</h2>
        <button
          onClick={handleAddTab}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add Tab
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
      {showForm && editingTab && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingTab.id ? 'Edit Tab' : 'Add New Tab'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key * (e.g., "press", "events")
              </label>
              <input
                type="text"
                value={editingTab.key}
                onChange={(e) => setEditingTab({ ...editingTab, key: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="press"
                disabled={!!editingTab.id}
              />
              <p className="mt-1 text-xs text-gray-500">Lowercase, alphanumeric, and hyphens only. Cannot be changed after creation.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label * (Display Name)
              </label>
              <input
                type="text"
                value={editingTab.label}
                onChange={(e) => setEditingTab({ ...editingTab, label: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Press Releases"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={editingTab.order}
                  onChange={(e) => setEditingTab({ ...editingTab, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingTab.isActive}
                  onChange={(e) => setEditingTab({ ...editingTab, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={editingTab.isDefault}
                  onChange={(e) => setEditingTab({ ...editingTab, isDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                  Default Tab
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveTab}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingTab.id ? 'Update Tab' : 'Create Tab'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingTab(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Tabs ({tabs.length})</h3>
        {tabs.length === 0 ? (
          <p className="text-gray-500">No tabs added yet. Click "Add Tab" to create one.</p>
        ) : (
          <div className="space-y-4">
            {tabs
              .sort((a, b) => a.order - b.order)
              .map((tab) => (
                <div
                  key={tab.id}
                  className={`p-4 border rounded-lg ${tab.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{tab.label}</h4>
                          <p className="text-sm text-gray-600">Key: <code className="bg-gray-100 px-2 py-1 rounded">{tab.key}</code></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded ${tab.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {tab.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {tab.isDefault && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            Default
                          </span>
                        )}
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                          Order: {tab.order}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditTab(tab)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleToggleActive(tab)}
                        className={`px-3 py-1 rounded transition-colors ${
                          tab.isActive
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        <i className={tab.isActive ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                      </button>
                      <button
                        onClick={() => handleToggleDefault(tab)}
                        className={`px-3 py-1 rounded transition-colors ${
                          tab.isDefault
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                        title={tab.isDefault ? 'Remove as default' : 'Set as default'}
                      >
                        <i className="ri-star-line"></i>
                      </button>
                      <button
                        onClick={() => handleOrderChange(tab, Math.max(0, tab.order - 1))}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        disabled={tab.order === 0}
                      >
                        <i className="ri-arrow-up-line"></i>
                      </button>
                      <button
                        onClick={() => handleOrderChange(tab, tab.order + 1)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <i className="ri-arrow-down-line"></i>
                      </button>
                      <button
                        onClick={() => tab.id && handleDeleteTab(tab.id)}
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

