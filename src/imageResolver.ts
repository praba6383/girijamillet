/// <reference types="vite/client" />

/**
 * Resolves a local path or filename (e.g., "/images/ragi_malt_packaging_1781422356325.jpg")
 * to the unhashed static public path.
 * This guarantees that even dynamically stored paths from localStorage or data.ts
 * resolve to their correct URLs and never break across subsequent builds.
 */
export function resolveProductImage(path: string): string {
  if (!path) return '';
  
  // Return remote URLs or base64 data URIs directly
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  // Extract the filename (e.g., "ragi_malt_packaging_1781422356325.jpg" or "ragi_malt_packaging_1781422356325-B83bF9.jpg")
  const filepath = path.toLowerCase();
  let filename = filepath.split('/').pop() || '';
  
  // Clean up any hashes from the filename if they are present.
  // E.g., "ragi_malt_packaging_1781422356325-hxygg2xa.jpg" -> "ragi_malt_packaging_1781422356325.jpg"
  // Since our original images contain underscores and no hyphens prior to the hash, 
  // any trailing hyphen with alphanumeric sequences is a Vite asset hash.
  const lastHyphenIndex = filename.lastIndexOf('-');
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastHyphenIndex !== -1 && lastDotIndex !== -1 && lastHyphenIndex < lastDotIndex) {
    const potentialHash = filename.substring(lastHyphenIndex + 1, lastDotIndex);
    // Vite hashed names typically have 6-12 characters after the hyphen
    if (potentialHash.length >= 6 && potentialHash.length <= 12) {
      filename = filename.substring(0, lastHyphenIndex) + filename.substring(lastDotIndex);
    }
  }
  
  // Always map to the static, unhashed /images/... directory, which is served out of public/images
  // and copied directly to the build target on all platforms including Netlify.
  return `/images/${filename}`;
}

