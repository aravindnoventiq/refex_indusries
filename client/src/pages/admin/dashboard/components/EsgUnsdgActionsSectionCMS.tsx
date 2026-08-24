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

interface UnsdgAction {
  id?: number;
  icon: string;
  title: string;
  points: string[];
  video?: string;
  order: number;
  isActive: boolean;
}

interface UnsdgActionsSectionHeader {
  id?: number;
  title: string;
  isActive: boolean;
}

export default function EsgUnsdgActionsSectionCMS() {
  const [header, setHeader] = useState<UnsdgActionsSectionHeader | null>(null);
  const [actions, setActions] = useState<UnsdgAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingAction, setEditingAction] = useState<UnsdgAction | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showHeaderForm, setShowHeaderForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingAction) return;

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
      setEditingAction({ ...editingAction, icon: data.imageUrl });
      setSuccess('Icon uploaded successfully');
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
      const [headerData, actionsData] = await Promise.all([
        esgCmsApi.getUnsdgActionsSection(),
        esgCmsApi.getUnsdgActions(),
      ]);
      setHeader(headerData || null);
      setActions(actionsData || []);
    } catch (err: any) {
      // Only show error if it's not a server availability issue
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load UN SDG Actions section');
      }
      // Fallback to default data
      setHeader({
        title: 'Driving Impact Through UN SDGs',
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAction = () => {
    setEditingAction({
      icon: '',
      title: '',
      points: [''],
      video: '',
      order: actions.length,
      isActive: true,
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEditAction = (action: UnsdgAction) => {
    setEditingAction({ ...action });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteAction = async (id: number) => {
    if (!confirm('Are you sure you want to delete this SDG action?')) {
      return;
    }
    try {
      await esgCmsApi.deleteUnsdgAction(id);
      setSuccess('SDG action deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot delete: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to delete SDG action');
      }
    }
  };

  const handleSaveAction = async () => {
    if (!editingAction) return;
    
    if (!editingAction.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!editingAction.icon.trim()) {
      setError('Icon URL is required');
      return;
    }
    if (!editingAction.points || editingAction.points.length === 0 || editingAction.points.every(p => !p.trim())) {
      setError('At least one point is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      // Filter out empty points
      const filteredPoints = editingAction.points.filter(p => p.trim());
      
      if (editingAction.id) {
        await esgCmsApi.updateUnsdgAction(editingAction.id, {
          ...editingAction,
          points: filteredPoints,
        });
        setSuccess('SDG action updated successfully');
      } else {
        await esgCmsApi.createUnsdgAction({
          ...editingAction,
          points: filteredPoints,
        });
        setSuccess('SDG action created successfully');
      }
      
      setShowForm(false);
      setEditingAction(null);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save SDG action');
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
      await esgCmsApi.saveUnsdgActionsSection(header);
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

  const handleToggleActive = async (action: UnsdgAction) => {
    try {
      await esgCmsApi.updateUnsdgAction(action.id!, {
        ...action,
        isActive: !action.isActive,
      });
      loadData();
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot update: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to update SDG action');
      }
    }
  };

  const handleOrderChange = async (action: UnsdgAction, newOrder: number) => {
    try {
      await esgCmsApi.updateUnsdgAction(action.id!, {
        ...action,
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

  const handleAddPoint = () => {
    if (!editingAction) return;
    setEditingAction({
      ...editingAction,
      points: [...editingAction.points, ''],
    });
  };

  const handleRemovePoint = (index: number) => {
    if (!editingAction) return;
    const newPoints = editingAction.points.filter((_, i) => i !== index);
    setEditingAction({
      ...editingAction,
      points: newPoints.length > 0 ? newPoints : [''],
    });
  };

  const handlePointChange = (index: number, value: string) => {
    if (!editingAction) return;
    const newPoints = [...editingAction.points];
    newPoints[index] = value;
    setEditingAction({
      ...editingAction,
      points: newPoints,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading UN SDG Actions section...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">UN SDG Actions Section</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHeaderForm(!showHeaderForm)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showHeaderForm ? 'Cancel' : 'Edit Header'}
          </button>
          <button
            onClick={handleAddAction}
            className="px-4 py-2 bg-[#7cd244] text-white rounded-lg hover:bg-[#6db038] transition-colors"
          >
            <i className="ri-add-line mr-2"></i>
            Add SDG Action
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7cd244] focus:border-transparent"
                placeholder="Driving Impact Through UN SDGs"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="headerActive"
                checked={header.isActive}
                onChange={(e) => setHeader({ ...header, isActive: e.target.checked })}
                className="w-4 h-4 text-[#4f8f2a] border-gray-300 rounded focus:ring-[#7cd244]"
              />
              <label htmlFor="headerActive" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveHeader}
                className="px-4 py-2 bg-[#7cd244] text-white rounded-lg hover:bg-[#6db038] transition-colors"
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

      {/* Action Form */}
      {showForm && editingAction && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingAction.id ? 'Edit SDG Action' : 'Add New SDG Action'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={editingAction.title}
                onChange={(e) => setEditingAction({ ...editingAction, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7cd244] focus:border-transparent"
                placeholder="Good Health and Well-being"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
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
                      : 'bg-[#7cd244] text-white hover:bg-[#6db038]'
                  }`}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Icon'}
                </label>
                {editingAction.icon && (
                  <span className="text-sm text-gray-600 truncate max-w-md">
                    {editingAction.icon}
                  </span>
                )}
              </div>
              {editingAction.icon && (
                <img
                  src={getImageUrl(editingAction.icon)}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-contain rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points * (one per line)
              </label>
              <div className="space-y-2">
                {editingAction.points.map((point, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => handlePointChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7cd244] focus:border-transparent"
                      placeholder={`Point ${index + 1}`}
                    />
                    {editingAction.points.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePoint(index)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddPoint}
                className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i className="ri-add-line mr-2"></i>
                Add Point
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL (Optional - YouTube embed URL)
              </label>
              <input
                type="text"
                value={editingAction.video || ''}
                onChange={(e) => setEditingAction({ ...editingAction, video: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7cd244] focus:border-transparent"
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
              />
              <p className="mt-1 text-sm text-gray-500">
                Use YouTube embed URL format: https://www.youtube.com/embed/VIDEO_ID
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={editingAction.order}
                  onChange={(e) => setEditingAction({ ...editingAction, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7cd244] focus:border-transparent"
                />
              </div>
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="actionActive"
                  checked={editingAction.isActive}
                  onChange={(e) => setEditingAction({ ...editingAction, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#4f8f2a] border-gray-300 rounded focus:ring-[#7cd244]"
                />
                <label htmlFor="actionActive" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveAction}
                className="px-4 py-2 bg-[#7cd244] text-white rounded-lg hover:bg-[#6db038] transition-colors"
              >
                {editingAction.id ? 'Update SDG Action' : 'Create SDG Action'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingAction(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">SDG Actions ({actions.length})</h3>
        {actions.length === 0 ? (
          <p className="text-gray-500">No SDG actions added yet. Click "Add SDG Action" to create one.</p>
        ) : (
          <div className="space-y-4">
            {actions
              .sort((a, b) => a.order - b.order)
              .map((action) => (
                <div
                  key={action.id}
                  className={`p-4 border rounded-lg ${action.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {action.icon && (
                          <img
                            src={getImageUrl(action.icon)}
                            alt={action.title}
                            className="w-16 h-16 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900">{action.title}</h4>
                          <p className="text-sm text-gray-600">{action.points?.length || 0} points</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${action.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {action.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-1 text-xs bg-[#7cd244]/20 text-[#3f7220] rounded">
                          Order: {action.order}
                        </span>
                      </div>
                      {action.video && (
                        <p className="text-sm text-gray-600 mb-2">
                          <i className="ri-video-line mr-1"></i>
                          Has video
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditAction(action)}
                        className="px-3 py-1 bg-[#7cd244]/20 text-[#3f7220] rounded hover:bg-blue-200 transition-colors"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleToggleActive(action)}
                        className={`px-3 py-1 rounded transition-colors ${
                          action.isActive
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        <i className={action.isActive ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                      </button>
                      <button
                        onClick={() => handleOrderChange(action, Math.max(0, action.order - 1))}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        disabled={action.order === 0}
                      >
                        <i className="ri-arrow-up-line"></i>
                      </button>
                      <button
                        onClick={() => handleOrderChange(action, action.order + 1)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <i className="ri-arrow-down-line"></i>
                      </button>
                      <button
                        onClick={() => action.id && handleDeleteAction(action.id)}
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

