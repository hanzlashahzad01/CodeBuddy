import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Send, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const ReviewSection = ({ courseId }) => {
  const { user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [editing, setEditing] = useState(false);
  
  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/courses/${courseId}/reviews`);
      if (data.success) {
        setReviews(data.data);
        // Check if user has already reviewed
        if (user) {
          const myReview = data.data.find(r => r.user._id === user.id);
          if (myReview) {
            setUserReview(myReview);
            setRating(myReview.rating);
            setComment(myReview.comment);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      alert('Please provide both rating and comment');
      return;
    }

    setSubmitting(true);
    try {
      if (editing && userReview) {
        // Update existing review
        const { data } = await axios.put(`/api/reviews/${userReview._id}`, {
          rating,
          comment
        }, { withCredentials: true });
        if (data.success) {
          setReviews(reviews.map(r => r._id === data.data._id ? data.data : r));
          setUserReview(data.data);
          setEditing(false);
        }
      } else {
        // Create new review
        const { data } = await axios.post(`/api/courses/${courseId}/reviews`, {
          rating,
          comment
        }, { withCredentials: true });
        if (data.success) {
          setReviews([data.data, ...reviews]);
          setUserReview(data.data);
          setShowForm(false);
        }
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await axios.delete(`/api/reviews/${reviewId}`, { withCredentials: true });
      setReviews(reviews.filter(r => r._id !== reviewId));
      if (userReview && userReview._id === reviewId) {
        setUserReview(null);
        setRating(0);
        setComment('');
      }
    } catch (error) {
      alert('Failed to delete review');
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setShowForm(true);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0
  }));

  if (loading) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 animate-pulse">
        <div className="h-8 bg-slate-700/50 rounded w-1/3 mb-6" />
        <div className="h-4 bg-slate-700/30 rounded w-2/3 mb-4" />
        <div className="h-4 bg-slate-700/30 rounded w-1/2" />
      </div>
    );
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-[var(--border)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[var(--text-main)] mb-2">Student Reviews</h2>
            <p className="text-[var(--text-muted)]">See what our students are saying</p>
          </div>
          
          {/* Rating Summary */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-[var(--text-main)]">{averageRating}</div>
              <div className="flex text-yellow-500 justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'fill-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <div className="text-sm text-[var(--text-muted)] mt-1">{reviews.length} reviews</div>
            </div>
            
            {/* Rating Distribution */}
            <div className="hidden md:block space-y-2">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--text-muted)] w-3">{star}</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <div className="w-32 h-2 bg-[var(--bg)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-[var(--text-muted)] w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Review Button */}
      {user && !userReview && (
        <div className="p-6 border-b border-[var(--border)]">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Write a Review</span>
          </button>
        </div>
      )}

      {/* Review Form */}
      {(showForm || editing) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-6 border-b border-[var(--border)] bg-[var(--bg)]"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-bold text-[var(--text-muted)] mb-3">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-bold text-[var(--text-muted)] mb-3">Your Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this course..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{editing ? 'Update Review' : 'Submit Review'}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(false);
                  if (!userReview) {
                    setRating(0);
                    setComment('');
                  }
                }}
                className="px-6 py-3 bg-[var(--card)] border border-[var(--border)] text-[var(--text-muted)] font-bold rounded-xl hover:bg-[var(--bg)] transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* User's Review Display */}
      {userReview && !editing && (
        <div className="p-6 border-b border-[var(--border)] bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">YOUR REVIEW</span>
          </div>
          <div className="flex text-yellow-500 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= userReview.rating ? 'fill-yellow-500' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <p className="text-[var(--text-main)] mb-4">{userReview.comment}</p>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] text-[var(--text-muted)] text-sm font-bold rounded-lg hover:bg-[var(--bg)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => handleDelete(userReview._id)}
              className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="divide-y divide-[var(--border)]">
        {reviews.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
            <p className="text-[var(--text-muted)]">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="p-6 hover:bg-[var(--bg)] transition-colors">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-bold text-[var(--text-main)]">{review.user?.name || 'Anonymous'}</span>
                    <div className="flex text-yellow-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-[var(--text-muted)] leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
