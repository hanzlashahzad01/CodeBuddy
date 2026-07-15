import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, Play, ArrowRight, BookOpen, Code, Download, MessageSquare, X } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import AnimatedCounter from '../components/AnimatedCounter';

const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) 
    ? `https://www.youtube.com/embed/${match[2]}` 
    : url;
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const categories = [
  { name: 'HTML & CSS',   slug: 'html-css',   icon: '🎨', color: '#E34F26', bg: '#E34F2620', hasContent: true  },
  { name: 'JavaScript',  slug: 'javascript',  icon: '🟨', color: '#F7DF1E', bg: '#F7DF1E20', hasContent: true  },
  { name: 'Projects',    slug: 'projects',    icon: '🚀', color: '#8B5CF6', bg: '#8B5CF620', hasContent: true  },
  { name: 'React',       slug: 'react',       icon: '⚛️', color: '#61DAFB', bg: '#61DAFB20', hasContent: false },
  { name: 'Node.js',     slug: 'nodejs',      icon: '🟩', color: '#68A063', bg: '#68A06320', hasContent: false },
  { name: 'Python',      slug: 'python',      icon: '🐍', color: '#3776AB', bg: '#3776AB20', hasContent: false },
  { name: 'Laravel',     slug: 'laravel',     icon: '🔴', color: '#FF2D20', bg: '#FF2D2020', hasContent: false },
  { name: 'PHP',         slug: 'php',         icon: '🐘', color: '#777BB4', bg: '#777BB420', hasContent: false },
  { name: 'SQL & Database', slug: 'sql',      icon: '🛢️', color: '#00758F', bg: '#00758F20', hasContent: false },
  { name: 'Git & GitHub',slug: 'git-github',  icon: '🐙', color: '#F05032', bg: '#F0503220', hasContent: false },
];

const reviews = [
  { name: 'Ahmad Raza', role: 'Frontend Developer', rating: 5, text: 'CodeBuddy has completely transformed my coding journey! The explanations are crystal clear and the projects are real-world. Highly recommend to every aspiring developer in Pakistan!', initials: 'AR' },
  { name: 'Sara Khan', role: 'Computer Science Student', rating: 5, text: 'I was struggling with JavaScript for months. After just 3 weeks on CodeBuddy, I built my first full-stack app. The Urdu/Hindi explanations make everything so much easier!', initials: 'SK' },
  { name: 'Bilal Hassan', role: 'Freelancer', rating: 5, text: 'Got my first Upwork contract worth $500 after completing the Node.js course. The practical approach and portfolio projects are exactly what clients look for!', initials: 'BH' },
];

