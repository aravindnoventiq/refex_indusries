import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { headerCmsApi, stockApi } from '../../../services/api';
import ThemeToggle from '../../../components/ThemeToggle';
import { useSiteTheme } from '../../../components/SiteThemeProvider';
import {
  getHeaderLogoUrl,
  getHeaderMobileLinkClass,
  getHeaderMobileSubLinkClass,
  getHeaderNavLinkClass,
} from '../../../utils/siteChromeTheme';
import { goToAboutSection } from '../../about-us/goToAboutSection';
import { ABOUT_US_NAV_DROPDOWN } from '../../about-us/aboutNavLinks';
import { BUSINESS_NAV_DROPDOWN } from '../../../utils/businessNavLinks';

interface NavigationItem {
  name: string;
  href: string;
  dropdown?: Array<{
    name: string;
    href: string;
    hasSubmenu?: boolean;
    submenu?: Array<{ name: string; href: string }>;
  }>;
}

interface HeaderData {
  logoUrl?: string;
  logoAlt?: string;
  showStockInfo?: boolean;
  bsePrice?: string;
  bseChange?: string;
  bseChangeIndicator?: 'up' | 'down';
  nsePrice?: string;
  nseChange?: string;
  nseChangeIndicator?: 'up' | 'down';
  navigationItems?: NavigationItem[];
  contactButtonText?: string;
  contactButtonHref?: string;
  isActive?: boolean;
}

const isSmartOdrEntry = (name?: string, href?: string): boolean => {
  const normalizedName = String(name || "").trim().toLowerCase();
  const normalizedHref = String(href || "").trim().toLowerCase().replace(/\/$/, "");
  return (
    normalizedName === "smart odr" ||
    normalizedHref === "/investors/smart-odr" ||
    normalizedHref.includes("/investors/smart-odr")
  );
};

const sanitizeNavigationItems = (items: NavigationItem[]): NavigationItem[] =>
  (items || [])
    .filter((item) => !isSmartOdrEntry(item.name, item.href))
    .map((item) => ({
      ...item,
      dropdown: (item.dropdown || [])
        .filter((dropItem) => !isSmartOdrEntry(dropItem.name, dropItem.href))
        .map((dropItem) => ({
          ...dropItem,
          submenu: (dropItem.submenu || []).filter(
            (subItem) => !isSmartOdrEntry(subItem.name, subItem.href)
          ),
        }))
        .filter((dropItem) => {
          if (!dropItem.hasSubmenu) return true;
          return (dropItem.submenu || []).length > 0;
        }),
    }));

const POWER_TRADING_SURRENDER_PETITION_PDF =
  'https://refex.co.in/uploads/pdfs/pdf-1783071359067-610585102.pdf';

const POST_ESG_NAV_ITEMS: NavigationItem[] = [
  {
    name: 'Careers',
    href: '/careers/',
    dropdown: [],
  },
  {
    name: 'Power Trading Surrender Petition',
    href: POWER_TRADING_SURRENDER_PETITION_PDF,
    dropdown: [],
  },
];

const matchesPostEsgNavItem = (item: NavigationItem, required: NavigationItem) =>
  item.name.trim().toLowerCase() === required.name.toLowerCase() ||
  item.href === required.href ||
  (required.name === 'Careers' &&
    item.href.replace(/\/$/, '').toLowerCase() === '/careers') ||
  (required.name.includes('Power Trading') &&
    item.href.includes('pdf-1783071359067-610585102.pdf'));

const ensurePostEsgNavItems = (items: NavigationItem[]): NavigationItem[] => {
  const list = [...(items || [])].filter(
    (item) => !POST_ESG_NAV_ITEMS.some((required) => matchesPostEsgNavItem(item, required)),
  );

  const esgIndex = list.findIndex(
    (item) =>
      item.name.trim().toLowerCase() === 'esg' ||
      item.href.replace(/\/$/, '').toLowerCase() === '/esg',
  );
  const insertAt = esgIndex >= 0 ? esgIndex + 1 : list.length;
  list.splice(insertAt, 0, ...POST_ESG_NAV_ITEMS);
  return list;
};

const isExternalHref = (href: string) =>
  href.startsWith('http://') || href.startsWith('https://');

