const express = require('express');
const router = express.Router();
const {
  getVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
  getLatestVideos
} = require('../controllers/videoController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/latest', getLatestVideos);
router.get('/', getVideos);
router.get('/:id', getVideo);

// Admin only routes
router.post('/', protect, authorize('admin'), createVideo);
router.put('/:id', protect, authorize('admin'), updateVideo);
router.delete('/:id', protect, authorize('admin'), deleteVideo);

module.exports = router;
