import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  CheckCircle, 
  ChefHat, 
  Flame, 
  Truck, 
  CheckCheck, 
  ShoppingBag,
  Phone,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';
import { formatPrice, formatDate } from '../utils/helpers';
import { ORDER_STATUSES } from '../utils/constants';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      if (res.data?.success && res.data.order) {
        setOrder(res.data.order);
      } else {
        throw new Error('Order not found');
      }
    } catch (err) {
      setError('Could not retrieve order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll status updates every 15 seconds
    const interval = setInterval(fetchOrder, 15000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading && !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500 mt-4">Loading live tracking details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-sm text-rose-500 font-bold">{error || 'Order not found'}</p>
        <Link to="/orders" className="btn-secondary text-xs">Back to Orders</Link>
      </div>
    );
  }

  // Tracking steps configuration
  const steps = [
    { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle, desc: 'Received & Verified' },
    { key: 'preparing', label: 'Preparing', icon: ChefHat, desc: 'Ingredients assembled' },
    { key: 'cooking', label: 'Cooking', icon: Flame, desc: 'Fresh on grill' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, desc: 'Valet on the way' },
    { key: 'delivered', label: 'Delivered', icon: CheckCheck, desc: 'Enjoy your meal!' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-xs font-bold text-dark-700 hover:text-brand-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </button>

        <button
          onClick={fetchOrder}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-600 hover:text-brand-500 hover:border-brand-300 shadow-xs transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Main Order Status Tracker Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-card space-y-8">
        
        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-black text-sm bg-brand-50 text-brand-600 px-3 py-1 rounded-xl">
                #{order.orderId}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Placed on {formatDate(order.createdAt)}
              </span>
            </div>
            <h2 className="font-display font-black text-2xl text-dark-900">
              Estimated Delivery: ~35-45 mins
            </h2>
          </div>

          <div className="bg-cream-50 px-4 py-2.5 rounded-2xl border border-gray-100 text-right">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">TOTAL AMOUNT</span>
            <span className="font-display font-black text-xl text-brand-600">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* ========================================================
            Requirement 15: Animated Progress Tracker
            ✓ Confirmed -> ✓ Preparing -> ● Cooking -> ○ Out for Delivery -> ○ Delivered
            ======================================================== */}
        <div className="py-4">
          <div className="relative">
            
            {/* Connecting progress bar line */}
            <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 -z-0">
              <div 
                className="h-full bg-gradient-to-r from-brand-500 to-amber-400 transition-all duration-700"
                style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Stepper Dots & Icons */}
            <div className="flex items-center justify-between relative z-10">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < activeIndex;
                const isCurrent = idx === activeIndex;
                const isPending = idx > activeIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center max-w-[90px]">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isCurrent ? 1.15 : 1
                      }}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-brand-500 text-white ring-4 ring-brand-100 animate-pulse'
                          : 'bg-white text-gray-400 border border-gray-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>

                    <span className={`text-xs font-bold mt-2 leading-tight ${
                      isCurrent ? 'text-brand-600 font-black' : isCompleted ? 'text-dark-900' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                    <span className="text-[10px] text-gray-400 hidden sm:block mt-0.5">
                      {step.desc}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Live Delivery Note Banner */}
        <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">🛵</span>
            <div>
              <h4 className="font-bold text-dark-900">Foodova Express Fleet Active</h4>
              <p className="text-gray-600">Your food is kept insulated in temperature-controlled bags.</p>
            </div>
          </div>
          <div className="hidden sm:block font-bold text-amber-700">
            Contactless Delivery
          </div>
        </div>

      </div>

      {/* Order Items & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Items list */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-card space-y-4">
          <h3 className="font-display font-bold text-dark-900 text-base">
            Ordered Items ({order.items?.length})
          </h3>
          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 text-xs pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-brand-50 text-brand-700 font-bold flex items-center justify-center shrink-0">
                    {item.quantity}x
                  </span>
                  <div>
                    <h5 className="font-bold text-dark-900 truncate">{item.name}</h5>
                    <p className="text-[11px] text-gray-500">{formatPrice(item.price)} each</p>
                  </div>
                </div>
                <span className="font-bold text-dark-900 shrink-0">
                  {formatPrice(item.itemTotal || item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Address and Bill Summary */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-card space-y-4">
          <div>
            <h3 className="font-display font-bold text-dark-900 text-base mb-2">
              Delivery Location
            </h3>
            <div className="flex items-start gap-2.5 text-xs text-gray-600 bg-cream-50 p-3.5 rounded-2xl border border-gray-100">
              <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{order.address?.fullAddress || 'Address on file'}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-dark-800">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span className="font-semibold text-dark-800">{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="font-semibold text-dark-800">
                {order.deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatPrice(order.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-black text-dark-900 font-display">
              <span>Total Paid ({order.paymentMethod?.toUpperCase()})</span>
              <span className="text-brand-600">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default OrderDetailPage;
