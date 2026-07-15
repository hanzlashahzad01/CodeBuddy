const Course = require('../models/Course');
const Video = require('../models/Video');
const Blog = require('../models/Blog');

const normalizeType = (type) => {
  if (!type) return null;
  const map = {
    course: 'course',
    courses: 'course',
    video: 'video',
    videos: 'video',
    blog: 'blog',
    blogs: 'blog',
  };
  return map[type.toLowerCase()] || null;
};

// @desc    Global Search across Courses, Videos, and Blogs with Advanced Filters
// @route   GET /api/search?q=<term>&type=<courses|videos|blogs>&level=<level>&minPrice=<number>&maxPrice=<number>&category=<category>
// @access  Public
exports.globalSearch = async (req, res) => {
  try {
    const { q, level, minPrice, maxPrice, category } = req.query;
    const type = normalizeType(req.query.type);

    const searchRegex = q && q.trim() ? new RegExp(q.trim(), 'i') : null;
    const results = {};

    // ── Search Courses ──
    if (!type || type === 'course') {
      const courseQuery = {};
      
      if (searchRegex) {
        courseQuery.$or = [
          { title: searchRegex },
          { description: searchRegex },
          { tags: searchRegex },
        ];
      }

      // Filters
      if (level) courseQuery.level = level;
      if (category) courseQuery.category = new RegExp(category, 'i');
      if (minPrice || maxPrice) {
        courseQuery.price = {};
        if (minPrice) courseQuery.price.$gte = Number(minPrice);
        if (maxPrice) courseQuery.price.$lte = Number(maxPrice);
      }

      results.courses = await Course.find(courseQuery)
        .select('title description image price level category slug isPremium averageRating totalLectures')
        .limit(20);
    }

    // ── Search Videos ──
    if (!type || type === 'video') {
      const videoQuery = {};

      if (searchRegex) {
        videoQuery.$or = [
          { title: searchRegex },
          { description: searchRegex },
        ];
      }

      // Filter by category or level is less common for standalone videos,
      // but if category is passed, we check if it is part of tags or name
      if (category) {
        videoQuery.$or = videoQuery.$or || [];
        videoQuery.$or.push({ title: new RegExp(category, 'i') });
      }

      results.videos = await Video.find(videoQuery)
        .select('title description thumbnailUrl duration playlist course')
        .limit(20);
    }

    // ── Search Blogs ──
    if (!type || type === 'blog') {
      const blogQuery = { isPublished: true };

      if (searchRegex) {
        blogQuery.$or = [
          { title: searchRegex },
          { content: searchRegex },
          { tags: searchRegex },
        ];
      }

      if (category) {
        blogQuery.tags = new RegExp(category, 'i');
      }

      results.blogs = await Blog.find(blogQuery)
        .select('title excerpt coverImage slug createdAt')
        .limit(20);
    }

    // Count total results
    const totalResults =
      (results.courses ? results.courses.length : 0) +
      (results.videos ? results.videos.length : 0) +
      (results.blogs ? results.blogs.length : 0);

    return res.status(200).json({
      success: true,
      totalResults,
      data: results,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
