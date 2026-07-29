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

interface FamiliarizationProgrammePage {
  id?: number;
  slug: string;
  title: string;
  hasYearFilter: boolean;
  filterItems?: string[];
  sections: Section[];
  showPublishDate: boolean;
  showCmsPublishDate: boolean;
  isActive: boolean;
}

export default function InvestorFamiliarizationProgrammeCMS() {
  const [pageContent, setPageContent] = useState<FamiliarizationProgrammePage>({
    slug: 'familiarization-programme-for-independent-directors',
    title: 'Familiarization Programme for Independent Directors',
    hasYearFilter: false,
    filterItems: [],
    sections: [],
    showPublishDate: false,
    showCmsPublishDate: false,
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number>(-1);
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

  const handlePdfUrlChange = async (url: string) => {
    setPdfUrlInput(url);

    if (editingDocument && editingDocument.document) {
      setEditingDocument({
        ...editingDocument,
        document: { ...editingDocument.document, pdfUrl: url.trim() }
      });
    }

    if (isExternalPdfUrl(url) && editingDocument?.document) {
      setDownloadingPdf(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE_URL}/api/download-pdf-from-url/familiarization-programme`, {
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

      const response = await fetch(`${API_BASE_URL}/api/upload/pdf/familiarization-programme`, {
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
      const data = await investorsCmsApi.getPageContentBySlug('familiarization-programme-for-independent-directors');
      if (data) {
        // Handle both camelCase and snake_case from API response
        const filterItems = (data.filterItems || (data as any).filter_items || []);
        const showPublishDate = data.showPublishDate !== undefined ? data.showPublishDate : (data as any).show_publish_date;
        const showCmsPublishDate = data.showCmsPublishDate !== undefined ? data.showCmsPublishDate : (data as any).show_cms_publish_date;
        const hasYearFilter = data.hasYearFilter !== undefined ? data.hasYearFilter : (data as any).has_year_filter;
        const isActive = data.isActive !== undefined ? data.isActive : (data as any).is_active;

        let sections = data.sections || [];
        // Support legacy flat documents if they exist
        if (sections.length === 0 && data.documents && Array.isArray(data.documents)) {
          sections = [{ title: 'Familiarization Programme', documents: data.documents }];
        }

        const pageData = {
          ...data,
          filterItems: Array.isArray(filterItems) ? filterItems : [],
          showPublishDate: showPublishDate !== undefined ? !!showPublishDate : false,
          showCmsPublishDate: showCmsPublishDate !== undefined ? !!showCmsPublishDate : false,
          hasYearFilter: hasYearFilter !== undefined ? !!hasYearFilter : false,
          isActive: isActive !== undefined ? !!isActive : true,
          sections: sections,
        };
        setPageContent(pageData);
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load familiarization programme page');
      }
      setPageContent({
        slug: 'familiarization-programme-for-independent-directors',
        title: 'Familiarization Programme for Independent Directors',
        hasYearFilter: false,
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

      const saveData = {
        ...pageContent,
        show_publish_date: pageContent.showPublishDate,
        show_cms_publish_date: pageContent.showCmsPublishDate,
        has_year_filter: pageContent.hasYearFilter,
        is_active: pageContent.isActive,
        sections: pageContent.sections,
      };

      // Check if page exists
      let existingPage;
      try {
        existingPage = await investorsCmsApi.getPageContentBySlug('familiarization-programme-for-independent-directors');
      } catch (e) {
        // Page doesn't exist yet
      }

      if (existingPage && existingPage.id) {
        await investorsCmsApi.updatePageContent(existingPage.id, saveData);
        setSuccess('Familiarization Programme page updated successfully');
      } else {
        await investorsCmsApi.createPageContent(saveData);
        setSuccess('Familiarization Programme page created successfully');
      }

      await loadPageContent();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save familiarization programme page');
    }
  };

  const handleAddSection = () => {
    setEditingSection({
      title: '',
      documents: [],
    });
    setEditingSectionIndex(-1);
    setError('');
  };

  const handleEditSection = (section: Section, index: number) => {
    setEditingSection({ ...section });
    setEditingSectionIndex(index);
    setError('');
  };

  const handleDeleteSection = (index: number) => {
    if (!confirm('Are you sure you want to delete this section? All documents in this section will also be deleted.')) {
      return;
    }
    const updatedSections = [...pageContent.sections];
    updatedSections.splice(index, 1);
    setPageContent({ ...pageContent, sections: updatedSections });
  };

  const handleSaveSection = () => {
    if (!editingSection) return;

    if (!editingSection.title.trim()) {
      setError('Section title is required');
      return;
    }

    const updatedSections = [...pageContent.sections];

    if (editingSectionIndex >= 0) {
      updatedSections[editingSectionIndex] = editingSection;
    } else {
      if (updatedSections.some(s => s.title === editingSection.title)) {
        setError('A section with this title already exists');
        return;
      }
      updatedSections.push(editingSection);
    }

    setPageContent({ ...pageContent, sections: updatedSections });
    setEditingSection(null);
    setEditingSectionIndex(-1);
    setError('');
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
    setIsManualPdfUrl(false);
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
    setIsManualPdfUrl(false);
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
      setError('PDF URL is required');
      return;
    }
    if (pageContent.hasYearFilter && !doc.year.trim()) {
      setError('Year is required when year filter is enabled');
      return;
    }

    const updatedSections = [...pageContent.sections];
    if (editingDocument.documentIndex >= 0) {
      updatedSections[editingDocument.sectionIndex].documents[editingDocument.documentIndex] = doc;
    } else {
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

    if (filterItems.includes(editingFilterItem.trim()) && editingFilterIndex < 0) {
      setError('This filter item already exists');
      return;
    }

    if (editingFilterIndex >= 0) {
      filterItems[editingFilterIndex] = editingFilterItem.trim();
    } else {
      filterItems.push(editingFilterItem.trim());
    }

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
          <p className="mt-2 text-gray-600">Loading familiarization programme page...</p>
        </div>
      </div>
    );
  }

  function renderDocumentFields() {
    if (!editingDocument || !editingDocument.document) return null;
    const doc = editingDocument.document;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="md:col-span-2 group">
          <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest group-focus-within:text-blue-600 transition-colors">
            Document Title *
          </label>
          <input
            type="text"
            className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold text-gray-800 focus:bg-white focus:border-blue-500 transition-all outline-none"
            value={doc.title}
            onChange={(e) => {
              if (editingDocument && editingDocument.document) {
                setEditingDocument({
                  ...editingDocument,
                  document: { ...doc, title: e.target.value }
                });
              }
            }}
            placeholder="e.g., Familiarization Programme for Independent Directors"
          />
        </div>

        {pageContent.showCmsPublishDate && (
          <div className="group">
            <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest group-focus-within:text-blue-600 transition-colors">
              Published Date
            </label>
            <input
              type="text"
              className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold text-gray-800 focus:bg-white focus:border-blue-500 transition-all outline-none"
              value={doc.date}
              onChange={(e) => {
                if (editingDocument && editingDocument.document) {
                  setEditingDocument({
                    ...editingDocument,
                    document: { ...doc, date: e.target.value }
                  });
                }
              }}
              placeholder="e.g., 31/12/2024"
            />
          </div>
        )}

        {pageContent.hasYearFilter && (
          <div className="group">
            <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest group-focus-within:text-blue-600 transition-colors">
              Year *
            </label>
            <select
              className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold text-gray-800 focus:bg-white focus:border-blue-500 transition-all outline-none appearance-none"
              value={doc.year}
              onChange={(e) => {
                if (editingDocument && editingDocument.document) {
                  setEditingDocument({
                    ...editingDocument,
                    document: { ...doc, year: e.target.value }
                  });
                }
              }}
            >
              <option value="">Select Year</option>
              {pageContent.filterItems?.map((year) => (
                <option key={year} value={year}>
                  FY {year}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-sm">
                <i className={isManualPdfUrl ? "ri-link" : "ri-upload-cloud-2-line"}></i>
              </div>
              <span className="text-sm font-black text-gray-700 uppercase tracking-tight">PDF Document *</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Manual URL</span>
              <button
                type="button"
                onClick={() => setIsManualPdfUrl(!isManualPdfUrl)}
                className={`relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-4 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isManualPdfUrl ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xl ring-0 transition duration-200 ease-in-out ${isManualPdfUrl ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {isManualPdfUrl ? (
            <div className="relative group animate-in slide-in-from-top-2 duration-300">
              <input
                type="text"
                className={`w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl py-4 px-12 font-bold text-gray-800 focus:bg-white focus:border-blue-500 transition-all outline-none ${downloadingPdf ? 'opacity-50' : ''}`}
                value={pdfUrlInput}
                onChange={(e) => handlePdfUrlChange(e.target.value)}
                placeholder="https://example.com/report.pdf"
                disabled={downloadingPdf}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <i className="ri-global-line text-xl"></i>
              </div>
              {downloadingPdf && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin">
                  <i className="ri-loader-4-line text-blue-600 text-xl"></i>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                id="pdf-upload-standard"
                className="hidden"
                disabled={uploadingPdf}
              />
              <label
                htmlFor="pdf-upload-standard"
                className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-[2rem] transition-all cursor-pointer group ${uploadingPdf ? 'bg-gray-50 border-gray-200 opacity-70' : 'bg-blue-50/20 border-blue-100 hover:border-blue-500 hover:bg-blue-50/50'}`}
              >
                {uploadingPdf ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
                    <span className="text-sm font-black text-blue-600 tracking-widest animate-pulse">UPLOADING...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white text-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <i className="ri-upload-cloud-2-line text-3xl"></i>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-gray-700 tracking-tight">CLICK TO SELECT PDF ASSET</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">MAXIMUM FILE SIZE: 50MB</p>
                    </div>
                  </>
                )}
              </label>
            </div>
          )}

          {doc.pdfUrl && (
            <div className="flex items-center gap-4 p-5 bg-[#1F2937] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 group/badge relative">
              <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover/badge:opacity-100 transition-opacity"></div>
              <div className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/20 z-10">
                <i className="ri-file-pdf-fill text-2xl"></i>
              </div>
              <div className="flex-1 min-w-0 z-10">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Attached Asset Path</p>
                <p className="text-sm font-bold text-blue-400 truncate tracking-tight">{doc.pdfUrl}</p>
              </div>
              <a
                href={doc.pdfUrl.startsWith('http') ? doc.pdfUrl : `${API_BASE_URL}${doc.pdfUrl}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl flex items-center justify-center transition-all z-10 border border-gray-700/50 shadow-xl"
              >
                <i className="ri-external-link-line text-lg"></i>
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6" style={{ fontFamily: '"Open Sans", sans-serif' }}>
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Familiarization Programme Page CMS</h2>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Manage sections and documents for the Familiarization Programme page
            </p>
          </div>
          <button
            onClick={handleSave}
            className="group relative px-8 py-3 bg-[#2563EB] text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 flex items-center gap-2"
          >
            <i className="ri-check-line text-lg"></i>
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

      {/* General Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <i className="ri-settings-3-line text-xl"></i>
            </div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">General Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="md:col-span-2 group">
              <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest group-focus-within:text-blue-600 transition-colors">Page Title *</label>
              <input
                type="text"
                className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold text-gray-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                value={pageContent.title}
                onChange={(e) => setPageContent({ ...pageContent, title: e.target.value })}
                placeholder="Familiarization Programme for Independent Directors"
              />
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border-2 border-transparent hover:border-blue-100 transition-all cursor-pointer group">
              <input
                type="checkbox"
                id="hasYearFilter"
                checked={pageContent.hasYearFilter}
                onChange={(e) => setPageContent({ ...pageContent, hasYearFilter: e.target.checked })}
                className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg cursor-pointer"
              />
              <label htmlFor="hasYearFilter" className="text-sm font-black text-gray-700 cursor-pointer select-none group-hover:text-blue-600 flex-1">Enable Year Filter</label>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border-2 border-transparent hover:border-blue-100 transition-all cursor-pointer group">
              <input
                type="checkbox"
                id="showCmsPublishDate"
                checked={pageContent.showCmsPublishDate}
                onChange={(e) => setPageContent({ ...pageContent, showCmsPublishDate: e.target.checked })}
                className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg cursor-pointer"
              />
              <label htmlFor="showCmsPublishDate" className="text-sm font-black text-gray-700 cursor-pointer select-none group-hover:text-blue-600 flex-1">CMS Published Date</label>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border-2 border-transparent hover:border-blue-100 transition-all cursor-pointer group">
              <input
                type="checkbox"
                id="showPublishDate"
                checked={pageContent.showPublishDate}
                onChange={(e) => setPageContent({ ...pageContent, showPublishDate: e.target.checked })}
                className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg cursor-pointer"
              />
              <label htmlFor="showPublishDate" className="text-sm font-black text-gray-700 cursor-pointer select-none group-hover:text-blue-600 flex-1">Public Website Dates</label>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border-2 border-transparent hover:border-blue-100 transition-all cursor-pointer group">
              <input
                type="checkbox"
                id="isActive"
                checked={pageContent.isActive}
                onChange={(e) => setPageContent({ ...pageContent, isActive: e.target.checked })}
                className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg cursor-pointer"
              />
              <label htmlFor="isActive" className="text-sm font-black text-gray-700 cursor-pointer select-none group-hover:text-blue-600 flex-1">Page Active</label>
            </div>
          </div>
        </div>

        {/* Filter Management */}
        <div className={`lg:col-span-4 transition-all duration-500 ${pageContent.hasYearFilter ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none grayscale'}`}>
          <div className="h-full bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col relative group/years">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <i className="ri-calendar-event-line text-xl"></i>
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Years</h3>
            </div>

            <button
              onClick={handleAddFilterItem}
              className="absolute top-8 right-8 w-10 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center group/add active:scale-95 z-20"
              title="Add Filter Year"
            >
              <i className="ri-add-line text-2xl font-bold transition-transform group-hover/add:rotate-90"></i>
            </button>

            {showFilterItemForm && (
              <div className="mb-6 p-5 bg-blue-50/50 rounded-2xl border-2 border-blue-100 shadow-sm animate-in zoom-in-95 duration-300">
                <input
                  type="text"
                  className="w-full bg-white border-2 border-gray-100 rounded-xl py-3 px-4 font-bold text-gray-800 focus:border-blue-500 transition-all outline-none mb-4"
                  value={editingFilterItem}
                  onChange={(e) => setEditingFilterItem(e.target.value)}
                  placeholder="e.g., 2025-26"
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveFilterItem} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-blue-700 shadow-md shadow-blue-100">SAVE</button>
                  <button onClick={() => { setShowFilterItemForm(false); setEditingFilterItem(''); setEditingFilterIndex(-1); }} className="flex-1 py-2.5 bg-white text-gray-500 rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-gray-50 border border-gray-100">CANCEL</button>
                </div>
              </div>
            )}

            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar-blue pr-1 max-h-[350px]">
              {(pageContent.filterItems || []).length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-gray-300 gap-2 border-2 border-dashed border-gray-50 rounded-[2rem]">
                  <i className="ri-calendar-line text-3xl opacity-20"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest italic">No Years Found</span>
                </div>
              ) : (
                (pageContent.filterItems || []).map((item, index) => (
                  <div key={index} className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 hover:border-blue-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                    <span className="font-black text-gray-700 tracking-tight text-sm">FY {item}</span>
                    <div className="flex gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      <button onClick={() => handleEditFilterItem(index)} className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-50"><i className="ri-pencil-line"></i></button>
                      <button onClick={() => handleDeleteFilterItem(index)} className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-50"><i className="ri-delete-bin-line"></i></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sections & Documents */}
      <div className="space-y-8">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <i className="ri-list-settings-line text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Content Sections</h3>
              <p className="text-xs text-gray-500">Manage grouping of documents</p>
            </div>
          </div>
          <button
            onClick={handleAddSection}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-bold shadow-md flex items-center gap-2 active:scale-95"
          >
            <i className="ri-add-line"></i> Add New Section
          </button>
        </div>

        {/* Sections List */}
        {pageContent.sections.length === 0 ? (
          <div className="text-center py-16 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <i className="ri-folder-add-line text-4xl text-gray-300"></i>
            </div>
            <h4 className="text-gray-900 font-bold">No sections created yet</h4>
            <p className="text-gray-500 text-sm mt-1">Start by adding your first category of documents</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pageContent.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group/section flex flex-col">
                <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center group-hover/section:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 font-black">
                      {sectionIndex + 1}
                    </div>
                    {editingSectionIndex === sectionIndex ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          className="bg-white border-2 border-blue-500 rounded-xl px-4 py-2 font-black text-gray-900 outline-none shadow-lg shadow-blue-500/10"
                          value={editingSection?.title || ''}
                          onChange={(e) => setEditingSection(editingSection ? { ...editingSection, title: e.target.value } : null)}
                          autoFocus
                        />
                        <button onClick={handleSaveSection} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><i className="ri-check-line"></i></button>
                        <button onClick={() => { setEditingSection(null); setEditingSectionIndex(-1); }} className="p-2 bg-white text-gray-400 rounded-lg hover:bg-gray-100 border border-gray-200"><i className="ri-close-line"></i></button>
                      </div>
                    ) : (
                      <h4 className="text-xl font-black text-gray-900 tracking-tight">{section.title}</h4>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddDocument(sectionIndex)}
                      className="px-4 py-2 bg-white text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-50 transition-all font-black text-[10px] tracking-widest uppercase shadow-sm flex items-center gap-2"
                    >
                      <i className="ri-add-line text-sm"></i> ADD DOCUMENT
                    </button>
                    <button onClick={() => handleEditSection(section, sectionIndex)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><i className="ri-pencil-line text-lg"></i></button>
                    <button onClick={() => handleDeleteSection(sectionIndex)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><i className="ri-delete-bin-line text-lg"></i></button>
                  </div>
                </div>

                <div className="p-8">
                  {section.documents.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-300 gap-3 bg-gray-50/30 rounded-3xl border-2 border-dashed border-gray-100">
                      <i className="ri-file-add-line text-3xl opacity-20"></i>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Empty Section</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                      {section.documents.map((doc, docIndex) => (
                        <div key={docIndex} className="group/card relative bg-white rounded-3xl p-5 border border-gray-100 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 animate-pulse-slow">
                                  <i className="ri-file-pdf-fill text-lg"></i>
                                </div>
                                {doc.year && (
                                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black tracking-tighter uppercase">FY {doc.year}</span>
                                )}
                              </div>
                              <h5 className="font-bold text-gray-900 leading-tight mb-3 line-clamp-2 min-h-[2.5rem] group-hover/card:text-blue-600 transition-colors">{doc.title}</h5>
                              <div className="flex items-center gap-3">
                                {pageContent.showPublishDate && doc.date && (
                                  <div className="flex items-center gap-1.5 text-gray-400">
                                    <i className="ri-calendar-line text-[10px]"></i>
                                    <span className="text-[10px] font-bold uppercase tracking-tight">{doc.date}</span>
                                  </div>
                                )}
                                <a
                                  href={doc.pdfUrl.startsWith('http') ? doc.pdfUrl : `${API_BASE_URL}${doc.pdfUrl}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline whitespace-nowrap"
                                >
                                  VIEW PDF <i className="ri-external-link-line"></i>
                                </a>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 -mr-2">
                              <button onClick={() => handleEditDocument(sectionIndex, docIndex)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><i className="ri-pencil-line"></i></button>
                              <button onClick={() => handleDeleteDocument(sectionIndex, docIndex)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><i className="ri-delete-bin-line"></i></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showDocumentForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => { setShowDocumentForm(false); setEditingDocument(null); }}></div>
            <div className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 zoom-in-95 duration-500">
              <div className="p-8 sm:p-12">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/20">
                      <i className="ri-file-add-line text-3xl"></i>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-gray-900 tracking-tight">
                        {editingDocument?.documentIndex !== undefined && editingDocument.documentIndex >= 0 ? 'Edit Document' : 'Add New Document'}
                      </h4>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Section: {pageContent.sections[editingDocument?.sectionIndex || 0]?.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setShowDocumentForm(false); setEditingDocument(null); }}
                    className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center group"
                  >
                    <i className="ri-close-line text-2xl group-hover:rotate-90 transition-transform"></i>
                  </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar-blue pr-4 -mr-4">
                  {renderDocumentFields()}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex gap-4">
                  <button
                    onClick={handleSaveDocument}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-[2rem] font-black tracking-widest uppercase hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <i className="ri-check-line text-xl"></i>
                    SAVE DOCUMENT ASSET
                  </button>
                  <button
                    onClick={() => { setShowDocumentForm(false); setEditingDocument(null); }}
                    className="px-10 py-4 bg-white text-gray-500 rounded-[2rem] font-black tracking-widest uppercase hover:bg-gray-50 border-2 border-gray-100 transition-all"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-10 right-10 z-50">
        <button
          onClick={handleSave}
          className="group flex items-center gap-3 bg-gray-900 text-white p-2 pr-6 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <i className="ri-save-3-line text-xl"></i>
          </div>
          <span className="font-black text-xs tracking-widest uppercase">Quick Save</span>
        </button>
      </div>

      <style>{`
        .custom-scrollbar-blue::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar-blue::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 10px;
        }
        .custom-scrollbar-blue::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar-blue::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
