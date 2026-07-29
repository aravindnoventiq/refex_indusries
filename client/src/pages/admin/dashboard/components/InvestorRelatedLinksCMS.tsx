import { useState, useEffect } from 'react';
import { investorsCmsApi } from '../../../../services/api';
import { generateInvestorPageUrl, slugify } from '../../../../utils/slugify';

interface RelatedLink {
  id?: number;
  name: string;
  href: string;
  displayOrder: number;
  isActive: boolean;
}

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

interface SectionSettings {
  title: string;
  isActive: boolean;
}

export default function InvestorRelatedLinksCMS() {
  const [activeSubTab, setActiveSubTab] = useState<'section' | 'links' | 'personnel'>('section');
  const [section, setSection] = useState<SectionSettings>({ title: 'Related Links', isActive: true });
  const [links, setLinks] = useState<RelatedLink[]>([]);
  const [personnel, setPersonnel] = useState<KeyPersonnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [editingLink, setEditingLink] = useState<RelatedLink | null>(null);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<KeyPersonnel | null>(null);
  const [showPersonnelForm, setShowPersonnelForm] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([loadSection(), loadLinks(), loadPersonnel()]);
  };

  const loadSection = async () => {
    try {
      const data = await investorsCmsApi.getRelatedLinksSection();
      if (data) {
        setSection(data);
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        console.error('Failed to load section:', err);
      }
    }
  };

  const loadLinks = async () => {
    try {
      setLoading(true);
      const data = await investorsCmsApi.getRelatedLinks();
      setLinks(data || []);
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load related links');
      }
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPersonnel = async () => {
    try {
      const data = await investorsCmsApi.getKeyPersonnel();
      setPersonnel(data || []);
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        console.error('Failed to load personnel:', err);
      }
      setPersonnel([]);
    }
  };

  const handleSaveSection = async () => {
    try {
      setError('');
      setSuccess('');
      await investorsCmsApi.saveRelatedLinksSection(section);
      setSuccess('Section settings saved successfully');
      loadSection();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save section settings');
    }
  };

  // Link handlers
  const handleAddLink = () => {
    setEditingLink({
      name: '',
      href: '',
      displayOrder: links.length,
      isActive: true,
    });
    setShowLinkForm(true);
    setError('');
    setSuccess('');
  };

  const handleEditLink = (link: RelatedLink) => {
    setEditingLink({ ...link });
    setShowLinkForm(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteLink = async (id: number) => {
    if (!confirm('Are you sure you want to delete this link?')) {
      return;
    }
    try {
      await investorsCmsApi.deleteRelatedLink(id);
      setSuccess('Link deleted successfully');
      loadLinks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete link');
    }
  };

  const handleSaveLink = async () => {
    if (!editingLink) return;
    
    if (!editingLink.name.trim()) {
      setError('Link name is required');
      return;
    }
    
    // Auto-generate URL if not provided
    const linkToSave = {
      ...editingLink,
      href: editingLink.href.trim() || generateInvestorPageUrl(editingLink.name),
    };
    
    if (!linkToSave.href) {
      setError('Link URL is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (linkToSave.id) {
        await investorsCmsApi.updateRelatedLink(linkToSave.id, linkToSave);
        setSuccess('Link updated successfully');
      } else {
        // Create the link
        await investorsCmsApi.createRelatedLink(linkToSave);
        
        // Extract slug from href (e.g., "/investors/financial-information/" -> "financial-information")
        const slugMatch = linkToSave.href.match(/\/investors\/([^\/]+)\/?/);
        const slug = slugMatch ? slugMatch[1] : slugify(linkToSave.name);
        
        // Check if page already exists
        try {
          const existingPage = await investorsCmsApi.getPageContentBySlug(slug);
          if (existingPage) {
            setSuccess('Link created successfully. Page already exists for this link.');
          }
        } catch (e) {
          // Page doesn't exist, create it
          try {
            await investorsCmsApi.createPageContent({
              slug: slug,
              title: linkToSave.name,
              hasYearFilter: false,
              filterItems: [],
              sections: [],
              isActive: true,
            });
            setSuccess('Link and page created successfully. You can now add content to the page in Investor Pages CMS.');
          } catch (pageErr: any) {
            setSuccess('Link created successfully. Page creation failed: ' + (pageErr.message || 'Unknown error'));
          }
        }
      }
      
      setShowLinkForm(false);
      setEditingLink(null);
      loadLinks();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to save link');
    }
  };

  // Personnel handlers
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
    if (!confirm('Are you sure you want to delete this key personnel?')) {
      return;
    }
    try {
      await investorsCmsApi.deleteKeyPersonnel(id);
      setSuccess('Key personnel deleted successfully');
      loadPersonnel();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete key personnel');
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
        setSuccess('Key personnel updated successfully');
      } else {
        await investorsCmsApi.createKeyPersonnel(editingPersonnel);
        setSuccess('Key personnel created successfully');
      }
      
      setShowPersonnelForm(false);
      setEditingPersonnel(null);
      loadPersonnel();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save key personnel');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Sub-tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveSubTab('section')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeSubTab === 'section'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Section Settings
          </button>
          <button
            onClick={() => setActiveSubTab('links')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeSubTab === 'links'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Related Links ({links.length})
          </button>
          <button
            onClick={() => setActiveSubTab('personnel')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeSubTab === 'personnel'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Key Personnel ({personnel.length})
          </button>
        </nav>
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

      {/* Section Settings Tab */}
      {activeSubTab === 'section' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title *
            </label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={section.title}
              onChange={(e) => setSection({ ...section, title: e.target.value })}
              placeholder="Related Links"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sectionActive"
              checked={section.isActive}
              onChange={(e) => setSection({ ...section, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="sectionActive" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>
          <button
            onClick={handleSaveSection}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Section Settings
          </button>
        </div>
      )}

      {/* Related Links Tab */}
      {activeSubTab === 'links' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Related Links</h3>
            <button
              onClick={handleAddLink}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="ri-add-line mr-2"></i>
              Add Link
            </button>
          </div>

          {/* Link Form */}
          {showLinkForm && editingLink && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                {editingLink.id ? 'Edit Link' : 'Add New Link'}
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link Name *
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={editingLink.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      // Auto-generate URL from name for new links, but allow manual editing
                      const href = !editingLink.id && !editingLink.href 
                        ? generateInvestorPageUrl(name)
                        : editingLink.href;
                      setEditingLink({ ...editingLink, name, href });
                    }}
                    placeholder="e.g., Key Managerial Personnel"
                  />
                  {!editingLink.id && editingLink.name && (
                    <p className="mt-1 text-xs text-gray-500">
                      URL will be auto-generated: {generateInvestorPageUrl(editingLink.name)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link URL *
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={editingLink.href}
                    onChange={(e) => setEditingLink({ ...editingLink, href: e.target.value })}
                    placeholder="/investors/key-managerial-personnel/"
                  />
                  {editingLink.name && !editingLink.href && (
                    <button
                      type="button"
                      onClick={() => setEditingLink({ ...editingLink, href: generateInvestorPageUrl(editingLink.name) })}
                      className="mt-1 text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Generate URL from name
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={editingLink.displayOrder}
                    onChange={(e) => setEditingLink({ ...editingLink, displayOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="linkActive"
                    checked={editingLink.isActive}
                    onChange={(e) => setEditingLink({ ...editingLink, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="linkActive" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveLink}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowLinkForm(false);
                      setEditingLink(null);
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

          {/* Links Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading links...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
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
                  {links.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No links found. Click "Add Link" to create one.
                      </td>
                    </tr>
                  ) : (
                    links
                      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                      .map((link) => (
                        <tr key={link.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {link.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {link.href}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {link.displayOrder}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                link.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {link.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEditLink(link)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => link.id && handleDeleteLink(link.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
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
      )}

      {/* Key Personnel Tab */}
      {activeSubTab === 'personnel' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Key Personnel</h3>
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
                <div>
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
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={editingPersonnel.address || ''}
                    onChange={(e) => setEditingPersonnel({ ...editingPersonnel, address: e.target.value })}
                    placeholder="e.g., 2nd Floor, No.313, Refex Towers, Sterling Road,"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={editingPersonnel.address2 || ''}
                    onChange={(e) => setEditingPersonnel({ ...editingPersonnel, address2: e.target.value })}
                    placeholder="e.g., Valluvar Kottam High Road, Nungambakkam,"
                  />
                </div>
                <div className="md:col-span-2">
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
                <div className="md:col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    id="personnelActive"
                    checked={editingPersonnel.isActive}
                    onChange={(e) => setEditingPersonnel({ ...editingPersonnel, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="personnelActive" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button
                    onClick={handleSavePersonnel}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save
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

          {/* Personnel Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
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
                {personnel.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No key personnel found. Click "Add Personnel" to create one.
                    </td>
                  </tr>
                ) : (
                  personnel
                    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                    .map((person) => (
                      <tr key={person.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {person.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {person.position || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {person.company || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {person.phone && <div>Phone: {person.phone}</div>}
                          {person.email && <div>Email: {person.email}</div>}
                          {!person.phone && !person.email && '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {person.displayOrder}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              person.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {person.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditPersonnel(person)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => person.id && handleDeletePersonnel(person.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

