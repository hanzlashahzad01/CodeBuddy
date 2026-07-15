import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { MessageSquare, Trash2, Heart, Send, Sparkles } from 'lucide-react';

const CommentSection = ({ refType, refId }) => {
  const { user } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/comments?refType=${refType}&refId=${refId}`);
      if (data.success) {
        setComments(data.data);
      }
    } catch (err) {
      console.error('Error fetching comments', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [refType, refId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    if (!user) {
      alert('Please login to join the discussion!');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post(
        '/api/comments',
        { text: newComment, refType, refId },
        { withCredentials: true }
      );
      if (data.success) {
        setComments([data.data, ...comments]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Error posting comment', err);
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment permanently?')) return;
    try {
      const { data } = await axios.delete(`/api/comments/${commentId}`, { withCredentials: true });
      if (data.success) {
        setComments(comments.filter((c) => c._id !== commentId));
      }
    } catch (err) {
      console.error('Error deleting comment', err);
    }
  };

  const handleLike = async (commentId) => {
    if (!user) {
      alert('Please login to like comments!');
      return;
    }
    try {
      const { data } = await axios.put(`/api/comments/${commentId}/like`, {}, { withCredentials: true });
      if (data.success) {
        setComments(comments.map((c) => (c._id === commentId ? data.data : c)));
      }
    } catch (err) {
      console.error('Error liking comment', err);
    }
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-xl mt-12 transition-all duration-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-[var(--color-text-main)]">Discussion & Q&A</h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Ask questions or share your thoughts</p>
        </div>
      </div>

      {/* Input Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow">
              {getUserInitials(user.name)}
            </div>
            <div className="flex-grow min-w-0">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your question or comment here..."
                rows={3}
                className="w-full px-5 py-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-main)] text-base focus:outline-none focus:border-[var(--color-primary)] transition-all resize-none shadow-inner"
                maxLength={1000}
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 text-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl p-6 text-center">
          <p className="text-[var(--color-text-muted)] font-medium mb-4">Please log in to join the Q&A session.</p>
          <a
            href="/login"
            className="inline-block px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow"
          >
            Login / Register 🔑
          </a>
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-700/50 flex-shrink-0" />
                <div className="flex-grow space-y-2">
                  <div className="h-4 bg-slate-700/50 rounded w-1/4" />
                  <div className="h-4 bg-slate-700/30 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 text-[var(--color-text-muted)] bg-[var(--color-bg)]/40 border border-dashed border-[var(--color-border)] rounded-2xl">
            <Sparkles className="w-8 h-8 mx-auto text-indigo-500/50 mb-3" />
            <p className="text-base font-semibold">No comments yet. Be the first to start the conversation!</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)] space-y-6">
            {comments.map((comment, index) => {
              const isOwner = user && (user.id === comment.user?._id || user.id === comment.user);
              const isAdmin = user && user.role === 'admin';
              const hasLiked = user && comment.likes?.includes(user.id);
              const commentUser = comment.user || {};

              return (
                <div key={comment._id} className={`flex gap-4 pt-6 ${index === 0 ? 'pt-0 border-t-0' : ''}`}>
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] font-black text-sm flex-shrink-0 shadow-inner">
                    {getUserInitials(commentUser.name)}
                  </div>

                  {/* Comment Body */}
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="font-bold text-[var(--color-text-main)] text-base mr-2">{commentUser.name || 'User'}</span>
                        <span className="text-xs text-[var(--color-text-muted)]">
                          {new Date(comment.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {(isOwner || isAdmin) && (
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors flex-shrink-0"
                          title="Delete Comment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-base text-[var(--color-text-muted)] mt-2 leading-relaxed whitespace-pre-wrap break-words">
                      {comment.text}
                    </p>

                    {/* Footer Actions */}
                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => handleLike(comment._id)}
                        className={`flex items-center gap-1.5 text-xs font-bold transition-all px-2.5 py-1 rounded-full border ${
                          hasLiked
                            ? 'bg-red-500/10 text-red-500 border-red-500/30'
                            : 'text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-red-500/30 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-red-500' : ''}`} />
                        <span>{comment.likes?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
