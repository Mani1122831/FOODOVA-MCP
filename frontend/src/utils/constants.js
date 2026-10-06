export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ORDER_STATUSES = {
  confirmed: { label: 'Order Confirmed', color: 'bg-emerald-500', step: 1 },
  preparing: { label: 'Preparing', color: 'bg-amber-500', step: 2 },
  cooking: { label: 'Cooking', color: 'bg-orange-500', step: 3 },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-blue-500', step: 4 },
  delivered: { label: 'Delivered', color: 'bg-green-600', step: 5 },
  cancelled: { label: 'Cancelled', color: 'bg-rose-500', step: 0 }
};

export const PAYMENT_METHODS = [
  { id: 'cod', name: 'Cash on Delivery', description: 'Pay cash or UPI at delivery' },
  { id: 'online', name: 'Instant Online Pay', description: 'UPI, Credit / Debit Card, NetBanking' },
  { id: 'wallet', name: 'Foodova Wallet', description: 'Fast 1-click checkout from balance' }
];

export const SPICE_LEVELS = [
  { id: 'none', label: 'Not Spicy', icon: '🌱' },
  { id: 'mild', label: 'Mild', icon: '🌶️' },
  { id: 'medium', label: 'Medium', icon: '🌶️🌶️' },
  { id: 'spicy', label: 'Spicy', icon: '🌶️🌶️🌶️' },
  { id: 'extra_spicy', label: 'Extra Spicy', icon: '🔥' }
];
