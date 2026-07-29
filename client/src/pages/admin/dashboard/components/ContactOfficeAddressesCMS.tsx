import { useState, useEffect } from 'react';
import { contactCmsApi } from '../../../../services/api';

interface OfficeAddress {
  id?: number;
  title: string;
  details: string[];
  image?: string;
  isTopOffice: boolean;
  order: number;
  isActive: boolean;
}

export default function ContactOfficeAddressesCMS() {
  const [addresses, setAddresses] = useState<OfficeAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingAddress, setEditingAddress] = useState<OfficeAddress | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await contactCmsApi.getOfficeAddresses();
      setAddresses(data || []);
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load office addresses');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress({
      title: '',
      details: [''],
      image: '',
      isTopOffice: false,
      order: addresses.length,
      isActive: true,
    });
    setImageUrl('');
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEditAddress = (address: OfficeAddress) => {
    setEditingAddress({ ...address });
    setImageUrl(address.image || '');
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('Are you sure you want to delete this office address?')) {
      return;
    }
    try {
      await contactCmsApi.deleteOfficeAddress(id);
      setSuccess('Office address deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot delete: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to delete office address');
      }
    }
  };

  const handleSaveAddress = async () => {
    if (!editingAddress) return;
    
    if (!editingAddress.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!editingAddress.details || editingAddress.details.length === 0 || !editingAddress.details.some(d => d.trim())) {
      setError('At least one detail line is required');
      return;
    }
    if (editingAddress.isTopOffice && !imageUrl?.trim()) {
      setError('Image is required for top office addresses. Please upload an image.');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      // Filter out empty detail lines
      const filteredDetails = editingAddress.details.filter(d => d.trim());
      
      const addressData = {
        ...editingAddress,
        image: imageUrl || undefined,
        details: filteredDetails,
      };
      
      if (editingAddress.id) {
        await contactCmsApi.updateOfficeAddress(editingAddress.id, addressData);
        setSuccess('Office address updated successfully');
      } else {
        await contactCmsApi.createOfficeAddress(addressData);
        setSuccess('Office address created successfully');
      }
      
      setShowForm(false);
      setEditingAddress(null);
      setImageUrl('');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save office address');
      }
    }
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

  const handleToggleActive = async (address: OfficeAddress) => {
    try {
      await contactCmsApi.updateOfficeAddress(address.id!, {
        ...address,
        isActive: !address.isActive,
      });
      loadData();
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot update: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to update office address');
      }
    }
  };

  const handleOrderChange = async (address: OfficeAddress, newOrder: number) => {
    try {
      await contactCmsApi.updateOfficeAddress(address.id!, {
        ...address,
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

  const addDetailLine = () => {
    if (editingAddress) {
      setEditingAddress({
        ...editingAddress,
        details: [...editingAddress.details, ''],
      });
    }
  };

  const removeDetailLine = (index: number) => {
    if (editingAddress && editingAddress.details.length > 1) {
      setEditingAddress({
        ...editingAddress,
        details: editingAddress.details.filter((_, i) => i !== index),
      });
    }
  };

  const updateDetailLine = (index: number, value: string) => {
    if (editingAddress) {
      const newDetails = [...editingAddress.details];
      newDetails[index] = value;
      setEditingAddress({
        ...editingAddress,
        details: newDetails,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading office addresses...</p>
        </div>
      </div>
    );
  }

  const topOffices = addresses.filter(a => a.isTopOffice).sort((a, b) => a.order - b.order);
  const bottomOffices = addresses.filter(a => !a.isTopOffice).sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Office Addresses</h2>
        <button
          onClick={handleAddAddress}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add Office Address
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
      {showForm && editingAddress && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingAddress.id ? 'Edit Office Address' : 'Add New Office Address'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={editingAddress.title}
                onChange={(e) => setEditingAddress({ ...editingAddress, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Registered Office"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Details * (One line per address detail)
              </label>
              {editingAddress.details.map((detail, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={detail}
                    onChange={(e) => updateDetailLine(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Detail line ${index + 1}`}
                  />
                  {editingAddress.details.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDetailLine(index)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addDetailLine}
                className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i className="ri-add-line mr-2"></i>
                Add Detail Line
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image {editingAddress.isTopOffice && '*'}
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage || !editingAddress.isTopOffice}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {uploadingImage && (
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Uploading...
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Upload an image file (max 10MB) {!editingAddress.isTopOffice && '(Enable "Top Office" to upload image)'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL {editingAddress.isTopOffice && '*'}
              </label>
              {imageUrl ? (
                <div className="space-y-2">
                  <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 break-all">
                    {imageUrl}
                  </div>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="mt-2 w-full max-w-md h-48 object-cover rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 italic">
                  {editingAddress.isTopOffice 
                    ? 'No image uploaded yet. Please upload an image above.' 
                    : 'Enable "Top Office" to upload an image.'}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={editingAddress.order}
                  onChange={(e) => setEditingAddress({ ...editingAddress, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="isTopOffice"
                  checked={editingAddress.isTopOffice}
                  onChange={(e) => setEditingAddress({ ...editingAddress, isTopOffice: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isTopOffice" className="ml-2 text-sm text-gray-700">
                  Top Office (with image)
                </label>
              </div>
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingAddress.isActive}
                  onChange={(e) => setEditingAddress({ ...editingAddress, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveAddress}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingAddress.id ? 'Update Address' : 'Create Address'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingAddress(null);
                  setImageUrl('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Addresses List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Office Addresses ({addresses.length})</h3>
        {addresses.length === 0 ? (
          <p className="text-gray-500">No office addresses added yet. Click "Add Office Address" to create one.</p>
        ) : (
          <div className="space-y-6">
            {/* Top Offices */}
            {topOffices.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-3 text-gray-700">Top Offices (with images)</h4>
                <div className="space-y-4">
                  {topOffices.map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      onEdit={handleEditAddress}
                      onDelete={handleDeleteAddress}
                      onToggleActive={handleToggleActive}
                      onOrderChange={handleOrderChange}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Offices */}
            {bottomOffices.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-3 text-gray-700">Bottom Offices (without images)</h4>
                <div className="space-y-4">
                  {bottomOffices.map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      onEdit={handleEditAddress}
                      onDelete={handleDeleteAddress}
                      onToggleActive={handleToggleActive}
                      onOrderChange={handleOrderChange}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AddressCard({
  address,
  onEdit,
  onDelete,
  onToggleActive,
  onOrderChange,
}: {
  address: OfficeAddress;
  onEdit: (address: OfficeAddress) => void;
  onDelete: (id: number) => void;
  onToggleActive: (address: OfficeAddress) => void;
  onOrderChange: (address: OfficeAddress, newOrder: number) => void;
}) {
  return (
    <div
      className={`p-4 border rounded-lg ${address.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {address.image && (
              <img
                src={address.image}
                alt={address.title}
                className="w-24 h-24 object-cover rounded-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{address.title}</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {address.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-1 text-xs rounded ${address.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {address.isActive ? 'Active' : 'Inactive'}
            </span>
            <span className={`px-2 py-1 text-xs rounded ${address.isTopOffice ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
              {address.isTopOffice ? 'Top Office' : 'Bottom Office'}
            </span>
            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
              Order: {address.order}
            </span>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(address)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            <i className="ri-edit-line"></i>
          </button>
          <button
            onClick={() => onToggleActive(address)}
            className={`px-3 py-1 rounded transition-colors ${
              address.isActive
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            <i className={address.isActive ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
          </button>
          <button
            onClick={() => onOrderChange(address, Math.max(0, address.order - 1))}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            disabled={address.order === 0}
          >
            <i className="ri-arrow-up-line"></i>
          </button>
          <button
            onClick={() => onOrderChange(address, address.order + 1)}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            <i className="ri-arrow-down-line"></i>
          </button>
          <button
            onClick={() => address.id && onDelete(address.id)}
            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            <i className="ri-delete-bin-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

