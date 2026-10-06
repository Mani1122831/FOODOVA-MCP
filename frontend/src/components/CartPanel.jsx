import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  Percent, 
  Check, 
  X,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CartPanel = ({ onClose, isMobileModal = false }) => {
  const { 
    items, 
    subtotal, 
    discount, 
    tax, 
    deliveryFee, 
    total, 
    itemCount, 
    appliedCoupon,
    updateQuantity, 
    removeItem, 
    applyCoupon, 
    removeCoupon 
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    if (ok) {
      setCouponInput('');
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try FOODOVA50 or WELCOME');
    }
  };

  const handleProceedCheckout = () => {
    if (onClose) onClose();
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };

  return (
    <div className={`bg-white flex flex-col h-full ${
      isMobileModal ? 'p-4' : 'rounded-3xl border border-gray-200/80 shadow-card p-5'
    }`}>
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 font-bold">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-black text-dark-900 text-lg">Your Cart</h3>
            <p className="text-xs text-gray-600">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
            </p>
          </div>
        </div>

        {isMobileModal && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-dark-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Cart Content: Empty State vs Item List */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            
            {/* Animated Food Bag Empty Illustration */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-28 h-32 bg-amber-600/90 rounded-2xl relative shadow-lg flex flex-col items-center justify-end p-2 border-t-8 border-red-500 overflow-hidden"
              >
                <div className="w-12 h-6 border-2 border-amber-300 rounded-full mb-6"></div>
                <div className="text-white font-black text-xl tracking-tighter opacity-80 mb-2">
                  FOODOVA
                </div>
              </motion.div>
              <div className="absolute -top-1 right-2 text-xl animate-float">✨</div>
              <div className="absolute bottom-2 left-2 text-sm animate-pulse">🍟</div>
            </div>

            <div className="space-y-1">
              <h4 className="font-display font-black text-dark-900 text-base">
                Oops! Your cart is empty.
              </h4>
              <p className="text-xs text-gray-600 max-w-[220px]">
                You haven't placed any order yet. Good food is waiting for you!
              </p>
            </div>

            <button
              onClick={() => {
                if (onClose) onClose();
                navigate('/menu');
              }}
              className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-dark-950 font-bold text-xs shadow-sm hover:shadow-brand transition-all hover:scale-105"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between gap-3 p-3 bg-cream-50/60 rounded-2xl border border-gray-100 hover:border-brand-200 transition-colors"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.thumbnail || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop'}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-white shrink-0 shadow-xs"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop';
                    }}
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-dark-900 text-xs truncate">
                      {item.name}
                    </h5>
                    <p className="text-xs font-black text-brand-600 mt-0.5">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-xs">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg text-gray-500 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors"
                    >
                      {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-dark-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg text-dark-800 hover:text-brand-600 hover:bg-brand-50 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bill & Checkout footer if items exist */}
      {items.length > 0 && (
        <div className="pt-4 border-t border-gray-100 space-y-3 mt-auto">
          
          {/* Coupon Input */}
          <div>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{appliedCoupon.code} applied ({appliedCoupon.percent}% OFF)</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-emerald-700 hover:text-rose-600 font-bold text-xs"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (FOODOVA50)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs uppercase placeholder-gray-400 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-brand-500 hover:text-white text-dark-800 font-bold text-xs transition-colors"
                >
                  Apply
                </button>
              </form>
            )}
            {couponError && (
              <p className="text-[11px] text-rose-500 mt-1">{couponError}</p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-dark-800">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST & Restaurant Taxes (5%)</span>
              <span className="font-semibold text-dark-800">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-gray-400" />
                Delivery Fee
              </span>
              <span className="font-semibold text-dark-800">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-600 font-bold uppercase text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                    Free
                  </span>
                ) : (
                  formatPrice(deliveryFee)
                )}
              </span>
            </div>
            {subtotal < 300 && (
              <p className="text-[10px] text-amber-600 font-medium">
                Add {formatPrice(300 - subtotal)} more for FREE delivery!
              </p>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-sm font-black text-dark-900 font-display">
              <span>To Pay</span>
              <span className="text-base text-brand-600">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleProceedCheckout}
            className="w-full py-3 px-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm shadow-brand hover:shadow-brand-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Delivery guarantee tag */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-600 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Safe contactless delivery in 35-45 mins</span>
          </div>

        </div>
      )}

    </div>
  );
};

export default CartPanel;
