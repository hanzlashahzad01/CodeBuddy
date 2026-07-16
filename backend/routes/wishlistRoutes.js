const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist
} = require('../controllers/wishlistController');

const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWishlist);
router.post('/:courseId', protect, addToWishlist);
router.delete('/:courseId', protect, removeFromWishlist);
router.get('/check/:courseId', protect, checkWishlist);

module.exports = router;
