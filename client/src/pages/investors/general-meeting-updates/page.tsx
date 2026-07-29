import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';
import ScrollToTop from '../../home/components/ScrollToTop';
import HeroSection from '../components/HeroSection';
import { investorsCmsApi } from '../../../services/api';
import { isInvestorCmsActive } from '../../../utils/investorCmsHelpers';
import { dedupeInvestorRelatedLinks } from '../../../utils/investorRelatedLinks';

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// Helper function to get the correct PDF URL
const getPdfUrl = (url: string): string => {
  if (!url) return '';
  // If it's already a full URL (http/https), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If it's a relative path (starts with /), prepend the API base URL
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
};

interface Document {
  title: string;
  year: string;
  link: string;
  pdfUrl?: string; // New standardized name
  date?: string; // New standardized name
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

const GeneralMeetingUpdatesPage = () => {
  const location = useLocation();
  const [pageContent, setPageContent] = useState<PageContent>({
    slug: 'general-meeting-updates',
    title: 'General Meeting Updates',
    showPublishDate: false,
    hasYearFilter: true,
    filterItems: [],
    sections: [],
    isActive: true,
  });
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarLinks, setSidebarLinks] = useState<Array<{ name: string; href: string }>>([]);

  useEffect(() => {
    loadPageContent();
    loadSidebarLinks();
  }, []);

