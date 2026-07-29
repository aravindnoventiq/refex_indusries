import { useState, useEffect } from 'react';
import { homeCmsApi } from '../../../../services/api';

interface Business {
  id?: number;
  title: string;
  description: string;
  image: string;
  link: string;
  order: number;
  isActive: boolean;
}

export default function BusinessSectionCMS() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrlFromUpload, setImageUrlFromUpload] = useState(false);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      setError('');
      // Using offerings endpoint - now offerings have image and link fields
      const data = await homeCmsApi.getOfferings();
      // Map offerings to business structure
      const mappedData = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image: item.image || '',
        link: item.link || '',
        order: item.order || 0,
        isActive: item.isActive !== false,
      }));
      setBusinesses(mappedData);
    } catch (err: any) {
      setError(err.message || 'Failed to load businesses');
      // For demo: use existing data from BusinessSection
      setBusinesses([
        {
          id: 1,
          title: 'Ash Utilization and Coal Handling',
          description: 'Providing end-to-end ash handling/disposal, coal yard management, and coal trading solutions for thermal power plants',
          image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/07455fbd11f25781b1c0645ed45ecceb.png',
          link: '/ash-utilization',
          order: 1,
          isActive: true,
        },
        {
          id: 2,
          title: 'Green Mobility',
          description: 'Offering tailored mobility services for corporate commuting and daily rides, with a focus on sustainability through electric four-wheeler fleets.',
          image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/71f2b6479f74d24cab18fe163beff0f1.png',
          link: 'https://refexmobility.com/',
          order: 2,
          isActive: true,
        },
        {
          id: 3,
          title: 'Venwind Refex',
          description: 'Aiming to drive sustainable wind energy adoption nationwide with advanced 5.3 MW wind turbine manufacturing in India',
          image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/14ac7f1fbbb4c730f253c0cc8078f920.png',
          link: 'https://venwindrefex.com/',
          order: 3,
          isActive: true,
        },
        // {
        //   id: 4,
        //   title: 'Refrigerant Gas',
        //   description: 'A leading global supplier specializing in eco-friendly refrigerant gases, equipped with automated filling, rigorous quality control, and certified storage facilities',
        //   image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/a8311a97127f77813e6f7198f947d66c.png',
        //   link: '/refrigerant-gas',
        //   order: 4,
        //   isActive: true,
        // },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!imageUrl) {
      setError('Please upload an image');
      return;
    }
    const business: Business = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: imageUrl,
      link: formData.get('link') as string,
      order: parseInt(formData.get('order') as string) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      setError('');
      setSuccess('');
      
      // Map business to offering structure for API
      const offeringData = {
        title: business.title,
        description: business.description,
        image: business.image,
        link: business.link,
        order: business.order,
        isActive: business.isActive,
      };
      
      if (editingBusiness?.id) {
        await homeCmsApi.updateOffering(editingBusiness.id, offeringData);
        setSuccess('Business updated successfully!');
      } else {
        await homeCmsApi.createOffering(offeringData);
        setSuccess('Business created successfully!');
      }
      
      setShowForm(false);
      setEditingBusiness(null);
      setImageUrl('');
      setImageUrlFromUpload(false);
      loadBusinesses();
    } catch (err: any) {
      setError(err.message || 'Failed to save business');
      // For demo: update local state if backend is not available
      if (editingBusiness?.id) {
        setBusinesses(businesses.map(b => b.id === editingBusiness.id ? { ...business, id: editingBusiness.id } : b));
        setSuccess('Business updated (demo mode)!');
        setShowForm(false);
        setEditingBusiness(null);
        setImageUrl('');
        setImageUrlFromUpload(false);
      } else {
        const newBusiness = { ...business, id: Date.now() };
        setBusinesses([...businesses, newBusiness]);
        setSuccess('Business created (demo mode)!');
        setShowForm(false);
        setEditingBusiness(null);
        setImageUrl('');
        setImageUrlFromUpload(false);
      }
    }
  };

  const handleEdit = (business: Business) => {
    setEditingBusiness(business);
    setImageUrl(business.image || '');
    setImageUrlFromUpload(false);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this business?')) return;

    try {
      setError('');
      await homeCmsApi.deleteOffering(id);
      setSuccess('Business deleted successfully!');
      loadBusinesses();
    } catch (err: any) {
      setError(err.message || 'Failed to delete business');
      // For demo: update local state if backend is not available
      setBusinesses(businesses.filter(b => b.id !== id));
      setSuccess('Business deleted (demo mode)!');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBusiness(null);
    setImageUrl('');
    setImageUrlFromUpload(false);
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
        setImageUrlFromUpload(true);
        setSuccess('Image uploaded successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const sortedBusinesses = [...businesses].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Section CMS</h2>
          <p className="text-gray-600 mt-1">Manage business cards for the home page</p>
        </div>
        <button
          onClick={() => {
            setEditingBusiness(null);
            setImageUrl('');
            setImageUrlFromUpload(false);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add New Business
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
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingBusiness ? 'Edit Business' : 'Add New Business'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingBusiness?.title || ''}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Ash Utilization and Coal Handling"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  defaultValue={editingBusiness?.description || ''}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter business description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
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
                  Image URL *
                </label>
                {imageUrl ? (
                  <div className="space-y-2">
                    <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 break-all">
                      {imageUrl}
                    </div>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="mt-2 w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 italic">
                    No image uploaded yet. Please upload an image above.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link *
                </label>
                <input
                  type="text"
                  name="link"
                  defaultValue={editingBusiness?.link || ''}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., /ash-utilization or /green-mobility"
                />
                <p className="text-xs text-gray-500 mt-1">Relative URL path (e.g., /ash-utilization)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  defaultValue={editingBusiness?.order || 0}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editingBusiness?.isActive !== false}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Active (show on website)</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingBusiness ? 'Update Business' : 'Create Business'}
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
      )}

      {/* Businesses List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading businesses...</p>
        </div>
      ) : sortedBusinesses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <i className="ri-building-line text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">No businesses found. Add your first business to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
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
                {sortedBusinesses.map((business) => (
                  <tr key={business.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={business.image}
                        alt={business.title}
                        className="w-20 h-20 object-cover rounded border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=No+Image';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{business.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-md truncate">
                        {business.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-blue-600">{business.link}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded">
                        {business.order || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          business.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {business.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(business)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <i className="ri-edit-line"></i> Edit
                      </button>
                      <button
                        onClick={() => business.id && handleDelete(business.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <i className="ri-delete-bin-line"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

