import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../../services/api';

interface CommitteeMember {
  id?: number;
  name: string;
  designation: string;
  category: string;
  order: number;
  isActive: boolean;
}

interface Committee {
  id?: number;
  name: string;
  order: number;
  isActive: boolean;
  members: CommitteeMember[];
}

export default function CommitteesSectionCMS() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingCommittee, setEditingCommittee] = useState<Committee | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadCommittees();
  }, []);

  const loadCommittees = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await aboutCmsApi.getCommittees();
      setCommittees(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load committees');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCommittee({
      name: '',
      order: committees.length,
      isActive: true,
      members: [],
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEdit = (committee: Committee) => {
    setEditingCommittee({ ...committee });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this committee? This will also delete all its members.')) {
      return;
    }
    try {
      await aboutCmsApi.deleteCommittee(id);
      setSuccess('Committee deleted successfully');
      loadCommittees();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete committee');
    }
  };

  const handleSave = async () => {
    if (!editingCommittee) return;
    
    if (!editingCommittee.name.trim()) {
      setError('Committee name is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (editingCommittee.id) {
        await aboutCmsApi.updateCommittee(editingCommittee.id, editingCommittee);
        setSuccess('Committee updated successfully');
      } else {
        await aboutCmsApi.createCommittee(editingCommittee);
        setSuccess('Committee created successfully');
      }
      
      setShowForm(false);
      setEditingCommittee(null);
      loadCommittees();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save committee');
    }
  };

  const handleAddMember = () => {
    if (!editingCommittee) return;
    setEditingCommittee({
      ...editingCommittee,
      members: [
        ...editingCommittee.members,
        {
          name: '',
          designation: '',
          category: 'Member',
          order: editingCommittee.members.length,
          isActive: true,
        },
      ],
    });
  };

  const handleRemoveMember = (index: number) => {
    if (!editingCommittee) return;
    setEditingCommittee({
      ...editingCommittee,
      members: editingCommittee.members.filter((_, i) => i !== index),
    });
  };

  const handleMemberChange = (index: number, field: keyof CommitteeMember, value: any) => {
    if (!editingCommittee) return;
    const updatedMembers = [...editingCommittee.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setEditingCommittee({ ...editingCommittee, members: updatedMembers });
  };

  const handleToggleActive = async (committee: Committee) => {
    try {
      await aboutCmsApi.updateCommittee(committee.id!, {
        ...committee,
        isActive: !committee.isActive,
      });
      loadCommittees();
    } catch (err: any) {
      setError(err.message || 'Failed to update committee');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading committees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Committees Management</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add Committee
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

      {showForm && editingCommittee && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingCommittee.id ? 'Edit Committee' : 'Add Committee'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Committee Name *
              </label>
              <input
                type="text"
                value={editingCommittee.name}
                onChange={(e) => setEditingCommittee({ ...editingCommittee, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Audit Committee"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                value={editingCommittee.order}
                onChange={(e) => setEditingCommittee({ ...editingCommittee, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={editingCommittee.isActive}
                onChange={(e) => setEditingCommittee({ ...editingCommittee, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Members</h4>
                <button
                  onClick={handleAddMember}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  <i className="ri-add-line mr-1"></i>
                  Add Member
                </button>
              </div>

              <div className="space-y-4">
                {editingCommittee.members.map((member, index) => (
                  <div key={index} className="p-4 bg-white rounded border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="font-medium text-gray-900">Member {index + 1}</h5>
                      <button
                        onClick={() => handleRemoveMember(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Mr. John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Designation *
                        </label>
                        <input
                          type="text"
                          value={member.designation}
                          onChange={(e) => handleMemberChange(index, 'designation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Independent Director"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <select
                          value={member.category}
                          onChange={(e) => handleMemberChange(index, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Chairman">Chairman</option>
                          <option value="Chairperson">Chairperson</option>
                          <option value="Member">Member</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                {editingCommittee.members.length === 0 && (
                  <p className="text-gray-500 text-sm">No members added. Click "Add Member" to add one.</p>
                )}
              </div>
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
                setEditingCommittee(null);
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Members
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
            {committees.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No committees found. Click "Add Committee" to create one.
                </td>
              </tr>
            ) : (
              committees.map((committee) => (
                <tr key={committee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{committee.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {committee.members?.length || 0} member(s)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{committee.order}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(committee)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        committee.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {committee.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(committee)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <i className="ri-edit-line"></i> Edit
                    </button>
                    <button
                      onClick={() => committee.id && handleDelete(committee.id)}
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

