import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  MapPin, 
  Sparkles, 
  Hand, 
  Mic, 
  User, 
  Menu, 
  X, 
  Tag, 
  Flame, 
  ChevronDown,
  ShieldAlert,
  LogOut,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar';

export const Header = ({ 
  onToggleAI, 
  onToggleGestures, 
  gesturesActive = false, 
  onToggleVoice, 
  voiceActive = false,
  gestureConfidence = 0
}) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Bangalore Central, Indiranagar');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const locationsList = [
    'Bangalore Central, Indiranagar',
    'Bangalore South, Koramangala',
    'Mumbai Bandra West',
    'Delhi NCR, Cyber City',
    'Hyderabad, Hitec City',
    'Pune, Koregaon Park'
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3' 
            : 'bg-cream-50/90 backdrop-blur-sm py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 md:gap-6">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-orange-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-brand group-hover:scale-105 transition-transform duration-200">
                  F
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-2xl tracking-tighter text-dark-900 group-hover:text-brand-500 transition-colors">
                    FOOD<span className="text-brand-500">OVA</span>
                  </span>
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-gray-500 -mt-1 hidden sm:block">
                    Faster. Smarter.
                  </span>
                </div>
              </Link>

              {/* Delivery location selector */}
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium text-dark-700 hover:border-brand-300 hover:bg-brand-50/50 transition-all shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                  <span className="truncate max-w-[140px] text-dark-900 font-semibold">{selectedLocation}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                <AnimatePresence>
                  {showLocationPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50"
                    >
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Select Delivery Hub
                      </div>
                      {locationsList.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => {
                            setSelectedLocation(loc);
                            setShowLocationPicker(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs rounded-xl transition-colors flex items-center justify-between ${
                            selectedLocation === loc ? 'bg-brand-50 text-brand-600 font-bold' : 'hover:bg-gray-50 text-dark-700'
                          }`}
                        >
                          {loc}
                          {selectedLocation === loc && <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Central Search Bar */}
            <div className="flex-1 max-w-md hidden md:block">
              <SearchBar />
            </div>

            {/* Right Nav Action Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Hands-Free Gesture Mode Button */}
              <button
                onClick={onToggleGestures}
                title="Toggle Hand Gesture Control (Hands-Free Mode)"
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  gesturesActive
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md animate-pulse'
                    : 'bg-white text-dark-700 border-gray-200 hover:border-amber-400 hover:bg-amber-50/50'
                }`}
              >
                <Hand className={`w-4 h-4 ${gesturesActive ? 'text-white' : 'text-amber-500'}`} />
                <span className="hidden xl:inline">Hands-Free</span>
                {gesturesActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-1 -right-1"></span>
                )}
              </button>

              {/* Voice Control Button */}
              <button
                onClick={onToggleVoice}
                title="Toggle Voice Commands"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  voiceActive
                    ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                    : 'bg-white text-dark-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
              >
                <Mic className={`w-4 h-4 ${voiceActive ? 'text-white animate-bounce' : 'text-blue-500'}`} />
                <span className="hidden xl:inline">Voice</span>
              </button>

              {/* AI Assistant Button */}
              <button
                onClick={onToggleAI}
                title="Open Foodova AI Assistant"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow" />
                <span className="hidden sm:inline">AI Chef</span>
              </button>

              {/* Menu link */}
              <Link
                to="/menu"
                className={`hidden lg:flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${
                  location.pathname === '/menu' ? 'text-brand-500 bg-brand-50' : 'text-dark-700 hover:text-brand-500'
                }`}
              >
                <Flame className="w-4 h-4 text-brand-500" />
                <span>Menu</span>
              </Link>

              {/* Cart Button with badge */}
              <Link
                to="/cart"
                className="relative flex items-center justify-center p-2.5 rounded-2xl bg-white border border-gray-200 hover:border-brand-500 shadow-sm text-dark-900 hover:text-brand-500 transition-all hover:scale-105"
                title="View Cart"
              >
                <ShoppingBag className="w-5 h-5 text-dark-800" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce-soft">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Auth / Profile Area */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 rounded-2xl bg-white border border-gray-200 hover:border-brand-400 transition-all shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-500 to-amber-400 flex items-center justify-center text-white font-bold text-xs">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-xs font-bold text-dark-900 hidden md:inline truncate max-w-[80px]">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50"
                        onMouseLeave={() => setProfileDropdownOpen(false)}
                      >
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-xs font-bold text-dark-900 truncate">{user?.name}</p>
                          <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                          {isAdmin && (
                            <span className="inline-block mt-1 text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                              ADMIN ACCESS
                            </span>
                          )}
                        </div>

                        <div className="py-1">
                          <Link
                            to="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-dark-700 hover:bg-gray-50 rounded-xl transition-colors"
                          >
                            <User className="w-4 h-4 text-gray-400" />
                            My Profile
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-dark-700 hover:bg-gray-50 rounded-xl transition-colors"
                          >
                            <Clock className="w-4 h-4 text-gray-400" />
                            My Orders
                          </Link>
                          {isAdmin && (
                            <>
                              <Link
                                to="/admin"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                              >
                                <ShieldAlert className="w-4 h-4 text-purple-500" />
                                Admin Portal
                              </Link>
                              <Link
                                to="/admin/ai-studio"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                              >
                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                AI Food Studio
                              </Link>
                            </>
                          )}
                        </div>

                        <div className="pt-1 border-t border-gray-100">
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          >
                            <LogOut className="w-4 h-4 text-rose-500" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-bold px-3 py-2 rounded-xl text-dark-800 hover:text-brand-500 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs font-bold px-4 py-2 rounded-xl bg-brand-500 text-white shadow-brand hover:bg-brand-600 transition-all hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile hamburger button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-white border border-gray-200 text-dark-800 hover:text-brand-500 md:hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>
          </div>

          {/* Mobile search bar */}
          <div className="mt-3 md:hidden">
            <SearchBar />
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-3 overflow-hidden shadow-lg"
            >
              <div className="flex flex-col gap-2">
                <Link
                  to="/menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-brand-50 text-dark-800 font-semibold text-sm"
                >
                  <Flame className="w-5 h-5 text-brand-500" />
                  Explore Full Menu
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-brand-50 text-dark-800 font-semibold text-sm"
                >
                  <Clock className="w-5 h-5 text-blue-500" />
                  Track Orders
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-50 text-dark-800 font-semibold text-sm"
                >
                  <span className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-emerald-500" />
                    My Cart
                  </span>
                  {itemCount > 0 && (
                    <span className="bg-brand-500 text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
                      {itemCount}
                    </span>
                  )}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-sm"
                  >
                    <ShieldAlert className="w-5 h-5 text-purple-600" />
                    Admin Dashboard
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
