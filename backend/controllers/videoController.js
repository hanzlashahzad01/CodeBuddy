const Video = require('../models/Video');

// @desc    Get all videos with pagination, optional playlist/course filter
// @route   GET /api/videos
// @access  Public
exports.getVideos = async (req, res) => {
  try {
    const { course, playlist, page, limit: limitParam } = req.query;

    const query = {};
    if (course) query.course = course;
    if (playlist) query.playlist = playlist;

    const page_num = parseInt(page, 10) || 1;
    const limit = parseInt(limitParam, 10) || 10;
    const skip = (page_num - 1) * limit;

    const total = await Video.countDocuments(query);
    const videos = await Video.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('course', 'title');

    res.status(200).json({
      success: true,
      count: videos.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page_num,
      data: videos
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single video by ID
// @route   GET /api/videos/:id
// @access  Public
exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('course', 'title description');

    if (!video) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }

    res.status(200).json({ success: true, data: video });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create new video
// @route   POST /api/videos
// @access  Private/Admin
exports.createVideo = async (req, res) => {
  try {
    const video = await Video.create(req.body);

    res.status(201).json({ success: true, data: video });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private/Admin
exports.updateVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!video) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }

    res.status(200).json({ success: true, data: video });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private/Admin
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);

    if (!video) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }

    res.status(200).json({ success: true, data: {}, message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get 8 latest videos
// @route   GET /api/videos/latest
// @access  Public
exports.getLatestVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('course', 'title');

    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
