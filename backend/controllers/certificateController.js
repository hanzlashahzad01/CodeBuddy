const User = require('../models/User');
const Playlist = require('../models/Playlist');
const Progress = require('../models/Progress');

// @desc    Verify certificate
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
exports.verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    
    // Certificate ID format: CB-{userId}-{playlistId}-{timestamp}
    const parts = certificateId.split('-');
    
    if (parts.length < 4 || parts[0] !== 'CB') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid certificate ID format' 
      });
    }
    
    const userId = parts[1];
    const playlistId = parts[2];
    const timestamp = parts[3];
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    // Check if playlist exists
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ 
        success: false, 
        error: 'Course/Playlist not found' 
      });
    }
    
    // Check progress
    const progress = await Progress.findOne({
      user: userId,
      playlist: playlistId
    });
    
    if (!progress || progress.percentComplete < 100) {
      return res.status(400).json({ 
        success: false, 
        error: 'Certificate not valid - course not completed' 
      });
    }
    
    // Calculate issue date from timestamp
    const issueDate = new Date(parseInt(timestamp));
    
    res.status(200).json({
      success: true,
      data: {
        certificateId,
        studentName: user.name,
        courseName: playlist.title,
        issueDate: issueDate.toISOString(),
        isValid: true,
        verificationDate: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get user certificates
// @route   GET /api/certificates/my
// @access  Private
exports.getMyCertificates = async (req, res) => {
  try {
    const progressRecords = await Progress.find({
      user: req.user.id,
      percentComplete: 100
    }).populate('playlist', 'title category videoCount');
    
    const certificates = progressRecords.map((progress) => {
      const timestamp = Date.now();
      const certificateId = `CB-${req.user.id}-${progress.playlist._id}-${timestamp}`;
      
      return {
        certificateId,
        courseName: progress.playlist.title,
        category: progress.playlist.category,
        issueDate: new Date().toISOString(),
        playlistId: progress.playlist._id
      };
    });
    
    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
