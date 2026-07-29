/**
 * Convert text to URL-friendly slug
 * Example: "Financial Information" -> "financial-information"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate investor page URL from link name
 * Example: "Financial Information" -> "/investors/financial-information/"
 */
export function generateInvestorPageUrl(linkName: string): string {
  const slug = slugify(linkName);
  return `/investors/${slug}/`;
}

