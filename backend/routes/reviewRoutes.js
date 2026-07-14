const express = require('express');
const router = express.Router({ mergeParams: true });
const { getReviews, addReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getReviews)
  .post(protect, addReview);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
