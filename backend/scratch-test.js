require('dotenv').config();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

async function testAll() {
  console.log('--- 1. Testing MongoDB Connection ---');
  console.log('URI:', process.env.MONGODB_URI);
  console.log('DB Name:', process.env.MONGODB_DB_NAME);

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || 'foodova',
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB Connected Successfully!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
  }

  console.log('\n--- 2. Testing Nodemailer SMTP Connection ---');
  console.log('Host:', process.env.SMTP_HOST);
  console.log('User:', process.env.SMTP_USER);

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    await transporter.verify();
    console.log('✅ SMTP Transporter Verified Successfully!');
  } catch (err) {
    console.error('❌ SMTP Verification Error:', err.message);
  }

  process.exit(0);
}

testAll();
