import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { footerCmsApi } from '../../../services/api';
import { scrollToPageSection } from '../../about-us/goToAboutSection';
import { ABOUT_US_NAV_DROPDOWN } from '../../about-us/aboutNavLinks';
import { BUSINESS_NAV_DROPDOWN } from '../../../utils/businessNavLinks';
import {
  FOOTER_SUSTAINABILITY_LINKS,
  getFooterInvestorLinks,
  isExternalFooterHref,
  isInvestorsFooterSection,
  mergeFooterSectionLinks,
  normalizeFooterLink,
  parseFooterHref,
  resolveFooterLinkHref,
} from '../../../utils/footerLinks';
import { homeContainer } from './HomeSection';

interface FooterLink {
  name: string;
  href: string;
  target?: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
  subsections?: Array<{
    title: string;
    links: FooterLink[];
  }>;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface FooterData {
  sections?: FooterSection[];
  socialLinks?: SocialLink[];
  contactEmail?: string;
  cin?: string;
  nseScripCode?: string;
  bseScripSymbol?: string;
  isin?: string;
  complaintsTitle?: string;
  complaintsPhone?: string;
  complaintsPhoneUrl?: string;
  complaintsEmail?: string;
  copyrightText?: string;
  copyrightLink?: string;
  copyrightLinkText?: string;
  bottomLinks?: FooterLink[];
  backgroundImage?: string;
  backgroundImageOpacity?: number;
  isActive?: boolean;
}

const LINKEDIN_SHOWCASE_URL = 'https://www.linkedin.com/showcase/refexindustrieslimited/';

const DEFAULT_FOOTER: FooterData = {
  sections: [
    {
      title: 'About Us',
      links: ABOUT_US_NAV_DROPDOWN,
    },
    {
      title: 'Business',
      links: [...BUSINESS_NAV_DROPDOWN],
    },
    {
      title: 'Sustainability',
      links: [
        { name: 'Refex on ESG', href: '/esg#refex-esg' },
        { name: 'ESG Policies', href: '/esg#esg-policies' },
      ],
    },
    {
      title: 'Investors',
      links: [
        { name: 'Financial Results', href: '/investors/financial-information' },
        { name: 'Annual Reports', href: '/investors/annual-reports' },
        { name: 'Notice of Board Meetings', href: '/investors/general-meeting-updates' },
        { name: 'Policies', href: '/investors/policies' },
        { name: 'Credit Ratings', href: '/investors/credit-ratings' },
        { name: 'Investor Information', href: '/investors/investor-information' },
        { name: 'Newspaper Publication', href: '/investors/newspaper-publication' },
      ],
    },
  ],
  socialLinks: [
    { platform: 'Facebook', url: 'https://www.facebook.com/refexindustrieslimited/', icon: 'ri-facebook-fill' },
    { platform: 'Twitter/X', url: 'https://x.com/GroupRefex', icon: 'ri-twitter-x-fill' },
    { platform: 'YouTube', url: 'https://www.youtube.com/@refexgroup', icon: 'ri-youtube-fill' },
    { platform: 'LinkedIn', url: LINKEDIN_SHOWCASE_URL, icon: 'ri-linkedin-fill' },
    { platform: 'Instagram', url: 'https://www.instagram.com/refexgroup/', icon: 'ri-instagram-fill' },
  ],
  contactEmail: 'investor.relations@refex.co.in',
  cin: 'L45200TN2002PLC049601',
  nseScripCode: 'REFEX',
  bseScripSymbol: '532884',
  isin: 'INE056I01025',
  complaintsTitle: 'For any Complaints',
  complaintsPhone: '+91 96297 38734',
  complaintsPhoneUrl: 'https://web.whatsapp.com/',
  complaintsEmail: 'refexcares@refex.co.in',
  copyrightText: `© ${new Date().getFullYear()}`,
  copyrightLink: 'https://refex.co.in/#',
  copyrightLinkText: 'Refex Industries',
  bottomLinks: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Use', href: '/terms-of-use' },
  ],
  isActive: true,
};

const headingClass =
  'mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]';
const linkClass =
  'text-sm text-white/82 transition-colors duration-200 hover:text-[#8ee04f] [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]';
const metaClass = 'text-xs leading-relaxed text-white/72 [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]';

