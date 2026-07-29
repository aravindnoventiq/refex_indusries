import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../../services/api';

interface LeadershipMember {
  id?: number;
  name: string;
  position: string;
  image?: string;
  linkedin?: string;
  biography?: string;
  order: number;
  isActive: boolean;
}

export default function LeadershipTeamSectionCMS() {
  const [members, setMembers] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingMember, setEditingMember] = useState<LeadershipMember | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editingMember) return;

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
        
        setEditingMember({ ...editingMember, image: fullImageUrl });
        setSuccess('Image uploaded successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    loadLeadershipTeam();
  }, []);

  const loadLeadershipTeam = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await aboutCmsApi.getLeadershipTeam();
      setMembers(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load leadership team');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingMember({
      name: '',
      position: '',
      image: '',
      linkedin: '',
      biography: '',
      order: members.length,
      isActive: true,
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEdit = (member: LeadershipMember) => {
    setEditingMember({ ...member });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this leadership team member?')) {
      return;
    }
    try {
      await aboutCmsApi.deleteLeadershipMember(id);
      setSuccess('Leadership team member deleted successfully');
      loadLeadershipTeam();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete leadership team member');
    }
  };

  const handleSave = async () => {
    if (!editingMember) return;
    
    if (!editingMember.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!editingMember.position.trim()) {
      setError('Position is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (editingMember.id) {
        await aboutCmsApi.updateLeadershipMember(editingMember.id, editingMember);
        setSuccess('Leadership team member updated successfully');
      } else {
        await aboutCmsApi.createLeadershipMember(editingMember);
        setSuccess('Leadership team member created successfully');
      }
      
      setShowForm(false);
      setEditingMember(null);
      loadLeadershipTeam();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save leadership team member');
    }
  };

  const handleToggleActive = async (member: LeadershipMember) => {
    try {
      await aboutCmsApi.updateLeadershipMember(member.id!, {
        ...member,
        isActive: !member.isActive,
      });
      loadLeadershipTeam();
    } catch (err: any) {
      setError(err.message || 'Failed to update leadership team member');
    }
  };

  const handleOrderChange = async (member: LeadershipMember, newOrder: number) => {
    try {
      await aboutCmsApi.updateLeadershipMember(member.id!, {
        ...member,
        order: newOrder,
      });
      loadLeadershipTeam();
    } catch (err: any) {
      setError(err.message || 'Failed to update order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading leadership team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Leadership Team Management</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add Member
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

      {showForm && editingMember && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingMember.id ? 'Edit Leadership Team Member' : 'Add Leadership Team Member'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={editingMember.name}
                onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <input
                type="text"
                value={editingMember.position}
                onChange={(e) => setEditingMember({ ...editingMember, position: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Group CHRO"
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
              <p className="mt-1 text-xs text-gray-500">Upload an image file (max 10MB)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              {editingMember.image ? (
                <div className="space-y-2">
                  <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 break-all">
                    {editingMember.image}
                  </div>
                  <div className="mt-2">
                    <img 
                      src={editingMember.image} 
                      alt="Preview" 
                      className="w-32 h-40 object-cover rounded border border-gray-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 italic">
                  No image uploaded yet. Please upload an image above.
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={editingMember.linkedin || ''}
                onChange={(e) => setEditingMember({ ...editingMember, linkedin: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://www.linkedin.com/in/username"
              />
              <p className="mt-1 text-xs text-gray-500">Optional: LinkedIn profile URL</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biography
              </label>
              <textarea
                value={editingMember.biography || ''}
                onChange={(e) => setEditingMember({ ...editingMember, biography: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                placeholder="Enter the biography text. Use line breaks to separate paragraphs."
              />
              <p className="mt-1 text-xs text-gray-500">Optional: Biography content</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                value={editingMember.order}
                onChange={(e) => setEditingMember({ ...editingMember, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={editingMember.isActive}
                onChange={(e) => setEditingMember({ ...editingMember, isActive: e.target.checked })}
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
                setEditingMember(null);
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
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Additional Info
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
            {members.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No leadership team members found. Click "Add Member" to create one.
                </td>
              </tr>
            ) : (
              members
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-16 h-20 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x80?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{member.position}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {member.linkedin && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs" title="LinkedIn">
                            <i className="ri-linkedin-fill mr-1"></i>LinkedIn
                          </span>
                        )}
                        {member.biography && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs" title="Biography">
                            <i className="ri-file-text-line mr-1"></i>Bio
                          </span>
                        )}
                        {!member.linkedin && !member.biography && (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={member.order}
                        onChange={(e) => handleOrderChange(member, parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(member)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          member.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {member.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <i className="ri-edit-line"></i> Edit
                      </button>
                      <button
                        onClick={() => member.id && handleDelete(member.id)}
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

