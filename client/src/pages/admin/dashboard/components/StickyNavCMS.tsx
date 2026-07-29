import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../../services/api';

interface StickyNavItem {
  id?: number;
  name: string;
  href: string;
  sectionId: string;
  order: number;
  isActive: boolean;
}

export default function StickyNavCMS() {
  const [navItems, setNavItems] = useState<StickyNavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingItem, setEditingItem] = useState<StickyNavItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadNavItems();
  }, []);

  const loadNavItems = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await aboutCmsApi.getStickyNavItems();
      setNavItems(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load sticky nav items');
      // For demo: use existing data from StickyNav
      setNavItems([
        {
          id: 1,
          name: 'Mission & Vision',
          href: '#mission-vision',
          sectionId: 'mission-vision',
          order: 1,
          isActive: true,
        },
        {
          id: 2,
          name: 'Core Values',
          href: '#core-values',
          sectionId: 'core-values',
          order: 2,
          isActive: true,
        },
        {
          id: 3,
          name: 'Board Members',
          href: '#board-members',
          sectionId: 'board-members',
          order: 3,
          isActive: true,
        },
        {
          id: 4,
          name: 'Our Presence',
          href: '#our presence',
          sectionId: 'our presence',
          order: 4,
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
    const navItem: StickyNavItem = {
      name: formData.get('name') as string,
      href: formData.get('href') as string,
      sectionId: formData.get('sectionId') as string,
      order: parseInt(formData.get('order') as string) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      setError('');
      setSuccess('');
      
      if (editingItem?.id) {
        await aboutCmsApi.updateStickyNavItem(editingItem.id, navItem);
        setSuccess('Navigation item updated successfully!');
      } else {
        await aboutCmsApi.createStickyNavItem(navItem);
        setSuccess('Navigation item created successfully!');
      }
      
      setShowForm(false);
      setEditingItem(null);
      loadNavItems();
    } catch (err: any) {
      setError(err.message || 'Failed to save navigation item');
      // For demo: update local state if backend is not available
      if (editingItem?.id) {
        setNavItems(navItems.map(item => item.id === editingItem.id ? { ...navItem, id: editingItem.id } : item));
        setSuccess('Navigation item updated (demo mode)!');
        setShowForm(false);
        setEditingItem(null);
      } else {
        const newItem = { ...navItem, id: Date.now() };
        setNavItems([...navItems, newItem]);
        setSuccess('Navigation item created (demo mode)!');
        setShowForm(false);
        setEditingItem(null);
      }
    }
  };

  const handleEdit = (item: StickyNavItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this navigation item?')) return;

    try {
      setError('');
      await aboutCmsApi.deleteStickyNavItem(id);
      setSuccess('Navigation item deleted successfully!');
      loadNavItems();
    } catch (err: any) {
      setError(err.message || 'Failed to delete navigation item');
      // For demo: update local state if backend is not available
      setNavItems(navItems.filter(item => item.id !== id));
      setSuccess('Navigation item deleted (demo mode)!');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const sortedItems = [...navItems].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sticky Navigation CMS</h2>
          <p className="text-gray-600 mt-1">Manage sticky navigation items for the About Us page</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add New Item
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
                {editingItem ? 'Edit Navigation Item' : 'Add New Navigation Item'}
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
                    defaultValue={editingItem?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Href (Link) *
                  </label>
                  <input
                    type="text"
                    name="href"
                    required
                    defaultValue={editingItem?.href || ''}
                    placeholder="#mission-vision"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use anchor links like #mission-vision</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section ID *
                  </label>
                  <input
                    type="text"
                    name="sectionId"
                    required
                    defaultValue={editingItem?.sectionId || ''}
                    placeholder="mission-vision"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">ID of the section element (without #)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    defaultValue={editingItem?.order || 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={editingItem?.isActive !== false}
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
                    {editingItem ? 'Update Item' : 'Create Item'}
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

      {/* Nav Items List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading navigation items...</p>
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Href
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section ID
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
              {sortedItems.map((item) => (
                <tr key={item.id} className={!item.isActive ? 'opacity-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.href}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.sectionId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => item.id && handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No navigation items found. Click "Add New Item" to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

