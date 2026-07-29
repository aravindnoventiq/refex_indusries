import { useState, useEffect } from 'react';
import { esgCmsApi } from '../../../../services/api';

const API_BASE_URL = "";

interface GovernanceItem {
  id?: number;
  title: string;
  link: string;
  order: number;
  isActive: boolean;
}

interface GovernanceSectionHeader {
  id?: number;
  title: string;
  isActive: boolean;
}

export default function EsgGovernanceSectionCMS() {
  const [header, setHeader] = useState<GovernanceSectionHeader | null>(null);
  const [items, setItems] = useState<GovernanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingItem, setEditingItem] = useState<GovernanceItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showHeaderForm, setShowHeaderForm] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [headerData, itemsData] = await Promise.all([
        esgCmsApi.getGovernanceSection(),
        esgCmsApi.getGovernanceItems(),
      ]);
      setHeader(headerData || null);
      setItems(itemsData || []);
    } catch (err: any) {
      // Only show error if it's not a server availability issue
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load governance section');
      }
      // Fallback to default data
      setHeader({
        title: 'Governance',
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('PDF size should be less than 50MB');
      return;
    }

    setUploadingPdf(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch(`${API_BASE_URL}/api/upload/pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload PDF');
      }

      const data = await response.json();
      setEditingItem({ ...editingItem, link: data.pdfUrl });
      setSuccess('PDF uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload PDF');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleAddItem = () => {
    setEditingItem({
      title: '',
      link: '',
      order: items.length,
      isActive: true,
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEditItem = (item: GovernanceItem) => {
    setEditingItem({ ...item });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this governance item?')) {
      return;
    }
    try {
      await esgCmsApi.deleteGovernanceItem(id);
      setSuccess('Governance item deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot delete: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to delete governance item');
      }
    }
  };

  const handleSaveItem = async () => {
    if (!editingItem) return;
    
    if (!editingItem.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!editingItem.link.trim()) {
      setError('Link URL is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (editingItem.id) {
        await esgCmsApi.updateGovernanceItem(editingItem.id, editingItem);
        setSuccess('Governance item updated successfully');
      } else {
        await esgCmsApi.createGovernanceItem(editingItem);
        setSuccess('Governance item created successfully');
      }
      
      setShowForm(false);
      setEditingItem(null);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save governance item');
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
      await esgCmsApi.saveGovernanceSection(header);
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

  const handleToggleActive = async (item: GovernanceItem) => {
    try {
      await esgCmsApi.updateGovernanceItem(item.id!, {
        ...item,
        isActive: !item.isActive,
      });
      loadData();
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot update: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to update governance item');
      }
    }
  };

  const handleOrderChange = async (item: GovernanceItem, newOrder: number) => {
    try {
      await esgCmsApi.updateGovernanceItem(item.id!, {
        ...item,
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
          <p className="mt-4 text-gray-600">Loading governance section...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Governance Section</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHeaderForm(!showHeaderForm)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showHeaderForm ? 'Cancel' : 'Edit Header'}
          </button>
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line mr-2"></i>
            Add Item
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
                placeholder="Governance"
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

      {/* Item Form */}
      {showForm && editingItem && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem.id ? 'Edit Governance Item' : 'Add New Governance Item'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={editingItem.title}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Grievance Mechanism"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF Document *
              </label>
              <div className="flex items-center gap-4 mb-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                  id="governancePdfUpload"
                  disabled={uploadingPdf}
                />
                <label
                  htmlFor="governancePdfUpload"
                  className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    uploadingPdf
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {uploadingPdf ? 'Uploading...' : 'Upload PDF'}
                </label>
                {editingItem.link && (
                  <span className="text-sm text-gray-600 truncate max-w-md">
                    {editingItem.link}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={editingItem.order}
                  onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="itemActive"
                  checked={editingItem.isActive}
                  onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="itemActive" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingItem.id ? 'Update Item' : 'Create Item'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Governance Items ({items.length})</h3>
        {items.length === 0 ? (
          <p className="text-gray-500">No governance items added yet. Click "Add Item" to create one.</p>
        ) : (
          <div className="space-y-4">
            {items
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg ${item.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600 break-all">{item.link}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          Order: {item.order}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`px-3 py-1 rounded transition-colors ${
                          item.isActive
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        <i className={item.isActive ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                      </button>
                      <button
                        onClick={() => handleOrderChange(item, Math.max(0, item.order - 1))}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        disabled={item.order === 0}
                      >
                        <i className="ri-arrow-up-line"></i>
                      </button>
                      <button
                        onClick={() => handleOrderChange(item, item.order + 1)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <i className="ri-arrow-down-line"></i>
                      </button>
                      <button
                        onClick={() => item.id && handleDeleteItem(item.id)}
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

