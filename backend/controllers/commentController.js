const Comment = require('../models/Comment');

// @desc    Get comments for a specific entity (course/playlist)
// @route   GET /api/comments
// @access  Public
exports.getComments = async (req, res) => {
  try {
    const { refType, refId } = req.query;

    if (!refType || !refId) {
      return res.status(400).json({ success: false, error: 'Please specify refType and refId' });
    }

    const comments = await Comment.find({ refType, refId })
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar');

    res.status(200).json({ success: true, count: comments.length, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Add a comment
// @route   POST /api/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text, refType, refId } = req.body;

    if (!text || !refType || !refId) {
      return res.status(400).json({ success: false, error: 'Please fill in all fields (text, refType, refId)' });
    }

    let comment = await Comment.create({
      user: req.user.id,
      text,
      refType,
      refId
    });

    // Populate user details before sending response
    comment = await comment.populate('user', 'name avatar');

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    // Check ownership or if user is admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();

    res.status(200).json({ success: true, data: {}, message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Like/Unlike a comment
// @route   PUT /api/comments/:id/like
// @access  Private
exports.toggleLikeComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    const likeIndex = comment.likes.indexOf(req.user.id);

    if (likeIndex === -1) {
      comment.likes.push(req.user.id);
    } else {
      comment.likes.splice(likeIndex, 1);
    }

    await comment.save();
    comment = await comment.populate('user', 'name avatar');

    res.status(200).json({ success: true, data: comment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
