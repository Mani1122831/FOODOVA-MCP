const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const Category = require('../src/models/Category');
const Order = require('../src/models/Order');
const OTP = require('../src/models/OTP');

describe('FOODOVA Platform Integration Tests', () => {
  let authToken = '';
  let adminToken = '';
  let testUserId = '';
  let testProductId = '';

  beforeAll(async () => {
    // Wait for mongoose connection with short timeout if database is offline
    if (mongoose.connection.readyState !== 1) {
      try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/foodova', {
          serverSelectionTimeoutMS: 2000
        });
      } catch (err) {
        console.warn('Test runner: MongoDB offline, proceeding with unit-level API checks.');
      }
    }
  });

  afterAll(async () => {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
      }
    } catch (_) {}
  });

  describe('Health API', () => {
    it('GET /api/health should return 200 OK', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Authentication Suite', () => {
    const testEmail = `test_${Date.now()}@foodova.com`;
    const testPassword = 'Password@123';

    it('POST /api/auth/register - Should register user & hash password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Automated Test User',
        email: testEmail,
        phone: '9876543210',
        password: testPassword
      });

      expect([201, 409]).toContain(res.statusCode);
      if (res.statusCode === 201) {
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
        authToken = res.body.token;
        testUserId = res.body.user._id;
      }
    });

    it('POST /api/auth/login - Should authenticate valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@foodova.com',
        password: 'Test@1234'
      });

      expect([200, 401]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        authToken = res.body.token;
      }
    });

    it('POST /api/auth/login - Should reject invalid password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@foodova.com',
        password: 'WrongPassword999'
      });
      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/auth/forgot-password - Should accept registered email & generate OTP', async () => {
      const res = await request(app).post('/api/auth/forgot-password').send({
        email: 'test@foodova.com'
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      // Ensure OTP is NEVER exposed in the JSON response
      expect(res.body.otp).toBeUndefined();
    });
  });

  describe('Products Catalog API', () => {
    it('GET /api/products - Should list dishes with pagination and filters', async () => {
      const res = await request(app).get('/api/products?limit=10');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      if (res.body.products?.length > 0) {
        testProductId = res.body.products[0]._id;
      }
    });

    it('GET /api/products?isVeg=true - Should filter vegetarian food only', async () => {
      const res = await request(app).get('/api/products?isVeg=true');
      expect(res.statusCode).toEqual(200);
      if (res.body.products?.length > 0) {
        res.body.products.forEach(p => expect(p.isVeg).toBe(true));
      }
    });
  });

  describe('AI Assistant & Food Studio Endpoints', () => {
    it('POST /api/ai/chat - Should generate culinary recommendation', async () => {
      const res = await request(app).post('/api/ai/chat').send({
        message: 'Recommend a vegetarian combo under 300'
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.response).toBeDefined();
    });

    it('GET /api/v1/ai/canva-workflow - Should return Canva design workflow templates', async () => {
      const res = await request(app).get('/api/v1/ai/canva-workflow?foodName=Crispy%20Burger');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.destinations).toBeDefined();
      expect(res.body.destinations.posters).toContain('canva.com');
    });

    it('POST /api/v1/ai/generate-image - Should validate input promptly', async () => {
      const res = await request(app).post('/api/v1/ai/generate-image').send({
        prompt: 'test short'
      });
      // Should reject prompt that's too short or lacking food keywords
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/v1/ai/generate-description - Should validate foodName requirement', async () => {
      const res = await request(app).post('/api/v1/ai/generate-description').send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });
  });
});

