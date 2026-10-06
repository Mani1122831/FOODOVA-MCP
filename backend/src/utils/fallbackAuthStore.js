const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Initial in-memory seed users
const fallbackUsers = [
  {
    _id: '65e000000000000000000001',
    name: 'FOODOVA Admin',
    email: 'admin@foodova.com',
    role: 'admin',
    isActive: true,
    phone: '+91 9876543210',
    // Pre-hashed 'Admin@123'
    passwordHash: bcrypt.hashSync('Admin@123', 10),
    addresses: [
      {
        label: 'Office',
        fullAddress: 'FOODOVA Central Hub, 42 Gourmet Way',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        isDefault: true
      }
    ]
  },
  {
    _id: '65e000000000000000000002',
    name: 'Test Customer',
    email: 'test@foodova.com',
    role: 'user',
    isActive: true,
    phone: '+91 9123456789',
    // Pre-hashed 'Customer@123'
    passwordHash: bcrypt.hashSync('Customer@123', 10),
    addresses: [
      {
        label: 'Home',
        fullAddress: '123, Palm Grove Avenue, Indiranagar',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560038',
        landmark: 'Near Metro Station',
        isDefault: true
      }
    ]
  }
];

// In-memory OTP storage: email -> { otp, otpHash, expiresAt, attempts }
const otpStore = new Map();

// In-memory Reset Token storage: email -> { token, tokenHash, expiresAt }
const resetTokenStore = new Map();

const getFallbackUserById = (id) => {
  if (!id) return null;
  const strId = id.toString();
  return fallbackUsers.find(u => u._id === strId || u._id.toString() === strId) || null;
};

const getFallbackUserByEmail = (email) => {
  if (!email) return null;
  return fallbackUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};

const addFallbackUser = ({ name, email, phone, role, password, passwordHash }) => {
  const normalizedEmail = email.toLowerCase();
  const existing = getFallbackUserByEmail(normalizedEmail);
  if (existing) {
    if (password) existing.passwordHash = bcrypt.hashSync(password, 10);
    else if (passwordHash) existing.passwordHash = passwordHash;
    if (name) existing.name = name;
    if (phone) existing.phone = phone;
    return existing;
  }

  const hash = passwordHash || (password ? bcrypt.hashSync(password, 10) : bcrypt.hashSync('Foodova@123', 10));

  const newUser = {
    _id: '65e0000000000000' + Date.now().toString(16).slice(-8),
    name: name || normalizedEmail.split('@')[0],
    email: normalizedEmail,
    role: role || (normalizedEmail.includes('admin') ? 'admin' : 'user'),
    isActive: true,
    phone: phone || '+91 9876543210',
    passwordHash: hash,
    addresses: []
  };

  fallbackUsers.push(newUser);
  return newUser;
};

const updateFallbackUserPassword = (email, newPassword) => {
  const user = getFallbackUserByEmail(email);
  const hash = bcrypt.hashSync(newPassword, 10);
  if (user) {
    user.passwordHash = hash;
    return user;
  }
  // If user wasn't registered yet, create them now with this password
  return addFallbackUser({
    email,
    password: newPassword,
    name: email.split('@')[0]
  });
};

const verifyFallbackPassword = (user, candidatePassword) => {
  if (!user || !user.passwordHash) return true; // graceful allow for rapid dev demo if no hash
  try {
    return bcrypt.compareSync(candidatePassword, user.passwordHash);
  } catch (_) {
    return false;
  }
};

// OTP methods
const storeFallbackOTP = (email, otp, expiresAt) => {
  const normEmail = email.toLowerCase();
  const otpHash = crypto.createHash('sha256').update(otp.toString()).digest('hex');
  otpStore.set(normEmail, {
    otp: otp.toString(),
    otpHash,
    expiresAt: expiresAt || new Date(Date.now() + 5 * 60 * 1000),
    attempts: 0
  });
};

const getFallbackOTP = (email) => {
  return otpStore.get(email.toLowerCase()) || null;
};

const clearFallbackOTP = (email) => {
  otpStore.delete(email.toLowerCase());
};

// Reset Token methods
const storeFallbackResetToken = (email, token, expiresAt) => {
  const normEmail = email.toLowerCase();
  resetTokenStore.set(normEmail, {
    token,
    expiresAt: expiresAt || new Date(Date.now() + 10 * 60 * 1000)
  });
};

const getFallbackResetToken = (email) => {
  return resetTokenStore.get(email.toLowerCase()) || null;
};

const clearFallbackResetToken = (email) => {
  resetTokenStore.delete(email.toLowerCase());
};

module.exports = {
  fallbackUsers,
  getFallbackUserById,
  getFallbackUserByEmail,
  addFallbackUser,
  updateFallbackUserPassword,
  verifyFallbackPassword,
  storeFallbackOTP,
  getFallbackOTP,
  clearFallbackOTP,
  storeFallbackResetToken,
  getFallbackResetToken,
  clearFallbackResetToken
};
