import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  Search, 
  Tag, 
  Layers, 
  DollarSign, 
  Package, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  ArrowLeft,
  X,
  Lock,
  LockOpen,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onRestoreDefaults: () => void;
}

// Preset pre-generated premium assets for easy one-click selection
const PRESET_PACKAGING_IMAGES = [
  { label: 'Ragi Malt', value: '/images/ragi_malt_packaging_1781422356325.jpg', category: 'Health Malts' },
  { label: 'ABC Malt', value: '/images/abc_malt_packaging_1781422431988.jpg', category: 'Health Malts' },
  { label: 'Jowar Noodles', value: '/images/jowar_noodles_packaging_1781422377655.jpg', category: 'Millet Noodles' },
  { label: 'Hakka Noodles', value: '/images/hakka_noodles_packaging_1781422395705.jpg', category: 'Millet Noodles' },
  { label: 'Palak Noodles', value: '/images/palak_noodles_packaging_1781422520320.jpg', category: 'Millet Noodles' },
  { label: 'Little Millet Sevai', value: '/images/sevai_packaging_1781422467266.jpg', category: 'Millet Noodles' },
  { label: 'Poha (Millet Flakes)', value: '/images/organic_poha_packaging_1781422412522.jpg', category: 'Millet Flakes' },
  { label: 'Pacha Paruppu Dosa', value: '/images/pacha_paruppu_packaging_1781422502982.jpg', category: 'Instant Mixes & Flour' },
  { label: 'Kambu Dosa Mix', value: '/images/kambu_dosai_packaging_1781422485926.jpg', category: 'Instant Mixes & Flour' },
  { label: 'Idly Milagai Podi', value: '/images/idly_podi_packaging_1781422450554.jpg', category: 'Instant Mixes & Flour' },
  { label: 'Premium Combo Box', value: '/images/millet_combo_packaging_1781422537199.jpg', category: 'Combo Offers' },
];

