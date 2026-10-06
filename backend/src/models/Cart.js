const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  price: { type: Number, required: true },
  customizations: [{ name: String, value: String, price: { type: Number, default: 0 } }],
  addOns: [{ name: String, price: Number }],
  specialInstructions: String
}, { timestamps: true });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  couponCode: String,
  discount: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual: subtotal
cartSchema.virtual('subtotal').get(function() {
  return this.items.reduce((sum, item) => {
    const addOnTotal = item.addOns ? item.addOns.reduce((a, b) => a + b.price, 0) : 0;
    return sum + (item.price + addOnTotal) * item.quantity;
  }, 0);
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
