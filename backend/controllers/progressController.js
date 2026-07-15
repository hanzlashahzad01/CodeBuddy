const Progress = require('../models/Progress');
const Video = require('../models/Video');

// @desc    Get progress for a specific playlist
// @route   GET /api/progress/:playlistId
// @access  Private
exports.getProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({
      user: req.user.id,
      playlist: req.params.playlistId
    });

    if (!progress) {
      // Return empty progress structure instead of 404 to make frontend logic clean
      return res.status(200).json({
        success: true,
        data: {
          playlist: req.params.playlistId,
          watchedVideos: [],
          percentComplete: 0
        }
      });
    }

    // Get total video count in this playlist
    const totalVideos = await Video.countDocuments({ playlist: req.params.playlistId });
    const watchedCount = progress.watchedVideos.length;
    const percentComplete = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        ...progress.toObject(),
        percentComplete
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Mark a video as watched/unwatched
// @route   POST /api/progress/watch
// @access  Private
exports.toggleWatchVideo = async (req, res) => {
  try {
    const { playlistId, videoId, watched } = req.body;

    if (!playlistId || !videoId) {
      return res.status(400).json({ success: false, error: 'Please provide playlistId and videoId' });
    }

    let progress = await Progress.findOne({
      user: req.user.id,
      playlist: playlistId
    });

    if (!progress) {
      progress = new Progress({
        user: req.user.id,
        playlist: playlistId,
        watchedVideos: []
      });
    }

    const videoIndex = progress.watchedVideos.indexOf(videoId);

    if (watched) {
      if (videoIndex === -1) {
        progress.watchedVideos.push(videoId);
      }
    } else {
      if (videoIndex !== -1) {
        progress.watchedVideos.splice(videoIndex, 1);
      }
    }

    // Check if 100% complete
    const totalVideos = await Video.countDocuments({ playlist: playlistId });
    if (totalVideos > 0 && progress.watchedVideos.length === totalVideos) {
      progress.completedAt = progress.completedAt || new Date();
    } else {
      progress.completedAt = undefined;
    }

    await progress.save();

    const watchedCount = progress.watchedVideos.length;
    const percentComplete = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        ...progress.toObject(),
        percentComplete
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
