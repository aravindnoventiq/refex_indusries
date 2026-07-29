import { useState, useEffect, type MouseEvent } from 'react';
import { aboutCmsApi } from '../../../services/api';
import { FALLBACK_STICKY_NAV } from '../aboutFallbacks';
import { goToAboutSection } from '../goToAboutSection';
import { aboutSectionContainer } from '../aboutLayout';

interface NavItem {
  id: number;
  name: string;
  href: string;
  sectionId: string;
  order: number;
  isActive: boolean;
}

export default function StickyNav() {
  const [isSticky, setIsSticky] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const [navItems, setNavItems] = useState<NavItem[]>(FALLBACK_STICKY_NAV);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        setLoading(true);
        const data = await aboutCmsApi.getStickyNavItems();
        const activeItems = (data || [])
          .filter((item: NavItem) => item.isActive !== false)
          .sort((a: NavItem, b: NavItem) => (a.order || 0) - (b.order || 0));

        if (activeItems.length > 0) {
          setNavItems(activeItems);
          setActiveTab(activeItems[0].sectionId);
        } else {
          setNavItems(FALLBACK_STICKY_NAV);
          setActiveTab(FALLBACK_STICKY_NAV[0].sectionId);
        }
      } catch {
        setNavItems(FALLBACK_STICKY_NAV);
        setActiveTab(FALLBACK_STICKY_NAV[0].sectionId);
      } finally {
        setLoading(false);
      }
    };

    fetchNavItems();
  }, []);

  useEffect(() => {
    if (navItems.length === 0) return;

    const handleScroll = () => setIsSticky(window.scrollY > 200);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    const els = navItems
      .map((n) => document.getElementById(n.sectionId))
      .filter((el): el is HTMLElement => !!el);

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = (visible?.target as HTMLElement | undefined)?.id;
        if (!id) return;
        setActiveTab(id);
        const chip = document.querySelector<HTMLElement>(
          `[data-about-nav="${CSS.escape(id)}"]`,
        );
        chip?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      },
      { threshold: [0.2, 0.4, 0.55], rootMargin: '-25% 0px -45% 0px' },
    );

    els.forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      io.disconnect();
    };
  }, [navItems]);

  const onNavClick = (e: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setActiveTab(sectionId);
    window.history.replaceState(null, '', `#${sectionId}`);
    goToAboutSection(sectionId);
  };

  if (loading) {
    return (
      <div className="sticky top-[var(--header-offset,5.25rem)] z-40 border-b border-[#6db038]/80 bg-[#7dc244]/95 backdrop-blur-md">
        <div className={`flex h-12 items-center ${aboutSectionContainer}`}>
          <span className="text-sm text-white/90">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        'sticky top-[var(--header-offset,5.25rem)] z-40 border-b border-[#6db038]/80 bg-[#7dc244]/95 backdrop-blur-md transition-shadow duration-300 ' +
        (isSticky ? 'shadow-md shadow-black/10' : '')
      }
    >
      <div className={aboutSectionContainer}>
        <nav className="flex h-12 items-center justify-start gap-1 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] sm:h-14 sm:gap-1.5 lg:justify-end [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => {
            const active = activeTab === item.sectionId;
            return (
              <a
                key={item.id}
                href={item.href}
                data-about-nav={item.sectionId}
                onClick={(e) => onNavClick(e, item.sectionId)}
                className={
                  'shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors duration-200 sm:px-3.5 sm:text-[13px] ' +
                  (active
                    ? 'bg-white text-[#1a1a1a] shadow-sm'
                    : 'text-white/90 hover:bg-white/15 hover:text-white')
                }
              >
                {item.name}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
