import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../../services/api';

interface ValueItem {
  id?: number;
  letter?: string;
  title: string;
  description: string;
  image?: string;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
}

export default function CoreValuesSectionCMS() {
  const [values, setValues] = useState<ValueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingValue, setEditingValue] = useState<ValueItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    loadValues();
  }, []);

  const loadValues = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await aboutCmsApi.getValues();
      setValues(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load core values');
      // For demo: use existing data from CoreValuesSection
      setValues([
        {
          id: 1,
          letter: 'P',
          title: 'Principled Excellence',
          description: "Doing what's right, with integrity and intention",
          image: 'https://refex.co.in/wp-content/uploads/2024/11/our-values05.jpg',
          order: 1,
          isActive: true,
        },
        {
          id: 2,
          letter: 'A',
          title: 'Authenticity',
          description: 'Bringing your true self to work, and honouring that in others.',
          image: 'https://refex.co.in/wp-content/uploads/2025/06/our-values032.jpg',
          order: 2,
          isActive: true,
        },
        {
          id: 3,
          letter: 'C',
          title: 'Customer Value',
          description: 'Keeping our customers at the heart of everything we do.',
          image: 'https://refex.co.in/wp-content/uploads/2024/11/our-values01.jpg',
          order: 3,
          isActive: true,
        },
        {
          id: 4,
          letter: 'E',
          title: 'Esteem Culture',
          description: 'Fostering a workplace where respect, dignity, and belonging are everyday experiences.',
          image: 'https://refex.co.in/wp-content/uploads/2024/11/our-values02.jpg',
          order: 4,
          isActive: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value: ValueItem = {
      letter: formData.get('letter') as string || undefined,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: imageUrl || undefined,
      icon: formData.get('icon') as string || undefined,
      color: formData.get('color') as string || undefined,
      order: parseInt(formData.get('order') as string) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      setError('');
      setSuccess('');
      
      if (editingValue?.id) {
        await aboutCmsApi.updateValue(editingValue.id, value);
        setSuccess('Core value updated successfully!');
      } else {
        await aboutCmsApi.createValue(value);
        setSuccess('Core value created successfully!');
      }
      
      setShowForm(false);
      setEditingValue(null);
      setImageUrl('');
      loadValues();
    } catch (err: any) {
      setError(err.message || 'Failed to save core value');
      // For demo: update local state if backend is not available
      if (editingValue?.id) {
        setValues(values.map(v => v.id === editingValue.id ? { ...value, id: editingValue.id } : v));
        setSuccess('Core value updated (demo mode)!');
        setShowForm(false);
        setEditingValue(null);
        setImageUrl('');
      } else {
        const newValue = { ...value, id: Date.now() };
        setValues([...values, newValue]);
        setSuccess('Core value created (demo mode)!');
        setShowForm(false);
        setEditingValue(null);
        setImageUrl('');
      }
    }
  };

  const handleEdit = (value: ValueItem) => {
    setEditingValue(value);
    setImageUrl(value.image || '');
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this core value?')) return;

    try {
      setError('');
      await aboutCmsApi.deleteValue(id);
      setSuccess('Core value deleted successfully!');
      loadValues();
    } catch (err: any) {
      setError(err.message || 'Failed to delete core value');
      // For demo: update local state if backend is not available
      setValues(values.filter(v => v.id !== id));
      setSuccess('Core value deleted (demo mode)!');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingValue(null);
    setImageUrl('');
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
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const sortedValues = [...values].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Core Values Section CMS</h2>
          <p className="text-gray-600 mt-1">Manage core values for the About Us page</p>
        </div>
        <button
          onClick={() => {
            setEditingValue(null);
            setImageUrl('');
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add New Value
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {editingValue ? 'Edit Core Value' : 'Add New Core Value'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Letter (Single character)
                  </label>
                  <input
                    type="text"
                    name="letter"
                    maxLength={1}
                    defaultValue={editingValue?.letter || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="P"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingValue?.title || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    defaultValue={editingValue?.description || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Image
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL *
                  </label>
                  {imageUrl ? (
                    <div className="space-y-2">
                      <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700 break-all">
                        {imageUrl}
                      </div>
                      <div className="mt-2">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-32 h-32 object-cover border border-gray-300 rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-500 italic">
                      No image uploaded yet. Please upload an image above.
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingValue?.order || 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={editingValue?.isActive !== false}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingValue ? 'Update Value' : 'Create Value'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Values List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading core values...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Letter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedValues.map((value) => (
                <tr key={value.id} className={!value.isActive ? 'opacity-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {value.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {value.letter || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={value.image}
                      alt={value.title}
                      className="h-16 w-16 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=No+Image';
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    {value.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                    {value.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        value.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {value.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(value)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => value.id && handleDelete(value.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedValues.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No core values found. Click "Add New Value" to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

