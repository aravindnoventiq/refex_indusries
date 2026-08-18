import { resolveMediaUrl } from '../../utils/resolveMediaUrl';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export function getFullUrl(url?: string): string | undefined {
  if (!url) return undefined;
  return resolveMediaUrl(url, API_BASE_URL);
}
