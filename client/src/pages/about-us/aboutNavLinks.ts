/** About Us page sections — used for header dropdown, footer links, and sticky nav. */
export const ABOUT_US_SECTIONS = [
  { name: 'About Us', href: '/about-us#about', sectionId: 'about' },
  { name: 'Mission & Vision', href: '/about-us#mission-vision', sectionId: 'mission-vision' },
  { name: 'Core Values', href: '/about-us#core-values', sectionId: 'core-values' },
  { name: 'Board Members', href: '/about-us#board-members', sectionId: 'board-members' },
  { name: 'Committees', href: '/about-us#committees', sectionId: 'committees' },
  { name: 'Leadership Team', href: '/about-us#leadership-team', sectionId: 'leadership-team' },
  { name: 'Our Presence', href: '/about-us#our presence', sectionId: 'our presence' },
  { name: 'Our Journey', href: '/about-us#journey', sectionId: 'journey' },
] as const;

export const ABOUT_US_NAV_DROPDOWN = ABOUT_US_SECTIONS.map(({ name, href }) => ({
  name,
  href,
}));

/** Footer About Us column — page sections plus external Diversity link. */
export const FOOTER_ABOUT_US_LINKS = [
  ...ABOUT_US_NAV_DROPDOWN,
  {
    name: 'Diversity & Inclusion',
    href: 'https://www.refex.group/diversity-inclusion/',
  },
];

export const FALLBACK_STICKY_NAV = ABOUT_US_SECTIONS.map((section, index) => ({
  id: index,
  name: section.name,
  href: `#${section.sectionId}`,
  sectionId: section.sectionId,
  order: index,
  isActive: true,
}));
