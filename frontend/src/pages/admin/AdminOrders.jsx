import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, CheckCircle, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { formatPrice, formatDate } from '../../utils/helpers';
import { ORDER_STATUSES } from '../../utils/constants';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/admin/orders', { params });
      if (res.data?.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.data?.success) {
        toast.success(`Order #${orderId} marked as ${newStatus}`);
        setOrders(prev => prev.map(o => (o.orderId === orderId || o._id === orderId) ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const statusOptions = [
    'confirmed',
    'preparing',
    'cooking',
    'out_for_delivery',
    'delivered',
    'cancelled'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/admin" className="text-xs font-bold text-gray-400 hover:text-purple-600 flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="font-display font-black text-3xl text-dark-900 tracking-tight">
            Order Fulfillment Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input text-xs max-w-[180px]"
          >
            <option value="">All Statuses</option>
            {statusOptions.map(st => (
              <option key={st} value={st}>{ORDER_STATUSES[st]?.label || st}</option>
            ))}
          </select>

          <button
            onClick={fetchOrders}
            className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-purple-600 shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-card">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Address</th>
                  <th className="pb-3">Dishes</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Current Status</th>
                  <th className="pb-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 font-mono font-bold text-dark-900">#{ord.orderId}</td>
                    <td className="py-3 font-semibold text-dark-800">
                      <div>{ord.userName || 'Customer'}</div>
                      <div className="text-[11px] text-gray-400 font-normal">{ord.userPhone || ord.userEmail}</div>
                    </td>
                    <td className="py-3 text-gray-600 max-w-[180px] truncate" title={ord.address?.fullAddress}>
                      {ord.address?.fullAddress || 'On file'}
                    </td>
                    <td className="py-3 text-gray-600">
                      {ord.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="py-3 font-black text-brand-600">{formatPrice(ord.total)}</td>
                    <td className="py-3">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full text-white ${ORDER_STATUSES[ord.status]?.color || 'bg-gray-500'}`}>
                        {ORDER_STATUSES[ord.status]?.label || ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.orderId || ord._id, e.target.value)}
                        className="px-2 py-1 rounded-lg border border-gray-200 text-xs font-bold text-dark-800 focus:outline-none focus:border-purple-500"
                      >
                        {statusOptions.map(st => (
                          <option key={st} value={st}>{ORDER_STATUSES[st]?.label || st}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
