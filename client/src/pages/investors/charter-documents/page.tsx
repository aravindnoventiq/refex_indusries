import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';
import ScrollToTop from '../../home/components/ScrollToTop';
import HeroSection from '../components/HeroSection';
import InvestorSidebar from '../components/InvestorSidebar';
import { investorsCmsApi } from '../../../services/api';

interface Document {
  title: string;
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
  if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
    return pdfUrl;
  }
  if (pdfUrl.startsWith('/')) {
    return `${API_BASE_URL}${pdfUrl}`;
  }
  return `${API_BASE_URL}/${pdfUrl}`;
};

export default function CharterDocumentsPage() {
  const location = useLocation();
  const [pageContent, setPageContent] = useState<PageContent>({
    slug: 'charter-documents',
    title: 'Charter Documents',
    sections: [],
    showPublishDate: false,
    isActive: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.title = 'Charter Documents – Refex Industries Ltd.';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Charter Documents for Refex Industries Limited');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Charter Documents for Refex Industries Limited';
      document.head.appendChild(meta);
    }

    loadPageContent();
  }, []);

  const loadPageContent = async () => {
    try {
      setLoading(true);
      const data = await investorsCmsApi.getPageContentBySlug('charter-documents');
      if (data && data.isActive) {
        setPageContent({
          ...data,
          showPublishDate: !!(data.showPublishDate || (data as any).show_publish_date),
        });
      }
    } catch (err) {
      console.error('Failed to load Charter Documents page:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (pdfUrl: string, title: string) => {
    try {
      const filename = `${title.replace(/[^a-zA-Z0-9\s]/g, '')}.pdf`;
      const fullPdfUrl = getPdfUrl(pdfUrl);
      
      // Check if it's a local upload
      const isLocalUpload = pdfUrl.startsWith('/uploads') || fullPdfUrl.includes('/uploads/');
      
      if (isLocalUpload) {
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

  // Sort documents by published date or created date
  const sortDocuments = (documents: Document[]): Document[] => {
    const documentsWithIndex = documents.map((doc, index) => ({ ...doc, _originalIndex: index }));
    
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
    }).map(({ _originalIndex, ...doc }) => doc);
  };

  const sections = pageContent.sections || [];

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
                <p className="mt-4 text-gray-600">Loading Charter Documents information...</p>
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
              {/* Sections */}
              {sections && sections.length > 0 ? (
                sections.map((section, sectionIndex) => {
                  const docs = sortDocuments(section.documents || []);
                  
                  // Don't render section if no documents available
                  if (docs.length === 0) return null;
                  
                  return (
                    <div key={sectionIndex} className="mb-8">
                      {docs.length > 0 && (
                        <h3 
                          className="font-semibold mb-4"
                          style={{ color: '#2d5016', fontSize: '20px' }}
                        >
                          {section.title}
                        </h3>
                      )}
                      {docs.length > 0 ? (
                        <div className="space-y-4">
                          {docs.map((doc, docIndex) => (
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
                                {pageContent.showPublishDate && (doc.date || doc.publishedDate || doc.published_date) && (
                                  <p 
                                    style={{ color: '#484848', fontSize: '16px' }}
                                  >
                                    Published Date: <time>{doc.date || doc.publishedDate || doc.published_date}</time>
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
                                  View
                                  <img 
                                    src="https://refex.co.in/wp-content/uploads/2025/01/visible.svg" 
                                    alt="View" 
                                    style={{ width: '16px', height: '16px' }}
                                  />
                                </a>
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
                      ) : (
                        <div className="px-6 py-8 text-center text-gray-500">
                          No documents available.
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="bg-white p-8 text-center text-gray-500">
                  No charter documents available.
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
