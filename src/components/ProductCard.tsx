import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ShoppingBag, ChevronDown, ChevronUp, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { resolveProductImage } from '../imageResolver';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  cartCount: number;
  onUpdateQuantity?: (productId: string, delta: number) => void;
}

export default function ProductCard({ product, onAddToCart, cartCount, onUpdateQuantity }: ProductCardProps) {
  const [showIngredients, setShowIngredients] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [localQty, setLocalQty] = useState(1);

  // Sync state if product is removed from cart
  useEffect(() => {
    if (cartCount === 0) {
      setLocalQty(1);
    }
  }, [cartCount]);

  const displayQty = cartCount > 0 ? cartCount : localQty;

  const handleQtyChange = (delta: number) => {
    if (cartCount > 0) {
      if (onUpdateQuantity) {
        onUpdateQuantity(product.id, delta);
      }
    } else {
      setLocalQty((prev) => Math.max(1, prev + delta));
    }
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, cartCount > 0 ? 1 : localQty);
  };

  // Helper theme color mapping for subtle badges & accents
  const themeColors: Record<string, { bg: string; text: string; border: string; accent: string }> = {
    amber: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', accent: 'bg-amber-600' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200', accent: 'bg-rose-600' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200', accent: 'bg-amber-500' },
    red: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200', accent: 'bg-red-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', accent: 'bg-emerald-600' },
    brown: { bg: 'bg-amber-100/40', text: 'text-amber-900', border: 'border-amber-300/40', accent: 'bg-amber-800' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200', accent: 'bg-orange-600' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-800', border: 'border-pink-200', accent: 'bg-pink-600' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200', accent: 'bg-indigo-600' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200', accent: 'bg-teal-600' }
  };

  const style = themeColors[product.colorTheme] || themeColors.amber;

  return (
    <div
      id={`product-card-${product.id}`}
      className="bg-white border border-gray-150 rounded-[24px] overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full relative"
    >
      {/* Absolute Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        {product.isNew && (
          <span className="flex items-center gap-1 bg-brand-green-700 text-white font-display text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            <Sparkles className="w-2.5 h-2.5" />
            New Launch
          </span>
        )}
        {product.isPopular && (
          <span className="bg-brand-amber-600 text-white font-display text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            Best Seller
          </span>
        )}
      </div>

      {/* Like / Wishlist toggler */}
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-4 right-4 z-10 p-2 bg-white/95 backdrop-blur-xs rounded-full shadow-2xs text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-200 cursor-pointer"
        aria-label="Save to favorites"
      >
        <Heart className={`w-3.5 h-3.5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      {/* Product Image Section */}
      <div className="relative pt-[72%] bg-[#FAF9F6] overflow-hidden group border-b border-gray-100">
        <img
          src={resolveProductImage(product.image)}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Soft elegant vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/5 opacity-40"></div>
        
        {/* Pack specifics */}
        <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-xs text-gray-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-3xs border border-gray-100">
          {product.weight}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Category & Purity line */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-display text-[10px] font-bold tracking-wider text-brand-green-750 uppercase">
            {product.category}
          </span>
          <span className="flex items-center gap-1 font-mono text-[9px] text-[#8C7851] bg-[#FDFCF8] border border-[#E8E4D9] px-1.5 py-0.5 rounded">
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
            100% Pure
          </span>
        </div>

        {/* Product Names: Left aligned premium style */}
        <div className="mb-1 text-left">
          <h3 className="font-display text-sm font-bold text-[#3D3D2F] tracking-tight leading-snug hover:text-brand-green-700 transition-colors">
            {product.name}
          </h3>
          {product.tamilName && (
            <p className="font-sans text-[11px] font-semibold text-brand-green-700 mt-0.5">
              {product.tamilName}
            </p>
          )}
        </div>

        {/* Short description */}
        <p className="text-gray-500 text-[11.5px] leading-relaxed mb-3 text-left mt-1.5 flex-1 line-clamp-2">
          {product.description}
        </p>

        {/* Premium Price Tag & Quantity Box Block */}
        <div className="space-y-3 mt-auto pt-3 border-t border-gray-100">
          
          {/* Price display with exact format in screenshot */}
          <div className="text-left font-display font-black text-base text-[#3D3D2F]">
            Rs. {product.price}.00
          </div>

          {/* Inline Quantity adjustable block */}
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between border border-gray-200 rounded-lg p-0.5 bg-gray-50/50">
              <button
                onClick={() => handleQtyChange(-1)}
                className="w-8 h-8 flex items-center justify-center font-display font-semibold text-lg text-gray-650 hover:text-black hover:bg-white rounded-md transition-all active:scale-90 cursor-pointer select-none"
              >
                −
              </button>
              <span className="font-sans font-bold text-xs text-gray-800 w-12 text-center select-none">
                {displayQty}
              </span>
              <button
                onClick={() => handleQtyChange(1)}
                className="w-8 h-8 flex items-center justify-center font-display font-semibold text-lg text-gray-650 hover:text-black hover:bg-white rounded-md transition-all active:scale-90 cursor-pointer select-none"
              >
                +
              </button>
            </div>

            {/* Mint Green solid ADD TO CART Button */}
            <button
              onClick={handleAddToCartClick}
              className="w-full bg-[#96ECB4] hover:bg-[#83dd9f] text-[#2c3d25] font-display font-bold text-[11px] tracking-widest uppercase py-3.5 px-4 rounded-xl shadow-3xs hover:shadow transition-all active:scale-97 cursor-pointer text-center flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#2c3d25]" />
              ADD TO CART
            </button>
          </div>
        </div>

        {/* Expandable Nutrition & recipe info */}
        <div className="mt-3.5 border-t border-gray-100 pt-2.5">
          <button
            onClick={() => setShowIngredients(!showIngredients)}
            className="flex items-center justify-between w-full text-left font-display text-[11px] font-bold text-gray-500 hover:text-brand-green-700 transition-colors cursor-pointer"
          >
            <span>Nutrition & Prepare</span>
            {showIngredients ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showIngredients && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-2 text-left"
            >
              <div className="bg-brand-green-50/45 rounded-xl p-3 border border-brand-green-100/50 space-y-2.5">
                {/* Ingredients Lists */}
                <div>
                  <h4 className="font-display text-[10px] font-bold tracking-wider text-brand-green-700 uppercase mb-1">
                    Ingredients
                  </h4>
                  <ul className="list-disc pl-3 text-[10px] text-gray-600 space-y-0.5">
                    {product.ingredients.map((item, idx) => (
                      <li key={idx} className="leading-snug">{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Health Benefits */}
                <div>
                  <h4 className="font-display text-[10px] font-bold tracking-wider text-brand-green-700 uppercase mb-1">
                    Health Benefits
                  </h4>
                  <ul className="space-y-1">
                    {product.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-[10px] text-gray-600 leading-snug flex items-start gap-1">
                        <span className="text-brand-amber-500 font-bold shrink-0">&middot;</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preparation Guide */}
                {product.howToUse && product.howToUse.length > 0 && (
                  <div className="pt-2 border-t border-brand-green-100/30">
                    <h4 className="font-display text-[10px] font-bold tracking-wider text-brand-green-700 uppercase mb-1">
                      Prep Overview
                    </h4>
                    <ol className="list-decimal pl-3 text-[9px] text-gray-500 space-y-0.5 leading-snug">
                      {product.howToUse.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
