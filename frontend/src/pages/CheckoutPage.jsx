import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  CreditCard, 
  Banknote, 
  Wallet, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  ArrowRight,
  Plus,
  Home,
  Building,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { formatPrice } from '../utils/helpers';
import { PAYMENT_METHODS } from '../utils/constants';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CheckoutPage = () => {
  const { items, subtotal, discount, tax, deliveryFee, total, clearCart, appliedCoupon } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Address State
  const [address, setAddress] = useState({
    label: 'Home',
    fullAddress: user?.addresses?.[0]?.fullAddress || '123, Palm Grove Avenue, Indiranagar',
    city: user?.addresses?.[0]?.city || 'Bangalore',
    state: user?.addresses?.[0]?.state || 'Karnataka',
    pincode: user?.addresses?.[0]?.pincode || '560038',
    landmark: user?.addresses?.[0]?.landmark || 'Near Metro Station'
  });

  const [isEditingAddress, setIsEditingAddress] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      toast('Your cart is empty. Please add items to checkout.');
      navigate('/menu');
    }
  }, [items, navigate]);

  // Voice controller remote actions
  useEffect(() => {
    const handleSelectPayment = (e) => {
      const method = e.detail;
      if (method === 'cod' || method === 'online') {
        setSelectedPayment(method);
      }
    };

    const handleRemotePlaceOrder = () => {
      handlePlaceOrder();
    };

    const handleRemoteCoupon = (e) => {
      const code = e.detail || 'FOODOVA50';
      setCouponInput(code);
      // Trigger coupon apply
      setTimeout(() => {
        handleApplyCoupon();
      }, 50);
    };

    window.addEventListener('foodova:select-payment', handleSelectPayment);
    window.addEventListener('foodova:place-order', handleRemotePlaceOrder);
    window.addEventListener('foodova:apply-coupon', handleRemoteCoupon);

    return () => {
      window.removeEventListener('foodova:select-payment', handleSelectPayment);
      window.removeEventListener('foodova:place-order', handleRemotePlaceOrder);
      window.removeEventListener('foodova:apply-coupon', handleRemoteCoupon);
    };
  });

  const handlePlaceOrder = async () => {
    if (!address.fullAddress.trim() || !address.city.trim() || !address.pincode.trim()) {
      toast.error('Please provide a complete delivery address.');
      setIsEditingAddress(true);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        items: items.map(it => ({
          product: it.productId || it.id,
          name: it.name,
          thumbnail: it.thumbnail,
          price: it.price,
          quantity: it.quantity,
          customizations: it.customizations || [],
          addOns: it.addOns || []
        })),
        address: {
          fullAddress: `${address.fullAddress}, ${address.landmark ? 'Landmark: ' + address.landmark + ', ' : ''}${address.city}, ${address.state} - ${address.pincode}`,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          landmark: address.landmark
        },
        paymentMethod: selectedPayment,
        deliveryInstructions,
        couponCode: appliedCoupon?.code
      };

      const res = await api.post('/orders', payload);

      if (res.data?.success && res.data.order) {
        toast.success('Order placed successfully! 🎉');
        await clearCart();
        navigate(`/order-success?orderId=${res.data.order.orderId}&id=${res.data.order._id}`);
      } else {
        throw new Error(res.data?.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Order creation failed:', err);
      toast.error(err.response?.data?.message || 'Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl text-dark-900 tracking-tight">
          Checkout
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Review your order details and confirm delivery address.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Delivery Address & Payment */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Delivery Address Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-dark-900 text-base">
                  Delivery Address
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                className="text-xs font-bold text-brand-600 hover:text-brand-700"
              >
                {isEditingAddress ? 'Done Editing' : 'Change Address'}
              </button>
            </div>

            {isEditingAddress ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address.fullAddress}
                    onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })}
                    placeholder="House / Flat No., Apartment, Street"
                    className="input text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={address.landmark}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                      placeholder="e.g. Near Metro"
                      className="input text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="input text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">State</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="input text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Pincode</label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="input text-xs"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-4 bg-cream-50/70 rounded-2xl border border-gray-100">
                <Home className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-dark-900">{address.label}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">Standard</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {address.fullAddress}, {address.landmark ? `(Near ${address.landmark}), ` : ''}
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>
              </div>
            )}

            {/* Delivery Instructions */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="e.g. Leave with security / Ring bell twice / Call upon arrival"
                className="input text-xs"
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-card">
            <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 mb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-dark-900 text-base">
                Payment Option
              </h3>
            </div>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedPayment === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-brand-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-dark-900">{method.name}</h4>
                        <p className="text-[11px] text-gray-500">{method.description}</p>
                      </div>
                    </div>

                    <div className="text-gray-400">
                      {method.id === 'cod' && <Banknote className="w-5 h-5 text-emerald-600" />}
                      {method.id === 'online' && <CreditCard className="w-5 h-5 text-blue-600" />}
                      {method.id === 'wallet' && <Wallet className="w-5 h-5 text-purple-600" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-2 text-[11px] text-gray-500 bg-gray-50 p-3 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All payment methods are secured with 256-bit encryption.</span>
            </div>
          </div>

        </div>

        {/* Right Summary Sidebar */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-card space-y-5 sticky top-24">
          <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-display font-bold text-dark-900 text-base">
              Order Summary
            </h3>
            <span className="text-xs text-gray-500">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Items Preview */}
          <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-gray-100 text-dark-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {item.quantity}x
                  </span>
                  <span className="font-semibold text-dark-900 truncate">{item.name}</span>
                </div>
                <span className="font-bold text-dark-900 shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-dark-900">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST & Restaurant Tax (5%)</span>
              <span className="font-semibold text-dark-900">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Delivery Charges</span>
              <span className="font-semibold text-dark-900">
                {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatPrice(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-base font-black text-dark-900 font-display">
              <span>Grand Total</span>
              <span className="text-lg text-brand-600">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="button"
            disabled={loading}
            onClick={handlePlaceOrder}
            className="w-full py-4 px-6 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 text-white font-black text-sm shadow-brand hover:shadow-brand-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Confirming Order...</span>
              </div>
            ) : (
              <>
                <span>Place Order • {formatPrice(total)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-gray-400 text-center">
            By placing an order, you agree to FOODOVA's Terms and Conditions.
          </p>

        </div>

      </div>

    </div>
  );
};

export default CheckoutPage;
