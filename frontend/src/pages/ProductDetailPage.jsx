import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Minus, 
  Flame, 
  Star, 
  ShieldAlert, 
  Check, 
  Clock, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { SPICE_LEVELS } from '../utils/constants';
import { useCart } from '../context/CartContext';

export const ProductDetailPage = ({ product, onClose }) => {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(
    product.thumbnail || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop'
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedSpice, setSelectedSpice] = useState(product.spiceLevel || 'mild');
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [selectedCustomizations, setSelectedCustomizations] = useState({});

  if (!product) return null;

  const basePrice = product.discountPrice || product.price;

  // Add-on options fallback if not in schema
  const defaultAddOns = product.addOns && product.addOns.length > 0 ? product.addOns : [
    { name: 'Extra Cheddar Cheese Slice', price: 35 },
    { name: 'Crispy Caramelized Onions', price: 25 },
    { name: 'Fiery Jalapeño Dip', price: 30 }
  ];

  const toggleAddOn = (addon) => {
    if (selectedAddOns.some(a => a.name === addon.name)) {
      setSelectedAddOns(prev => prev.filter(a => a.name !== addon.name));
    } else {
      setSelectedAddOns(prev => [...prev, addon]);
    }
  };

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const itemUnitPrice = basePrice + addOnsTotal;
  const totalPrice = itemUnitPrice * quantity;

  const handleAddToCart = () => {
    addItem(product, quantity, Object.entries(selectedCustomizations).map(([name, value]) => ({ name, value })), selectedAddOns);
    onClose();
  };

  const allImages = [
    product.thumbnail,
    ...(product.images?.map(i => i.url) || [])
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-dark-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 max-h-[92vh] flex flex-col"
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div 
              className={`w-5 h-5 rounded-md bg-white flex items-center justify-center border ${
                product.isVeg ? 'border-green-600' : 'border-red-600'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${product.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
            </div>
            <span className="font-bold text-xs uppercase tracking-wider text-gray-500">
              {product.isVeg ? 'Pure Veg' : 'Non-Veg Recipe'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-dark-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          
          {/* Main Visual Gallery */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-72 rounded-3xl overflow-hidden bg-cream-100 border border-gray-100 shadow-inner">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop';
                }}
              />
              {product.discountPrice && product.discountPrice < product.price && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-amber-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-md">
                  Save {formatPrice(product.price - product.discountPrice)}
                </div>
              )}
            </div>

            {/* Thumbnail Row if multiple images */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img ? 'border-brand-500 scale-105' : 'border-gray-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-black text-2xl text-dark-900">
                {product.name}
              </h2>
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl text-xs font-bold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating?.average || 4.5}</span>
                <span className="text-gray-400">({product.rating?.count || 120})</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Nutrition & Preparation Stats */}
          {product.nutrition && (
            <div className="bg-cream-50/70 p-4 rounded-2xl border border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Nutritional Breakdown (Per Serving)
              </h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-xs">
                  <span className="text-[10px] text-gray-400 font-semibold block">CALORIES</span>
                  <span className="text-sm font-black text-dark-900">{product.nutrition.calories || 380} kcal</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-xs">
                  <span className="text-[10px] text-gray-400 font-semibold block">PROTEIN</span>
                  <span className="text-sm font-black text-dark-900">{product.nutrition.protein || 14}g</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-xs">
                  <span className="text-[10px] text-gray-400 font-semibold block">CARBS</span>
                  <span className="text-sm font-black text-dark-900">{product.nutrition.carbs || 48}g</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-xs">
                  <span className="text-[10px] text-gray-400 font-semibold block">FAT</span>
                  <span className="text-sm font-black text-dark-900">{product.nutrition.fat || 18}g</span>
                </div>
              </div>
            </div>
          )}

          {/* Ingredients & Allergens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Ingredients
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-dark-800 px-2.5 py-1 rounded-lg">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.allergens && product.allergens.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  Allergen Notice
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.allergens.map((alg, i) => (
                    <span key={i} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-lg font-medium">
                      Contains: {alg}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Spice Level Selector */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Customize Spice Intensity
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {SPICE_LEVELS.map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setSelectedSpice(sp.id)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    selectedSpice === sp.id
                      ? 'bg-brand-500 text-white border-brand-500 shadow-brand'
                      : 'bg-white text-dark-700 border-gray-200 hover:border-brand-200'
                  }`}
                >
                  <span className="block text-sm mb-0.5">{sp.icon}</span>
                  <span>{sp.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Delicious Add-ons */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Upgrade Your Meal (Add-ons)
            </h4>
            <div className="space-y-2">
              {defaultAddOns.map((addon) => {
                const isSelected = selectedAddOns.some(a => a.name === addon.name);
                return (
                  <button
                    key={addon.name}
                    type="button"
                    onClick={() => toggleAddOn(addon)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-400 text-dark-900 shadow-xs'
                        : 'bg-white border-gray-200 text-dark-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isSelected ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{addon.name}</span>
                    </div>
                    <span className="font-bold text-dark-900">+{formatPrice(addon.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions: Quantity Stepper & Add To Cart Button */}
        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-gray-100 rounded-2xl p-1">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-9 rounded-xl bg-white text-dark-800 font-bold flex items-center justify-center hover:bg-gray-200 transition-colors shadow-xs"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-sm font-black text-dark-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-9 h-9 rounded-xl bg-white text-dark-800 font-bold flex items-center justify-center hover:bg-gray-200 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add Button with computed price */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-500 text-dark-950 font-black text-sm shadow-md hover:shadow-brand transition-all flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </span>
            <span className="font-display font-black text-base">
              {formatPrice(totalPrice)}
            </span>
          </button>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default ProductDetailPage;
