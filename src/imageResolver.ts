/// <reference types="vite/client" />

import ragiMaltPack from './assets/images/ragi_malt_pack_1781500888382.jpg';
import abcMaltPack from './assets/images/abc_malt_pack_1781500906558.jpg';
import milletNoodlesPack from './assets/images/millet_noodles_pack_1781500925376.jpg';
import dosaMixPack from './assets/images/dosa_mix_pack_1781500943255.jpg';
import milletFlakesPack from './assets/images/millet_flakes_pack_1781500959034.jpg';

/**
 * Resolves a local path, filename, or older compiled asset path
 * to a high-resolution, fast loading, and rock-solid premium generated image or CDN URL.
 * By using ES imports, Vite guarantees that these files compile and deploy perfectly.
 */
export function resolveProductImage(path: string): string {
  if (!path) return '';
  
  // Return remote URLs or base64 data URIs directly
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  const filepath = path.toLowerCase();
  
  // Look for known keywords in the filename/path to serve specific, premium imagery
  if (filepath.includes('ragi_malt')) {
    return ragiMaltPack;
  }
  if (filepath.includes('abc_malt')) {
    return abcMaltPack;
  }
  if (filepath.includes('organic_poha') || filepath.includes('poha')) {
    return milletFlakesPack;
  }
  if (filepath.includes('karunguruvai')) {
    return milletFlakesPack;
  }
  if (filepath.includes('stamina_flakes') || filepath.includes('samba_flakes') || filepath.includes('mappillai')) {
    return milletFlakesPack;
  }
  if (filepath.includes('jowar_noodles') || filepath.includes('jowar-noodles')) {
    return milletNoodlesPack;
  }
  if (filepath.includes('hakka_noodles') || filepath.includes('hakka-noodles')) {
    return milletNoodlesPack;
  }
  if (filepath.includes('sevai') || filepath.includes('semia') || filepath.includes('vermicelli')) {
    return milletNoodlesPack;
  }
  if (filepath.includes('palak_noodles') || filepath.includes('palak-noodles')) {
    return milletNoodlesPack;
  }
  if (filepath.includes('samba_rava') || filepath.includes('samba-rava')) {
    return ragiMaltPack;
  }
  if (filepath.includes('barnyard_millet_rava') || filepath.includes('barnyard-rava') || filepath.includes('barnyard_rava')) {
    return ragiMaltPack;
  }
  if (filepath.includes('pacha_paruppu') || filepath.includes('green_gram') || filepath.includes('mung_dosa')) {
    return dosaMixPack;
  }
  if (filepath.includes('kambu_dosai') || filepath.includes('kambu-dosai') || filepath.includes('kambu_dosa')) {
    return dosaMixPack;
  }
  if (filepath.includes('idly_podi') || filepath.includes('idly-podi') || filepath.includes('milagai_podi')) {
    return dosaMixPack;
  }
  if (filepath.includes('millet_combo') || filepath.includes('combo')) {
    return dosaMixPack;
  }

  // Fallback to a warm organic ingredients table design
  return dosaMixPack || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600';
}

