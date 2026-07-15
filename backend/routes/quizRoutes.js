const express = require('express');
const router = express.Router();
const { getQuizByPlaylist, submitQuizAttempt, upsertQuiz } = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route to fetch the quiz questions
router.get('/playlist/:playlistId', getQuizByPlaylist);

// Submit route requires login
router.post('/:id/submit', protect, submitQuizAttempt);

// Upserting quizzes requires admin permissions
router.post('/', protect, authorize('admin'), upsertQuiz);

module.exports = router;
