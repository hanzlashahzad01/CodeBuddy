const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    maxlength: [150, 'Subject cannot be more than 150 characters']
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
    maxlength: [2000, 'Message cannot be more than 2000 characters']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  repliedAt: {
    type: Date
  },
  reply: {
    type: String,
    maxlength: [2000, 'Reply cannot be more than 2000 characters']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
