import { useState, useEffect } from 'react';
import { investorsCmsApi } from '../../../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

interface Document {
  title: string;
  publishedDate?: string;
  date?: string;
  pdfUrl: string;
  year: string;
}

interface Section {
  title: string;
  documents: Document[];
}

interface NewspaperPublicationPageContent {
  id?: number;
  slug: string;
  title: string;
  hasYearFilter: boolean;
  filterItems?: string[];
  sections: Section[];
  isActive: boolean;
  showPublishDate: boolean;
  showCmsPublishDate: boolean;
}

export default function InvestorNewspaperPublicationCMS() {
  const [pageContent, setPageContent] = useState<NewspaperPublicationPageContent>({
    slug: 'newspaper-publication',
    title: 'Newspaper Publication',
    hasYearFilter: true,
    filterItems: [],
    sections: [],
    isActive: true,
    showPublishDate: false,
    showCmsPublishDate: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number>(-1);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState<{ sectionIndex: number; document: Document; documentIndex: number } | null>(null);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [newFilterItem, setNewFilterItem] = useState('');
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfUrlInput, setPdfUrlInput] = useState('');
  const [isManualPdfUrl, setIsManualPdfUrl] = useState(false);

  useEffect(() => {
    if (editingDocument?.document?.pdfUrl) {
      setPdfUrlInput(editingDocument.document.pdfUrl);
      setIsManualPdfUrl(isExternalPdfUrl(editingDocument.document.pdfUrl));
    } else {
      setPdfUrlInput('');
      setIsManualPdfUrl(false);
    }
  }, [editingDocument]);

  const isExternalPdfUrl = (url: string) => {
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const handlePdfUrlChange = async (url: string) => {
    setPdfUrlInput(url);
    if (editingDocument && editingDocument.document) {
      const updatedDoc = { ...editingDocument.document, pdfUrl: url };
      setEditingDocument({ ...editingDocument, document: updatedDoc });

      if (isExternalPdfUrl(url)) {
        try {
          setDownloadingPdf(true);
          await investorsCmsApi.downloadAndSavePdf(url, 'newspaper-publication');
        } catch (err) {
          console.error('Failed to trigger background PDF download:', err);
        } finally {
          setDownloadingPdf(false);
        }
      }
    }
  };

  useEffect(() => {
    loadPageContent();
  }, []);

  const loadPageContent = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await investorsCmsApi.getPageContentBySlug('newspaper-publication');
      if (data) {
        setPageContent({
          ...data,
          sections: data.sections || [],
          filterItems: data.filterItems || [],
          showPublishDate: data.showPublishDate || (data as any).show_publish_date || false,
          showCmsPublishDate: data.showCmsPublishDate || (data as any).show_cms_publish_date || false,
          isActive: data.isActive !== undefined ? data.isActive : (data as any).is_active !== undefined ? (data as any).is_active : true,
        });
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load Newspaper Publication page');
      }
      setPageContent({
        slug: 'newspaper-publication',
        title: 'Newspaper Publication',
        hasYearFilter: true,
        filterItems: [],
        sections: [],
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
      setLoading(true);
      
      const saveData = {
        ...pageContent,
        show_publish_date: pageContent.showPublishDate,
        show_cms_publish_date: pageContent.showCmsPublishDate,
        is_active: pageContent.isActive,
        sections: pageContent.sections,
      };

      if (pageContent.id) {
        await investorsCmsApi.updatePageContent(pageContent.id, saveData);
        setSuccess('Newspaper Publication page updated successfully');
      } else {
        await investorsCmsApi.createPageContent(saveData);
        setSuccess('Newspaper Publication page created successfully');
      }
      
      await loadPageContent();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save Newspaper Publication page');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFilterItem = () => {
    if (!newFilterItem.trim()) {
      setError('Please enter a year (e.g., 2024-25)');
      return;
    }
    const filterItems = pageContent.filterItems || [];
    if (filterItems.includes(newFilterItem)) {
      setError('This year already exists in the filter list');
      return;
    }
    setPageContent({
      ...pageContent,
      filterItems: [...filterItems, newFilterItem].sort((a, b) => {
        const yearA = parseInt(a.split('-')[0]);
        const yearB = parseInt(b.split('-')[0]);
        return yearB - yearA;
      }),
    });
    setNewFilterItem('');
    setError('');
  };

  const handleDeleteFilterItem = (item: string) => {
    const filterItems = pageContent.filterItems || [];
    setPageContent({
      ...pageContent,
      filterItems: filterItems.filter(f => f !== item),
    });
  };

  const handleAddSection = () => {
    setEditingSection({ title: '', documents: [] });
    setEditingSectionIndex(-1);
    setShowSectionForm(true);
    setError('');
  };

  const handleEditSection = (index: number) => {
    setEditingSection({ ...pageContent.sections[index] });
    setEditingSectionIndex(index);
    setShowSectionForm(true);
    setError('');
  };

  const handleDeleteSection = (index: number) => {
    if (!window.confirm('Are you sure you want to delete this category? All documents in this category will also be deleted.')) {
      return;
    }
    const updatedSections = [...pageContent.sections];
    updatedSections.splice(index, 1);
    setPageContent({ ...pageContent, sections: updatedSections });
  };

  const handleSaveSection = () => {
    if (!editingSection) return;

    if (!editingSection.title.trim()) {
      setError('Category title is required');
      return;
    }

    const updatedSections = [...pageContent.sections];

    if (editingSectionIndex >= 0) {
      updatedSections[editingSectionIndex] = editingSection;
    } else {
      if (updatedSections.some(s => s.title === editingSection.title)) {
        setError('A category with this title already exists');
        return;
      }
      updatedSections.push(editingSection);
    }

    setPageContent({ ...pageContent, sections: updatedSections });
    setEditingSection(null);
    setEditingSectionIndex(-1);
    setShowSectionForm(false);
    setError('');
  };

  const handleAddDocument = (sectionIndex: number) => {
    setEditingDocument({
      sectionIndex,
      document: { title: '', publishedDate: '', pdfUrl: '', year: '', date: '' },
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

  const handleSaveDocument = (doc: Document, sectionIndex: number, documentIndex: number) => {
    if (!doc.title.trim()) {
      setError('Document title is required');
      return;
    }
    if (!doc.year.trim()) {
      setError('Year is required');
      return;
    }
    if (!doc.pdfUrl.trim()) {
      setError('PDF URL is required');
      return;
    }

    // Add year to filterItems if not already present
    const filterItems = pageContent.filterItems || [];
    if (!filterItems.includes(doc.year)) {
      const updatedFilterItems = [...filterItems, doc.year].sort((a, b) => {
        const yearA = parseInt(a.split('-')[0]);
        const yearB = parseInt(b.split('-')[0]);
        return yearB - yearA;
      });
      setPageContent({ ...pageContent, filterItems: updatedFilterItems });
    }

    const updatedSections = [...pageContent.sections];
    if (documentIndex >= 0) {
      updatedSections[sectionIndex].documents[documentIndex] = doc;
    } else {
      updatedSections[sectionIndex].documents.push(doc);
    }

    setPageContent({ ...pageContent, sections: updatedSections });
    setEditingDocument(null);
    setShowDocumentForm(false);
    setError('');
  };

  const handleDeleteDocument = (sectionIndex: number, documentIndex: number) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    const updatedSections = [...pageContent.sections];
    updatedSections[sectionIndex].documents.splice(documentIndex, 1);
    setPageContent({ ...pageContent, sections: updatedSections });
  };

  const handlePdfUpload = async (file: File) => {
    if (!editingDocument || !editingDocument.document) return;
    try {
      setUploadingPdf(true);
      const formData = new FormData();
      formData.append('pdf', file);
      const response = await fetch(`${API_BASE_URL}/api/upload/pdf/newspaper-publication`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      setEditingDocument({ ...editingDocument, document: { ...editingDocument.document, pdfUrl: data.pdfUrl } });
      setSuccess('PDF uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to upload PDF');
    } finally {
      setUploadingPdf(false);
    }
  };

  const renderDocumentFields = (doc: Document, sectionIndex: number, documentIndex: number) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="md:col-span-2">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Document Title</label>
        <div className="relative group">
          <input
            type="text"
            value={doc.title}
            onChange={(e) => {
              const updatedDoc = { ...doc, title: e.target.value };
              if (editingDocument) {
                setEditingDocument({ ...editingDocument, document: updatedDoc });
              }
            }}
            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-gray-700 font-medium placeholder:text-gray-300 shadow-inner group-hover:bg-gray-100/50"
            placeholder="e.g. 23rd AGM – Notice – Newspaper Publication – 2025"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors">
            <i className="ri-text-spacing text-xl"></i>
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="flex items-center justify-between mb-2 ml-1">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Document Source</label>
          <button
            onClick={() => setIsManualPdfUrl(!isManualPdfUrl)}
            className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
          >
            Switch to {isManualPdfUrl ? 'File Upload' : 'Manual URL'}
          </button>
        </div>

        {isManualPdfUrl ? (
          <div className="relative group">
            <input
              type="text"
              value={pdfUrlInput}
              onChange={(e) => handlePdfUrlChange(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-gray-700 font-medium placeholder:text-gray-300 shadow-inner group-hover:bg-gray-100/50"
              placeholder="https://example.com/document.pdf"
            />
            {downloadingPdf && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors">
              <i className="ri-links-line text-xl"></i>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <input
              type="file"
              onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])}
              className="hidden"
              id={`newspaper-publication-pdf-upload-${sectionIndex}-${documentIndex}`}
            />
            <label
              htmlFor={`newspaper-publication-pdf-upload-${sectionIndex}-${documentIndex}`}
              className="flex items-center justify-between w-full px-5 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-100/50 hover:border-blue-500/30 transition-all cursor-pointer group"
            >
              <span className="text-gray-500 font-medium truncate pr-4">
                {doc.pdfUrl ? doc.pdfUrl.split('/').pop() : 'Click to upload PDF...'}
              </span>
              <div className="flex items-center gap-2 text-blue-600">
                {uploadingPdf ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                ) : (
                  <>
                    <span className="text-xs font-bold uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg group-hover:bg-blue-100">Browse</span>
                    <i className="ri-upload-cloud-2-line text-xl"></i>
                  </>
                )}
              </div>
            </label>
          </div>
        )}
      </div>

      {pageContent.showCmsPublishDate && (
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Published Date</label>
          <div className="relative group">
            <input
              type="text"
              value={doc.date || doc.publishedDate || ''}
              onChange={(e) => {
                const updatedDoc = { ...doc, date: e.target.value, publishedDate: e.target.value };
                if (editingDocument) {
                  setEditingDocument({ ...editingDocument, document: updatedDoc });
                }
              }}
              className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500/30 transition-all outline-none text-gray-700 font-medium placeholder:text-gray-300 group-hover:bg-gray-100/50"
              placeholder="DD/MM/YYYY"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
              <i className="ri-calendar-event-line text-lg"></i>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Financial Year</label>
        <div className="relative group">
          {pageContent.filterItems && pageContent.filterItems.length > 0 ? (
            <select
              value={doc.year || ''}
              onChange={(e) => {
                const updatedDoc = { ...doc, year: e.target.value };
                if (editingDocument) {
                  setEditingDocument({ ...editingDocument, document: updatedDoc });
                }
              }}
              className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500/30 transition-all outline-none text-gray-700 font-medium group-hover:bg-gray-100/50"
            >
              <option value="">Select Year</option>
              {pageContent.filterItems.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={doc.year || ''}
              onChange={(e) => {
                const updatedDoc = { ...doc, year: e.target.value };
                if (editingDocument) {
                  setEditingDocument({ ...editingDocument, document: updatedDoc });
                }
              }}
              className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500/30 transition-all outline-none text-gray-700 font-medium placeholder:text-gray-300 group-hover:bg-gray-100/50"
              placeholder="e.g. 2024-25"
            />
          )}
        </div>
      </div>

      <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-50 mt-2">
        <button
          onClick={() => {
            setShowDocumentForm(false);
            setEditingDocument(null);
          }}
          className="px-6 py-2.5 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => handleSaveDocument(doc, sectionIndex, documentIndex)}
          className="px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200"
        >
          {documentIndex >= 0 ? 'Update Item' : 'Add to List'}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] font-['Open_Sans'] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading Newspaper Publication page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Open_Sans']">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <i className="ri-newspaper-line text-white text-xl"></i>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Newspaper Publication Page CMS</h2>
            </div>
            <p className="text-sm text-gray-400 flex items-center gap-2 ml-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse"></span>
              Manage categories and documents for the Newspaper Publication section
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="group relative px-8 py-4 bg-[#2563EB] text-white rounded-2xl hover:bg-blue-700 transition-all shadow-[0_10px_20px_-5px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] flex items-center gap-3 active:scale-95 disabled:opacity-70"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <i className="ri-check-line text-xl group-hover:scale-110 transition-transform"></i>
                <span className="font-bold tracking-wider text-sm">SAVE ALL CHANGES</span>
              </>
            )}
          </button>
        </div>

        {/* Status Messages */}
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
          {error && (
            <div className="animate-slide-in p-4 bg-white border-l-4 border-red-500 shadow-2xl rounded-xl flex items-center gap-4 min-w-[320px]">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                <i className="ri-error-warning-line text-xl"></i>
              </div>
              <div>
                <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Error Occurred</p>
                <p className="text-sm text-gray-600 font-medium">{error}</p>
              </div>
            </div>
          )}
          {success && (
            <div className="animate-slide-in p-4 bg-white border-l-4 border-green-500 shadow-2xl rounded-xl flex items-center gap-4 min-w-[320px]">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-500">
                <i className="ri-checkbox-circle-line text-xl"></i>
              </div>
              <div>
                <p className="text-xs font-bold text-green-500 uppercase tracking-widest">Success</p>
                <p className="text-sm text-gray-600 font-medium">{success}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-900/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>

              <h3 className="text-lg font-bold text-gray-900 mb-8 relative flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                General Settings
              </h3>

              <div className="space-y-8 relative">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Page Title</label>
                  <input
                    type="text"
                    value={pageContent.title}
                    onChange={(e) => setPageContent({ ...pageContent, title: e.target.value })}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-gray-700 font-semibold shadow-inner"
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <div className="group/item flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-blue-500/10 hover:bg-white hover:shadow-lg transition-all cursor-pointer" onClick={() => setPageContent({ ...pageContent, isActive: !pageContent.isActive })}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${pageContent.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                        <i className={`ri-power-flash-line text-xl ${pageContent.isActive ? 'animate-pulse' : ''}`}></i>
                      </div>
                      <span className="font-bold text-gray-700 text-sm tracking-tight">Status Active</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${pageContent.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${pageContent.isActive ? 'left-7' : 'left-1'}`}></div>
                    </div>
                  </div>

                  <div className="group/item flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-blue-500/10 hover:bg-white hover:shadow-lg transition-all cursor-pointer" onClick={() => setPageContent({ ...pageContent, showCmsPublishDate: !pageContent.showCmsPublishDate })}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${pageContent.showCmsPublishDate ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                        <i className="ri-calendar-todo-line text-xl"></i>
                      </div>
                      <span className="font-bold text-gray-700 text-sm tracking-tight">CMS Published Date</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${pageContent.showCmsPublishDate ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${pageContent.showCmsPublishDate ? 'left-7' : 'left-1'}`}></div>
                    </div>
                  </div>

                  <div className="group/item flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-blue-500/10 hover:bg-white hover:shadow-lg transition-all cursor-pointer" onClick={() => setPageContent({ ...pageContent, showPublishDate: !pageContent.showPublishDate })}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${pageContent.showPublishDate ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                        <i className="ri-global-line text-xl"></i>
                      </div>
                      <span className="font-bold text-gray-700 text-sm tracking-tight">Public Website Dates</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${pageContent.showPublishDate ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${pageContent.showPublishDate ? 'left-7' : 'left-1'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Year Filter Items */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-900/5">
              <h3 className="text-lg font-bold text-gray-900 mb-6 relative flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                Year Filter Items
              </h3>
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-gray-700 font-medium placeholder:text-gray-300"
                  value={newFilterItem}
                  onChange={(e) => setNewFilterItem(e.target.value)}
                  placeholder="e.g., 2024-25"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFilterItem();
                    }
                  }}
                />
                <button
                  onClick={handleAddFilterItem}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-sm"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
                {(pageContent.filterItems || []).map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
                  >
                    {item}
                    <button
                      onClick={() => handleDeleteFilterItem(item)}
                      className="text-blue-600 hover:text-blue-800 text-lg leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Areas */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sections List */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-900/5">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
                  Categories
                  <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-full font-extrabold">{pageContent.sections.length} Sections</span>
                </h3>
                <button
                  onClick={handleAddSection}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-gray-200 flex items-center gap-2 group"
                >
                  <i className="ri-add-fill text-lg group-hover:rotate-90 transition-transform"></i>
                  <span className="font-bold text-sm">Add Section</span>
                </button>
              </div>

              {/* Section Form */}
              {showSectionForm && editingSection && (
                <div className="mb-8 p-6 bg-gray-50 rounded-2xl border-2 border-blue-100">
                  <h4 className="text-sm font-extrabold text-blue-600 uppercase tracking-widest mb-4">
                    {editingSectionIndex >= 0 ? 'Edit Category' : 'New Category'}
                  </h4>
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Category Title</label>
                    <input
                      type="text"
                      value={editingSection.title}
                      onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                      className="w-full px-5 py-4 bg-white border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-gray-700 font-medium"
                      placeholder="e.g. AGM, June 2025, Postal ballot"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowSectionForm(false);
                        setEditingSection(null);
                        setEditingSectionIndex(-1);
                      }}
                      className="px-6 py-2.5 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveSection}
                      className="px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200"
                    >
                      {editingSectionIndex >= 0 ? 'Update Category' : 'Add Category'}
                    </button>
                  </div>
                </div>
              )}

              {pageContent.sections.length === 0 && !showSectionForm ? (
                <div className="flex flex-col items-center justify-center py-20 grayscale opacity-40">
                  <img src="https://refex.co.in/wp-content/uploads/2024/12/no-data.svg" className="w-32 mb-4" />
                  <p className="font-bold text-gray-400 italic">No sections currently created</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pageContent.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border border-gray-200 rounded-2xl p-6 bg-gray-50/50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-bold text-gray-900">{section.title}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSection(sectionIndex)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold"
                          >
                            Edit Category
                          </button>
                          <button
                            onClick={() => handleDeleteSection(sectionIndex)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Documents in Section */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-bold text-gray-600">Documents ({section.documents.length})</span>
                          <button
                            onClick={() => handleAddDocument(sectionIndex)}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-bold flex items-center gap-2"
                          >
                            <i className="ri-add-line"></i>
                            Add Document
                          </button>
                        </div>

                        {/* Document Form */}
                        {showDocumentForm && editingDocument && editingDocument.sectionIndex === sectionIndex && editingDocument.document && (
                          <div className="mb-6 p-4 bg-white rounded-xl border-2 border-blue-100">
                            <h5 className="text-sm font-extrabold text-blue-600 uppercase tracking-widest mb-4">
                              {editingDocument.documentIndex >= 0 ? 'Edit Document' : 'New Document'}
                            </h5>
                            {renderDocumentFields(editingDocument.document, sectionIndex, editingDocument.documentIndex)}
                          </div>
                        )}

                        {/* Documents List */}
                        {section.documents.length === 0 ? (
                          <div className="text-center py-4 text-gray-400 text-sm">No documents in this section</div>
                        ) : (
                          <div className="space-y-3">
                            {section.documents.map((doc, docIndex) => (
                              <div key={docIndex} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                                  <i className="ri-file-pdf-2-line text-2xl text-red-500"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-bold text-gray-800 truncate">{doc.title}</h5>
                                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    {pageContent.showPublishDate && (doc.date || doc.publishedDate) && (
                                      <span>Date: {doc.date || doc.publishedDate}</span>
                                    )}
                                    {doc.year && <span>Year: {doc.year}</span>}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditDocument(sectionIndex, docIndex)}
                                    className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center"
                                  >
                                    <i className="ri-edit-2-fill"></i>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDocument(sectionIndex, docIndex)}
                                    className="w-10 h-10 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                                  >
                                    <i className="ri-delete-bin-5-fill"></i>
                                  </button>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
