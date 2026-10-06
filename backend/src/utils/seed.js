require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (_) {}
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');

const categories = [
  { name: 'Recommended', slug: 'recommended', icon: '⭐', color: '#FF6B35', sortOrder: 1, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop' },
  { name: 'Combos', slug: 'combos', icon: '🍔', color: '#F7C59F', sortOrder: 2, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=80&h=80&fit=crop' },
  { name: 'Burgers', slug: 'burgers', icon: '🍔', color: '#FF9A5C', sortOrder: 3, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=80&h=80&fit=crop' },
  { name: 'Pizza', slug: 'pizza', icon: '🍕', color: '#FF6B6B', sortOrder: 4, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop' },
  { name: 'Fried Chicken', slug: 'fried-chicken', icon: '🍗', color: '#FFA07A', sortOrder: 5, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=80&h=80&fit=crop' },
  { name: 'Wraps', slug: 'wraps', icon: '🌯', color: '#98D8C8', sortOrder: 6, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=80&h=80&fit=crop' },
  { name: 'Snacks', slug: 'snacks', icon: '🍟', color: '#FFD93D', sortOrder: 7, image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=80&h=80&fit=crop' },
  { name: 'Fries & Sides', slug: 'fries-sides', icon: '🍟', color: '#FFC300', sortOrder: 8, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=80&h=80&fit=crop' },
  { name: 'Desserts', slug: 'desserts', icon: '🍦', color: '#FFB3DE', sortOrder: 9, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=80&h=80&fit=crop' },
  { name: 'Coffee', slug: 'coffee', icon: '☕', color: '#C4A882', sortOrder: 10, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop' },
  { name: 'Beverages', slug: 'beverages', icon: '🥤', color: '#87CEEB', sortOrder: 11, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=80&h=80&fit=crop' },
  { name: 'Healthy', slug: 'healthy', icon: '🥗', color: '#90EE90', sortOrder: 12, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&h=80&fit=crop' },
  { name: 'New Launch', slug: 'new-launch', icon: '🆕', color: '#DDA0DD', sortOrder: 13, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=80&h=80&fit=crop' }
];

const generateProducts = (categoryMap) => [
  // RECOMMENDED
  {
    name: 'Premium Veg Royale Burger',
    slug: 'premium-veg-royale-burger',
    description: 'A towering stack of fresh crispy vegetables, premium cheese, and signature sauce on a toasted brioche bun.',
    category: categoryMap['Recommended'],
    price: 329, discountPrice: 249, discountPercentage: 24,
    isVeg: true, spiceLevel: 'mild',
    thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Brioche Bun', 'Lettuce', 'Tomato', 'Cheese', 'Crispy Onions', 'Special Sauce'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    nutrition: { calories: 480, protein: 14, carbs: 52, fat: 22, fiber: 4 },
    rating: { average: 4.5, count: 342 },
    isFeatured: true, tags: ['popular', 'bestseller', 'veg'],
    preparationTime: 12, serves: 1
  },
  {
    name: 'Spicy Fiesta Chicken Burger',
    slug: 'spicy-fiesta-chicken-burger',
    description: 'Crispy fried chicken fillet with jalapeños, spicy mayo, and crunchy slaw on a sesame seed bun.',
    category: categoryMap['Recommended'],
    price: 359, discountPrice: 279,
    isVeg: false, spiceLevel: 'spicy',
    thumbnail: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Chicken Fillet', 'Jalapeños', 'Spicy Mayo', 'Coleslaw', 'Sesame Bun'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    nutrition: { calories: 560, protein: 28, carbs: 48, fat: 28, fiber: 2 },
    rating: { average: 4.7, count: 521 },
    isFeatured: true, tags: ['spicy', 'popular', 'non-veg'],
    preparationTime: 15, serves: 1
  },

  // COMBOS
  {
    name: 'Veg Duo Feast Combo',
    slug: 'veg-duo-feast-combo',
    description: 'Two Premium Veg Burgers + 2 Medium Fries + 2 Soft Drinks. Perfect for sharing!',
    category: categoryMap['Combos'],
    price: 649, discountPrice: 479, discountPercentage: 26,
    isVeg: true, spiceLevel: 'mild',
    thumbnail: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['2x Veg Burger', '2x Medium Fries', '2x Soft Drink'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 1200, protein: 32, carbs: 140, fat: 52, fiber: 8 },
    rating: { average: 4.6, count: 289 },
    isFeatured: true, tags: ['combo', 'sharing', 'value'],
    preparationTime: 18, serves: 2
  },
  {
    name: 'Chicken Feast Box',
    slug: 'chicken-feast-box',
    description: 'Crispy Chicken Burger + 4 Pc Chicken Strips + Large Fries + Drink. A feast in a box!',
    category: categoryMap['Combos'],
    price: 699, discountPrice: 549,
    isVeg: false, spiceLevel: 'medium',
    thumbnail: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Chicken Burger', '4pc Chicken Strips', 'Large Fries', 'Soft Drink'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    nutrition: { calories: 1450, protein: 64, carbs: 120, fat: 68, fiber: 4 },
    rating: { average: 4.8, count: 432 },
    isFeatured: true, tags: ['combo', 'chicken', 'value', 'non-veg'],
    preparationTime: 20, serves: 2
  },
  {
    name: 'Solo Veg Saver',
    slug: 'solo-veg-saver',
    description: 'Veg Burger + Medium Fries + Soft Drink. Perfect solo meal at a great price.',
    category: categoryMap['Combos'],
    price: 349, discountPrice: 269,
    isVeg: true, spiceLevel: 'mild',
    thumbnail: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Veg Burger', 'Medium Fries', 'Soft Drink'],
    nutrition: { calories: 780, protein: 20, carbs: 96, fat: 32, fiber: 5 },
    rating: { average: 4.4, count: 198 },
    isFeatured: false, tags: ['combo', 'solo', 'veg', 'saver'],
    preparationTime: 12, serves: 1
  },

  // BURGERS (24 Gourmet Varieties)
  {
    name: 'Premium Veg Royale Burger',
    slug: 'premium-veg-royale-burger-menu',
    description: 'A towering stack of fresh crispy vegetables, premium melted cheddar cheese, and signature secret sauce on a toasted artisan brioche bun.',
    category: categoryMap['Burgers'],
    price: 329, discountPrice: 249, discountPercentage: 24,
    isVeg: true, spiceLevel: 'mild',
    thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Toasted Brioche Bun', 'Crispy Veggie Patty', 'Aged Cheddar', 'Romaine Lettuce', 'Heirloom Tomato', 'Signature Royale Sauce'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 480, protein: 14, carbs: 52, fat: 22 },
    rating: { average: 4.8, count: 542 },
    isFeatured: true, tags: ['popular', 'bestseller', 'veg'],
    preparationTime: 12, serves: 1
  },
  {
    name: 'Classic American Cheeseburger',
    slug: 'classic-american-cheeseburger',
    description: 'Tender juicy grilled patty, double melted American cheddar, crispy iceberg lettuce, sliced tomatoes, dill pickles, and house burger sauce.',
    category: categoryMap['Burgers'],
    price: 249, discountPrice: 199, discountPercentage: 20,
    isVeg: false, spiceLevel: 'mild',
    thumbnail: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Grilled Beef-Style Patty', 'American Cheddar', 'Dill Pickles', 'Sliced Tomato', 'Mustard Mayo', 'Sesame Bun'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 520, protein: 28, carbs: 44, fat: 26 },
    rating: { average: 4.7, count: 689 },
    isFeatured: true, tags: ['classic', 'burger', 'popular'],
    preparationTime: 10, serves: 1
  },
  {
    name: 'Spicy Fiesta Chicken Burger',
    slug: 'spicy-fiesta-chicken-burger-menu',
    description: 'Crispy fried chicken breast fillet, pickled jalapeños, fiery habanero mayo, and crunchy slaw on a butter-toasted sesame seed bun.',
    category: categoryMap['Burgers'],
    price: 349, discountPrice: 279, discountPercentage: 20,
    isVeg: false, spiceLevel: 'spicy',
    thumbnail: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Crispy Chicken Fillet', 'Spicy Jalapeños', 'Habanero Slaw', 'Chipotle Sauce', 'Sesame Bun'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    nutrition: { calories: 580, protein: 32, carbs: 48, fat: 29 },
    rating: { average: 4.9, count: 820 },
    isFeatured: true, tags: ['spicy', 'chicken', 'crispy'],
    preparationTime: 14, serves: 1
  },
  {
    name: 'Double Decker Supreme Burger',
    slug: 'double-decker-supreme',
    description: 'Two seasoned patties, double melted cheese, special secret recipe relish, caramelized onions, and crunchy pickles on a sesame brioche.',
    category: categoryMap['Burgers'],
    price: 399, discountPrice: 319, discountPercentage: 20,
    isVeg: false, spiceLevel: 'medium',
    thumbnail: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Double Patty', 'Double Cheddar', 'Caramelized Onions', 'Dill Pickles', 'House Secret Dressing'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 740, protein: 44, carbs: 52, fat: 38 },
    rating: { average: 4.8, count: 412 },
    isFeatured: true, tags: ['non-veg', 'double', 'premium'],
    preparationTime: 15, serves: 1
  },
  {
    name: 'Crispy Paneer Burst Burger',
    slug: 'crispy-paneer-burst-burger',
    category: categoryMap['Burgers'],
    price: 279, discountPrice: 229, discountPercentage: 18,
    isVeg: true, spiceLevel: 'medium',
    thumbnail: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Tandoori Paneer Patty', 'Mint Aioli', 'Crunchy Onions', 'Crispy Lettuce', 'Whole Wheat Brioche'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 460, protein: 22, carbs: 44, fat: 20 },
    rating: { average: 4.6, count: 390 },
    isFeatured: false, isNewLaunch: true, tags: ['veg', 'paneer', 'indian'],
    preparationTime: 12, serves: 1
  },
  {
    name: 'BBQ Smoked Bacon Burger',
    slug: 'bbq-smoked-bacon-burger',
    category: categoryMap['Burgers'],
    price: 359, discountPrice: 289, discountPercentage: 19,
    isVeg: false, spiceLevel: 'medium',
    thumbnail: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Grilled Patty', 'Hickory BBQ Glaze', 'Crispy Bacon', 'Pepper Jack Cheese', 'Crispy Onion Strings'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 640, protein: 36, carbs: 46, fat: 34 },
    rating: { average: 4.7, count: 512 },
    isFeatured: true, tags: ['bbq', 'bacon', 'smoky'],
    preparationTime: 14, serves: 1
  },
  {
    name: 'Mushroom Truffle Swiss Burger',
    slug: 'mushroom-truffle-swiss-burger',
    category: categoryMap['Burgers'],
    price: 369, discountPrice: 299, discountPercentage: 19,
    isVeg: true, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1583032015879-c5531d0ebcdb?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1583032015879-c5531d0ebcdb?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Wild Mushrooms', 'Swiss Cheese', 'White Truffle Aioli', 'Arugula', 'Artisan Potato Bun'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 490, protein: 18, carbs: 46, fat: 24 },
    rating: { average: 4.8, count: 284 },
    isFeatured: true, tags: ['gourmet', 'truffle', 'veg'],
    preparationTime: 15, serves: 1
  },
  {
    name: 'Maharaja Mac Double Patty',
    slug: 'maharaja-mac-double-patty',
    category: categoryMap['Burgers'],
    price: 399, discountPrice: 339, discountPercentage: 15,
    isVeg: false, spiceLevel: 'medium',
    thumbnail: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Double Spiced Patties', '3-Tier Bun', 'Thousand Island Relish', 'Shredded Lettuce', 'Melty Cheese'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    nutrition: { calories: 710, protein: 38, carbs: 62, fat: 36 },
    rating: { average: 4.9, count: 940 },
    isFeatured: true, tags: ['double', 'iconic', 'bestseller'],
    preparationTime: 16, serves: 1
  },
  {
    name: 'Crispy Fish Fillet & Tartar Burger',
    slug: 'crispy-fish-fillet-tartar-burger',
    category: categoryMap['Burgers'],
    price: 319, discountPrice: 269, discountPercentage: 16,
    isVeg: false, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1582196016295-f8c8bd4b3e99?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1582196016295-f8c8bd4b3e99?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Flaky Whitefish Fillet', 'Panko Breading', 'Dill Tartar Sauce', 'Cheddar Cheese', 'Steamed Bun'],
    allergens: ['Gluten', 'Dairy', 'Fish', 'Eggs'],
    nutrition: { calories: 470, protein: 24, carbs: 46, fat: 21 },
    rating: { average: 4.5, count: 320 },
    isFeatured: false, tags: ['fish', 'crispy', 'seafood'],
    preparationTime: 12, serves: 1
  },
  {
    name: 'Jalapeño Popper Crunch Burger',
    slug: 'jalapeno-popper-crunch-burger',
    category: categoryMap['Burgers'],
    price: 319, discountPrice: 259, discountPercentage: 19,
    isVeg: true, spiceLevel: 'spicy',
    thumbnail: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Cream Cheese & Jalapeño Patty', 'Crispy Onion Rings', 'Chipotle Aioli', 'Lettuce', 'Brioche Bun'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 510, protein: 16, carbs: 54, fat: 26 },
    rating: { average: 4.7, count: 410 },
    isFeatured: false, isNewLaunch: true, tags: ['spicy', 'jalapeno', 'crunch'],
    preparationTime: 13, serves: 1
  },
  {
    name: 'Fiery Peri-Peri Chicken Burger',
    slug: 'fiery-peri-peri-chicken-burger',
    category: categoryMap['Burgers'],
    price: 349, discountPrice: 289, discountPercentage: 17,
    isVeg: false, spiceLevel: 'extra-spicy',
    thumbnail: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Peri-Peri Charred Chicken', 'Garlic Peri-Peri Sauce', 'Pickled Onions', 'Crisp Iceberg', 'Toasted Bun'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 540, protein: 34, carbs: 42, fat: 25 },
    rating: { average: 4.8, count: 620 },
    isFeatured: true, tags: ['peri-peri', 'extra-spicy', 'chicken'],
    preparationTime: 14, serves: 1
  },
  {
    name: 'Spicy Aloo Tikki Royale Burger',
    slug: 'spicy-aloo-tikki-royale-burger',
    category: categoryMap['Burgers'],
    price: 189, discountPrice: 149, discountPercentage: 21,
    isVeg: true, spiceLevel: 'medium',
    thumbnail: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Golden Spiced Potato Patty', 'Tamarind Chutney', 'Mint Aioli', 'Sliced Onions', 'Toasted Bun'],
    allergens: ['Gluten'],
    nutrition: { calories: 380, protein: 10, carbs: 54, fat: 14 },
    rating: { average: 4.6, count: 1120 },
    isFeatured: true, tags: ['desi', 'classic', 'aloo-tikki', 'value'],
    preparationTime: 9, serves: 1
  },
  {
    name: 'Cheesy Lava Molten Crunch Burger',
    slug: 'cheesy-lava-molten-crunch-burger',
    category: categoryMap['Burgers'],
    price: 369, discountPrice: 299, discountPercentage: 19,
    isVeg: true, spiceLevel: 'mild',
    thumbnail: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Molten Cheese Patty', 'Warm Cheddar Drizzle', 'Spicy Relish', 'Lettuce', 'Brioche Bun'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 620, protein: 22, carbs: 48, fat: 34 },
    rating: { average: 4.9, count: 570 },
    isFeatured: true, isNewLaunch: true, tags: ['cheese-lava', 'crunch', 'indulgence'],
    preparationTime: 13, serves: 1
  },
  {
    name: 'Bacon & Cheddar Deluxe Burger',
    slug: 'bacon-cheddar-deluxe-burger',
    category: categoryMap['Burgers'],
    price: 399, discountPrice: 329, discountPercentage: 18,
    isVeg: false, spiceLevel: 'mild',
    thumbnail: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Grilled Beef Patty', 'Crispy Smoked Bacon', 'Aged Cheddar', 'Garlic Aioli', 'Brioche Bun'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 680, protein: 42, carbs: 44, fat: 36 },
    rating: { average: 4.8, count: 710 },
    isFeatured: true, tags: ['bacon', 'cheddar', 'deluxe'],
    preparationTime: 15, serves: 1
  },
  {
    name: 'Korean Gochujang Crispy Burger',
    slug: 'korean-gochujang-crispy-burger',
    category: categoryMap['Burgers'],
    price: 349, discountPrice: 289, discountPercentage: 17,
    isVeg: false, spiceLevel: 'spicy',
    thumbnail: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Korean Fried Chicken', 'Gochujang Glaze', 'Kimchi Slaw', 'Kewpie Mayo', 'Sesame Bun'],
    allergens: ['Gluten', 'Soy', 'Eggs'],
    nutrition: { calories: 590, protein: 32, carbs: 54, fat: 28 },
    rating: { average: 4.9, count: 480 },
    isFeatured: false, isNewLaunch: true, tags: ['korean', 'gochujang', 'spicy'],
    preparationTime: 14, serves: 1
  },
  {
    name: 'Teriyaki Glazed Chicken Burger',
    slug: 'teriyaki-glazed-chicken-burger',
    category: categoryMap['Burgers'],
    price: 329, discountPrice: 269, discountPercentage: 18,
    isVeg: false, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Teriyaki Chicken Fillet', 'Grilled Pineapple', 'Kewpie Mayo', 'Romaine Lettuce', 'Sesame Bun'],
    allergens: ['Gluten', 'Soy', 'Eggs'],
    nutrition: { calories: 510, protein: 30, carbs: 52, fat: 20 },
    rating: { average: 4.7, count: 340 },
    isFeatured: false, tags: ['teriyaki', 'pineapple', 'chicken'],
    preparationTime: 13, serves: 1
  },
  {
    name: 'Triple Smash Monster Burger',
    slug: 'triple-smash-monster-burger',
    category: categoryMap['Burgers'],
    price: 479, discountPrice: 399, discountPercentage: 17,
    isVeg: false, spiceLevel: 'medium',
    thumbnail: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Triple Smashed Patties', 'Triple Cheddar', 'Grilled Onions', 'Smash Burger Sauce', 'Brioche Bun'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 880, protein: 56, carbs: 46, fat: 52 },
    rating: { average: 4.9, count: 780 },
    isFeatured: true, tags: ['monster', 'triple-smash', 'heavy'],
    preparationTime: 16, serves: 1
  },
  {
    name: 'Gourmet Black Angus Style Burger',
    slug: 'gourmet-black-angus-style-burger',
    category: categoryMap['Burgers'],
    price: 429, discountPrice: 359, discountPercentage: 16,
    isVeg: false, spiceLevel: 'mild',
    thumbnail: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Angus Style Patty', 'Smoked Gouda', 'Balsamic Onion Jam', 'Dijon Mustard', 'Brioche'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 690, protein: 44, carbs: 42, fat: 38 },
    rating: { average: 4.8, count: 430 },
    isFeatured: true, tags: ['angus', 'gourmet', 'luxury'],
    preparationTime: 15, serves: 1
  },
  {
    name: 'Garden Fresh Guacamole Veggie Burger',
    slug: 'garden-fresh-guacamole-veggie-burger',
    category: categoryMap['Burgers'],
    price: 299, discountPrice: 249, discountPercentage: 17,
    isVeg: true, spiceLevel: 'mild',
    thumbnail: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Black Bean Quinoa Patty', 'Fresh Guacamole', 'Pico de Gallo', 'Arugula', 'Whole Grain Bun'],
    allergens: ['Gluten'],
    nutrition: { calories: 430, protein: 16, carbs: 56, fat: 16 },
    rating: { average: 4.7, count: 310 },
    isFeatured: false, isNewLaunch: true, tags: ['guacamole', 'healthy', 'fresh', 'veg'],
    preparationTime: 12, serves: 1
  },
  {
    name: 'Smoky Pulled Chicken Burger',
    slug: 'smoky-pulled-chicken-burger',
    category: categoryMap['Burgers'],
    price: 339, discountPrice: 279, discountPercentage: 18,
    isVeg: false, spiceLevel: 'medium',
    thumbnail: 'https://images.unsplash.com/photo-1549611016-3a70d82b5040?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1549611016-3a70d82b5040?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Pulled Tender Chicken', 'Molasses BBQ Sauce', 'Apple Cider Slaw', 'Pickled Jalapeños', 'Brioche Bun'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    nutrition: { calories: 530, protein: 36, carbs: 48, fat: 22 },
    rating: { average: 4.8, count: 520 },
    isFeatured: true, tags: ['pulled-chicken', 'bbq', 'succulent'],
    preparationTime: 11, serves: 1
  },
  {
    name: 'Chipotle Southwestern Veggie Burger',
    slug: 'chipotle-southwestern-veggie-burger',
    category: categoryMap['Burgers'],
    price: 289, discountPrice: 239, discountPercentage: 17,
    isVeg: true, spiceLevel: 'medium',
    thumbnail: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Roasted Corn & Bean Patty', 'Pepper Jack Cheese', 'Chipotle Crema', 'Tortilla Strips', 'Brioche Bun'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 470, protein: 15, carbs: 54, fat: 21 },
    rating: { average: 4.6, count: 260 },
    isFeatured: false, tags: ['southwestern', 'chipotle', 'veg'],
    preparationTime: 12, serves: 1
  },
  {
    name: 'Caramelized Onion & Brie Brioche Burger',
    slug: 'caramelized-onion-brie-brioche-burger',
    category: categoryMap['Burgers'],
    price: 389, discountPrice: 319, discountPercentage: 18,
    isVeg: false, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Gourmet Patty', 'French Brie', 'Caramelized Vidalia Onions', 'Rosemary Garlic Mayo', 'Brioche'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    nutrition: { calories: 650, protein: 38, carbs: 44, fat: 36 },
    rating: { average: 4.9, count: 390 },
    isFeatured: true, tags: ['brie', 'caramelized-onion', 'luxury'],
    preparationTime: 15, serves: 1
  },
  {
    name: 'Crispy Sriracha Tofu Burger',
    slug: 'crispy-sriracha-tofu-burger',
    category: categoryMap['Burgers'],
    price: 259, discountPrice: 219, discountPercentage: 15,
    isVeg: true, spiceLevel: 'spicy',
    thumbnail: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Crispy Panko Tofu', 'Sriracha Honey Glaze', 'Pickled Cucumber', 'Cilantro', 'Toasted Bun'],
    allergens: ['Gluten', 'Soy'],
    nutrition: { calories: 410, protein: 18, carbs: 50, fat: 16 },
    rating: { average: 4.5, count: 210 },
    isFeatured: false, isNewLaunch: true, tags: ['sriracha', 'tofu', 'vegan-friendly'],
    preparationTime: 11, serves: 1
  },
  {
    name: 'Supreme Cheese Melt Crunch Burger',
    slug: 'supreme-cheese-melt-crunch-burger',
    category: categoryMap['Burgers'],
    price: 339, discountPrice: 279, discountPercentage: 18,
    isVeg: true, spiceLevel: 'mild',
    thumbnail: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&h=600&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&h=800&fit=crop', isPrimary: true }],
    ingredients: ['Cornflake Crunch Patty', 'Warm Nacho Cheese', 'Mozzarella Slice', 'Lettuce', 'Sesame Bun'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 590, protein: 20, carbs: 52, fat: 32 },
    rating: { average: 4.8, count: 640 },
    isFeatured: true, tags: ['cheese-melt', 'crunch', 'veg'],
    preparationTime: 12, serves: 1
  },


  // PIZZA
  {
    name: 'Margherita Classic',
    slug: 'margherita-classic',
    description: 'San Marzano tomato sauce, fresh mozzarella, basil on a hand-tossed crust.',
    category: categoryMap['Pizza'],
    price: 299, discountPrice: 239,
    isVeg: true, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Tomato Sauce', 'Mozzarella', 'Fresh Basil', 'Olive Oil'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 620, protein: 24, carbs: 82, fat: 22, fiber: 4 },
    rating: { average: 4.4, count: 189 },
    tags: ['veg', 'classic', 'pizza'], preparationTime: 18, serves: 2
  },
  {
    name: 'Spicy Pepperoni Blast',
    slug: 'spicy-pepperoni-blast',
    description: 'Loaded with premium pepperoni, jalapeños, mozzarella, and spicy arrabbiata sauce.',
    category: categoryMap['Pizza'],
    price: 399, discountPrice: 329,
    isVeg: false, spiceLevel: 'spicy',
    thumbnail: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Pepperoni', 'Jalapeños', 'Mozzarella', 'Arrabbiata Sauce'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 780, protein: 36, carbs: 80, fat: 34, fiber: 3 },
    rating: { average: 4.7, count: 321 },
    isFeatured: true, tags: ['non-veg', 'spicy', 'pizza'], preparationTime: 20, serves: 2
  },
  {
    name: 'Garden Veggie Feast',
    slug: 'garden-veggie-feast',
    description: 'Bell peppers, olives, mushrooms, onions, and sweet corn on herbed tomato sauce.',
    category: categoryMap['Pizza'],
    price: 349, discountPrice: 289,
    isVeg: true, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Bell Peppers', 'Mushrooms', 'Olives', 'Corn', 'Onions', 'Herbed Sauce'],
    nutrition: { calories: 580, protein: 20, carbs: 84, fat: 18, fiber: 6 },
    rating: { average: 4.3, count: 145 },
    tags: ['veg', 'healthy', 'pizza'], preparationTime: 18, serves: 2
  },

  // FRIED CHICKEN
  {
    name: 'Crispy 6 Pc Chicken',
    slug: 'crispy-6pc-chicken',
    description: '6 pieces of golden-fried chicken with our secret spice blend. Served with dipping sauce.',
    category: categoryMap['Fried Chicken'],
    price: 349, discountPrice: 279,
    isVeg: false, spiceLevel: 'medium',
    thumbnail: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Chicken Pieces', 'Secret Spice Blend', 'Buttermilk', 'Crispy Coating'],
    nutrition: { calories: 820, protein: 58, carbs: 48, fat: 44, fiber: 1 },
    rating: { average: 4.7, count: 567 },
    isFeatured: true, tags: ['non-veg', 'chicken', 'crispy'], preparationTime: 18, serves: 2
  },
  {
    name: 'Chicken Strips (4 Pc)',
    slug: 'chicken-strips-4pc',
    description: 'Tender chicken strips coated in seasoned breadcrumbs, fried to golden perfection.',
    category: categoryMap['Fried Chicken'],
    price: 229, discountPrice: 189,
    isVeg: false, spiceLevel: 'mild',
    thumbnail: 'https://images.unsplash.com/photo-1584671086673-96acfdf11d4e?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1584671086673-96acfdf11d4e?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Chicken Breast', 'Seasoned Breadcrumbs', 'Egg Wash'],
    nutrition: { calories: 380, protein: 28, carbs: 28, fat: 16, fiber: 1 },
    rating: { average: 4.5, count: 234 },
    tags: ['non-veg', 'strips', 'snack'], preparationTime: 12, serves: 1
  },

  // WRAPS
  {
    name: 'Grilled Chicken Caesar Wrap',
    slug: 'grilled-chicken-caesar-wrap',
    description: 'Grilled chicken with romaine lettuce, parmesan, and classic Caesar dressing in a flour tortilla.',
    category: categoryMap['Wraps'],
    price: 249, discountPrice: 199,
    isVeg: false, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Grilled Chicken', 'Romaine', 'Parmesan', 'Caesar Dressing', 'Flour Tortilla'],
    nutrition: { calories: 420, protein: 32, carbs: 38, fat: 14, fiber: 3 },
    rating: { average: 4.4, count: 178 },
    tags: ['non-veg', 'wrap', 'healthy'], preparationTime: 10, serves: 1
  },
  {
    name: 'Spicy Paneer Wrap',
    slug: 'spicy-paneer-wrap',
    description: 'Marinated paneer with spicy green chutney, onions, and bell peppers in a whole wheat wrap.',
    category: categoryMap['Wraps'],
    price: 219, discountPrice: 179,
    isVeg: true, spiceLevel: 'spicy',
    thumbnail: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Paneer', 'Green Chutney', 'Onions', 'Bell Peppers', 'Whole Wheat Wrap'],
    nutrition: { calories: 380, protein: 18, carbs: 42, fat: 14, fiber: 4 },
    rating: { average: 4.3, count: 145 },
    tags: ['veg', 'spicy', 'wrap', 'indian'], preparationTime: 10, serves: 1
  },

  // SNACKS
  {
    name: 'Loaded Nachos',
    slug: 'loaded-nachos',
    description: 'Crispy corn tortilla chips loaded with cheese sauce, jalapeños, salsa, and sour cream.',
    category: categoryMap['Snacks'],
    price: 199, discountPrice: 159,
    isVeg: true, spiceLevel: 'medium',
    thumbnail: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Tortilla Chips', 'Cheese Sauce', 'Jalapeños', 'Salsa', 'Sour Cream'],
    nutrition: { calories: 480, protein: 10, carbs: 56, fat: 24, fiber: 3 },
    rating: { average: 4.4, count: 312 },
    isFeatured: true, tags: ['veg', 'snack', 'sharing'], preparationTime: 8, serves: 2
  },
  {
    name: 'Mozzarella Sticks (6 Pc)',
    slug: 'mozzarella-sticks-6pc',
    description: 'Golden-fried mozzarella sticks with a gooey interior, served with marinara dipping sauce.',
    category: categoryMap['Snacks'],
    price: 179, discountPrice: 149,
    isVeg: true, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Mozzarella', 'Breadcrumbs', 'Marinara Sauce'],
    allergens: ['Gluten', 'Dairy'],
    nutrition: { calories: 360, protein: 16, carbs: 32, fat: 18, fiber: 1 },
    rating: { average: 4.5, count: 267 },
    tags: ['veg', 'snack', 'cheese'], preparationTime: 8, serves: 1
  },

  // FRIES & SIDES
  {
    name: 'Classic Salted Fries',
    slug: 'classic-salted-fries',
    description: 'Golden crispy fries with sea salt. Available in Regular, Medium, and Large.',
    category: categoryMap['Fries & Sides'],
    price: 99, discountPrice: 79,
    isVeg: true, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Potatoes', 'Sea Salt', 'Vegetable Oil'],
    nutrition: { calories: 240, protein: 4, carbs: 32, fat: 12, fiber: 2 },
    rating: { average: 4.3, count: 892 },
    tags: ['veg', 'fries', 'side'], preparationTime: 6, serves: 1
  },
  {
    name: 'Peri Peri Masala Fries',
    slug: 'peri-peri-masala-fries',
    description: 'Crispy fries tossed in a tangy peri peri and masala spice blend. Addictively good!',
    category: categoryMap['Fries & Sides'],
    price: 129, discountPrice: 99,
    isVeg: true, spiceLevel: 'spicy',
    thumbnail: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Potatoes', 'Peri Peri Seasoning', 'Masala Blend'],
    nutrition: { calories: 280, protein: 4, carbs: 36, fat: 14, fiber: 2 },
    rating: { average: 4.6, count: 734 },
    isFeatured: true, tags: ['veg', 'spicy', 'fries'], preparationTime: 6, serves: 1
  },
  {
    name: 'Coleslaw (Regular)',
    slug: 'coleslaw-regular',
    description: 'Creamy classic coleslaw with shredded cabbage, carrots, and our signature dressing.',
    category: categoryMap['Fries & Sides'],
    price: 79, discountPrice: 59,
    isVeg: true, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Cabbage', 'Carrot', 'Creamy Dressing', 'Pepper'],
    nutrition: { calories: 120, protein: 2, carbs: 14, fat: 6, fiber: 2 },
    rating: { average: 4.1, count: 234 },
    tags: ['veg', 'side', 'healthy'], preparationTime: 3, serves: 1
  },

  // DESSERTS
  {
    name: 'Chocolate Lava Cake',
    slug: 'chocolate-lava-cake',
    description: 'Warm chocolate cake with a molten chocolate center. Served with vanilla ice cream.',
    category: categoryMap['Desserts'],
    price: 179, discountPrice: 149,
    isVeg: true, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Vanilla Ice Cream'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    nutrition: { calories: 420, protein: 6, carbs: 52, fat: 22, fiber: 2 },
    rating: { average: 4.8, count: 456 },
    isFeatured: true, tags: ['veg', 'dessert', 'chocolate', 'bestseller'], preparationTime: 10, serves: 1
  },
  {
    name: 'Strawberry Sundae',
    slug: 'strawberry-sundae',
    description: 'Creamy vanilla soft serve topped with fresh strawberry sauce and whipped cream.',
    category: categoryMap['Desserts'],
    price: 99, discountPrice: 79,
    isVeg: true, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Vanilla Soft Serve', 'Strawberry Sauce', 'Whipped Cream'],
    nutrition: { calories: 220, protein: 4, carbs: 38, fat: 6, fiber: 0 },
    rating: { average: 4.4, count: 321 },
    tags: ['veg', 'dessert', 'ice-cream'], preparationTime: 3, serves: 1
  },

  // COFFEE
  {
    name: 'Premium Cold Brew',
    slug: 'premium-cold-brew',
    description: '18-hour cold-steeped coffee, smooth and bold. Served over ice with optional milk.',
    category: categoryMap['Coffee'],
    price: 149, discountPrice: 119,
    isVeg: true, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Cold Brew Coffee', 'Ice', 'Optional: Milk/Cream'],
    nutrition: { calories: 20, protein: 0, carbs: 2, fat: 0, fiber: 0 },
    rating: { average: 4.6, count: 234 },
    tags: ['veg', 'coffee', 'cold', 'refreshing'], preparationTime: 3, serves: 1
  },
  {
    name: 'Cappuccino',
    slug: 'cappuccino',
    description: 'Perfectly balanced espresso with steamed milk and velvety foam. A classic done right.',
    category: categoryMap['Coffee'],
    price: 129, discountPrice: 99,
    isVeg: true, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Espresso', 'Steamed Milk', 'Milk Foam'],
    allergens: ['Dairy'],
    nutrition: { calories: 80, protein: 5, carbs: 8, fat: 3, fiber: 0 },
    rating: { average: 4.5, count: 312 },
    tags: ['veg', 'coffee', 'hot'], preparationTime: 4, serves: 1
  },

  // BEVERAGES
  {
    name: 'Classic Cola (Large)',
    slug: 'classic-cola-large',
    description: 'Ice-cold classic cola served in a large cup with crushed ice.',
    category: categoryMap['Beverages'],
    price: 99, discountPrice: 79,
    isVeg: true, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Cola', 'Crushed Ice'],
    nutrition: { calories: 140, protein: 0, carbs: 36, fat: 0, fiber: 0 },
    rating: { average: 4.2, count: 1023 },
    tags: ['veg', 'beverage', 'cold'], preparationTime: 2, serves: 1
  },
  {
    name: 'Mango Lassi',
    slug: 'mango-lassi',
    description: 'Thick creamy Indian yogurt drink blended with Alphonso mango pulp. Refreshingly divine!',
    category: categoryMap['Beverages'],
    price: 129, discountPrice: 99,
    isVeg: true, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1538598994986-9b58e23f709e?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1538598994986-9b58e23f709e?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Alphonso Mango Pulp', 'Yogurt', 'Sugar', 'Cardamom'],
    allergens: ['Dairy'],
    nutrition: { calories: 200, protein: 6, carbs: 38, fat: 3, fiber: 1 },
    rating: { average: 4.7, count: 456 },
    isFeatured: true, tags: ['veg', 'beverage', 'indian', 'mango'], preparationTime: 3, serves: 1
  },
  {
    name: 'Fresh Lime Soda',
    slug: 'fresh-lime-soda',
    description: 'Freshly squeezed lime with sparkling water, black salt, and a hint of sugar.',
    category: categoryMap['Beverages'],
    price: 89, discountPrice: 69,
    isVeg: true, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Fresh Lime Juice', 'Sparkling Water', 'Black Salt', 'Sugar'],
    nutrition: { calories: 60, protein: 0, carbs: 15, fat: 0, fiber: 0 },
    rating: { average: 4.4, count: 567 },
    tags: ['veg', 'beverage', 'refreshing', 'low-calorie'], preparationTime: 2, serves: 1
  },

  // HEALTHY
  {
    name: 'Mediterranean Quinoa Bowl',
    slug: 'mediterranean-quinoa-bowl',
    description: 'Protein-packed quinoa with roasted vegetables, feta, olives, and lemon tahini dressing.',
    category: categoryMap['Healthy'],
    price: 299, discountPrice: 249,
    isVeg: true, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Quinoa', 'Roasted Veggies', 'Feta', 'Olives', 'Tahini Dressing'],
    allergens: ['Dairy', 'Sesame'],
    nutrition: { calories: 380, protein: 16, carbs: 52, fat: 14, fiber: 8 },
    rating: { average: 4.5, count: 189 },
    tags: ['veg', 'healthy', 'high-protein', 'bowl'], preparationTime: 12, serves: 1
  },
  {
    name: 'Grilled Chicken Salad',
    slug: 'grilled-chicken-salad',
    description: 'Grilled chicken breast on a bed of mixed greens, cherry tomatoes, cucumber, and balsamic.',
    category: categoryMap['Healthy'],
    price: 279, discountPrice: 229,
    isVeg: false, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Grilled Chicken', 'Mixed Greens', 'Cherry Tomatoes', 'Cucumber', 'Balsamic'],
    nutrition: { calories: 280, protein: 34, carbs: 16, fat: 8, fiber: 4 },
    rating: { average: 4.3, count: 156 },
    tags: ['non-veg', 'healthy', 'high-protein', 'salad'], preparationTime: 12, serves: 1
  },

  // NEW LAUNCH
  {
    name: 'Korean BBQ Chicken Wings',
    slug: 'korean-bbq-chicken-wings',
    description: 'NEW! Crispy wings glazed with sweet-spicy Korean gochujang sauce. Topped with sesame.',
    category: categoryMap['New Launch'],
    price: 279, discountPrice: 229,
    isVeg: false, spiceLevel: 'spicy',
    thumbnail: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Chicken Wings', 'Gochujang Sauce', 'Sesame Seeds', 'Spring Onions'],
    nutrition: { calories: 480, protein: 36, carbs: 28, fat: 24, fiber: 1 },
    rating: { average: 4.9, count: 89 },
    isNewLaunch: true, isFeatured: true,
    tags: ['non-veg', 'korean', 'spicy', 'new', 'wings'], preparationTime: 16, serves: 1
  },
  {
    name: 'Truffle Mushroom Burger',
    slug: 'truffle-mushroom-burger',
    description: 'NEW! Portobello mushroom patty with truffle aioli, gruyère cheese, and arugula. Premium!',
    category: categoryMap['New Launch'],
    price: 379, discountPrice: 319,
    isVeg: true, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Portobello Mushroom', 'Truffle Aioli', 'Gruyère', 'Arugula', 'Brioche'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    nutrition: { calories: 520, protein: 18, carbs: 54, fat: 26, fiber: 4 },
    rating: { average: 4.8, count: 67 },
    isNewLaunch: true, isFeatured: true,
    tags: ['veg', 'premium', 'truffle', 'new', 'burger'], preparationTime: 14, serves: 1
  },
  {
    name: 'Matcha Iced Latte',
    slug: 'matcha-iced-latte',
    description: 'NEW! Japanese ceremonial grade matcha blended with oat milk and served over ice.',
    category: categoryMap['New Launch'],
    price: 179, discountPrice: 149,
    isVeg: true, spiceLevel: 'none',
    thumbnail: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=400&h=400&fit=crop',
    images: [{ url: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600&h=600&fit=crop', isPrimary: true }],
    ingredients: ['Ceremonial Matcha', 'Oat Milk', 'Ice', 'Sweetener'],
    nutrition: { calories: 140, protein: 4, carbs: 24, fat: 3, fiber: 0 },
    rating: { average: 4.7, count: 124 },
    isNewLaunch: true, tags: ['veg', 'coffee', 'matcha', 'new', 'trendy'], preparationTime: 4, serves: 1
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/foodova', {
      dbName: process.env.MONGODB_DB_NAME || 'foodova'
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed categories
    const savedCategories = await Category.insertMany(categories);
    console.log(`✅ Seeded ${savedCategories.length} categories`);

    // Build category map
    const categoryMap = {};
    savedCategories.forEach(cat => { categoryMap[cat.name] = cat._id; });

    // Seed products
    const products = generateProducts(categoryMap).map(p => ({
      ...p,
      description: p.description || `${p.name} - Fresh, gourmet, and handcrafted to perfection.`
    }));
    const savedProducts = await Product.insertMany(products);
    console.log(`✅ Seeded ${savedProducts.length} products`);

    // Create admin user
    const existingAdmin = await User.findOne({ email: 'admin@foodova.com' });
    if (!existingAdmin) {
      const passwordHash = await User.hashPassword('Admin@123');
      await User.create({
        name: 'FOODOVA Admin',
        email: 'admin@foodova.com',
        phone: '9876543210',
        passwordHash,
        role: 'admin'
      });
      console.log('✅ Admin user created: admin@foodova.com / Admin@123');
    }

    // Create test user
    const existingUser = await User.findOne({ email: 'test@foodova.com' });
    if (!existingUser) {
      const passwordHash = await User.hashPassword('Test@1234');
      await User.create({
        name: 'Test User',
        email: 'test@foodova.com',
        phone: '9876543211',
        passwordHash,
        role: 'user',
        addresses: [{
          label: 'Home',
          fullAddress: '123, Test Street, Bangalore, Karnataka',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          isDefault: true
        }]
      });
      console.log('✅ Test user created: test@foodova.com / Test@1234');
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   Categories: ${savedCategories.length}`);
    console.log(`   Products: ${savedProducts.length}`);
    console.log('   Admin: admin@foodova.com / Admin@123');
    console.log('   User: test@foodova.com / Test@1234');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    if (err.message.includes('authentication failed')) {
      console.log('\n💡 Atlas Authentication Tip:');
      console.log('   In MongoDB Atlas -> Click "Database Users" under DATABASE ACCESS in the left sidebar.');
      console.log('   Verify username or click "Edit" -> "Edit Password" to reset the password,');
      console.log('   then update MONGODB_URI in backend/.env with your new password.');
    }
    process.exit(1);
  }
};

seedDatabase();
