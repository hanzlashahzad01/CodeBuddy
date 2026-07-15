const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// @desc    Get quiz for a playlist
// @route   GET /api/quizzes/playlist/:playlistId
// @access  Public
exports.getQuizByPlaylist = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ playlist: req.params.playlistId });
    if (!quiz) {
      return res.status(404).json({ success: false, error: 'No assessment found for this playlist yet' });
    }
    // Omit correctOptionIndex from questions list sent to client for security
    const sanitizedQuestions = quiz.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options
    }));

    res.status(200).json({
      success: true,
      data: {
        _id: quiz._id,
        title: quiz.title,
        playlist: quiz.playlist,
        questions: sanitizedQuestions
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Submit quiz answers and score the attempt
// @route   POST /api/quizzes/:id/submit
// @access  Private
exports.submitQuizAttempt = async (req, res) => {
  try {
    const { answers } = req.body; // Map: { questionId: selectedOptionIndex }
    if (!answers) {
      return res.status(400).json({ success: false, error: 'Please provide answers to submit' });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, error: 'Quiz not found' });
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((q) => {
      const submittedAnswer = answers[q._id];
      if (submittedAnswer !== undefined && Number(submittedAnswer) === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = score >= 70; // 70% passing threshold

    const attempt = await QuizAttempt.create({
      user: req.user.id,
      quiz: quiz._id,
      score,
      passed
    });

    res.status(201).json({
      success: true,
      data: {
        score,
        correctCount,
        totalQuestions,
        passed,
        attemptId: attempt._id
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create/Update quiz for playlist
// @route   POST /api/quizzes
// @access  Private/Admin
exports.upsertQuiz = async (req, res) => {
  try {
    const { title, playlist, questions } = req.body;
    if (!title || !playlist || !questions || !questions.length) {
      return res.status(400).json({ success: false, error: 'Please provide title, playlist, and questions' });
    }

    let quiz = await Quiz.findOne({ playlist });
    if (quiz) {
      quiz.title = title;
      quiz.questions = questions;
      await quiz.save();
    } else {
      quiz = await Quiz.create({ title, playlist, questions });
    }

    res.status(200).json({ success: true, data: quiz });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
