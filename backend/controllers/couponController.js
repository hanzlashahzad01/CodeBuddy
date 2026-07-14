const Coupon = require('../models/Coupon');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: coupons.length, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Private/Admin
exports.getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, error: 'Coupon not found' });
    res.status(200).json({ success: true, data: coupon });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private/Admin
exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ success: false, error: 'Coupon not found' });
    res.status(200).json({ success: true, data: coupon });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, error: 'Coupon not found' });
    res.status(200).json({ success: true, data: {}, message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Private
exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon || !coupon.isValid) {
      return res.status(400).json({ success: false, error: 'Invalid or expired coupon' });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({ success: false, error: `Minimum order amount for this coupon is $${coupon.minOrderAmount}` });
    }

    res.status(200).json({ success: true, data: coupon });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