// Default values
const defaultNavItems: NavigationItem[] = [
  { 
    name: 'Home', 
    href: '/',
    dropdown: []
  },
  { 
    name: 'About Us', 
    href: '/about-us',
    dropdown: ABOUT_US_NAV_DROPDOWN,
  },
  { 
    name: 'Business', 
    href: '#business',
    dropdown: [...BUSINESS_NAV_DROPDOWN],
  },
  { 
    name: 'Investors', 
    href: '/investors',
    dropdown: []
  },
  { 
    name: 'ESG', 
    href: '/esg',
    dropdown: []
  },
  {
    name: 'Careers',
    href: '/careers/',
    dropdown: [],
  },
  {
    name: 'Power Trading Surrender Petition',
    href: POWER_TRADING_SURRENDER_PETITION_PDF,
    dropdown: [],
  },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useSiteTheme();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const stockIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [hasLaunched, setHasLaunched] = useState(false);

  // "Launch" (initial entry) effect — matches the premium stagger feel
  // on landing pages without introducing extra animation libs.
  useEffect(() => {
    setHasLaunched(false);
    const t = window.setTimeout(() => setHasLaunched(true), 60);
    return () => window.clearTimeout(t);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const syncHeaderOffset = () => {
      if (!headerRef.current) return;
      const height = headerRef.current.offsetHeight;
      document.documentElement.style.setProperty('--header-offset', `${height}px`);
      document.documentElement.style.setProperty('--header-height', `${height}px`);
    };

    syncHeaderOffset();
    window.addEventListener('resize', syncHeaderOffset);
    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(syncHeaderOffset)
      : null;
    if (ro && headerRef.current) ro.observe(headerRef.current);

    return () => {
      window.removeEventListener('resize', syncHeaderOffset);
      ro?.disconnect();
    };
  }, [headerData, isMobileMenuOpen, hasLaunched]);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const data = await headerCmsApi.get();
        if (data && data.isActive !== false) {
          setHeaderData(data);
        }
      } catch (error) {
        console.error('Failed to fetch header data from CMS:', error);
        // Use default values on error
      }
    };
    fetchHeaderData();
  }, []);

  // Fetch stock prices every 30 seconds when header data is loaded
  useEffect(() => {
    // Only fetch if header data is loaded and stock info is enabled
    if (!headerData || headerData.showStockInfo === false) {
      // Clear interval if stock info is disabled
      if (stockIntervalRef.current) {
        clearInterval(stockIntervalRef.current);
        stockIntervalRef.current = null;
      }
      return;
    }

    // If interval is already set up, don't create another one
    if (stockIntervalRef.current) {
      return;
    }

    const fetchStockPrices = async () => {
      try {
        const stockData = await stockApi.getStockPriceFromExternal();
        
        // Log the full response for debugging
        console.log('=== Stock API Response ===');
        console.log('Full Response:', JSON.stringify(stockData, null, 2));
        console.log('Timestamp:', new Date().toISOString());
        
        // Log specific values for easy comparison
        if (stockData?.nse_data) {
          console.log('NSE Values:', {
            price: stockData.nse_data.price,
            index: stockData.nse_data.index,
            overall_index: stockData.nse_data.overall_index
          });
        }
        if (stockData?.bse_data) {
          console.log('BSE Values:', {
            price: stockData.bse_data.price,
            index: stockData.bse_data.index,
            overall_index: stockData.bse_data.overall_index
          });
        }
        console.log('==========================');
        
        if (!stockData) {
          console.warn('Stock API returned empty response');
          return;
        }
        
        setHeaderData((prevData) => {
          if (!prevData) {
            console.warn('No previous header data to update');
            return prevData;
          }
          
          const updated = { ...prevData };
          let hasUpdates = false;
          
          // Extract data - handle different wrapper formats
          let data = stockData;
          if (stockData.data) {
            data = stockData.data;
          }
          
          // Parse BSE data - looking for bse_data structure
          const bseData = data.bse_data || data.bseData || data.BSE || data.bse;
          if (bseData && bseData.price !== undefined) {
            // Extract price
            const bsePrice = typeof bseData.price === 'number' ? bseData.price.toFixed(2) : String(bseData.price);
            updated.bsePrice = bsePrice;
            hasUpdates = true;
            console.log('BSE Price updated:', bsePrice);
            
            // Extract overall_index value (this is the change percentage)
            if (bseData.overall_index !== undefined && bseData.overall_index !== null) {
              const rawIndex = bseData.overall_index;
              const indexStr = String(rawIndex);
              
              // Log the raw value received from API
              console.log('BSE Raw Overall Index from API:', rawIndex, 'Type:', typeof rawIndex);
              
              // Format: ensure it has % sign if not present
              const formattedIndex = indexStr.includes('%') ? indexStr : `${indexStr}%`;
              updated.bseChange = formattedIndex;
              
              // Determine indicator: positive (+) = up, negative (-) = down
              const isPositive = indexStr.trim().startsWith('+') || (parseFloat(indexStr) > 0);
              updated.bseChangeIndicator = isPositive ? 'up' : 'down';
              hasUpdates = true;
              console.log('BSE Overall Index updated:', formattedIndex, 'Indicator:', updated.bseChangeIndicator, 'Timestamp:', new Date().toISOString());
            } else {
              console.warn('BSE overall_index field not found in response. Available keys:', Object.keys(bseData));
            }
          }
          
          // Parse NSE data - looking for nse_data structure
          const nseData = data.nse_data || data.nseData || data.NSE || data.nse;
          if (nseData && nseData.price !== undefined) {
            // Extract price
            const nsePrice = typeof nseData.price === 'number' ? nseData.price.toFixed(2) : String(nseData.price);
            updated.nsePrice = nsePrice;
            hasUpdates = true;
            console.log('NSE Price updated:', nsePrice);
            
            // Extract overall_index value (this is the change percentage)
            if (nseData.overall_index !== undefined && nseData.overall_index !== null) {
              const rawIndex = nseData.overall_index;
              const indexStr = String(rawIndex);
              
              // Log the raw value received from API
              console.log('NSE Raw Overall Index from API:', rawIndex, 'Type:', typeof rawIndex);
              
              // Format: ensure it has % sign if not present
              const formattedIndex = indexStr.includes('%') ? indexStr : `${indexStr}%`;
              updated.nseChange = formattedIndex;
              
              // Determine indicator: positive (+) = up, negative (-) = down
              const isPositive = indexStr.trim().startsWith('+') || (parseFloat(indexStr) > 0);
              updated.nseChangeIndicator = isPositive ? 'up' : 'down';
              hasUpdates = true;
              console.log('NSE Overall Index updated:', formattedIndex, 'Indicator:', updated.nseChangeIndicator, 'Timestamp:', new Date().toISOString());
            } else {
              console.warn('NSE overall_index field not found in response. Available keys:', Object.keys(nseData));
            }
          }
          
          if (hasUpdates) {
            console.log('=== Stock Prices Updated Successfully ===');
            console.log('BSE:', { 
              price: updated.bsePrice, 
              change: updated.bseChange, 
              indicator: updated.bseChangeIndicator 
            });
            console.log('NSE:', { 
              price: updated.nsePrice, 
              change: updated.nseChange, 
              indicator: updated.nseChangeIndicator 
            });
            console.log('Update Timestamp:', new Date().toISOString());
            console.log('==========================================');
          } else {
            console.warn('No stock price updates made. Check API response format.');
            console.log('Full response structure:', JSON.stringify(data, null, 2));
          }
          
          return updated;
        });
      } catch (error: any) {
        console.error('Failed to fetch stock prices:', error);
        console.error('Error details:', error.message, error.stack);
        // Silently fail - don't update if API fails
      }
    };

    // Fetch immediately on mount
    fetchStockPrices();
    
    // Set up interval to fetch every 30 seconds
    stockIntervalRef.current = setInterval(() => {
      fetchStockPrices();
    }, 30000); // 30 seconds = 30000 milliseconds

    // Cleanup interval on unmount
    return () => {
      if (stockIntervalRef.current) {
        clearInterval(stockIntervalRef.current);
        stockIntervalRef.current = null;
      }
    };
  }, [headerData?.showStockInfo]); // Re-run when headerData first loads or stock info visibility changes

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.includes('#')) return;

    e.preventDefault();
    const [pathPart, hash = ''] = href.split('#');
    const path = (pathPart || '').replace(/\/$/, '') || location.pathname;
    const isAboutHash =
      path === '/about-us' ||
      (href.startsWith('#') && location.pathname === '/about-us');

    if (isAboutHash || path === '/about-us') {
      if (location.pathname !== '/about-us') {
        navigate(`/about-us#${hash}`);
        return;
      }
      window.history.replaceState(null, '', `#${hash}`);
      goToAboutSection(hash);
      return;
    }

    // Same-page section (e.g. #business on home)
    if (!pathPart || path === location.pathname) {
      const element = document.getElementById(hash);
      if (!element) return;
      const header =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--header-offset'),
        ) || 84;
      const top = element.getBoundingClientRect().top + window.scrollY - header - 16;
      window.scrollTo({ top, behavior: 'smooth' });
      return;
    }

    navigate(href.startsWith('/') ? href : `/${href}`);
  };

  // Use CMS data or fallback to defaults; About Us dropdown always matches page sections
  const navItems = ensurePostEsgNavItems(
    headerData?.navigationItems && headerData.navigationItems.length > 0
      ? headerData.navigationItems
      : defaultNavItems,
  );
  const sanitizedNavItems = sanitizeNavigationItems(navItems).map((item) => {
    if (item.name === 'About Us' || item.href.replace(/\/$/, '') === '/about-us') {
      return { ...item, dropdown: ABOUT_US_NAV_DROPDOWN };
    }
    if (item.name === 'Business' || item.href === '#business') {
      return { ...item, dropdown: [...BUSINESS_NAV_DROPDOWN] };
    }
    return item;
  });
  
  const logoUrl = getHeaderLogoUrl(theme, headerData?.logoUrl);
  const logoAlt = headerData?.logoAlt || "Refex Industries Limited";
  const showStockInfo = headerData?.showStockInfo !== false;
  const bsePrice = headerData?.bsePrice || "";
  const bseChange = headerData?.bseChange || "";
  const bseChangeIndicator = headerData?.bseChangeIndicator || "down";
  const nsePrice = headerData?.nsePrice || "";
  const nseChange = headerData?.nseChange || "";
  const nseChangeIndicator = headerData?.nseChangeIndicator || "down";
  const contactButtonText = headerData?.contactButtonText || "Contact Us";
  const contactButtonHref = headerData?.contactButtonHref || "/contact/";

  const isActivePath = (href: string) => {
    if (href === '/') return location.pathname === '/';
    if (href.startsWith('#')) return false;
    const path = href.replace(/\/$/, '');
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navLinkClass = (href: string, name?: string) => {
    const active = isActivePath(href);
    const isLongLabel = (name || '').length > 18;
    return getHeaderNavLinkClass(theme, active, isLongLabel);
  };

  const underlineClass = (href: string) => {
    const active = isActivePath(href);
    return `absolute -bottom-0.5 left-0 h-0.5 bg-[#7cd244] transition-all duration-300 ${
      active ? 'w-full' : 'w-0 group-hover:w-full'
    }`;
  };

  // Helper function to render navigation items
  const renderDesktopNav = () => {
    return sanitizedNavItems.map((item, idx) => {
      const hasDropdown = !!item.dropdown && item.dropdown.length > 0;

      if (hasDropdown) {
        return (
          <div key={item.name} className="relative group">
            <a
              href={item.href}
              style={{ transitionDelay: `${idx * 60}ms` }}
              className={`${navLinkClass(item.href, item.name)} group transition-[opacity,transform] duration-700 ease-out ${
                hasLaunched ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
              }`}
            >
              {item.name}
              <i className="ri-arrow-down-s-line text-sm text-[#7cd244] transition-transform duration-300 group-hover:rotate-180" />
              <span className={underlineClass(item.href)} />
            </a>
            <div className="absolute left-0 top-full z-50 mt-3 w-60 origin-top scale-95 rounded-xl border border-white/20 bg-white/95 opacity-0 shadow-2xl backdrop-blur-md invisible transition-all duration-200 group-hover:visible group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100">
              {item.dropdown!.map((dropItem) => {
                if (dropItem.hasSubmenu && dropItem.submenu) {
                  return (
                    <div key={dropItem.name} className="relative group/submenu">
                      <div className="flex items-center justify-between px-5 py-3 font-semibold text-gray-900 transition-colors cursor-pointer hover:bg-gray-50 hover:text-[#7cd244]">
                        {dropItem.name}
                        <i className="ri-arrow-right-s-line"></i>
                      </div>
                      <div className="absolute left-full top-0 ml-1 w-64 origin-top-left scale-95 rounded-xl border border-gray-100 bg-white opacity-0 shadow-xl invisible transition-all duration-200 group-hover/submenu:visible group-hover/submenu:scale-100 group-hover/submenu:opacity-100">
                        {dropItem.submenu.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            target={subItem.href.startsWith('http') ? '_blank' : undefined}
                            rel={subItem.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="block px-5 py-3 font-semibold text-gray-900 transition-colors cursor-pointer hover:bg-gray-50 hover:text-[#7cd244]"
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <a
                    key={dropItem.name}
                    href={dropItem.href}
                    target={dropItem.href.startsWith('http') ? '_blank' : undefined}
                    rel={dropItem.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    onClick={(e) => {
                      if (dropItem.href.includes('#') && !dropItem.href.startsWith('http')) {
                        handleSectionClick(e, dropItem.href);
                      }
                    }}
                    className="block px-5 py-3 font-semibold text-gray-900 transition-colors cursor-pointer hover:bg-gray-50 hover:text-[#7cd244]"
                  >
                    {dropItem.name}
                  </a>
                );
              })}
            </div>
          </div>
        );
      }
      return (
        <a
          key={item.name}
          href={item.href}
          target={isExternalHref(item.href) ? '_blank' : undefined}
          rel={isExternalHref(item.href) ? 'noopener noreferrer' : undefined}
          style={{ transitionDelay: `${idx * 60}ms` }}
          className={`${navLinkClass(item.href, item.name)} group transition-[opacity,transform] duration-700 ease-out ${
            hasLaunched ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
          }`}
        >
          {item.name}
          <span className={underlineClass(item.href)} />
        </a>
      );
    });
  };

  return (
    <header
      ref={headerRef}
      className={`header-dark fixed inset-x-0 top-0 z-[100] border-b transition-all duration-500 supports-[padding:max(0px)]:pt-[max(0px,env(safe-area-inset-top))] transition-[opacity,transform] duration-700 ease-out ${
        hasLaunched ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
      }`}
    >
      {/* Top Bar with Stock Info */}
      {showStockInfo && (bsePrice || nsePrice) && (
        <div className="header-stock-bar w-full border-b transition-colors duration-500">
          <div className="mx-auto flex h-auto min-h-7 max-w-[90rem] flex-wrap items-center gap-x-4 gap-y-1 px-4 py-1 sm:px-6 md:px-8 lg:px-10 xl:px-12 text-[10px] sm:text-[11px]">
              {bsePrice && (
                <div className="flex items-center gap-1.5">
                  <span className="header-stock-label font-medium">BSE</span>
                  <i
                    className={`ri-arrow-${bseChangeIndicator === 'up' ? 'up' : 'down'}-line text-sm`}
                    style={{ color: bseChangeIndicator === 'up' ? '#008000' : '#dc2626' }}
                  ></i>
                  <span
                    className="font-semibold"
                    style={{ color: bseChangeIndicator === 'up' ? '#008000' : '#dc2626' }}
                  >
                    ₹ {bsePrice} ({bseChange})
                  </span>
                </div>
              )}
              {nsePrice && (
                <div className="flex items-center gap-1.5">
                  <span className="header-stock-label font-medium">NSE</span>
                  <i
                    className={`ri-arrow-${nseChangeIndicator === 'up' ? 'up' : 'down'}-line text-sm`}
                    style={{ color: nseChangeIndicator === 'up' ? '#008000' : '#dc2626' }}
                  ></i>
                  <span
                    className="font-semibold"
                    style={{ color: nseChangeIndicator === 'up' ? '#008000' : '#dc2626' }}
                  >
                    ₹ {nsePrice} ({nseChange})
                  </span>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="flex min-h-[3.25rem] items-center justify-between gap-3 py-2 transition-all duration-300 sm:gap-5 lg:min-h-[3.75rem] lg:gap-8 lg:py-2.5">
          {/* Logo */}
          <a href="/" className="group flex shrink-0 items-center cursor-pointer">
            <img
              src={logoUrl}
              alt={logoAlt}
              className="h-8 w-auto object-contain transition-all duration-300 group-hover:opacity-90 lg:h-9"
            />
          </a>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden flex-1 items-center justify-center gap-5 xl:gap-7 lg:flex">
            {renderDesktopNav()}
          </nav>

          {/* Theme + Contact */}
          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <ThemeToggle variant="header" />
            <a
              href={contactButtonHref}
              style={{ transitionDelay: '240ms' }}
              className={`header-contact-btn relative inline-flex cursor-pointer items-center gap-1.5 overflow-hidden rounded-full border px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-300 group hover:border-[#7cd244] hover:bg-[#7cd244] hover:text-[#0a0a0a] transition-[opacity,transform] duration-700 ease-out ${
                hasLaunched ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
              }`}
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">
                {contactButtonText}
              </span>
              <i className="ri-arrow-right-line relative z-10 text-sm transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Mobile Theme + Menu */}
          <div className="flex shrink-0 items-center gap-1 lg:hidden">
            <ThemeToggle variant="header" />
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ transitionDelay: '260ms' }}
            className={`header-menu-btn shrink-0 rounded-lg p-2 transition-colors lg:hidden transition-[opacity,transform] duration-700 ease-out ${hasLaunched ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line text-xl`} />
          </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[var(--header-offset,5rem)] z-40 lg:hidden">
          <button
            type="button"
            className="header-mobile-overlay absolute inset-0 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="header-mobile-menu relative z-10 max-h-[calc(100vh-var(--header-offset,5rem))] overflow-y-auto border-t shadow-2xl">
            <nav className="flex w-full flex-col gap-1 px-4 py-5 sm:px-6 md:px-8">
            {sanitizedNavItems.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between">
                  <a
                    href={item.href}
                    target={isExternalHref(item.href) ? '_blank' : undefined}
                    rel={isExternalHref(item.href) ? 'noopener noreferrer' : undefined}
                    className={`flex-1 py-3 text-[15px] font-semibold uppercase tracking-wide transition-colors ${getHeaderMobileLinkClass(theme, isActivePath(item.href))}`}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </a>
                  {item.dropdown && item.dropdown.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenDropdown(openDropdown === item.name ? null : item.name);
                      }}
                      className={`p-2 transition-colors ${theme === 'dark' ? 'text-white/80 hover:text-[#7cd244]' : 'text-[#2d5016]/80 hover:text-[#7cd244]'}`}
                      aria-label="Toggle dropdown"
                    >
                      <i className={`ri-arrow-${openDropdown === item.name ? 'up' : 'down'}-s-line text-lg`}></i>
                    </button>
                  )}
                </div>
                {item.dropdown && item.dropdown.length > 0 && openDropdown === item.name && (
                  <div className="header-mobile-dropdown mt-2 space-y-2 rounded-lg border py-2 pl-4">
                    {item.dropdown.map((dropItem: any) => (
                      <div key={dropItem.name}>
                        {dropItem.hasSubmenu ? (
                          <>
                            <button
                              onClick={() => setOpenDropdown(openDropdown === 'Smart ODR' ? item.name : 'Smart ODR')}
                              className={`flex w-full cursor-pointer items-center justify-between py-1.5 text-left text-sm font-semibold transition-colors hover:text-[#7cd244] ${getHeaderMobileSubLinkClass(theme)}`}
                            >
                              {dropItem.name}
                              <i className={`ri-arrow-${openDropdown === 'Smart ODR' ? 'up' : 'down'}-s-line text-base`}></i>
                            </button>
                            {openDropdown === 'Smart ODR' && dropItem.submenu && (
                              <div className="mt-2 space-y-2 pl-4">
                                {dropItem.submenu.map((subItem: any) => (
                                  <a
                                    key={subItem.name}
                                    href={subItem.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block cursor-pointer py-1.5 text-sm font-semibold transition-colors hover:text-[#7cd244] ${getHeaderMobileSubLinkClass(theme)}`}
                                    {...(subItem.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                                  >
                                    {subItem.name}
                                  </a>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <a
                            href={dropItem.href}
                            onClick={(e) => {
                              handleSectionClick(e, dropItem.href);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`block cursor-pointer py-1.5 text-sm font-semibold transition-colors hover:text-[#7cd244] ${getHeaderMobileSubLinkClass(theme)}`}
                            {...(dropItem.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                          >
                            {dropItem.name}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className={`mt-4 flex justify-center border-t pt-4 ${theme === 'dark' ? 'border-white/10' : 'border-[#dfe9d8]'}`}>
              <ThemeToggle variant="header" />
            </div>
            <a
              href={contactButtonHref}
              className="mt-2 cursor-pointer whitespace-nowrap rounded-full bg-[#7cd244] px-6 py-2.5 text-center text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-[#6db038]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {contactButtonText}
            </a>
          </nav>
        </div>
      </div>
      )}
    </header>
  );
}
