import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Award, Brain, CheckCircle, XCircle, ArrowRight, RefreshCw, Star, Info } from 'lucide-react';

const QuizWidget = ({ playlistId, playlistTitle, studentName, onQuizPassed }) => {
  const { user } = useSelector((state) => state.auth);
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedIndex }
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null); // { score, passed, correctCount, totalQuestions }
  const [submitting, setSubmitting] = useState(false);

  const fetchQuiz = async () => {
    try {
      const { data } = await axios.get(`/api/quizzes/playlist/${playlistId}`);
      if (data.success) {
        setQuiz(data.data);
      }
    } catch (err) {
      // Quiet fail if 404
      console.log('No quiz found for this playlist');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuiz();
  }, [playlistId]);

  const selectOption = (questionId, optionIdx) => {
    setAnswers({
      ...answers,
      [questionId]: optionIdx
    });
  };

  const handleNext = () => {
    if (quiz && currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    
    // Check if all questions are answered
    const unansweredCount = quiz.questions.length - Object.keys(answers).length;
    if (unansweredCount > 0) {
      if (!window.confirm(`You have ${unansweredCount} unanswered questions. Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `/api/quizzes/${quiz._id}/submit`,
        { answers },
        { withCredentials: true }
      );
      if (data.success) {
        setResult(data.data);
        setSubmitted(true);
        if (data.data.passed && onQuizPassed) {
          onQuizPassed();
        }
      }
    } catch (err) {
      console.error('Quiz submission error', err);
      alert('Error submitting quiz answers. Please try again.');
    }
    setSubmitting(false);
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentIdx(0);
    setSubmitted(false);
    setResult(null);
    setStarted(false);
  };

  if (loading) return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 text-center animate-pulse">
      <div className="h-6 bg-slate-700/50 rounded w-1/3 mx-auto mb-3" />
      <div className="h-4 bg-slate-700/30 rounded w-1/2 mx-auto" />
    </div>
  );

  if (!quiz) return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 text-center">
      <div className="flex items-center justify-center gap-2 text-[var(--color-text-muted)] text-sm font-semibold">
        <Info className="w-4 h-4 text-sky-500" />
        <span>No assessment required for this playlist. Complete all lectures to claim certificate.</span>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-8 text-center shadow-lg">
        <Brain className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">Final Course Assessment</h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-6 max-w-sm mx-auto">
          Please log in to your student account to take the final playlist quiz and unlock your certificate.
        </p>
        <Link to="/login" className="inline-block px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl transition-all shadow-md">
          Login to Student Account 🔑
        </Link>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / quiz.questions.length) * 100);

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300">
      
      {/* 1. Start Screen */}
      {!started && !submitted && (
        <div className="text-center">
          <Brain className="w-14 h-14 text-indigo-500 mx-auto mb-4 drop-shadow" />
          <h3 className="text-2xl font-black text-[var(--color-text-main)] mb-2">Quiz Assessment: {quiz.title}</h3>
          <p className="text-[var(--color-text-muted)] text-sm mb-6 max-w-md mx-auto leading-relaxed">
            Test your knowledge! Get at least <span className="font-extrabold text-[var(--color-text-main)]">70%</span> on this assessment to prove your skills and download the verified CodeBuddy certificate.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black rounded-2xl transition-all shadow-lg text-base cursor-pointer"
          >
            Start Assessment 🚀
          </button>
        </div>
      )}

      {/* 2. Interactive Questions Screen */}
      {started && !submitted && currentQuestion && (
        <div className="space-y-6">
          {/* Header Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              <span>Question {currentIdx + 1} of {quiz.questions.length}</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="w-full h-1.5 bg-[var(--color-bg)] rounded-full overflow-hidden border border-[var(--color-border)]">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <h4 className="text-lg sm:text-xl font-bold text-[var(--color-text-main)] leading-snug">
            {currentQuestion.questionText}
          </h4>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3.5">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = answers[currentQuestion._id] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => selectOption(currentQuestion._id, optIdx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-base font-semibold cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-text-main)] shadow-sm'
                      : 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-black flex-shrink-0 ${
                      isSelected
                        ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                        : 'border-[var(--color-border)] text-[var(--color-text-muted)]'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Nav buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)] gap-4">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="px-5 py-2.5 border border-[var(--color-border)] rounded-xl font-bold text-sm text-[var(--color-text-muted)] hover:border-[var(--color-text-main)] disabled:opacity-40 transition-colors cursor-pointer"
            >
              Previous
            </button>
            
            {currentIdx < quiz.questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={answers[currentQuestion._id] === undefined}
                className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl text-sm transition-all flex items-center gap-1.5 shadow disabled:opacity-50 cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz 📋'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Results Screen */}
      {submitted && result && (
        <div className="text-center space-y-6">
          {result.passed ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h3 className="text-3xl font-black text-[var(--color-text-main)]">Congratulations! 🎉</h3>
              <p className="text-sm text-[var(--color-text-muted)] max-w-sm mx-auto leading-relaxed">
                Excellent work, <span className="font-extrabold text-[var(--color-text-main)]">{studentName}</span>! You scored <span className="text-emerald-500 font-black">{result.score}%</span> on the final assessment and successfully unlocked your course completion certificate.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto shadow-sm">
                <XCircle className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-black text-[var(--color-text-main)]">Keep Learning! 💪</h3>
              <p className="text-sm text-[var(--color-text-muted)] max-w-sm mx-auto leading-relaxed">
                You scored <span className="text-red-500 font-bold">{result.score}%</span>. The passing score threshold is <span className="font-bold text-[var(--color-text-main)]">70%</span>. Re-watch the lectures and try again!
              </p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto bg-[var(--color-bg)] border border-[var(--color-border)] p-4 rounded-2xl shadow-inner text-sm font-semibold">
            <div>
              <p className="text-[var(--color-text-muted)]">Your Score</p>
              <p className={`text-xl font-black mt-0.5 ${result.passed ? 'text-emerald-500' : 'text-red-500'}`}>{result.score}%</p>
            </div>
            <div>
              <p className="text-[var(--color-text-muted)]">Correct Answers</p>
              <p className="text-xl font-black mt-0.5 text-[var(--color-text-main)]">{result.correctCount} / {result.totalQuestions}</p>
            </div>
          </div>

          <div className="flex gap-4 max-w-xs mx-auto">
            <button
              onClick={resetQuiz}
              className="flex-1 py-3 bg-[var(--color-bg)] hover:bg-[var(--color-card)] text-[var(--color-text-muted)] font-bold rounded-xl border border-[var(--color-border)] text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default QuizWidget;
