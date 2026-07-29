import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';
import ScrollToTop from '../../home/components/ScrollToTop';
import HeroSection from '../components/HeroSection';
import InvestorSidebar from '../components/InvestorSidebar';
import { investorsCmsApi } from '../../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const getPdfUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}/${url}`;
};

interface Document {
  title: string;
  year: string;
  pdfUrl: string;
  date?: string;
  publishedDate?: string;
  published_date?: string;
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

const FinancialStatementOfSubsidiaryPage = () => {
  const location = useLocation();
  const [pageContent, setPageContent] = useState<PageContent>({
    slug: 'financial-statement-of-subsidiary',
    title: 'Financial Statement of Subsidiary',
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
    document.title = 'Financial Statement of Subsidiary - Refex Industries';
    loadPageContent();
  }, []);

  const getAllYears = (): string[] => {
    const filterItems = pageContent.filterItems || (pageContent as any).filter_items || [];
    if (filterItems && filterItems.length > 0) {
      return [...filterItems].sort().reverse();
    }
    return [];
  };

  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const ddmmyyyyMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmyyyyMatch) {
      const [, day, month, year] = ddmmyyyyMatch;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const getFilteredDocuments = (documents: Document[]): Document[] => {
    let filtered = documents;
    if (pageContent.hasYearFilter && selectedYear) {
      filtered = documents.filter(doc => doc.year === selectedYear);
    }

    return [...filtered].sort((a, b) => {
      const aDate = parseDate(a.publishedDate || a.published_date || a.date || a.createdAt || a.created_at || '');
      const bDate = parseDate(b.publishedDate || b.published_date || b.date || b.createdAt || b.created_at || '');
      if (aDate && bDate) return bDate.getTime() - aDate.getTime();
      return 0;
    });
  };

  const loadPageContent = async () => {
    try {
      setLoading(true);
      const data = await investorsCmsApi.getPageContentBySlug('financial-statement-of-subsidiary');
      if (data) {
        const filterItems = data.filterItems || data.filter_items || [];
        setPageContent({
          ...data,
          filterItems,
          showPublishDate: !!(data.showPublishDate || data.show_publish_date),
          isActive: data.isActive !== undefined ? !!data.isActive : (data.is_active !== undefined ? !!data.is_active : true),
        });
        if (data.hasYearFilter && filterItems.length > 0) {
          const sorted = [...filterItems].sort().reverse();
          setSelectedYear(sorted[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load Financial Statement of Subsidiary page:', err);
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
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7cd244]"></div>
          </div>
        </section>
        <Footer />
        <ScrollToTop />
      </div>
    );
  }

  if (!pageContent.isActive) return null;

  const availableYears = getAllYears();

  return (
    <div className="site-page-light min-h-screen overflow-x-clip bg-white text-[#1f1f1f]" style={{ fontFamily: '"Open Sans", sans-serif' }}>
      <Header />
      <HeroSection title={pageContent.title} />

      <section className="py-14 sm:py-16 lg:py-20 bg-[#f3f7ef] border-y border-[#dfe9d8]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <InvestorSidebar currentPath={location.pathname} />

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

              {/* Sections (Subsidiaries) */}
              {pageContent.sections?.map((section, sIndex) => {
                const filteredDocs = getFilteredDocuments(section.documents || []);
                if (filteredDocs.length === 0) return null;

                return (
                  <div key={sIndex} className="mb-8">
                    <h3
                      className="font-semibold mb-4"
                      style={{ color: '#2d5016', fontSize: '20px' }}
                    >
                      {section.title}
                    </h3>
                    <div className="space-y-4">
                      {filteredDocs.map((doc, dIndex) => (
                        <div key={dIndex} className="flex items-center gap-4 p-4 bg-transparent rounded-xl border border-[#dfe7da] hover:border-[#4C8C2B]/35 hover:shadow-[0_8px_24px_rgba(45,80,22,0.08)] transition-colors">
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
                            {pageContent.showPublishDate && (
                              <p style={{ color: '#484848', fontSize: '16px' }}>
                                Published Date: <time>
                                  {doc.publishedDate || doc.published_date || doc.date || (doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-GB') : (doc.created_at ? new Date(doc.created_at).toLocaleDateString('en-GB') : ''))}
                                </time>
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-6 flex-shrink-0">
                            <a
                              href={getPdfUrl(doc.pdfUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap font-medium"
                              style={{ color: '#2d5016', fontSize: '16px' }}
                            >
                              View <img src="https://refex.co.in/wp-content/uploads/2025/01/visible.svg" alt="View" style={{ width: '16px', height: '16px' }} />
                            </a>
                            <a
                              href={getPdfUrl(doc.pdfUrl)}
                              download={`${doc.title.replace(/[^a-zA-Z0-9\s]/g, '')}.pdf`}
                              className="flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap font-medium"
                              style={{ color: '#2d5016', fontSize: '16px' }}
                            >
                              Download
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 16l-4-4h3V8h2v4h3l-4 4zm-8 4h16v2H4v-2z" fill="#2d5016" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {(!pageContent.sections || pageContent.sections.length === 0) && (
                <div className="bg-white p-8 text-center text-gray-500">
                  <p>No financial statements available for this period.</p>
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
};

export default FinancialStatementOfSubsidiaryPage;
