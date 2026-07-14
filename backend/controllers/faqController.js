const FAQ = require('../models/FAQ');

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
exports.getFAQs = async (req, res) => {
  try {
    const query = req.query.isPublished === 'false' ? {} : { isPublished: true };
    const faqs = await FAQ.find(query).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: faqs.length, data: faqs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single FAQ
// @route   GET /api/faqs/:id
// @access  Public
exports.getFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ success: false, error: 'FAQ not found' });
    res.status(200).json({ success: true, data: faq });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create FAQ
// @route   POST /api/faqs
// @access  Private/Admin
exports.createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faq) return res.status(404).json({ success: false, error: 'FAQ not found' });
    res.status(200).json({ success: true, data: faq });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
exports.deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ success: false, error: 'FAQ not found' });
    res.status(200).json({ success: true, data: {}, message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
