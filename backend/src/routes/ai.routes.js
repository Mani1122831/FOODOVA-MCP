const express = require('express');
const router = express.Router();
const { 
  chat, 
  recommend, 
  generateImage, 
  generateDescription, 
  saveFoodImage, 
  getCanvaWorkflow 
} = require('../controllers/ai.controller');
const { optionalAuth, protect, adminOnly } = require('../auth/authMiddleware');
const rateLimit = require('express-rate-limit');

// General AI rate limiter for chat and descriptions
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 25,
  message: { success: false, message: 'Too many AI requests. Please wait a moment.' }
});

// Dedicated rate limiter for AI image generation (more resource-intensive)
const imageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per 15 mins
  message: { success: false, message: 'Image generation limit reached. Please wait a few minutes before trying again.' }
});

// AI Customer Chat & Recommendations
router.post('/chat', aiLimiter, optionalAuth, chat);
router.post('/recommend', aiLimiter, optionalAuth, recommend);

// AI Food Studio Endpoints (Supports /api/ai and /api/v1/ai)
router.post('/generate-image', imageLimiter, generateImage);
router.post('/generate-description', aiLimiter, generateDescription);
router.post('/save-image', saveFoodImage);
router.get('/canva-workflow', getCanvaWorkflow);

module.exports = router;
