import { useState, useEffect } from 'react';
import { investorsCmsApi } from '../../../../services/api';

interface KeyPersonnel {
  id?: number;
  name: string;
  position?: string;
  company?: string;
  address?: string;
  address2?: string;
  address3?: string;
  phone?: string;
  email?: string;
  displayOrder: number;
  isActive: boolean;
}

export default function InvestorKeyManagerialPersonnelCMS() {
  const [personnel, setPersonnel] = useState<KeyPersonnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingPersonnel, setEditingPersonnel] = useState<KeyPersonnel | null>(null);
  const [showPersonnelForm, setShowPersonnelForm] = useState(false);

  useEffect(() => {
    loadPersonnel();
  }, []);

  const loadPersonnel = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await investorsCmsApi.getKeyPersonnel();
      // Sort by displayOrder
      const sortedData = (data || []).sort((a: KeyPersonnel, b: KeyPersonnel) => 
        (a.displayOrder || 0) - (b.displayOrder || 0)
      );
      setPersonnel(sortedData);
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load key personnel');
      }
      setPersonnel([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPersonnel = () => {
    setEditingPersonnel({
      name: '',
      position: '',
      company: '',
      address: '',
      address2: '',
      address3: '',
      phone: '',
      email: '',
      displayOrder: personnel.length,
      isActive: true,
    });
    setShowPersonnelForm(true);
    setError('');
    setSuccess('');
  };

  const handleEditPersonnel = (person: KeyPersonnel) => {
    setEditingPersonnel({ ...person });
    setShowPersonnelForm(true);
    setError('');
    setSuccess('');
  };

  const handleDeletePersonnel = async (id: number) => {
    if (!confirm('Are you sure you want to delete this personnel?')) {
      return;
    }
    try {
      setError('');
      setSuccess('');
      await investorsCmsApi.deleteKeyPersonnel(id);
      setSuccess('Personnel deleted successfully');
      loadPersonnel();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete personnel');
    }
  };

  const handleSavePersonnel = async () => {
    if (!editingPersonnel) return;
    
    if (!editingPersonnel.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (editingPersonnel.id) {
        await investorsCmsApi.updateKeyPersonnel(editingPersonnel.id, editingPersonnel);
        setSuccess('Personnel updated successfully');
      } else {
        await investorsCmsApi.createKeyPersonnel(editingPersonnel);
        setSuccess('Personnel created successfully');
      }
      
      setShowPersonnelForm(false);
      setEditingPersonnel(null);
      loadPersonnel();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save personnel');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const updatedPersonnel = [...personnel];
    const temp = updatedPersonnel[index].displayOrder;
    updatedPersonnel[index].displayOrder = updatedPersonnel[index - 1].displayOrder;
    updatedPersonnel[index - 1].displayOrder = temp;
    
    try {
      if (updatedPersonnel[index].id) {
        await investorsCmsApi.updateKeyPersonnel(updatedPersonnel[index].id!, {
          ...updatedPersonnel[index],
          displayOrder: updatedPersonnel[index].displayOrder,
        });
      }
      if (updatedPersonnel[index - 1].id) {
        await investorsCmsApi.updateKeyPersonnel(updatedPersonnel[index - 1].id!, {
          ...updatedPersonnel[index - 1],
          displayOrder: updatedPersonnel[index - 1].displayOrder,
        });
      }
      loadPersonnel();
    } catch (err: any) {
      setError(err.message || 'Failed to reorder personnel');
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === personnel.length - 1) return;
    const updatedPersonnel = [...personnel];
    const temp = updatedPersonnel[index].displayOrder;
    updatedPersonnel[index].displayOrder = updatedPersonnel[index + 1].displayOrder;
    updatedPersonnel[index + 1].displayOrder = temp;
    
    try {
      if (updatedPersonnel[index].id) {
        await investorsCmsApi.updateKeyPersonnel(updatedPersonnel[index].id!, {
          ...updatedPersonnel[index],
          displayOrder: updatedPersonnel[index].displayOrder,
        });
      }
      if (updatedPersonnel[index + 1].id) {
        await investorsCmsApi.updateKeyPersonnel(updatedPersonnel[index + 1].id!, {
          ...updatedPersonnel[index + 1],
          displayOrder: updatedPersonnel[index + 1].displayOrder,
        });
      }
      loadPersonnel();
    } catch (err: any) {
      setError(err.message || 'Failed to reorder personnel');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading key personnel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Key Managerial Personnel CMS</h2>
        <p className="text-sm text-gray-600 mt-1">Manage key managerial personnel for the Key Managerial Personnel page</p>
      </div>

      {/* Messages */}
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

      {/* Add Button */}
      <div className="mb-6">
        <button
          onClick={handleAddPersonnel}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add Personnel
        </button>
      </div>

      {/* Personnel Form */}
      {showPersonnelForm && editingPersonnel && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            {editingPersonnel.id ? 'Edit Personnel' : 'Add New Personnel'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editingPersonnel.name}
                onChange={(e) => setEditingPersonnel({ ...editingPersonnel, name: e.target.value })}
                placeholder="e.g., Mr. Anil Jain"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editingPersonnel.position || ''}
                onChange={(e) => setEditingPersonnel({ ...editingPersonnel, position: e.target.value })}
                placeholder="e.g., Managing Director"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editingPersonnel.company || ''}
                onChange={(e) => setEditingPersonnel({ ...editingPersonnel, company: e.target.value })}
                placeholder="e.g., Refex Industries Limited"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1
              </label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editingPersonnel.address || ''}
                onChange={(e) => setEditingPersonnel({ ...editingPersonnel, address: e.target.value })}
                placeholder="e.g., 2nd Floor, No.313, Refex Towers"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editingPersonnel.address2 || ''}
                onChange={(e) => setEditingPersonnel({ ...editingPersonnel, address2: e.target.value })}
                placeholder="e.g., Sterling Road, Valluvar Kottam High Road"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 3
              </label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editingPersonnel.address3 || ''}
                onChange={(e) => setEditingPersonnel({ ...editingPersonnel, address3: e.target.value })}
                placeholder="e.g., Chennai – 600034, Tamil Nadu."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editingPersonnel.phone || ''}
                onChange={(e) => setEditingPersonnel({ ...editingPersonnel, phone: e.target.value })}
                placeholder="e.g., +91-44 – 3504 0050"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editingPersonnel.email || ''}
                onChange={(e) => setEditingPersonnel({ ...editingPersonnel, email: e.target.value })}
                placeholder="e.g., investor.relations@refex.co.in"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editingPersonnel.displayOrder}
                onChange={(e) => setEditingPersonnel({ ...editingPersonnel, displayOrder: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={editingPersonnel.isActive}
                onChange={(e) => setEditingPersonnel({ ...editingPersonnel, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                onClick={handleSavePersonnel}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Personnel
              </button>
              <button
                onClick={() => {
                  setShowPersonnelForm(false);
                  setEditingPersonnel(null);
                  setError('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Personnel List */}
      {personnel.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No personnel found. Click "Add Personnel" to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {personnel.map((person, index) => (
            <div key={person.id || index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{person.name}</h4>
                    {!person.isActive && (
                      <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">Inactive</span>
                    )}
                  </div>
                  {person.position && (
                    <p className="text-sm text-gray-600 mb-1">{person.position}</p>
                  )}
                  {person.company && (
                    <p className="text-sm text-gray-600 mb-1">{person.company}</p>
                  )}
                  {(person.address || person.address2 || person.address3) && (
                    <div className="text-sm text-gray-600 mb-1">
                      {person.address && <p>{person.address}</p>}
                      {person.address2 && <p>{person.address2}</p>}
                      {person.address3 && <p>{person.address3}</p>}
                    </div>
                  )}
                  {person.phone && (
                    <p className="text-sm text-gray-700 mb-1">
                      Phone: <span className="text-[#7cd244]">{person.phone}</span>
                    </p>
                  )}
                  {person.email && (
                    <p className="text-sm text-gray-700">
                      Email: <span className="text-[#7cd244]">{person.email}</span>
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className={`p-2 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                    title="Move Up"
                  >
                    <i className="ri-arrow-up-line"></i>
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === personnel.length - 1}
                    className={`p-2 rounded ${index === personnel.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                    title="Move Down"
                  >
                    <i className="ri-arrow-down-line"></i>
                  </button>
                  <button
                    onClick={() => handleEditPersonnel(person)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit"
                  >
                    <i className="ri-edit-line"></i>
                  </button>
                  <button
                    onClick={() => person.id && handleDeletePersonnel(person.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
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
  );
}

