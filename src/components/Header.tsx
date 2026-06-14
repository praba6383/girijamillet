import React, { useState } from 'react';
import Logo from './Logo';
import { ShoppingBag, Search, Menu, X, ChevronDown, Sparkles, BookOpen } from 'lucide-react';
import { GIRIJA_CONTACT } from '../data';

interface HeaderProps {
  activeTab: 'home' | 'shop' | 'recipes' | 'about' | 'glossary' | 'admin';
  setActiveTab: (tab: 'home' | 'shop' | 'recipes' | 'about' | 'glossary' | 'admin') => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartItemsCount: number;
  onOpenCart: () => void;
  categories: string[];
}

export default function Header({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  cartItemsCount,
  onOpenCart,
  categories
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Quick navigation toggler
  const handleTabChange = (tab: 'home' | 'shop' | 'recipes' | 'about' | 'glossary' | 'admin') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Products' },
    { id: 'recipes', label: 'Recipe Blog' },
    { id: 'glossary', label: 'Millet Glossary' },
    { id: 'about', label: 'Our Story & FAQ' },
    { id: 'admin', label: '🔑 Admin' }
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-3xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div onClick={() => handleTabChange('home')} className="cursor-pointer">
            <Logo size={46} showSubtitle={true} />
          </div>

          {/* Desktop Navigation Linkages */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleTabChange(link.id)}
                className={`font-display text-sm font-semibold tracking-wide transition-all-custom cursor-pointer py-1.5 border-b-2 ${
                  activeTab === link.id
                    ? 'text-brand-green-700 border-brand-green-600 font-bold'
                    : 'text-gray-500 border-transparent hover:text-brand-green-600'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Search, Cart triggers, Menu Button */}
          <div className="flex items-center gap-3">
            
            {/* Search Input Bar */}
            <div className={`relative transition-all duration-300 hidden sm:block ${searchFocused ? 'w-64' : 'w-48'}`}>
              <input
                type="text"
                placeholder="Search products, recipes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // Auto redirect to shop or relevant page if typing and not there? 
                  // It's helpful if they type, they see search results filtering!
                }}
                onFocus={() => {
                  setSearchFocused(true);
                  if (activeTab !== 'shop' && activeTab !== 'recipes') {
                    // Let them search within current view structure or auto-scroll
                  }
                }}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-9 pr-4 py-2 text-xs font-sans rounded-full bg-gray-50 border border-gray-150 focus:bg-white focus:border-brand-green-600 focus:outline-hidden transition-all text-gray-800 placeholder-gray-400"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Shopping Bag Icon with counter bubble */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-brand-green-50 hover:bg-brand-green-100 text-brand-green-800 rounded-full transition-all active:scale-95 cursor-pointer shadow-3xs"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-amber-600 text-[10px] font-bold text-white shadow-xs animate-bounce">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Quick WhatsApp Shortcut Link */}
            <a
              href={`https://wa.me/91${GIRIJA_CONTACT}?text=Hi%20Girija%20Millets%2C%20I%20have%20an%20inquiry%20about%20your%20organic%20millet%20products.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 bg-brand-green-700 hover:bg-brand-green-800 text-white font-display text-xs font-bold px-4 py-2.5 rounded-full transition-all hover:shadow-md cursor-pointer"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.873-4.38 9.876-9.764.001-2.61-1.013-5.064-2.86-6.913C16.545 2.08 14.095.82 11.493.82c-5.441 0-9.882 4.382-9.886 9.773-.001 1.77.475 3.5 1.378 5.037L1.93 21.125l5.864-1.521c-.34.34-.34.34 0 0z" />
              </svg>
              Quick Support
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 sm:p-2 bg-gray-50 text-gray-700 rounded-full md:hidden hover:bg-gray-100 transition-all cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* MOBILE Search Bar (Visible only on mobile screens) */}
      <div className="px-4 pb-4 sm:hidden block">
        <div className="relative">
          <input
            type="text"
            placeholder="Search organic millets & recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs font-sans rounded-xl bg-gray-50 border border-gray-150 focus:bg-white focus:border-brand-green-600 focus:outline-hidden transition-all text-gray-800"
          />
          <Search className="absolute left-3 top-3.5 w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>

      {/* Mobile Drawer Menu Layer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[116px] sm:top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg z-50 overflow-y-auto max-h-[80vh] animate-fadeIn">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleTabChange(link.id)}
                className={`flex items-center justify-between w-full text-left px-3 py-3 rounded-xl font-display text-sm font-semibold ${
                  activeTab === link.id
                    ? 'bg-brand-green-50 text-brand-green-700 font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{link.label}</span>
                {activeTab === link.id && <div className="w-1.5 h-1.5 rounded-full bg-brand-green-600" />}
              </button>
            ))}

            {/* Category Quick Filter inside Mobile Menu if on Organic Shop tab */}
            {activeTab === 'shop' && (
              <div className="pt-3 pb-2 border-t border-gray-100 mt-2">
                <span className="font-display text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-3 block mb-2">
                  Shop Categories
                </span>
                <div className="grid grid-cols-2 gap-1.5 px-1.5">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-2.5 py-2 text-xs rounded-lg font-medium ${
                      selectedCategory === 'All'
                        ? 'bg-brand-amber-50 text-brand-amber-800 font-bold'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100/50'
                    }`}
                  >
                    All Grains
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-left px-2.5 py-2 text-xs rounded-lg font-medium whitespace-nowrap overflow-hidden text-ellipsis ${
                        selectedCategory === cat
                          ? 'bg-brand-amber-50 text-brand-amber-800 font-bold'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-4 pb-2 border-t border-gray-100 flex flex-col gap-2">
              <a
                href={`https://wa.me/91${GIRIJA_CONTACT}?text=Hi%20Girija%20Millets%2C%20I%20have%20an%20inquiry%20about%20your%20organic%20millet%20products.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-brand-green-600 text-white font-display text-sm font-bold p-3 rounded-xl shadow-xs"
              >
                <svg className="w-4 h-4 fill-white animate-pulse" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.873-4.38 9.876-9.764.001-2.61-1.013-5.064-2.86-6.913C16.545 2.08 14.095.82 11.493.82c-5.441 0-9.882 4.382-9.886 9.773-.001 1.77.475 3.5 1.378 5.037L1.93 21.125l5.864-1.521c-.34.34-.34.34 0 0z" />
                </svg>
                <span>WhatsApp Instant Support</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
