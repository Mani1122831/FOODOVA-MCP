import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Load cart from backend if authenticated, or localStorage if guest
  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const res = await api.get('/cart');
          if (res.data?.success && res.data.cart?.items) {
            // Map backend cart items to consistent format
            const formatted = res.data.cart.items.map(item => ({
              id: item._id,
              productId: item.product?._id || item.product,
              product: item.product,
              name: item.product?.name || 'Item',
              price: item.price,
              quantity: item.quantity,
              thumbnail: item.product?.thumbnail || '',
              customizations: item.customizations || [],
              addOns: item.addOns || []
            }));
            setItems(formatted);
          }
        } catch (err) {
          console.warn('Failed to load server cart:', err.message);
        } finally {
          setLoading(false);
        }
      } else {
        const local = localStorage.getItem('foodova_guest_cart');
        if (local) {
          try {
            setItems(JSON.parse(local));
          } catch (e) {
            setItems([]);
          }
        }
      }
    };

    fetchCart();
  }, [isAuthenticated]);

  // Sync guest cart to local storage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('foodova_guest_cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const addItem = async (product, quantity = 1, customizations = [], addOns = []) => {
    const productId = product._id || product.id;
    const price = product.discountPrice || product.price;

    if (isAuthenticated) {
      try {
        const res = await api.post('/cart', {
          productId,
          quantity,
          customizations,
          addOns
        });
        if (res.data?.success && res.data.cart?.items) {
          const formatted = res.data.cart.items.map(item => ({
            id: item._id,
            productId: item.product?._id || item.product,
            product: item.product,
            name: item.product?.name || product.name,
            price: item.price,
            quantity: item.quantity,
            thumbnail: item.product?.thumbnail || product.thumbnail,
            customizations: item.customizations || [],
            addOns: item.addOns || []
          }));
          setItems(formatted);
          toast.success(`Added ${product.name} to cart!`);
          return;
        }
      } catch (err) {
        toast.error('Could not sync cart to server');
      }
    }

    // Guest cart fallback or optimistic update
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.productId === productId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        toast.success(`Updated ${product.name} quantity in cart!`);
        return updated;
      } else {
        toast.success(`Added ${product.name} to cart!`);
        return [...prev, {
          id: 'local_' + Date.now(),
          productId,
          product,
          name: product.name,
          price,
          quantity,
          thumbnail: product.thumbnail || product.images?.[0]?.url || '',
          customizations,
          addOns
        }];
      }
    });
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeItem(itemId);
    }

    if (isAuthenticated && !itemId.startsWith('local_')) {
      try {
        const res = await api.put(`/cart/${itemId}`, { quantity: newQuantity });
        if (res.data?.success && res.data.cart?.items) {
          const formatted = res.data.cart.items.map(item => ({
            id: item._id,
            productId: item.product?._id || item.product,
            product: item.product,
            name: item.product?.name || item.name,
            price: item.price,
            quantity: item.quantity,
            thumbnail: item.product?.thumbnail || '',
            customizations: item.customizations || [],
            addOns: item.addOns || []
          }));
          setItems(formatted);
          return;
        }
      } catch (err) {
        toast.error('Failed to update cart');
      }
    }

    setItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
  };

  const removeItem = async (itemId) => {
    if (isAuthenticated && !itemId.startsWith('local_')) {
      try {
        await api.delete(`/cart/${itemId}`);
      } catch (err) {
        console.warn('Failed to remove server item');
      }
    }
    setItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Item removed from cart');
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.delete('/cart/clear');
      } catch (err) {
        console.warn('Failed to clear server cart');
      }
    }
    setItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('foodova_guest_cart');
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => {
    const addOnTotal = item.addOns?.reduce((a, b) => a + (b.price || 0), 0) || 0;
    return sum + (item.price + addOnTotal) * item.quantity;
  }, 0);

  const discount = appliedCoupon ? (subtotal * (appliedCoupon.percent / 100)) : 0;
  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round(taxable * 0.05); // 5% GST
  const deliveryFee = subtotal > 300 || subtotal === 0 ? 0 : 30; // Free delivery over ₹300
  const total = taxable + tax + deliveryFee;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = (code) => {
    const cleanCode = code?.trim().toUpperCase();
    if (cleanCode === 'FOODOVA50') {
      setAppliedCoupon({ code: 'FOODOVA50', percent: 20 });
      toast.success('Coupon FOODOVA50 applied: 20% OFF!');
      return true;
    } else if (cleanCode === 'WELCOME') {
      setAppliedCoupon({ code: 'WELCOME', percent: 15 });
      toast.success('Welcome coupon applied: 15% OFF!');
      return true;
    } else {
      toast.error('Invalid or expired coupon code');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  return (
    <CartContext.Provider value={{
      items,
      loading,
      subtotal,
      discount,
      tax,
      deliveryFee,
      total,
      itemCount,
      appliedCoupon,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