export default function AdminPanel({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onRestoreDefaults
}: AdminPanelProps) {
  // Passcode gate state
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gateError, setGateError] = useState('');
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Search & dynamic filtering inside Admin list
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Individual fields
  const [idArg, setIdArg] = useState('');
  const [name, setName] = useState('');
  const [tamilName, setTamilName] = useState('');
  const [price, setPrice] = useState(100);
  const [weight, setWeight] = useState('250g');
  const [category, setCategory] = useState('Millet Noodles');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/images/ragi_malt_packaging_1781422356325.jpg');
  const [colorTheme, setColorTheme] = useState('amber');
  const [ingredientsText, setIngredientsText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [howToUseText, setHowToUseText] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [fssai, setFssai] = useState('');

  // Notification feedback triggers
  const [successMsg, setSuccessMsg] = useState('');

  // Categories list derived dynamically
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  // Authenticate Admin handler
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const pin = passcode.trim().toLowerCase();
    if (pin === 'girija') {
      setIsAuthenticated(true);
      setGateError('');
    } else {
      setGateError('Incorrect password! Access denied.');
    }
  };

  // Switch to Add Form mode
  const openAddForm = () => {
    setEditingProduct(null);
    setIdArg('');
    setName('');
    setTamilName('');
    setPrice(150);
    setWeight('250g');
    setCategory(categories[0] || 'Millet Noodles');
    setDescription('');
    setImage('/images/ragi_malt_packaging_1781422356325.jpg');
    setColorTheme('amber');
    setIngredientsText('100% Raw Sprouted grain.');
    setBenefitsText('High dietary fiber;Eases gastric load.');
    setHowToUseText('Mix 1 tbsp in hot water;Boil on low flame for 4 minutes.');
    setIsNew(true);
    setIsPopular(false);
    setFssai('100% Pure');
    setIsFormOpen(true);
  };

  // Switch to Edit Form mode
  const openEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setIdArg(prod.id);
    setName(prod.name);
    setTamilName(prod.tamilName || '');
    setPrice(prod.price);
    setWeight(prod.weight);
    setCategory(prod.category);
    setDescription(prod.description);
    setImage(prod.image);
    setColorTheme(prod.colorTheme || 'amber');
    setIngredientsText(prod.ingredients.join(';'));
    setBenefitsText(prod.benefits.join(';'));
    setHowToUseText((prod.howToUse || []).join(';'));
    setIsNew(!!prod.isNew);
    setIsPopular(!!prod.isPopular);
    setFssai(prod.fssai || '100% Pure');
    setIsFormOpen(true);
  };

  // Form submission dispatcher
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedIngredients = ingredientsText
      .split(';')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const parsedBenefits = benefitsText
      .split(';')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const parsedHowToUse = howToUseText
      .split(';')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const targetId = editingProduct ? editingProduct.id : (idArg.trim() || name.toLowerCase().replace(/\s+/g, '-'));

    const packageData: Product = {
      id: targetId,
      name: name.trim(),
      tamilName: tamilName.trim() || undefined,
      price: Number(price) || 0,
      weight: weight.trim(),
      category: category.trim(),
      description: description.trim(),
      image: image,
      colorTheme: colorTheme,
      ingredients: parsedIngredients,
      benefits: parsedBenefits,
      howToUse: parsedHowToUse,
      isNew: isNew,
      isPopular: isPopular,
      fssai: fssai || undefined
    };

    if (editingProduct) {
      onUpdateProduct(packageData);
      showFeedback(`Successfully updated ${name}!`);
    } else {
      onAddProduct(packageData);
      showFeedback(`Successfully created new product ${name}!`);
    }

    setIsFormOpen(false);
  };

  // Quick helper to flash temporary messages
  const showFeedback = (text: string) => {
    setSuccessMsg(text);
    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  // Filter products matching parameters
  const filteredList = products.filter(prod => {
    const matchesCat = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesQuery = searchQuery === '' || 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.tamilName && prod.tamilName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-gray-150 rounded-3xl shadow-xs text-center">
        <div className="w-16 h-16 bg-brand-green-50 text-brand-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Girija Admin Dashboard</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
          Access the backend pantry management workspace. Add new millet items, review stocks, and customize pricing structures.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left space-y-1">
            <label className="text-xs font-bold text-gray-600 block pl-1 uppercase tracking-wide">Enter Admin Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-center text-lg tracking-widest focus:ring-1 focus:ring-brand-green-600 focus:outline-hidden"
            />
            <p className="text-[11px] text-gray-450 mt-1 pl-1">
              Protected Admin Portal. Security clearance required.
            </p>
          </div>

          {gateError && (
            <p className="text-red-655 text-xs text-left bg-red-50 p-2.5 rounded-lg border border-red-100 flex items-center gap-1.5 animate-shake">
              <Info className="w-3.5 h-3.5" />
              {gateError}
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-brand-green-700 hover:bg-brand-green-800 text-white font-display text-sm font-bold py-3.5 rounded-xl cursor-pointer shadow-3xs transition-all active:scale-97"
            >
              Sign In to Workspace
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn w-full">
      {/* Top action dashboard & metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-extrabold text-[#3D3D2F]">Catalog Manager</h1>
            <span className="bg-brand-amber-50 text-brand-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider border border-brand-amber-100">
              <LockOpen className="w-2.5 h-2.5" /> Admin Mode
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1 leading-relaxed">
            Create, update catalog parameters, configure custom prices, or revert to organic defaults safely.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openAddForm}
            className="flex items-center gap-1.5 bg-[#96ECB4] hover:bg-[#83dd9f] text-[#2c3d25] font-display text-xs font-bold px-4 py-3 rounded-xl shadow-3xs cursor-pointer transition-all active:scale-97"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
          
          <button
            onClick={() => {
              setShowResetConfirm(true);
            }}
            className="flex items-center gap-1.5 bg-gray-150 hover:bg-gray-200 text-gray-700 font-display text-xs font-bold px-4 py-3 rounded-xl cursor-pointer transition-all active:scale-97"
            title="Reset storage & reload mock defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
          </button>
        </div>
      </div>

      {/* Floating alert */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {successMsg}
            </span>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-500 hover:text-emerald-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid: Form Drawer & Products Grid list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editing or Adding Drawer panel if open */}
        {isFormOpen && (
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm h-fit">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
              <h3 className="font-serif text-lg font-bold text-gray-950">
                {editingProduct ? 'Edit Product Parameters' : 'Register New Product'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              <div>
                <label className="text-[10px] font-bold text-gray-550 uppercase tracking-widest pl-1 block mb-1">
                  Product Unique ID Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. jowar-instant-noodles"
                  disabled={!!editingProduct}
                  value={idArg}
                  onChange={(e) => setIdArg(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono bg-gray-50/50 disabled:opacity-55"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-550 uppercase tracking-widest pl-1 block mb-1">
                  Product Name (English)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Little Millet Vermicelli"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-550 uppercase tracking-widest pl-1 block mb-1">
                  Product Name (Tamil optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. சாமை சேமியா"
                  value={tamilName}
                  onChange={(e) => setTamilName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-550 uppercase tracking-widest pl-1 block mb-1">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                    required
                    min={1}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-550 uppercase tracking-widest pl-1 block mb-1">
                    Weight / Net content
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 250g or 1 Combo"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-550 uppercase tracking-widest pl-1 block mb-1">
                    Category Group
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    <option value="Millet Noodles">Millet Noodles</option>
                    <option value="Health Malts">Health Malts</option>
                    <option value="Millet Flakes">Millet Flakes</option>
                    <option value="Instant Mixes & Flour">Instant Mixes & Flour</option>
                    <option value="Combo Offers">Combo Offers</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-550 uppercase tracking-widest pl-1 block mb-1">
                    Accent Color Theme
                  </label>
                  <select
                    value={colorTheme}
                    onChange={(e) => setColorTheme(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    <option value="amber">Warm Amber</option>
                    <option value="rose">Soft Rose</option>
                    <option value="yellow">Millet Yellow</option>
                    <option value="orange">Fresh Orange</option>
                    <option value="pink">Pink Accent</option>
                    <option value="red">Earthy Red</option>
                    <option value="emerald">Rich Emerald</option>
                    <option value="teal">Clean Teal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-550 uppercase tracking-widest pl-1 block mb-1">
                  Product Short description
                </label>
                <textarea
                  placeholder="Tell clients about sprouting, double steam process, or natural farming benefits..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs h-18"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-550 uppercase tracking-widest pl-1 block mb-1">
                  Product Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono"
                  required
                />
              </div>

              {/* Natural organic image selection shortcut box */}
              <div className="pt-1.5">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Or select a premium organic packaging image:
                </span>
                <div className="grid grid-cols-4 gap-1 border border-gray-100 p-2 rounded-xl bg-gray-50 max-h-36 overflow-y-auto">
                  {PRESET_PACKAGING_IMAGES.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setImage(preset.value)}
                      className={`relative aspect-square border rounded-lg overflow-hidden transition-all ${
                        image === preset.value
                          ? 'border-brand-green-600 ring-2 ring-brand-green-400'
                          : 'border-gray-200 hover:scale-95'
                      }`}
                      title={preset.label}
                    >
                      <img
                        src={preset.value}
                        alt={preset.label}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-550 uppercase tracking-widest pl-1 block mb-1">
                  Ingredients (Separate with semicolons ';')
                </label>
                <input
                  type="text"
                  placeholder="Sprouted Ragi;Cardamom;Almond slices"
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-550 uppercase tracking-widest pl-1 block mb-1">
                  Health Benefits (Separate with semicolons ';')
                </label>
                <input
                  type="text"
                  placeholder="Extremely light weight;300% more iron absorption"
                  value={benefitsText}
                  onChange={(e) => setBenefitsText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-550 uppercase tracking-widest pl-1 block mb-1">
                  How To Use (Separate with semicolons ';')
                </label>
                <input
                  type="text"
                  placeholder="Rinse under cold water;Steam for 5 minutes;Let rest"
                  value={howToUseText}
                  onChange={(e) => setHowToUseText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="rounded text-brand-green-600 focus:ring-brand-green-500 w-4 h-4"
                  />
                  <span>New Launch Badge</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="rounded text-brand-green-600 focus:ring-brand-green-500 w-4 h-4"
                  />
                  <span>Best Seller Badge</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-green-700 hover:bg-brand-green-800 text-white font-display text-xs font-bold py-3 px-4 rounded-xl shadow-xs hover:shadow transition-all active:scale-97 cursor-pointer text-center flex items-center justify-center gap-2 mt-2"
              >
                <Save className="w-4 h-4" />
                {editingProduct ? 'Save Product Changes' : 'Create & Register Product'}
              </button>

            </form>
          </div>
        )}

        {/* Catalog Table list */}
        <div className={`col-span-1 ${isFormOpen ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4`}>
          
          {/* Quick search row */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-3xs">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products by brand name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-gray-50/55 border border-gray-150 focus:bg-white focus:border-brand-green-600 focus:outline-hidden"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
            </div>

            <div className="flex gap-2 shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-gray-150 bg-white"
              >
                <option value="All">All Categories</option>
                <option value="Millet Noodles">Millet Noodles</option>
                <option value="Health Malts">Health Malts</option>
                <option value="Millet Flakes">Millet Flakes</option>
                <option value="Instant Mixes & Flour">Instant Mixes & Flour</option>
                <option value="Combo Offers">Combo Offers</option>
              </select>
            </div>
          </div>

          {/* List display */}
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                Active Catalog Stock ({filteredList.length} items listed)
              </span>
            </div>

            <div className="divide-y divide-gray-100 overflow-x-auto">
              {filteredList.length === 0 ? (
                <div className="p-12 text-center text-gray-405 text-sm space-y-2">
                  <Package className="w-10 h-10 text-gray-300 mx-auto" />
                  <p>No products match your filters.</p>
                  <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="text-xs text-brand-green-750 font-bold underline">
                    Clear Search Filters
                  </button>
                </div>
              ) : (
                filteredList.map((product) => (
                  <div 
                    key={product.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/75 transition-colors"
                  >
                    {/* Left: Thumbnail & basic labels */}
                    <div className="flex items-center gap-3.5 text-left min-w-0">
                      <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden shrink-0 relative">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-display text-sm font-bold text-gray-900 truncate">
                            {product.name}
                          </h4>
                          {product.isNew && (
                            <span className="bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                              New
                            </span>
                          )}
                          {product.isPopular && (
                            <span className="bg-amber-100 text-brand-amber-800 text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                              Best
                            </span>
                          )}
                        </div>
                        {product.tamilName && (
                          <p className="font-sans text-[11px] text-brand-green-700 leading-tight">
                            {product.tamilName}
                          </p>
                        )}
                        <p className="text-gray-400 text-[10px] uppercase font-semibold mt-0.5 tracking-wider">
                          {product.category} &middot; <span className="font-mono">{product.weight}</span>
                        </p>
                      </div>
                    </div>

                    {/* Middle: Live customizable pricing box */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 border-t sm:border-t-0 pt-2.5 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <span className="text-[9px] text-gray-400 block font-mono">Retail Price</span>
                        <div className="flex items-center gap-1 bg-gray-50 border border-gray-150 rounded-lg px-2 py-0.5 mt-0.5">
                          <span className="text-gray-500 font-mono text-xs">Rs.</span>
                          <input
                            type="number"
                            value={product.price}
                            onChange={(e) => {
                              const newPrice = Math.max(0, Number(e.target.value));
                              onUpdateProduct({ ...product, price: newPrice });
                            }}
                            className="bg-transparent w-14 font-mono font-bold text-sm text-center text-gray-800 focus:outline-hidden"
                            title="Edit price directly on line!"
                          />
                        </div>
                      </div>

                      {/* Right: Quick action buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditForm(product)}
                          className="p-2 text-gray-500 hover:text-brand-green-800 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                          title="Full parameter edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteConfirmProduct(product);
                          }}
                          className="p-2 text-gray-450 hover:text-red-650 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Remove from shop listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Custom Confirmation Modal for Deletion */}
      <AnimatePresence>
        {deleteConfirmProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-gray-150 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-12 h-12 bg-red-50 text-red-650 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
              <p className="text-gray-500 text-xs mb-6 leading-relaxed">
                Are you sure you want to permanently remove <strong className="text-gray-800">"{deleteConfirmProduct.name}"</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmProduct(null)}
                  className="flex-1 py-3 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-150 rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteProduct(deleteConfirmProduct.id);
                    showFeedback(`Successfully removed "${deleteConfirmProduct.name}"`);
                    setDeleteConfirmProduct(null);
                  }}
                  className="flex-1 py-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer transition-colors shadow-3xs"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Modal for Restore Defaults */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-gray-150 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-12 h-12 bg-amber-50 text-brand-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">Reset to Defaults?</h3>
              <p className="text-gray-500 text-xs mb-6 leading-relaxed">
                Restore organic products to their starting values? Any new items you created or custom prices will be reset to defaults.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-150 rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onRestoreDefaults();
                    showFeedback("Restored catalog to factory defaults!");
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 py-3 text-xs font-bold text-white bg-brand-green-700 hover:bg-brand-green-800 rounded-xl cursor-pointer transition-colors shadow-3xs"
                >
                  Confirm Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
