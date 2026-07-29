import { useEffect, useState } from 'react';
import { esgBrandColors } from '../esgLayout';

const NAV_ITEMS = [
  { id: 'sustainability-pillars', label: 'Pillars' },
  { id: 'sustainability-vision-2035', label: 'Vision 2035' },
  { id: 'sustainable-well-being', label: 'Well-being' },
  { id: 'esg-nature-showcase', label: 'Nature' },
  { id: 'sustainable-development-goals', label: 'SDGs' },
  { id: 'un-sdg-actions', label: 'Actions' },
  { id: 'awards-accolades', label: 'Awards' },
  { id: 'collaboration-membership', label: 'Partners' },
  { id: 'esg-policies', label: 'Policies' },
  { id: 'esg-reports', label: 'Reports' },
  { id: 'governance', label: 'Governance' },
  { id: 'hr', label: 'HR' },
] as const;

export default function EsgPageNav() {
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState<string>(NAV_ITEMS[0].id);

  useEffect(() => {
    const hero = document.getElementById('esg-vision');
    if (!hero) {
      setVisible(true);
      return;
    }

    const heroObserver = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.05, rootMargin: '-80px 0px 0px 0px' },
    );
    heroObserver.observe(hero);

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]?.target.id) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { threshold: [0.15, 0.35, 0.55], rootMargin: '-30% 0px -55% 0px' },
    );

    NAV_ITEMS.forEach(({ id }) => {
      const node = document.getElementById(id);
      if (node) sectionObserver.observe(node);
    });

    return () => {
      heroObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => {
    const node = document.getElementById(id);
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      aria-label="ESG page sections"
      className={`fixed inset-x-0 top-[72px] z-40 esg-page-nav border-b border-black/8 bg-white/92 backdrop-blur-md transition-all duration-300 sm:top-[80px] ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="mx-auto flex max-w-[90rem] items-center gap-1 overflow-x-auto px-4 py-2.5 sm:px-6 md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NAV_ITEMS.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              aria-current={isActive ? 'true' : undefined}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 sm:px-3.5 sm:text-[13px] ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'text-[#484848] hover:bg-[#f3f7ef] hover:text-[#1f1f1f]'
              }`}
              style={isActive ? { backgroundColor: esgBrandColors.green } : undefined}
            >
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
