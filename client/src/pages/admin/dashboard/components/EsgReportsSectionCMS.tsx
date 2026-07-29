import { useState, useEffect } from 'react';
import { esgCmsApi } from '../../../../services/api';

const API_BASE_URL = "";

const getImageUrl = (url: string | undefined) => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
};

interface Report {
  id?: number;
  title: string;
  image: string;
  link: string;
  order: number;
  isActive: boolean;
}

interface ReportsSectionHeader {
  id?: number;
  title: string;
  isActive: boolean;
}

export default function EsgReportsSectionCMS() {
  const [header, setHeader] = useState<ReportsSectionHeader | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showHeaderForm, setShowHeaderForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingReport) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setEditingReport({ ...editingReport, image: data.imageUrl });
      setSuccess('Image uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingReport) return;

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

      const response = await fetch(`${API_BASE_URL}/api/upload/pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload PDF');
      }

      const data = await response.json();
      setEditingReport({ ...editingReport, link: data.pdfUrl });
      setSuccess('PDF uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload PDF');
    } finally {
      setUploadingPdf(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [headerData, reportsData] = await Promise.all([
        esgCmsApi.getReportsSection(),
        esgCmsApi.getReports(),
      ]);
      setHeader(headerData || null);
      setReports(reportsData || []);
    } catch (err: any) {
      // Only show error if it's not a server availability issue
      if (err.message && !err.message.includes('Backend server not available')) {
        setError(err.message || 'Failed to load reports section');
      }
      // Fallback to default data
      setHeader({
        title: 'REPORTS',
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddReport = () => {
    setEditingReport({
      title: '',
      image: '',
      link: '',
      order: reports.length,
      isActive: true,
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleEditReport = (report: Report) => {
    setEditingReport({ ...report });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteReport = async (id: number) => {
    if (!confirm('Are you sure you want to delete this report?')) {
      return;
    }
    try {
      await esgCmsApi.deleteReport(id);
      setSuccess('Report deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot delete: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to delete report');
      }
    }
  };

  const handleSaveReport = async () => {
    if (!editingReport) return;
    
    if (!editingReport.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!editingReport.image.trim()) {
      setError('Image URL is required');
      return;
    }
    if (!editingReport.link.trim()) {
      setError('Link is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      if (editingReport.id) {
        await esgCmsApi.updateReport(editingReport.id, editingReport);
        setSuccess('Report updated successfully');
      } else {
        await esgCmsApi.createReport(editingReport);
        setSuccess('Report created successfully');
      }
      
      setShowForm(false);
      setEditingReport(null);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save report');
      }
    }
  };

  const handleSaveHeader = async () => {
    if (!header) return;
    
    if (!header.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await esgCmsApi.saveReportsSection(header);
      setSuccess('Section header saved successfully');
      setShowHeaderForm(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot save: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to save section header');
      }
    }
  };

  const handleToggleActive = async (report: Report) => {
    try {
      await esgCmsApi.updateReport(report.id!, {
        ...report,
        isActive: !report.isActive,
      });
      loadData();
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot update: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to update report');
      }
    }
  };

  const handleOrderChange = async (report: Report, newOrder: number) => {
    try {
      await esgCmsApi.updateReport(report.id!, {
        ...report,
        order: newOrder,
      });
      loadData();
    } catch (err: any) {
      if (err.message && err.message.includes('Backend server not available')) {
        setError('Cannot update: Backend server is not running. Please start the server and try again.');
      } else {
        setError(err.message || 'Failed to update order');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading reports section...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reports Section</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowHeaderForm(!showHeaderForm)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <i className="ri-settings-3-line mr-2"></i>
            {showHeaderForm ? 'Hide' : 'Edit'} Header
          </button>
          <button
            onClick={handleAddReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-add-line mr-2"></i>
            Add Report
          </button>
        </div>
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

      {/* Section Header Form */}
      {showHeaderForm && header && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Section Header</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={header.title}
                onChange={(e) => setHeader({ ...header, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., REPORTS"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="headerIsActive"
                checked={header.isActive}
                onChange={(e) => setHeader({ ...header, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="headerIsActive" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSaveHeader}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Header
            </button>
            <button
              onClick={() => {
                setShowHeaderForm(false);
                loadData();
              }}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Report Form */}
      {showForm && editingReport && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingReport.id ? 'Edit Report' : 'Add Report'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={editingReport.title}
                onChange={(e) => setEditingReport({ ...editingReport, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Sustainability Report"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              <div className="flex items-center gap-4 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="reportImageUpload"
                  disabled={uploadingImage}
                />
                <label
                  htmlFor="reportImageUpload"
                  className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    uploadingImage
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </label>
                {editingReport.image && (
                  <span className="text-sm text-gray-600 truncate max-w-md">
                    {editingReport.image}
                  </span>
                )}
              </div>
              {editingReport.image && (
                <div className="mt-2">
                  <img 
                    src={getImageUrl(editingReport.image)} 
                    alt="Report Preview" 
                    className="w-32 h-32 object-cover rounded border border-gray-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report PDF *
              </label>
              <div className="flex items-center gap-4 mb-2">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                  id="reportPdfUpload"
                  disabled={uploadingPdf}
                />
                <label
                  htmlFor="reportPdfUpload"
                  className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    uploadingPdf
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {uploadingPdf ? 'Uploading...' : 'Upload PDF'}
                </label>
                {editingReport.link && (
                  <span className="text-sm text-gray-600 truncate max-w-md">
                    {editingReport.link}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                value={editingReport.order}
                onChange={(e) => setEditingReport({ ...editingReport, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={editingReport.isActive}
                onChange={(e) => setEditingReport({ ...editingReport, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSaveReport}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingReport(null);
                setError('');
              }}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Link
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No reports found. Click "Add Report" to create one.
                </td>
              </tr>
            ) : (
              reports
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {report.image ? (
                        <img 
                          src={getImageUrl(report.image)} 
                          alt={report.title}
                          className="w-20 h-20 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{report.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">{report.link}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={report.order}
                        onChange={(e) => handleOrderChange(report, parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(report)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          report.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {report.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditReport(report)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <i className="ri-edit-line"></i> Edit
                      </button>
                      <button
                        onClick={() => report.id && handleDeleteReport(report.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <i className="ri-delete-bin-line"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

