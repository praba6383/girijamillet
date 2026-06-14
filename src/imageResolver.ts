/// <reference types="vite/client" />

// Dynamic asset mapping for Vite React/TypeScript production builds
// In production, Vite generates hashed filenames for images in src/assets/images/.
// This resolver uses import.meta.glob to build a filename-to-built-URL map,
// guaranteeing that even dynamically stored paths from localStorage or data.ts
// resolve to their correct production URLs and never break.

const assetImages: Record<string, string> = {};

try {
  // Eagerly glob all images in src/assets/images so they are bundled into the production build
  const glob = import.meta.glob<string>('./assets/images/**/*.{jpg,jpeg,png,webp,svg,gif}', { eager: true, import: 'default' });
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
  
  // Extract the filename (e.g., "ragi_malt_packaging_1781422356325.jpg" or "ragi_malt_packaging_1781422356325-B83bF9.jpg")
  const filepath = path.toLowerCase();
  const filename = filepath.split('/').pop() || '';
  
  // 1. Direct match
  if (assetImages[filename]) {
    return assetImages[filename];
  }
  
  // 2. Normalize and check if there's a hash. E.g. "karunguruvai_flakes_1781431075326-b83bf9.jpg"
  // Since our original images in the repo only contain underscores and no hyphens,
  // any trailing hyphen with alphanumeric sequences is a Vite asset hash.
  const lastHyphenIndex = filename.lastIndexOf('-');
  const lastDotIndex = filename.lastIndexOf('.');
  
  if (lastHyphenIndex !== -1 && lastDotIndex !== -1 && lastHyphenIndex < lastDotIndex) {
    const originalName = filename.substring(0, lastHyphenIndex) + filename.substring(lastDotIndex);
    if (assetImages[originalName]) {
      return assetImages[originalName];
    }
  }

  // 3. Fallback fuzzy prefix matching
  // In case of any other hash pattern, see if any of our original filenames is a prefix/substring
  for (const origKey of Object.keys(assetImages)) {
    const baseKey = origKey.substring(0, origKey.lastIndexOf('.'));
    if (baseKey && filename.includes(baseKey)) {
      return assetImages[origKey];
    }
  }
  
  // 4. Return the original path as a safe fallback
  return path;
}
