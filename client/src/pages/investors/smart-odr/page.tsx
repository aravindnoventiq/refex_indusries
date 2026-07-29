import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';
import ScrollToTop from '../../home/components/ScrollToTop';
import HeroSection from '../components/HeroSection';
import InvestorSidebar from '../components/InvestorSidebar';
import { investorsCmsApi } from '../../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

type ItemType = 'pdf' | 'external';

interface SmartOdrItem {
  title: string;
  url: string;
  type: ItemType;
}

interface DocumentItem {
  title: string;
  link?: string;
  pdfUrl?: string;
  url?: string;
}

interface PageSection {
  title: string;
  documents: DocumentItem[];
}

interface SmartOdrPageContent {
  title: string;
  sections: PageSection[];
  isActive: boolean;
}

const SMART_ODR_ITEMS: SmartOdrItem[] = [
  {
    title: 'SEBI Circular on ODR',
    url: 'https://www.sebi.gov.in/legal/master-circulars/aug-2023/online-resolution-of-disputes-in-the-indian-securities-market_75220.html',
    type: 'external',
  },
  {
    title: 'Online Dispute Resolution',
    url: '/uploads/pdfs/Online-Resolution-Of-Disputes.pdf',
    type: 'pdf',
  },
  {
    title: 'Link to Smart ODR',
    url: 'https://smartodr.in/login',
    type: 'external',
  },
];

const getResourceUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}/${url}`;
};

export default function SmartOdrPage() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SmartOdrItem[]>(SMART_ODR_ITEMS);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadSmartOdrContent();
  }, []);

  const mapType = (url: string): ItemType => {
    const normalized = (url || '').toLowerCase();
    return normalized.includes('.pdf') ? 'pdf' : 'external';
  };

  const shouldShowDownload = (item: SmartOdrItem): boolean => {
    const title = (item.title || '').toLowerCase();
    const url = (item.url || '').toLowerCase();
    return !title.includes('link to smart odr') && !url.includes('smartodr.in/login');
  };

  const isSmartOdrLoginLink = (item: SmartOdrItem): boolean => {
    const title = (item.title || '').toLowerCase();
    const url = (item.url || '').toLowerCase();
    return title.includes('link to smart odr') || url.includes('smartodr.in/login');
  };

  const resolveDocumentUrl = (doc: any): string => {
    return (
      doc?.pdfUrl ||
      doc?.pdf_url ||
      doc?.link ||
      doc?.url ||
      doc?.href ||
      doc?.fileUrl ||
      doc?.file_url ||
      ''
    );
  };

  const loadSmartOdrContent = async () => {
    try {
      setLoading(true);
      const data: SmartOdrPageContent | any = await investorsCmsApi.getPageContentBySlug('smart-odr');

      if (!data || data.isActive === false) {
        return;
      }

      const sections: PageSection[] = Array.isArray(data.sections)
        ? data.sections
        : Array.isArray(data.section_items)
          ? data.section_items
          : [];

      const sectionDocuments: SmartOdrItem[] = sections.flatMap((section: any) =>
        (section.documents || [])
          .map((doc) => {
            const url = resolveDocumentUrl(doc);
            if (!url) return null;
            return {
              title: doc.title || 'Untitled',
              url,
              type: mapType(url),
            };
          })
          .filter(Boolean) as SmartOdrItem[]
      );

      const topLevelDocuments: SmartOdrItem[] = (Array.isArray(data.documents) ? data.documents : [])
        .map((doc: any) => {
          const url = resolveDocumentUrl(doc);
          if (!url) return null;
          return {
            title: doc.title || 'Untitled',
            url,
            type: mapType(url),
          };
        })
        .filter(Boolean) as SmartOdrItem[];

      const mappedItems = [...sectionDocuments, ...topLevelDocuments];

      if (mappedItems.length > 0) {
        setItems(mappedItems);
      }
    } catch (error) {
      console.error('Failed to load smart ODR page content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (url: string) => {
    window.open(getResourceUrl(url), '_blank', 'noopener,noreferrer');
  };

  const handleDownload = async (url: string, title: string) => {
    try {
      const filename = `${title.replace(/[^a-zA-Z0-9\s]/g, '')}.pdf`;
      const fullUrl = getResourceUrl(url);
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
    } catch {
      window.open(getResourceUrl(url), '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="site-page-light min-h-screen overflow-x-clip bg-white text-[#1f1f1f]" style={{ fontFamily: '"Open Sans", sans-serif' }}>
      <Header />
      <HeroSection title="Smart ODR" />

      <section className="py-14 sm:py-16 lg:py-20 bg-[#f3f7ef] border-y border-[#dfe9d8]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <InvestorSidebar currentPath={location.pathname} />

            <div className="lg:col-span-9">
              <div className="mb-8">
                <h3
                  className="font-semibold mb-4"
                  style={{ color: '#2d5016', fontSize: '20px' }}
                >
                  Smart ODR
                </h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    isSmartOdrLoginLink(item) ? (
                      <div key={item.title} className="flex justify-center py-2">
                        <button
                          type="button"
                          onClick={() => handleView(item.url)}
                          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold bg-[#4C8C2B] text-white hover:bg-[#234015] transition-colors cursor-pointer whitespace-nowrap"
                          style={{ fontSize: '16px' }}
                        >
                          Link to Smart ODR
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7 17L17 7M17 7H9M17 7V15"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div
                        key={item.title}
                        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#dfe7da] hover:border-[#4C8C2B]/35 hover:shadow-[0_8px_24px_rgba(45,80,22,0.08)] transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <img
                            src="https://refex.co.in/wp-content/uploads/2024/12/invest-file.svg"
                            alt=""
                            className="w-12 h-12"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-medium mb-1"
                            style={{ color: '#484848', fontSize: '16px' }}
                          >
                            {item.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-6 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleView(item.url)}
                            className="flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap font-medium"
                            style={{ color: '#2d5016', fontSize: '16px' }}
                          >
                            View
                            <img
                              src="https://refex.co.in/wp-content/uploads/2025/01/visible.svg"
                              alt=""
                              style={{ width: '16px', height: '16px' }}
                            />
                          </button>
                          {shouldShowDownload(item) ? (
                            <button
                              type="button"
                              onClick={() => handleDownload(item.url, item.title)}
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
                          ) : null}
                        </div>
                      </div>
                    )
                  ))}
                  {!loading && items.length === 0 && (
                    <div className="p-6 bg-white rounded-xl border border-[#dfe7da] text-center text-gray-500">
                      No Smart ODR documents available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
