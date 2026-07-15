const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a live class title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  scheduledAt: {
    type: Date,
    required: [true, 'Please specify scheduled date and time']
  },
  joinUrl: {
    type: String,
    required: [true, 'Please provide the join meeting URL']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LiveClass', liveClassSchema);
