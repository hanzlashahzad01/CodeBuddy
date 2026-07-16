import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, Trash2, PlayCircle, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const Wishlist = () => {
  const { user } = useSelector((state) => state.auth);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get('/api/wishlist', { withCredentials: true });
      if (data.success) {
        setWishlist(data.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (courseId) => {
    setRemoving(courseId);
    try {
      await axios.delete(`/api/wishlist/${courseId}`, { withCredentials: true });
      setWishlist(wishlist.filter(course => course._id !== courseId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove course from wishlist');
    } finally {
      setRemoving(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg)] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-20 h-20 text-[var(--color-primary)] mx-auto mb-6 opacity-50" />
          <h1 className="text-3xl font-black text-[var(--text-main)] mb-4">Please Login</h1>
          <p className="text-[var(--text-muted)] mb-8">You need to login to view your wishlist.</p>
          <Link to="/login" className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg">
            Login to Account
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-xl">
              <Heart className="w-7 h-7 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-[var(--text-main)]">My Wishlist</h1>
              <p className="text-[var(--text-muted)]">{wishlist.length} courses saved</p>
            </div>
          </div>
        </motion.div>

        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-12 text-center"
          >
            <Heart className="w-20 h-20 text-[var(--color-primary)] mx-auto mb-6 opacity-30" />
            <h2 className="text-2xl font-bold text-[var(--text-main)] mb-4">Your wishlist is empty</h2>
            <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">
              Save courses you're interested in by clicking the heart icon on any course page.
            </p>
            <Link to="/courses" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg">
              <span>Browse Courses</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {wishlist.map((course, index) => {
              const imgSrc = course.image && course.image !== 'no-photo.jpg'
                ? (course.image.startsWith('http') ? course.image : null)
                : null;
              const isPurchased = user.purchasedCourses?.includes(course._id);
              const priceLabel = course.price === 0 ? 'Free' : `PKR ${course.price.toLocaleString()}`;
              const originalPriceLabel = course.discount > 0 ? `PKR ${(course.price + course.discount).toLocaleString()}` : '';

              return (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Course Image */}
                    <div className="w-full md:w-48 h-32 md:h-auto bg-slate-800 flex-shrink-0 relative">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={course.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-lg font-black">
                          <BookOpen className="w-8 h-8 opacity-40" />
                        </div>
                      )}
                      {isPurchased && (
                        <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-black px-2 py-1 rounded-full">
                          PURCHASED
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-[var(--text-main)] line-clamp-2 leading-tight">
                              {course.title}
                            </h3>
                            <p className="text-sm text-[var(--text-muted)] mt-1">{course.category}</p>
                          </div>
                          <button
                            onClick={() => removeFromWishlist(course._id)}
                            disabled={removing === course._id}
                            className="flex-shrink-0 p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {removing === course._id ? (
                              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)] mb-4">
                          <span className="flex items-center gap-1">
                            <PlayCircle className="w-4 h-4" />
                            {course.totalLectures || 0} lectures
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration || '0h'}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            {course.averageRating?.toFixed(1) || '4.5'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                        <div>
                          <span className="text-2xl font-black text-[var(--text-main)]">{priceLabel}</span>
                          {originalPriceLabel && (
                            <span className="ml-2 text-[var(--text-muted)] line-through text-sm">{originalPriceLabel}</span>
                          )}
                        </div>
                        {isPurchased ? (
                          <Link
                            to={`/courses/${course._id}`}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <PlayCircle className="w-4 h-4 fill-white" />
                            <span>Watch Now</span>
                          </Link>
                        ) : (
                          <Link
                            to={`/checkout/${course._id}`}
                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <span>Enroll Now</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
