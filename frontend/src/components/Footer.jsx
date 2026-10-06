import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, Headphones, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-dark-900 text-gray-300 pt-16 pb-12 border-t border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-dark-700/60">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Lightning Delivery</h4>
              <p className="text-xs text-gray-400">Hot & fresh in ~30-45 mins</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Quality Food</h4>
              <p className="text-xs text-gray-400">Fresh daily ingredients</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">AI Food Assistant</h4>
              <p className="text-xs text-gray-400">Smart meal suggestions</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">24/7 Priority Support</h4>
              <p className="text-xs text-gray-400">Always here to help you</p>
            </div>
          </div>
        </div>

        {/* Links section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-black text-xl">
                F
              </div>
              <span className="font-display font-black text-2xl text-white tracking-tight">
                FOOD<span className="text-brand-500">OVA</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-sm mb-6 leading-relaxed">
              Experience the future of food ordering. Hand-crafted meals, hands-free gesture control, AI pairing, and lightning-fast delivery.
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Kitchens Live Now
              </span>
              <span>•</span>
              <span>Clean FSSAI Certified</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><Link to="/menu" className="hover:text-brand-400 transition-colors">Our Menu</Link></li>
              <li><Link to="/menu?category=burgers" className="hover:text-brand-400 transition-colors">Artisan Burgers</Link></li>
              <li><Link to="/menu?category=pizza" className="hover:text-brand-400 transition-colors">Stone Crust Pizza</Link></li>
              <li><Link to="/menu?category=combos" className="hover:text-brand-400 transition-colors">Saver Combos</Link></li>
              <li><Link to="/orders" className="hover:text-brand-400 transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">Smart Tech</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Hands-Free Gesture AI</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Voice Command Ordering</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Gemini AI Recommendations</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Virtual Keyboard Control</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Canva Asset Pipeline</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4">Support & Legal</h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><a href="mailto:support@foodova.com" className="hover:text-brand-400 transition-colors">support@foodova.com</a></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">FSSAI License Info</span></li>
              <li><Link to="/login" className="hover:text-brand-400 transition-colors">Customer Login</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} FOODOVA Inc. All rights reserved. Crafted with care for modern food lovers.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for supreme taste
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
