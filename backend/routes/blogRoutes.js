const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getBlogs);
router.get('/:idOrSlug', getBlog);

// Admin only routes
router.post('/', protect, authorize('admin'), createBlog);
router.put('/:id', protect, authorize('admin'), updateBlog);
router.delete('/:id', protect, authorize('admin'), deleteBlog);

module.exports = router;
