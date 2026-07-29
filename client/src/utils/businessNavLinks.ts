/** Business vertical links — header dropdown and footer. */
export const REFEX_MOBILITY_URL = 'https://refexmobility.com/' as const;
export const VENWIND_REFEX_URL = 'https://venwindrefex.com/' as const;

export const BUSINESS_NAV_DROPDOWN = [
  { name: 'Ash Utilization and Coal Handling', href: '/ash-utilization' },
  { name: 'Green Mobility', href: REFEX_MOBILITY_URL },
  { name: 'Venwind Refex', href: VENWIND_REFEX_URL },
] as const;

/** Canonical destination for a business vertical (CMS may still store legacy paths). */
export function resolveBusinessLink(title: string, link?: string): string {
  if (/green mobility|refex mobility/i.test(title)) return REFEX_MOBILITY_URL;
  if (/venwind/i.test(title)) return VENWIND_REFEX_URL;
  return link || '/';
}
