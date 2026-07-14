const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  icon: {
    type: String,
    default: '📁'
  },
  color: {
    type: String,
    default: '#4F46E5',
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please add a valid hex color']
  },
  description: {
    type: String,
    maxlength: [300, 'Description cannot be more than 300 characters']
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Auto-generate slug from name before saving
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
