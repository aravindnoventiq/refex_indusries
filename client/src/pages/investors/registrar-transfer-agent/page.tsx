import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';
import ScrollToTop from '../../home/components/ScrollToTop';
import HeroSection from '../components/HeroSection';
import InvestorSidebar from '../components/InvestorSidebar';
import { investorsCmsApi } from '../../../services/api';

interface Content {
  title: string;
  subtitle?: string;
  content: string;
}

interface PageContent {
  id?: number;
  slug: string;
  title: string;
  sections?: Array<{
    title: string;
    contents?: Content[];
  }>;
  isActive: boolean;
}

// Fallback data removed - page now relies entirely on API data

const defaultIconUrl = 'https://refex.co.in/wp-content/uploads/2025/02/corporate-icon.png';

export default function RegistrarTransferAgentPage() {
  const location = useLocation();
  const [pageContent, setPageContent] = useState<PageContent>({
    slug: 'registrar-transfer-agent',
    title: 'Registrar & Transfer Agent',
    sections: [],
    isActive: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.title = 'Registrar & Transfer Agent – Refex Industries Ltd.';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Registrar & Transfer Agent contact information for Refex Industries Ltd.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Registrar & Transfer Agent contact information for Refex Industries Ltd.';
      document.head.appendChild(meta);
    }

    loadPageContent();
  }, []);

  const loadPageContent = async () => {
    try {
      setLoading(true);
      const data = await investorsCmsApi.getPageContentBySlug('registrar-transfer-agent');
      if (data && data.isActive) {
        setPageContent(data);
      }
    } catch (err) {
      console.error('Failed to load Registrar Transfer Agent page:', err);
      // Keep empty state if API fails
      setPageContent({
        slug: 'registrar-transfer-agent',
        title: 'Registrar & Transfer Agent',
        sections: [],
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const parseContent = (content: string) => {
    const lines = content.split('\n');
    const addressLines: string[] = [];
    let phone = '';
    let email = '';

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.toLowerCase().startsWith('phone:')) {
        phone = trimmedLine.replace(/^phone:\s*/i, '').trim();
      } else if (trimmedLine.toLowerCase().startsWith('email:')) {
        email = trimmedLine.replace(/^email:\s*/i, '').trim();
      } else if (trimmedLine && !trimmedLine.toLowerCase().startsWith('phone') && !trimmedLine.toLowerCase().startsWith('email')) {
        addressLines.push(trimmedLine);
      }
    });

    return { addressLines, phone, email };
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
                <p className="mt-4 text-gray-600">Loading Registrar & Transfer Agent information...</p>
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
                  const contents = section.contents || [];
                  
                  // Don't render section if no contents available
                  if (contents.length === 0) return null;
                  
                  return (
                    <div key={sectionIndex} className="mb-8">
                      <h3 
                        className="font-semibold mb-4"
                        style={{ color: '#2d5016', fontSize: '20px' }}
                      >
                        {section.title}
                      </h3>
                      {contents.length > 0 ? (
                        <div>
                          {contents.map((contentItem, contentIndex) => {
                            const { addressLines, phone, email } = parseContent(contentItem.content);
                            return (
                              <div 
                                key={contentIndex} 
                                className="flex items-start gap-6"
                              >
                                <div className="flex-shrink-0">
                                  <img 
                                    src={defaultIconUrl}
                                    alt="Corporate Icon"
                                    className="w-16 h-16 object-contain"
                                  />
                                </div>
                                <div className="flex-1 text-left">
                                  <h5 className="text-xl font-bold text-gray-900 mb-4">
                                    {contentItem.title}
                                  </h5>
                                  <div className="text-gray-700 space-y-2">
                                    {addressLines.map((line, index) => (
                                      <p key={index}>{line}</p>
                                    ))}
                                    {phone && (
                                      <p className="mt-3">
                                        <strong className="font-semibold">Phone:</strong>{' '}
                                        <a 
                                          href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                                          className="text-[#2d5016] hover:text-[#1e5a8a] transition-colors"
                                        >
                                          {phone}
                                        </a>
                                      </p>
                                    )}
                                    {email && (
                                      <p>
                                        <strong className="font-semibold">Email:</strong>{' '}
                                        <a 
                                          href={`mailto:${email}`}
                                          className="text-[#2d5016] hover:text-[#1e5a8a] transition-colors"
                                        >
                                          {email}
                                        </a>
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="px-6 py-8 text-center text-gray-500">
                          No content available.
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
}
