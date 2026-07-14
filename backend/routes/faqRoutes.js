const express = require('express');
const router = express.Router();
const { getFAQs, getFAQ, createFAQ, updateFAQ, deleteFAQ } = require('../controllers/faqController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getFAQs)
  .post(protect, authorize('admin'), createFAQ);

router.route('/:id')
  .get(getFAQ)
  .put(protect, authorize('admin'), updateFAQ)
  .delete(protect, authorize('admin'), deleteFAQ);

module.exports = router;
