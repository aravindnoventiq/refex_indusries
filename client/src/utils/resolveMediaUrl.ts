/**
 * Resolve CMS/media URLs for the browser.
 * Never prefix /uploads, /brand, /esg, etc. with VITE_API_URL (/api) —
 * that breaks images on UAT when the API is mounted under /api.
 */
export function resolveMediaUrl(
  url?: string | null,
  apiBaseUrl: string = import.meta.env.VITE_API_URL || '',
): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  const path = url.startsWith('/') ? url : `/${url}`;
  const staticPrefixes = [
    '/uploads/',
    '/brand/',
    '/esg/',
    '/wp-content/',
    '/assets/',
    '/home/',
    '/images/',
  ];
  if (staticPrefixes.some((p) => path.startsWith(p))) {
    return path;
  }

  const base = (apiBaseUrl || '').replace(/\/$/, '');
  return `${base}${path}`;
}
