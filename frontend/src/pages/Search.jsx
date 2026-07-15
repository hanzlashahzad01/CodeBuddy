import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Video, FileText, Filter, SlidersHorizontal, X, Search as SearchIcon } from 'lucide-react';

const categoriesList = [
  'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'Laravel', 'MongoDB', 'Git & GitHub', 'Projects'
];

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState({ courses: [], videos: [], blogs: [] });
  const [loading, setLoading] = useState(false);
  
  // Filters State
  const [type, setType] = useState(searchParams.get('type') || '');
  const [level, setLevel] = useState(searchParams.get('level') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    try {
      let url = `/api/search?q=${encodeURIComponent(query)}`;
      if (type) url += `&type=${type}`;
      if (level) url += `&level=${level}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;

      const { data } = await axios.get(url);
      if (data.success) {
        setResults(data.data || { courses: [], videos: [], blogs: [] });
      }
    } catch (error) {
      console.error('Search request error', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
    // Update URL query params without reloading
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (type) params.set('type', type);
    if (level) params.set('level', level);
    if (category) params.set('category', category);
    if (maxPrice) params.set('maxPrice', maxPrice);
    navigate({ search: params.toString() }, { replace: true });
  }, [query, type, level, category, maxPrice]);

  const clearFilters = () => {
    setType('');
    setLevel('');
    setCategory('');
    setMaxPrice('');
  };

  const totalResultsCount =
    (results.courses?.length || 0) +
    (results.videos?.length || 0) +
    (results.blogs?.length || 0);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Search header & Bar */}
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black text-[var(--color-text-main)]">
            Explore CodeBuddy
          </h1>
          <form onSubmit={(e) => { e.preventDefault(); fetchResults(); }} className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lectures, code courses, blogs..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-main)] text-base sm:text-lg focus:outline-none focus:border-[var(--color-primary)] transition-all shadow-md"
            />
            <SearchIcon className="w-5 h-5 text-[var(--color-text-muted)] absolute left-4" />
          </form>
        </div>

        <div className="flex gap-8 items-start relative">
          
          {/* ── Desktop Filters Sidebar ── */}
          <aside className="hidden lg:block w-72 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6 sticky top-24">
            <div className="flex justify-between items-center pb-4 border-b border-[var(--color-border)]">
              <span className="font-extrabold text-[var(--color-text-main)] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[var(--color-primary)]" /> Advanced Filters
              </span>
              {(type || level || category || maxPrice) && (
                <button onClick={clearFilters} className="text-xs text-red-500 font-bold hover:underline cursor-pointer">Clear All</button>
              )}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Content Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-main)] text-sm font-semibold focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="">All Content</option>
                <option value="courses">Premium Courses</option>
                <option value="videos">Free Tutorials</option>
                <option value="blogs">Articles & Blogs</option>
              </select>
            </div>

            {/* Level */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Difficulty Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-main)] text-sm font-semibold focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Topic / Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-main)] text-sm font-semibold focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="">All Topics</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price Limit */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                <span>Max Price Limit</span>
                <span className="text-[var(--color-primary)] font-extrabold">{maxPrice ? `PKR ${Number(maxPrice).toLocaleString()}` : 'Any'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="500"
                value={maxPrice || 10000}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full accent-[var(--color-primary)] bg-[var(--color-bg)] h-2 rounded-lg cursor-pointer"
              />
            </div>
          </aside>

          {/* ── Mobile Filters Drawer Button ── */}
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer"
          >
            <Filter className="w-6 h-6" />
          </button>

          {/* ── Mobile Drawer Backdrop ── */}
          {filterDrawerOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              onClick={() => setFilterDrawerOpen(false)}
            />
          )}

          {/* ── Mobile Drawer Panel ── */}
          <aside className={`
            fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-card)] rounded-t-3xl border-t border-[var(--color-border)] p-6 space-y-6 transition-transform duration-300 lg:hidden max-h-[85vh] overflow-y-auto
            ${filterDrawerOpen ? 'translate-y-0' : 'translate-y-full'}
          `}>
            <div className="flex justify-between items-center pb-4 border-b border-[var(--color-border)]">
              <span className="font-extrabold text-[var(--color-text-main)] text-lg flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[var(--color-primary)]" /> Filters & Sorting
              </span>
              <button onClick={() => setFilterDrawerOpen(false)} className="p-1 rounded hover:bg-[var(--color-bg)] text-[var(--color-text-muted)] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Content Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-main)] focus:outline-none"
              >
                <option value="">All Content</option>
                <option value="courses">Premium Courses</option>
                <option value="videos">Free Tutorials</option>
                <option value="blogs">Articles & Blogs</option>
              </select>
            </div>

            {/* Level */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Difficulty Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-main)] focus:outline-none"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Topic / Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-main)] focus:outline-none"
              >
                <option value="">All Topics</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2 pb-4">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                <span>Max Price Limit</span>
                <span className="text-[var(--color-primary)] font-extrabold">{maxPrice ? `PKR ${Number(maxPrice).toLocaleString()}` : 'Any'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="500"
                value={maxPrice || 10000}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full accent-[var(--color-primary)] bg-[var(--color-bg)] h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 border border-[var(--color-border)] text-[var(--color-text-muted)] font-bold rounded-xl text-center cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="flex-1 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl text-center cursor-pointer"
              >
                Apply
              </button>
            </div>
          </aside>

          {/* ── Search Results Grid ── */}
          <div className="flex-grow space-y-12 min-w-0">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : totalResultsCount === 0 ? (
              <div className="text-center py-20 text-[var(--color-text-muted)] bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8">
                <p className="text-xl font-bold">No matching content found.</p>
                <p className="text-sm mt-2">Try different search tags, select another level, or clear filters.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Courses Grid */}
                {results.courses && results.courses.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-black flex items-center gap-2 text-[var(--color-text-main)] mb-6">
                      <BookOpen className="w-6 h-6 text-indigo-500" /> Premium Courses ({results.courses.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.courses.map((course) => {
                        const priceLabel = course.price === 0 ? 'Free' : `PKR ${course.price.toLocaleString()}`;
                        return (
                          <Link
                            to={`/courses/${course._id}`}
                            key={course._id}
                            className="bg-[var(--color-card)] rounded-2xl overflow-hidden shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-lg transition-all flex flex-col group"
                          >
                            <div className="aspect-[16/9] w-full bg-slate-800 relative overflow-hidden">
                              {course.image && (
                                <img
                                  src={course.image}
                                  alt={course.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              )}
                            </div>
                            <div className="p-5 flex-grow flex flex-col justify-between">
                              <div>
                                <h3 className="text-lg font-bold text-[var(--color-text-main)] line-clamp-2 leading-snug">{course.title}</h3>
                                <p className="text-xs text-[var(--color-text-muted)] mt-2 line-clamp-2">{course.description}</p>
                              </div>
                              <div className="flex justify-between items-center text-sm font-bold text-[var(--color-primary)] mt-4 pt-3 border-t border-[var(--color-border)]">
                                <span>{priceLabel}</span>
                                <span className="text-xs text-[var(--color-text-muted)] font-semibold">{course.level || 'All Levels'}</span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Videos Grid */}
                {results.videos && results.videos.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-black flex items-center gap-2 text-[var(--color-text-main)] mb-6">
                      <Video className="w-6 h-6 text-emerald-500" /> Free Lectures ({results.videos.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.videos.map((video) => (
                        <Link
                          to={video.playlist ? `/playlists/${video.playlist}` : video.course ? `/courses/${video.course}` : `/playlists`}
                          key={video._id}
                          className="bg-[var(--color-card)] rounded-2xl overflow-hidden shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-lg transition-all flex flex-col group"
                        >
                          <div className="aspect-[16/9] w-full bg-slate-800 relative overflow-hidden">
                            {video.thumbnailUrl && (
                              <img
                                src={video.thumbnailUrl}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                          </div>
                          <div className="p-5 flex-grow flex flex-col justify-between">
                            <div>
                              <h3 className="text-sm font-bold text-[var(--color-text-main)] line-clamp-2 leading-snug">{video.title}</h3>
                              <p className="text-xs text-[var(--color-text-muted)] mt-1.5 line-clamp-2">{video.description}</p>
                            </div>
                            <span className="text-xs font-semibold text-[var(--color-primary)] mt-3 block">🎬 {video.duration} mins</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Blogs Grid */}
                {results.blogs && results.blogs.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-black flex items-center gap-2 text-[var(--color-text-main)] mb-6">
                      <FileText className="w-6 h-6 text-purple-500" /> Tech Articles ({results.blogs.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.blogs.map((blog) => (
                        <Link
                          to={`/blogs/${blog._id}`}
                          key={blog._id}
                          className="bg-[var(--color-card)] rounded-2xl overflow-hidden shadow-sm border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-lg transition-all flex flex-col group"
                        >
                          <div className="aspect-[16/9] w-full bg-slate-800 relative overflow-hidden">
                            {blog.coverImage && (
                              <img
                                src={blog.coverImage}
                                alt={blog.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                          </div>
                          <div className="p-5 flex-grow flex flex-col justify-between">
                            <div>
                              <h3 className="text-sm font-bold text-[var(--color-text-main)] line-clamp-2 leading-snug">{blog.title}</h3>
                              <p className="text-xs text-[var(--color-text-muted)] mt-2 line-clamp-2">{blog.excerpt}</p>
                            </div>
                            <span className="text-xs text-[var(--color-text-muted)] mt-3 block">
                              Published: {new Date(blog.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
