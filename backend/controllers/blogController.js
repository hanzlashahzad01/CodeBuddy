const Blog = require('../models/Blog');

// Helper: generate slug from title
const generateSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// @desc    Get all published blogs with pagination
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res) => {
  try {
    const { category, tag, page, limit: limitParam } = req.query;

    const query = { isPublished: true };
    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag] };

    const page_num = parseInt(page, 10) || 1;
    const limit = parseInt(limitParam, 10) || 10;
    const skip = (page_num - 1) * limit;

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name avatar');

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page_num,
      data: blogs
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single blog by ID or slug, increment views
// @route   GET /api/blogs/:idOrSlug
// @access  Public
exports.getBlog = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    // Try ObjectId first, fall back to slug
    let blog;
    const isObjectId = /^[a-fA-F0-9]{24}$/.test(idOrSlug);

    if (isObjectId) {
      blog = await Blog.findById(idOrSlug).populate('author', 'name avatar bio');
    } else {
      blog = await Blog.findOne({ slug: idOrSlug }).populate('author', 'name avatar bio');
    }

    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create new blog (auto-generate slug)
// @route   POST /api/blogs
// @access  Private/Admin
exports.createBlog = async (req, res) => {
  try {
    // Auto-generate slug from title
    req.body.slug = generateSlug(req.body.title);

    // Attach logged-in user as author if not provided
    if (!req.body.author) {
      req.body.author = req.user.id;
    }

    const blog = await Blog.create(req.body);

    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
exports.updateBlog = async (req, res) => {
  try {
    // Re-generate slug if title is being updated
    if (req.body.title) {
      req.body.slug = generateSlug(req.body.title);
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }

    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }

    res.status(200).json({ success: true, data: {}, message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
