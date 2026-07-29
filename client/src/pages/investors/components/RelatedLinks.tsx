import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { investorsCmsApi } from '../../../services/api';
import { dedupeInvestorRelatedLinks } from '../../../utils/investorRelatedLinks';
import { getFallbackInvestorNavLinks } from '../../../utils/investorNavLinks';
import {
  investorCardClass,
  investorContainer,
  investorInactiveNavClass,
  investorSectionSageClass,
  investorSpinnerClass,
} from '../investorLayout';

interface RelatedLink {
  id?: number;
  name: string;
  href: string;
  displayOrder: number;
  isActive: boolean;
}

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
const fallbackLinks = getFallbackInvestorNavLinks();

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

export default function RelatedLinks() {
  const [sectionTitle, setSectionTitle] = useState('Related Links');
  const [investorLinks, setInvestorLinks] = useState<RelatedLink[]>([]);
  const [keyPersonnel, setKeyPersonnel] = useState<KeyPersonnel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load section settings
      try {
        const sectionData = await investorsCmsApi.getRelatedLinksSection();
        if (sectionData && sectionData.isActive) {
          setSectionTitle(sectionData.title || 'Related Links');
        }
      } catch (err) {
        console.error('Failed to load section settings:', err);
      }

      // Load links
      try {
        const allLinks: RelatedLink[] = [];
        
        // Load related links from CMS
        try {
          const linksData = await investorsCmsApi.getRelatedLinks();
          const activeLinks = (linksData || []).filter((link: RelatedLink) => link.isActive);
          allLinks.push(...activeLinks);
        } catch (err) {
          console.error('Failed to load related links:', err);
        }
        
        // Load pages from Investor Pages CMS and add them as links if not already present
        try {
          const pagesData = await investorsCmsApi.getAllPageContent();
          const activePages = (pagesData || []).filter((page: any) => page.isActive);
          
          activePages.forEach((page: any) => {
            const pageHref = `/investors/${page.slug}/`;
            // Check if link already exists
            const linkExists = allLinks.some(link => {
              const linkHref = link.href.replace(/\/$/, '');
              const pageHrefNormalized = pageHref.replace(/\/$/, '');
              return linkHref === pageHrefNormalized;
            });
            
            if (!linkExists) {
              allLinks.push({
                name: page.title,
                href: pageHref,
                displayOrder: allLinks.length,
                isActive: true,
              });
            }
          });
        } catch (err) {
          console.error('Failed to load investor pages:', err);
        }

        const merged = dedupeInvestorRelatedLinks(allLinks);
        setInvestorLinks(merged.length > 0 ? merged : dedupeInvestorRelatedLinks(fallbackLinks));
      } catch (err) {
        console.error('Failed to load links:', err);
        setInvestorLinks(dedupeInvestorRelatedLinks(fallbackLinks));
      }

      // Load personnel
      try {
        const personnelData = await investorsCmsApi.getKeyPersonnel();
        const activePersonnel = (personnelData || []).filter((person: KeyPersonnel) => person.isActive);
        setKeyPersonnel(activePersonnel.length > 0 ? activePersonnel : fallbackPersonnel);
      } catch (err) {
        console.error('Failed to load personnel:', err);
        setKeyPersonnel(fallbackPersonnel);
      }
    } catch (err) {
      console.error('Failed to load related links data:', err);
      setInvestorLinks(dedupeInvestorRelatedLinks(fallbackLinks));
      setKeyPersonnel(fallbackPersonnel);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <section className={investorSectionSageClass} id="investor-compliance">
        <div className={investorContainer}>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className={investorSpinnerClass} aria-hidden />
              <p className="mt-4 text-[#5a5a5a]">Loading related links...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Sort links and personnel by displayOrder
  const sortedLinks = [...investorLinks].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  const sortedPersonnel = [...keyPersonnel].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <section className={investorSectionSageClass} id="investor-compliance">
      <div className={investorContainer}>
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4C8C2B]">
            Investor Centre
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-[#1f1f1f] sm:text-4xl">
            {sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Sidebar - Links */}
          <div className="lg:col-span-4">
            <div className={`${investorCardClass} p-4 sm:p-6`}>
              <nav className="divide-y divide-[#eef2ea]">
                {sortedLinks.map((link, index) => {
                  const hrefPath = link.href.replace(/\/investors\//, '').replace(/\/$/, '');
                  const linkPath = hrefPath ? `/investors/${hrefPath}` : link.href;

                  return (
                    <Link
                      key={link.id || index}
                      to={linkPath}
                      className={`block px-3 py-3 text-base ${investorInactiveNavClass}`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right Content - Key Personnel */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-6">
              {sortedPersonnel.map((person, index) => (
                <div key={person.id || index} className={`${investorCardClass} p-6 sm:p-8`}>
                  <div className="text-left">
                    <h3 className="mb-2 text-xl font-semibold text-[#1f1f1f]">{person.name}</h3>
                    {person.position && <p className="mb-1 text-[#5a5a5a]">{person.position}</p>}
                    {person.company && <p className="mb-3 text-[#5a5a5a]">{person.company}</p>}
                    {(person.address || person.address2 || person.address3) && (
                      <>
                        {person.address && <p className="text-[#5a5a5a]">{person.address}</p>}
                        {person.address2 && <p className="text-[#5a5a5a]">{person.address2}</p>}
                        {person.address3 && <p className="mb-3 text-[#5a5a5a]">{person.address3}</p>}
                      </>
                    )}
                    {person.phone && (
                      <p className="text-[#484848]">
                        Phone:{' '}
                        <a
                          href={`tel:${person.phone.replace(/[^0-9+]/g, '')}`}
                          className="text-[#2d5016] transition-colors hover:text-[#4C8C2B]"
                        >
                          {person.phone}
                        </a>
                      </p>
                    )}
                    {person.email && (
                      <p className="text-[#484848]">
                        Email:{' '}
                        <a
                          href={`mailto:${person.email}`}
                          className="text-[#2d5016] transition-colors hover:text-[#4C8C2B]"
                        >
                          {person.email}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
