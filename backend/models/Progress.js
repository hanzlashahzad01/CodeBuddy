const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist',
    required: true
  },
  watchedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Ensure compound index for unique user-playlist progress tracking
progressSchema.index({ user: 1, playlist: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
