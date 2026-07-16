const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    
    res.status(200).json({
      success: true,
      count: user.wishlist.length,
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Add course to wishlist
// @route   POST /api/wishlist/:courseId
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    
    // Check if already in wishlist
    const user = await User.findById(req.user.id);
    if (user.wishlist.includes(courseId)) {
      return res.status(400).json({ success: false, error: 'Course already in wishlist' });
    }
    
    // Add to wishlist
    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { wishlist: courseId } },
      { new: true }
    );
    
    res.status(200).json({ success: true, message: 'Course added to wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Remove course from wishlist
// @route   DELETE /api/wishlist/:courseId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { wishlist: courseId } },
      { new: true }
    );
    
    res.status(200).json({ success: true, message: 'Course removed from wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Check if course is in wishlist
// @route   GET /api/wishlist/check/:courseId
// @access  Private
exports.checkWishlist = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const user = await User.findById(req.user.id);
    const isInWishlist = user.wishlist.includes(courseId);
    
    res.status(200).json({ success: true, isInWishlist });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
