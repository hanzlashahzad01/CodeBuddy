const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment, toggleLikeComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Public route to view comments
router.get('/', getComments);

// Protected routes to write, delete or like comments
router.post('/', protect, addComment);
router.delete('/:id', protect, deleteComment);
router.put('/:id/like', protect, toggleLikeComment);

module.exports = router;
