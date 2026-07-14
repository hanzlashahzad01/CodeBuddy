const express = require('express');
const router = express.Router();
const { getCoupons, getCoupon, createCoupon, updateCoupon, deleteCoupon, validateCoupon } = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/validate', protect, validateCoupon);

router.route('/')
  .get(protect, authorize('admin'), getCoupons)
  .post(protect, authorize('admin'), createCoupon);

router.route('/:id')
  .get(protect, authorize('admin'), getCoupon)
  .put(protect, authorize('admin'), updateCoupon)
  .delete(protect, authorize('admin'), deleteCoupon);

module.exports = router;
