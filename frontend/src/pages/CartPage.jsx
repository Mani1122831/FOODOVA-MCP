import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, ArrowRight } from 'lucide-react';
import CartPanel from '../components/CartPanel';
import { useCart } from '../context/CartContext';

export const CartPage = () => {
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top back navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/menu')}
          className="flex items-center gap-2 text-xs font-bold text-dark-700 hover:text-brand-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Browsing Menu</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ShoppingBag className="w-4 h-4 text-brand-500" />
          <span>{itemCount} items in cart</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200/80 shadow-card">
        <CartPanel isMobileModal={false} />
      </div>

    </div>
  );
};

export default CartPage;
