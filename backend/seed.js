/**
 * Admin Reset & Seed Script
 * Deletes existing admin and creates a fresh one with properly hashed password.
 * Run: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const ADMIN_EMAIL    = 'admin@codebuddy.com';
const ADMIN_PASSWORD = 'Admin@1234';
const ADMIN_NAME     = 'CodeBuddy Admin';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/codebuddy');
    console.log('✅ Connected to MongoDB');

    // Delete any existing admin to start fresh
    const deleted = await User.deleteOne({ email: ADMIN_EMAIL });
    if (deleted.deletedCount > 0) {
      console.log('🗑️  Old admin removed (fresh seed)');
    }

    // Create admin — pre('save') hook will hash the password
    const admin = await User.create({
      name     : ADMIN_NAME,
      email    : ADMIN_EMAIL,
      password : ADMIN_PASSWORD,
      role     : 'admin',
    });

    console.log('\n🎉 Admin created successfully!');
    console.log('   ID      :', admin._id.toString());
    console.log('   Email   :', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    console.log('   Role    :', admin.role);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
