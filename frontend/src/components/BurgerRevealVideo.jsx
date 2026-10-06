import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Flame, 
  ShoppingBag, 
  ChevronRight,
  RotateCcw,
  Layers,
  Star,
  CheckCircle2,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BURGERS_DATA } from '../data/mockData';
import toast from 'react-hot-toast';

export const BURGER_REVEAL_SHOTS = [
  {
    id: 'shot-1',
    title: 'Signature Truffle Royale',
    badge: '360° Studio Reveal',
    tagline: 'Artisan Brioche • Aged Sharp Cheddar • Black Truffle Aioli',
    price: 279,
    originalPrice: 369,
    discount: '25% OFF',
    isVeg: false,
    calories: '640 kcal',
    rating: 4.9,
    videoUrl: 'https://assets.mixkit.co/videos/47191/47191-720.mp4',
    posterUrl: 'https://assets.mixkit.co/videos/47191/47191-thumb-720-4.jpg',
    duration: '14s',
    layers: [
      { name: 'Toasted Sesame Brioche', desc: 'Baked fresh daily, brushed with Normandy butter' },
      { name: 'Double Flame-Seared Patty', desc: '100% prime cut, seared at 450°F for smoky char' },
      { name: 'Cascading Melted Cheddar', desc: 'Aged Wisconsin cheddar melted between hot patties' },
      { name: 'Crisp Hydroponic Greens', desc: 'Farm-fresh oak lettuce & vine-ripened tomatoes' },
      { name: 'Signature Truffle Aioli', desc: 'Infused with Italian summer black truffles' }
    ]
  },
  {
    id: 'shot-2',
    title: 'The Colossal Double Stack & Fries',
    badge: 'Sizzle & Sides',
    tagline: 'Double Smashed Patties • Melted Gouda • Steaming Crinkle Fries',
    price: 349,
    originalPrice: 449,
    discount: '22% OFF',
    isVeg: false,
    calories: '780 kcal',
    rating: 4.95,
    videoUrl: 'https://assets.mixkit.co/videos/14010/14010-720.mp4',
    posterUrl: 'https://assets.mixkit.co/videos/14010/14010-thumb-720-0.jpg',
    duration: '12s',
    layers: [
      { name: 'Brioche Crown Bun', desc: 'Extra fluffy, golden-toasted crumb' },
      { name: 'Twin Smashed Patties', desc: 'Crispy lacy edges with ultra-juicy core' },
      { name: 'Double Cheddar Blanket', desc: 'Full coverage slow-drip melting cheese' },
      { name: 'Golden Crinkle Cut Fries', desc: 'Double-fried for maximum outer crunch' }
    ]
  },
  {
    id: 'shot-3',
    title: 'Slow-Mo Golden Crunch Drop',
    badge: 'Slow-Motion Reveal',
    tagline: 'Peri-Peri Crinkle Fries • Molten Cheese Core • Salted Crunch',
    price: 199,
    originalPrice: 269,
    discount: '26% OFF',
    isVeg: true,
    calories: '520 kcal',
    rating: 4.88,
    videoUrl: 'https://assets.mixkit.co/videos/47159/47159-720.mp4',
    posterUrl: 'https://assets.mixkit.co/videos/47159/47159-thumb-720-3.jpg',
    duration: '15s',
    layers: [
      { name: 'Crispy Idaho Russets', desc: 'Cut into extra-deep ridges for crunch' },
      { name: 'Fiery Peri-Peri Dust', desc: 'Blended African bird\'s eye chili and herbs' },
      { name: 'Companion Sliders', desc: 'Bite-sized brioche melts on the side' }
    ]
  },
  {
    id: 'shot-4',
    title: 'Artisan Sauce Glaze Finish',
    badge: 'Chef Crafting',
    tagline: 'Velvety Chipotle Aioli • Caramelized Shallots • Microgreens',
    price: 299,
    originalPrice: 389,
    discount: '23% OFF',
    isVeg: false,
    calories: '610 kcal',
    rating: 4.92,
    videoUrl: 'https://assets.mixkit.co/videos/24785/24785-720.mp4',
    posterUrl: 'https://assets.mixkit.co/videos/24785/24785-thumb-720-0.jpg',
    duration: '11s',
    layers: [
      { name: 'Signature Secret Sauce', desc: 'Slow-simmered paprika, honey, and aioli' },
      { name: 'Charred Sautéed Onions', desc: 'Caramelized for 40 minutes to sweet perfection' },
      { name: 'Pepperjack Melt', desc: 'Infused with jalapeño bits for a subtle kick' }
    ]
  }
];

