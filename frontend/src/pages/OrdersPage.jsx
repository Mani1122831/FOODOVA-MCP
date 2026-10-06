import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ShoppingBag, ArrowRight, ChevronRight, Package, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { formatPrice, formatDate } from '../utils/helpers';
import { ORDER_STATUSES } from '../utils/constants';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        if (res.data?.success) {
          setOrders(res.data.orders || []);
        }
      } catch (err) {
        console.warn('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-6">
        <h1 className="font-display font-black text-3xl text-dark-900 tracking-tight">
          My Orders
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Track active deliveries and review your culinary history.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-card space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto text-3xl">
            🍔
          </div>
          <h3 className="font-display font-black text-dark-900 text-lg">No orders placed yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You haven't ordered any meals yet. Explore our delicious menu to place your first order!
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-brand transition-all hover:scale-105"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = ORDER_STATUSES[order.status] || { label: order.status, color: 'bg-gray-500' };
            return (
              <motion.div
                key={order._id}
                whileHover={{ y: -2 }}
                onClick={() => navigate(`/orders/${order._id}`)}
                className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-card hover:shadow-card-hover cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs bg-gray-100 text-dark-800 px-2.5 py-1 rounded-lg">
                      #{order.orderId}
                    </span>
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full text-white ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    Placed on {formatDate(order.createdAt)}
                  </p>

                  <div className="text-xs font-semibold text-dark-800">
                    {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <span className="font-display font-black text-lg text-dark-900">
                    {formatPrice(order.total)}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700">
                    <span>Track Order</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default OrdersPage;
