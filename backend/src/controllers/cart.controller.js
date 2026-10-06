const Cart = require('../models/Cart');
const Product = require('../models/Product');
const logger = require('../utils/logger');

// In-memory fallback carts by user ID
const inMemoryCarts = new Map();

// GET /api/cart
const getCart = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      try {
        const cart = await Cart.findOne({ user: req.user._id }).populate({
          path: 'items.product',
          select: 'name thumbnail price discountPrice isAvailable'
        });
        if (cart) return res.status(200).json({ success: true, cart });
      } catch (_) {}
    }
    
    // In-memory cart
    const userId = req.user?._id?.toString() || 'guest';
    const userCart = inMemoryCarts.get(userId) || { items: [], subtotal: 0, discount: 0 };
    res.status(200).json({ success: true, cart: userCart });
  } catch (err) {
    res.status(200).json({ success: true, cart: { items: [], subtotal: 0, discount: 0 } });
  }
};

// POST /api/cart - Add item
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, customizations = [], addOns = [], specialInstructions } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'Product ID is required.' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    if (!product.isAvailable) return res.status(400).json({ success: false, message: 'Product is currently unavailable.' });

    const price = product.discountPrice || product.price;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity, price, customizations, addOns, specialInstructions }]
      });
    } else {
      const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price, customizations, addOns, specialInstructions });
      }
      await cart.save();
    }

    await cart.populate({ path: 'items.product', select: 'name thumbnail price discountPrice isAvailable' });
    res.status(200).json({ success: true, message: 'Item added to cart.', cart });
  } catch (err) {
    logger.error('Add to cart error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to add item to cart.' });
  }
};

// PUT /api/cart/:itemId - Update quantity
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 0) return res.status(400).json({ success: false, message: 'Invalid quantity.' });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    if (quantity === 0) {
      cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    } else {
      const item = cart.items.find(item => item._id.toString() === req.params.itemId);
      if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart.' });
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate({ path: 'items.product', select: 'name thumbnail price discountPrice isAvailable' });
    res.status(200).json({ success: true, message: 'Cart updated.', cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update cart.' });
  }
};

// DELETE /api/cart/:itemId
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();
    await cart.populate({ path: 'items.product', select: 'name thumbnail price discountPrice isAvailable' });
    res.status(200).json({ success: true, message: 'Item removed from cart.', cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to remove item.' });
  }
};

// DELETE /api/cart - Clear cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], discount: 0, couponCode: null });
    res.status(200).json({ success: true, message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to clear cart.' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
