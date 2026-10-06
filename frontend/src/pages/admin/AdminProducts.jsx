import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit3, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { formatPrice } from '../../utils/helpers';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/products');
      if (res.data?.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleAvailability = async (product) => {
    try {
      const res = await api.put(`/products/${product._id}`, {
        isAvailable: !product.isAvailable
      });
      if (res.data?.success) {
        toast.success(`${product.name} is now ${!product.isAvailable ? 'Available' : 'Sold Out'}`);
        setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isAvailable: !product.isAvailable } : p));
      }
    } catch (err) {
      toast.error('Failed to toggle availability');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this dish?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Dish deleted from catalog');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      toast.error('Failed to delete dish');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/admin" className="text-xs font-bold text-gray-400 hover:text-purple-600 flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="font-display font-black text-3xl text-dark-900 tracking-tight">
            Menu Catalog Management
          </h1>
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
                  <th className="pb-3">Dish</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Stock Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 flex items-center gap-3">
                      <img
                        src={p.thumbnail || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=60&h=60&fit=crop'}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <div className="font-bold text-dark-900">{p.name}</div>
                        <div className="text-[11px] text-gray-400">{p.rating?.average || 4.5} ★</div>
                      </div>
                    </td>
                    <td className="py-3 font-semibold text-gray-600">{p.category?.name || 'Burgers'}</td>
                    <td className="py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.isVeg ? 'VEG' : 'NON-VEG'}
                      </span>
                    </td>
                    <td className="py-3 font-black text-brand-600">
                      {formatPrice(p.discountPrice || p.price)}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleToggleAvailability(p)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
                          p.isAvailable
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        }`}
                      >
                        {p.isAvailable ? 'In Stock (Click to Disable)' : 'Sold Out (Click to Enable)'}
                      </button>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

export default AdminProducts;
