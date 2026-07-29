import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../../services/api';

interface BoardMember {
  id?: number;
  name: string;
  position: string;
  image?: string;
  linkedin?: string;
  biography?: string;
  directorshipDetails?: string;
  order: number;
  isActive: boolean;
}

export default function BoardMembersSectionCMS() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    loadBoardMembers();
  }, []);

  const loadBoardMembers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await aboutCmsApi.getBoardMembers();
      setMembers(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load board members');
      // For demo: use existing data from BoardMembersSection
      setMembers([
        {
          id: 1,
          name: 'Anil Jain',
          position: 'Chairman & Managing Director',
          image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/ed39453b975c767adc77858e9ce4ab7d.jpeg',
          order: 1,
          isActive: true,
        },
        {
          id: 2,
          name: 'Dinesh Kumar Agarwal',
          position: 'Whole-Time Director & Chief Financial Officer',
          image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/eb126fbf9c5ff5cb7d8691e3a9ed316c.jpeg',
          order: 2,
          isActive: true,
        },
        {
          id: 3,
          name: 'Susmitha Siripurapu',
          position: 'Non-Executive Director',
          image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/a8b7e2e85c235d3d2864abbc762a811a.jpeg',
          order: 3,
          isActive: true,
        },
        {
          id: 4,
          name: 'Dr. Vineet Kothari',
          position: 'Independent Director',
          image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/72e4f4bfcf8a0ad40a177f7d9a063dda.jpeg',
          order: 4,
          isActive: true,
        },
        {
          id: 5,
          name: 'Sivaramakrishnan Vasudevan',
          position: 'Independent Director',
          image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/1ef038f70a477ba1387dd4cf04430322.jpeg',
          order: 5,
          isActive: true,
        },
        {
          id: 6,
          name: 'Latha Venkatesh',
          position: 'Independent Director',
          image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/587b9d9d4dad1920018d74b15906558f.jpeg',
          order: 6,
          isActive: true,
        },
        {
          id: 7,
          name: 'Ramesh Dugar',
          position: 'Independent Director',
          image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/74924bc6d127e3040cd2b13a1164f058.jpeg',
          order: 7,
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
    const member: BoardMember = {
      name: formData.get('name') as string,
      position: formData.get('position') as string,
      image: imageUrl || undefined,
      linkedin: formData.get('linkedin') as string || undefined,
      biography: formData.get('biography') as string || undefined,
      directorshipDetails: formData.get('directorshipDetails') as string || undefined,
      order: parseInt(formData.get('order') as string) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      setError('');
      setSuccess('');
      
      if (editingMember?.id) {
        await aboutCmsApi.updateBoardMember(editingMember.id, member);
        setSuccess('Board member updated successfully!');
      } else {
        await aboutCmsApi.createBoardMember(member);
        setSuccess('Board member created successfully!');
      }
      
      setShowForm(false);
      setEditingMember(null);
      setImageUrl('');
      loadBoardMembers();
    } catch (err: any) {
      setError(err.message || 'Failed to save board member');
      // For demo: update local state if backend is not available
      if (editingMember?.id) {
        setMembers(members.map(m => m.id === editingMember.id ? { ...member, id: editingMember.id } : m));
        setSuccess('Board member updated (demo mode)!');
        setShowForm(false);
        setEditingMember(null);
        setImageUrl('');
      } else {
        const newMember = { ...member, id: Date.now() };
        setMembers([...members, newMember]);
        setSuccess('Board member created (demo mode)!');
        setShowForm(false);
        setEditingMember(null);
        setImageUrl('');
      }
    }
  };

  const handleEdit = (member: BoardMember) => {
    setEditingMember(member);
    setImageUrl(member.image || '');
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this board member?')) return;

    try {
      setError('');
      await aboutCmsApi.deleteBoardMember(id);
      setSuccess('Board member deleted successfully!');
      loadBoardMembers();
    } catch (err: any) {
      setError(err.message || 'Failed to delete board member');
      // For demo: update local state if backend is not available
      setMembers(members.filter(m => m.id !== id));
      setSuccess('Board member deleted (demo mode)!');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMember(null);
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

  const sortedMembers = [...members].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Board Members Section CMS</h2>
          <p className="text-gray-600 mt-1">Manage board members for the About Us page</p>
        </div>
        <button
          onClick={() => {
            setEditingMember(null);
            setImageUrl('');
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add New Member
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
                {editingMember ? 'Edit Board Member' : 'Add New Board Member'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingMember?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position *
                  </label>
                  <input
                    type="text"
                    name="position"
                    required
                    defaultValue={editingMember?.position || ''}
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
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    defaultValue={editingMember?.linkedin || ''}
                    placeholder="https://www.linkedin.com/in/username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Optional: LinkedIn profile URL</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biography
                  </label>
                  <textarea
                    name="biography"
                    rows={6}
                    defaultValue={editingMember?.biography || ''}
                    placeholder="Enter the biography text. Use line breaks to separate paragraphs."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  />
                  <p className="mt-1 text-xs text-gray-500">Optional: Biography content for the popup modal</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Directorship Details
                  </label>
                  <textarea
                    name="directorshipDetails"
                    rows={8}
                    defaultValue={editingMember?.directorshipDetails || ''}
                    placeholder="Enter each directorship on a new line. Example:&#10;Refex Renewables and Infrastructure Limited (Promoter & Non -Executive Director)&#10;Sherisha Technologies Private Limited (Managing Director)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">Optional: List each directorship on a separate line. This will be displayed as a numbered list in the popup.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingMember?.order || 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={editingMember?.isActive !== false}
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
                    {editingMember ? 'Update Member' : 'Create Member'}
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

      {/* Members List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading board members...</p>
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
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedMembers.map((member) => (
                <tr key={member.id} className={!member.isActive ? 'opacity-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {member.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-16 w-16 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=No+Image';
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                    {member.position}
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
                      {member.directorshipDetails && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs" title="Directorship Details">
                          <i className="ri-list-check mr-1"></i>Directorships
                        </span>
                      )}
                      {!member.linkedin && !member.biography && !member.directorshipDetails && (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        member.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => member.id && handleDelete(member.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedMembers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No board members found. Click "Add New Member" to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

