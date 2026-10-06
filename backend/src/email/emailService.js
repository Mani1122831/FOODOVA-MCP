const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    },
    tls: { rejectUnauthorized: false }
  });
};

// Base email template
const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FOODOVA</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #FF6B35, #F7C59F); padding: 30px; text-align: center; }
    .logo { font-size: 28px; font-weight: 800; color: white; letter-spacing: -1px; }
    .logo span { color: #1a1a1a; }
    .tagline { color: rgba(255,255,255,0.9); font-size: 12px; margin-top: 4px; }
    .body { background: white; padding: 30px; }
    .footer { background: #1a1a1a; padding: 20px; text-align: center; }
    .footer p { color: #888; font-size: 12px; }
    .btn { display: inline-block; background: #FF6B35; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .divider { border: none; border-top: 1px solid #eee; margin: 20px 0; }
    .highlight { background: #FFF5F0; border-left: 4px solid #FF6B35; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f8f8f8; padding: 10px; text-align: left; font-size: 12px; color: #666; }
    td { padding: 10px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
    .total-row td { font-weight: 700; font-size: 16px; color: #FF6B35; border-top: 2px solid #eee; }
    .status-badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">FOOD<span>OVA</span></div>
      <div class="tagline">Good Food. Faster. Smarter.</div>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} FOODOVA. All rights reserved.</p>
      <p style="margin-top:8px">Questions? Contact us at support@foodova.com</p>
    </div>
  </div>
</body>
</html>`;

// Send OTP Email
const sendOTPEmail = async (email, name) => {
  // NOTE: OTP is NOT passed to this function or included in email HTML
  // It is sent separately and only shown via the API response to the logged-in flow
  throw new Error('Use sendOTPEmailWithCode instead');
};

const sendOTPEmailWithCode = async (email, name, otpCode) => {
  const transporter = createTransporter();
  const content = `
    <h2 style="color:#1a1a1a;margin-bottom:8px">Password Reset OTP</h2>
    <p style="color:#666;margin-bottom:20px">Hi ${name || 'there'}, you requested a password reset for your FOODOVA account.</p>
    <div class="highlight">
      <p style="font-size:13px;color:#666;margin-bottom:8px">Your One-Time Password (OTP):</p>
      <p style="font-size:36px;font-weight:800;letter-spacing:8px;color:#FF6B35;font-family:monospace">${otpCode}</p>
      <p style="font-size:12px;color:#999;margin-top:8px">⏰ Valid for 5 minutes only</p>
    </div>
    <p style="color:#666;font-size:14px">If you didn't request this, please ignore this email. Your password will not change.</p>
    <hr class="divider">
    <p style="color:#999;font-size:12px">For security, never share this OTP with anyone. FOODOVA will never ask for your OTP.</p>`;
  
  const mailOptions = {
    from: `"${process.env.FROM_NAME || 'FOODOVA'}" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'FOODOVA - Password Reset OTP',
    html: baseTemplate(content)
  };

  await transporter.sendMail(mailOptions);
  logger.info(`OTP email sent to ${email}`);
};

// Order Confirmation to User
const sendOrderConfirmationEmail = async (order, user) => {
  const transporter = createTransporter();
  const itemsHtml = order.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:right">₹${item.price}</td>
      <td style="text-align:right">₹${item.itemTotal}</td>
    </tr>`).join('');

  const content = `
    <h2 style="color:#1a1a1a">Order Confirmed! 🎉</h2>
    <p style="color:#666;margin:8px 0 20px">Hi ${user.name}, your order has been placed successfully.</p>
    <div class="highlight">
      <p style="font-size:12px;color:#666">ORDER ID</p>
      <p style="font-size:20px;font-weight:700;color:#1a1a1a">#${order.orderId}</p>
      <span class="status-badge">✓ Confirmed</span>
    </div>
    <h3 style="margin:20px 0 12px;color:#1a1a1a">Order Summary</h3>
    <table>
      <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr><td colspan="3" style="text-align:right;color:#666">Subtotal</td><td style="text-align:right">₹${order.subtotal}</td></tr>
        <tr><td colspan="3" style="text-align:right;color:#666">Tax (5%)</td><td style="text-align:right">₹${order.tax}</td></tr>
        <tr><td colspan="3" style="text-align:right;color:#666">Delivery Fee</td><td style="text-align:right">₹${order.deliveryFee}</td></tr>
        ${order.discount > 0 ? `<tr><td colspan="3" style="text-align:right;color:#22c55e">Discount</td><td style="text-align:right;color:#22c55e">-₹${order.discount}</td></tr>` : ''}
        <tr class="total-row"><td colspan="3" style="text-align:right">TOTAL</td><td style="text-align:right">₹${order.total}</td></tr>
      </tfoot>
    </table>
    <hr class="divider">
    <h3 style="margin-bottom:8px;color:#1a1a1a">Delivery Address</h3>
    <p style="color:#666">${order.address?.fullAddress || 'Address on file'}</p>
    <hr class="divider">
    <p style="color:#666;font-size:14px">⏰ Estimated Delivery: <strong style="color:#1a1a1a">~45 minutes</strong></p>
    <p style="color:#666;font-size:14px;margin-top:8px">📞 Support: <a href="mailto:support@foodova.com" style="color:#FF6B35">support@foodova.com</a></p>`;

  const mailOptions = {
    from: `"FOODOVA" <${process.env.FROM_EMAIL}>`,
    to: user.email,
    subject: `Order Confirmed - FOODOVA #${order.orderId}`,
    html: baseTemplate(content)
  };
  await transporter.sendMail(mailOptions);
  logger.info(`Order confirmation sent to user ${user.email} for order ${order.orderId}`);
};

// New Order Notification to Admin
const sendAdminOrderNotification = async (order, user) => {
  const transporter = createTransporter();
  const itemsHtml = order.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>₹${item.itemTotal}</td>
    </tr>`).join('');

  const content = `
    <h2 style="color:#1a1a1a">🆕 New Order Received</h2>
    <div class="highlight">
      <p style="font-weight:700;font-size:18px">#${order.orderId}</p>
      <p style="color:#666;font-size:13px">${new Date(order.createdAt).toLocaleString('en-IN')}</p>
    </div>
    <h3 style="margin:16px 0 8px">Customer Details</h3>
    <table>
      <tr><td><strong>Name</strong></td><td>${user.name}</td></tr>
      <tr><td><strong>Email</strong></td><td>${user.email}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${user.phone || 'N/A'}</td></tr>
      <tr><td><strong>Address</strong></td><td>${order.address?.fullAddress || 'N/A'}</td></tr>
    </table>
    <h3 style="margin:16px 0 8px">Ordered Items</h3>
    <table>
      <thead><tr><th>Item</th><th>Qty</th><th>Total</th></tr></thead>
      <tbody>${itemsHtml}</tbody>
      <tfoot>
        <tr class="total-row"><td colspan="2">ORDER TOTAL</td><td>₹${order.total}</td></tr>
      </tfoot>
    </table>
    <hr class="divider">
    <p style="color:#666;font-size:13px">Payment: ${order.paymentMethod?.toUpperCase()} | Status: ${order.status?.toUpperCase()}</p>`;

  const mailOptions = {
    from: `"FOODOVA System" <${process.env.FROM_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New FOODOVA Order - #${order.orderId}`,
    html: baseTemplate(content)
  };
  await transporter.sendMail(mailOptions);
  logger.info(`Admin notification sent for order ${order.orderId}`);
};

// Welcome Email
const sendWelcomeEmail = async (user) => {
  const transporter = createTransporter();
  const content = `
    <h2 style="color:#1a1a1a">Welcome to FOODOVA! 🍔</h2>
    <p style="color:#666;margin:8px 0 20px">Hi ${user.name}, your account has been created successfully.</p>
    <p style="color:#666">Get ready for an amazing food experience. Explore our menu and enjoy exclusive offers.</p>
    <div style="text-align:center;margin:24px 0">
      <a href="${process.env.CLIENT_URL}/menu" class="btn">Explore Menu</a>
    </div>
    <hr class="divider">
    <p style="color:#999;font-size:12px">Need help? Contact us at support@foodova.com</p>`;

  const mailOptions = {
    from: `"FOODOVA" <${process.env.FROM_EMAIL}>`,
    to: user.email,
    subject: 'Welcome to FOODOVA - Good Food. Faster. Smarter.',
    html: baseTemplate(content)
  };
  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOTPEmailWithCode,
  sendOrderConfirmationEmail,
  sendAdminOrderNotification,
  sendWelcomeEmail
};
