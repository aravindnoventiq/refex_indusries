import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';
import ScrollToTop from '../../home/components/ScrollToTop';
import HeroSection from '../components/HeroSection';
import InvestorSidebar from '../components/InvestorSidebar';
import { investorsCmsApi } from '../../../services/api';
import { isInvestorCmsActive } from '../../../utils/investorCmsHelpers';

interface Document {
  title: string;
  year: string;
  pdfUrl: string;
  thumbnail?: string;
  date?: string;
  publishedDate?: string;
  published_date?: string;
  createdAt?: string;
  created_at?: string;
}

interface Section {
  title: string;
  documents: Document[];
}

interface PageContent {
  id?: number;
  slug: string;
  title: string;
  showPublishDate: boolean;
  hasYearFilter: boolean;
  filterItems?: string[];
  sections: Section[];
  isActive: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// Helper function to get full PDF URL
const getPdfUrl = (pdfUrl: string): string => {
  if (!pdfUrl) return '';
  // If it's already a full URL, return as is
  if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
    return pdfUrl;
  }
  // If it's a relative path (starts with /), prepend the API base URL
  if (pdfUrl.startsWith('/')) {
    return `${API_BASE_URL}${pdfUrl}`;
  }
  // Otherwise, assume it's a relative path without leading slash
  return `${API_BASE_URL}/${pdfUrl}`;
};

// Helper function to get full image/thumbnail URL
const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  // If it's a relative path (starts with /), prepend the API base URL
  if (imageUrl.startsWith('/')) {
    return `${API_BASE_URL}${imageUrl}`;
  }
  // Otherwise, assume it's a relative path without leading slash
  return `${API_BASE_URL}/${imageUrl}`;
};

