const Course = require('../models/Course');

// @desc    Get all courses with filtering, sorting, pagination
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const { category, level, isPremium, sort, page, limit: limitParam } = req.query;

    // Build filter query
    const query = {};
    if (category) query.category = category;
    if (level) query.level = level;
    if (isPremium !== undefined) query.isPremium = isPremium === 'true';

    // Pagination
    const page_num = parseInt(page, 10) || 1;
    const limit = parseInt(limitParam, 10) || 10;
    const skip = (page_num - 1) * limit;

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { averageRating: -1 };
    else if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('instructor', 'name avatar');

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page_num,
      data: courses
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio')
      .populate('videos');

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.status(200).json({ success: true, data: course });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin
exports.createCourse = async (req, res) => {
  try {
    // Attach logged-in user as instructor if not provided
    if (!req.body.instructor) {
      req.body.instructor = req.user.id;
    }

    const course = await Course.create(req.body);

    res.status(201).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.status(200).json({ success: true, data: course });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.status(200).json({ success: true, data: {}, message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get 3 featured courses (highest rated)
// @route   GET /api/courses/featured
// @access  Public
exports.getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ averageRating: { $exists: true } })
      .sort({ averageRating: -1 })
      .limit(3)
      .populate('instructor', 'name avatar');

    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
