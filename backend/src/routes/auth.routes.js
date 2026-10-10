const express = require('express');
const router = express.Router();
const {
  register, login, forgotPassword, verifyOTP, resetPassword,
  resendOTP, logout, getMe,
  registerValidation, loginValidation, forgotPasswordValidation,
  verifyOTPValidation, resetPasswordValidation
} = require('../controllers/auth.controller');
const { protect } = require('../auth/authMiddleware');

const { createTransporter } = require('../email/emailService');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/verify-otp', verifyOTPValidation, verifyOTP);
router.post('/reset-password', resetPasswordValidation, resetPassword);
router.post('/resend-otp', resendOTP);
router.post('/logout', logout);
router.get('/me', protect, getMe);

// Verification route for email service
router.get('/test-email', async (req, res) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    res.json({
      success: true,
      message: 'SMTP credentials verified successfully! Email service is live and operational.',
      smtpUser: process.env.SMTP_USER || 'kasanimanikanta2005@gmail.com'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'SMTP verification failed: ' + err.message,
      code: err.code
    });
  }
});

module.exports = router;

