/// <reference types="vite/client" />

// Dynamic asset mapping for Vite React/TypeScript production builds
// In production, Vite generates hashed filenames for images in src/assets/images/.
// This resolver uses import.meta.glob to build a filename-to-built-URL map,
// guaranteeing that even dynamically stored paths from localStorage or data.ts
// resolve to their correct production URLs and never break.

const assetImages: Record<string, string> = {};

try {
  // Eagerly glob all images in src/assets/images so they are bundled into the production build
  const glob = (import.meta as any).glob('/src/assets/images/**/*.{jpg,jpeg,png,webp,svg,gif}', { eager: true, import: 'default' }) as Record<string, string>;
  Object.entries(glob).forEach(([key, value]) => {
    const filename = key.split('/').pop() || '';
    if (filename) {
      assetImages[filename.toLowerCase()] = value;
    }
  });
} catch (e) {
  console.warn('Failed to load asset images glob:', e);
}

/**
 * Resolves a local path or filename (e.g., "/images/ragi_malt_packaging_1781422356325.jpg")
 * to the compiled Vite production-ready URL.
 */
export function resolveProductImage(path: string): string {
  if (!path) return '';
  
  // Return remote URLs or base64 data URIs directly
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  // Extract the filename (e.g., "ragi_malt_packaging_1781422356325.jpg")
  const filename = path.split('/').pop()?.toLowerCase() || '';
  
  // If we have a compiled asset matching this filename, use it!
  if (assetImages[filename]) {
    return assetImages[filename];
  }
  
  // Fallback to the original path otherwise
  return path;
}
