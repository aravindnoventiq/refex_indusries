/** Business vertical links — header dropdown and footer. */
export const REFEX_MOBILITY_URL = 'https://refexmobility.com/' as const;
export const VENWIND_REFEX_URL = 'https://venwindrefex.com/' as const;
export const READY_MIX_CONCRETE_PATH = '/ready-mix-concrete' as const;

export const REFEX_GROUP_CAREERS_URL = 'https://www.refex.group/careers/' as const;
export const REFEX_GROUP_GALLERY_URL = 'https://www.refex.group/gallery/' as const;
export const REFEX_GROUP_DIVERSITY_URL = 'https://www.refex.group/diversity-inclusion/' as const;

export const BUSINESS_NAV_DROPDOWN = [
  { name: 'Ash Utilization and Coal Handling', href: '/ash-utilization' },
  { name: 'Ready Mix Concrete', href: READY_MIX_CONCRETE_PATH },
  { name: 'Green Mobility', href: REFEX_MOBILITY_URL },
  { name: 'Venwind Refex', href: VENWIND_REFEX_URL },
] as const;

/** Canonical destination for a business vertical (CMS may still store legacy paths). */
export function resolveBusinessLink(title: string, link?: string): string {
  if (/ready mix|rmc/i.test(title)) return READY_MIX_CONCRETE_PATH;
  if (/green mobility|refex mobility/i.test(title)) return REFEX_MOBILITY_URL;
  if (/venwind/i.test(title)) return VENWIND_REFEX_URL;
  if (/ash/i.test(title)) return '/ash-utilization';
  return link || '/';
}
