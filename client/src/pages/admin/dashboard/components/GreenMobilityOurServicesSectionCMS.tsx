import { useState, useEffect } from 'react';
import { greenMobilityCmsApi } from '../../../../services/api';

interface Feature {
  icon: string;
  title: string;
}

interface RideType {
  icon: string;
  title: string;
}

interface Button {
  text: string;
  link: string;
}

interface OurService {
  id?: number;
  title: string;
  image?: string;
  description?: string;
  additionalText?: string;
  featuresJson?: Feature[];
  rideTypesJson?: RideType[];
  citiesJson?: string[];
  buttonsJson?: Button[];
  order: number;
  isActive: boolean;
}

export default function GreenMobilityOurServicesSectionCMS() {
  const [services, setServices] = useState<OurService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingService, setEditingService] = useState<OurService | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editingService) return;

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
        
        setEditingService({ ...editingService, image: fullImageUrl });
        setSuccess('Image uploaded successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await greenMobilityCmsApi.getOurServices();
      setServices(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingService({
      title: '',
      image: '',
      description: '',
      additionalText: '',
      featuresJson: [],
      rideTypesJson: [],
      citiesJson: [],
      buttonsJson: [],
      order: services.length,
      isActive: true,
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEdit = (service: OurService) => {
    setEditingService({ ...service });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }
    try {
      await greenMobilityCmsApi.deleteOurService(id);
      setSuccess('Service deleted successfully');
      loadServices();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete service');
    }
  };

  const handleSave = async () => {
    if (!editingService) return;
    
    if (!editingService.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      const payload = {
        ...editingService,
        featuresJson: editingService.featuresJson && editingService.featuresJson.length > 0 ? editingService.featuresJson : null,
        rideTypesJson: editingService.rideTypesJson && editingService.rideTypesJson.length > 0 ? editingService.rideTypesJson : null,
        citiesJson: editingService.citiesJson && editingService.citiesJson.length > 0 ? editingService.citiesJson : null,
        buttonsJson: editingService.buttonsJson && editingService.buttonsJson.length > 0 ? editingService.buttonsJson : null,
      };
      
      if (editingService.id) {
        await greenMobilityCmsApi.updateOurService(editingService.id, payload);
        setSuccess('Service updated successfully');
      } else {
        await greenMobilityCmsApi.createOurService(payload);
        setSuccess('Service created successfully');
      }
      
      setShowForm(false);
      setEditingService(null);
      loadServices();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save service');
    }
  };

  const handleToggleActive = async (service: OurService) => {
    try {
      await greenMobilityCmsApi.updateOurService(service.id!, {
        ...service,
        isActive: !service.isActive,
      });
      loadServices();
    } catch (err: any) {
      setError(err.message || 'Failed to update service');
    }
  };

  const handleOrderChange = async (service: OurService, newOrder: number) => {
    try {
      await greenMobilityCmsApi.updateOurService(service.id!, {
        ...service,
        order: newOrder,
      });
      loadServices();
    } catch (err: any) {
      setError(err.message || 'Failed to update order');
    }
  };

  const addFeature = () => {
    if (!editingService) return;
    setEditingService({
      ...editingService,
      featuresJson: [...(editingService.featuresJson || []), { icon: '', title: '' }],
    });
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    if (!editingService || !editingService.featuresJson) return;
    const updated = [...editingService.featuresJson];
    updated[index] = { ...updated[index], [field]: value };
    setEditingService({ ...editingService, featuresJson: updated });
  };

  const removeFeature = (index: number) => {
    if (!editingService || !editingService.featuresJson) return;
    setEditingService({
      ...editingService,
      featuresJson: editingService.featuresJson.filter((_, i) => i !== index),
    });
  };

  const addRideType = () => {
    if (!editingService) return;
    setEditingService({
      ...editingService,
      rideTypesJson: [...(editingService.rideTypesJson || []), { icon: '', title: '' }],
    });
  };

  const updateRideType = (index: number, field: keyof RideType, value: string) => {
    if (!editingService || !editingService.rideTypesJson) return;
    const updated = [...editingService.rideTypesJson];
    updated[index] = { ...updated[index], [field]: value };
    setEditingService({ ...editingService, rideTypesJson: updated });
  };

  const removeRideType = (index: number) => {
    if (!editingService || !editingService.rideTypesJson) return;
    setEditingService({
      ...editingService,
      rideTypesJson: editingService.rideTypesJson.filter((_, i) => i !== index),
    });
  };

  const addCity = () => {
    if (!editingService) return;
    setEditingService({
      ...editingService,
      citiesJson: [...(editingService.citiesJson || []), ''],
    });
  };

  const updateCity = (index: number, value: string) => {
    if (!editingService || !editingService.citiesJson) return;
    const updated = [...editingService.citiesJson];
    updated[index] = value;
    setEditingService({ ...editingService, citiesJson: updated });
  };

  const removeCity = (index: number) => {
    if (!editingService || !editingService.citiesJson) return;
    setEditingService({
      ...editingService,
      citiesJson: editingService.citiesJson.filter((_, i) => i !== index),
    });
  };

  const addButton = () => {
    if (!editingService) return;
    setEditingService({
      ...editingService,
      buttonsJson: [...(editingService.buttonsJson || []), { text: '', link: '' }],
    });
  };

  const updateButton = (index: number, field: keyof Button, value: string) => {
    if (!editingService || !editingService.buttonsJson) return;
    const updated = [...editingService.buttonsJson];
    updated[index] = { ...updated[index], [field]: value };
    setEditingService({ ...editingService, buttonsJson: updated });
  };

  const removeButton = (index: number) => {
    if (!editingService || !editingService.buttonsJson) return;
    setEditingService({
      ...editingService,
      buttonsJson: editingService.buttonsJson.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Our Services Management</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add Service
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

      {showForm && editingService && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200 max-h-[80vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingService.id ? 'Edit Service' : 'Add Service'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={editingService.title}
                onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., EMPLOYEE TRANSPORTATION"
                required
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {uploadingImage && (
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Uploading...
                  </div>
                )}
              </div>
              {editingService.image && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1 break-all">Path: {editingService.image}</p>
                  <img 
                    src={editingService.image} 
                    alt="Preview" 
                    className="w-32 h-32 object-contain rounded border border-gray-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={editingService.description || ''}
                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Service description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Text
              </label>
              <textarea
                value={editingService.additionalText || ''}
                onChange={(e) => setEditingService({ ...editingService, additionalText: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Additional information..."
              />
            </div>

            {/* Features */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Features
                </label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  <i className="ri-add-line mr-1"></i>Add Feature
                </button>
              </div>
              {editingService.featuresJson && editingService.featuresJson.map((feature, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={feature.icon}
                    onChange={(e) => updateFeature(idx, 'icon', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Icon class (e.g., ri-money-dollar-circle-line)"
                  />
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => updateFeature(idx, 'title', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Title"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Ride Types */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ride Types
                </label>
                <button
                  type="button"
                  onClick={addRideType}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  <i className="ri-add-line mr-1"></i>Add Ride Type
                </button>
              </div>
              {editingService.rideTypesJson && editingService.rideTypesJson.map((type, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={type.icon}
                    onChange={(e) => updateRideType(idx, 'icon', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Icon class (e.g., ri-car-line)"
                  />
                  <input
                    type="text"
                    value={type.title}
                    onChange={(e) => updateRideType(idx, 'title', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Title"
                  />
                  <button
                    type="button"
                    onClick={() => removeRideType(idx)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Cities */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cities
                </label>
                <button
                  type="button"
                  onClick={addCity}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  <i className="ri-add-line mr-1"></i>Add City
                </button>
              </div>
              {editingService.citiesJson && editingService.citiesJson.map((city, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => updateCity(idx, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="City name"
                  />
                  <button
                    type="button"
                    onClick={() => removeCity(idx)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Buttons
                </label>
                <button
                  type="button"
                  onClick={addButton}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  <i className="ri-add-line mr-1"></i>Add Button
                </button>
              </div>
              {editingService.buttonsJson && editingService.buttonsJson.map((button, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={button.text}
                    onChange={(e) => updateButton(idx, 'text', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Button text"
                  />
                  <input
                    type="text"
                    value={button.link}
                    onChange={(e) => updateButton(idx, 'link', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Button link URL"
                  />
                  <button
                    type="button"
                    onClick={() => removeButton(idx)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                value={editingService.order}
                onChange={(e) => setEditingService({ ...editingService, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={editingService.isActive}
                onChange={(e) => setEditingService({ ...editingService, isActive: e.target.checked })}
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
                setEditingService(null);
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
                Image
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
            {services.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No services found. Click "Add Service" to create one.
                </td>
              </tr>
            ) : (
              services
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{service.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.image ? (
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-16 h-16 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={service.order}
                        onChange={(e) => handleOrderChange(service, parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(service)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          service.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <i className="ri-edit-line"></i> Edit
                      </button>
                      <button
                        onClick={() => service.id && handleDelete(service.id)}
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

