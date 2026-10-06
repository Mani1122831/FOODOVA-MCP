const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: String,
  image: String,
  icon: String,
  color: { type: String, default: '#FF6B35' },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isVegOnly: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

categorySchema.index({ sortOrder: 1 });

categorySchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
