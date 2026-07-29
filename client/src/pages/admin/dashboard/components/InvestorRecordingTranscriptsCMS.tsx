import { useState, useEffect } from 'react';
import { investorsCmsApi } from '../../../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

interface Audio {
  name: string;
  year: string;
  audioUrl: string;
  pdfUrl: string;
}

interface RecordingTranscriptsPage {
  id?: number;
  slug: string;
  title: string;
  hasYearFilter: boolean;
  filterItems?: string[]; // Array of filter items (years) for the filter dropdown
  audios: Audio[];
  isActive: boolean;
}

export default function InvestorRecordingTranscriptsCMS() {
  const [pageContent, setPageContent] = useState<RecordingTranscriptsPage>({
    slug: 'recording-transcripts-of-post-earnings-quarterly-calls',
    title: 'Recording & Transcripts of Post Earnings / Quarterly Calls',
    hasYearFilter: true,
    filterItems: [],
    audios: [],
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingAudio, setEditingAudio] = useState<{ audio: Audio | null; audioIndex: number } | null>(null);
  const [showAudioForm, setShowAudioForm] = useState(false);
  const [showFilterItemForm, setShowFilterItemForm] = useState(false);
  const [editingFilterItem, setEditingFilterItem] = useState<string>('');
  const [editingFilterIndex, setEditingFilterIndex] = useState<number>(-1);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfUrlInput, setPdfUrlInput] = useState('');
  const [isManualPdfUrl, setIsManualPdfUrl] = useState(false);

  useEffect(() => {
    if (editingAudio?.audio?.pdfUrl) {
      const isManual = !editingAudio.audio.pdfUrl.startsWith('/uploads/');
      setIsManualPdfUrl(isManual);
      if (isManual) setPdfUrlInput(editingAudio.audio.pdfUrl);
    } else {
      setIsManualPdfUrl(false);
      setPdfUrlInput('');
    }
  }, [editingAudio?.audioIndex]);

  const isExternalPdfUrl = (url: string): boolean => {
    if (!url) return false;
    const trimmed = url.trim();
    return (trimmed.startsWith('http://') || trimmed.startsWith('https://')) &&
      !trimmed.startsWith(`${API_BASE_URL}`);
  };

  // Automatically download PDF from external URL and save to server
  const handlePdfUrlChange = async (url: string) => {
    setPdfUrlInput(url);

    // Also update the audio state IMMEDIATELY for manual entry or local paths
    if (editingAudio && editingAudio.audio) {
      setEditingAudio({
        ...editingAudio,
        audio: { ...editingAudio.audio, pdfUrl: url.trim() }
      });
    }

    // If it's an external URL, automatically download and save
    if (isExternalPdfUrl(url) && editingAudio?.audio) {
      setDownloadingPdf(true);
      setError('');

      try {
        // Download to recording-transcripts subfolder
        const response = await fetch(`${API_BASE_URL}/api/download-pdf-from-url/recording-transcripts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: url.trim() }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to download PDF');
        }

        const data = await response.json();
        if (editingAudio && editingAudio.audio) {
          setEditingAudio({
            ...editingAudio,
            audio: { ...editingAudio.audio, pdfUrl: data.pdfUrl }
          });
        }
        setPdfUrlInput('');
        setSuccess('Transcript PDF downloaded and saved automatically');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: any) {
        setError(err.message || 'Failed to download PDF from URL');
      } finally {
        setDownloadingPdf(false);
      }
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingAudio?.audio) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('PDF size should be less than 50MB');
      return;
    }

    setUploadingPdf(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      // Upload transcript PDFs to recording-transcripts subfolder
      const response = await fetch(`${API_BASE_URL}/api/upload/pdf/recording-transcripts`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload PDF');
      }

      const data = await response.json();
      setEditingAudio({
        ...editingAudio,
        audio: { ...editingAudio.audio, pdfUrl: data.pdfUrl }
      });
      setSuccess('PDF uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload PDF');
    } finally {
      setUploadingPdf(false);
    }
  };

  useEffect(() => {
    loadPageContent();
  }, []);

  const loadPageContent = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await investorsCmsApi.getPageContentBySlug('recording-transcripts-of-post-earnings-quarterly-calls');
      if (data) {
        // Handle both camelCase and snake_case from API response
        const filterItems = (data.filterItems || (data as any).filter_items || []);
        // Handle audios - could be in sections[0].audios or directly in audios
        let audios: Audio[] = [];
        if (data.audios && Array.isArray(data.audios)) {
          audios = data.audios;
        } else if (data.sections && data.sections.length > 0 && data.sections[0].audios) {
          audios = data.sections[0].audios;
        }

        const pageData = {
          ...data,
          filterItems: Array.isArray(filterItems) ? filterItems : [],
          audios: audios,
        };
        setPageContent(pageData);
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load recording transcripts page');
      }
      // Use default structure if not found
      setPageContent({
        slug: 'recording-transcripts-of-post-earnings-quarterly-calls',
        title: 'Recording & Transcripts of Post Earnings / Quarterly Calls',
        hasYearFilter: true,
        filterItems: [],
        audios: [],
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');

      // Ensure filterItems is included and is an array
      // Store audios in sections[0].audios for consistency with other pages
      const saveData = {
        ...pageContent,
        filterItems: pageContent.filterItems || [],
        sections: [
          {
            title: 'Recording and Transcripts',
            documents: [],
            contents: [],
            audios: pageContent.audios || [],
          }
        ],
      };

      // Check if page exists
      let existingPage;
      try {
        existingPage = await investorsCmsApi.getPageContentBySlug('recording-transcripts-of-post-earnings-quarterly-calls');
      } catch (e) {
        // Page doesn't exist yet
      }

      if (existingPage && existingPage.id) {
        await investorsCmsApi.updatePageContent(existingPage.id, saveData);
        setSuccess('Recording Transcripts page updated successfully');
      } else {
        await investorsCmsApi.createPageContent(saveData);
        setSuccess('Recording Transcripts page created successfully');
      }

      // Reload the data to ensure we have the latest from the server
      await loadPageContent();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save recording transcripts page');
    }
  };

  const handleAddAudio = () => {
    setEditingAudio({
      audio: {
        name: '',
        year: '',
        audioUrl: '',
        pdfUrl: '',
      },
      audioIndex: -1,
    });
    setShowAudioForm(true);
    setError('');
  };

  const handleEditAudio = (audioIndex: number) => {
    const audio = pageContent.audios[audioIndex];
    setEditingAudio({
      audio: { ...audio },
      audioIndex,
    });
    setShowAudioForm(true);
    setError('');
  };

  const handleDeleteAudio = (audioIndex: number) => {
    if (!confirm('Are you sure you want to delete this audio recording?')) {
      return;
    }
    const updatedAudios = [...pageContent.audios];
    updatedAudios.splice(audioIndex, 1);
    setPageContent({ ...pageContent, audios: updatedAudios });
  };

  const handleSaveAudio = () => {
    if (!editingAudio || !editingAudio.audio) {
      return;
    }

    const audio = editingAudio.audio;
    if (!audio.name.trim()) {
      setError('Audio name is required');
      return;
    }
    if (!audio.audioUrl.trim()) {
      setError('Audio URL is required');
      return;
    }
    if (!audio.pdfUrl.trim()) {
      setError('Transcript PDF URL is required');
      return;
    }
    if (pageContent.hasYearFilter && !audio.year.trim()) {
      setError('Year is required when year filter is enabled');
      return;
    }

    const updatedAudios = [...pageContent.audios];
    if (editingAudio.audioIndex >= 0) {
      // Update existing audio
      updatedAudios[editingAudio.audioIndex] = audio;
    } else {
      // Add new audio
      updatedAudios.push(audio);
    }

    setPageContent({ ...pageContent, audios: updatedAudios });
    setShowAudioForm(false);
    setEditingAudio(null);
    setError('');
  };

  const handleAudioFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/aac'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid audio file (mp3, wav, m4a, ogg, aac)');
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setError('Audio file size must be less than 50MB');
      return;
    }

    try {
      setUploadingAudio(true);
      setError('');

      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/upload/audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload audio file');
      }

      const data = await response.json();
      if (data.success && data.audioUrl) {
        // Use the full URL from the server
        const fullAudioUrl = data.audioUrl.startsWith('http')
          ? data.audioUrl
          : `${API_BASE_URL}${data.audioUrl}`;

        if (editingAudio) {
          setEditingAudio({
            ...editingAudio,
            audio: {
              ...editingAudio.audio!,
              audioUrl: fullAudioUrl,
            }
          });
        }
        setSuccess('Audio file uploaded successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(data.error || 'Failed to upload audio');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload audio file');
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleAddFilterItem = () => {
    setEditingFilterItem('');
    setEditingFilterIndex(-1);
    setShowFilterItemForm(true);
    setError('');
  };

  const handleEditFilterItem = (index: number) => {
    const filterItems = pageContent.filterItems || [];
    setEditingFilterItem(filterItems[index]);
    setEditingFilterIndex(index);
    setShowFilterItemForm(true);
    setError('');
  };

  const handleDeleteFilterItem = (index: number) => {
    if (!confirm('Are you sure you want to delete this filter item?')) {
      return;
    }
    const filterItems = [...(pageContent.filterItems || [])];
    filterItems.splice(index, 1);
    setPageContent({ ...pageContent, filterItems });
  };

  const handleSaveFilterItem = () => {
    if (!editingFilterItem.trim()) {
      setError('Filter item (year) is required');
      return;
    }

    const filterItems = [...(pageContent.filterItems || [])];

    // Check for duplicates
    if (filterItems.includes(editingFilterItem.trim()) && editingFilterIndex < 0) {
      setError('This filter item already exists');
      return;
    }

    if (editingFilterIndex >= 0) {
      // Update existing filter item
      filterItems[editingFilterIndex] = editingFilterItem.trim();
    } else {
      // Add new filter item
      filterItems.push(editingFilterItem.trim());
    }

    // Sort filter items in descending order (newest first)
    filterItems.sort((a, b) => b.localeCompare(a));

    setPageContent({ ...pageContent, filterItems });
    setEditingFilterItem('');
    setEditingFilterIndex(-1);
    setShowFilterItemForm(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading recording transcripts page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Premium Header */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Recording & Transcripts CMS</h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Manage audio recordings and transcript documents
            </p>
          </div>
          <button
            onClick={handleSave}
            className="group relative px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <i className="ri-save-line text-lg"></i>
            <span className="font-bold tracking-wide">SAVE ALL CHANGES</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <i className="ri-error-warning-fill text-xl"></i>
          <span className="font-medium">{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <i className="ri-checkbox-circle-fill text-xl"></i>
          <span className="font-medium">{success}</span>
        </div>
      )}

      {/* Configuration Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* General Settings */}
        <div className="lg:col-span-2 bg-gray-50/50 rounded-3xl p-8 border border-gray-100 shadow-inner">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-sm">
              <i className="ri-settings-4-line text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900">General Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Page Title *</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 transition-all"
                value={pageContent.title}
                onChange={(e) => setPageContent({ ...pageContent, title: e.target.value })}
                placeholder="Recording & Transcripts"
              />
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm group hover:border-blue-200 transition-all">
              <input
                type="checkbox"
                id="hasYearFilter"
                checked={pageContent.hasYearFilter}
                onChange={(e) => setPageContent({ ...pageContent, hasYearFilter: e.target.checked })}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg cursor-pointer"
              />
              <label htmlFor="hasYearFilter" className="text-sm font-bold text-gray-700 cursor-pointer select-none group-hover:text-blue-600 transition-colors">Enable Year Filter</label>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm group hover:border-blue-200 transition-all">
              <input
                type="checkbox"
                id="isActive"
                checked={pageContent.isActive}
                onChange={(e) => setPageContent({ ...pageContent, isActive: e.target.checked })}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg cursor-pointer"
              />
              <label htmlFor="isActive" className="text-sm font-bold text-gray-700 cursor-pointer select-none group-hover:text-blue-600 transition-colors">Page Active</label>
            </div>
          </div>
        </div>

        {/* Filter Management */}
        <div className={`transition-all duration-500 ${pageContent.hasYearFilter ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none grayscale'}`}>
          <div className="h-full bg-blue-50/50 rounded-3xl p-8 border border-blue-100 shadow-inner flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-sm">
                  <i className="ri-filter-3-line text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Years</h3>
              </div>
              <button
                onClick={handleAddFilterItem}
                className="w-10 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md flex items-center justify-center active:scale-90"
                title="Add Filter Year"
              >
                <i className="ri-add-line text-xl font-bold"></i>
              </button>
            </div>

            <div className="flex-1 space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
              {(pageContent.filterItems || []).length === 0 ? (
                <div className="h-20 flex items-center justify-center text-gray-400 text-xs font-medium border-2 border-dashed border-blue-200 rounded-2xl italic">No years added</div>
              ) : (
                (pageContent.filterItems || []).map((item, index) => (
                  <div key={index} className="group flex items-center justify-between p-3 bg-white rounded-xl border border-blue-50 shadow-sm hover:border-blue-300 transition-all">
                    <span className="text-sm font-bold text-gray-700">FY {item}</span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button onClick={() => handleEditFilterItem(index)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><i className="ri-pencil-line"></i></button>
                      <button onClick={() => handleDeleteFilterItem(index)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><i className="ri-delete-bin-line"></i></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recordings & Transcripts List */}
      <div className="space-y-6 mb-12">
        <div className="flex justify-between items-center mb-2 px-2">
          <div className="flex items-center gap-2">
            <i className="ri-mic-2-line text-blue-600 font-bold"></i>
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight lowercase first-letter:uppercase">Recordings & Transcripts</h3>
          </div>
          <button
            onClick={handleAddAudio}
            className="group px-6 py-2.5 bg-white text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-blue-100 flex items-center gap-2 font-bold active:scale-95"
          >
            <i className="ri-add-circle-fill text-xl"></i>
            <span>ADD NEW RECORDING</span>
          </button>
        </div>

        {pageContent.audios.length === 0 ? (
          <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
              <i className="ri-mic-line text-4xl text-gray-300"></i>
            </div>
            <h4 className="text-lg font-bold text-gray-900">No recordings yet</h4>
            <p className="text-gray-500 mt-1 max-w-xs mx-auto">Upload audio files and transcript PDFs to populate this section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pageContent.audios.map((audio, audioIndex) => {
              const isEditing = editingAudio?.audioIndex === audioIndex;
              return (
                <div key={audioIndex} className={`group/doc rounded-2xl border transition-all duration-300 ${isEditing ? 'border-blue-400 ring-4 ring-blue-50 bg-blue-50/30 overflow-hidden' : 'border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/30 shadow-none'}`}>
                  {!isEditing ? (
                    <div className="flex items-center justify-between p-5">
                      <div className="flex items-center gap-5 flex-1 min-w-0">
                        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-red-100">
                          <i className="ri-file-pdf-2-fill text-3xl"></i>
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-base font-black text-gray-900 tracking-tight uppercase">{audio.name}</h5>
                          <div className="flex items-center gap-4 mt-2">
                            {audio.year && (
                              <span className="flex items-center gap-1.5 text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-widest">
                                <i className="ri-hashtag text-blue-400"></i> FY {audio.year}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold truncate max-w-[300px]">
                              <i className="ri-mic-line text-blue-300"></i> {audio.audioUrl || "No Audio"}
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold truncate max-w-[300px]">
                              <i className="ri-file-pdf-line text-red-300"></i> {audio.pdfUrl || "No Transcript"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditAudio(audioIndex)}
                          className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-blue-50 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                          title="Edit"
                        >
                          <i className="ri-edit-2-line text-lg"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteAudio(audioIndex)}
                          className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-red-50 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                          title="Delete"
                        >
                          <i className="ri-delete-bin-6-line text-lg"></i>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Inline Edit Mode */
                    <div className="animate-in slide-in-from-left-2 duration-300 bg-white p-8">
                      <div className="flex items-center gap-2 mb-8 text-blue-600 border-b border-blue-50 pb-4">
                        <i className="ri-edit-circle-line text-xl font-bold"></i>
                        <h5 className="text-lg font-black uppercase tracking-tight">Editing Recording</h5>
                      </div>
                      {renderAudioFields()}
                      <div className="mt-10 flex gap-4 pt-8 border-t border-gray-100">
                        <button
                          onClick={handleSaveAudio}
                          className="px-10 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-black text-[10px] tracking-widest uppercase shadow-xl shadow-blue-100 flex items-center gap-2 active:scale-95"
                        >
                          <i className="ri-checkbox-circle-line bg-white/20 p-1 rounded-lg"></i> SAVE UPDATES
                        </button>
                        <button
                          onClick={() => setEditingAudio(null)}
                          className="px-10 py-4 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-all font-black text-[10px] tracking-widest uppercase active:scale-95"
                        >
                          DISCARD
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add New Recording Button */}
      {pageContent.audios.length > 0 && (
        <div className="flex justify-center pb-20">
          <button
            onClick={handleAddAudio}
            className="group relative px-12 py-6 bg-white border-2 border-gray-100 rounded-[2rem] hover:border-blue-500 transition-all duration-500 shadow-xl hover:shadow-blue-200/50 flex flex-col items-center gap-2 active:scale-95"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
              <i className="ri-add-line text-3xl font-bold"></i>
            </div>
            <span className="text-[10px] font-black text-gray-400 group-hover:text-blue-600 uppercase tracking-[0.3em] transition-colors">Add New Recording</span>
          </button>
        </div>
      )}

      {/* Popup Form for ADDING new recording (Add State Only) */}
      {showAudioForm && editingAudio && editingAudio.audioIndex === -1 && (
        <div className="fixed inset-0 bg-[#0f172a]/60 flex items-center justify-center z-[100] p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-10 py-8 flex justify-between items-center text-white relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <i className="ri-mic-line text-8xl"></i>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black tracking-tight uppercase italic">Add New Recording</h3>
                <p className="text-blue-100 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">Configure audio asset and transcript</p>
              </div>
              <button
                onClick={() => { setShowAudioForm(false); setEditingAudio(null); }}
                className="relative z-10 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-white active:scale-95"
                title="Close"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {renderAudioFields()}
            </div>

            <div className="p-8 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-4 px-10">
              <button
                onClick={() => { setShowAudioForm(false); setEditingAudio(null); }}
                className="px-8 py-4 bg-white text-gray-500 rounded-2xl hover:bg-gray-100 border border-gray-200 transition-all font-black text-[10px] tracking-widest uppercase active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAudio}
                className="px-10 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-black text-[10px] tracking-widest uppercase shadow-xl shadow-blue-200 active:scale-95"
              >
                Add Recording
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Item Popup Form */}
      {showFilterItemForm && (
        <div className="fixed inset-0 bg-[#0f172a]/40 flex items-center justify-center z-[110] p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-sm w-full animate-in zoom-in-95 duration-300 border border-gray-100/50">
            <h4 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight italic">
              {editingFilterIndex >= 0 ? 'Edit Year' : 'Add New Year'}
            </h4>
            <div className="mb-8">
              <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 ml-1">Financial Year</label>
              <input
                autoFocus
                type="text"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-5 font-bold text-gray-800 focus:bg-white focus:border-blue-500 transition-all placeholder:text-gray-300 shadow-inner"
                value={editingFilterItem}
                onChange={(e) => setEditingFilterItem(e.target.value)}
                placeholder="2024-25"
                onKeyDown={(e) => e.key === 'Enter' && handleSaveFilterItem()}
              />
              <p className="text-[10px] text-gray-400 mt-2 px-1">Example: <span className="text-gray-600 font-bold">2024-25</span> or <span className="text-gray-600 font-bold">2025</span></p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleSaveFilterItem}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-black tracking-widest shadow-lg hover:shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {editingFilterIndex >= 0 ? 'UPDATE YEAR' : 'SAVE NEW YEAR'}
              </button>
              <button
                onClick={() => { setShowFilterItemForm(false); setEditingFilterItem(''); }}
                className="w-full py-3 text-gray-400 hover:text-gray-600 font-bold text-sm transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function renderAudioFields() {
    if (!editingAudio?.audio) return null;
    const audio = editingAudio.audio;

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2 group">
            <label className="block text-[10px] font-black text-blue-600 uppercase tracking-[0.2rem] mb-2 ml-1 group-focus-within:text-blue-700 transition-colors">
              Recording Name *
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl shadow-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 py-4 px-5 font-bold text-gray-800 transition-all placeholder:text-gray-300"
                value={audio.name}
                onChange={(e) => setEditingAudio({ ...editingAudio, audio: { ...audio, name: e.target.value } })}
                placeholder="e.g., Earnings Conference Call – Q2 FY 26"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
                <i className="ri-mic-line text-xl"></i>
              </div>
            </div>
          </div>

          <div className="group">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2rem] mb-2 ml-1 group-focus-within:text-blue-600 transition-colors">
              Financial Year {pageContent.hasYearFilter ? '*' : ''}
            </label>
            <div className="relative">
              <select
                className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl shadow-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 py-3.5 px-5 font-bold text-gray-800 transition-all appearance-none cursor-pointer"
                value={audio.year}
                onChange={(e) => setEditingAudio({ ...editingAudio, audio: { ...audio, year: e.target.value } })}
              >
                <option value="">Select Year</option>
                {(pageContent.filterItems || []).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-400">
                <i className="ri-arrow-down-s-line text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Audio File Section */}
        <div className="bg-blue-50/30 rounded-[2rem] p-8 border-2 border-dashed border-blue-100 group-focus-within:border-blue-200 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-sm border border-gray-100">
              <i className="ri-headphone-line text-xl"></i>
            </div>
            <div>
              <label className="block text-sm font-black text-gray-800 uppercase tracking-wider">
                Audio Resource *
              </label>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Asset Source Configuration</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <input
                type="text"
                className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 px-5 pr-12 font-bold text-blue-600 focus:border-blue-500 focus:ring-0 transition-all placeholder:text-gray-300 shadow-sm"
                value={audio.audioUrl}
                onChange={(e) => setEditingAudio({ ...editingAudio, audio: { ...audio, audioUrl: e.target.value } })}
                placeholder="https://example.com/audio.mp3"
                disabled={uploadingAudio}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {uploadingAudio ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                ) : (
                  <i className="ri-link text-xl text-gray-300 group-focus-within:text-blue-500 transition-colors"></i>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-[2px] flex-1 bg-gray-100"></div>
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">OR</span>
              <div className="h-[2px] flex-1 bg-gray-100"></div>
            </div>

            <div className="relative">
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={uploadingAudio}
              />
              <div className={`border-2 border-dashed rounded-2xl py-4 px-10 flex items-center justify-center gap-3 transition-all ${uploadingAudio ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50/50'}`}>
                <i className={`${uploadingAudio ? 'ri-loader-4-line animate-spin' : 'ri-upload-2-line'} text-xl ${uploadingAudio ? 'text-blue-600' : 'text-gray-400'}`}></i>
                <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                  {uploadingAudio ? 'Processing Audio...' : 'Upload mp3 File'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Transcript PDF Section */}
        <div className="bg-gray-50/80 rounded-[2rem] p-8 border-2 border-dashed border-gray-200 group-focus-within:border-blue-200 transition-all">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-red-600 flex items-center justify-center shadow-sm border border-gray-100">
                <i className="ri-file-pdf-2-line text-xl"></i>
              </div>
              <div>
                <label className="block text-sm font-black text-gray-800 uppercase tracking-wider">
                  Transcript PDF *
                </label>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Transcript Asset Configuration</p>
              </div>
            </div>

            <button
              onClick={() => setIsManualPdfUrl(!isManualPdfUrl)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 border-2 ${isManualPdfUrl
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                }`}
            >
              <i className={isManualPdfUrl ? "ri-links-line" : "ri-upload-cloud-2-line"}></i>
              {isManualPdfUrl ? 'Paste Link Mode' : 'Upload File Mode'}
            </button>
          </div>

          <div className="animate-in slide-in-from-bottom-2 duration-300">
            {isManualPdfUrl ? (
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="text"
                    className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 px-5 pr-12 font-bold text-blue-600 focus:border-blue-500 focus:ring-0 transition-all placeholder:text-gray-300 shadow-sm"
                    value={pdfUrlInput}
                    onChange={(e) => handlePdfUrlChange(e.target.value)}
                    placeholder="https://example.com/transcript.pdf"
                    disabled={uploadingPdf || downloadingPdf}
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {downloadingPdf ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                    ) : (
                      <i className="ri-link text-xl text-gray-300 group-focus-within:text-blue-500 transition-colors"></i>
                    )}
                  </div>
                </div>
                {downloadingPdf && (
                  <div className="flex items-center gap-3 px-2 animate-pulse mt-2">
                    <div className="flex-1 h-1 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-1/2 rounded-full animate-progress-indeterminate"></div>
                    </div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Processing URL...</span>
                  </div>
                )}
                {!downloadingPdf && audio.pdfUrl && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100/50 w-fit mt-2 animate-in fade-in zoom-in duration-300">
                    <i className="ri-checkbox-circle-fill text-blue-500"></i>
                    <span className="text-[10px] font-bold text-blue-700 truncate max-w-[400px]">Active Transcript: {audio.pdfUrl}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative h-24 group">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={uploadingPdf || downloadingPdf}
                />
                <div className={`absolute inset-0 border-2 border-dashed rounded-2xl flex items-center justify-center gap-4 transition-all ${uploadingPdf ? 'bg-blue-50/50 border-blue-400' : 'bg-white border-gray-200 group-hover:border-blue-400 group-hover:bg-blue-50/30'
                  }`}>
                  {uploadingPdf ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-bounce">
                        <i className="ri-upload-2-fill text-2xl text-blue-600"></i>
                      </div>
                      <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Uploading Transcript...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-all">
                        <i className="ri-file-upload-line text-xl text-gray-400 group-hover:text-blue-600"></i>
                      </div>
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
                        {audio.pdfUrl ? (
                          <span className="text-blue-600 flex items-center gap-2 italic">
                            <i className="ri-file-check-line text-lg"></i> Check File
                          </span>
                        ) : (
                          "Upload PDF Transcript"
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
