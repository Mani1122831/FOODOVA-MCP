import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Hand, 
  Mic, 
  Clock, 
  ShieldCheck, 
  Award,
  ChevronRight,
  Star
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import BurgerRevealVideo from '../components/BurgerRevealVideo';
import { BURGERS_DATA } from '../data/mockData';

export const HomePage = () => {
  const navigate = useNavigate();

  const heroFoods = [
    {
      id: '1',
      name: 'Premium Truffle Burger',
      desc: 'Fresh grilled patty with black truffle aioli & crispy onions',
      price: 349,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop',
      badge: 'Chef Favorite'
    },
    {
      id: '2',
      name: 'Stonebaked Pepperoni Blast',
      desc: 'San Marzano tomatoes, fresh mozzarella, extra crisp crust',
      price: 399,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&h=600&fit=crop',
      badge: 'Trending Now'
    }
  ];

  const categories = [
    { 
      name: 'Combos', 
      count: '12 items', 
      slug: 'combos', 
      image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500&h=500&fit=crop' 
    },
    { 
      name: 'Burgers', 
      count: '24 items', 
      slug: 'burgers', 
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop' 
    },
    { 
      name: 'Pizza', 
      count: '10 items', 
      slug: 'pizza', 
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop' 
    },
    { 
      name: 'Fried Chicken', 
      count: '8 items', 
      slug: 'fried-chicken', 
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&h=500&fit=crop' 
    },
    { 
      name: 'Wraps', 
      count: '7 items', 
      slug: 'wraps', 
      image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&h=500&fit=crop' 
    },
    { 
      name: 'Sides & Fries', 
      count: '9 items', 
      slug: 'fries-sides', 
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=500&fit=crop' 
    },
    { 
      name: 'Desserts', 
      count: '8 items', 
      slug: 'desserts', 
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=500&fit=crop' 
    },
    { 
      name: 'Beverages', 
      count: '11 items', 
      slug: 'beverages', 
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=500&fit=crop' 
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        
        {/* Soft background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-orange-200/40 via-amber-200/30 to-brand-100/40 blur-3xl -z-10 rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Modern badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-200 shadow-sm text-xs font-bold text-brand-600">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
                <span>Next-Gen Food Ordering Platform</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                <span className="text-gray-500 font-medium">Hands-Free & AI Enabled</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-dark-900 tracking-tight leading-[1.08]">
                Good food.<br />
                <span className="text-gradient">Faster. Smarter.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Indulge in mouth-watering artisanal burgers, authentic hand-tossed pizzas, and crunchy feast combos. Order with natural voice, webcam hand gestures, or our intelligent Gemini AI assistant.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/menu"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-base shadow-brand hover:shadow-brand-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Flame className="w-5 h-5" />
                  <span>Explore Menu</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>

                <button
                  onClick={() => navigate('/menu?deals=true')}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-gray-50 text-dark-900 border border-gray-200 font-bold text-base shadow-card hover:shadow-card-hover transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                >
                  <span>Today's Offers (40% OFF)</span>
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 border-t border-gray-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-semibold">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>35 Min Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>4.8 Rating (12k+ Foodies)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span>100% Hygienic Food</span>
                </div>
              </div>

            </motion.div>

            {/* Right Hero: Live 4K Burger Reveal Video */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative flex items-center justify-center"
            >
              <div className="relative w-full max-w-md">
                
                {/* 4K Burger Reveal Player in Hero */}
                <BurgerRevealVideo variant="hero" />

                {/* Floating Innovation Badges */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2.5 z-20 pointer-events-none"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Hand className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-dark-900">Finger Gestures</h5>
                    <p className="text-[10px] text-gray-500">Two fingers touch to order</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -top-5 -right-3 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-xl border border-purple-100 flex items-center gap-2.5 z-20 pointer-events-none"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-dark-900">Gemini AI Studio</h5>
                    <p className="text-[10px] text-gray-500">Live Culinary Reveal</p>
                  </div>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Cinematic Burger Reveal Showcase & Anatomy Theater */}
      <BurgerRevealVideo variant="showcase" />

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">Popular Categories</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Explore freshly made bites crafted for every craving
            </p>
          </div>
          <Link
            to="/menu"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <motion.div
              key={cat.slug}
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/menu?category=${cat.slug}`)}
              className="bg-white p-3 rounded-3xl border border-gray-100/90 shadow-card hover:shadow-card-hover cursor-pointer text-center flex flex-col items-center justify-between group transition-all duration-300"
            >
              {/* Full Category Food Image */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-cream-100 mb-2.5 relative shadow-xs">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500 ease-out"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop';
                  }}
                />
              </div>

              <h4 className="font-display font-extrabold text-dark-900 text-xs sm:text-sm group-hover:text-brand-500 transition-colors line-clamp-1">
                {cat.name}
              </h4>
              <span className="text-[11px] font-semibold text-gray-400 mt-0.5">
                {cat.count}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Gourmet Burgers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Trending Now</span>
            </div>
            <h2 className="section-title">Handcrafted Gourmet Burgers</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Grilled to perfection on buttered brioche buns with artisanal melted cheese
            </p>
          </div>
          <Link
            to="/menu?category=burgers"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>See all 24 Burgers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BURGERS_DATA.slice(0, 4).map((burger) => (
            <ProductCard 
              key={burger.id} 
              product={burger} 
              onSelect={() => navigate('/menu?category=burgers')}
            />
          ))}
        </div>
      </section>

      {/* Features Banner: Hands-Free & AI Experience */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-dark-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4">
                <Hand className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-xl text-white">Hands-Free Ordering</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Cook, eat, or relax without touching your device. Use smooth hand gestures captured via your webcam for scrolling, selecting, and ordering.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-xl text-white">AI Culinary Sommelier</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Powered by Gemini models, our AI analyzes your budget, dietary goals, and calorie preferences to recommend ideal meal pairings instantly.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-xl text-white">Voice Command System</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Simply say "Open burgers", "Add combo", or "Checkout". Safe vocal verification guarantees zero accidental payments.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
