import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';
import ScrollToTop from '../../home/components/ScrollToTop';
import HeroSection from '../components/HeroSection';
import InvestorSidebar from '../components/InvestorSidebar';
import { investorsCmsApi } from '../../../services/api';

interface Audio {
  name: string;
  year: string;
  audioUrl: string;
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
  hasYearFilter: boolean;
  filterItems?: string[];
  sections?: Array<{
    title: string;
    audios?: Audio[];
  }>;
  isActive: boolean;
}

// Fallback data removed - page now relies entirely on API data

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// Helper function to get full URL (for both PDFs and audio files)
const getFullUrl = (url: string): string => {
  if (!url) return '';
  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If it's a relative path (starts with /), prepend the API base URL
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`;
  }
  // Otherwise, assume it's a relative path without leading slash
  return `${API_BASE_URL}/${url}`;
};

const RecordingTranscriptsPage = () => {
  const location = useLocation();
  const [pageContent, setPageContent] = useState<PageContent>({
    slug: 'recording-transcripts-of-post-earnings-quarterly-calls',
    title: 'Recording & Transcripts of Post Earnings / Quarterly Calls',
    hasYearFilter: true,
    filterItems: [],
    sections: [],
    isActive: true,
  });
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPageContent();
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = async (pdfUrl: string, title: string) => {
    try {
      const filename = `${title.replace(/[^a-zA-Z0-9\s]/g, '')}.pdf`;
      const fullUrl = getFullUrl(pdfUrl);
      
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
      const fullUrl = getFullUrl(pdfUrl);
      window.open(fullUrl, '_blank');
    }
  };

  const loadPageContent = async () => {
    try {
      setLoading(true);
      const data = await investorsCmsApi.getPageContentBySlug('recording-transcripts-of-post-earnings-quarterly-calls');
      if (data && data.isActive) {
        // Handle both camelCase and snake_case from API response
        const filterItems = (data.filterItems || (data as any).filter_items || []);
        const pageData = {
          ...data,
          filterItems: filterItems,
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
      console.error('Failed to load recording transcripts page:', err);
      // Keep empty state if API fails
      setPageContent({
        slug: 'recording-transcripts-of-post-earnings-quarterly-calls',
        title: 'Recording & Transcripts of Post Earnings / Quarterly Calls',
        hasYearFilter: true,
        filterItems: [],
        sections: [],
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Get all available years from CMS filter items or extract from documents
  const getAllYears = (): string[] => {
    const filterItems = pageContent.filterItems || (pageContent as any).filter_items || [];
    if (filterItems && filterItems.length > 0) {
      return [...filterItems].sort().reverse();
    }
    if (!pageContent.sections || pageContent.sections.length === 0) return [];
    const years = pageContent.sections
      .flatMap((s) => (s.audios || []).map((a) => a.year))
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

  // Filter and sort audios by year and published date
  const getFilteredAudios = (audios: Audio[]): Audio[] => {
    let filtered = audios;
    
    // Filter by year if year filter is enabled
    if (pageContent.hasYearFilter) {
      filtered = audios.filter(audio => audio.year === selectedYear);
    }
    
    // Add original index to each audio for tracking (newer audios have higher indices)
    const audiosWithIndex = filtered.map((audio, index) => ({ ...audio, _originalIndex: index }));
    
    // Sort audios:
    // 1. Audios with publishedDate/date: sort by date descending (recent to old)
    // 2. Audios without publishedDate: sort by createdAt/created_at descending (recent to old)
    // 3. Audios without both dates: use original index (higher = newer = appears first)
    return audiosWithIndex.sort((a, b) => {
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
    }).map(({ _originalIndex, ...audio }) => audio); // Remove the temporary index field
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
                <p className="mt-4 text-gray-600">Loading recording transcripts...</p>
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
                pageContent.sections.map((section, sectionIndex) => {
                  const filteredAudios = getFilteredAudios(section.audios || []);
                  
                  // Don't render section if no audios available
                  if (filteredAudios.length === 0) return null;
                  
                  return (
                    <div key={sectionIndex} className="mb-8">
                      <h3 
                        className="font-semibold mb-4"
                        style={{ color: '#2d5016', fontSize: '20px' }}
                      >
                        {section.title}
                      </h3>
                      {filteredAudios.length > 0 ? (
  <div className="space-y-6">
    {filteredAudios.map((recording, audioIndex) => (
      <div
        key={audioIndex}
        className="flex flex-col gap-4 p-6  border border-gray-300 rounded-xl"
      >
        {/* Top Row */}
        <div className="flex items-start justify-between gap-4">
          
          {/* Left: Icon + Title + Audio */}
          <div className="flex gap-4">
            {/* Icon */}
            <img
              src="https://refex.co.in/wp-content/uploads/2024/12/invest-file.svg"
              alt="Document"
              className="w-10 h-10 mt-1"
            />

            {/* Content */}
            <div>
              <p className="text-[16px] text-[#484848] mb-3">
                {recording.name}
              </p>

              {/* Audio Player */}
              {recording.audioUrl && (
                <audio controls className="w-[320px] md:w-[380px]">
                  <source src={getFullUrl(recording.audioUrl)} type="audio/mpeg" />
                </audio>
              )}
            </div>
          </div>

          {/* Right: View / Download */}
          <div className="flex items-center gap-6 text-[16px] font-medium text-[#2d5016]">
            {recording.pdfUrl && (
              <a
                href={getFullUrl(recording.pdfUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                View
                <img
                  src="https://refex.co.in/wp-content/uploads/2025/01/visible.svg"
                  alt="View"
                  className="w-4 h-4"
                />
              </a>
            )}

            {recording.pdfUrl && (
              <button
                onClick={() =>
                  handleDownload(recording.pdfUrl, recording.name)
                }
                className="flex items-center gap-2"
              >
                Download
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 16l-4-4h3V8h2v4h3l-4 4zm-8 4h16v2H4v-2z"
                    fill="#2d5016"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="px-6 py-8 text-center text-gray-500">
    No recordings available for the selected year.
  </div>
)}

                    </div>
                  );
                })
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
};

export default RecordingTranscriptsPage;