export const BurgerRevealVideo = ({ variant = 'hero', className = '' }) => {
  const { addItem } = useCart();
  const [selectedShotIndex, setSelectedShotIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showTheaterModal, setShowTheaterModal] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

  const videoRef = useRef(null);
  const modalVideoRef = useRef(null);

  const currentShot = BURGER_REVEAL_SHOTS[selectedShotIndex];

  // Auto-play video on mount or shot switch
  useEffect(() => {
    setIsVideoLoading(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setIsVideoLoading(false);
        setHasPlayedOnce(true);
      }).catch(() => {
        // Autoplay policy fallback: mute and retry
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
        setIsVideoLoading(false);
      });
    }
  }, [selectedShotIndex]);

  // Track video progress
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  // Voice controller remote video control listeners
  useEffect(() => {
    const handleRemotePlay = () => {
      if (videoRef.current) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };
    const handleRemotePause = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };
    const handleRemoteToggleMute = () => {
      if (videoRef.current) {
        const next = !videoRef.current.muted;
        videoRef.current.muted = next;
        setIsMuted(next);
      }
    };
    const handleRemoteNextVideo = () => {
      setSelectedShotIndex(prev => (prev + 1) % BURGER_REVEAL_SHOTS.length);
    };

    window.addEventListener('foodova:play-video', handleRemotePlay);
    window.addEventListener('foodova:pause-video', handleRemotePause);
    window.addEventListener('foodova:toggle-video-mute', handleRemoteToggleMute);
    window.addEventListener('foodova:next-video', handleRemoteNextVideo);

    return () => {
      window.removeEventListener('foodova:play-video', handleRemotePlay);
      window.removeEventListener('foodova:pause-video', handleRemotePause);
      window.removeEventListener('foodova:toggle-video-mute', handleRemoteToggleMute);
      window.removeEventListener('foodova:next-video', handleRemoteNextVideo);
    };
  }, []);

  const togglePlay = (e) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = (e) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    toast.success(nextMuted ? 'Video Muted' : 'Audio Unmuted 🔊', { duration: 1500 });
  };

  const handleOrderRevealedBurger = (e) => {
    e?.stopPropagation();
    // Find matching mock burger or create custom item
    const matchingBurger = BURGERS_DATA.find(b => 
      b.name.toLowerCase().includes('truffle') || 
      b.name.toLowerCase().includes('royale')
    ) || BURGERS_DATA[0];

    const orderItem = {
      ...matchingBurger,
      id: `reveal-${currentShot.id}`,
      name: currentShot.title,
      price: currentShot.price,
      discountPrice: currentShot.price,
      originalPrice: currentShot.originalPrice,
      image: currentShot.posterUrl,
      thumbnail: currentShot.posterUrl,
      isVeg: currentShot.isVeg
    };

    addItem(orderItem, 1);
  };

  // ──────────────────────────────────────────────────────────────────────────
  // VARIANT: HERO (Embedded inside hero card on right column)
  // ──────────────────────────────────────────────────────────────────────────
  if (variant === 'hero') {
    return (
      <div className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-dark-950 text-white ${className}`}>
        
        {/* Ambient video glow behind container */}
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/30 via-amber-500/20 to-brand-600/30 rounded-3xl blur-xl -z-10 opacity-75 animate-pulse"></div>

        {/* Top Header Bar inside Video Card */}
        <div className="absolute top-0 inset-x-0 z-20 p-4 bg-gradient-to-b from-dark-950/90 via-dark-950/40 to-transparent flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-[11px] font-black tracking-wider uppercase bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
              LIVE 4K REVEAL
            </span>
            <span className="text-[11px] font-semibold text-gray-300 hidden sm:inline">
              {currentShot.badge}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="w-8 h-8 rounded-full bg-dark-900/80 hover:bg-dark-800 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/10 hover:scale-105 active:scale-95 shadow-md"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-gray-300" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
            </button>

            <button
              onClick={() => setShowTheaterModal(true)}
              title="Expand 4K Theater Experience"
              className="w-8 h-8 rounded-full bg-dark-900/80 hover:bg-dark-800 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/10 hover:scale-105 active:scale-95 shadow-md"
            >
              <Maximize2 className="w-3.5 h-3.5 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Main Video Viewport */}
        <div 
          onClick={togglePlay}
          className="relative h-72 sm:h-80 w-full overflow-hidden cursor-pointer group bg-dark-900"
        >
          <video
            ref={videoRef}
            src={currentShot.videoUrl}
            poster={currentShot.posterUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={() => setIsVideoLoading(false)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Vignette Shadow Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-dark-950/40 pointer-events-none"></div>

          {/* Central Play/Pause Hover Feedback */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs z-10"
              >
                <div className="w-16 h-16 rounded-full bg-brand-500/90 text-white flex items-center justify-center shadow-2xl border-2 border-white/20 pl-1 hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Scrub / Progress Bar */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-20">
            <div 
              className="h-full bg-gradient-to-r from-brand-500 to-amber-400 transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Shot Selection Thumbnails Bar */}
        <div className="p-3 bg-dark-900/90 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-400" />
              <span>Select Reveal Angle ({BURGER_REVEAL_SHOTS.length} Angles)</span>
            </span>
            <span className="text-[10px] text-amber-400 font-semibold">
              HD 60FPS
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {BURGER_REVEAL_SHOTS.map((shot, idx) => (
              <button
                key={shot.id}
                onClick={() => setSelectedShotIndex(idx)}
                className={`relative rounded-xl overflow-hidden p-0.5 transition-all text-left group ${
                  selectedShotIndex === idx 
                    ? 'ring-2 ring-brand-500 scale-102 bg-brand-500/20' 
                    : 'opacity-70 hover:opacity-100 hover:ring-1 hover:ring-white/30'
                }`}
              >
                <div className="h-11 rounded-lg overflow-hidden relative">
                  <img 
                    src={shot.posterUrl} 
                    alt={shot.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                  {selectedShotIndex === idx && (
                    <div className="absolute inset-0 bg-brand-500/20 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    </div>
                  )}
                </div>
                <div className="mt-1 px-0.5">
                  <p className="text-[9px] font-bold text-white truncate leading-tight">{shot.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Details & Direct Order Banner */}
        <div className="p-4 bg-dark-950 border-t border-white/5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`w-2 h-2 rounded-full ${currentShot.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                <h3 className="font-display font-black text-base text-white">
                  {currentShot.title}
                </h3>
              </div>
              <p className="text-xs text-gray-400 line-clamp-1">{currentShot.tagline}</p>
            </div>

            <div className="text-right shrink-0">
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-lg font-black text-amber-400 font-display">₹{currentShot.price}</span>
                <span className="text-xs text-gray-500 line-through">₹{currentShot.originalPrice}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {currentShot.discount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleOrderRevealedBurger}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-500 via-amber-500 to-brand-600 hover:from-brand-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-brand hover:shadow-brand-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Revealed Dish (₹{currentShot.price})</span>
            </button>

            <button
              onClick={() => setShowTheaterModal(true)}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition-all flex items-center gap-1 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Anatomy</span>
            </button>
          </div>
        </div>

        {/* 4K Cinematic Theater Lightbox Modal */}
        <AnimatePresence>
          {showTheaterModal && (
            <TheaterModal 
              shot={currentShot} 
              onClose={() => setShowTheaterModal(false)} 
              onOrder={handleOrderRevealedBurger}
            />
          )}
        </AnimatePresence>

      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VARIANT: SHOWCASE (Full-width cinematic section for homepage body)
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <section className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      
      {/* Decorative ambient aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[450px] bg-gradient-to-tr from-brand-600/20 via-amber-500/15 to-purple-600/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="rounded-3xl bg-dark-950 border border-white/10 shadow-2xl overflow-hidden text-white">
        
        {/* Section Header */}
        <div className="p-6 sm:p-8 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-r from-dark-900 via-dark-950 to-dark-900">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-400 text-xs font-bold mb-2">
              <Flame className="w-3.5 h-3.5 text-brand-400 fill-brand-400" />
              <span>THE ART OF THE BURGER • CINEMATIC 4K REVEAL</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight">
              Watch The Sizzle. Experience The Craft.
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
              Every burger is seasoned by hand, flame-seared at 450°F, and stacked layer-by-layer with fresh bakery brioche and artisan cheese.
            </p>
          </div>

          {/* Quick angle selector pills */}
          <div className="flex flex-wrap gap-2">
            {BURGER_REVEAL_SHOTS.map((shot, idx) => (
              <button
                key={shot.id}
                onClick={() => setSelectedShotIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedShotIndex === idx
                    ? 'bg-amber-400 text-dark-950 shadow-md font-black scale-102'
                    : 'bg-dark-800 text-gray-300 hover:bg-dark-700 border border-white/5'
                }`}
              >
                <span>{idx + 1}.</span>
                <span>{shot.badge}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Widescreen Video Theater & Layer Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Main 16:9 Video Canvas (8 cols on desktop) */}
          <div className="lg:col-span-8 relative bg-black flex items-center justify-center min-h-[340px] sm:min-h-[460px] group overflow-hidden">
            <video
              ref={videoRef}
              src={currentShot.videoUrl}
              poster={currentShot.posterUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
              className="w-full h-full object-cover max-h-[520px] cursor-pointer"
            />

            {/* Video overlay controls */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="flex items-center gap-1.5 bg-dark-900/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>{currentShot.badge}</span>
              </span>
            </div>

            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="w-9 h-9 rounded-full bg-dark-900/80 hover:bg-dark-800 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-gray-300" /> : <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />}
              </button>

              <button
                onClick={() => setShowTheaterModal(true)}
                className="w-9 h-9 rounded-full bg-dark-900/80 hover:bg-dark-800 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                <Maximize2 className="w-4 h-4 text-gray-300" />
              </button>
            </div>

            {/* Play/Pause state icon */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs cursor-pointer z-10"
                >
                  <div className="w-20 h-20 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-2xl pl-1 hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 fill-white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/20 z-20 cursor-pointer">
              <div 
                className="h-full bg-gradient-to-r from-brand-500 via-amber-400 to-brand-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Right Column: Culinary Anatomy & Ingredient Breakdown (4 cols) */}
          <div className="lg:col-span-4 p-6 sm:p-7 bg-dark-900/95 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-display font-black text-xl text-white">
                    {currentShot.title}
                  </h3>
                  <p className="text-xs text-amber-400 font-semibold">{currentShot.calories} • {currentShot.rating} ★★★★★</p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black font-display text-amber-400">₹{currentShot.price}</span>
                  <span className="text-xs text-gray-500 line-through block">₹{currentShot.originalPrice}</span>
                </div>
              </div>

              {/* Ingredient Breakdown List */}
              <div>
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-brand-400" />
                  <span>Layer-by-Layer Anatomy</span>
                </h4>

                <div className="space-y-2">
                  {currentShot.layers.map((layer, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 3 }}
                      onClick={() => setSelectedLayer(layer)}
                      className="p-2.5 rounded-xl bg-dark-800/80 hover:bg-dark-700/80 border border-white/5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-black flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">{layer.name}</p>
                          <p className="text-[11px] text-gray-400 line-clamp-1">{layer.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-white/10 space-y-2.5">
              <button
                onClick={handleOrderRevealedBurger}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-500 via-amber-500 to-brand-600 hover:from-brand-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-brand hover:shadow-brand-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order This Burger (₹{currentShot.price})</span>
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 font-semibold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Fresh Brioche</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Flame-Seared</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>35m Delivery</span>
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 4K Cinematic Theater Lightbox Modal */}
      <AnimatePresence>
        {showTheaterModal && (
          <TheaterModal 
            shot={currentShot} 
            onClose={() => setShowTheaterModal(false)} 
            onOrder={handleOrderRevealedBurger}
          />
        )}
      </AnimatePresence>

    </section>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// THEATER MODAL (Full Screen 4K Cinema View)
// ────────────────────────────────────────────────────────────────────────────
const TheaterModal = ({ shot, onClose, onOrder }) => {
  const [modalMuted, setModalMuted] = useState(false);
  const [modalPlaying, setModalPlaying] = useState(true);
  const modalVideoRef = useRef(null);

  useEffect(() => {
    if (modalVideoRef.current) {
      modalVideoRef.current.play().catch(() => {});
    }
  }, [shot]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl rounded-3xl overflow-hidden bg-dark-900 border border-white/10 shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-dark-950 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            <div>
              <h3 className="font-display font-black text-lg text-white leading-tight">
                {shot.title} — 4K Cinematic Theater
              </h3>
              <p className="text-xs text-gray-400">{shot.badge} • 60 FPS Studio Master</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = !modalMuted;
                setModalMuted(next);
                if (modalVideoRef.current) modalVideoRef.current.muted = next;
              }}
              className="w-9 h-9 rounded-full bg-dark-800 hover:bg-dark-700 text-white flex items-center justify-center transition-all border border-white/10"
            >
              {modalMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-dark-800 hover:bg-dark-700 text-white flex items-center justify-center transition-all border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Canvas */}
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center min-h-[300px] sm:min-h-[480px]">
          <video
            ref={modalVideoRef}
            src={shot.videoUrl}
            poster={shot.posterUrl}
            autoPlay
            loop
            muted={modalMuted}
            playsInline
            className="w-full h-full object-contain max-h-[60vh]"
          />
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-dark-950 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white">{shot.tagline}</p>
            <p className="text-xs text-gray-400">{shot.calories} • Handcrafted on order</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="text-right hidden sm:block">
              <span className="text-2xl font-black text-amber-400 font-display">₹{shot.price}</span>
              <span className="text-xs text-gray-500 line-through block">₹{shot.originalPrice}</span>
            </div>

            <button
              onClick={() => {
                onOrder();
                onClose();
              }}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-brand transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Now (₹{shot.price})</span>
            </button>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default BurgerRevealVideo;
