const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a quiz title'],
    trim: true
  },
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist',
    required: true,
    unique: true // One quiz per playlist
  },
  questions: [{
    questionText: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctOptionIndex: {
      type: Number,
      required: true,
      min: 0
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
