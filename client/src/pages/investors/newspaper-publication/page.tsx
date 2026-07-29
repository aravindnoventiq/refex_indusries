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
  publishedDate?: string;
  published_date?: string;
  pdfUrl: string;
  year: string;
  createdAt?: string;
  created_at?: string;
}

interface PageContent {
  id?: number;
  slug: string;
  title: string;
  hasYearFilter?: boolean;
  filterItems?: string[];
  sections?: Array<{
    title: string;
    documents: Document[];
  }>;
  showPublishDate: boolean;
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

export default function NewspaperPublicationPage() {
  const location = useLocation();
  const [pageContent, setPageContent] = useState<PageContent>({
    slug: 'newspaper-publication',
    title: 'Newspaper Publication',
    hasYearFilter: true,
    filterItems: [],
    sections: [],
    showPublishDate: false,
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.title = 'Newspaper Publication – Refex Industries Ltd.';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Newspaper Publications for Refex Industries Limited');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Newspaper Publications for Refex Industries Limited';
      document.head.appendChild(meta);
    }

    loadPageContent();
  }, []);

  // Get all available years from CMS filter items or extract from documents
  const getAllYears = (): string[] => {
    const filterItems = pageContent.filterItems || (pageContent as any).filter_items || [];
    if (filterItems && filterItems.length > 0) {
      return [...filterItems].sort().reverse();
    }
    if (!pageContent.sections || pageContent.sections.length === 0) return [];
    const years = pageContent.sections
      .flatMap((s) => s.documents.map((d) => d.year))
      .filter((year: string, index: number, self: string[]) => year && self.indexOf(year) === index)
      .sort()
      .reverse();
    return years;
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

  // Filter documents by year and sort by published date or created date
  const getFilteredDocuments = (documents: Document[]): Document[] => {
    let filtered = documents;
    
    // Filter by year if year filter is enabled
    if (pageContent.hasYearFilter) {
      filtered = documents.filter(doc => doc.year === selectedYear);
    }
    
    // Add original index to each document for tracking (newer documents have higher indices)
    const documentsWithIndex = filtered.map((doc, index) => ({ ...doc, _originalIndex: index }));
    
    // Sort documents:
    // 1. Documents with publishedDate: sort by publishedDate descending (recent to old)
    // 2. Documents without publishedDate: sort by createdAt/created_at descending (recent to old)
    // 3. Documents without both dates: use original index (higher = newer = appears first)
    return documentsWithIndex.sort((a, b) => {
    //  const aPublishedDate = a.publishedDate || a.published_date;
    //  const bPublishedDate = b.publishedDate || b.published_date;
      const aCreatedAt = a.createdAt || a.created_at;
      const bCreatedAt = b.createdAt || b.created_at;
      
      // If both have published dates, sort by published date (descending)
     /* if (aPublishedDate && bPublishedDate) {
        const aDate = parseDate(aPublishedDate);
        const bDate = parseDate(bPublishedDate);
        if (aDate && bDate) {
          return bDate.getTime() - aDate.getTime();
        }
        // If parsing fails, fall through to next comparison
      }
      
      // If only a has published date, it comes first
      if (aPublishedDate && !bPublishedDate) {
        return -1;
      }
      
      // If only b has published date, it comes first
      if (!aPublishedDate && bPublishedDate) {
        return 1;
      }*/
      
      // If neither has published date, sort by created date (descending)
      if (aCreatedAt && bCreatedAt) {
        const aDate = parseDate(aCreatedAt);
        const bDate = parseDate(bCreatedAt);
        if (aDate && bDate) {
          return bDate.getTime() - aDate.getTime();
        }
        // If parsing fails, try standard Date parsing
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

  const handleView = (pdfUrl: string) => {
    const fullUrl = getPdfUrl(pdfUrl);
    window.open(fullUrl, '_blank');
  };

  const handleDownload = async (pdfUrl: string, title: string) => {
    try {
      const filename = `${title.replace(/[^a-zA-Z0-9\s]/g, '')}.pdf`;
      const fullUrl = getPdfUrl(pdfUrl);
      
      const response = await fetch(`${API_BASE_URL}/api/download-proxy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fullUrl, filename }),
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
    } catch (error) {
      console.error('Download failed:', error);
      const fullUrl = getPdfUrl(pdfUrl);
      window.open(fullUrl, '_blank');
    }
  };

  const loadPageContent = async () => {
    try {
      setLoading(true);
      const data = await investorsCmsApi.getPageContentBySlug('newspaper-publication');
      if (isInvestorCmsActive(data)) {
        const filterItems = (data.filterItems || (data as any).filter_items || []);
        const pageData = {
          ...data,
          filterItems: filterItems,
          showPublishDate: !!(data.showPublishDate || (data as any).show_publish_date),
        };
        setPageContent(pageData);
        // Set default year to the most recent year if available
        if (data.hasYearFilter) {
          const availableYears = filterItems && filterItems.length > 0
            ? [...filterItems].sort().reverse()
            : [];
          if (availableYears.length > 0) {
            setSelectedYear(availableYears[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load Newspaper Publication page:', err);
      // Keep empty state if API fails
      setPageContent({
        slug: 'newspaper-publication',
        title: 'Newspaper Publication',
        hasYearFilter: true,
        filterItems: [],
        sections: [],
        showPublishDate:false,
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="site-page-light min-h-screen overflow-x-clip bg-white text-[#1f1f1f]" style={{ fontFamily: '"Open Sans", sans-serif' }}>
        <Header />
        <HeroSection title={pageContent.title} />
        <section className="py-14 sm:py-16 lg:py-20 bg-[#f3f7ef] border-y border-[#dfe9d8]">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#7cd244]"></div>
                <p className="mt-4 text-gray-600">Loading Newspaper Publication information...</p>
              </div>
            </div>
          </div>
        </section>
        <Footer />
        <ScrollToTop />
      </div>
    );
  }

  if (!pageContent.isActive) {
    return null;
  }

  const availableYears = getAllYears();

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
            <div className="lg:col-span-9">
              {/* Year Filter */}
              {pageContent.hasYearFilter && availableYears.length > 0 && (
                <div className="mb-6 flex justify-end">
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-2 border border-gray-300 bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7cd244]"
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>FY {year}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sections */}
              {pageContent.sections && pageContent.sections.length > 0 ? (
                (() => {
                  // Filter sections to only show those with documents after year filtering
                  const sectionsWithDocuments = pageContent.sections
                    .map((section) => {
                      const filteredDocs = getFilteredDocuments(section.documents || []);
                      return {
                        ...section,
                        filteredDocs,
                      };
                    })
                    .filter((section) => section.filteredDocs.length > 0)
                    .sort((a, b) =>
                      a.title.localeCompare(b.title, undefined, {
                        sensitivity: 'base', // case-insensitive
                        numeric: true
                      })
                    );

                  if (sectionsWithDocuments.length === 0) {
                    return (
                      <div className="px-6 py-8 text-center text-gray-500">
                        No documents available for the selected year.
                      </div>
                    );
                  }

                  return sectionsWithDocuments.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-8">
                      <h3 
                        className="font-semibold mb-4"
                        style={{ color: '#2d5016', fontSize: '20px' }}
                      >
                        {section.title}
                      </h3>
                      <div className="space-y-4">
                        {section.filteredDocs.map((doc, docIndex) => (
                          <div 
                            key={docIndex} 
                            className="flex items-center gap-4 p-4 bg-transparent rounded-xl border border-[#dfe7da] hover:border-[#4C8C2B]/35 hover:shadow-[0_8px_24px_rgba(45,80,22,0.08)] transition-colors"
                          >
                            <div className="flex-shrink-0">
                              <img 
                                src="https://refex.co.in/wp-content/uploads/2024/12/invest-file.svg" 
                                alt="PDF" 
                                className="w-12 h-12"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p 
                                className="font-medium mb-1"
                                style={{ color: '#484848', fontSize: '16px' }}
                              >
                                {doc.title}
                              </p>
                              {pageContent.showPublishDate && (doc.publishedDate || doc.published_date) && (
                                <p 
                                  style={{ color: '#484848', fontSize: '16px' }}
                                >
                                  Published Date: <time>{doc.publishedDate || doc.published_date}</time>
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-6 flex-shrink-0">
                              <button 
                                onClick={() => handleView(doc.pdfUrl)}
                                className="flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap font-medium"
                                style={{ color: '#2d5016', fontSize: '16px' }}
                              >
                                View
                                <img 
                                  src="https://refex.co.in/wp-content/uploads/2025/01/visible.svg" 
                                  alt="View" 
                                  style={{ width: '16px', height: '16px' }}
                                />
                              </button>
                              <button 
                                onClick={() => handleDownload(doc.pdfUrl, doc.title)}
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
                        ))}
                      </div>
                    </div>
                  ));
                })()
              ) : (
                <div className="bg-white p-8 text-center text-gray-500">
                  No sections available.
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
