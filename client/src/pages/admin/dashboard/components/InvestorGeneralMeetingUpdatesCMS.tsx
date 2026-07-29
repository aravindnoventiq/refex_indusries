import { useState, useEffect } from 'react';
import { investorsCmsApi } from '../../../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

interface Document {
  title: string;
  date: string;
  year: string;
  pdfUrl: string;
}

interface Section {
  title: string;
  documents: Document[];
}

interface GeneralMeetingUpdatesPage {
  id?: number;
  slug: string;
  title: string;
  showPublishDate: boolean;
  showCmsPublishDate: boolean;
  hasYearFilter: boolean;
  filterItems?: string[]; // Array of filter items (years) for the filter dropdown
  sections: Section[];
  isActive: boolean;
}

export default function InvestorGeneralMeetingUpdatesCMS() {
  const [pageContent, setPageContent] = useState<GeneralMeetingUpdatesPage>({
    slug: 'general-meeting-updates',
    title: 'General Meeting Updates',
    showPublishDate: false,
    showCmsPublishDate: false,
    hasYearFilter: true,
    filterItems: [],
    sections: [],
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingDocument, setEditingDocument] = useState<{ sectionIndex: number; document: Document | null; documentIndex: number } | null>(null);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [showFilterItemForm, setShowFilterItemForm] = useState(false);
  const [editingFilterItem, setEditingFilterItem] = useState<string>('');
  const [editingFilterIndex, setEditingFilterIndex] = useState<number>(-1);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfUrlInput, setPdfUrlInput] = useState('');
  const [isManualPdfUrl, setIsManualPdfUrl] = useState(false);

  useEffect(() => {
    if (editingDocument?.document?.pdfUrl) {
      const isManual = !editingDocument.document.pdfUrl.startsWith('/uploads/');
      setIsManualPdfUrl(isManual);
      if (isManual) setPdfUrlInput(editingDocument.document.pdfUrl);
    } else {
      setIsManualPdfUrl(false);
      setPdfUrlInput('');
    }
  }, [editingDocument?.documentIndex, editingDocument?.sectionIndex]);

  const isExternalPdfUrl = (url: string): boolean => {
    if (!url) return false;
    const trimmed = url.trim();
    return (trimmed.startsWith('http://') || trimmed.startsWith('https://')) &&
      !trimmed.startsWith(`${API_BASE_URL}`);
  };

  // Automatically download PDF from external URL and save to server
  const handlePdfUrlChange = async (url: string) => {
    setPdfUrlInput(url);

    // Also update the document state IMMEDIATELY for manual entry or local paths
    if (editingDocument && editingDocument.document) {
      setEditingDocument({
        ...editingDocument,
        document: { ...editingDocument.document, pdfUrl: url.trim() }
      });
    }

    // If it's an external URL, automatically download and save
    if (isExternalPdfUrl(url) && editingDocument?.document) {
      setDownloadingPdf(true);
      setError('');

      try {
        // Download to general-meeting-updates subfolder
        const response = await fetch(`${API_BASE_URL}/api/download-pdf-from-url/general-meeting-updates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: url.trim() }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to download PDF');
        }

        const data = await response.json();
        if (editingDocument && editingDocument.document) {
          setEditingDocument({
            ...editingDocument,
            document: { ...editingDocument.document, pdfUrl: data.pdfUrl }
          });
        }
        setPdfUrlInput('');
        setSuccess('PDF downloaded and saved automatically');
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
    if (!file || !editingDocument?.document) return;

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

      const response = await fetch(`${API_BASE_URL}/api/upload/pdf/general-meeting-updates`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload PDF');
      }

      const data = await response.json();
      setEditingDocument({
        ...editingDocument,
        document: { ...editingDocument.document, pdfUrl: data.pdfUrl }
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
      const data = await investorsCmsApi.getPageContentBySlug('general-meeting-updates');
      if (data) {
        // Handle both camelCase and snake_case from API response
        const filterItems = (data.filterItems || (data as any).filter_items || []);
        const showPublishDate = data.showPublishDate !== undefined ? data.showPublishDate : (data as any).show_publish_date;
        const showCmsPublishDate = data.showCmsPublishDate !== undefined ? data.showCmsPublishDate : (data as any).show_cms_publish_date;
        const pageData = {
          ...data,
          filterItems: Array.isArray(filterItems) ? filterItems : [],
          showPublishDate: showPublishDate !== undefined ? !!showPublishDate : false,
          showCmsPublishDate: showCmsPublishDate !== undefined ? !!showCmsPublishDate : false,
          sections: (data.sections || []).map((section: any) => ({
            ...section,
            documents: (section.documents || []).map((doc: any) => ({
              ...doc,
              pdfUrl: doc.pdfUrl || doc.link || '',
              date: doc.date || doc.publishedDate || doc.published_date || '',
            }))
          }))
        };
        setPageContent(pageData);
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load general meeting updates page');
      }
      // Use default structure if not found
      setPageContent({
        slug: 'general-meeting-updates',
        title: 'General Meeting Updates',
        hasYearFilter: true,
        filterItems: [],
        sections: [],
        showPublishDate: false,
        showCmsPublishDate: false,
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
      const saveData = {
        ...pageContent,
        filterItems: pageContent.filterItems || [],
        show_publish_date: pageContent.showPublishDate,
        show_cms_publish_date: pageContent.showCmsPublishDate,
        has_year_filter: pageContent.hasYearFilter,
        is_active: pageContent.isActive,
      };

      // Check if page exists
      let existingPage;
      try {
        existingPage = await investorsCmsApi.getPageContentBySlug('general-meeting-updates');
      } catch (e) {
        // Page doesn't exist yet
      }

      if (existingPage && existingPage.id) {
        await investorsCmsApi.updatePageContent(existingPage.id, saveData);
        setSuccess('General Meeting Updates page updated successfully');
      } else {
        await investorsCmsApi.createPageContent(saveData);
        setSuccess('General Meeting Updates page created successfully');
      }

      // Reload the data to ensure we have the latest from the server
      await loadPageContent();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save general meeting updates page');
    }
  };

  const handleAddSection = () => {
    const newSections = [...pageContent.sections];
    newSections.push({ title: '', documents: [] });
    setPageContent({ ...pageContent, sections: newSections });
  };

  const handleDeleteSection = (index: number) => {
    if (!confirm('Are you sure you want to delete this section? All documents in this section will also be deleted.')) {
      return;
    }
    const updatedSections = [...pageContent.sections];
    updatedSections.splice(index, 1);
    setPageContent({ ...pageContent, sections: updatedSections });
  };

  const handleAddDocument = (sectionIndex: number) => {
    setEditingDocument({
      sectionIndex,
      document: {
        title: '',
        date: '',
        year: '',
        pdfUrl: '',
      },
      documentIndex: -1,
    });
    setShowDocumentForm(true);
    setError('');
  };

  const handleEditDocument = (sectionIndex: number, documentIndex: number) => {
    const document = pageContent.sections[sectionIndex].documents[documentIndex];
    setEditingDocument({
      sectionIndex,
      document: { ...document },
      documentIndex,
    });
    setShowDocumentForm(true);
    setError('');
  };

  const handleDeleteDocument = (sectionIndex: number, documentIndex: number) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }
    const updatedSections = [...pageContent.sections];
    updatedSections[sectionIndex].documents.splice(documentIndex, 1);
    setPageContent({ ...pageContent, sections: updatedSections });
  };

  const handleSaveDocument = () => {
    if (!editingDocument || !editingDocument.document) {
      return;
    }

    const doc = editingDocument.document;
    if (!doc.title.trim()) {
      setError('Document title is required');
      return;
    }
    if (!doc.pdfUrl.trim()) {
      setError('Document link (URL) is required');
      return;
    }
    if (pageContent.hasYearFilter && !doc.year.trim()) {
      setError('Year is required when year filter is enabled');
      return;
    }

    const updatedSections = [...pageContent.sections];
    if (editingDocument.documentIndex >= 0) {
      // Update existing document
      updatedSections[editingDocument.sectionIndex].documents[editingDocument.documentIndex] = doc;
    } else {
      // Add new document
      updatedSections[editingDocument.sectionIndex].documents.push(doc);
    }

    setPageContent({ ...pageContent, sections: updatedSections });
    setShowDocumentForm(false);
    setEditingDocument(null);
    setError('');
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
          <p className="mt-2 text-gray-600">Loading general meeting updates page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6" style={{ fontFamily: '"Open Sans", sans-serif' }}>
      {/* Premium Header */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">General Meeting Updates CMS</h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Manage sections and documents for general meeting updates
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
                placeholder="General Meeting Updates"
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
                id="showCmsPublishDate"
                checked={pageContent.showCmsPublishDate}
                onChange={(e) => setPageContent({ ...pageContent, showCmsPublishDate: e.target.checked })}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg cursor-pointer"
              />
              <label htmlFor="showCmsPublishDate" className="text-sm font-bold text-gray-700 cursor-pointer select-none group-hover:text-blue-600 transition-colors">CMS Published Date</label>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm group hover:border-blue-200 transition-all">
              <input
                type="checkbox"
                id="showPublishDate"
                checked={pageContent.showPublishDate}
                onChange={(e) => setPageContent({ ...pageContent, showPublishDate: e.target.checked })}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg cursor-pointer"
              />
              <label htmlFor="showPublishDate" className="text-sm font-bold text-gray-700 cursor-pointer select-none group-hover:text-blue-600 transition-colors">Public Website Dates</label>
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

      {/* Sections and Documents */}
      <div className="space-y-12 mb-12">
        {pageContent.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden group/section">
            <button
              onClick={() => handleDeleteSection(sectionIndex)}
              className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all z-20 group-hover/section:translate-x-0 translate-x-12 opacity-0 group-hover/section:opacity-100"
              title="Remove Section"
            >
              <i className="ri-delete-bin-line text-lg"></i>
            </button>

            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
              <div className="flex-1 group">
                <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest group-focus-within:text-blue-600 transition-colors">Section Title</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-b-2 border-gray-100 py-2 text-2xl font-black text-gray-900 focus:border-blue-500 transition-all outline-none uppercase tracking-tighter italic"
                    value={section.title}
                    onChange={(e) => {
                      const newSections = [...pageContent.sections];
                      newSections[sectionIndex].title = e.target.value;
                      setPageContent({ ...pageContent, sections: newSections });
                    }}
                    placeholder="ENTER SECTION NAME"
                  />
                  <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-300 flex items-center justify-center border border-gray-100 group-focus-within:bg-blue-50 group-focus-within:text-blue-500 group-focus-within:border-blue-100 transition-all">
                    <i className="ri-pencil-fill"></i>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAddDocument(sectionIndex)}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-black text-[10px] tracking-widest uppercase flex items-center gap-2 active:scale-95"
                >
                  <i className="ri-add-line text-lg"></i> ADD DOCUMENT
                </button>
              </div>
            </div>

            {/* Documents List */}
            <div className="grid grid-cols-1 gap-4">
              {section.documents.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-100 grayscale opacity-60">
                  <i className="ri-folder-open-line text-4xl text-gray-300 mb-2"></i>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No documents in this section</p>
                </div>
              ) : (
                section.documents.map((doc, docIndex) => {
                  const isEditing = editingDocument?.sectionIndex === sectionIndex && editingDocument?.documentIndex === docIndex;
                  return (
                    <div key={docIndex} className={`group/doc rounded-2xl border transition-all duration-300 ${isEditing ? 'border-blue-400 ring-4 ring-blue-50 bg-blue-50/30 overflow-hidden' : 'border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/30'}`}>
                      {!isEditing ? (
                        <div className="flex items-center justify-between p-5">
                          <div className="flex items-center gap-5 flex-1 min-w-0">
                            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-red-100 group-hover/doc:scale-105 transition-transform duration-300">
                              <i className="ri-file-pdf-2-fill text-3xl"></i>
                            </div>
                            <div className="min-w-0">
                              <h5 className="text-base font-black text-gray-900 tracking-tight group-hover/doc:text-blue-600 transition-colors uppercase">{doc.title}</h5>
                              <div className="flex items-center gap-4 mt-2">
                                {doc.year && (
                                  <span className="flex items-center gap-1.5 text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-widest">
                                    <i className="ri-hashtag text-blue-400"></i> FY {doc.year}
                                  </span>
                                )}
                                {pageContent.showPublishDate && doc.date && (
                                  <span className="flex items-center gap-1.5 text-[10px] font-black bg-gray-50 text-gray-500 px-3 py-1 rounded-lg border border-gray-100 uppercase tracking-widest">
                                    <i className="ri-calendar-line text-blue-400"></i> {doc.date}
                                  </span>
                                )}
                                <span className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold truncate max-w-[250px]">
                                  <i className="ri-link text-blue-200"></i> {doc.pdfUrl}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEditDocument(sectionIndex, docIndex)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                              title="Edit"
                            >
                              <i className="ri-edit-line text-xl"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(sectionIndex, docIndex)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                              title="Delete"
                            >
                              <i className="ri-delete-bin-line text-xl"></i>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Inline Edit State */
                        <div className="p-6 bg-white animate-in slide-in-from-left-2 duration-200">
                          <div className="flex items-center gap-2 mb-6 text-blue-600 border-b border-blue-50 pb-4">
                            <i className="ri-edit-box-line text-xl font-bold"></i>
                            <h5 className="text-md font-bold uppercase tracking-wider text-blue-800">Editing Document</h5>
                          </div>
                          {renderDocumentFields()}
                          <div className="mt-8 flex gap-3 pt-6 border-t border-gray-100">
                            <button
                              onClick={handleSaveDocument}
                              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold shadow-md hover:shadow-lg scale-95 hover:scale-100 flex items-center gap-2"
                            >
                              <i className="ri-check-line text-lg"></i> Done Editing
                            </button>
                            <button
                              onClick={() => setEditingDocument(null)}
                              className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all font-bold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Section Button */}
      <div className="flex justify-center pb-20">
        <button
          onClick={handleAddSection}
          className="group relative px-12 py-6 bg-white border-2 border-gray-100 rounded-[2rem] hover:border-blue-500 transition-all duration-500 shadow-xl hover:shadow-blue-200/50 flex flex-col items-center gap-2 active:scale-95"
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
            <i className="ri-add-line text-3xl font-bold"></i>
          </div>
          <span className="text-[10px] font-black text-gray-400 group-hover:text-blue-600 uppercase tracking-[0.3em] transition-colors">Add New Section</span>
        </button>
      </div>

      {/* Popup Form for ADDING new document (Add State Only) */}
      {showDocumentForm && editingDocument && editingDocument.documentIndex === -1 && (
        <div className="fixed inset-0 bg-[#0f172a]/60 flex items-center justify-center z-[100] p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-10 py-8 flex justify-between items-center text-white relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <i className="ri-file-add-line text-8xl"></i>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black tracking-tight uppercase">Add New Document</h3>
                <p className="text-blue-100 text-sm font-medium mt-1">Fill in the details to add a new file to this section</p>
              </div>
              <button
                onClick={() => { setShowDocumentForm(false); setEditingDocument(null); }}
                className="relative z-10 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-white active:scale-95"
                title="Close"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {renderDocumentFields()}
            </div>

            <div className="p-8 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-4 px-10">
              <button
                onClick={() => { setShowDocumentForm(false); setEditingDocument(null); }}
                className="px-8 py-3.5 bg-white text-gray-500 rounded-xl hover:bg-gray-100 transition-all font-bold border border-gray-200 active:scale-95"
              >
                CANCEL
              </button>
              <button
                onClick={handleSaveDocument}
                className="px-10 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 font-black tracking-wide flex items-center gap-2 active:scale-95"
              >
                <i className="ri-add-line text-lg"></i>
                ADD DOCUMENT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Year Form (Standardized) */}
      {showFilterItemForm && (
        <div className="fixed inset-0 bg-[#0f172a]/40 flex items-center justify-center z-[110] p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-200 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-blue-100/50">
                <i className="ri-calendar-line text-2xl"></i>
              </div>
              <div>
                <h4 className="text-xl font-black text-gray-900 tracking-tight">{editingFilterIndex >= 0 ? 'EDIT YEAR' : 'ADD YEAR'}</h4>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">Filter Configuration</p>
              </div>
            </div>

            <div className="space-y-1 mb-8">
              <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] ml-1">Financial Year Format</label>
              <input
                type="text"
                autoFocus
                className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-blue-500 focus:ring-0 text-lg font-bold text-gray-800 transition-all placeholder:text-gray-300"
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

  function renderDocumentFields() {
    if (!editingDocument?.document) return null;
    const doc = editingDocument.document;

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2 group">
            <label className="block text-[10px] font-black text-blue-600 uppercase tracking-[0.2rem] mb-2 ml-1 group-focus-within:text-blue-700 transition-colors">
              Document Title *
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl shadow-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 py-4 px-5 font-bold text-gray-800 transition-all placeholder:text-gray-300"
                value={doc.title}
                onChange={(e) => setEditingDocument({ ...editingDocument, document: { ...doc, title: e.target.value } })}
                placeholder="e.g., AGM Notice & Annual Report 2024-25"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
                <i className="ri-text-spacing text-xl"></i>
              </div>
            </div>
          </div>

          {pageContent.showCmsPublishDate && (
            <div className="group">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2rem] mb-2 ml-1 group-focus-within:text-blue-600 transition-colors">
                Published Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl shadow-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 py-3.5 px-5 font-bold text-gray-800 transition-all placeholder:text-gray-300"
                  value={doc.date}
                  onChange={(e) => setEditingDocument({ ...editingDocument, document: { ...doc, date: e.target.value } })}
                  placeholder="DD/MM/YYYY"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-400 transition-colors">
                  <i className="ri-calendar-line text-lg"></i>
                </div>
              </div>
            </div>
          )}

          {pageContent.hasYearFilter && (
            <div className="group">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2rem] mb-2 ml-1 group-focus-within:text-blue-600 transition-colors">
                Financial Year *
              </label>
              <div className="relative">
                <select
                  className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl shadow-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 py-3.5 px-5 font-bold text-gray-800 transition-all appearance-none cursor-pointer"
                  value={doc.year}
                  onChange={(e) => setEditingDocument({ ...editingDocument, document: { ...doc, year: e.target.value } })}
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
          )}
        </div>

        <div className="bg-gray-50/80 rounded-[2rem] p-8 border-2 border-dashed border-gray-200 group-focus-within:border-blue-200 transition-all">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-sm border border-gray-100">
                <i className="ri-file-pdf-2-line text-xl"></i>
              </div>
              <div>
                <label className="block text-sm font-black text-gray-800">
                  PDF DOCUMENT *
                </label>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Asset Source Configuration</p>
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
                    placeholder="https://example.com/document.pdf"
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
                {!downloadingPdf && doc.pdfUrl && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100/50 w-fit mt-2 animate-in fade-in zoom-in duration-300">
                    <i className="ri-checkbox-circle-fill text-blue-500"></i>
                    <span className="text-[10px] font-bold text-blue-700 truncate max-w-[400px]">Active URL: {doc.pdfUrl}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative h-32 group">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={uploadingPdf || downloadingPdf}
                />
                <div className={`absolute inset-0 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${uploadingPdf ? 'bg-blue-50/50 border-blue-400' : 'bg-white border-gray-200 group-hover:border-blue-400 group-hover:bg-blue-50/30'
                  }`}>
                  {uploadingPdf ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-bounce">
                        <i className="ri-upload-2-fill text-3xl text-blue-600"></i>
                      </div>
                      <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Uploading PDF...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                        <i className="ri-file-upload-line text-2xl text-gray-400 group-hover:text-blue-600"></i>
                      </div>
                      <p className="text-xs font-bold text-gray-500">
                        {doc.pdfUrl ? (
                          <span className="text-blue-600 flex items-center gap-1 italic">
                            <i className="ri-file-check-line text-lg"></i>
                            {doc.pdfUrl.split('/').pop()}
                          </span>
                        ) : (
                          "Click or drag PDF to upload"
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
            <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15rem] leading-relaxed">
              <i className="ri-information-line mr-1 text-blue-500"></i>
              Ensure PDF is less than 50MB. Auto-save will trigger upon valid selection.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
