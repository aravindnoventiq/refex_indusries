import { useState, useEffect } from 'react';
import { investorsCmsApi } from '../../../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

interface Document {
  title: string;
  date: string;
  year: string;
  pdfUrl: string;
  thumbnail?: string;
}

interface Section {
  title: string;
  documents: Document[];
}

interface AnnualReportsPage {
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

export default function InvestorAnnualReportsCMS() {
  const [pageContent, setPageContent] = useState<AnnualReportsPage>({
    slug: 'annual-reports',
    title: 'Annual Reports',
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
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState<string>('');
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
        // Download to annual-reports subfolder
        const response = await fetch(`${API_BASE_URL}/api/download-pdf-from-url/annual-reports`, {
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

      // Upload to annual-reports subfolder
      const response = await fetch(`${API_BASE_URL}/api/upload/pdf/annual-reports`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload PDF');
      }

      const data = await response.json();
      if (editingDocument && editingDocument.document) {
        setEditingDocument({
          ...editingDocument,
          document: { ...editingDocument.document, pdfUrl: data.pdfUrl }
        });
      }
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
      const data = await investorsCmsApi.getPageContentBySlug('annual-reports');
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
        };
        setPageContent(pageData);
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load annual reports page');
      }
      // Use default structure if not found
      setPageContent({
        slug: 'annual-reports',
        title: 'Annual Reports',
        showPublishDate: false,
        showCmsPublishDate: false,
        hasYearFilter: true,
        filterItems: [],
        sections: [],
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
        existingPage = await investorsCmsApi.getPageContentBySlug('annual-reports');
      } catch (e) {
        // Page doesn't exist yet
      }

      if (existingPage && existingPage.id) {
        await investorsCmsApi.updatePageContent(existingPage.id, saveData);
        setSuccess('Annual Reports page updated successfully');
      } else {
        await investorsCmsApi.createPageContent(saveData);
        setSuccess('Annual Reports page created successfully');
      }

      // Reload the data to ensure we have the latest from the server
      await loadPageContent();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save annual reports page');
    }
  };

  const handleAddSection = () => {
    const newSection: Section = {
      title: 'NEW CATEGORY',
      documents: [],
    };
    const updatedSections = [...pageContent.sections, newSection];
    setPageContent({ ...pageContent, sections: updatedSections });
    setEditingSectionIndex(updatedSections.length - 1);
    setEditingSectionTitle('NEW CATEGORY');
  };

  const handleEditSection = (index: number, title: string) => {
    setEditingSectionIndex(index);
    setEditingSectionTitle(title);
  };

  const handleSaveSection = (index: number) => {
    if (!editingSectionTitle.trim()) {
      setError('Section title is required');
      return;
    }

    const updatedSections = [...pageContent.sections];
    updatedSections[index].title = editingSectionTitle.trim();
    setPageContent({ ...pageContent, sections: updatedSections });
    setEditingSectionIndex(null);
    setEditingSectionTitle('');
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

  const handleAddDocument = (sectionIndex: number) => {
    setEditingDocument({
      sectionIndex,
      document: {
        title: '',
        date: '',
        year: '',
        pdfUrl: '',
        thumbnail: '',
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
      setError('PDF URL is required');
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

  const renderDocumentFields = () => {
    if (!editingDocument?.document) return null;
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
            placeholder="e.g., Annual Report 2024-25"
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
              placeholder="e.g., 04/11/2025"
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
              {(pageContent.filterItems || []).map((year) => (
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
                id="pdf-upload-standard-ann"
                className="hidden"
                disabled={uploadingPdf}
              />
              <label
                htmlFor="pdf-upload-standard-ann"
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
                href={doc.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl flex items-center justify-center transition-all z-10 border border-gray-700/50 shadow-xl"
              >
                <i className="ri-external-link-line text-lg"></i>
              </a>
            </div>
          )}
        </div>

        <div className="md:col-span-2 group">
          <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest group-focus-within:text-blue-600 transition-colors">
            Thumbnail URL (Optional)
          </label>
          <input
            type="text"
            className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold text-gray-800 focus:bg-white focus:border-blue-500 transition-all outline-none"
            value={doc.thumbnail || ''}
            onChange={(e) => {
              if (editingDocument && editingDocument.document) {
                setEditingDocument({
                  ...editingDocument,
                  document: { ...doc, thumbnail: e.target.value }
                });
              }
            }}
            placeholder="https://example.com/thumbnail.png"
          />
        </div>
      </div>
    );
  };

  const handleAddFilterItem = () => {
    setEditingFilterItem('');
    setEditingFilterIndex(-1);
    setShowFilterItemForm(true);
    setError('');
  };

  const handleEditFilterItem = (index: number) => {
    const items = pageContent.filterItems || [];
    setEditingFilterItem(items[index]);
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
      filterItems[editingFilterIndex] = editingFilterItem.trim();
    } else {
      filterItems.push(editingFilterItem.trim());
    }

    // Sort descending
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
          <p className="mt-2 text-gray-600">Loading annual reports page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6" style={{ fontFamily: '"Open Sans", sans-serif' }}>
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Annual Reports Page CMS</h2>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Manage categories and reports for the Annual Reports page
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
                placeholder="Annual Reports"
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
                id="showCmsPublishDateAnn"
                checked={pageContent.showCmsPublishDate}
                onChange={(e) => setPageContent({ ...pageContent, showCmsPublishDate: e.target.checked })}
                className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg cursor-pointer"
              />
              <label htmlFor="showCmsPublishDateAnn" className="text-sm font-black text-gray-700 cursor-pointer select-none group-hover:text-blue-600 flex-1">CMS Published Date</label>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border-2 border-transparent hover:border-blue-100 transition-all cursor-pointer group">
              <input
                type="checkbox"
                id="showPublishDateAnn"
                checked={pageContent.showPublishDate}
                onChange={(e) => setPageContent({ ...pageContent, showPublishDate: e.target.checked })}
                className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg cursor-pointer"
              />
              <label htmlFor="showPublishDateAnn" className="text-sm font-black text-gray-700 cursor-pointer select-none group-hover:text-blue-600 flex-1">Public Website Dates</label>
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

      <div className="space-y-10 mt-12">
        <div className="flex justify-between items-center bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-gray-200 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black uppercase tracking-tighter italic">Content Categories</h3>
            <p className="text-gray-400 text-[10px] font-black tracking-widest mt-2 uppercase">Total Categories Organized: {pageContent.sections.length}</p>
          </div>
          <button
            onClick={handleAddSection}
            className="relative z-10 px-8 py-4 bg-white text-[#2563EB] rounded-2xl hover:bg-blue-50 transition-all font-black text-xs tracking-widest uppercase flex items-center gap-3 shadow-xl active:scale-95"
          >
            <i className="ri-folder-add-fill text-xl"></i> CREATE NEW CATEGORY
          </button>
        </div>


        {/* Sections List */}
        <div className="grid grid-cols-1 gap-12 pb-20">
          {pageContent.sections.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200 grayscale opacity-60">
              <div className="w-24 h-24 rounded-[2rem] bg-white shadow-xl flex items-center justify-center mb-6">
                <i className="ri-folder-open-line text-4xl text-gray-300"></i>
              </div>
              <h3 className="text-xl font-black text-gray-400 uppercase tracking-tighter">Repository Empty</h3>
              <p className="text-gray-400 text-sm font-bold tracking-widest mt-2">NO DATA CATEGORIES DETECTED</p>
            </div>
          ) : (
            pageContent.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                {/* Section Header */}
                <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white">
                  <div className="flex items-center gap-5 flex-1 w-full">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl border border-blue-100/50 shadow-sm">
                      <i className="ri-folder-info-fill"></i>
                    </div>
                    <div className="flex-1">
                      {editingSectionIndex === sectionIndex ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            className="flex-1 bg-gray-50 border-2 border-blue-200 rounded-xl px-4 py-2 font-black text-gray-800 outline-none focus:bg-white focus:border-blue-500 transition-all text-xl uppercase tracking-tight"
                            value={editingSectionTitle}
                            onChange={(e) => setEditingSectionTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveSection(sectionIndex)}
                            autoFocus
                          />
                          <button onClick={() => handleSaveSection(sectionIndex)} className="w-10 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md flex items-center justify-center">
                            <i className="ri-check-line text-xl"></i>
                          </button>
                          <button onClick={() => { setEditingSectionIndex(null); setEditingSectionTitle(''); }} className="w-10 h-10 bg-white text-gray-400 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center">
                            <i className="ri-close-line text-xl"></i>
                          </button>
                        </div>
                      ) : (
                        <h4 className="text-xl font-black text-gray-900 tracking-tight uppercase mb-1 cursor-pointer hover:text-blue-600" onClick={() => handleEditSection(sectionIndex, section.title)}>
                          {section.title}
                        </h4>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100/50 shadow-sm">{section.documents.length} DOCUMENTS</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => handleAddDocument(sectionIndex)}
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-white text-[#2563EB] hover:bg-blue-50 rounded-xl transition-all border border-blue-100 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-sm"
                    >
                      <i className="ri-add-circle-line text-lg"></i>
                      <span>Add Document</span>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSection(sectionIndex, section.title)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-gray-100"
                      >
                        <i className="ri-pencil-line text-lg"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteSection(sectionIndex)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-gray-100"
                      >
                        <i className="ri-delete-bin-line text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Documents List within Section */}
                <div className="p-6">
                  {section.documents.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                      <p className="text-sm font-medium text-gray-500">No documents in this section.</p>
                      <button
                        onClick={() => handleAddDocument(sectionIndex)}
                        className="text-blue-600 hover:underline text-xs font-bold mt-2"
                      >
                        + Add first document
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {section.documents.map((doc, docIndex) => {
                        const isEditing = editingDocument?.sectionIndex === sectionIndex && editingDocument?.documentIndex === docIndex;
                        return (
                          <div key={docIndex} className={`group/doc rounded-2xl border transition-all duration-300 ${isEditing ? 'border-blue-400 ring-4 ring-blue-50 bg-blue-50/30 overflow-hidden' : 'border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/30'}`}>
                            {/* Standard View */}
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
                                        <span className="flex items-center gap-1.5 text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-widest shadow-sm">
                                          FY {doc.year}
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
                                <div className="flex gap-2 ml-6">
                                  <button
                                    onClick={() => handleEditDocument(sectionIndex, docIndex)}
                                    className="w-10 h-10 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-blue-50 bg-white shadow-sm"
                                    title="Edit Document"
                                  >
                                    <i className="ri-edit-line text-lg"></i>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDocument(sectionIndex, docIndex)}
                                    className="w-10 h-10 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-50 bg-white shadow-sm"
                                    title="Delete Document"
                                  >
                                    <i className="ri-delete-bin-line text-lg"></i>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Inline Edit Mode */
                              <div className="animate-in slide-in-from-top-4 duration-400">
                                <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <i className="ri-edit-circle-line text-xl"></i>
                                    <h5 className="font-bold tracking-tight uppercase">Editing Document</h5>
                                  </div>
                                  <span className="text-[10px] bg-white/20 px-2 py-1 rounded-full font-bold uppercase tracking-wider">DOC #{docIndex + 1}</span>
                                </div>
                                <div className="p-8">
                                  {renderDocumentFields()}
                                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                                    <button
                                      onClick={() => setEditingDocument(null)}
                                      className="px-6 py-2.5 bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-bold border border-gray-200 active:scale-95"
                                    >
                                      CANCEL
                                    </button>
                                    <button
                                      onClick={handleSaveDocument}
                                      className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100 active:scale-95 flex items-center gap-2"
                                    >
                                      <i className="ri-check-line text-xl"></i> DONE EDITING
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modern Dialog for New Documents */}
      {showDocumentForm && editingDocument && editingDocument.documentIndex === -1 && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-white">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800 text-white relative">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl border border-white/30">
                  <i className="ri-file-add-line"></i>
                </div>
                <div>
                  <h4 className="text-xl font-black uppercase tracking-tighter italic">Attach New Report</h4>
                  <p className="text-blue-100/80 text-[10px] font-bold tracking-widest mt-0.5">UPLOADING TO: {(editingDocument && pageContent.sections[editingDocument.sectionIndex]?.title) || 'N/A'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDocumentForm(false)}
                className="relative z-10 w-10 h-10 flex items-center justify-center bg-black/10 hover:bg-black/20 text-white rounded-xl transition-all"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-10 overflow-y-auto custom-scrollbar flex-1 bg-white">
              <div className="mb-10 p-6 bg-blue-50/30 rounded-[2rem] border-2 border-blue-50">
                {renderDocumentFields()}
              </div>

              <div className="flex gap-4 justify-end items-center sticky bottom-0 bg-white pt-6 border-t border-gray-50 mt-4">
                <button
                  onClick={() => setShowDocumentForm(false)}
                  className="px-8 py-3.5 bg-gray-50 text-gray-500 rounded-2xl font-black text-xs hover:bg-gray-100 transition-all uppercase tracking-widest"
                >
                  DISCARD
                </button>
                <button
                  onClick={handleSaveDocument}
                  className="px-10 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-xs hover:bg-gray-900 transition-all shadow-2xl shadow-blue-200 uppercase tracking-widest flex items-center gap-3 active:scale-95"
                >
                  <i className="ri-upload-2-fill text-lg"></i> EXECUTE UPLOAD
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

