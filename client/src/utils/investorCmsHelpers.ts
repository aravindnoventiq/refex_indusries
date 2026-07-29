/** Treat investor CMS records as active unless explicitly disabled. */
export function isInvestorCmsActive(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  const record = data as { isActive?: boolean; is_active?: boolean };
  const active = record.isActive ?? record.is_active;
  return active !== false;
}
