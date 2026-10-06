require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (_) {}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const logger = require('./utils/logger');

// Routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const aiRoutes = require('./routes/ai.routes');
const adminRoutes = require('./routes/admin.routes');
const categoryRoutes = require('./routes/category.routes');

const app = express();

// ── Security middleware ──────────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin or matching localhost / vercel.app
    if (!origin || origin.includes('localhost') || origin.endsWith('.vercel.app') || (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)) {
      return callback(null, true);
    }
    // Allow in all cases for seamless API access
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', globalLimiter);

// Auth-specific strict rate limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many authentication attempts.' }
});
app.use('/api/auth/', authLimiter);

// Body parsing (Increased limit for AI generated food images and payloads)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());
app.use(compression());

// Static uploads serving for AI generated food images
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Data sanitization
app.use(mongoSanitize());
app.use(hpp());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Database Connection ───────────────────────────────────────────────
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  mongoose.set('bufferCommands', false);
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || 'foodova',
      serverSelectionTimeoutMS: 5000
    });
    logger.info('✅ MongoDB connected successfully');
  } catch (err) {
    logger.error('❌ MongoDB connection error:', err.message);
    logger.warn('⚠️  Backend active with resilient culinary data store. To connect live Atlas: verify user credentials under Atlas > Database Access > Database Users.');
  }
};

// Middleware to ensure DB connection in serverless environments (Vercel)
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MONGODB_URI) {
    try {
      await connectDB();
    } catch (_) {}
  }
  next();
});

// ── API Routes ────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/v1/ai', aiRoutes); // Versioned endpoint support
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'FOODOVA API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`${err.message}`, { stack: err.stack, url: req.originalUrl });
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ── Start Server ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`🚀 FOODOVA Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  startServer();
}

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION:', err);
  process.exit(1);
});

module.exports = app;
