const Review = require('../models/Review');
const Course = require('../models/Course');

// @desc    Get reviews for a course
// @route   GET /api/courses/:courseId/reviews
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Add review
// @route   POST /api/courses/:courseId/reviews
// @access  Private
exports.addReview = async (req, res) => {
  try {
    req.body.course = req.params.courseId;
    req.body.user = req.user.id;

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });

    // Ensure user hasn't already reviewed
    const existingReview = await Review.findOne({ course: req.params.courseId, user: req.user.id });
    if (existingReview) {
      return res.status(400).json({ success: false, error: 'You have already reviewed this course' });
    }

    const review = await Review.create(req.body);

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' });

    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to update review' });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' });

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete review' });
    }

    await review.deleteOne();
    res.status(200).json({ success: true, data: {}, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
