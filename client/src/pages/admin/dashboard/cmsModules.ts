export type CmsModule = {
  name: string;
  href: string;
  description: string;
  icon: string;
  hover: string;
};

export const CMS_MODULES: CmsModule[] = [
  {
    name: 'Home',
    href: '/admin/dashboard/home-cms',
    description: 'Hero, about, business, news, and awards',
    icon: 'ri-home-4-line text-blue-600',
    hover: 'hover:border-blue-500 hover:bg-blue-50',
  },
  {
    name: 'About Us',
    href: '/admin/dashboard/about-cms',
    description: 'Leadership, journey, presence map, and values',
    icon: 'ri-building-line text-green-600',
    hover: 'hover:border-green-500 hover:bg-green-50',
  },
  {
    name: 'ESG',
    href: '/admin/dashboard/esg-cms',
    description: 'Sustainability content, SDGs, policies, and reports',
    icon: 'ri-leaf-line text-emerald-600',
    hover: 'hover:border-emerald-500 hover:bg-emerald-50',
  },
  {
    name: 'Careers',
    href: '/admin/dashboard/careers-cms',
    description: 'Hero, culture, why Refex, and talent network',
    icon: 'ri-briefcase-line text-rose-600',
    hover: 'hover:border-rose-500 hover:bg-rose-50',
  },
  {
    name: 'Newsroom',
    href: '/admin/dashboard/newsroom-cms',
    description: 'News, events, and press releases',
    icon: 'ri-newspaper-line text-orange-600',
    hover: 'hover:border-orange-500 hover:bg-orange-50',
  },
  {
    name: 'Contact',
    href: '/admin/dashboard/contact-cms',
    description: 'Hero, office addresses, and form copy',
    icon: 'ri-mail-line text-indigo-600',
    hover: 'hover:border-indigo-500 hover:bg-indigo-50',
  },
  {
    name: 'Investors',
    href: '/admin/dashboard/investors-cms',
    description: 'Reports, disclosures, and investor pages',
    icon: 'ri-line-chart-line text-amber-600',
    hover: 'hover:border-amber-500 hover:bg-amber-50',
  },
  {
    name: 'Ash Utilization',
    href: '/admin/dashboard/ash-utilization-cms',
    description: 'Ash handling page sections',
    icon: 'ri-fire-line text-yellow-600',
    hover: 'hover:border-yellow-500 hover:bg-yellow-50',
  },
  {
    name: 'Green Mobility',
    href: '/admin/dashboard/green-mobility-cms',
    description: 'Mobility page sections and services',
    icon: 'ri-car-line text-lime-600',
    hover: 'hover:border-lime-500 hover:bg-lime-50',
  },
  {
    name: 'Venwind Refex',
    href: '/admin/dashboard/venwind-refex-cms',
    description: 'Renewable energy page content',
    icon: 'ri-windy-line text-teal-600',
    hover: 'hover:border-teal-500 hover:bg-teal-50',
  },
  {
    name: 'Refrigerant Gas',
    href: '/admin/dashboard/refrigerant-gas-cms',
    description: 'Gas products, impact, and clients',
    icon: 'ri-flask-line text-sky-600',
    hover: 'hover:border-sky-500 hover:bg-sky-50',
  },
  {
    name: 'Products',
    href: '/admin/dashboard/products-cms',
    description: 'Product landing hero and related copy',
    icon: 'ri-box-3-line text-purple-600',
    hover: 'hover:border-purple-500 hover:bg-purple-50',
  },
  {
    name: 'Header',
    href: '/admin/dashboard/header-cms',
    description: 'Logo, navigation, and stock ticker',
    icon: 'ri-menu-line text-cyan-600',
    hover: 'hover:border-cyan-500 hover:bg-cyan-50',
  },
  {
    name: 'Footer',
    href: '/admin/dashboard/footer-cms',
    description: 'Footer links and contact information',
    icon: 'ri-layout-bottom-line text-slate-600',
    hover: 'hover:border-slate-500 hover:bg-slate-50',
  },
  {
    name: 'Legal Pages',
    href: '/admin/dashboard/legal-cms',
    description: 'Privacy policy and terms of use',
    icon: 'ri-file-shield-line text-gray-700',
    hover: 'hover:border-gray-500 hover:bg-gray-50',
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

