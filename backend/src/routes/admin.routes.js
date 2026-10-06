const express = require('express');
const router = express.Router();
const { getAdminOrders, updateOrderStatus, getAdminUsers, getAdminProducts, getAdminStats } = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../auth/authMiddleware');

router.use(protect, adminOnly);
router.get('/stats', getAdminStats);
router.get('/orders', getAdminOrders);
router.put('/orders/:orderId/status', updateOrderStatus);
router.get('/users', getAdminUsers);
router.get('/products', getAdminProducts);

module.exports = router;
