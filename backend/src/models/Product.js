const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  fiber: Number,
  sodium: Number
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  longDescription: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative']
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  thumbnail: String,
  image: String,
  aiGenerated: {
    type: Boolean,
    default: false
  },
  isVeg: {
    type: Boolean,
    required: true,
    default: true
  },
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'spicy', 'extra_spicy', 'extra-spicy', 'none'],
    default: 'none'
  },
  ingredients: [String],
  allergens: [String],
  nutrition: nutritionSchema,
  addOns: [{
    name: String,
    price: Number,
    available: { type: Boolean, default: true }
  }],
  customizations: [{
    name: String,
    options: [{
      label: String,
      price: { type: Number, default: 0 }
    }]
  }],
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isNewLaunch: { type: Boolean, default: false },
  tags: [String],
  preparationTime: { type: Number, default: 15 }, // minutes
  serves: { type: Number, default: 1 },
  sortOrder: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtuals
productSchema.virtual('effectivePrice').get(function() {
  return this.discountPrice || this.price;
});

productSchema.virtual('savingsAmount').get(function() {
  return this.discountPrice ? (this.price - this.discountPrice) : 0;
});

// Indexes
productSchema.index({ category: 1, isAvailable: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ isFeatured: 1, isAvailable: 1 });
productSchema.index({ isNewLaunch: 1, isAvailable: 1 });
productSchema.index({ 'rating.average': -1 });

// Pre-save middleware for slug
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') + '-' + Date.now();
  }
  // Auto-calculate discount percentage
  if (this.discountPrice && this.price) {
    this.discountPercentage = Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
