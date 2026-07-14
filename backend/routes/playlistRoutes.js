const express = require('express');
const router = express.Router();
const {
  getPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  syncPlaylists,
} = require('../controllers/playlistController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPlaylists);
router.get('/:id', getPlaylist);

// Admin only routes
router.post('/sync', protect, authorize('admin'), syncPlaylists);  // sync from YouTube
router.post('/', protect, authorize('admin'), createPlaylist);
router.put('/:id', protect, authorize('admin'), updatePlaylist);
router.delete('/:id', protect, authorize('admin'), deletePlaylist);

module.exports = router;