function FooterNavLink({
  link,
  onHashNavigate,
}: {
  link: FooterLink;
  onHashNavigate: (e: React.MouseEvent<HTMLAnchorElement>, path: string, hash: string) => void;
}) {
  const href = resolveFooterLinkHref(link.name, link.href);
  const isExternal = isExternalFooterHref(href) || Boolean(link.target);

  if (isExternal) {
    return (
      <a
        href={href}
        {...(link.target ? { target: link.target, rel: 'noopener noreferrer' } : {})}
        className={`${linkClass} inline-block`}
      >
        {link.name}
      </a>
    );
  }

  const { path, hash } = parseFooterHref(href, link.name);

  if (hash) {
    return (
      <Link
        to={{ pathname: path, hash: `#${hash}` }}
        className={`${linkClass} inline-block`}
        onClick={(e) => onHashNavigate(e, path, hash)}
      >
        {link.name}
      </Link>
    );
  }

  return (
    <Link to={path} className={`${linkClass} inline-block`}>
      {link.name}
    </Link>
  );
}

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const data = await footerCmsApi.get();
        if (data && data.isActive !== false) {
          setFooterData(data);
        } else {
          setFooterData(DEFAULT_FOOTER);
        }
      } catch (error) {
        console.error('Failed to fetch footer data from CMS:', error);
        setFooterData(DEFAULT_FOOTER);
      }
    };
    fetchFooterData();
  }, []);

  const handleHashNavigate = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
    hash: string,
  ) => {
    const normalizedPath = path.replace(/\/+$/, '') || '/';
    const normalizedCurrent = currentPath.replace(/\/+$/, '') || '/';

    if (normalizedCurrent === normalizedPath) {
      e.preventDefault();
      window.history.replaceState(null, '', `#${hash}`);
      scrollToPageSection(hash);
    }
  };

  const data = useMemo(() => {
    const src = footerData || DEFAULT_FOOTER;
    const sections = (src.sections?.length ? src.sections : DEFAULT_FOOTER.sections!).map(
      (section) => {
        if (section.title === 'About Us') {
          return { ...section, links: ABOUT_US_NAV_DROPDOWN.map(normalizeFooterLink) };
        }
        if (section.title === 'Business') {
          return { ...section, links: [...BUSINESS_NAV_DROPDOWN].map(normalizeFooterLink) };
        }
        if (isInvestorsFooterSection(section.title)) {
          return {
            ...section,
            title: 'Investors',
            links: getFooterInvestorLinks().map(normalizeFooterLink),
          };
        }
        if (section.title === 'Sustainability') {
          return {
            ...section,
            links: mergeFooterSectionLinks(section.links, FOOTER_SUSTAINABILITY_LINKS),
          };
        }
        return {
          ...section,
          links: section.links.map((link) => normalizeFooterLink(link)),
          subsections: section.subsections?.map((subsection) => ({
            ...subsection,
            links: subsection.links.map((link) => normalizeFooterLink(link)),
          })),
        };
      },
    );
    return {
      sections,
      socialLinks: (src.socialLinks?.length ? src.socialLinks : DEFAULT_FOOTER.socialLinks!).map(
        (link) =>
          link.platform.trim().toLowerCase() === 'linkedin'
            ? { ...link, url: LINKEDIN_SHOWCASE_URL }
            : link,
      ),
      contactEmail: src.contactEmail || DEFAULT_FOOTER.contactEmail!,
      cin: src.cin || DEFAULT_FOOTER.cin!,
      nseScripCode: src.nseScripCode || DEFAULT_FOOTER.nseScripCode!,
      bseScripSymbol: src.bseScripSymbol || DEFAULT_FOOTER.bseScripSymbol!,
      isin: src.isin || DEFAULT_FOOTER.isin!,
      complaintsTitle: src.complaintsTitle || DEFAULT_FOOTER.complaintsTitle!,
      complaintsPhone: src.complaintsPhone || DEFAULT_FOOTER.complaintsPhone!,
      complaintsPhoneUrl: src.complaintsPhoneUrl || DEFAULT_FOOTER.complaintsPhoneUrl!,
      complaintsEmail: src.complaintsEmail || DEFAULT_FOOTER.complaintsEmail!,
      copyrightText: src.copyrightText || DEFAULT_FOOTER.copyrightText!,
      copyrightLink: src.copyrightLink || DEFAULT_FOOTER.copyrightLink!,
      copyrightLinkText: src.copyrightLinkText || DEFAULT_FOOTER.copyrightLinkText!,
      bottomLinks: (src.bottomLinks?.length ? src.bottomLinks : DEFAULT_FOOTER.bottomLinks!).map(
        normalizeFooterLink,
      ),
      backgroundImage: src.backgroundImage || null,
      backgroundImageOpacity: src.backgroundImageOpacity ?? 0.08,
    };
  }, [footerData]);

  return (
    <footer className="footer-dark relative z-20 overflow-hidden border-t border-white/10 bg-[#05070a] text-white">
      {data.backgroundImage && (
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("${data.backgroundImage}")`,
            opacity: data.backgroundImageOpacity,
          }}
          aria-hidden="true"
        />
      )}

      <div className={`relative z-10 ${homeContainer} py-12 sm:py-14 lg:py-16`}>
        <div className="mb-10 grid grid-cols-2 gap-8 sm:gap-10 md:grid-cols-3 lg:mb-12 lg:grid-cols-5 lg:gap-8">
          {data.sections.map((section) => (
            <div key={section.title} className="min-w-0">
              <h3 className={headingClass}>{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.name}`}>
                    <FooterNavLink link={link} onHashNavigate={handleHashNavigate} />
                  </li>
                ))}
              </ul>

              {section.subsections?.map((subsection) => (
                <div key={subsection.title} className="mt-6 border-t border-white/10 pt-5">
                  <h3 className={headingClass}>{subsection.title}</h3>
                  <ul className="space-y-2.5">
                    {subsection.links.map((link) => (
                      <li key={`${subsection.title}-${link.name}`}>
                        <FooterNavLink link={link} onHashNavigate={handleHashNavigate} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}

          <div className="col-span-2 min-w-0 sm:col-span-1">
            <h3 className={headingClass}>Follow Us</h3>
            <div className="mb-6 flex flex-wrap gap-2.5">
              {data.socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/[0.04] text-white/75 transition-colors hover:border-[#7cd144]/50 hover:bg-[#7cd144]/10 hover:text-[#7cd144]"
                >
                  <i className={`${social.icon} text-base`} />
                </a>
              ))}
            </div>

            <div className={`mb-6 space-y-1.5 ${metaClass}`}>
              {data.contactEmail && (
                <p className="flex items-start gap-2">
                  <i className="ri-mail-line mt-0.5 text-[#7cd144]" aria-hidden="true" />
                  <a href={`mailto:${data.contactEmail}`} className="break-all hover:text-[#7cd144]">
                    {data.contactEmail}
                  </a>
                </p>
              )}
              {data.cin && <p>CIN: {data.cin}</p>}
              {data.nseScripCode && <p>NSE: {data.nseScripCode}</p>}
              {data.bseScripSymbol && <p>BSE: {data.bseScripSymbol}</p>}
              {data.isin && <p>ISIN: {data.isin}</p>}
            </div>

            {data.complaintsTitle && (
              <div>
                <h3 className={headingClass}>{data.complaintsTitle}</h3>
                <div className={`space-y-2 ${metaClass}`}>
                  {data.complaintsPhone && (
                    <a
                      href={data.complaintsPhoneUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-[#7cd144]"
                    >
                      <i className="ri-phone-line text-[#7cd144]" aria-hidden="true" />
                      {data.complaintsPhone}
                    </a>
                  )}
                  {data.complaintsEmail && (
                    <a
                      href={`mailto:${data.complaintsEmail}`}
                      className="flex items-center gap-2 break-all hover:text-[#7cd144]"
                    >
                      <i className="ri-mail-line text-[#7cd144]" aria-hidden="true" />
                      {data.complaintsEmail}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 sm:pt-8">
          <p className="mb-4 max-w-3xl text-[11px] leading-relaxed text-white/40">
            City data on the contact form is sourced from{' '}
            <a
              href="https://github.com/dr5hn/countrystatecity-countries"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7cd144]/80 hover:text-[#7cd144] hover:underline"
            >
              geographic datasets
            </a>{' '}
            licensed under the{' '}
            <a
              href="https://opendatacommons.org/licenses/odbl/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7cd144]/80 hover:text-[#7cd144] hover:underline"
            >
              Open Database License (ODbL) 1.0
            </a>
            .
          </p>

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className={`text-sm text-white/82 [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]`}>
              {data.copyrightText}{' '}
              {data.copyrightLink && data.copyrightLinkText && (
                <a
                  href={data.copyrightLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8ee04f] hover:underline [text-shadow:0_0_14px_rgba(124,210,68,0.35)]"
                >
                  {data.copyrightLinkText}
                </a>
              )}{' '}
              All rights reserved
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {data.bottomLinks.map((link) => {
                const href = resolveFooterLinkHref(link.name, link.href);
                if (isExternalFooterHref(href) || link.target) {
                  return (
                    <a
                      key={link.name}
                      href={href}
                      {...(link.target ? { target: link.target, rel: 'noopener noreferrer' } : {})}
                      className={linkClass}
                    >
                      {link.name}
                    </a>
                  );
                }
                const { path, hash } = parseFooterHref(href, link.name);
                if (hash) {
                  return (
                    <Link
                      key={link.name}
                      to={{ pathname: path, hash: `#${hash}` }}
                      className={linkClass}
                      onClick={(e) => handleHashNavigate(e, path, hash)}
                    >
                      {link.name}
                    </Link>
                  );
                }
                return (
                  <Link key={link.name} to={path} className={linkClass}>
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