const stats = [
  { label: 'Active Students', value: '50,000+', icon: <Users className="w-7 h-7" /> },
  { label: 'Free Videos', value: '200+', icon: <Play className="w-7 h-7" /> },
  { label: 'Premium Courses', value: '50+', icon: <BookOpen className="w-7 h-7" /> },
  { label: 'Average Rating', value: '4.9 ★', icon: <Star className="w-7 h-7" /> },
];

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 5000);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, videosRes] = await Promise.all([
          axios.get('/api/courses'),
          axios.get('/api/videos/latest')
        ]);
        if (coursesRes.data.success) {
          setCourses(coursesRes.data.data.slice(0, 3));
        }
        if (videosRes.data.success) {
          setTutorials(videosRes.data.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching home data:', err.message);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[var(--bg)] transition-colors duration-300">

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.span variants={fadeUp} className="inline-block text-sm font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-5 py-2 rounded-full mb-8">
              🚀 Pakistan's #1 Coding Platform
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-3xl sm:text-6xl md:text-8xl font-black text-[var(--text-main)] mb-6 sm:mb-8 leading-[1.05] tracking-tight">
              Learn to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500">
                Code
              </span>{' '}
              with CodeBuddy
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-2xl text-[var(--text-muted)] max-w-3xl mx-auto mb-12 leading-relaxed">
              Free YouTube tutorials, premium courses, downloadable notes, and a thriving community — all in one place. Sikhein, Barhen, Kamayein! 🇵🇰
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link to="/courses" className="px-6 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg sm:text-xl font-bold rounded-2xl shadow-2xl shadow-indigo-500/30 transition-all hover:scale-105">
                Explore Courses
              </Link>
              <Link to="/playlists" className="px-6 py-4 sm:px-10 sm:py-5 bg-[var(--card)] border-2 border-[var(--border)] hover:border-[var(--color-primary)] text-[var(--text-main)] text-lg sm:text-xl font-bold rounded-2xl transition-all hover:scale-105">
                🎬 Watch Free Playlists
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="bg-[var(--card)] border-y border-[var(--border)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center text-center sm:text-left">
                <div className="text-[var(--color-primary)] flex-shrink-0">{stat.icon}</div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[var(--text-main)]">
                    <AnimatedCounter target={stat.value} />
                  </div>
                  <div className="text-xs sm:text-base text-[var(--text-muted)] font-semibold leading-tight">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED COURSES ─── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <div className="flex justify-between items-end mb-10 sm:mb-14">
            <div>
              <span className="text-sm sm:text-base font-bold uppercase tracking-widest text-[var(--color-primary)]">Premium Courses</span>
              <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-main)] mt-2">Bestselling Courses</h2>
            </div>
            <Link to="/courses" className="hidden md:flex items-center gap-2 text-[var(--color-primary)] font-bold text-lg hover:underline">
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          {loading ? (
            <p className="text-[var(--text-muted)] text-lg">Loading premium courses...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {courses.map((course, index) => {
                const gradient = index % 3 === 0 ? 'from-blue-600 to-indigo-700' : index % 3 === 1 ? 'from-green-600 to-teal-700' : 'from-purple-600 to-pink-700';
                const priceLabel = course.price === 0 ? 'Free' : `PKR ${course.price.toLocaleString()}`;
                const originalPriceLabel = course.discount > 0 ? `PKR ${(course.price + course.discount).toLocaleString()}` : '';
                const imgSrc = course.image && course.image !== 'no-photo.jpg'
                  ? (course.image.startsWith('http') ? course.image : null)
                  : null;
                return (
                  <motion.div key={course._id} variants={fadeUp}>
                    <Link to={`/courses/${course._id}`} className="block bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                      <div className="h-52 relative flex items-center justify-center overflow-hidden bg-slate-800">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                            <Code className="w-16 h-16 text-white/30 group-hover:text-white/50 transition-colors" />
                          </div>
                        )}
                        {course.isPremium && (
                          <span className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-black px-3 py-1 rounded-full">PREMIUM</span>
                        )}
                      </div>
                      <div className="p-7">
                        <h3 className="text-2xl font-bold text-[var(--text-main)] mb-3 leading-tight line-clamp-2">{course.title}</h3>
                        <p className="text-[var(--text-muted)] font-medium mb-4">By {course.instructor?.name || 'CodeBuddy'}</p>
                        <div className="flex items-center gap-3 mb-5">
                          <div className="flex text-yellow-500">{'★'.repeat(Math.floor(course.averageRating || 5))}</div>
                          <span className="text-[var(--text-muted)] text-sm font-semibold">({course.totalLectures || 0} lectures)</span>
                        </div>
                        <div className="flex items-center justify-between pt-5 border-t border-[var(--border)]">
                          <div>
                            <span className="text-3xl font-black text-[var(--text-main)]">{priceLabel}</span>
                            {originalPriceLabel && (
                              <span className="ml-2 text-[var(--text-muted)] line-through text-sm">{originalPriceLabel}</span>
                            )}
                          </div>
                          <span className="text-sm font-bold text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-3 py-1 rounded-full">{course.level || 'All Levels'}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
              {courses.length === 0 && (
                <div className="col-span-full text-center py-8 text-[var(--text-muted)]">No premium courses uploaded yet.</div>
              )}
            </div>
          )}
          {courses.length > 0 && (
            <div className="mt-8 text-center md:hidden">
              <Link to="/courses" className="inline-flex items-center gap-2 text-[var(--color-primary)] font-bold text-base hover:underline">
                View All Courses <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.div>
      </section>

      {/* ─── LATEST FREE TUTORIALS ─── */}
      <section className="py-16 sm:py-24 bg-[var(--card)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <div className="flex justify-between items-end mb-10 sm:mb-14">
              <div>
                <span className="text-sm sm:text-base font-bold uppercase tracking-widest text-[var(--color-primary)]">Free Tutorials</span>
                <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-main)] mt-2">Latest Free Coding Videos</h2>
              </div>
              <Link to="/playlists" className="hidden md:flex items-center gap-2 text-[var(--color-primary)] font-bold text-lg hover:underline">
                View All <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            {loading ? (
              <p className="text-[var(--text-muted)] text-lg">Loading free tutorials...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {tutorials.map((t) => {
                  const tThumb = t.thumbnailUrl && t.thumbnailUrl.startsWith('http') ? t.thumbnailUrl : null;
                  return (
                    <motion.div key={t._id} variants={fadeUp} onClick={() => setActiveVideo(t)} className="cursor-pointer">
                      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col">
                        <div className="aspect-[16/9] w-full bg-slate-800 relative overflow-hidden flex-shrink-0">
                          {tThumb ? (
                            <img
                              src={tThumb}
                              alt={t.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                              <Play className="w-10 h-10 text-white/40" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-xl">
                              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                            </div>
                          </div>
                          {t.duration && (
                            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-bold px-2 py-0.5 rounded z-10">{t.duration}</span>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="text-sm font-bold text-[var(--text-main)] line-clamp-2 leading-snug mb-2 flex-grow">{t.title}</h3>
                          <p className="text-[var(--text-muted)] text-xs font-semibold">Free Tutorial</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {tutorials.length === 0 && (
                  <div className="col-span-full text-center py-8 text-[var(--text-muted)]">No tutorials uploaded yet.</div>
                )}
              </div>
            )}
            {tutorials.length > 0 && (
              <div className="mt-8 text-center md:hidden">
                <Link to="/playlists" className="inline-flex items-center gap-2 text-[var(--color-primary)] font-bold text-base hover:underline">
                  View All Videos <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-sm sm:text-base font-bold uppercase tracking-widest text-[var(--color-primary)]">Topics</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-main)] mt-2">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Link
                  to={`/category/${cat.slug}`}
                  className="relative flex flex-col items-center justify-center p-4 sm:p-7 rounded-2xl border hover:shadow-xl transition-all duration-300 group cursor-pointer min-h-[120px] sm:min-h-[150px]"
                  style={{ background: cat.bg, borderColor: `${cat.color}30` }}
                >
                  {/* Coming Soon badge */}
                  {!cat.hasContent && (
                    <span className="absolute top-1.5 right-1.5 text-[8px] sm:text-[10px] font-black uppercase tracking-wider bg-black/20 text-white px-1.5 py-0.5 rounded-full">
                      Soon
                    </span>
                  )}
                  <span className="text-3xl sm:text-5xl mb-2 sm:mb-3">{cat.icon}</span>
                  <span className="text-xs sm:text-base font-bold text-center leading-tight" style={{ color: cat.color }}>{cat.name}</span>
                  {!cat.hasContent && (
                    <span className="text-[9px] sm:text-[10px] mt-1 font-semibold text-center" style={{ color: cat.color, opacity: 0.6 }}>Coming Soon</span>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── STUDENT REVIEWS ─── */}
      <section className="py-16 sm:py-24 bg-[var(--card)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-sm sm:text-base font-bold uppercase tracking-widest text-[var(--color-primary)]">Testimonials</span>
              <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-main)] mt-2">What Our Students Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {reviews.map((r, i) => (
                <motion.div key={i} variants={fadeUp} className="bg-[var(--bg)] border border-[var(--border)] rounded-3xl p-8 hover:shadow-2xl transition-all">
                  <div className="flex text-yellow-500 text-2xl mb-5">{'★'.repeat(r.rating)}</div>
                  <p className="text-[var(--text-muted)] text-lg leading-relaxed mb-8 italic">"{r.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl">
                      {r.initials}
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-main)] text-lg">{r.name}</div>
                      <div className="text-[var(--text-muted)] text-base">{r.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-800 rounded-3xl p-6 sm:p-10 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/30">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />
            <div className="relative z-10">
              <MessageSquare className="w-10 h-10 sm:w-14 sm:h-14 text-white/70 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-5">Stay in the Loop!</h2>
              <p className="text-base sm:text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">Get notified about new courses, free tutorials, coding tips, and exclusive discounts straight to your inbox.</p>
              {newsletterSubscribed ? (
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-white text-center font-bold max-w-lg mx-auto">
                  🎉 Thank you for subscribing! We'll keep you updated.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-200 text-lg focus:outline-none focus:border-white focus:bg-white/20 transition-all"
                  />
                  <button type="submit" className="px-8 py-4 bg-white text-indigo-700 font-black text-lg rounded-xl hover:bg-indigo-50 transition-all shadow-xl cursor-pointer">
                    Subscribe 🚀
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── VIDEO LIGHTBOX MODAL ─── */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setActiveVideo(null)}>
          <div className="bg-[var(--card)] border border-[var(--border)] max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveVideo(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--bg)] text-[var(--text-main)] z-10 cursor-pointer">
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src={getYoutubeEmbedUrl(activeVideo.videoUrl)}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[var(--text-main)] mb-2">{activeVideo.title}</h3>
              <p className="text-[var(--text-muted)] text-sm">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;

