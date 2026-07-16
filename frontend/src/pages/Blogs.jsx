import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get('/api/blogs');

        setBlogs(data.data);
      } catch (error) {
        console.error('Error fetching blogs', error);
      }
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-main)] mb-3 sm:mb-4">Tech Blog</h1>
          <p className="text-base sm:text-lg md:text-xl text-[var(--text-muted)] max-w-2xl">Read our latest articles on web development, programming tips, and tech news.</p>
        </div>
      </div>
      
      {loading ? (
        <p className="text-[var(--text-muted)] text-xl text-center">Loading blogs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {blogs.map(blog => (
            <article key={blog._id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-2xl transition-all flex flex-col h-full">
              <div className="h-40 sm:h-48 bg-gray-200 relative">
                {blog.image && blog.image !== 'no-image.jpg' ? (
                  <img 
                    src={blog.image.startsWith('/') ? `http://localhost:5000${blog.image}` : blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                    <span className="text-white/30 text-4xl font-bold">Blog</span>
                  </div>
                )}
              </div>
              <div className="p-5 sm:p-6 md:p-8 flex flex-col flex-grow">
                <div className="text-xs sm:text-sm font-bold text-[var(--color-primary)] mb-2 sm:mb-3">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--text-main)] mb-3 sm:mb-4 leading-tight line-clamp-2">{blog.title}</h2>
                <p className="text-sm sm:text-base text-[var(--text-muted)] mb-4 sm:mb-6 md:mb-8 flex-grow font-medium leading-relaxed line-clamp-3">
                  {blog.content ? blog.content.substring(0, 150) + '...' : blog.excerpt}
                </p>
                <Link to={`/blogs/${blog.slug || blog._id}`} className="flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-bold text-sm sm:text-base md:text-lg transition-colors mt-auto w-fit">
                  Read Article <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </div>
            </article>
          ))}
          {blogs.length === 0 && (
            <div className="col-span-full text-center py-10 text-[var(--text-muted)] font-semibold">
              No blogs available at the moment. Check back later!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blogs;
