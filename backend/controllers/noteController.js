const Note = require('../models/Note');

// @desc    Get all notes
// @route   GET /api/notes
// @access  Public
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }).populate('instructor', 'name avatar');
    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Public
exports.getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('instructor', 'name avatar');
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }
    res.status(200).json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create a note
// @route   POST /api/notes
// @access  Private/Admin
exports.createNote = async (req, res) => {
  try {
    if (!req.body.instructor) {
      req.body.instructor = req.user.id;
    }
    const note = await Note.create(req.body);
    res.status(201).json({ success: true, data: note });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private/Admin
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }
    res.status(200).json({ success: true, data: note });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private/Admin
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }
    res.status(200).json({ success: true, data: {}, message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
