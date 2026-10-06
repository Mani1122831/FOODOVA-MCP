const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  thumbnail: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  customizations: [{ name: String, value: String, price: { type: Number, default: 0 } }],
  addOns: [{ name: String, price: Number }],
  itemTotal: { type: Number, required: true }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  fullAddress: String,
  city: String,
  state: String,
  pincode: String,
  landmark: String
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
  status: String,
  timestamp: { type: Date, default: Date.now },
  note: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: () => 'FOO-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase()
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: String,
  userName: String,
  userPhone: String,
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 30 },
  total: { type: Number, required: true },
  couponCode: String,
  address: addressSchema,
  deliveryInstructions: String,
  paymentMethod: {
    type: String,
    enum: ['cod', 'online', 'wallet'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['confirmed', 'preparing', 'cooking', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'confirmed'
  },
  statusHistory: [statusHistorySchema],
  estimatedDeliveryTime: { type: Date },
  actualDeliveryTime: Date,
  emailSentToUser: { type: Boolean, default: false },
  emailSentToAdmin: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

// Pre-save: set estimated delivery time
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.estimatedDeliveryTime = new Date(Date.now() + 45 * 60 * 1000); // 45 min
    this.statusHistory = [{ status: 'confirmed', timestamp: new Date(), note: 'Order placed successfully' }];
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
