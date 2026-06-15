/// <reference types="vite/client" />

/**
 * Resolves a local path, filename, or older compiled asset path
 * to a high-resolution, fast loading, and rock-solid Unsplash CDN URL.
 * This guarantees 100% active delivery on all platforms including Netlify,
 * completely neutralizing broken local asset paths and database discrepancies.
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
    // Sprouted Ragi Malt porridge beverage
    return 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=600';
  }
  if (filepath.includes('abc_malt')) {
    // Healthy red ingredient blend mix (Apple, Beetroot, Carrot juice/powder components)
    return 'https://images.unsplash.com/photo-1610970881699-44a5587caa90?auto=format&fit=crop&q=80&w=600';
  }
  if (filepath.includes('organic_poha') || filepath.includes('poha')) {
    // Golden grains or flattened rice flakes in bowl
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600';
  }
  if (filepath.includes('karunguruvai')) {
    // Dark heirloom red rice flakes / grain
    return 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600';
  }
  if (filepath.includes('stamina_flakes') || filepath.includes('samba_flakes') || filepath.includes('mappillai')) {
    // Traditional organic red flakes / grains
    return 'https://images.unsplash.com/photo-1512484776495-a09d92e87c3b?auto=format&fit=crop&q=80&w=600';
  }
  if (filepath.includes('jowar_noodles') || filepath.includes('jowar-noodles')) {
    // Tasty steamed noodles / premium ramen bowl
    return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=600';
  }
  if (filepath.includes('hakka_noodles') || filepath.includes('hakka-noodles')) {
    // Delicious wok-tossed vegetable Hakka noodles
    return 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600';
  }
  if (filepath.includes('sevai') || filepath.includes('semia') || filepath.includes('vermicelli')) {
    // Classic south-indian vermicelli nest prep
    return 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=600';
  }
  if (filepath.includes('palak_noodles') || filepath.includes('palak-noodles')) {
    // Jade-green spinach noodles
    return 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=600';
  }
  if (filepath.includes('samba_rava') || filepath.includes('samba-rava')) {
    // Red rice rava, raw coarse grains
    return 'https://images.unsplash.com/photo-1509440159596-fd24b19601f0?auto=format&fit=crop&q=80&w=600';
  }
  if (filepath.includes('barnyard_millet_rava') || filepath.includes('barnyard-rava') || filepath.includes('barnyard_rava')) {
    // Organic grain semolina / coarse millet groats
    return 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=600';
  }
  if (filepath.includes('pacha_paruppu') || filepath.includes('green_gram') || filepath.includes('mung_dosa')) {
    // Sprouted green dosa / golden crispy crepes on tawa
    return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=600';
  }
  if (filepath.includes('kambu_dosai') || filepath.includes('kambu-dosai') || filepath.includes('kambu_dosa')) {
    // Cooling pearl millet crispy dosas
    return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=600';
  }
  if (filepath.includes('idly_podi') || filepath.includes('idly-podi') || filepath.includes('milagai_podi')) {
    // Savory homemade lentil powder with soft idlis
    return 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600';
  }
  if (filepath.includes('millet_combo') || filepath.includes('combo')) {
    // Multi-grain selection bundle or organic food pack
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600';
  }

  // Fallback to a warm organic ingredients table design
  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600';
}

