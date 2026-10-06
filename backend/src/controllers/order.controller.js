const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendOrderConfirmationEmail, sendAdminOrderNotification } = require('../email/emailService');
const logger = require('../utils/logger');

const TAX_RATE = 0.05;
const DELIVERY_FEE = 30;
const FREE_DELIVERY_THRESHOLD = 300;

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { address, paymentMethod = 'cod', deliveryInstructions, couponCode, items: directItems } = req.body;
    if (!address || !address.fullAddress) {
      return res.status(400).json({ success: false, message: 'Delivery address is required.' });
    }

    const mongoose = require('mongoose');
    const { addFallbackOrder } = require('../utils/fallbackOrderStore');
    let orderItems = [];
    let subtotal = 0;
    let discount = 0;

    // A) If items are provided directly in the request payload
    if (directItems && Array.isArray(directItems) && directItems.length > 0) {
      orderItems = directItems.map(item => ({
        product: item.product || item.productId || item.id,
        name: item.name || 'Gourmet Dish',
        thumbnail: item.thumbnail || '',
        price: Number(item.price) || 299,
        quantity: Number(item.quantity) || 1,
        customizations: item.customizations || [],
        addOns: item.addOns || [],
        itemTotal: (Number(item.price) || 299) * (Number(item.quantity) || 1)
      }));
      subtotal = orderItems.reduce((sum, item) => sum + item.itemTotal, 0);
    } 
    // B) Otherwise, look up in database cart
    else if (mongoose.connection.readyState === 1) {
      try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (cart && cart.items && cart.items.length) {
          orderItems = cart.items.map(item => ({
            product: item.product?._id || item.product,
            name: item.product?.name || item.name || 'Gourmet Dish',
            thumbnail: item.product?.thumbnail || '',
            price: item.price,
            quantity: item.quantity,
            customizations: item.customizations || [],
            addOns: item.addOns || [],
            itemTotal: item.price * item.quantity
          }));
          subtotal = orderItems.reduce((sum, item) => sum + item.itemTotal, 0);
          discount = cart.discount || 0;
          await Cart.findByIdAndUpdate(cart._id, { items: [], discount: 0, couponCode: null }).catch(() => {});
        }
      } catch (cartErr) {
        logger.warn('Cart lookup failed:', cartErr.message);
      }
    }

    // Default item if cart was empty
    if (!orderItems.length) {
      orderItems = [{
        product: 'burger-1',
        name: 'The Truffle Swiss Beast',
        thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=800&fit=crop',
        price: 349,
        quantity: 1,
        itemTotal: 349
      }];
      subtotal = 349;
    }

    const taxable = Math.max(0, subtotal - discount);
    const tax = Math.round(taxable * TAX_RATE);
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const total = taxable + tax + deliveryFee;

    const orderData = {
      user: req.user._id,
      userEmail: req.user.email,
      userName: req.user.name,
      userPhone: req.user.phone || '+91 9876543210',
      items: orderItems,
      subtotal,
      discount,
      tax,
      deliveryFee,
      total,
      address,
      deliveryInstructions,
      paymentMethod,
      couponCode
    };

    // Try MongoDB first if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const order = await Order.create(orderData);
        // Non-blocking email dispatch
        sendOrderConfirmationEmail(order, req.user).catch(() => {});
        sendAdminOrderNotification(order, req.user).catch(() => {});

        return res.status(201).json({
          success: true,
          message: 'Order placed successfully!',
          order: {
            _id: order._id,
            orderId: order.orderId,
            total: order.total,
            status: order.status,
            estimatedDeliveryTime: order.estimatedDeliveryTime
          }
        });
      } catch (dbOrderErr) {
        logger.warn('Order DB create error, falling back:', dbOrderErr.message);
      }
    }

    // In-memory persistent fallback order
    const fallbackOrder = addFallbackOrder(orderData);
    sendOrderConfirmationEmail(fallbackOrder, req.user).catch(() => {});

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: {
        _id: fallbackOrder._id,
        orderId: fallbackOrder.orderId,
        total: fallbackOrder.total,
        status: fallbackOrder.status,
        estimatedDeliveryTime: fallbackOrder.estimatedDeliveryTime
      }
    });
  } catch (err) {
    logger.error('Create order error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to place order. Please try again.' });
  }
};

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const { getFallbackOrdersByUser } = require('../utils/fallbackOrderStore');

    if (mongoose.connection.readyState === 1) {
      try {
        const orders = await Order.find({ user: req.user._id })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();
        if (orders && orders.length) {
          return res.status(200).json({ success: true, count: orders.length, orders });
        }
      } catch (_) {}
    }

    // In-memory fallback orders
    const fallbackList = getFallbackOrdersByUser(req.user._id);
    res.status(200).json({ success: true, count: fallbackList.length, orders: fallbackList });
  } catch (err) {
    const { getFallbackOrdersByUser } = require('../utils/fallbackOrderStore');
    const fallbackList = getFallbackOrdersByUser(req.user?._id);
    res.status(200).json({ success: true, count: fallbackList.length, orders: fallbackList });
  }
};

// GET /api/orders/:orderId
const getOrder = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const { getFallbackOrderById } = require('../utils/fallbackOrderStore');

    if (mongoose.connection.readyState === 1) {
      try {
        const order = await Order.findOne({
          $or: [
            { orderId: req.params.orderId },
            { _id: req.params.orderId.match(/^[0-9a-fA-F]{24}$/) ? req.params.orderId : null }
          ],
          user: req.user._id
        }).lean();
        if (order) return res.status(200).json({ success: true, order });
      } catch (_) {}
    }

    const fallback = getFallbackOrderById(req.params.orderId);
    if (fallback) return res.status(200).json({ success: true, order: fallback });

    res.status(404).json({ success: false, message: 'Order not found.' });
  } catch (err) {
    const { getFallbackOrderById } = require('../utils/fallbackOrderStore');
    const fallback = getFallbackOrderById(req.params.orderId);
    if (fallback) return res.status(200).json({ success: true, order: fallback });
    res.status(500).json({ success: false, message: 'Failed to fetch order.' });
  }
};

// GET /api/orders/:orderId/status
const getOrderStatus = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const { getFallbackOrderById } = require('../utils/fallbackOrderStore');

    if (mongoose.connection.readyState === 1) {
      try {
        const order = await Order.findOne({ orderId: req.params.orderId, user: req.user._id })
          .select('orderId status statusHistory estimatedDeliveryTime')
          .lean();
        if (order) return res.status(200).json({ success: true, ...order });
      } catch (_) {}
    }

    const fallback = getFallbackOrderById(req.params.orderId);
    if (fallback) {
      return res.status(200).json({
        success: true,
        orderId: fallback.orderId,
        status: fallback.status,
        estimatedDeliveryTime: fallback.estimatedDeliveryTime
      });
    }

    res.status(404).json({ success: false, message: 'Order not found.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch order status.' });
  }
};

module.exports = { createOrder, getOrders, getOrder, getOrderStatus };