  const handleDownload = async (pdfUrl: string, title: string) => {
    try {
      const filename = `${title.replace(/[^a-zA-Z0-9\s]/g, '')}.pdf`;
      const resolvedUrl = getPdfUrl(pdfUrl);

      // Check if it's a local file (from our server)
      if (resolvedUrl.startsWith(API_BASE_URL)) {
        // For local files, fetch directly
        const response = await fetch(resolvedUrl);
        if (!response.ok) {
          throw new Error('Download failed');
        }
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
        // Use backend proxy to download the file (avoids CORS)
        const response = await fetch(`${API_BASE_URL}/api/download-proxy`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: pdfUrl, filename }),
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

  const loadSidebarLinks = async () => {
    try {
      const allLinks: Array<{ name: string; href: string }> = [];

      // Load related links from CMS
      try {
        const linksData = await investorsCmsApi.getRelatedLinks();
        const activeLinks = (linksData || []).filter((link: any) => link.isActive);
        allLinks.push(...activeLinks.map((link: any) => ({ name: link.name, href: link.href })));
      } catch (err) {
        console.error('Failed to load related links:', err);
      }

      // Load pages from Investor Pages CMS
      try {
        const pagesData = await investorsCmsApi.getAllPageContent();
        const activePages = (pagesData || []).filter((page: any) => page.isActive);

        activePages.forEach((page: any) => {
          const pageHref = `/investors/${page.slug}/`;
          const linkExists = allLinks.some(link => link.href === pageHref || link.href.replace(/\/$/, '') === pageHref.replace(/\/$/, ''));

          if (!linkExists) {
            allLinks.push({ name: page.title, href: pageHref });
          }
        });
      } catch (err) {
        console.error('Failed to load investor pages:', err);
      }

      setSidebarLinks(dedupeInvestorRelatedLinks(allLinks));
    } catch (err) {
      console.error('Failed to load sidebar links:', err);
    }
  };

  const loadPageContent = async () => {
    try {
      setLoading(true);
      const data = await investorsCmsApi.getPageContentBySlug('general-meeting-updates');
      if (isInvestorCmsActive(data)) {
        // Handle both camelCase and snake_case from API response
        const filterItems = (data.filterItems || (data as any).filter_items || []);
        const showPublishDate = data.showPublishDate !== undefined ? data.showPublishDate : (data as any).show_publish_date;
        const pageData = {
          ...data,
          filterItems: filterItems,
          showPublishDate: showPublishDate !== undefined ? !!showPublishDate : false,
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
      console.error('Failed to load general meeting updates page:', err);
      // Use fallback data
      setPageContent({
        slug: 'general-meeting-updates',
        title: 'General Meeting Updates',
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

  const sortedSections = [...pageContent.sections].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
  );

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

  const filterDocuments = (docs: Document[]) => {
    let filtered = docs.filter(doc => doc.year === selectedYear);

    // Add original index to each document for tracking (newer documents have higher indices)
    const documentsWithIndex = filtered.map((doc, index) => ({ ...doc, _originalIndex: index }));

    // Sort documents:
    // 1. Documents with publishedDate: sort by publishedDate descending (recent to old)
    // 2. Documents without publishedDate: sort by createdAt/created_at descending (recent to old)
    // 3. Documents without both dates: use original index (higher = newer = appears first)
    return documentsWithIndex.sort((a, b) => {
    //  const aPublishedDate = a.date || a.publishedDate || a.published_date;
     // const bPublishedDate = b.date || b.publishedDate || b.published_date;
      const aCreatedAt = a.createdAt || a.created_at;
      const bCreatedAt = b.createdAt || b.created_at;

      // If both have published dates, sort by published date (descending)
      /*if (aPublishedDate && bPublishedDate) {
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

  const DocumentSection = ({ title, documents }: { title: string; documents: Document[] }) => {
    const filteredDocs = filterDocuments(documents);

    if (filteredDocs.length === 0) return null;

    return (
      <div className="mb-8">
        <h3
          className="font-semibold mb-4"
          style={{ color: '#2d5016', fontSize: '20px' }}
        >
          {title}
        </h3>
        <div className="space-y-4">
          {filteredDocs.map((doc, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-transparent rounded-xl border border-[#dfe7da] hover:border-[#4C8C2B]/35 hover:shadow-[0_8px_24px_rgba(45,80,22,0.08)] transition-colors"
            >
              <div className="flex-shrink-0">
                <img
                  src="https://refex.co.in/wp-content/uploads/2024/12/invest-file.svg"
                  alt="Document"
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
                {(pageContent.showPublishDate && (doc.date || doc.publishedDate)) && (
                  <p
                    style={{ color: '#484848', fontSize: '16px' }}
                  >
                    Published Date: <time>{doc.date || doc.publishedDate}</time>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-6 flex-shrink-0">
                <a
                  href={getPdfUrl(doc.pdfUrl || doc.link)}
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
                  onClick={() => handleDownload(doc.link, doc.title)}
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
    );
  };

  // Get all documents from all sections
  const allDocuments = pageContent.sections.flatMap(section => section.documents);

  // Get filter options from CMS
  const yearOptions = pageContent.filterItems && pageContent.filterItems.length > 0
    ? pageContent.filterItems
    : [];

  if (loading) {
    return (
      <div className="site-page-light min-h-screen overflow-x-clip bg-white text-[#1f1f1f]" style={{ fontFamily: '"Open Sans", sans-serif' }}>
        <Header />
        <HeroSection title="General Meeting Updates" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <p className="mt-2 text-gray-600">Loading general meeting updates...</p>
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
      <HeroSection title="General Meeting Updates" />

      <section className="py-14 sm:py-16 lg:py-20 bg-[#f3f7ef] border-y border-[#dfe9d8]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
              <div className="bg-white sticky top-24">
                <nav>
                  <ul>
                    {sidebarLinks.map((link, index) => {
                      const isActive = link.href.replace(/\/$/, '') === location.pathname.replace(/\/$/, '');
                      return (
                        <li key={index}>
                          <Link
                            to={link.href}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className={`block w-full min-w-0 px-4 py-3 text-base transition-colors cursor-pointer sm:px-6 ${
                              isActive
                                ? 'text-[#4C8C2B] font-medium'
                                : 'text-[#1f1f1f] hover:text-[#4C8C2B]'
                            }`}
                           // style={isActive ? { borderLeft: '3px solid #4C8C2B' } : {}}
                          >
                            {link.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              {pageContent.hasYearFilter && yearOptions.length > 0 && (
                <div className="flex justify-end mb-6">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        FY {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
              {sortedSections.map((section, index) => (
  <DocumentSection
    key={index}
    title={section.title}
    documents={section.documents}
  />
))}

                {selectedYear && filterDocuments(allDocuments).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-base">No documents available for FY {selectedYear}</p>
                  </div>
                )}
                {!selectedYear && allDocuments.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-base">No documents available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default GeneralMeetingUpdatesPage;
