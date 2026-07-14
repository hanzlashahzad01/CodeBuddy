const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getFeaturedCourses
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Include other resource routers
const reviewRouter = require('./reviewRoutes');

// Re-route into other resource routers
router.use('/:courseId/reviews', reviewRouter);

// Public routes
router.get('/featured', getFeaturedCourses);
router.get('/', getCourses);
router.get('/:id', getCourse);

// Admin only routes
router.post('/', protect, authorize('admin'), createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);

module.exports = router;
