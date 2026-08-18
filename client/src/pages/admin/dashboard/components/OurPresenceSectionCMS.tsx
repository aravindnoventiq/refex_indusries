import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../../services/api';
import {
  PRESENCE_VERTICAL_OPTIONS,
  REFEX_STATE_PRESENCE,
  type StatePresence,
} from '../../../about-us/data/indiaPresenceData';

interface AboutPresence {
  id?: number;
  title: string;
  subtitle?: string;
  mapImage?: string;
  presenceTextImage?: string;
  states?: StatePresence[];
  isActive: boolean;
}

export default function OurPresenceSectionCMS() {
  const [presence, setPresence] = useState<AboutPresence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingMapImage, setUploadingMapImage] = useState(false);
  const [uploadingTextImage, setUploadingTextImage] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'map' | 'text') => {
    const file = event.target.files?.[0];
    if (!file || !presence) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be less than 10MB');
      return;
    }

    try {
      type === 'map' ? setUploadingMapImage(true) : setUploadingTextImage(true);
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
        
        if (type === 'map') {
          setPresence({ ...presence, mapImage: fullImageUrl });
        } else {
          setPresence({ ...presence, presenceTextImage: fullImageUrl });
        }
        setSuccess('Image uploaded successfully');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      type === 'map' ? setUploadingMapImage(false) : setUploadingTextImage(false);
    }
  };

  useEffect(() => {
    loadPresence();
  }, []);

  const loadPresence = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await aboutCmsApi.getPresence();
      setPresence({
        ...(data || {
          title: 'Driving Impact Across India',
          subtitle: 'Spanning Across the Nation',
          isActive: true,
        }),
        states:
          Array.isArray(data?.states) && data.states.length > 0
            ? data.states
            : REFEX_STATE_PRESENCE,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load presence section');
      // Fallback to default data
      setPresence({
        title: 'Driving Impact Across India',
        subtitle: 'Spanning Across the Nation',
        mapImage: 'https://refex.co.in/wp-content/uploads/2025/06/mobile-map02.jpg',
        presenceTextImage: 'https://refex.co.in/wp-content/uploads/2025/08/presence-text-new04.png',
        states: REFEX_STATE_PRESENCE,
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!presence) return;

    if (!presence.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await aboutCmsApi.savePresence(presence);
      setSuccess('Presence section saved successfully');
      loadPresence();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save presence section');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading presence section...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Presence Section</h2>

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

      {presence && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={presence.title}
              onChange={(e) => setPresence({ ...presence, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Driving Impact Across India"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={presence.subtitle || ''}
              onChange={(e) => setPresence({ ...presence, subtitle: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Spanning Across the Nation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Map Image
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'map')}
                disabled={uploadingMapImage}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {uploadingMapImage && (
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
              Map Image URL
            </label>
            {presence.mapImage ? (
              <div className="space-y-2">
                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 break-all">
                  {presence.mapImage}
                </div>
                <div className="mt-2">
                  <img 
                    src={presence.mapImage} 
                    alt="Map Preview" 
                    className="max-w-md h-auto rounded border border-gray-300"
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
              Upload Presence Text Image
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'text')}
                disabled={uploadingTextImage}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {uploadingTextImage && (
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
              Presence Text Image URL
            </label>
            {presence.presenceTextImage ? (
              <div className="space-y-2">
                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 break-all">
                  {presence.presenceTextImage}
                </div>
                <div className="mt-2">
                  <img 
                    src={presence.presenceTextImage} 
                    alt="Presence Text Preview" 
                    className="max-w-md h-auto rounded border border-gray-300"
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
            <label className="mb-2 block text-sm font-medium text-gray-700">Map states & verticals</label>
            <p className="mb-3 text-xs text-gray-500">
              Tick the businesses present in each state. This drives the interactive India map.
            </p>
            <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3">
              {(presence.states || REFEX_STATE_PRESENCE).map((state, index) => (
                <div key={state.id} className="rounded-md border border-gray-100 p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={state.name}
                      onChange={(e) => {
                        const states = [...(presence.states || [])];
                        states[index] = { ...state, name: e.target.value };
                        setPresence({ ...presence, states });
                      }}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm font-semibold"
                    />
                    <span className="shrink-0 text-xs text-gray-400">{state.id}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {PRESENCE_VERTICAL_OPTIONS.map((vertical) => {
                      const checked = state.verticals.includes(vertical);
                      return (
                        <label key={vertical} className="flex items-center gap-1.5 text-xs text-gray-700">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const states = [...(presence.states || [])];
                              const verticals = checked
                                ? state.verticals.filter((item) => item !== vertical)
                                : [...state.verticals, vertical];
                              states[index] = { ...state, verticals };
                              setPresence({ ...presence, states });
                            }}
                          />
                          {vertical}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={presence.isActive}
              onChange={(e) => setPresence({ ...presence, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={loadPresence}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

