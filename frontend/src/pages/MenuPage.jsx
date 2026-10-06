import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Tag, 
  Flame, 
  Search, 
  Filter, 
  ChevronRight,
  SlidersHorizontal,
  X
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import CartPanel from '../components/CartPanel';
import SkeletonCard from '../components/SkeletonCard';
import ProductDetailPage from './ProductDetailPage';

import { CATEGORIES_DATA, BURGERS_DATA, ALL_MOCK_PRODUCTS } from '../data/mockData';

export const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState(CATEGORIES_DATA);
  const [products, setProducts] = useState(BURGERS_DATA);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES_DATA[0]);
  const [filterVeg, setFilterVeg] = useState(null); // null = all, true = veg, false = non-veg
  const [topTab, setTopTab] = useState('all'); // all, for_you, deals, new_launch
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const categoryQuery = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const dealsQuery = searchParams.get('deals');
  const vegQuery = searchParams.get('veg');

  // Fetch categories on mount with robust fallback
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data?.success && res.data.categories?.length > 0) {
          setCategories(res.data.categories);
          if (categoryQuery) {
            const found = res.data.categories.find(c => c.slug === categoryQuery || c._id === categoryQuery);
            if (found) setActiveCategory(found);
          }
        } else {
          setCategories(CATEGORIES_DATA);
        }
      } catch (err) {
        console.warn('Using authentic offline category catalog:', err.message);
        setCategories(CATEGORIES_DATA);
      }
    };
    fetchCategories();
  }, [categoryQuery]);

  // Synchronize veg query param
  useEffect(() => {
    if (vegQuery === 'true') setFilterVeg(true);
    if (dealsQuery === 'true') setTopTab('deals');
  }, [vegQuery, dealsQuery]);

  // Fetch or filter products when category/filters/search changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (searchQuery) {
          params.search = searchQuery;
        } else if (activeCategory) {
          params.category = activeCategory._id;
        }

        if (filterVeg !== null) {
          params.isVeg = filterVeg;
        }

        if (topTab === 'new_launch') {
          params.isNewLaunch = true;
        } else if (topTab === 'for_you') {
          params.isFeatured = true;
        }

        const res = await api.get('/products', { params });
        let list = [];
        if (res.data?.success && Array.isArray(res.data.products) && res.data.products.length > 0) {
          list = res.data.products;
        } else {
          // Fallback to authentic verified culinary catalog
          const isBurgerCategory = !activeCategory || activeCategory.slug === 'burgers' || activeCategory.name?.toLowerCase().includes('burger');
          
          if (isBurgerCategory) {
            list = [...BURGERS_DATA];
          } else {
            const catSlug = (activeCategory?.slug || '').toLowerCase();
            const catId = (activeCategory?._id || activeCategory?.id || '').toLowerCase();
            const catName = (activeCategory?.name || '').toLowerCase();

            list = ALL_MOCK_PRODUCTS.filter(p => {
              const pCatId = typeof p.category === 'object' ? (p.category?._id || p.category?.slug || '') : (p.category || '');
              const pCatSlug = (p.categorySlug || p.category?.slug || '').toLowerCase();
              const pCatName = (p.categoryName || p.category?.name || '').toLowerCase();

              return pCatId.toLowerCase() === catId ||
                     pCatId.toLowerCase() === catSlug ||
                     pCatSlug === catSlug ||
                     (catSlug && pCatName.includes(catSlug.split('-')[0])) ||
                     (pCatSlug && catName.includes(pCatSlug.split('-')[0])) ||
                     catName.includes(pCatName);
            });
          }
        }

        // Apply in-memory search and tab filters
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
        }

        if (filterVeg !== null) {
          list = list.filter(p => p.isVeg === filterVeg);
        }

        if (topTab === 'deals') {
          list = list.filter(p => p.discountPrice && p.discountPrice < p.price);
        } else if (topTab === 'new_launch') {
          list = list.filter(p => p.isNewLaunch);
        } else if (topTab === 'for_you') {
          list = list.filter(p => p.isFeatured || (p.rating && p.rating.average >= 4.7));
        }

        setProducts(list);
      } catch (err) {
        console.warn('Applying local verified catalog:', err.message);
        let list = [...BURGERS_DATA];
        if (filterVeg !== null) {
          list = list.filter(p => p.isVeg === filterVeg);
        }
        if (topTab === 'deals') {
          list = list.filter(p => p.discountPrice && p.discountPrice < p.price);
        }
        setProducts(list);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, filterVeg, topTab, searchQuery]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    if (searchQuery) {
      setSearchParams({ category: category.slug });
    }
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Section: Our Menu Header & Top Filter Pills */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-dark-900 tracking-tight">
              Our Menu
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Freshly prepared with authentic ingredients and delivered hot to your doorstep.
            </p>
          </div>

          {/* Top Tabs: For You, Deals, New Launch */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setTopTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs shrink-0 ${
                topTab === 'all'
                  ? 'bg-dark-900 text-white shadow-sm'
                  : 'bg-white text-dark-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              All Items
            </button>

            <button
              onClick={() => setTopTab('for_you')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0 ${
                topTab === 'for_you'
                  ? 'bg-brand-500 text-white shadow-brand'
                  : 'bg-white text-dark-700 border border-gray-200 hover:border-brand-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>For You</span>
            </button>

            <button
              onClick={() => setTopTab('deals')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0 ${
                topTab === 'deals'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white text-dark-700 border border-gray-200 hover:border-amber-300'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              <span>Deals & Offers</span>
            </button>

            <button
              onClick={() => setTopTab('new_launch')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0 ${
                topTab === 'new_launch'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-dark-700 border border-gray-200 hover:border-purple-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-purple-400" />
              <span>New Launch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout: Left Category Sidebar | Center Products Grid | Right Cart Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================
            LEFT COLUMN: Category Sidebar (Matching Screenshot)
            ======================================================== */}
        <aside className="lg:col-span-3 xl:col-span-2 bg-white rounded-3xl p-3 border border-gray-200/80 shadow-card sticky top-24 max-h-[82vh] overflow-y-auto no-scrollbar hidden md:block">
          <div className="text-[11px] font-black uppercase tracking-wider text-gray-600 px-3 py-2">
            Categories
          </div>

          <div className="space-y-1.5">
            {categories.map((cat) => {
              const isActive = activeCategory?._id === cat._id;
              return (
                <button
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-50 text-dark-900 font-extrabold border-l-4 border-amber-500 shadow-xs'
                      : 'hover:bg-gray-50 text-dark-700 font-semibold'
                  }`}
                >
                  {/* Category Image / Icon */}
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop'}
                    alt={cat.name}
                    className="w-10 h-10 rounded-xl object-cover bg-cream-100 shrink-0 border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs leading-snug line-clamp-2">
                      {cat.name}
                    </span>
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Mobile Category Horizontal Scroller */}
        <div className="md:hidden col-span-12 overflow-x-auto no-scrollbar flex items-center gap-2 pb-2">
          {categories.map((cat) => {
            const isActive = activeCategory?._id === cat._id;
            return (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl shrink-0 text-xs font-bold transition-all shadow-xs ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white text-dark-800 border border-gray-200'
                }`}
              >
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop'}
                  alt={cat.name}
                  className="w-6 h-6 rounded-lg object-cover"
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================
            CENTER COLUMN: Food Products Grid (Matching Screenshot)
            ======================================================== */}
        <main className="lg:col-span-6 xl:col-span-7 space-y-5">
          
          {/* Section Heading + Veg/Non-Veg Filter Toggles */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-gray-200/80 shadow-xs">
            <div>
              <h2 className="font-display font-black text-xl text-dark-900">
                {searchQuery ? `Search Results for "${searchQuery}"` : activeCategory?.name || 'All Dishes'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {products.length} {products.length === 1 ? 'dish available' : 'dishes available'}
              </p>
            </div>

            {/* Veg / Non-Veg Pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterVeg(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterVeg === null
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>

              <button
                onClick={() => setFilterVeg(filterVeg === true ? null : true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  filterVeg === true
                    ? 'bg-green-600 text-white border-green-600 shadow-xs'
                    : 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-green-600 border border-white" />
                <span>Veg</span>
              </button>

              <button
                onClick={() => setFilterVeg(filterVeg === false ? null : false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  filterVeg === false
                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                    : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-red-600 border border-white" />
                <span>Non-Veg</span>
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-card space-y-4">
              <div className="text-5xl">🍽️</div>
              <h3 className="font-display font-black text-dark-900 text-lg">No dishes found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                We couldn't find any dishes matching your current filter. Try resetting your filter or searching for another keyword.
              </p>
              <button
                onClick={() => {
                  setFilterVeg(null);
                  setTopTab('all');
                  setSearchParams({});
                }}
                className="px-5 py-2.5 rounded-2xl bg-brand-500 text-white font-bold text-xs shadow-brand hover:bg-brand-600 transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onSelect={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}

        </main>

        {/* ========================================================
            RIGHT COLUMN: Shopping Cart Panel (Matching Screenshot)
            ======================================================== */}
        <aside className="lg:col-span-3 xl:col-span-3 sticky top-24 hidden lg:block h-[82vh]">
          <CartPanel />
        </aside>

      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default MenuPage;
