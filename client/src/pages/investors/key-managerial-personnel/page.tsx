import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../home/components/Header';
import Footer from '../../home/components/Footer';
import ScrollToTop from '../../home/components/ScrollToTop';
import HeroSection from '../components/HeroSection';
import InvestorSidebar from '../components/InvestorSidebar';
import { investorsCmsApi } from '../../../services/api';

interface KeyPersonnel {
  id?: number;
  name: string;
  position?: string;
  company?: string;
  address?: string;
  address2?: string;
  address3?: string;
  phone?: string;
  email?: string;
  displayOrder: number;
  isActive: boolean;
}

// Fallback data
const fallbackPersonnel: KeyPersonnel[] = [
  {
    name: 'Mr. Anil Jain',
    position: 'Managing Director',
    company: 'Refex Industries Limited',
    phone: '+91-44 – 3504 0050',
    displayOrder: 0,
    isActive: true,
  },
  {
    name: 'Mr. Dinesh Kumar Agarwal',
    position: 'Whole-time Director & Chief Financial Officer',
    company: 'Refex Industries Limited',
    phone: '+91-44 – 3504 0050',
    displayOrder: 1,
    isActive: true,
  },
  {
    name: 'Mr. Ankit Poddar',
    position: 'Company Secretary / Compliance Officer',
    company: 'Refex Industries Limited,',
    address: '2nd Floor, No.313, Refex Towers, Sterling Road,',
    address2: 'Valluvar Kottam High Road, Nungambakkam,',
    address3: 'Chennai – 600034, Tamil Nadu.',
    phone: '+91-44 – 3504 0050',
    email: 'investor.relations@refex.co.in',
    displayOrder: 2,
    isActive: true,
  },
];

interface PageContent {
  id?: number;
  slug: string;
  title: string;
  isActive: boolean;
}

export default function KeyManagerialPersonnelPage() {
  const location = useLocation();
  const [pageContent, setPageContent] = useState<PageContent>({
    slug: 'key-managerial-personnel',
    title: 'Key Managerial Personnel',
    isActive: true,
  });
  const [personnel, setPersonnel] = useState<KeyPersonnel[]>(fallbackPersonnel);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadPageContent();
    loadPersonnel();
  }, []);

  const loadPageContent = async () => {
    try {
      const data = await investorsCmsApi.getPageContentBySlug('key-managerial-personnel');
      if (data && (data.isActive || (data as any).is_active)) {
        setPageContent({
          slug: data.slug || 'key-managerial-personnel',
          title: data.title || 'Key Managerial Personnel',
          isActive: true,
        });
      }
    } catch (err) {
      console.error('Failed to load page content:', err);
      // Use default values on error
    }
  };

  const loadPersonnel = async () => {
    try {
      setLoading(true);
      const data = await investorsCmsApi.getKeyPersonnel();
      // Filter only active personnel and sort by displayOrder
      const activePersonnel = (data || [])
        .filter((person: KeyPersonnel) => person.isActive)
        .sort((a: KeyPersonnel, b: KeyPersonnel) => (a.displayOrder || 0) - (b.displayOrder || 0));
      
      if (activePersonnel.length > 0) {
        setPersonnel(activePersonnel);
      } else {
        // Use fallback if no active personnel found
        setPersonnel(fallbackPersonnel);
      }
    } catch (err) {
      console.error('Failed to load key personnel:', err);
      // Use fallback data on error
      setPersonnel(fallbackPersonnel);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="site-page-light min-h-screen overflow-x-clip bg-white text-[#1f1f1f]" style={{ fontFamily: '"Open Sans", sans-serif' }}>
        <Header />
        <HeroSection title={pageContent.title} />
        <div className="py-14 sm:py-16 lg:py-20 bg-[#f3f7ef] border-y border-[#dfe9d8]">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7cd244]"></div>
              <p className="mt-2 text-gray-600">Loading key personnel...</p>
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
              <div className="overflow-hidden rounded-[1.35rem] border border-[#e3ebe0] bg-white shadow-[0_12px_40px_rgba(45,80,22,0.08)] p-8">
                <h2 className="text-3xl font-bold text-black mb-8">Key Managerial Personnel</h2>
                
                <div className="space-y-8">
                  {personnel.length > 0 ? (
                    personnel.map((person, index) => (
                      <div key={person.id || index} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{person.name}</h3>
                        {person.position && (
                          <p className="text-gray-600 mb-1">{person.position}</p>
                        )}
                        {person.company && (
                          <p className="text-gray-600 mb-3">{person.company}</p>
                        )}
                        {(person.address || person.address2 || person.address3) && (
                          <>
                            {person.address && (
                              <p className="text-gray-600">{person.address}</p>
                            )}
                            {person.address2 && (
                              <p className="text-gray-600">{person.address2}</p>
                            )}
                            {person.address3 && (
                              <p className="text-gray-600 mb-3">{person.address3}</p>
                            )}
                          </>
                        )}
                        {person.phone && (
                          <p className="text-gray-700">
                            Phone: <a href={`tel:${person.phone.replace(/[^0-9+]/g, '')}`} className="text-[#7cd244] hover:underline cursor-pointer">{person.phone}</a>
                          </p>
                        )}
                        {person.email && (
                          <p className="text-gray-700">
                            Email: <a href={`mailto:${person.email}`} className="text-[#7cd244] hover:underline cursor-pointer">{person.email}</a>
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No key personnel information available.
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
