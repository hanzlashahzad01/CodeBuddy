const Course = require('../models/Course');
const Video = require('../models/Video');
const Blog = require('../models/Blog');

// @desc    Global Search across Courses, Videos, and Blogs
// @route   GET /api/search
// @access  Public
exports.globalSearch = async (req, res) => {
  try {
    const { q, type } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, error: 'Please provide a search term' });
    }

    // Prepare regex for case-insensitive search
    const searchRegex = new RegExp(q, 'i');

    let results = {};

    // Search Courses
    if (!type || type === 'course') {
      results.courses = await Course.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex }
        ]
      })
      .select('title description thumbnail price level category slug')
      .limit(10);
    }

    // Search Videos
    if (!type || type === 'video') {
      results.videos = await Video.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex }
        ],
        isPublic: true // Only return public videos in search unless they are bought (for simplicity public)
      })
      .select('title description thumbnail duration')
      .limit(10);
    }

    // Search Blogs
    if (!type || type === 'blog') {
      results.blogs = await Blog.find({
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { tags: searchRegex }
        ],
        isPublished: true
      })
      .select('title excerpt coverImage slug createdAt')
      .limit(10);
    }

    // Count total results
    const totalResults = (results.courses ? results.courses.length : 0) +
                         (results.videos ? results.videos.length : 0) +
                         (results.blogs ? results.blogs.length : 0);

    res.status(200).json({
      success: true,
      totalResults,
      data: results
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
