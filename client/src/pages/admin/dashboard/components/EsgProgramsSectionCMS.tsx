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

interface Program {
  id?: number;
  title: string;
  image: string;
  content: string;
  order: number;
  isActive: boolean;
}

interface ProgramsSectionHeader {
  id?: number;
  title: string;
  isActive: boolean;
}

export default function EsgProgramsSectionCMS() {
  const [header, setHeader] = useState<ProgramsSectionHeader | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showHeaderForm, setShowHeaderForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProgram) return;

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
      setEditingProgram({ ...editingProgram, image: data.imageUrl });
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
      const [headerData, programsData] = await Promise.all([
        esgCmsApi.getProgramsSection(),
        esgCmsApi.getPrograms(),
      ]);
      setHeader(headerData || null);
      setPrograms(programsData || []);
    } catch (err: any) {
      // Only show error if it's not a server availability issue
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load programs section');
      }
      // Fallback to default data
      setHeader({
        title: 'PROGRAMS',
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgram = () => {
    setEditingProgram({
      title: '',
      image: '',
      content: '',
      order: programs.length,
      isActive: true,
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram({ ...program });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteProgram = async (id: number) => {
    if (!confirm('Are you sure you want to delete this program?')) {
      return;
    }
    try {
      await esgCmsApi.deleteProgram(id);
      setSuccess('Program deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot delete: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to delete program');
      }
    }
  };

  const handleSaveProgram = async () => {
    if (!editingProgram) return;
    
    if (!editingProgram.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!editingProgram.image.trim()) {
      setError('Image URL is required');
      return;
    }
    if (!editingProgram.content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (editingProgram.id) {
        await esgCmsApi.updateProgram(editingProgram.id, editingProgram);
        setSuccess('Program updated successfully');
      } else {
        await esgCmsApi.createProgram(editingProgram);
        setSuccess('Program created successfully');
      }
      
      setShowForm(false);
      setEditingProgram(null);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save program');
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
      await esgCmsApi.saveProgramsSection(header);
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

  const handleToggleActive = async (program: Program) => {
    try {
      await esgCmsApi.updateProgram(program.id!, {
        ...program,
        isActive: !program.isActive,
      });
      loadData();
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot update: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to update program');
      }
    }
  };

  const handleOrderChange = async (program: Program, newOrder: number) => {
    try {
      await esgCmsApi.updateProgram(program.id!, {
        ...program,
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
          <p className="mt-4 text-gray-600">Loading programs section...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Programs Section</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHeaderForm(!showHeaderForm)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showHeaderForm ? 'Cancel' : 'Edit Header'}
          </button>
          <button
            onClick={handleAddProgram}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line mr-2"></i>
            Add Program
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
                placeholder="PROGRAMS"
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

      {/* Program Form */}
      {showForm && editingProgram && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingProgram.id ? 'Edit Program' : 'Add New Program'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={editingProgram.title}
                onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Energy Transition Program"
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
                  id="programImageUpload"
                  disabled={uploadingImage}
                />
                <label
                  htmlFor="programImageUpload"
                  className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    uploadingImage
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </label>
                {editingProgram.image && (
                  <span className="text-sm text-gray-600 truncate max-w-md">
                    {editingProgram.image}
                  </span>
                )}
              </div>
              {editingProgram.image && (
                <img
                  src={getImageUrl(editingProgram.image)}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content * (HTML supported)
              </label>
              <textarea
                value={editingProgram.content}
                onChange={(e) => setEditingProgram({ ...editingProgram, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter program content. You can use HTML tags like &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;, etc."
              />
              <p className="mt-1 text-sm text-gray-500">
                You can use HTML tags like &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={editingProgram.order}
                  onChange={(e) => setEditingProgram({ ...editingProgram, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="programActive"
                  checked={editingProgram.isActive}
                  onChange={(e) => setEditingProgram({ ...editingProgram, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="programActive" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveProgram}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingProgram.id ? 'Update Program' : 'Create Program'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProgram(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Programs List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Programs ({programs.length})</h3>
        {programs.length === 0 ? (
          <p className="text-gray-500">No programs added yet. Click "Add Program" to create one.</p>
        ) : (
          <div className="space-y-4">
            {programs
              .sort((a, b) => a.order - b.order)
              .map((program) => (
                <div
                  key={program.id}
                  className={`p-4 border rounded-lg ${program.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{program.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded ${program.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {program.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          Order: {program.order}
                        </span>
                      </div>
                      {program.image && (
                        <img
                          src={getImageUrl(program.image)}
                          alt={program.title}
                          className="w-24 h-24 object-cover rounded mb-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: program.content.substring(0, 100) + '...' }} />
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditProgram(program)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleToggleActive(program)}
                        className={`px-3 py-1 rounded transition-colors ${
                          program.isActive
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        <i className={program.isActive ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                      </button>
                      <button
                        onClick={() => handleOrderChange(program, Math.max(0, program.order - 1))}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        disabled={program.order === 0}
                      >
                        <i className="ri-arrow-up-line"></i>
                      </button>
                      <button
                        onClick={() => handleOrderChange(program, program.order + 1)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <i className="ri-arrow-down-line"></i>
                      </button>
                      <button
                        onClick={() => program.id && handleDeleteProgram(program.id)}
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

