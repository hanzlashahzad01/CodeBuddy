const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a playlist title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  thumbnail: {
    type: String,
    default: 'no-thumbnail.jpg'
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please specify a category']
  },
  tags: [String],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Reverse populate with virtuals for videos
playlistSchema.virtual('videos', {
  ref: 'Video',
  localField: '_id',
  foreignField: 'playlist',
  justOne: false
});

module.exports = mongoose.model('Playlist', playlistSchema);
