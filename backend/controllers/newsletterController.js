const Newsletter = require('../models/Newsletter');
const { sendNewsletterConfirmation } = require('../utils/emailHelper');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.isActive) {
        return res.status(400).json({ success: false, error: 'You are already subscribed' });
      } else {
        // Reactivate subscription
        existing.isActive = true;
        await existing.save();
        sendNewsletterConfirmation(email);
        return res.status(200).json({ success: true, message: 'Subscription reactivated successfully' });
      }
    }

    // Create new subscription
    await Newsletter.create({ email });

    // Send confirmation email
    sendNewsletterConfirmation(email);

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Email already subscribed' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const newsletter = await Newsletter.findOne({ email });
    if (!newsletter) {
      return res.status(404).json({ success: false, error: 'Subscription not found' });
    }

    newsletter.isActive = false;
    await newsletter.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all subscribers (admin)
// @route   GET /api/newsletter
// @access  Private/Admin
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true }).sort({ subscribedAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
