import { useEffect, useState } from 'react';
import { investorsCmsApi } from '../../../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

interface SmartOdrDocument {
  title: string;
  pdfUrl: string;
}

interface SmartOdrSection {
  title: string;
  documents: SmartOdrDocument[];
}

interface SmartOdrPage {
  id?: number;
  slug: string;
  title: string;
  hasYearFilter: boolean;
  filterItems?: string[];
  sections: SmartOdrSection[];
  isActive: boolean;
  showPublishDate: boolean;
  showCmsPublishDate: boolean;
}

export default function InvestorSmartODRCMS() {
  const [pageContent, setPageContent] = useState<SmartOdrPage>({
    slug: 'smart-odr',
    title: 'Smart ODR',
    hasYearFilter: false,
    filterItems: [],
    sections: [{ title: 'Smart ODR', documents: [] }],
    isActive: true,
    showPublishDate: false,
    showCmsPublishDate: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingDocument, setEditingDocument] = useState<{
    document: SmartOdrDocument | null;
    index: number;
  } | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [isManualUrl, setIsManualUrl] = useState(true);

  useEffect(() => {
    loadPageContent();
  }, []);

  const loadPageContent = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await investorsCmsApi.getPageContentBySlug('smart-odr');

      if (data) {
        const sections = Array.isArray(data.sections) && data.sections.length > 0
          ? data.sections
          : [{ title: 'Smart ODR', documents: [] }];

        setPageContent({
          ...data,
          sections: sections.map((section: any) => ({
            title: section.title || 'Smart ODR',
            documents: (section.documents || []).map((doc: any) => ({
              title: doc.title || '',
              pdfUrl: doc.pdfUrl || doc.link || doc.url || '',
            })),
          })),
          hasYearFilter: false,
          filterItems: [],
          showPublishDate: false,
          showCmsPublishDate: false,
          isActive: data.isActive !== undefined ? data.isActive : true,
        });
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load Smart ODR page');
      }
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
        has_year_filter: false,
        filter_items: [],
        show_publish_date: false,
        show_cms_publish_date: false,
        is_active: pageContent.isActive,
      };

      let existingPage;
      try {
        existingPage = await investorsCmsApi.getPageContentBySlug('smart-odr');
      } catch (_e) {
        existingPage = null;
      }

      if (existingPage?.id) {
        await investorsCmsApi.updatePageContent(existingPage.id, saveData);
        setSuccess('Smart ODR page updated successfully');
      } else {
        await investorsCmsApi.createPageContent(saveData);
        setSuccess('Smart ODR page created successfully');
      }

      await loadPageContent();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save Smart ODR page');
    }
  };

  const handleAddDocument = () => {
    setEditingDocument({
      document: { title: '', pdfUrl: '' },
      index: -1,
    });
    setIsManualUrl(true);
    setError('');
  };

  const handleEditDocument = (index: number) => {
    const section = pageContent.sections[0];
    const document = section.documents[index];
    setEditingDocument({
      document: { ...document },
      index,
    });
    setIsManualUrl(true);
    setError('');
  };

  const handleDeleteDocument = (index: number) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    const updated = { ...pageContent };
    updated.sections[0].documents.splice(index, 1);
    setPageContent(updated);
  };

  const handleSaveDocument = () => {
    if (!editingDocument?.document) return;

    const doc = editingDocument.document;
    if (!doc.title.trim()) {
      setError('Document title is required');
      return;
    }
    if (!doc.pdfUrl.trim()) {
      setError('Document URL is required');
      return;
    }

    const updated = { ...pageContent };
    if (!updated.sections[0]) {
      updated.sections[0] = { title: 'Smart ODR', documents: [] };
    }

    if (editingDocument.index >= 0) {
      updated.sections[0].documents[editingDocument.index] = doc;
    } else {
      updated.sections[0].documents.push(doc);
    }

    setPageContent(updated);
    setEditingDocument(null);
    setError('');
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

      const response = await fetch(`${API_BASE_URL}/api/upload/pdf/smart-odr`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload PDF');
      }

      const data = await response.json();
      setEditingDocument({
        ...editingDocument,
        document: { ...editingDocument.document, pdfUrl: data.pdfUrl },
      });
      setSuccess('PDF uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload PDF');
    } finally {
      setUploadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading Smart ODR page...</p>
        </div>
      </div>
    );
  }

  const docs = pageContent.sections[0]?.documents || [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Smart ODR CMS</h2>
          <p className="text-sm text-gray-600 mt-1">Manage Smart ODR files and links</p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save All Changes
        </button>
      </div>

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

      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={pageContent.title}
              onChange={(e) => setPageContent({ ...pageContent, title: e.target.value })}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="smart-odr-isActive"
              checked={pageContent.isActive}
              onChange={(e) => setPageContent({ ...pageContent, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="smart-odr-isActive" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Documents ({docs.length})</h3>
        <button
          onClick={handleAddDocument}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Document
        </button>
      </div>

      {docs.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
          No Smart ODR documents added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map((doc, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{doc.title}</p>
                  <p className="text-sm text-gray-500 mt-1 truncate">{doc.pdfUrl}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditDocument(index)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingDocument?.document && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            {editingDocument.index >= 0 ? 'Edit Document' : 'Add New Document'}
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Title *</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={editingDocument.document.title}
                onChange={(e) =>
                  setEditingDocument({
                    ...editingDocument,
                    document: { ...editingDocument.document!, title: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Document URL *</label>
                <button
                  type="button"
                  onClick={() => setIsManualUrl(!isManualUrl)}
                  className={`px-3 py-1 text-xs rounded ${
                    isManualUrl ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {isManualUrl ? 'Manual URL' : 'Upload PDF'}
                </button>
              </div>

              {isManualUrl ? (
                <input
                  type="text"
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editingDocument.document.pdfUrl}
                  onChange={(e) =>
                    setEditingDocument({
                      ...editingDocument,
                      document: { ...editingDocument.document!, pdfUrl: e.target.value },
                    })
                  }
                  placeholder="https://... or /uploads/pdfs/..."
                />
              ) : (
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                    id="smartOdrPdfUpload"
                    disabled={uploadingPdf}
                  />
                  <label
                    htmlFor="smartOdrPdfUpload"
                    className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                      uploadingPdf
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {uploadingPdf ? 'Uploading...' : 'Upload PDF'}
                  </label>
                  {editingDocument.document.pdfUrl && (
                    <span className="text-sm text-gray-600 truncate max-w-md">
                      {editingDocument.document.pdfUrl}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveDocument}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Document
              </button>
              <button
                onClick={() => {
                  setEditingDocument(null);
                  setError('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

