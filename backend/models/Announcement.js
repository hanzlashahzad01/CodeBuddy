const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an announcement title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please add announcement content']
  },
  tag: {
    type: String,
    enum: ['Urgent', 'Update', 'New Course', 'General'],
    default: 'General'
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);
