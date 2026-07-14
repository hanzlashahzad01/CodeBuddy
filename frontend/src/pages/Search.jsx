import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Video, FileText } from 'lucide-react';

const Search = () => {
  const [results, setResults] = useState({ courses: [], videos: [], blogs: [] });
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:5000/api/search?q=${query}`);
        setResults(data.data);
      } catch (error) {
        console.error('Search error', error);
      }
      setLoading(false);
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[var(--color-text-main)] mb-8">
          Search Results for "{query}"
        </h1>

        {loading ? (
          <p className="text-[var(--color-text-muted)] text-xl">Searching...</p>
        ) : (
          <div className="space-y-12">
            {/* Courses */}
            {results.courses && results.courses.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 text-[var(--color-primary)] mb-4">
                  <BookOpen className="w-6 h-6" /> Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {results.courses.map(course => (
                    <Link to={`/courses/${course.slug || course._id}`} key={course._id} className="bg-[var(--color-card)] rounded-xl overflow-hidden shadow-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all">
                      <div className="h-48 bg-slate-800">
                        {course.image && (
                          <img 
                            src={course.image.startsWith('/') ? `http://localhost:5000${course.image}` : course.image} 
                            alt={course.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = '/no-photo.jpg' }}
                          />
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-[var(--color-text-main)]">{course.title}</h3>
                        <p className="text-[var(--color-text-muted)] mt-2 line-clamp-2">{course.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {results.videos && results.videos.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 text-[var(--color-primary)] mb-4">
                  <Video className="w-6 h-6" /> Videos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {results.videos.map(video => (
                    <Link to={video.playlist ? `/playlists/${video.playlist}` : video.course ? `/courses/${video.course}` : `/tutorials`} key={video._id} className="bg-[var(--color-card)] rounded-xl overflow-hidden shadow-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all">
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-[var(--color-text-main)]">{video.title}</h3>
                        <p className="text-[var(--color-text-muted)] mt-2">{video.duration} mins</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Blogs */}
            {results.blogs && results.blogs.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 text-[var(--color-primary)] mb-4">
                  <FileText className="w-6 h-6" /> Blogs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {results.blogs.map(blog => (
                    <Link to={`/blogs/${blog.slug || blog._id}`} key={blog._id} className="bg-[var(--color-card)] rounded-xl overflow-hidden shadow-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all">
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-[var(--color-text-main)]">{blog.title}</h3>
                        <p className="text-[var(--color-text-muted)] mt-2 line-clamp-2">{blog.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!results.courses?.length && !results.videos?.length && !results.blogs?.length && (
              <div className="text-center py-20 text-[var(--color-text-muted)] text-xl">
                No results found for "{query}". Try different keywords.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
