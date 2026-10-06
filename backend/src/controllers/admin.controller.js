const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const logger = require('../utils/logger');

// GET /api/admin/orders
const getAdminOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const query = status ? { status } : {};
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();
    res.status(200).json({ success: true, total, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
};

// PUT /api/admin/orders/:orderId/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['confirmed', 'preparing', 'cooking', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }
    const order = await Order.findOneAndUpdate(
      { $or: [{ orderId: req.params.orderId }, { _id: req.params.orderId }] },
      {
        status,
        $push: { statusHistory: { status, timestamp: new Date(), note: note || '' } }
      },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.status(200).json({ success: true, message: 'Order status updated.', order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
};

// GET /api/admin/users
const getAdminUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await User.countDocuments({ role: 'user' });
    const users = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();
    res.status(200).json({ success: true, total, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
};

// GET /api/admin/products
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
};

// GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalProducts, revenueResult] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isAvailable: true }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
      ])
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    res.status(200).json({
      success: true,
      stats: { totalOrders, totalUsers, totalProducts, totalRevenue },
      recentOrders
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
  }
};

module.exports = { getAdminOrders, updateOrderStatus, getAdminUsers, getAdminProducts, getAdminStats };
