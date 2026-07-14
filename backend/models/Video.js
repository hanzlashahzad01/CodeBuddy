const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a video title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: false
  },
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist',
    required: false
  },
  videoUrl: {
    type: String,
    required: [true, 'Please add a video URL']
  },
  thumbnailUrl: {
    type: String,
    default: 'no-thumbnail.jpg'
  },
  duration: {
    type: String,
    default: '0:00'
  },
  isFreePreview: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Video', videoSchema);
