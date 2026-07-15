const LiveClass = require('../models/LiveClass');

// @desc    Get all scheduled live classes
// @route   GET /api/live-classes
// @access  Private
exports.getLiveClasses = async (req, res) => {
  try {
    // Only fetch classes scheduled in the future or not older than 3 hours
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    
    const liveClasses = await LiveClass.find({
      scheduledAt: { $gte: threeHoursAgo }
    })
      .sort({ scheduledAt: 1 })
      .populate('instructor', 'name');

    res.status(200).json({ success: true, count: liveClasses.length, data: liveClasses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Schedule live class
// @route   POST /api/live-classes
// @access  Private/Admin
exports.createLiveClass = async (req, res) => {
  try {
    const { title, description, scheduledAt, joinUrl } = req.body;
    if (!title || !description || !scheduledAt || !joinUrl) {
      return res.status(400).json({ success: false, error: 'Please fill in all scheduled fields' });
    }

    const liveClass = await LiveClass.create({
      title,
      description,
      scheduledAt,
      joinUrl,
      instructor: req.user.id
    });

    res.status(201).json({ success: true, data: liveClass });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete scheduled live class
// @route   DELETE /api/live-classes/:id
// @access  Private/Admin
exports.deleteLiveClass = async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) {
      return res.status(404).json({ success: false, error: 'Scheduled class not found' });
    }

    await liveClass.deleteOne();
    res.status(200).json({ success: true, data: {}, message: 'Scheduled live class deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
