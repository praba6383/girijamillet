import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, ShieldAlert, ArrowRight } from 'lucide-react';
import { GIRIJA_CONTACT } from '../data';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem
}: CartModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // High-value function to generate dynamic WhatsApp checkout link
  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    let message = `🌾 *GIRIJA ORGANIC MILLETS - NEW ORDER* 🌾\n`;
    message += `===============================\n\n`;
    
    if (customerName.trim()) {
      message += `👤 *Customer Name:* ${customerName.trim()}\n`;
    }
    if (customerAddress.trim()) {
      message += `📍 *Delivery Location:* ${customerAddress.trim()}\n`;
    }
    if (orderNotes.trim()) {
      message += `📝 *Order Note:* ${orderNotes.trim()}\n`;
    }
    
    message += `\n🛒 *Items in Cart:*\n`;
    cartItems.forEach((item, index) => {
      const subtotal = item.product.price * item.quantity;
      message += `${index + 1}. *${item.product.name}* (${item.product.weight})\n`;
      message += `   Quantity: ${item.quantity} | Subtotal: ₹${subtotal}\n`;
    });

    message += `\n===============================\n`;
    message += `📦 *Total Packs:* ${totalQuantity}\n`;
    message += `💰 *Grand Total:* ₹${totalAmount}\n`;
    message += `===============================\n\n`;
    message += `Please verify availability and send me payment terms (GPAY/PhonePe/COD) and dispatch timeline. Thank you!`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/91${GIRIJA_CONTACT}?text=${encodedText}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Cart Container Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slideLeft">
        
        {/* Header Section */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-brand-green-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-green-600 text-white rounded-full">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-900 leading-tight">Your Cart Basket</h3>
              <p className="font-sans text-xs text-brand-green-700 font-semibold">{totalQuantity} millet packs selected</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Cart Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="p-6 bg-brand-green-50 rounded-full text-brand-green-600 animate-pulse">
                <ShoppingBag className="w-12 h-12" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-gray-800">Your basket is empty</h4>
                <p className="text-gray-500 text-xs max-w-xs mx-auto mt-1">
                  Enjoy chemical-free diets. Browse our premium health malts, flakes, and noodles to begin your journey.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 inline-flex items-center gap-2 bg-brand-green-600 hover:bg-brand-green-700 text-white font-display text-xs font-bold px-5 py-3 rounded-full cursor-pointer transition-all"
              >
                <span>Browse Millet Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* Product List */}
              <div className="space-y-3.5">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3.5 p-3.5 rounded-2xl border border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100 relative">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Meta info & amount adjustment */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-serif text-sm font-bold text-gray-800 leading-tight truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="font-sans text-[11px] text-gray-500 font-medium">
                          {item.product.weight}
                        </span>
                        <span className="font-mono text-xs font-bold text-gray-800">
                          ₹{item.product.price} each
                        </span>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1.5 text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 font-mono text-xs font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1.5 text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-display text-sm font-extrabold text-brand-green-700">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* Order Customizer Form */}
              <div className="bg-brand-green-50/40 border border-brand-green-150 rounded-2xl p-4 space-y-3.5">
                <span className="font-display text-[11px] font-bold tracking-wider text-brand-green-700 uppercase block">
                  Add Delivery Details (Optional)
                </span>
                
                <div>
                  <label className="text-[10px] uppercase tracking-wide text-gray-400 font-bold block mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="E.g., Prabakaran"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:border-brand-green-600 focus:outline-hidden text-gray-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wide text-gray-400 font-bold block mb-1">Shipping Address / Location</label>
                  <textarea
                    rows={2}
                    placeholder="E.g., Chennai, Tamil Nadu"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:border-brand-green-600 focus:outline-hidden text-gray-800 resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wide text-gray-400 font-bold block mb-1">Special Instructions / Cooking Requests</label>
                  <input
                    type="text"
                    placeholder="E.g., Request extra idli podi spice mix"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:border-brand-green-600 focus:outline-hidden text-gray-800"
                  />
                </div>

                <div className="flex gap-2 items-start bg-amber-50/60 p-3 rounded-xl border border-amber-200/50">
                  <ShieldAlert className="w-4 h-4 text-brand-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-900 leading-relaxed font-medium">
                    This website integrates directly with Girija Millets on WhatsApp. Pressing dispatch will pre-fill your list in your app to prompt payment details.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pricing Summary & Checkout Section */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500 text-xs">
                <span>Subtotal packs ({totalQuantity} items)</span>
                <span className="font-mono">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-xs">
                <span>Delivery Shipping</span>
                <span className="text-brand-green-600 font-bold text-[11px] uppercase tracking-wider">Calculated on WA</span>
              </div>
              <div className="flex justify-between items-center text-gray-950 font-bold pt-2 border-t border-gray-200">
                <span className="font-serif text-base font-bold">Estimated Grand Total</span>
                <span className="font-display text-xl font-black text-brand-green-800">₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={handleWhatsAppCheckout}
              className="w-full bg-brand-green-700 hover:bg-brand-green-800 text-white font-display text-sm font-bold p-4 rounded-xl flex items-center justify-center gap-2.5 transition-all active:scale-98 shadow-md hover:shadow-lg cursor-pointer animate-pulse"
            >
              <Send className="w-4.5 h-4.5" />
              <span>Confirm & Order on WhatsApp</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
