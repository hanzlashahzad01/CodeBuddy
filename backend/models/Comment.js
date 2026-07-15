const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Please add some text'],
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  refType: {
    type: String,
    required: true,
    enum: ['playlist', 'course']
  },
  refId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Refers dynamically based on refType
    refPath: 'refType'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);
