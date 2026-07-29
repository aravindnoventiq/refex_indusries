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

interface DevelopmentalOrg {
  id?: number;
  title: string;
  logo: string;
  content: string;
  order: number;
  isActive: boolean;
}

interface MainCollaboration {
  id?: number;
  title: string;
  logo: string;
  content?: string;
  largeImage?: string;
  isActive: boolean;
}

interface CollaborationSectionHeader {
  id?: number;
  title: string;
  isActive: boolean;
}

interface DevelopmentalOrgsSectionHeader {
  id?: number;
  title: string;
  isActive: boolean;
}

export default function EsgCollaborationSectionCMS() {
  const [sectionHeader, setSectionHeader] = useState<CollaborationSectionHeader | null>(null);
  const [mainCollaboration, setMainCollaboration] = useState<MainCollaboration | null>(null);
  const [orgsSectionHeader, setOrgsSectionHeader] = useState<DevelopmentalOrgsSectionHeader | null>(null);
  const [orgs, setOrgs] = useState<DevelopmentalOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingOrg, setEditingOrg] = useState<DevelopmentalOrg | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showSectionHeaderForm, setShowSectionHeaderForm] = useState(false);
  const [showMainCollaborationForm, setShowMainCollaborationForm] = useState(false);
  const [showOrgsSectionHeaderForm, setShowOrgsSectionHeaderForm] = useState(false);
  const [uploadingMainLogo, setUploadingMainLogo] = useState(false);
  const [uploadingMainLargeImage, setUploadingMainLargeImage] = useState(false);
  const [uploadingOrgLogo, setUploadingOrgLogo] = useState(false);

  const handleMainLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }

    setUploadingMainLogo(true);
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
      setMainCollaboration({ 
        ...(mainCollaboration || { title: '', logo: '', isActive: true }), 
        logo: data.imageUrl 
      });
      setSuccess('Logo uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingMainLogo(false);
    }
  };

  const handleMainLargeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }

    setUploadingMainLargeImage(true);
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
      setMainCollaboration({ 
        ...(mainCollaboration || { title: '', logo: '', isActive: true }), 
        largeImage: data.imageUrl 
      });
      setSuccess('Image uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingMainLargeImage(false);
    }
  };

  const handleOrgLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingOrg) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }

    setUploadingOrgLogo(true);
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
      setEditingOrg({ ...editingOrg, logo: data.imageUrl });
      setSuccess('Logo uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingOrgLogo(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [sectionHeaderData, mainCollabData, orgsSectionHeaderData, orgsData] = await Promise.all([
        esgCmsApi.getCollaborationSection(),
        esgCmsApi.getMainCollaboration(),
        esgCmsApi.getDevelopmentalOrgsSection(),
        esgCmsApi.getDevelopmentalOrgs(),
      ]);
      setSectionHeader(sectionHeaderData || null);
      setMainCollaboration(mainCollabData || null);
      setOrgsSectionHeader(orgsSectionHeaderData || null);
      setOrgs(orgsData || []);
    } catch (err: any) {
      // Only show error if it's not a server availability issue
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load collaboration section');
      }
      // Fallback to default data
      setSectionHeader({
        title: 'Collaboration & Membership',
        isActive: true,
      });
      setMainCollaboration({
        title: 'United Nations Global Compact – Network India (UNGC NI)',
        logo: 'https://refex.co.in/wp-content/uploads/2025/02/global-compact-india.jpg',
        content: 'The UN Global Compact Network India serves as a vital platform for advancing the ten universally endorsed principles within the Indian business landscape. These principles, integral to fostering sustainable and responsible corporate citizenship, align with broader global objectives like the Millennium Development Goals (MDGs) and post-2015 development agendas.',
        largeImage: 'https://refex.co.in/wp-content/uploads/2025/08/UNGCNI-name-in-Towers-building-01-new.jpg',
        isActive: true,
      });
      setOrgsSectionHeader({
        title: 'Developmental Organizations',
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrg = () => {
    setEditingOrg({
      title: '',
      logo: '',
      content: '',
      order: orgs.length,
      isActive: true,
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEditOrg = (org: DevelopmentalOrg) => {
    setEditingOrg({ ...org });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteOrg = async (id: number) => {
    if (!confirm('Are you sure you want to delete this organization?')) {
      return;
    }
    try {
      await esgCmsApi.deleteDevelopmentalOrg(id);
      setSuccess('Organization deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot delete: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to delete organization');
      }
    }
  };

  const handleSaveOrg = async () => {
    if (!editingOrg) return;
    
    if (!editingOrg.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!editingOrg.logo.trim()) {
      setError('Logo URL is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (editingOrg.id) {
        await esgCmsApi.updateDevelopmentalOrg(editingOrg.id, editingOrg);
        setSuccess('Organization updated successfully');
      } else {
        await esgCmsApi.createDevelopmentalOrg(editingOrg);
        setSuccess('Organization created successfully');
      }
      
      setShowForm(false);
      setEditingOrg(null);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save organization');
      }
    }
  };

  const handleSaveSectionHeader = async () => {
    if (!sectionHeader) return;
    
    if (!sectionHeader.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await esgCmsApi.saveCollaborationSection(sectionHeader);
      setSuccess('Section header saved successfully');
      setShowSectionHeaderForm(false);
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

  const handleSaveMainCollaboration = async () => {
    if (!mainCollaboration) {
      setError('Please fill in the main collaboration details');
      return;
    }
    
    if (!mainCollaboration.title?.trim()) {
      setError('Title is required');
      return;
    }
    if (!mainCollaboration.logo?.trim()) {
      setError('Logo URL is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await esgCmsApi.saveMainCollaboration(mainCollaboration);
      setSuccess('Main collaboration saved successfully');
      setShowMainCollaborationForm(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save main collaboration');
      }
    }
  };

  const handleSaveOrgsSectionHeader = async () => {
    if (!orgsSectionHeader) return;
    
    if (!orgsSectionHeader.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await esgCmsApi.saveDevelopmentalOrgsSection(orgsSectionHeader);
      setSuccess('Organizations section header saved successfully');
      setShowOrgsSectionHeaderForm(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save organizations section header');
      }
    }
  };

  const handleToggleActive = async (org: DevelopmentalOrg) => {
    try {
      await esgCmsApi.updateDevelopmentalOrg(org.id!, {
        ...org,
        isActive: !org.isActive,
      });
      loadData();
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot update: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to update organization');
      }
    }
  };

  const handleOrderChange = async (org: DevelopmentalOrg, newOrder: number) => {
    try {
      await esgCmsApi.updateDevelopmentalOrg(org.id!, {
        ...org,
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
          <p className="mt-4 text-gray-600">Loading collaboration section...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Collaboration Section</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSectionHeaderForm(!showSectionHeaderForm)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showSectionHeaderForm ? 'Cancel' : 'Edit Section Header'}
          </button>
          <button
            onClick={() => setShowMainCollaborationForm(!showMainCollaborationForm)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {showMainCollaborationForm ? 'Cancel' : 'Edit Main Collaboration'}
          </button>
          <button
            onClick={() => setShowOrgsSectionHeaderForm(!showOrgsSectionHeaderForm)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showOrgsSectionHeaderForm ? 'Cancel' : 'Edit Orgs Header'}
          </button>
          <button
            onClick={handleAddOrg}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line mr-2"></i>
            Add Organization
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

      {/* Section Header Form */}
      {showSectionHeaderForm && sectionHeader && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Section Header</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={sectionHeader.title}
                onChange={(e) => setSectionHeader({ ...sectionHeader, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Collaboration & Membership"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sectionHeaderActive"
                checked={sectionHeader.isActive}
                onChange={(e) => setSectionHeader({ ...sectionHeader, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="sectionHeaderActive" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveSectionHeader}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Header
              </button>
              <button
                onClick={() => setShowSectionHeaderForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Collaboration Form */}
      {showMainCollaborationForm && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Main Collaboration</h3>
          {!mainCollaboration && (
            <p className="text-gray-500 mb-4">No main collaboration data. Creating new...</p>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={mainCollaboration?.title || ''}
                onChange={(e) => setMainCollaboration({ 
                  ...(mainCollaboration || { logo: '', isActive: true }), 
                  title: e.target.value 
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="United Nations Global Compact – Network India (UNGC NI)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              <div className="flex items-center gap-4 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainLogoUpload}
                  className="hidden"
                  id="mainLogoUpload"
                  disabled={uploadingMainLogo}
                />
                <label
                  htmlFor="mainLogoUpload"
                  className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    uploadingMainLogo
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {uploadingMainLogo ? 'Uploading...' : 'Upload Logo'}
                </label>
                {mainCollaboration?.logo && (
                  <span className="text-sm text-gray-600 truncate max-w-md">
                    {mainCollaboration.logo}
                  </span>
                )}
              </div>
              {mainCollaboration?.logo && (
                <img
                  src={getImageUrl(mainCollaboration.logo)}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-contain rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={mainCollaboration?.content || ''}
                onChange={(e) => setMainCollaboration({ 
                  ...(mainCollaboration || { title: '', logo: '', isActive: true }), 
                  content: e.target.value 
                })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter collaboration description..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Large Image
              </label>
              <div className="flex items-center gap-4 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainLargeImageUpload}
                  className="hidden"
                  id="mainLargeImageUpload"
                  disabled={uploadingMainLargeImage}
                />
                <label
                  htmlFor="mainLargeImageUpload"
                  className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    uploadingMainLargeImage
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {uploadingMainLargeImage ? 'Uploading...' : 'Upload Image'}
                </label>
                {mainCollaboration?.largeImage && (
                  <span className="text-sm text-gray-600 truncate max-w-md">
                    {mainCollaboration.largeImage}
                  </span>
                )}
              </div>
              {mainCollaboration?.largeImage && (
                <img
                  src={getImageUrl(mainCollaboration.largeImage)}
                  alt="Preview"
                  className="mt-2 w-full max-w-md h-48 object-cover rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mainCollabActive"
                checked={mainCollaboration?.isActive ?? true}
                onChange={(e) => setMainCollaboration({ 
                  ...(mainCollaboration || { title: '', logo: '', isActive: true }), 
                  isActive: e.target.checked 
                })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="mainCollabActive" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveMainCollaboration}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Main Collaboration
              </button>
              <button
                onClick={() => setShowMainCollaborationForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Organizations Section Header Form */}
      {showOrgsSectionHeaderForm && orgsSectionHeader && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Organizations Section Header</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={orgsSectionHeader.title}
                onChange={(e) => setOrgsSectionHeader({ ...orgsSectionHeader, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Developmental Organizations"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="orgsSectionHeaderActive"
                checked={orgsSectionHeader.isActive}
                onChange={(e) => setOrgsSectionHeader({ ...orgsSectionHeader, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="orgsSectionHeaderActive" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveOrgsSectionHeader}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Header
              </button>
              <button
                onClick={() => setShowOrgsSectionHeaderForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Organization Form */}
      {showForm && editingOrg && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingOrg.id ? 'Edit Organization' : 'Add New Organization'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={editingOrg.title}
                onChange={(e) => setEditingOrg({ ...editingOrg, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Organization Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              <div className="flex items-center gap-4 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleOrgLogoUpload}
                  className="hidden"
                  id="orgLogoUpload"
                  disabled={uploadingOrgLogo}
                />
                <label
                  htmlFor="orgLogoUpload"
                  className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    uploadingOrgLogo
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {uploadingOrgLogo ? 'Uploading...' : 'Upload Logo'}
                </label>
                {editingOrg.logo && (
                  <span className="text-sm text-gray-600 truncate max-w-md">
                    {editingOrg.logo}
                  </span>
                )}
              </div>
              {editingOrg.logo && (
                <img
                  src={getImageUrl(editingOrg.logo)}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-contain rounded border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={editingOrg.content}
                onChange={(e) => setEditingOrg({ ...editingOrg, content: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter organization description..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={editingOrg.order}
                  onChange={(e) => setEditingOrg({ ...editingOrg, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="orgActive"
                  checked={editingOrg.isActive}
                  onChange={(e) => setEditingOrg({ ...editingOrg, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="orgActive" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveOrg}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingOrg.id ? 'Update Organization' : 'Create Organization'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingOrg(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Organizations List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Developmental Organizations ({orgs.length})</h3>
        {orgs.length === 0 ? (
          <p className="text-gray-500">No organizations added yet. Click "Add Organization" to create one.</p>
        ) : (
          <div className="space-y-4">
            {orgs
              .sort((a, b) => a.order - b.order)
              .map((org) => (
                <div
                  key={org.id}
                  className={`p-4 border rounded-lg ${org.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {org.logo && (
                          <img
                            src={getImageUrl(org.logo)}
                            alt={org.title}
                            className="w-24 h-24 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900">{org.title}</h4>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${org.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {org.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          Order: {org.order}
                        </span>
                      </div>
                      {org.content && (
                        <p className="text-sm text-gray-600 line-clamp-2">{org.content.substring(0, 150)}...</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditOrg(org)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleToggleActive(org)}
                        className={`px-3 py-1 rounded transition-colors ${
                          org.isActive
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        <i className={org.isActive ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                      </button>
                      <button
                        onClick={() => handleOrderChange(org, Math.max(0, org.order - 1))}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        disabled={org.order === 0}
                      >
                        <i className="ri-arrow-up-line"></i>
                      </button>
                      <button
                        onClick={() => handleOrderChange(org, org.order + 1)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        <i className="ri-arrow-down-line"></i>
                      </button>
                      <button
                        onClick={() => org.id && handleDeleteOrg(org.id)}
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

