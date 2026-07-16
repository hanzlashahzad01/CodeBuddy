const Message = require('../models/Message');
const { sendContactNotification } = require('../utils/emailHelper');

// @desc    Submit a contact form message (public)
// @route   POST /api/messages
// @access  Public
exports.submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = await Message.create({ name, email, subject, message });

    // Send email notification to admin
    sendContactNotification(name, email, subject, message);

    res.status(201).json({
      success: true,
      data: newMessage,
      message: 'Your message has been submitted successfully. We will get back to you soon!'
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all messages (admin)
// @route   GET /api/messages
// @access  Private/Admin
exports.getMessages = async (req, res) => {
  try {
    const { isRead, page, limit: limitParam } = req.query;

    const query = {};
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const page_num = parseInt(page, 10) || 1;
    const limit = parseInt(limitParam, 10) || 10;
    const skip = (page_num - 1) * limit;

    const total = await Message.countDocuments(query);
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page_num,
      data: messages
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
exports.markRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.status(200).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Reply to a message
// @route   PUT /api/messages/:id/reply
// @access  Private/Admin
exports.replyMessage = async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ success: false, error: 'Reply text is required' });
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        reply,
        repliedAt: new Date(),
        isRead: true
      },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.status(200).json({ success: true, data: message });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
