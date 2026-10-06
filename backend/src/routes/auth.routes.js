const express = require('express');
const router = express.Router();
const {
  register, login, forgotPassword, verifyOTP, resetPassword,
  resendOTP, logout, getMe,
  registerValidation, loginValidation, forgotPasswordValidation,
  verifyOTPValidation, resetPasswordValidation
} = require('../controllers/auth.controller');
const { protect } = require('../auth/authMiddleware');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/verify-otp', verifyOTPValidation, verifyOTP);
router.post('/reset-password', resetPasswordValidation, resetPassword);
router.post('/resend-otp', resendOTP);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
