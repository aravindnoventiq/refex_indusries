import { useState, useEffect } from 'react';
import { investorsCmsApi } from '../../../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

interface Document {
  title: string;
  pdfUrl: string;
  date: string;
  year: string;
}

interface Section {
  title: string;
  documents: Document[];
}

interface PoliciesPage {
  id?: number;
  slug: string;
  title: string;
  documents: Document[];
  sections: Section[];
  isActive: boolean;
  showPublishDate: boolean;
  showCmsPublishDate: boolean;
}

export default function InvestorPoliciesCMS() {
  const [pageContent, setPageContent] = useState<PoliciesPage>({
    slug: 'policies',
    title: 'Policies',
    documents: [],
    sections: [],
    isActive: true,
    showPublishDate: false,
    showCmsPublishDate: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState<{
    sectionIndex: number;
    documentIndex: number;
    document: Document;
  } | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfUrlInput, setPdfUrlInput] = useState('');
  const [isManualPdfUrl, setIsManualPdfUrl] = useState(false);

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
        // Download to policies subfolder
        const response = await fetch(`${API_BASE_URL}/api/download-pdf-from-url/policies`, {
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

      // Upload to policies subfolder
      const response = await fetch(`${API_BASE_URL}/api/upload/pdf/policies`, {
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
      const data = await investorsCmsApi.getPageContentBySlug('policies');
      if (data) {
        // Handle both camelCase and snake_case from API response
        const showPublishDate = data.showPublishDate !== undefined ? data.showPublishDate : (data as any).show_publish_date;
        const showCmsPublishDate = data.showCmsPublishDate !== undefined ? data.showCmsPublishDate : (data as any).show_cms_publish_date;

        // Handle documents - could be in sections[0].documents or directly in documents
        let documents: Document[] = [];
        let sections: Section[] = [];

        if (data.sections && Array.isArray(data.sections) && data.sections.length > 0) {
          sections = data.sections.map((section: any) => ({
            ...section,
            documents: (section.documents || []).map((doc: any) => ({
              ...doc,
              pdfUrl: doc.pdfUrl || doc.link || '',
              date: doc.date || doc.publishedDate || doc.published_date || '',
              year: doc.year || '',
            }))
          }));
          documents = sections[0].documents;
        } else if (data.documents && Array.isArray(data.documents)) {
          documents = data.documents.map((doc: any) => ({
            ...doc,
            pdfUrl: doc.pdfUrl || doc.link || '',
            date: doc.date || doc.publishedDate || doc.published_date || '',
            year: doc.year || '',
          }));
          sections = [{ title: 'Policies', documents }];
        }

        const pageData = {
          ...data,
          documents,
          sections,
          showPublishDate: showPublishDate !== undefined ? !!showPublishDate : false,
          showCmsPublishDate: showCmsPublishDate !== undefined ? !!showCmsPublishDate : false,
        };
        setPageContent(pageData);
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load policies page');
      }
      // Use default structure if not found
      setPageContent({
        slug: 'policies',
        title: 'Policies',
        documents: [],
        sections: [{ title: 'Policies', documents: [] }],
        isActive: true,
        showPublishDate: false,
        showCmsPublishDate: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');

      // Store documents in sections[0].documents for consistency with other pages
      const saveData = {
        ...pageContent,
        hasYearFilter: false,
        filterItems: [],
        show_publish_date: pageContent.showPublishDate,
        show_cms_publish_date: pageContent.showCmsPublishDate,
        sections: pageContent.sections.map(section => ({
          ...section,
          documents: section.documents.map(doc => ({
            ...doc,
            publishedDate: doc.date, // Map date to publishedDate for public page
            link: doc.pdfUrl // Map pdfUrl to link for public page
          }))
        })),
      };

      // Check if page exists
      let existingPage;
      try {
        existingPage = await investorsCmsApi.getPageContentBySlug('policies');
      } catch (e) {
        // Page doesn't exist yet
      }

      if (existingPage && existingPage.id) {
        await investorsCmsApi.updatePageContent(existingPage.id, saveData);
        setSuccess('Policies page updated successfully');
      } else {
        await investorsCmsApi.createPageContent(saveData);
        setSuccess('Policies page created successfully');
      }

      // Reload the data to ensure we have the latest from the server
      await loadPageContent();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save policies page');
    }
  };

  const handleAddDocument = (sectionIndex: number = 0) => {
    setEditingDocument({
      sectionIndex,
      documentIndex: -1,
      document: { title: '', date: '', year: '', pdfUrl: '' },
    });
    setShowDocumentForm(true);
    setError('');
  };

  const handleEditDocument = (sectionIndex: number, documentIndex: number) => {
    const document = pageContent.sections[sectionIndex].documents[documentIndex];
    setEditingDocument({
      sectionIndex,
      documentIndex,
      document: { ...document },
    });
    setError('');
  };

  const handleDeleteDocument = (sectionIndex: number, documentIndex: number) => {
    if (!confirm('Are you sure you want to delete this policy?')) {
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
      setError('Policy title is required');
      return;
    }
    if (!doc.pdfUrl.trim()) {
      setError('Document link (URL) is required');
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
            placeholder="e.g., Risk Management Policy"
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
                placeholder="https://example.com/policy.pdf"
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
                id="pdf-upload-standard-inv-policies"
                className="hidden"
                disabled={uploadingPdf}
              />
              <label
                htmlFor="pdf-upload-standard-inv-policies"
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
              <div className="w-12 h-12 bg-red-50 text-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-red-500/50 z-10">
                <i className="ri-file-pdf-fill text-2xl"></i>
              </div>
              <div className="flex-1 min-w-0 z-10">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1 text-red-500/80">Current Attachment</p>
                <p className="text-sm font-bold text-gray-300 truncate tracking-tight">{doc.pdfUrl}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading policies page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6" style={{ fontFamily: '"Open Sans", sans-serif' }}>
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Policies CMS</h2>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Manage corporate policies and document display settings
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
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <i className="ri-error-warning-line text-xl"></i>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <i className="ri-checkbox-circle-line text-xl"></i>
            <span className="font-medium">{success}</span>
          </div>
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
                className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold text-gray-800 focus:bg-white focus:border-blue-500 transition-all outline-none"
                value={pageContent.title}
                onChange={(e) => setPageContent({ ...pageContent, title: e.target.value })}
                placeholder="Policies"
              />
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
            <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border-2 border-transparent hover:border-blue-100 transition-all cursor-pointer group md:col-span-2">
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
      </div>

      {/* Sections and Documents */}
      <div className="space-y-12 mb-12">
        {pageContent.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden group/section">
            <button
              onClick={() => {
                const newSections = [...pageContent.sections];
                newSections.splice(sectionIndex, 1);
                setPageContent({ ...pageContent, sections: newSections });
              }}
              className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all z-20 group-hover/section:translate-x-0 translate-x-12 opacity-0 group-hover/section:opacity-100"
              title="Remove Category"
            >
              <i className="ri-delete-bin-line text-lg"></i>
            </button>
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
              <div className="flex-1 group">
                <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest group-focus-within:text-blue-600 transition-colors">Category Title</label>
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
                    placeholder="ENTER CATEGORY NAME"
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
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No documents in this category</p>
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
                            <h5 className="text-md font-bold uppercase tracking-wider text-blue-800">Editing Policy</h5>
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
          onClick={() => {
            const newSections = [...pageContent.sections];
            newSections.push({ title: '', documents: [] });
            setPageContent({ ...pageContent, sections: newSections });
          }}
          className="group relative px-12 py-6 bg-white border-2 border-gray-100 rounded-[2rem] hover:border-blue-500 transition-all duration-500 shadow-xl hover:shadow-blue-200/50 flex flex-col items-center gap-2 active:scale-95"
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
            <i className="ri-add-line text-3xl font-bold"></i>
          </div>
          <span className="text-[10px] font-black text-gray-400 group-hover:text-blue-600 uppercase tracking-[0.3em] transition-colors">Add New Category</span>
        </button>
      </div>

      {/* Popup Form for ADDING new document (Add State Only) */}
      {showDocumentForm && editingDocument && editingDocument.documentIndex === -1 && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">Add New Document</h3>
                <p className="text-blue-100 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">
                  Section: {pageContent.sections[editingDocument.sectionIndex].title}
                </p>
              </div>
              <button
                onClick={() => { setShowDocumentForm(false); setEditingDocument(null); }}
                className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-white active:scale-95"
                title="Close"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="bg-blue-50/30 p-5 rounded-2xl border border-blue-100/50 mb-8">
                <p className="text-xs text-blue-600 font-bold flex items-center gap-3 italic">
                  <i className="ri-information-line text-lg"></i>
                  Complete all required fields to secure the document to our library.
                </p>
              </div>
              {renderDocumentFields()}
            </div>

            <div className="p-10 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-4 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
              <button
                onClick={() => { setShowDocumentForm(false); setEditingDocument(null); }}
                className="px-8 py-4 bg-white text-gray-500 rounded-2xl hover:bg-gray-100 border border-gray-200 transition-all font-black text-[10px] tracking-widest uppercase active:scale-95"
              >
                Nevermind
              </button>
              <button
                onClick={handleSaveDocument}
                disabled={!editingDocument.document.title.trim() || !editingDocument.document.pdfUrl.trim() || uploadingPdf || downloadingPdf}
                className="px-10 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-black text-[10px] tracking-widest uppercase shadow-xl shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-95 flex items-center gap-3"
              >
                <i className="ri-add-line text-lg"></i> Add Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

