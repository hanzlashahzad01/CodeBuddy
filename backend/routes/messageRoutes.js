const express = require('express');
const router = express.Router();
const {
  submitMessage,
  getMessages,
  markRead,
  replyMessage
} = require('../controllers/messageController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route - anyone can submit a contact message
router.post('/', submitMessage);

// Admin only routes
router.get('/', protect, authorize('admin'), getMessages);
router.put('/:id/read', protect, authorize('admin'), markRead);
router.put('/:id/reply', protect, authorize('admin'), replyMessage);
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const Message = require('../models/Message');
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ success: false, error: 'Message not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
