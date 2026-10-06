import React, { useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, MapPin, ArrowRight, Home } from 'lucide-react';
import Confetti from 'react-confetti';

export const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId') || 'FOO-ORD-NEW';
  const id = searchParams.get('id');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Confetti celebration for first 8 seconds */}
      <Confetti
        recycle={false}
        numberOfPieces={250}
        gravity={0.15}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl text-center space-y-6"
      >
        
        {/* Animated Checkmark Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner"
        >
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </motion.div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            Payment & Order Confirmed
          </span>
          <h1 className="font-display font-black text-3xl text-dark-900">
            Deliciousness is on the way!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
            Your order has been sent to our master chefs. Confirmation email and receipt have been dispatched.
          </p>
        </div>

        {/* Order Details Highlight Box */}
        <div className="bg-cream-50 p-4 rounded-2xl border border-gray-100 space-y-2 text-left">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Order Reference</span>
            <span className="font-mono font-bold text-dark-900 bg-white px-2 py-0.5 rounded border border-gray-200">
              #{orderId}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Estimated Delivery</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              ~35 - 45 Minutes
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Kitchen Status</span>
            <span className="font-bold text-amber-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              Preparing fresh
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to={id ? `/orders/${id}` : `/orders`}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-brand hover:shadow-brand-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Live Order Tracking</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/menu"
            className="py-3.5 px-5 rounded-2xl bg-white hover:bg-gray-50 text-dark-900 border border-gray-200 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Menu</span>
          </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
