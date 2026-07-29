import { useState, useEffect } from 'react';
import { ashUtilizationCmsApi } from '../../../../services/api';

interface Client {
  id?: number;
  category: 'thermal' | 'cement' | 'concessionaires';
  image: string;
  order: number;
  isActive: boolean;
}

const categoryLabels = {
  thermal: 'Thermal Power Plant',
  cement: 'Cement Companies',
  concessionaires: 'Concessionaires',
};

export default function AshUtilizationClientsSectionCMS() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'thermal' | 'cement' | 'concessionaires'>('all');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editingClient) return;

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
        
        setEditingClient({ ...editingClient, image: fullImageUrl });
        setSuccess('Image uploaded successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ashUtilizationCmsApi.getClients();
      setClients(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (category?: 'thermal' | 'cement' | 'concessionaires') => {
    setEditingClient({
      category: category || 'thermal',
      image: '',
      order: clients.filter(c => c.category === (category || 'thermal')).length,
      isActive: true,
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEdit = (client: Client) => {
    setEditingClient({ ...client });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this client?')) {
      return;
    }
    try {
      await ashUtilizationCmsApi.deleteClient(id);
      setSuccess('Client deleted successfully');
      loadClients();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete client');
    }
  };

  const handleSave = async () => {
    if (!editingClient) return;
    
    if (!editingClient.image.trim()) {
      setError('Image URL is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (editingClient.id) {
        await ashUtilizationCmsApi.updateClient(editingClient.id, editingClient);
        setSuccess('Client updated successfully');
      } else {
        await ashUtilizationCmsApi.createClient(editingClient);
        setSuccess('Client created successfully');
      }
      
      setShowForm(false);
      setEditingClient(null);
      loadClients();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save client');
    }
  };

  const handleToggleActive = async (client: Client) => {
    try {
      await ashUtilizationCmsApi.updateClient(client.id!, {
        ...client,
        isActive: !client.isActive,
      });
      loadClients();
    } catch (err: any) {
      setError(err.message || 'Failed to update client');
    }
  };

  const handleOrderChange = async (client: Client, newOrder: number) => {
    try {
      await ashUtilizationCmsApi.updateClient(client.id!, {
        ...client,
        order: newOrder,
      });
      loadClients();
    } catch (err: any) {
      setError(err.message || 'Failed to update order');
    }
  };

  const filteredClients = selectedCategory === 'all'
    ? clients
    : clients.filter(c => c.category === selectedCategory);

  const groupedClients = {
    thermal: clients.filter(c => c.category === 'thermal').sort((a, b) => (a.order || 0) - (b.order || 0)),
    cement: clients.filter(c => c.category === 'cement').sort((a, b) => (a.order || 0) - (b.order || 0)),
    concessionaires: clients.filter(c => c.category === 'concessionaires').sort((a, b) => (a.order || 0) - (b.order || 0)),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Clients Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleAdd('thermal')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <i className="ri-add-line mr-2"></i>
            Add Thermal Client
          </button>
          <button
            onClick={() => handleAdd('cement')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <i className="ri-add-line mr-2"></i>
            Add Cement Client
          </button>
          <button
            onClick={() => handleAdd('concessionaires')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            <i className="ri-add-line mr-2"></i>
            Add Concessionaire
          </button>
        </div>
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

      {/* Category Filter */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Categories
        </button>
        <button
          onClick={() => setSelectedCategory('thermal')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === 'thermal'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Thermal Power Plant
        </button>
        <button
          onClick={() => setSelectedCategory('cement')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === 'cement'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Cement Companies
        </button>
        <button
          onClick={() => setSelectedCategory('concessionaires')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === 'concessionaires'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Concessionaires
        </button>
      </div>

      {showForm && editingClient && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingClient.id ? 'Edit Client' : 'Add Client'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={editingClient.category}
                onChange={(e) => setEditingClient({ ...editingClient, category: e.target.value as 'thermal' | 'cement' | 'concessionaires' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="thermal">Thermal Power Plant</option>
                <option value="cement">Cement Companies</option>
                <option value="concessionaires">Concessionaires</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image *
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {uploadingImage && (
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Uploading...
                  </div>
                )}
              </div>
              {editingClient.image && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1 break-all">Path: {editingClient.image}</p>
                  <img 
                    src={editingClient.image} 
                    alt="Client Logo Preview" 
                    className="w-48 h-32 object-contain rounded border border-gray-300 bg-white p-2"
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
                value={editingClient.order}
                onChange={(e) => setEditingClient({ ...editingClient, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={editingClient.isActive}
                onChange={(e) => setEditingClient({ ...editingClient, isActive: e.target.checked })}
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
                setEditingClient(null);
                setError('');
              }}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Grouped View */}
      {selectedCategory === 'all' ? (
        <div className="space-y-8">
          {(['thermal', 'cement', 'concessionaires'] as const).map((category) => (
            <div key={category} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">{categoryLabels[category]}</h3>
                <span className="text-sm text-gray-500">
                  {groupedClients[category].length} client{groupedClients[category].length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {groupedClients[category].map((client) => (
                  <div key={client.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                    <div className="mb-2">
                      <img
                        src={client.image}
                        alt={`${categoryLabels[category]} client`}
                        className="w-full h-24 object-contain bg-gray-50 rounded p-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x100?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span>Order: {client.order}</span>
                      <button
                        onClick={() => handleToggleActive(client)}
                        className={`px-2 py-1 rounded text-xs ${
                          client.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {client.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(client)}
                        className="flex-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => client.id && handleDelete(client.id)}
                        className="flex-1 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {groupedClients[category].length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    No clients in this category. Click "Add {categoryLabels[category]} Client" to create one.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
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
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No clients found. Click "Add Client" to create one.
                  </td>
                </tr>
              ) : (
                filteredClients
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img 
                          src={client.image} 
                          alt={`${categoryLabels[client.category]} client`}
                          className="w-32 h-20 object-contain bg-gray-50 rounded border border-gray-200 p-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128x80?text=No+Image';
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{categoryLabels[client.category]}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={client.order}
                          onChange={(e) => handleOrderChange(client, parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(client)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            client.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {client.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(client)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <i className="ri-edit-line"></i> Edit
                        </button>
                        <button
                          onClick={() => client.id && handleDelete(client.id)}
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
      )}
    </div>
  );
}

