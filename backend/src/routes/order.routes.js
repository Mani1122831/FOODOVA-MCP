const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, getOrderStatus } = require('../controllers/order.controller');
const { protect } = require('../auth/authMiddleware');

router.use(protect);
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:orderId', getOrder);
router.get('/:orderId/status', getOrderStatus);

module.exports = router;
