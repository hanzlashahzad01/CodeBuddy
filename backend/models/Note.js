const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a note title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  fileUrl: {
    type: String,
    required: [true, 'Please add a file URL']
  },
  thumbnailUrl: {
    type: String,
    default: 'no-thumbnail.jpg'
  },
  format: {
    type: String,
    default: 'PDF'
  },
  size: {
    type: String,
    default: '0.0 MB'
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  downloads: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);
