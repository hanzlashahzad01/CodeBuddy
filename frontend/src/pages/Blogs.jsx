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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-extrabold text-[var(--text-main)] mb-4">Tech Blog</h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl">Read our latest articles on web development, programming tips, and tech news.</p>
        </div>
      </div>
      
      {loading ? (
        <p className="text-[var(--text-muted)] text-xl">Loading blogs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map(blog => (
            <article key={blog._id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-2xl transition-all flex flex-col h-full">
              <div className="h-48 bg-gray-200">
                {blog.coverImage && <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />}
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="text-sm font-bold text-[var(--color-primary)] mb-3">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-main)] mb-4 leading-tight">{blog.title}</h2>
                <p className="text-[var(--text-muted)] mb-8 flex-grow font-medium leading-relaxed">{blog.excerpt}</p>
                <Link to={`/blogs/${blog.slug || blog._id}`} className="flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-bold text-lg transition-colors mt-auto w-fit">
                  Read Article <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;
