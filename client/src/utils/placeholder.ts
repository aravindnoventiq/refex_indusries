/**
 * Generate a simple data URI placeholder image
 * This avoids external dependencies and works offline
 */
export function getPlaceholderImage(width: number, height: number, text: string = 'No Image'): string {
  // Create a simple SVG placeholder as data URI
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`;
  
  // Encode SVG and convert to data URI
  const encodedSvg = encodeURIComponent(svg);
  return `data:image/svg+xml,${encodedSvg}`;
}

