import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { investorsCmsApi } from '../../../services/api';
import { dedupeInvestorRelatedLinks } from '../../../utils/investorRelatedLinks';
import { getFallbackInvestorNavLinks } from '../../../utils/investorNavLinks';
import {
  investorActiveNavClass,
  investorInactiveNavClass,
  investorSidebarCardClass,
  investorSpinnerClass,
} from '../investorLayout';

interface RelatedLink {
  id?: number;
  name: string;
  href: string;
  displayOrder: number;
  isActive: boolean;
}

interface InvestorSidebarProps {
  currentPath: string;
}

export default function InvestorSidebar({ currentPath }: InvestorSidebarProps) {
  const [links, setLinks] = useState<RelatedLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setLoading(true);
      const allLinks: RelatedLink[] = [];

      try {
        const linksData = await investorsCmsApi.getRelatedLinks();
        const activeLinks = (linksData || []).filter((link: RelatedLink) => link.isActive);
        allLinks.push(...activeLinks);
      } catch (err) {
        console.error('Failed to load related links:', err);
      }

      try {
        const pagesData = await investorsCmsApi.getAllPageContent();
        const activePages = (pagesData || []).filter((page: { isActive: boolean }) => page.isActive);

        activePages.forEach((page: { slug: string; title: string }) => {
          const pageHref = `/investors/${page.slug}/`;
          const linkExists = allLinks.some(
            (link) =>
              link.href === pageHref || link.href.replace(/\/$/, '') === pageHref.replace(/\/$/, ''),
          );

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
      setLinks(merged.length > 0 ? merged : getFallbackInvestorNavLinks());
    } catch (err) {
      console.error('Failed to load investor links:', err);
      setLinks(getFallbackInvestorNavLinks());
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="lg:col-span-3">
        <div className={investorSidebarCardClass}>
          <div className="flex items-center justify-center p-8">
            <div className={investorSpinnerClass} aria-hidden />
          </div>
        </div>
      </div>
    );
  }

  const sortedLinks = [...links].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  const activeLink = sortedLinks.find((link) => {
    const hrefPath = link.href.replace(/\/investors\//, '').replace(/\/$/, '');
    const currentSlug = currentPath.replace(/\/investors\//, '').replace(/\/$/, '');
    return hrefPath === currentSlug || link.href.replace(/\/$/, '') === currentPath.replace(/\/$/, '');
  });

  const navLinks = (
    <nav className="divide-y divide-[#eef2ea]">
      {sortedLinks.map((link) => {
        const hrefPath = link.href.replace(/\/investors\//, '').replace(/\/$/, '');
        const currentSlug = currentPath.replace(/\/investors\//, '').replace(/\/$/, '');
        const isActive =
          hrefPath === currentSlug || link.href.replace(/\/$/, '') === currentPath.replace(/\/$/, '');
        const linkPath = hrefPath ? `/investors/${hrefPath}` : link.href;

        return (
          <Link
            key={link.id || link.name}
            to={linkPath}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`block w-full min-w-0 px-4 py-3 text-sm sm:text-[15px] ${
              isActive ? investorActiveNavClass : investorInactiveNavClass
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="lg:col-span-3">
      <details className={`group mb-4 lg:hidden ${investorSidebarCardClass}`}>
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-[#2d5016] sm:text-base [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            <span className="min-w-0 truncate">{activeLink?.name || 'Investor Pages'}</span>
            <i className="ri-arrow-down-s-line shrink-0 text-lg text-[#4C8C2B] transition-transform group-open:rotate-180" />
          </span>
        </summary>
        <div className="max-h-[60vh] overflow-y-auto border-t border-[#eef2ea]">{navLinks}</div>
      </details>

      <div className="hidden lg:block lg:sticky lg:top-[calc(var(--header-offset,5.25rem)+1rem)]">
        <div
          className={`max-h-[calc(100vh-var(--header-offset,5.25rem)-2rem)] overflow-y-auto ${investorSidebarCardClass}`}
        >
          {navLinks}
        </div>
      </div>
    </div>
  );
}
