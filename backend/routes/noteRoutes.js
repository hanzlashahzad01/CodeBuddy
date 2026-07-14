const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/noteController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getNotes);
router.get('/:id', getNote);

// Admin-only routes
router.post('/', protect, authorize('admin'), createNote);
router.put('/:id', protect, authorize('admin'), updateNote);
router.delete('/:id', protect, authorize('admin'), deleteNote);

module.exports = router;
