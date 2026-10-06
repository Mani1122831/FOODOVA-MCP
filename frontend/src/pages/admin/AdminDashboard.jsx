import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Users, 
  UtensilsCrossed, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { formatPrice, formatDate } from '../../utils/helpers';
import { ORDER_STATUSES } from '../../utils/constants';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data?.success) {
          setStats(res.data.stats);
          setRecentOrders(res.data.recentOrders || []);
        }
      } catch (err) {
        console.warn('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Staff Access
            </span>
          </div>
          <h1 className="font-display font-black text-3xl text-dark-900 tracking-tight">
            Kitchen & Order Command Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Live operations, store revenue analytics, and fulfillment controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/ai-studio"
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>AI Food Studio</span>
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
          >
            Manage All Orders
          </Link>
          <Link
            to="/admin/products"
            className="px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-dark-800 hover:border-purple-300 font-bold text-xs shadow-xs transition-all"
          >
            Manage Menu Items
          </Link>
        </div>
      </div>

      {/* AI Food Studio Featured Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-dark-900 to-dark-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-purple-800/40">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 px-3 py-1 rounded-full text-xs font-bold text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>AI Studio • Powered by Gemini & Canva</span>
          </div>
          <h2 className="font-display font-black text-2xl tracking-tight">
            AI Food Image & Marketing Studio
          </h2>
          <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
            Generate mouth-watering food photography with Gemini, generate instant culinary descriptions, assign images directly to live dishes in MongoDB, and launch Canva workflows for social posts, posters, and offer banners.
          </p>
        </div>
        <Link
          to="/admin/ai-studio"
          className="px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-brand transition-all flex items-center gap-2 shrink-0 hover:scale-105"
        >
          <span>Open Food Studio</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Sales</span>
            <span className="font-display font-black text-2xl text-dark-900">
              {formatPrice(stats?.totalRevenue || 0)}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">+18% this week</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Orders</span>
            <span className="font-display font-black text-2xl text-dark-900">
              {stats?.totalOrders || 0}
            </span>
            <span className="text-[11px] text-purple-600 font-semibold block mt-1">Real-time orders</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Active Menu Dishes</span>
            <span className="font-display font-black text-2xl text-dark-900">
              {stats?.totalProducts || 0}
            </span>
            <span className="text-[11px] text-brand-600 font-semibold block mt-1">In kitchen stock</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Registered Foodies</span>
            <span className="font-display font-black text-2xl text-dark-900">
              {stats?.totalUsers || 0}
            </span>
            <span className="text-[11px] text-blue-600 font-semibold block mt-1">Active customers</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="font-display font-bold text-dark-900 text-lg">
            Recent Incoming Orders
          </h3>
          <Link to="/admin/orders" className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Dishes</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Time</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((ord) => (
                <tr key={ord._id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 font-mono font-bold text-dark-900">#{ord.orderId}</td>
                  <td className="py-3 font-semibold text-dark-800">{ord.userName || ord.userEmail}</td>
                  <td className="py-3 text-gray-600">{ord.items?.length || 1} items</td>
                  <td className="py-3 font-black text-brand-600">{formatPrice(ord.total)}</td>
                  <td className="py-3">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full text-white ${ORDER_STATUSES[ord.status]?.color || 'bg-gray-500'}`}>
                      {ORDER_STATUSES[ord.status]?.label || ord.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">{formatDate(ord.createdAt)}</td>
                  <td className="py-3 text-right">
                    <Link
                      to={`/orders/${ord._id}`}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-purple-100 text-dark-800 hover:text-purple-700 font-bold text-[11px] transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
