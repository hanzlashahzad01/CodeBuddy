const express = require('express');
const router = express.Router();
const { getLiveClasses, createLiveClass, deleteLiveClass } = require('../controllers/liveClassController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect); // All live class endpoints require authentication

router.get('/', getLiveClasses);
router.post('/', authorize('admin'), createLiveClass);
router.delete('/:id', authorize('admin'), deleteLiveClass);

module.exports = router;
