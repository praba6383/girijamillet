import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';
import RecipeSection from './components/RecipeSection';
import FAQSupport from './components/FAQSupport';
import Newsletter from './components/Newsletter';
import Logo from './components/Logo';
import AdminPanel from './components/AdminPanel';
import { PRODUCTS, RECIPES, MILLETS_INFO, GIRIJA_CONTACT, GIRIJA_INSTAGRAM, GIRIJA_EMAIL } from './data';
import { Product, CartItem, Recipe } from './types';
import { 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Sprout, 
  Smile, 
  Timer, 
  ListOrdered, 
  HelpCircle, 
  ExternalLink,
  MessageCircle,
  ThumbsUp,
  Flame,
  Award,
  CircleCheck,
  Wheat,
  Search,
  ShoppingCart
} from 'lucide-react';

import { resolveProductImage } from './imageResolver';

function sanitizeProductImage(p: Product): Product {
  let updatedImage = p.image || '';
  
  // Specific fallback/replacements for old unsplash/stale images
  if (p.id === 'karunguruvai-flakes' && updatedImage.includes('unsplash.com/photo-1509440159596-0249088772ff')) {
    updatedImage = '/images/karunguruvai_flakes_1781431075326.jpg';
  }
  if (p.id === 'mapillai-samba-flakes' && updatedImage.includes('unsplash.com/photo-1612927601601-6638404737ce')) {
    updatedImage = '/images/mappillai_stamina_flakes_1781431060505.jpg';
  }
  if (p.id === 'mapillai-samba-rava' && updatedImage.includes('unsplash.com/photo-1517741900358-cda6dcafd502')) {
    updatedImage = '/images/mappillai_samba_rava_1781431043965.jpg';
  }
  if (p.id === 'barnyard-rava' && updatedImage.includes('unsplash.com/photo-1590080875515-8a3a8dc5735e')) {
    updatedImage = '/images/barnyard_millet_rava_1781431023140.jpg';
  }
  return { ...p, image: resolveProductImage(updatedImage) };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'recipes' | 'about' | 'glossary' | 'admin'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initialize products from local storage, defaulting to static catalog constants
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('girija_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map(p => sanitizeProductImage(p));
      }
      return PRODUCTS.map(p => sanitizeProductImage(p));
    } catch (e) {
      return PRODUCTS.map(p => sanitizeProductImage(p));
    }
  });

  // Preserve product catalog additions/changes in local storage
  useEffect(() => {
    localStorage.setItem('girija_products', JSON.stringify(products));
  }, [products]);

  // Initialize cart from local storage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('girija_cart');
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        return parsed.map(item => ({
          ...item,
          product: sanitizeProductImage(item.product)
        }));
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  // Preserve cart changes
  useEffect(() => {
    localStorage.setItem('girija_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Compute available product categories dynamic checklist
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  // Filter products by category & search query
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.tamilName && product.tamilName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase())) ||
        product.benefits.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cart action handlers
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.product.id === product.id);
      if (existing) {
        return prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
    // Triggers feedback
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const handleNavigateToShop = (category: string, productId?: string) => {
    setActiveTab('shop');
    setSelectedCategory(category);
    if (productId) {
      setSearchQuery('');
      setTimeout(() => {
        const element = document.getElementById(`product-card-${productId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-2', 'ring-brand-green-600', 'ring-offset-2');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-brand-green-600', 'ring-offset-2');
          }, 3500);
        }
      }, 300);
    }
  };

  const handleSearchGlossaryAndShop = (milletName: string) => {
    setSearchQuery(milletName);
    setActiveTab('shop');
    setSelectedCategory('All');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div id="root-container" className="min-h-screen bg-[#FDFCF8] flex flex-col font-sans text-[#3D3D2F]">
      
      {/* Header component */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItemsCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        categories={categories}
      />

      {/* Main viewport Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: HOME PANEL */}
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fadeIn text-left">
            
            {/* HERO SECTION DESIGN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white rounded-[40px] p-6 sm:p-12 border border-gray-100 shadow-3xs relative overflow-hidden">
              {/* Soft decorative visual circles */}
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-green-50/40 blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-amber-50/60 blur-2xl -z-10" />

              <div className="lg:col-span-7 space-y-6">
                
                {/* USP highlight tags */}
                <div className="inline-flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 bg-brand-green-50 text-brand-green-700 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    <Sprout className="w-3.5 h-3.5" />
                    100% Traditional & Organic
                  </span>
                  <span className="flex items-center gap-1.5 bg-amber-50 text-brand-amber-600 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5" />
                    Quality Certified
                  </span>
                </div>

                {/* Main Heading styled with Serif Elegance */}
                <div className="space-y-3">
                  <h1 className="font-serif text-4xl sm:text-6xl font-black text-brand-green-800 tracking-tight leading-none">
                    Uncompromised Care, <br />
                    <span className="text-brand-amber-600">Pure Millet Goodness.</span>
                  </h1>
                  <p className="font-display text-base sm:text-xl font-semibold text-gray-600 tracking-wide">
                    சுவைகளும் சத்துக்களும் நிறைந்த இயற்கை சிறுதானியங்கள்
                  </p>
                </div>

                <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl">
                  Welcome to <strong>Girija Millets</strong>. We craft nutrient-rich, sprouted ragi malts, vibrant fruit malths, non-fried vegetable millet noodles, coarse grain ravas, and traditional idly podis. Handpicked, washed, slow-roasted, and carefully packaged with zero chemical preservatives or synthetic colors.
                </p>

                {/* Action CTA points */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    onClick={() => handleNavigateToShop('All')}
                    className="bg-brand-green-700 hover:bg-brand-green-800 text-white font-display text-sm font-bold px-8 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-97 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Browse Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab('recipes')}
                    className="border border-gray-250 hover:border-brand-green-600 text-gray-700 hover:text-brand-green-700 bg-white font-display text-sm font-bold px-8 py-4 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Traditional Recipe Blog</span>
                  </button>
                </div>

                {/* Core Brand Merits (Under icons as in original Image 1 and 9) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <CircleCheck className="w-4 h-4 text-brand-green-600 shrink-0" />
                    <span className="text-[11px] text-gray-600 font-bold">100% Natural</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CircleCheck className="w-4 h-4 text-brand-green-600 shrink-0" />
                    <span className="text-[11px] text-gray-600 font-bold">No Synthetic Colors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CircleCheck className="w-4 h-4 text-brand-green-600 shrink-0" />
                    <span className="text-[11px] text-gray-600 font-bold">No Preservatives</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CircleCheck className="w-4 h-4 text-brand-green-600 shrink-0" />
                    <span className="text-[11px] text-gray-600 font-bold">Kids Safe Food</span>
                  </div>
                </div>

              </div>

              {/* Graphical representation of grains + product packet collage */}
              <div className="lg:col-span-5 flex flex-col justify-center items-center">
                <div className="relative w-full max-w-sm aspect-square bg-[#f4f7f4]/60 border border-brand-green-100/50 rounded-full flex items-center justify-center p-6 shadow-4xs">
                  
                  {/* Floating badge inside visual space */}
                  <div className="absolute top-4 right-4 bg-yellow-400 text-brand-green-900 font-display text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md rotate-12 z-10 uppercase tracking-widest animate-pulse">
                    100% Organic
                  </div>

                  {/* SVG brand circular logo replication */}
                  <div className="bg-white rounded-full p-4 shadow-lg border border-gray-100 aspect-square flex flex-col items-center justify-center text-center w-full max-w-[280px] hover:scale-103 transition-transform duration-500">
                    <Logo size={80} showSubtitle={false} />
                    <div className="border-t border-gray-150/60 mt-3 pt-3.5 w-[85%]">
                      <p className="font-serif text-sm font-bold text-brand-green-800">
                        "ஒவ்வொரு சிப்பிலும் ஆரோக்கியம்"
                      </p>
                      <p className="font-sans text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-1">
                        Health in Every Sip
                      </p>
                    </div>
                  </div>

                  {/* Leaf detail layers floating */}
                  <div className="absolute -bottom-4 right-10 p-3 bg-white border border-gray-100 rounded-2xl shadow-md flex items-center gap-2 animate-bounce">
                    <div className="p-1 bg-brand-amber-50 rounded-lg">
                      <Wheat className="w-4 h-4 text-brand-amber-600" />
                    </div>
                    <span className="font-display text-[11px] font-bold text-gray-700">Premium Flakes</span>
                  </div>

                </div>
              </div>

            </div>

            {/* QUICK SECTIONS LINK-PAD (Bento style) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature 1: Health Drink Mix Sprouted Malt */}
              <div className="bg-gradient-to-br from-amber-50/80 to-white border border-amber-100/60 rounded-3xl p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-brand-amber-600" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gray-900">Sprouted Ragi Malt</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Our classical formulation packed with iron, minerals, and plant-based calcium (344mg/100g). Rich bone structural recovery for children and elderly.
                  </p>
                </div>
                <button
                  onClick={() => handleNavigateToShop('Health Malts', 'ragi-malt')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-brand-amber-600 hover:text-brand-amber-700 transition px-1 cursor-pointer text-left"
                >
                  <span>See Preparation Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Feature 2: ABC fruit-root wellness booster */}
              <div className="bg-gradient-to-br from-rose-50/80 to-white border border-rose-100/60 rounded-3xl p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-rose-100/80 text-rose-850 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gray-900">Apple Beetroot Carrot</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    ABC Health Drink Mix. Fresh organic dehydrated root veggies and organic red apples blended with almonds. Promotes face glow, skin cell health, and blood circulation.
                  </p>
                </div>
                <button
                  onClick={() => handleNavigateToShop('Health Malts', 'abc-malt')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-rose-700 hover:text-rose-800 transition px-1 cursor-pointer text-left"
                >
                  <span>See Benefits Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Feature 3: Kids Special Non-Fried Noodles */}
              <div className="bg-gradient-to-br from-emerald-50/80 to-white border border-emerald-100/60 rounded-3xl p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-850 flex items-center justify-center">
                    <Smile className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gray-900">Kids Veggie Millet Noodles</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Say goodbye to deep-fried palm-oil refined flour ramen! Try our healthy air-dried Carrot, Beetroot, Tomato, and Palak spinach noodles, ready with full natural health spices.
                  </p>
                </div>
                <button
                  onClick={() => handleNavigateToShop('Millet Noodles')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-brand-green-700 hover:text-brand-green-800 transition px-1 cursor-pointer text-left"
                >
                  <span>See 4 Vegetable Noodles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* FEATURED BEST-SELLERS CATALOG LINEUP */}
            <div className="space-y-6">
              <div className="flex items-end justify-between border-b border-gray-100 pb-3">
                <div className="text-left">
                  <span className="font-display text-[10px] font-bold text-brand-green-700 uppercase tracking-widest block">
                    Our Recommendations
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
                    Popular Client Favorites
                  </h2>
                </div>
                <button
                  onClick={() => handleNavigateToShop('All')}
                  className="inline-flex items-center gap-1 font-display text-xs font-bold text-brand-green-700 hover:text-brand-amber-600 transition-colors cursor-pointer"
                >
                  <span>See Entire Shop</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.filter(p => p.isPopular).slice(0, 4).map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    cartCount={cartItems.find(item => item.product.id === product.id)?.quantity || 0}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </div>
            </div>

            {/* COMBO PROMOTION PROMISE BANNER (Image 8 reference) */}
            <div className="bg-[#f0ece6] rounded-[36px] p-6 sm:p-10 border border-[#e1dcd5] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-[#dfd9ce] text-gray-800 font-display text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  🎉 Special Value Bundle
                </div>
                <h3 className="font-serif text-2xl sm:text-3.5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  Healthy & Delicious Combo Offer — Only ₹349!
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
                  Ready to upgrade your pantry? Buy our curated introductory combo containing <strong>Sprouted Pacha Paruppu Dosa Mix</strong> (250g), <strong>Kambu (Pearl Millet) Dosa Mix</strong> (250g), <strong>Siru Thaniyangal Chapathi Flour</strong> (500g), and a bag of <strong>Premium Millet Veggie Noodles</strong>.
                </p>
                
                {/* Specific bullets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 font-semibold pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-amber-600">✔</span> No Artificial Preservatives
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-amber-600">✔</span> No Synthetic Coloring
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-amber-600">✔</span> Prepared with pure farm-fresh millets
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-amber-600">✔</span> Suitable choice for diabetic recovery
                  </div>
                </div>

              </div>

              <div className="lg:col-span-4 flex flex-col justify-center items-center">
                <div className="bg-white p-5 rounded-2xl border border-gray-150/40 text-center w-full max-w-[280px] shadow-sm">
                  <span className="font-display text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Limited Combo</span>
                  <span className="font-serif text-3xl font-extrabold text-brand-green-800 block mt-1">₹349 Only</span>
                  <span className="text-[10px] text-gray-400 block line-through">Ordinary Price: ₹465</span>
                  
                  <button
                    onClick={() => handleNavigateToShop('All', 'millet-combo-349')}
                    className="w-full bg-brand-green-700 hover:bg-brand-green-800 text-white font-display text-xs font-bold py-3 px-4 rounded-xl mt-4 block transition-all hover:scale-[1.02]"
                  >
                    View Combo Details
                  </button>
                </div>
              </div>
            </div>

            {/* RECIPES TEASER */}
            <div className="space-y-6">
              <div className="flex items-end justify-between border-b border-gray-100 pb-3">
                <div className="text-left">
                  <span className="font-display text-[10px] font-bold text-brand-green-700 uppercase tracking-widest block">
                    Kitchen Inspirations
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
                    Traditional Millet Kitchen Recipes
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('recipes')}
                  className="font-display text-xs font-bold text-brand-green-700 hover:text-brand-amber-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>See All Recipes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {RECIPES.slice(0, 2).map(recipe => (
                  <div
                    key={recipe.id}
                    className="bg-white border border-gray-100 rounded-3xl overflow-hidden p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer text-left"
                    onClick={() => setActiveTab('recipes')}
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                      <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-[#b8860b] font-mono font-bold leading-none block mb-1">{recipe.prepTime} • {recipe.difficulty}</span>
                        <h4 className="font-serif text-base font-bold text-gray-900 leading-tight truncate">{recipe.title}</h4>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-snug">{recipe.description}</p>
                      </div>
                      <span className="text-[11px] text-brand-green-700 font-bold flex items-center gap-1.5 mt-2">
                        Get Ingredients List <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NEWSLETTER FORM SECTION */}
            <Newsletter />

            {/* LOGISTICS BENEFITS INFRA */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-brand-green-50/20 p-8 rounded-[32px] border border-brand-green-100/50 text-center">
              <div className="space-y-2">
                <div className="font-display text-lg font-bold text-brand-green-800">📦 Courier Shipping</div>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Fast dispatch and delivery tracking across Tamil Nadu and all of India. Parcels wrapped in sturdy dry packaging.
                </p>
              </div>
              <div className="space-y-2 border-y sm:border-y-0 sm:border-x border-brand-green-100/40 py-4 sm:py-0">
                <div className="font-display text-lg font-bold text-brand-green-800">✅ Quality Checked</div>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Prepared under strict food safety and high quality guidelines. Hygienically prepared in small customized batches.
                </p>
              </div>
              <div className="space-y-2">
                <div className="font-display text-lg font-bold text-brand-green-800">💬 Custom Order Help</div>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Send orders dynamically on WhatsApp. Get fast quotes on bulk requests for school functions, retail shops, or corporate events.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: SHOP CATALOG TAB */}
        {activeTab === 'shop' && (
          <div className="space-y-10 animate-fadeIn text-left">
            
            {/* Banner block containing Title, Search feedback, Category scroll bar */}
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="text-left space-y-1">
                  <span className="font-display text-xs font-bold text-brand-green-700 uppercase tracking-widest block">
                    Girija Millets Pantry
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Millet Store & Food Malt Items
                  </h2>
                </div>

                {/* Clear search indicator */}
                {searchQuery && (
                  <div className="flex items-center gap-2 bg-brand-amber-50 border border-brand-amber-200 text-brand-amber-800 px-3 py-1.5 rounded-full text-xs font-semibold">
                    <span>Active Search: "{searchQuery}"</span>
                    <button onClick={() => setSearchQuery('')} className="hover:text-red-500 font-bold ml-1">✕</button>
                  </div>
                )}
              </div>

              {/* Category Filter Chips Scrolling lists */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-100">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`font-display text-xs font-bold px-4 py-2.5 rounded-full border cursor-pointer transition-all ${
                    selectedCategory === 'All'
                      ? 'bg-brand-green-700 text-white border-brand-green-700'
                      : 'bg-white text-gray-500 border-gray-150 hover:bg-gray-50 hover:text-brand-green-700'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`font-display text-xs font-bold px-4 py-2.5 rounded-full border cursor-pointer transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-brand-green-700 text-white border-brand-green-700'
                        : 'bg-white text-gray-500 border-gray-150 hover:bg-gray-50 hover:text-brand-green-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>

            {/* Filter Results Checklist */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-white border border-gray-100 rounded-[32px] shadow-3xs max-w-md mx-auto space-y-4">
                <div className="p-4 bg-red-50 text-red-600 rounded-full w-14 h-14 flex items-center justify-center mx-auto text-lg">⚠️</div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-800">No Millet Products Match your Query</h3>
                  <p className="text-gray-400 text-xs mt-1">Make sure spelling matches 'sprouted', 'malt', 'noodles', 'flakes', or 'podi'. Try clearing your query to see full list.</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="bg-brand-green-600 hover:bg-brand-green-700 text-white font-display text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer transition-all"
                >
                  Reset Shop Catalogue
                </button>
              </div>
            ) : (
              /* Products dynamic grid */
              <div className="space-y-6">
                <div className="text-xs text-gray-400 font-mono">
                  Showing {filteredProducts.length} premium organic millet options under '{selectedCategory}'
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      cartCount={cartItems.find(item => item.product.id === product.id)?.quantity || 0}
                      onUpdateQuantity={handleUpdateQuantity}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* FSSAI Disclaimer & Certification stamp */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-4xs">
              <div className="space-y-1">
                <span className="font-display text-[9px] font-bold text-brand-green-700 tracking-wider uppercase block">Regulated Standards</span>
                <h4 className="font-serif text-base font-bold text-gray-900 leading-tight">Food Safety & Hygiene Compliant</h4>
                <p className="text-gray-500 text-xs leading-relaxed max-w-2xl">
                  Girija Millets maintains clean formulation chambers, ensuring raw grains are kept free of contaminants, pesticide sweeps, or artificial processing elements.
                </p>
              </div>
              <div className="text-center font-mono font-bold bg-brand-green-50 text-brand-green-800 text-xs px-5 py-3.5 rounded-full shrink-0 border border-brand-green-150">
                QUALITY CERTIFIED
              </div>
            </div>

          </div>
        )}

        {/* VIEW 3: RECIPES TAB */}
        {activeTab === 'recipes' && (
          <div className="animate-fadeIn">
            <RecipeSection
              recipes={RECIPES}
              products={products}
              onAddToCart={handleAddToCart}
              onNavigateToShop={handleNavigateToShop}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {/* VIEW 4: GLOSSARY TAB */}
        {activeTab === 'glossary' && (
          <div className="space-y-12 animate-fadeIn text-left">
            
            {/* Greeting */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-brand-amber-50 text-brand-amber-600 font-display text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                <Wheat className="w-3.5 h-3.5" />
                Know Your Grains
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Millet Health Glossary & Nutrition
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                Understand the ancient science behind daily diets. Explore typical local names, core mineral contents, and targeted health cures of classic Tamil traditional millet species.
              </p>
            </div>

            {/* Glossary Table GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {MILLETS_INFO.map((millet, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-100 rounded-3xl p-6 hover:border-brand-green-300 transition-all shadow-4xs text-left flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <h3 className="font-serif text-lg font-bold text-gray-900">{millet.englishName}</h3>
                      <span className="font-sans text-xs font-bold text-brand-green-700 bg-brand-green-50 px-2.5 py-1 rounded-full">
                        {millet.tamilName}
                      </span>
                    </div>

                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {millet.benefits}
                    </p>

                    <div className="bg-gray-50 rounded-2xl p-3 text-[11px] font-mono text-gray-500 space-y-1">
                      <span className="font-bold text-gray-400 block uppercase tracking-wider text-[9px] mb-1">Estimated Nutrition Per 100g</span>
                      <span>{millet.nutritionPer100g}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSearchGlossaryAndShop(millet.englishName.split('/')[0].trim())}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-green-700 hover:text-brand-amber-600 transition-colors pt-2 text-left cursor-pointer"
                  >
                    <span>View Shop Products using this grain</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Comparative banner */}
            <div className="bg-brand-green-800 text-white rounded-3xl p-6 sm:p-10 text-left relative overflow-hidden">
              <div className="max-w-2xl space-y-4 relative z-10">
                <h3 className="font-serif text-xl sm:text-2xl font-bold">Why substitute white rice and wheat?</h3>
                <p className="text-brand-green-100 text-xs sm:text-sm leading-relaxed">
                  Typical milled white rice and processed wheat are heavily stripped of fiber, having simple carbohydrates which cause intense glycemic spikes. Millets, contrarily, have robust complex carbohydrates, dietary thiamine, magnesium, and dietary iron. They are easily digested and maintain persistent system stamina without toxic fat buildup.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="bg-white/10 px-3 py-1.5 rounded-lg text-xs font-semibold">✔ Low Glycemic Response</span>
                  <span className="bg-white/10 px-3 py-1.5 rounded-lg text-xs font-semibold">✔ Gluten-Free Grains</span>
                  <span className="bg-white/10 px-3 py-1.5 rounded-lg text-xs font-semibold">✔ Heart-Friendly Magnesium</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 5: OUR STORY & FAQ TAB */}
        {activeTab === 'about' && (
          <div className="space-y-16 animate-fadeIn">
            
            {/* Story Grid row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
              <div className="lg:col-span-7 space-y-6">
                <span className="font-display text-xs font-bold text-brand-green-700 uppercase tracking-widest block">
                  Established with Passion
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
                  Our Formulation Philosophy
                </h2>
                <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                  At <strong>Girija Millets</strong>, our foundation rests on delivering pure, small-batch, traditional grain solutions to health-conscious households in India. We partner directly with organic cooperative farmers across Tamil Nadu's agricultural belt to source single-origin, certified non-GMO millets.
                </p>
                <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                  Our core strength is manual care. Grains are double washed, sundried, and meticulously sprouted in natural terracotta environments before modern hot-air roasting. Our grains are checked to ensure zero residue of chemical preservatives, artificial MSG, or processed starch binders. This ensures children, diabetic seniors, and adults digest them instantly with peak system nourishment.
                </p>
                <div className="grid grid-cols-2 gap-4 bg-[#fafaf7] p-5 rounded-2xl border border-gray-150/45">
                  <div>
                    <h5 className="font-serif font-bold text-brand-green-800 text-sm">Harvest Purity</h5>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">No residual pesticides, sourced from local crop swaths.</p>
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-brand-green-800 text-sm">Terracotta Sprouting</h5>
                    <p className="text-[11px] text-gray-400 mt-1 leading-snug">Sprouting millets naturally increases calcium & iron up to 3x.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative flex justify-center">
                <div className="w-full max-w-sm aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 shadow-sm border border-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600"
                    alt="Millet harvesting"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* FSSAI Registration display */}
            <div className="p-8 bg-brand-green-50/45 rounded-3xl border border-brand-green-100 flex items-center gap-4 text-left">
              <Award className="w-12 h-12 text-brand-green-600 shrink-0" />
              <div>
                <h4 className="font-serif text-base font-bold text-gray-900">National Quality standards</h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                  Our formulation system is fully certified. We adhere strictly to national food sanitation scales, dry storage bounds, and chemical purity matrices.
                </p>
              </div>
            </div>

            {/* FAQs and WhatsApp Launcher */}
            <FAQSupport />

          </div>
        )}

        {/* VIEW 6: ADMIN CATALOG WORKSPACE */}
        {activeTab === 'admin' && (
          <AdminPanel
            products={products}
            onAddProduct={(newProd) => {
              setProducts(prev => [newProd, ...prev]);
            }}
            onUpdateProduct={(updatedProd) => {
              setProducts(prev => {
                return prev.map(p => p.id === updatedProd.id ? updatedProd : p);
              });
            }}
            onDeleteProduct={(productId) => {
              setProducts(prev => {
                return prev.filter(p => p.id !== productId);
              });
              // Clean up removed products from the shopping cart too
              setCartItems(prev => prev.filter(item => item.product.id !== productId));
            }}
            onRestoreDefaults={() => {
              setProducts(PRODUCTS);
              localStorage.removeItem('girija_products');
            }}
          />
        )}

      </main>

      {/* Cart Basket Sliding Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* FOOTER BLOCK DESIGN */}
      <footer className="bg-[#3D3D2F] text-[#eaebe9] pt-16 pb-8 border-t border-[#E8E4D9]/20 shrink-0 text-left relative overflow-hidden">
        
        {/* Soft graphical elements */}
        <div className="absolute right-0 bottom-0 opacity-[0.03] select-none pointer-events-none">
          <Logo size={320} showSubtitle={false} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-brand-green-800">
            
            {/* Column 1: Info and brand */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl inline-block">
                <Logo size={42} showSubtitle={false} />
              </div>
              <p className="text-xs text-brand-green-150 leading-relaxed max-w-sm">
                Girija Millets matches traditional farming wisdom with modern food safety. We believe healthy, chemical-free food products should be seamless to access.
              </p>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="md:col-span-3 space-y-3">
              <h5 className="font-display text-sm font-bold tracking-wider uppercase text-white">Quick Links</h5>
              <ul className="space-y-2 text-xs text-brand-green-200">
                <li>
                  <button onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition">Home</button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('shop'); setSelectedCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition">Shop All Products</button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('recipes'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition">Wellness Recipes</button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('glossary'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition">Millets Glossary</button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition">Our Story & FAQ</button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact specifics */}
            <div className="md:col-span-4 space-y-3">
              <h5 className="font-display text-sm font-bold tracking-wider uppercase text-white">Contact & Support</h5>
              <ul className="space-y-2 text-xs text-brand-green-200">
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-brand-amber-500">Call / WA:</span>
                  <a href={`https://wa.me/91${GIRIJA_CONTACT}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition hover:underline">
                    +91 {GIRIJA_CONTACT}
                  </a>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-brand-amber-500">Instagram:</span>
                  <a href={`https://instagram.com/${GIRIJA_INSTAGRAM}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition hover:underline">
                    @{GIRIJA_INSTAGRAM}
                  </a>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-brand-amber-500">Location:</span>
                  <span>Chennai - Trichy Rural swaths, Tamil Nadu, India</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-green-200">
            <div>
              &copy; {new Date().getFullYear()} Girija Millets Premium. All Rights Reserved.
            </div>
            <div className="flex gap-4">
              <a href={`https://wa.me/91${GIRIJA_CONTACT}`} target="_blank" rel="noopener" className="hover:text-white transition">Support Chat</a>
              <span>•</span>
              <a href={`https://instagram.com/${GIRIJA_INSTAGRAM}`} target="_blank" rel="noopener" className="hover:text-white transition">Instagram Feed</a>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Action Button (常に画面右下に常駐する、WhatsAppによるいつでもお問合わせ/注文ボタン) */}
      <a
        href={`https://wa.me/91${GIRIJA_CONTACT}?text=Hi%20Girija%20Millets%2C%20I%2527m%20visiting%20your%20premium%20site%20and%20interested%20in%20inquiring%20about%20organic%20millet%20packages%20and%20diet%20customizations!`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#128C7E] text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition-all-custom active:scale-95 group flex items-center justify-center cursor-pointer overflow-hidden border border-emerald-500/30"
        title="Chat on WhatsApp"
      >
        <div className="flex items-center gap-2">
          {/* WhatsApp SVG Icon */}
          <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-white" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.873-4.38 9.876-9.764.001-2.61-1.013-5.064-2.86-6.913C16.545 2.08 14.095.82 11.493.82c-5.441 0-9.882 4.382-9.886 9.773-.001 1.77.475 3.5 1.378 5.037L1.93 21.125l5.864-1.521c-.34.34-.34.34 0 0z" />
          </svg>
          <span className="max-w-0 overflow-hidden group-hover:max-w-[140px] transition-all duration-300 font-display text-xs font-bold uppercase tracking-wider whitespace-nowrap">
            Support Chat
          </span>
        </div>
      </a>

    </div>
  );
}
