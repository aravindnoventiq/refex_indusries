import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../../services/api';

interface VisionMission {
  id?: number;
  visionTitle: string;
  visionDescription?: string;
  visionImage?: string;
  missionTitle: string;
  missionImage?: string;
  missionPoints?: string[];
  isActive: boolean;
}

export default function MissionVisionSectionCMS() {
  const [vm, setVm] = useState<VisionMission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [uploadingVisionImage, setUploadingVisionImage] = useState(false);
  const [uploadingMissionImage, setUploadingMissionImage] = useState(false);
  const [visionImageUrl, setVisionImageUrl] = useState('');
  const [missionImageUrl, setMissionImageUrl] = useState('');

  useEffect(() => {
    loadVisionMission();
  }, []);

  const loadVisionMission = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await aboutCmsApi.getVisionMission();
      setVm(data || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load vision & mission section');
      // For demo: use existing data from MissionVisionSection
      setVm({
        visionTitle: 'Vision',
        visionDescription: 'Refex aims to be a globally admired conglomerate, driving long-term sustainable growth through innovation, purposeful collaborations and partnerships, and an unwavering commitment to excellence, while contributing meaningfully to societal progress',
        missionTitle: 'Mission',
        missionImage: '',
        visionImage: 'https://static.readdy.ai/image/d0ead66ce635a168f1e83b108be94826/9e3a526ee87e445a5adad66c9b086662.png',
        missionPoints: [],
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Parse missionPoints if provided
    let missionPoints: string[] = [];
    const missionPointsText = formData.get('missionPoints') as string;
    if (missionPointsText) {
      missionPoints = missionPointsText.split('\n').filter(p => p.trim());
    }

    const vmData: VisionMission = {
      visionTitle: formData.get('visionTitle') as string,
      visionDescription: formData.get('visionDescription') as string || undefined,
      visionImage: visionImageUrl || formData.get('visionImage') as string || undefined,
      missionTitle: formData.get('missionTitle') as string,
      missionImage: missionImageUrl || formData.get('missionImage') as string || undefined,
      missionPoints: missionPoints.length > 0 ? missionPoints : undefined,
      isActive: formData.get('isActive') === 'on',
    };

    try {
      setError('');
      setSuccess('');
      
      await aboutCmsApi.saveVisionMission(vmData);
      setSuccess('Vision & Mission section updated successfully!');
      loadVisionMission();
      setShowForm(false);
      setVisionImageUrl('');
      setMissionImageUrl('');
    } catch (err: any) {
      setError(err.message || 'Failed to save vision & mission section');
      // For demo: update local state if backend is not available
      setVm(vmData);
      setSuccess('Vision & Mission section updated (demo mode)!');
      setShowForm(false);
      setVisionImageUrl('');
      setMissionImageUrl('');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setVisionImageUrl('');
    setMissionImageUrl('');
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'vision' | 'mission') => {
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
      type === 'vision' ? setUploadingVisionImage(true) : setUploadingMissionImage(true);
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
        
        if (type === 'vision') {
          setVisionImageUrl(fullImageUrl);
        } else {
          setMissionImageUrl(fullImageUrl);
        }
        setSuccess('Image uploaded successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      type === 'vision' ? setUploadingVisionImage(false) : setUploadingMissionImage(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading vision & mission section...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vision & Mission Section CMS</h2>
          <p className="text-gray-600 mt-1">Manage the Vision & Mission section of the About Us page</p>
        </div>
        <button
          onClick={() => {
            setVisionImageUrl(vm?.visionImage || '');
            setMissionImageUrl(vm?.missionImage || '');
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i className="ri-edit-line mr-2"></i>
          {vm ? 'Edit Vision & Mission' : 'Create Vision & Mission'}
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

      {/* Current Section Preview */}
      {vm && !showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Vision & Mission Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vision</label>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{vm.visionTitle}</h4>
              {vm.visionDescription && (
                <p className="text-gray-700">{vm.visionDescription}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{vm.missionTitle}</h4>
              {vm.missionPoints && vm.missionPoints.length > 0 && (
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {vm.missionPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {(vm.visionImage || vm.missionImage) && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Image (from Vision Image)</label>
              <img
                src={vm.visionImage || vm.missionImage}
                alt="Background preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x200?text=No+Image';
                }}
              />
            </div>
          )}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                vm.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {vm.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Edit Vision & Mission Section</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Vision */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Vision</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vision Title *
                      </label>
                      <input
                        type="text"
                        name="visionTitle"
                        required
                        defaultValue={vm?.visionTitle || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vision Description
                      </label>
                      <textarea
                        name="visionDescription"
                        rows={4}
                        defaultValue={vm?.visionDescription || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Vision Image
                      </label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'vision')}
                          disabled={uploadingVisionImage}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {uploadingVisionImage && (
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
                        Vision Image URL
                      </label>
                      {visionImageUrl ? (
                        <div className="space-y-2">
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700 break-all">
                            {visionImageUrl}
                          </div>
                          <div className="mt-2">
                            <img
                              src={visionImageUrl}
                              alt="Preview"
                              className="w-full h-32 object-cover border border-gray-300 rounded"
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
                  </div>

                  {/* Mission */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Mission</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mission Title *
                      </label>
                      <input
                        type="text"
                        name="missionTitle"
                        required
                        defaultValue={vm?.missionTitle || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mission Points (one per line)
                      </label>
                      <textarea
                        name="missionPoints"
                        rows={4}
                        defaultValue={vm?.missionPoints ? vm.missionPoints.join('\n') : ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter mission points, one per line"
                      />
                      <p className="text-xs text-gray-500 mt-1">Each line will be a separate mission point</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Mission Image
                      </label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'mission')}
                          disabled={uploadingMissionImage}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {uploadingMissionImage && (
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
                        Mission Image URL
                      </label>
                      {missionImageUrl ? (
                        <div className="space-y-2">
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700 break-all">
                            {missionImageUrl}
                          </div>
                          <div className="mt-2">
                            <img
                              src={missionImageUrl}
                              alt="Preview"
                              className="w-full h-32 object-cover border border-gray-300 rounded"
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
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={vm?.isActive !== false}
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
                    Save Vision & Mission Section
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
    </div>
  );
}

