import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Minus, Flame, Sparkles, Check } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onSelect }) => {
  const { items, addItem, updateQuantity } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Check if item is already in cart
  const cartItem = items.find(
    i => (i.productId === product._id || i.productId === product.id)
  );
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 900);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, currentQuantity + 1);
    } else {
      addItem(product, 1);
    }
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, currentQuantity - 1);
    }
  };

  const originalPrice = product.price;
  const discountedPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = product.discountPercentage || (hasDiscount ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect && onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-3xl p-4 shadow-card hover:shadow-card-hover border border-gray-100 flex flex-col justify-between cursor-pointer transition-all duration-300"
    >
      {/* Top badges bar */}
      <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-cream-100 flex items-center justify-center mb-3">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-xl shadow-md tracking-wider">
            {discountPercent}% OFF
          </div>
        )}

        {/* New Launch badge */}
        {product.isNewLaunch && (
          <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-yellow-300" />
            NEW
          </div>
        )}

        {/* Product Image with smooth zoom */}
        <img
          src={product.thumbnail || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop';
          }}
        />

        {/* Veg / Non-Veg Icon Overlay */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <div 
            className={`w-5 h-5 rounded-md bg-white/95 backdrop-blur-xs flex items-center justify-center border shadow-xs ${
              product.isVeg ? 'border-green-600' : 'border-red-600'
            }`}
            title={product.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${product.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
          </div>
        </div>

        {/* Quick calories chip */}
        {product.nutrition?.calories && (
          <div className="absolute bottom-2.5 right-2.5 z-10 bg-dark-900/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" />
            {product.nutrition.calories} kcal
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & reviews */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-dark-900">
                {product.rating?.average ? product.rating.average.toFixed(1) : '4.5'}
              </span>
              <span className="text-[11px] text-gray-600 font-medium">
                ({product.rating?.count || 120})
              </span>
            </div>
            {product.preparationTime && (
              <span className="text-[11px] text-gray-600 font-medium">
                {product.preparationTime} mins
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-display font-bold text-dark-900 text-base group-hover:text-brand-500 transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
            {product.description}
          </p>
        </div>

        {/* Price and Add to Cart Section */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-dark-900 font-display">
              {formatPrice(discountedPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-600 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Dynamic Quantity or Add Button */}
          <div>
            {currentQuantity > 0 ? (
              <div 
                className="flex items-center bg-brand-50 border border-brand-200 rounded-2xl p-1 shadow-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-7 h-7 rounded-xl bg-white text-brand-600 font-bold flex items-center justify-center hover:bg-brand-500 hover:text-white transition-colors shadow-xs"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-black text-brand-700">
                  {currentQuantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-7 h-7 rounded-xl bg-brand-500 text-white font-bold flex items-center justify-center hover:bg-brand-600 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 text-dark-950 font-bold text-xs shadow-sm hover:shadow-brand transition-all duration-150"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Flying confirmation feedback */}
      <AnimatePresence>
        {addedAnimation && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 0 }}
            animate={{ scale: 1, opacity: 1, y: -40 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 pointer-events-none"
          >
            <Check className="w-3.5 h-3.5" />
            Added to Cart!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;
