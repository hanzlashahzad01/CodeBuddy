const express = require('express');
const router = express.Router();
const { getProgress, toggleWatchVideo } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All progress routes are private/protected

router.get('/:playlistId', getProgress);
router.post('/watch', toggleWatchVideo);

module.exports = router;