export default function AnnualReportsPage() {
  const location = useLocation();
  const [pageContent, setPageContent] = useState<PageContent>({
    slug: 'annual-reports',
    title: 'Annual Reports',
    showPublishDate: false,
    hasYearFilter: true,
    filterItems: [],
    sections: [],
    isActive: true,
  });
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadPageContent();
  }, []);

  const handleDownload = async (pdfUrl: string, title: string) => {
    try {
      const filename = `${title.replace(/[^a-zA-Z0-9\s]/g, '')}.pdf`;
      const fullPdfUrl = getPdfUrl(pdfUrl);

      // Check if it's a local upload (starts with API_BASE_URL/uploads)
      const isLocalUpload = pdfUrl.startsWith('/uploads') || fullPdfUrl.includes('/uploads/');

      if (isLocalUpload) {
        // For local uploads, fetch directly from the server
        const response = await fetch(fullPdfUrl);
        if (!response.ok) throw new Error('Download failed');

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        // For external URLs, use the download proxy
        const response = await fetch(`${API_BASE_URL}/api/download-proxy`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: fullPdfUrl, filename }),
        });

        if (!response.ok) throw new Error('Download failed');

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      console.error('Download failed:', error);
      window.open(getPdfUrl(pdfUrl), '_blank');
    }
  };

  const loadPageContent = async () => {
    try {
      setLoading(true);
      const data = await investorsCmsApi.getPageContentBySlug('annual-reports');
      if (isInvestorCmsActive(data)) {
        // Handle both camelCase and snake_case from API response
        const filterItems = (data.filterItems || (data as any).filter_items || []);
        const showPublishDate = data.showPublishDate !== undefined ? data.showPublishDate : (data as any).show_publish_date;
        const pageData = {
          ...data,
          filterItems: filterItems,
          showPublishDate: !!showPublishDate,
        };
        setPageContent(pageData);
        // Set default year to the most recent year if available
        if (data.hasYearFilter) {
          const availableYears = filterItems && filterItems.length > 0
            ? [...filterItems].sort().reverse()
            : (data.sections && data.sections.length > 0
              ? (data.sections as Section[])
                .flatMap((s: Section) => s.documents.map((d: Document) => d.year))
                .filter((year: string, index: number, self: string[]) => year && self.indexOf(year) === index)
                .sort()
                .reverse()
              : []);
          if (availableYears.length > 0) {
            setSelectedYear(availableYears[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load annual reports page:', err);
      // Use fallback data
      setPageContent({
        slug: 'annual-reports',
        title: 'Annual Reports',
        showPublishDate: false,
        hasYearFilter: true,
        filterItems: [],
        sections: [],
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse DD/MM/YYYY date format
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;

    // Try DD/MM/YYYY format first
    const ddmmyyyyMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmyyyyMatch) {
      const [, day, month, year] = ddmmyyyyMatch;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }

    // Try other common formats
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  // Filter and sort documents by year and published date
  const getFilteredDocuments = (documents: Document[]): Document[] => {
    let filtered = documents;

    // Filter by year if year filter is enabled
    if (pageContent.hasYearFilter && selectedYear) {
      filtered = documents.filter(doc => doc.year === selectedYear);
    }

    // Add original index to each document for tracking (newer documents have higher indices)
    const documentsWithIndex = filtered.map((doc, index) => ({ ...doc, _originalIndex: index }));

    // Sort documents:
    // 1. Documents with publishedDate/date: sort by date descending (recent to old)
    // 2. Documents without publishedDate: sort by createdAt/created_at descending (recent to old)
    // 3. Documents without both dates: use original index (higher = newer = appears first)
    return documentsWithIndex.sort((a, b) => {
      const aPublishedDate = a.publishedDate || a.published_date || a.date;
      const bPublishedDate = b.publishedDate || b.published_date || b.date;
      const aCreatedAt = a.createdAt || a.created_at;
      const bCreatedAt = b.createdAt || b.created_at;

      // If both have published dates, sort by published date (descending)
      if (aPublishedDate && bPublishedDate) {
        const aDate = parseDate(aPublishedDate);
        const bDate = parseDate(bPublishedDate);
        if (aDate && bDate) {
          return bDate.getTime() - aDate.getTime();
        }
      }

      // If only a has published date, it comes first
      if (aPublishedDate && !bPublishedDate) {
        return -1;
      }

      // If only b has published date, it comes first
      if (!aPublishedDate && bPublishedDate) {
        return 1;
      }

      // If neither has published date, sort by created date (descending)
      if (aCreatedAt && bCreatedAt) {
        const aDate = parseDate(aCreatedAt);
        const bDate = parseDate(bCreatedAt);
        if (aDate && bDate) {
          return bDate.getTime() - aDate.getTime();
        }
        return new Date(bCreatedAt).getTime() - new Date(aCreatedAt).getTime();
      }

      // If only a has created date, it comes first
      if (aCreatedAt && !bCreatedAt) {
        return -1;
      }

      // If only b has created date, it comes first
      if (!aCreatedAt && bCreatedAt) {
        return 1;
      }

      // If neither has dates, use original array index (higher index = newer = appears first)
      return (b._originalIndex || 0) - (a._originalIndex || 0);
    }).map(({ _originalIndex, ...doc }) => doc); // Remove the temporary index field
  };

  // Get all documents from all sections
  const allDocuments = pageContent.sections.flatMap(section => section.documents);

  // Filter documents by selected year
  const filteredDocuments = pageContent.hasYearFilter && selectedYear
    ? allDocuments.filter(doc => doc.year === selectedYear)
    : allDocuments;

  // Get filter options from CMS
  const yearOptions = pageContent.filterItems && pageContent.filterItems.length > 0
    ? pageContent.filterItems.map(year => ({
      value: year,
      label: `FY ${year}`
    }))
    : [];

  if (loading) {
    return (
      <div className="site-page-light min-h-screen overflow-x-clip bg-white text-[#1f1f1f]" style={{ fontFamily: '"Open Sans", sans-serif' }}>
        <Header />
        <HeroSection title={pageContent.title} />
        <div className="py-14 sm:py-16 lg:py-20 bg-[#f3f7ef] border-y border-[#dfe9d8]">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7cd244]"></div>
              <p className="mt-2 text-gray-600">Loading annual reports...</p>
            </div>
          </div>
        </div>
        <Footer />
        <ScrollToTop />
      </div>
    );
  }

  return (
    <div className="site-page-light min-h-screen overflow-x-clip bg-white text-[#1f1f1f]" style={{ fontFamily: '"Open Sans", sans-serif' }}>
      <Header />
      <HeroSection title={pageContent.title} />

      <section className="py-14 sm:py-16 lg:py-20 bg-[#f3f7ef] border-y border-[#dfe9d8]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar - Links */}
            <InvestorSidebar currentPath={location.pathname} />

            {/* Right Content */}
            <div className="lg:col-span-8">
              {/* Year Filter Dropdown */}
              {pageContent.hasYearFilter && yearOptions.length > 0 && (
                <div className="mb-6 flex justify-end">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#7cd244] cursor-pointer"
                  >
                    {yearOptions.map((year) => (
                      <option key={year.value} value={year.value}>
                        {year.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sections */}
              {pageContent.sections && pageContent.sections.length > 0 ? (
                pageContent.sections.map((section, sectionIndex) => {
                  // Filter and sort documents by selected year and published date
                  const sectionDocs = getFilteredDocuments(section.documents);

                  // Don't render section if no documents available
                  if (sectionDocs.length === 0) return null;

                  return (
                    <div key={sectionIndex} className="mb-8">
                      <h3
                        className="font-semibold mb-4"
                        style={{ color: '#2d5016', fontSize: '20px' }}
                      >
                        {section.title}
                      </h3>
                      {sectionDocs.length > 0 ? (
                        <div className="space-y-4">
                          {sectionDocs.map((report, index) => (
                            <div
                              key={index}
                              className="flex flex-col gap-4 p-4 bg-transparent rounded-xl border border-[#dfe7da] hover:border-[#4C8C2B]/35 hover:shadow-[0_8px_24px_rgba(45,80,22,0.08)] transition-colors"
                            >
                              {/* First Row: Icon, Title/Year, View/Download */}
                              <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                  <img
                                    src="https://refex.co.in/wp-content/uploads/2024/12/invest-file.svg"
                                    alt="File icon"
                                    className="w-12 h-12"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className="font-medium mb-1"
                                    style={{ color: '#484848', fontSize: '16px' }}
                                  >
                                    {report.title}
                                  </p>
                                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                                   
                                    {pageContent.showPublishDate && report.date && (
                                      <p style={{ color: '#666', fontSize: '14px' }}>
                                        Published: {report.date}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-6 flex-shrink-0">
                                  <a
                                    href={getPdfUrl(report.pdfUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap font-medium"
                                    style={{ color: '#2d5016', fontSize: '16px' }}
                                  >
                                    View
                                    <img
                                      src="https://refex.co.in/wp-content/uploads/2025/01/visible.svg"
                                      alt="View"
                                      style={{ width: '16px', height: '16px' }}
                                    />
                                  </a>
                                  <button
                                    onClick={() => handleDownload(report.pdfUrl, report.title)}
                                    className="flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap font-medium"
                                    style={{ color: '#2d5016', fontSize: '16px' }}
                                  >
                                    Download
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M12 16l-4-4h3V8h2v4h3l-4 4zm-8 4h16v2H4v-2z"
                                        fill="#2d5016"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              {/* Second Row: Thumbnail */}
                              {report.thumbnail && (
                                <div className="mt-2">
                                  <img
                                    src={getImageUrl(report.thumbnail)}
                                    alt="Thumbnail"
                                    className="w-48 h-auto rounded"
                                    onError={(e) => {
                                      // Hide image if it fails to load
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          {pageContent.hasYearFilter && selectedYear
                            ? `No annual reports available for the selected year.`
                            : 'No annual reports available.'}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                // Fallback: if no sections, show all documents in a single section
                <div className="mb-8">
                  <h3
                    className="font-semibold mb-4"
                    style={{ color: '#2d5016', fontSize: '20px' }}
                  >
                    {pageContent.title}
                  </h3>
                  {filteredDocuments.length > 0 ? (
                    <div className="space-y-4">
                      {filteredDocuments.map((report, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-4 p-4 bg-transparent rounded-xl border border-[#dfe7da] hover:border-[#4C8C2B]/35 hover:shadow-[0_8px_24px_rgba(45,80,22,0.08)] transition-colors"
                        >
                          {/* First Row: Icon, Title/Year, View/Download */}
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              <img
                                src="https://refex.co.in/wp-content/uploads/2024/12/invest-file.svg"
                                alt="File icon"
                                className="w-12 h-12"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className="font-medium mb-1"
                                style={{ color: '#484848', fontSize: '16px' }}
                              >
                                {report.title}
                              </p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1">
                                {report.year && (
                                  <p style={{ color: '#484848', fontSize: '16px' }}>
                                    Year: {report.year}
                                  </p>
                                )}
                                {pageContent.showPublishDate && report.date && (
                                  <p style={{ color: '#666', fontSize: '14px' }}>
                                    Published: {report.date}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-6 flex-shrink-0">
                              <a
                                href={getPdfUrl(report.pdfUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap font-medium"
                                style={{ color: '#2d5016', fontSize: '16px' }}
                              >
                                View
                                <img
                                  src="https://refex.co.in/wp-content/uploads/2025/01/visible.svg"
                                  alt="View"
                                  style={{ width: '16px', height: '16px' }}
                                />
                              </a>
                              <button
                                onClick={() => handleDownload(report.pdfUrl, report.title)}
                                className="flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap font-medium"
                                style={{ color: '#2d5016', fontSize: '16px' }}
                              >
                                Download
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12 16l-4-4h3V8h2v4h3l-4 4zm-8 4h16v2H4v-2z"
                                    fill="#2d5016"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                          {/* Second Row: Thumbnail */}
                          {report.thumbnail && (
                            <div className="mt-2">
                              <img
                                src={getImageUrl(report.thumbnail)}
                                alt="Thumbnail"
                                className="w-48 h-auto rounded"
                                onError={(e) => {
                                  // Hide image if it fails to load
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {pageContent.hasYearFilter && selectedYear
                        ? `No annual reports available for the selected year.`
                        : 'No annual reports available.'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
