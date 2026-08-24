export type CmsModule = {
  name: string;
  href: string;
  description: string;
  icon: string;
  group: 'site' | 'business' | 'investors' | 'global';
};

export const CMS_MODULE_GROUPS: { id: CmsModule['group']; label: string; description: string }[] = [
  { id: 'site', label: 'Site', description: 'Global chrome and legal pages' },
  { id: 'business', label: 'Business', description: 'Core brand and business pages' },
  { id: 'investors', label: 'Investors', description: 'Investor relations content' },
  { id: 'global', label: 'Global', description: 'News, careers, and contact' },
];

export const CMS_MODULES: CmsModule[] = [
  {
    name: 'Header',
    href: '/admin/dashboard/header-cms',
    description: 'Logo, navigation, and stock ticker',
    icon: 'ri-menu-line',
    group: 'site',
  },
  {
    name: 'Footer',
    href: '/admin/dashboard/footer-cms',
    description: 'Footer links and contact information',
    icon: 'ri-layout-bottom-line',
    group: 'site',
  },
  {
    name: 'Legal Pages',
    href: '/admin/dashboard/legal-cms',
    description: 'Privacy policy and terms of use',
    icon: 'ri-file-shield-line',
    group: 'site',
  },
  {
    name: 'Home',
    href: '/admin/dashboard/home-cms',
    description: 'Business, glance, flip cards, news, and awards',
    icon: 'ri-home-4-line',
    group: 'business',
  },
  {
    name: 'About Us',
    href: '/admin/dashboard/about-cms',
    description: 'Leadership, journey, presence map, and values',
    icon: 'ri-building-line',
    group: 'business',
  },
  {
    name: 'ESG',
    href: '/admin/dashboard/esg-cms',
    description: 'Policies, reports, SDGs, awards, and governance',
    icon: 'ri-leaf-line',
    group: 'business',
  },
  {
    name: 'Ash Utilization',
    href: '/admin/dashboard/ash-utilization-cms',
    description: 'Hero and clients sections',
    icon: 'ri-fire-line',
    group: 'business',
  },
  {
    name: 'Green Mobility',
    href: '/admin/dashboard/green-mobility-cms',
    description: 'Mobility page sections and services',
    icon: 'ri-car-line',
    group: 'business',
  },
  {
    name: 'Venwind Refex',
    href: '/admin/dashboard/venwind-refex-cms',
    description: 'Renewable energy page content',
    icon: 'ri-windy-line',
    group: 'business',
  },
  {
    name: 'Products',
    href: '/admin/dashboard/products-cms',
    description: 'Individual product page content',
    icon: 'ri-box-3-line',
    group: 'business',
  },
  {
    name: 'Investors',
    href: '/admin/dashboard/investors-cms',
    description: 'Reports, disclosures, and investor pages',
    icon: 'ri-line-chart-line',
    group: 'investors',
  },
  {
    name: 'Careers',
    href: '/admin/dashboard/careers-cms',
    description: 'Hero, culture, why Refex, and talent network',
    icon: 'ri-briefcase-line',
    group: 'global',
  },
  {
    name: 'Newsroom',
    href: '/admin/dashboard/newsroom-cms',
    description: 'News, events, and press releases',
    icon: 'ri-newspaper-line',
    group: 'global',
  },
  {
    name: 'Contact',
    href: '/admin/dashboard/contact-cms',
    description: 'Hero, office addresses, and form copy',
    icon: 'ri-mail-line',
    group: 'global',
  },
];

export const SITE_PAGES: { path: string; name: string; cms: string }[] = [
  { path: '/', name: 'Home', cms: '/admin/dashboard/home-cms' },
  { path: '/about-us', name: 'About Us', cms: '/admin/dashboard/about-cms' },
  { path: '/esg', name: 'ESG', cms: '/admin/dashboard/esg-cms' },
  { path: '/careers', name: 'Careers', cms: '/admin/dashboard/careers-cms' },
  { path: '/newsroom', name: 'Newsroom', cms: '/admin/dashboard/newsroom-cms' },
  { path: '/contact', name: 'Contact', cms: '/admin/dashboard/contact-cms' },
  { path: '/ash-utilization', name: 'Ash Utilization', cms: '/admin/dashboard/ash-utilization-cms' },
  { path: '/green-mobility', name: 'Green Mobility', cms: '/admin/dashboard/green-mobility-cms' },
  { path: '/venwind-refex', name: 'Venwind Refex', cms: '/admin/dashboard/venwind-refex-cms' },
  { path: '/investors', name: 'Investors', cms: '/admin/dashboard/investors-cms' },
  { path: '/investors/annual-reports', name: 'Annual Reports', cms: '/admin/dashboard/investors-cms' },
  { path: '/investors/financial-information', name: 'Financial Information', cms: '/admin/dashboard/investors-cms' },
  { path: '/investors/policies', name: 'Investor Policies', cms: '/admin/dashboard/investors-cms' },
  { path: '/investors/credit-ratings', name: 'Credit Ratings', cms: '/admin/dashboard/investors-cms' },
  { path: '/investors/key-managerial-personnel', name: 'Key Managerial Personnel', cms: '/admin/dashboard/investors-cms' },
  { path: '/investors/ipo', name: 'IPO', cms: '/admin/dashboard/investors-cms' },
  { path: '/privacy-policy', name: 'Privacy Policy', cms: '/admin/dashboard/legal-cms' },
  { path: '/terms-of-use', name: 'Terms of Use', cms: '/admin/dashboard/legal-cms' },
  { path: '/product/r22', name: 'R22', cms: '/admin/dashboard/products-cms' },
  { path: '/product/r32', name: 'R32', cms: '/admin/dashboard/products-cms' },
  { path: '/product/r290', name: 'R290', cms: '/admin/dashboard/products-cms' },
  { path: '/product/r404a', name: 'R404A', cms: '/admin/dashboard/products-cms' },
  { path: '/product/r407c', name: 'R407C', cms: '/admin/dashboard/products-cms' },
  { path: '/product/r410a', name: 'R410A', cms: '/admin/dashboard/products-cms' },
  { path: '/product/r600a', name: 'R600A', cms: '/admin/dashboard/products-cms' },
  { path: '/product/hfc-134a', name: 'HFC 134A', cms: '/admin/dashboard/products-cms' },
  { path: '/product/hydrocarbon', name: 'Hydrocarbon', cms: '/admin/dashboard/products-cms' },
  { path: '/product/butane', name: 'Butane', cms: '/admin/dashboard/products-cms' },
  { path: '/product/copper-tubes', name: 'Copper Tubes', cms: '/admin/dashboard/products-cms' },
];
