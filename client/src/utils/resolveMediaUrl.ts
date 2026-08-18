/**
 * Resolve CMS/media URLs for the browser.
 * Never prefix /uploads, /brand, /esg, etc. with VITE_API_URL (/api) —
 * that breaks images on UAT when the API is mounted under /api.
 *
 * On UAT, nginx often 404s missing /uploads files before Node can redirect.
 * Fall back to production origin so ESG/CMS media still loads.
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
    if (path.startsWith('/uploads/')) {
      const configured = String(import.meta.env.VITE_UPLOADS_FALLBACK_ORIGIN || '').replace(/\/$/, '');
      const onUat =
        typeof window !== 'undefined' &&
        /(^|\.)uat\.|uat\.refex\.co\.in/i.test(window.location.hostname);
      const origin = configured || (onUat ? 'https://refex.co.in' : '');
      if (origin) return `${origin}${path}`;
    }
    return path;
  }

  const base = (apiBaseUrl || '').replace(/\/$/, '');
  return `${base}${path}`;
}

/**
 * Normalize an upload API response path for storage in CMS.
 * Always persist site-relative paths (e.g. /uploads/...), never /api/uploads/...
 */
export function normalizeCmsUploadPath(
  imageUrl?: string | null,
  apiBaseUrl: string = import.meta.env.VITE_API_URL || '',
): string {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:')) {
    try {
      const parsed = new URL(imageUrl);
      if (parsed.pathname.startsWith('/uploads/') || parsed.pathname.startsWith('/api/uploads/')) {
        return parsed.pathname.replace(/^\/api(?=\/uploads\/)/, '');
      }
    } catch {
      /* keep original */
    }
    return imageUrl;
  }

  let path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  const base = (apiBaseUrl || '').replace(/\/$/, '');
  if (base && path.startsWith(base)) {
    path = path.slice(base.length) || '/';
  }
  path = path.replace(/^\/api(?=\/uploads\/)/, '');
  return path;
}
