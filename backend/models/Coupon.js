const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please add a coupon code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Please specify a discount type']
  },
  discountValue: {
    type: Number,
    required: [true, 'Please add a discount value'],
    min: [0, 'Discount value must be positive']
  },
  expiryDate: {
    type: Date
  },
  usageLimit: {
    type: Number,
    default: 100
  },
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  minOrderAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual to check if coupon is still valid
couponSchema.virtual('isValid').get(function () {
  const notExpired = !this.expiryDate || this.expiryDate > new Date();
  const withinLimit = this.usedCount < this.usageLimit;
  return this.isActive && notExpired && withinLimit;
});

module.exports = mongoose.model('Coupon', couponSchema);
