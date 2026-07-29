import { useState, useEffect } from 'react';
import { homeCmsApi } from '../../../../services/api';

interface FlipCard {
  id?: number;
  title: string;
  description: string;
  image: string;
  backImage: string;
  link: string;
  order: number;
  isActive: boolean;
}

export default function FlipCardsSectionCMS() {
  const [cards, setCards] = useState<FlipCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingCard, setEditingCard] = useState<FlipCard | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingFrontImage, setUploadingFrontImage] = useState(false);
  const [uploadingBackImage, setUploadingBackImage] = useState(false);
  const [frontImageUrl, setFrontImageUrl] = useState('');
  const [backImageUrl, setBackImageUrl] = useState('');
  const [frontImageUrlFromUpload, setFrontImageUrlFromUpload] = useState(false);
  const [backImageUrlFromUpload, setBackImageUrlFromUpload] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await homeCmsApi.getFlipCards();
      setCards(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load flip cards');
      // For demo: use existing data from FlipCardsSection
      setCards([
        {
          id: 1,
          title: 'Sustainability & ESG',
          description: 'Advancing sustainable progress through circular economy solutions, responsible business practices, and a commitment to creating lasting value.',
          image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/5c9042a5517cccc81c390f42360622c6.png',
          backImage: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/ff134ade3e7cdb06a591b9f787f35d1d.png',
          link: '/esg/',
          order: 1,
          isActive: true,
        },
        {
          id: 2,
          title: 'Investors',
          description: 'Explore our financial reports, stock information, investor presentations, and key announcements to learn more about how we\'re building a future-focused business.',
          image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/857fbfe05f675330f7e584bf0ab44ecc.png',
          backImage: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/4fdca67bdfb39a83d2b83210bb1b5cf3.png',
          link: '/investors/',
          order: 2,
          isActive: true,
        },
        {
          id: 3,
          title: 'Life At Refex',
          description: 'Great businesses are built by great people. At Refex, we foster an environment where talent is empowered, collaboration is celebrated, and every individual has the opportunity to make a meaningful impact.',
          image: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/8818c5d55c5844bdefd4f3d1721b90ed.png',
          backImage: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/c46bbd8b593bd9cb6b8790cb61632cd7.png',
          link: '/careers/',
          order: 3,
          isActive: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!frontImageUrl) {
      setError('Please upload a front image');
      return;
    }
    if (!backImageUrl) {
      setError('Please upload a back image');
      return;
    }
    const formData = new FormData(e.currentTarget);
    const card: FlipCard = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: frontImageUrl,
      backImage: backImageUrl,
      link: formData.get('link') as string,
      order: parseInt(formData.get('order') as string) || 0,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      setError('');
      setSuccess('');
      
      if (editingCard?.id) {
        await homeCmsApi.updateFlipCard(editingCard.id, card);
        setSuccess('Flip card updated successfully!');
      } else {
        await homeCmsApi.createFlipCard(card);
        setSuccess('Flip card created successfully!');
      }
      
      setShowForm(false);
      setEditingCard(null);
      setFrontImageUrl('');
      setBackImageUrl('');
      setFrontImageUrlFromUpload(false);
      setBackImageUrlFromUpload(false);
      loadCards();
    } catch (err: any) {
      setError(err.message || 'Failed to save flip card');
      // For demo: update local state if backend is not available
      if (editingCard?.id) {
        setCards(cards.map(c => c.id === editingCard.id ? { ...card, id: editingCard.id } : c));
        setSuccess('Flip card updated (demo mode)!');
        setShowForm(false);
        setEditingCard(null);
        setFrontImageUrl('');
        setBackImageUrl('');
        setFrontImageUrlFromUpload(false);
        setBackImageUrlFromUpload(false);
      } else {
        const newCard = { ...card, id: Date.now() };
        setCards([...cards, newCard]);
        setSuccess('Flip card created (demo mode)!');
        setShowForm(false);
        setEditingCard(null);
        setFrontImageUrl('');
        setBackImageUrl('');
        setFrontImageUrlFromUpload(false);
        setBackImageUrlFromUpload(false);
      }
    }
  };

  const handleEdit = (card: FlipCard) => {
    setEditingCard(card);
    setFrontImageUrl(card.image || '');
    setBackImageUrl(card.backImage || '');
    setFrontImageUrlFromUpload(false);
    setBackImageUrlFromUpload(false);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this flip card?')) return;

    try {
      setError('');
      await homeCmsApi.deleteFlipCard(id);
      setSuccess('Flip card deleted successfully!');
      loadCards();
    } catch (err: any) {
      setError(err.message || 'Failed to delete flip card');
      // For demo: update local state if backend is not available
      setCards(cards.filter(c => c.id !== id));
      setSuccess('Flip card deleted (demo mode)!');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCard(null);
    setFrontImageUrl('');
    setBackImageUrl('');
    setFrontImageUrlFromUpload(false);
    setBackImageUrlFromUpload(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
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
      type === 'front' ? setUploadingFrontImage(true) : setUploadingBackImage(true);
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
        
        if (type === 'front') {
          setFrontImageUrl(fullImageUrl);
          setFrontImageUrlFromUpload(true);
        } else {
          setBackImageUrl(fullImageUrl);
          setBackImageUrlFromUpload(true);
        }
        setSuccess('Image uploaded successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      type === 'front' ? setUploadingFrontImage(false) : setUploadingBackImage(false);
    }
  };

  const sortedCards = [...cards].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Flip Cards Section CMS</h2>
          <p className="text-gray-600 mt-1">Manage flip cards for the home page</p>
        </div>
        <button
          onClick={() => {
            setEditingCard(null);
            setFrontImageUrl('');
            setBackImageUrl('');
            setFrontImageUrlFromUpload(false);
            setBackImageUrlFromUpload(false);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add New Card
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
                {editingCard ? 'Edit Flip Card' : 'Add New Flip Card'}
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
                  defaultValue={editingCard?.title || ''}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Sustainability & ESG"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  defaultValue={editingCard?.description || ''}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter card description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Front Image
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'front')}
                    disabled={uploadingFrontImage}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  {uploadingFrontImage && (
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Uploading...
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Upload an image file (max 10MB)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Front Image URL *
                </label>
                {frontImageUrl ? (
                  <div className="space-y-2">
                    <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 break-all">
                      {frontImageUrl}
                    </div>
                    <img
                      src={frontImageUrl}
                      alt="Front Preview"
                      className="mt-2 w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 italic">
                    No image uploaded yet. Please upload an image above.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Back Image
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'back')}
                    disabled={uploadingBackImage}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  {uploadingBackImage && (
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Uploading...
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Image shown when card flips on hover</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Back Image URL *
                </label>
                {backImageUrl ? (
                  <div className="space-y-2">
                    <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 break-all">
                      {backImageUrl}
                    </div>
                    <img
                      src={backImageUrl}
                      alt="Back Preview"
                      className="mt-2 w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 italic">
                    No image uploaded yet. Please upload an image above.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link *
                </label>
                <input
                  type="text"
                  name="link"
                  defaultValue={editingCard?.link || ''}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., /esg/ or https://example.com"
                />
                <p className="text-xs text-gray-500 mt-1">Relative URL (e.g., /esg/) or absolute URL (e.g., https://...)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  defaultValue={editingCard?.order || 0}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editingCard?.isActive !== false}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Active (show on website)</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCard ? 'Update Card' : 'Create Card'}
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

      {/* Cards List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading flip cards...</p>
        </div>
      ) : sortedCards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <i className="ri-flip-horizontal-line text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">No flip cards found. Add your first card to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Front Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Link
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
                {sortedCards.map((card) => (
                  <tr key={card.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=Front';
                          }}
                        />
                        {card.backImage && (
                          <img
                            src={card.backImage}
                            alt={`${card.title} back`}
                            className="w-16 h-16 object-cover rounded border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=Back';
                            }}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{card.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-md truncate">
                        {card.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-blue-600 truncate max-w-xs">{card.link}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded">
                        {card.order || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          card.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {card.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(card)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <i className="ri-edit-line"></i> Edit
                      </button>
                      <button
                        onClick={() => card.id && handleDelete(card.id)}
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

