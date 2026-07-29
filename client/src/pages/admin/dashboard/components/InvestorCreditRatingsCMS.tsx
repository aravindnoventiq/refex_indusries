import { useState, useEffect } from 'react';
import { investorsCmsApi } from '../../../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface Document {
  title: string;
  year: string;
  publishedDate?: string;
  pdfUrl: string;
}

interface CreditRatingsPage {
  id?: number;
  slug: string;
  title: string;
  hasYearFilter: boolean;
  showCmsPublishDate?: boolean;
  showPublishDate?: boolean;
  filterItems?: string[]; // Array of filter items (years) for the filter dropdown
  documents: Document[];
  isActive: boolean;
}

export default function InvestorCreditRatingsCMS() {
  const [pageContent, setPageContent] = useState<CreditRatingsPage>({
    slug: 'credit-ratings',
    title: 'Credit Ratings',
    hasYearFilter: true,
    showCmsPublishDate: false,
    showPublishDate: false,
    filterItems: [],
    documents: [],
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingDocument, setEditingDocument] = useState<{ document: Document | null; documentIndex: number } | null>(null);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [showFilterItemForm, setShowFilterItemForm] = useState(false);
  const [editingFilterItem, setEditingFilterItem] = useState<string>('');
  const [editingFilterIndex, setEditingFilterIndex] = useState<number>(-1);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfUrlInput, setPdfUrlInput] = useState('');
  const [isManualPdfUrl, setIsManualPdfUrl] = useState(false);

  const isExternalPdfUrl = (url: string) => {
    return url && (url.startsWith('http://') || url.startsWith('https://'));
  };

  const handlePdfUrlChange = async (url: string) => {
    setPdfUrlInput(url);
    if (editingDocument?.document) {
      setEditingDocument({
        ...editingDocument,
        document: { ...editingDocument.document, pdfUrl: url }
      });
    }

    // If it's an external URL, attempt to download it to local server
    if (isExternalPdfUrl(url)) {
      setDownloadingPdf(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/download-pdf-from-url/credit-ratings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.pdfUrl && editingDocument?.document) {
            setEditingDocument({
              ...editingDocument,
              document: { ...editingDocument.document, pdfUrl: data.pdfUrl }
            });
            setSuccess('External PDF processed and saved locally');
            setTimeout(() => setSuccess(''), 3000);
          }
        }
      } catch (err) {
        console.error('Failed to download external PDF:', err);
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

      const response = await fetch(`${API_BASE_URL}/api/upload/pdf/credit-ratings`, {
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
      const data = await investorsCmsApi.getPageContentBySlug('credit-ratings');
      if (data) {
        // Handle both camelCase and snake_case from API response
        const filterItems = (data.filterItems || (data as any).filter_items || []);

        // Map backend fields to frontend state correctly
        // Backend could have: showPublishDate, show_publish_date, showCmsPublishDate, show_cms_publish_date
        const showPublishDate = data.showPublishDate !== undefined ? data.showPublishDate : (data as any).show_publish_date;
        const showCmsPublishDate = data.showCmsPublishDate !== undefined ? data.showCmsPublishDate : (data as any).show_cms_publish_date;

        // Handle documents - could be in sections[0].documents or directly in documents
        let documents: Document[] = [];
        if (data.documents && Array.isArray(data.documents)) {
          documents = data.documents;
        } else if (data.sections && data.sections.length > 0 && data.sections[0].documents) {
          documents = data.sections[0].documents;
        }

        const pageData = {
          ...data,
          filterItems: Array.isArray(filterItems) ? filterItems : [],
          showPublishDate: !!showPublishDate,
          showCmsPublishDate: !!showCmsPublishDate,
          documents: documents,
        };
        setPageContent(pageData);
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load credit ratings page');
      }
      // Use default structure if not found
      setPageContent({
        slug: 'credit-ratings',
        title: 'Credit Ratings',
        hasYearFilter: true,
        filterItems: [],
        documents: [],
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

      // Store documents in sections[0].documents for consistency with other pages
      const saveData = {
        ...pageContent,
        filterItems: pageContent.filterItems || [],
        show_cms_publish_date: pageContent.showCmsPublishDate,
        show_publish_date: pageContent.showPublishDate,
        sections: [
          {
            title: 'Credit Ratings',
            documents: pageContent.documents || [],
          }
        ],
      };

      // Check if page exists
      let existingPage;
      try {
        existingPage = await investorsCmsApi.getPageContentBySlug('credit-ratings');
      } catch (e) {
        // Page doesn't exist yet
      }

      if (existingPage && existingPage.id) {
        await investorsCmsApi.updatePageContent(existingPage.id, saveData);
        setSuccess('Credit Ratings page updated successfully');
      } else {
        await investorsCmsApi.createPageContent(saveData);
        setSuccess('Credit Ratings page created successfully');
      }

      // Reload the data to ensure we have the latest from the server
      await loadPageContent();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save credit ratings page');
    }
  };

  const handleAddDocument = () => {
    setEditingDocument({
      document: {
        title: '',
        year: '',
        pdfUrl: '',
        publishedDate: '',
      },
      documentIndex: -1,
    });
    setShowDocumentForm(true);
    setError('');
  };

  const handleEditDocument = (documentIndex: number) => {
    const document = pageContent.documents[documentIndex];
    setEditingDocument({
      document: { ...document },
      documentIndex,
    });
    setShowDocumentForm(true);
    setError('');
  };

  const handleDeleteDocument = (documentIndex: number) => {
    if (!confirm('Are you sure you want to delete this credit rating?')) {
      return;
    }
    const updatedDocuments = [...pageContent.documents];
    updatedDocuments.splice(documentIndex, 1);
    setPageContent({ ...pageContent, documents: updatedDocuments });
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

    const updatedDocuments = [...pageContent.documents];
    if (editingDocument.documentIndex >= 0) {
      // Update existing document
      updatedDocuments[editingDocument.documentIndex] = doc;
    } else {
      // Add new document
      updatedDocuments.push(doc);
    }

    setPageContent({ ...pageContent, documents: updatedDocuments });
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

  const renderDocumentFields = (doc: Document) => {
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
            onChange={(e) => setEditingDocument(prev => prev ? {
              ...prev,
              document: { ...prev.document!, title: e.target.value }
            } : null)}
            placeholder="e.g., Un-Audited Financial Results – Q2 FY26"
          />
        </div>

        {pageContent.showCmsPublishDate && (
          <div className="group">
            <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest group-focus-within:text-blue-600 transition-colors">
              Published Date (Optional)
            </label>
            <input
              type="text"
              className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold text-gray-800 focus:bg-white focus:border-blue-500 transition-all outline-none"
              value={doc.publishedDate || ''}
              onChange={(e) => setEditingDocument(prev => prev ? {
                ...prev,
                document: { ...prev.document!, publishedDate: e.target.value }
              } : null)}
              placeholder="e.g. 04/11/2025"
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
              onChange={(e) => setEditingDocument(prev => prev ? {
                ...prev,
                document: { ...prev.document!, year: e.target.value }
              } : null)}
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
            <div className="space-y-3">
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
                <div className="flex items-center gap-3 px-2 animate-pulse">
                  <div className="flex-1 h-1 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-1/2 rounded-full animate-progress-indeterminate"></div>
                  </div>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Processing URL...</span>
                </div>
              )}
              {!downloadingPdf && doc.pdfUrl && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100/50 w-fit animate-in fade-in zoom-in duration-300">
                  <i className="ri-checkbox-circle-fill text-blue-500"></i>
                  <span className="text-[10px] font-bold text-blue-700 truncate max-w-[400px]">Active PDF: {doc.pdfUrl}</span>
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
                    <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Uploading PDF...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-all">
                      <i className="ri-file-upload-line text-xl text-gray-400 group-hover:text-blue-600"></i>
                    </div>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
                      {doc.pdfUrl ? (
                        <span className="text-blue-600 flex items-center gap-2 italic">
                          <i className="ri-file-check-line text-lg"></i> File Ready
                        </span>
                      ) : (
                        "Drop PDF File Here or Click to Upload"
                      )}
                    </p>
                  </>
                )}
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
          <p className="mt-2 text-gray-600">Loading credit ratings page...</p>
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
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Credit Ratings Page CMS</h2>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Manage documents for the Credit Ratings page
            </p>
          </div>
          <button
            onClick={handleSave}
            className="group relative px-8 py-3 bg-[#2563EB] text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 flex items-center gap-2"
          >
            <i className="ri-check-line text-lg"></i>
            <span className="font-bold tracking-wide uppercase">SAVE ALL CHANGES</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl flex items-center gap-3">
            <i className="ri-error-warning-fill text-xl"></i>
            <p className="font-bold text-sm tracking-wide uppercase">{error}</p>
          </div>
        </div>
      )}
      {success && (
        <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
          <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-xl flex items-center gap-3">
            <i className="ri-checkbox-circle-fill text-xl"></i>
            <p className="font-bold text-sm tracking-wide uppercase">{success}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* General Settings Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <i className="ri-settings-4-line text-2xl text-blue-600 font-normal"></i>
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">General Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                Page Title ^
              </label>
              <input
                type="text"
                className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all placeholder:text-gray-300"
                value={pageContent.title}
                onChange={(e) => setPageContent({ ...pageContent, title: e.target.value })}
                placeholder="Credit Ratings"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-sm relative overflow-hidden flex flex-col group">
          <div className="absolute top-0 right-0 p-8">
            <button
              onClick={handleAddFilterItem}
              className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 hover:scale-110 active:scale-95"
            >
              <i className="ri-add-line text-xl"></i>
            </button>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <i className="ri-filter-line text-xl text-blue-600"></i>
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Years</h3>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-14 mb-8">Filter Items</p>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[160px]">
            {pageContent.filterItems && pageContent.filterItems.length > 0 ? (
              <div className="space-y-2">
                {pageContent.filterItems.map((item, index) => (
                  <div key={index} className="group/item flex items-center justify-between p-4 bg-gray-50/50 hover:bg-white border-2 border-transparent hover:border-blue-100 rounded-2xl transition-all cursor-default">
                    <span className="text-sm font-black text-gray-700 group-hover/item:text-blue-600 tracking-tight">FY {item}</span>
                    <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-all translate-x-4 group-hover/item:translate-x-0">
                      <button onClick={() => handleEditFilterItem(index)} className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                        <i className="ri-pencil-line"></i>
                      </button>
                      <button onClick={() => handleDeleteFilterItem(index)} className="w-8 h-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center px-4 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                <i className="ri-calendar-line text-2xl text-gray-300 mb-2"></i>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">No years active</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shadow-inner">
            <i className="ri-file-list-3-line text-2xl text-blue-600"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Credit Ratings</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1 ml-1">Archive Manage</p>
          </div>
        </div>
        <button
          onClick={handleAddDocument}
          className="group flex items-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 translate-y-2"
        >
          <i className="ri-add-line text-lg group-hover:rotate-90 transition-transform"></i>
          ADD CREDIT RATING
        </button>
      </div>

      {/* Documents List */}
      <div className="space-y-4 relative">
        {pageContent.documents.length === 0 ? (
          <div className="text-center py-24 bg-gray-50/50 rounded-[40px] border-4 border-dashed border-gray-100 flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-gray-100">
              <i className="ri-folder-open-line text-5xl text-gray-200"></i>
            </div>
            <h4 className="text-xl font-black text-gray-400 uppercase tracking-widest">No ratings found</h4>
            <p className="text-gray-400 mt-2 font-bold tracking-tight">Click the add button above to start your archive.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pageContent.documents.map((doc, docIndex) => (
              <div key={docIndex}>
                {/* Inline Editing Mode */}
                {editingDocument?.documentIndex === docIndex && (
                  <div className="mb-4 bg-white rounded-[32px] border-4 border-blue-600/10 p-1 shadow-2xl animate-in zoom-in-95 duration-300">
                    <div className="bg-blue-600 rounded-t-[28px] px-8 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                          <i className="ri-pencil-fill text-white"></i>
                        </div>
                        <span className="text-white font-black text-xs uppercase tracking-[0.2em]">Editing Document</span>
                      </div>
                      <div className="w-24 h-1 bg-white/20 rounded-full"></div>
                    </div>

                    <div className="p-10 bg-white">
                      {renderDocumentFields(editingDocument.document!)}
                      <div className="mt-10 flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-gray-50">
                        <button
                          onClick={handleSaveDocument}
                          className="flex-1 h-16 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 group active:scale-105"
                        >
                          <i className="ri-check-double-line text-xl group-hover:scale-110 transition-transform"></i>
                          DONE EDITING
                        </button>
                        <button
                          onClick={() => {
                            setEditingDocument(null);
                            setError('');
                          }}
                          className="h-16 px-10 bg-white text-gray-400 border-2 border-gray-100 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-gray-50 hover:text-gray-900 transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                          <i className="ri-close-line text-xl"></i>
                          CANCEL
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular Card View */}
                {editingDocument?.documentIndex !== docIndex && (
                  <div className="group relative bg-white rounded-[2rem] border-2 border-gray-100 p-6 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div className="flex items-start gap-5">
                        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <i className="ri-file-pdf-2-fill text-3xl"></i>
                        </div>
                        <div>
                          <h4 className="text-lg font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{doc.title}</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {doc.year && (
                              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                FY {doc.year}
                              </span>
                            )}
                            {doc.publishedDate && (
                              <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-100">
                                {doc.publishedDate}
                              </span>
                            )}
                            <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-bold truncate max-w-[200px] border border-gray-100">
                              {doc.pdfUrl}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <button
                          onClick={() => handleEditDocument(docIndex)}
                          className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
                        >
                          <i className="ri-pencil-line text-xl"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(docIndex)}
                          className="w-12 h-12 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
                        >
                          <i className="ri-delete-bin-line text-xl"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popup Add Document Form */}
      {showDocumentForm && editingDocument && editingDocument.documentIndex === -1 && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4 sm:p-6 transition-all animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden border-8 border-white animate-in zoom-in-95 slide-in-from-bottom-12 duration-500">
            {/* Solid Blue Header */}
            <div className="bg-blue-600 px-10 py-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <i className="ri-add-line text-white text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-black text-xl uppercase tracking-tight">Add New Document</h3>
                  <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-0.5">Add document to category: Credit Ratings</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDocumentForm(false);
                  setEditingDocument(null);
                  setError('');
                }}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center transition-all active:scale-90"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="p-12 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {error && (
                <div className="mb-8 p-5 bg-red-50 border-2 border-red-100 text-red-700 rounded-2xl flex items-center gap-4 animate-shake">
                  <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
                    <i className="ri-error-warning-fill text-white text-xl font-normal"></i>
                  </div>
                  <p className="font-black text-xs uppercase tracking-widest">{error}</p>
                </div>
              )}

              {renderDocumentFields(editingDocument.document!)}

              <div className="mt-12 flex gap-4">
                <button
                  onClick={handleSaveDocument}
                  className="flex-1 h-16 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 group active:scale-105"
                >
                  <i className="ri-add-box-line text-xl group-hover:scale-110 transition-transform font-normal"></i>
                  ADD DOCUMENT
                </button>
                <button
                  onClick={() => {
                    setShowDocumentForm(false);
                    setEditingDocument(null);
                    setError('');
                  }}
                  className="h-16 px-10 bg-gray-50 text-gray-400 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-gray-100 hover:text-gray-900 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Filter Year Form */}
      {showFilterItemForm && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden border-8 border-white animate-in zoom-in-95 duration-500">
            <div className="bg-blue-600 p-8 flex items-center justify-between">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                {editingFilterIndex >= 0 ? 'Edit Filter Year' : 'Add Filter Year'}
              </h3>
              <button
                onClick={() => {
                  setEditingFilterItem('');
                  setEditingFilterIndex(-1);
                  setShowFilterItemForm(false);
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Financial Year Range *
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 font-bold text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all placeholder:text-gray-300"
                    value={editingFilterItem}
                    onChange={(e) => setEditingFilterItem(e.target.value)}
                    placeholder="e.g., 2025-26"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveFilterItem}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95"
                  >
                    SAVE YEAR
                  </button>
                  <button
                    onClick={() => {
                      setEditingFilterItem('');
                      setEditingFilterIndex(-1);
                      setShowFilterItemForm(false);
                    }}
                    className="px-6 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 hover:text-gray-600 transition-all active:scale-95"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

