const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please add a question'],
    trim: true,
    maxlength: [300, 'Question cannot be more than 300 characters']
  },
  answer: {
    type: String,
    required: [true, 'Please add an answer'],
    maxlength: [2000, 'Answer cannot be more than 2000 characters']
  },
  category: {
    type: String,
    enum: ['General', 'Courses', 'Payment', 'Technical'],
    default: 'General'
  },
  order: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FAQ', faqSchema);
