import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../../services/api';

interface AboutSection {
  id?: number;
  title: string;
  content: string;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
}

export default function AboutSectionCMS() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingSection, setEditingSection] = useState<AboutSection | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await aboutCmsApi.getSections();
      setSections(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load sections');
      // For demo: use mock data if backend is not available
      setSections([
        {
          id: 1,
          title: 'ABOUT US',
          content: 'Refex Industries Limited is a dynamic, diversified enterprise with strategic interests in refrigerant gases, coal and ash management, power trading, clean mobility, and renewable energy. We are committed to sustainability, innovation, and long-term value creation across sectors critical to India\'s growth.',
          icon: 'ri-information-line',
          color: '#7abc43',
          order: 1,
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
    const section: AboutSection = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      icon: formData.get('icon') as string || undefined,
      color: formData.get('color') as string || undefined,
      order: parseInt(formData.get('order') as string) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      setError('');
      setSuccess('');
      
      if (editingSection?.id) {
        await aboutCmsApi.updateSection(editingSection.id, section);
        setSuccess('Section updated successfully!');
      } else {
        await aboutCmsApi.createSection(section);
        setSuccess('Section created successfully!');
      }
      
      setShowForm(false);
      setEditingSection(null);
      loadSections();
    } catch (err: any) {
      setError(err.message || 'Failed to save section');
      // For demo: update local state if backend is not available
      if (editingSection?.id) {
        setSections(sections.map(s => s.id === editingSection.id ? { ...section, id: editingSection.id } : s));
        setSuccess('Section updated (demo mode)!');
        setShowForm(false);
        setEditingSection(null);
      } else {
        const newSection = { ...section, id: Date.now() };
        setSections([...sections, newSection]);
        setSuccess('Section created (demo mode)!');
        setShowForm(false);
        setEditingSection(null);
      }
    }
  };

  const handleEdit = (section: AboutSection) => {
    setEditingSection(section);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      setError('');
      await aboutCmsApi.deleteSection(id);
      setSuccess('Section deleted successfully!');
      loadSections();
    } catch (err: any) {
      setError(err.message || 'Failed to delete section');
      // For demo: update local state if backend is not available
      setSections(sections.filter(s => s.id !== id));
      setSuccess('Section deleted (demo mode)!');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSection(null);
  };

  const sortedSections = [...sections].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">About Section CMS</h2>
          <p className="text-gray-600 mt-1">Manage about section content for the home page</p>
        </div>
        <button
          onClick={() => {
            setEditingSection(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add New Section
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
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingSection ? 'Edit Section' : 'Add New Section'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingSection?.title || ''}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., ABOUT US"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  defaultValue={editingSection?.content || ''}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter section content/description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (RemixIcon class)
                  </label>
                  <input
                    type="text"
                    name="icon"
                    defaultValue={editingSection?.icon || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., ri-information-line"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    <a href="https://remixicon.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Browse icons
                    </a>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color (Hex code)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="color"
                      defaultValue={editingSection?.color || '#7abc43'}
                      className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      name="color"
                      defaultValue={editingSection?.color || '#7abc43'}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="#7abc43"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  defaultValue={editingSection?.order || 0}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editingSection?.isActive !== false}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Active (show on website)</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingSection ? 'Update Section' : 'Create Section'}
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
      )}

      {/* Sections List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading sections...</p>
        </div>
      ) : sortedSections.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <i className="ri-file-text-line text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">No sections found. Add your first section to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
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
                {sortedSections.map((section) => (
                  <tr key={section.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{section.title}</div>
                      {section.icon && (
                        <div className="text-xs text-gray-500 mt-1">
                          <i className={section.icon}></i> {section.icon}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-md truncate">
                        {section.content}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded">
                        {section.order || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          section.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {section.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(section)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <i className="ri-edit-line"></i> Edit
                      </button>
                      <button
                        onClick={() => section.id && handleDelete(section.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <i className="ri-delete-bin-line"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

