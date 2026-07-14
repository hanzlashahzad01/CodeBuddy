import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, User } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`/api/blogs/${id}`);
        setBlog(data.data);
      } catch (error) {
        console.error('Error fetching blog', error);
      }
      setLoading(false);
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto py-20 px-4 text-xl text-[var(--color-text-muted)]">Loading article...</div>;
  }

  if (!blog) {
    return <div className="max-w-4xl mx-auto py-20 px-4 text-xl text-[var(--color-text-muted)]">Article not found.</div>;
  }

  return (
    <div className="bg-[var(--color-bg)] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blogs" className="flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] mb-8 font-bold text-lg transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Blogs
        </Link>
        
        <article className="bg-[var(--color-card)] rounded-2xl shadow-xl border border-[var(--color-border)] overflow-hidden">
          {blog.coverImage && (
            <div className="w-full h-80 bg-gray-200">
              <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="p-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-main)] mb-6 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-[var(--color-text-muted)] mb-10 border-b border-[var(--color-border)] pb-8">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span className="font-semibold">{blog.author?.name || 'Admin'}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="font-semibold">{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="prose prose-lg dark:prose-invert max-w-none text-[var(--color-text-main)] font-medium leading-relaxed">
              {/* If content is HTML, use dangerouslySetInnerHTML, else just text. Assuming HTML for blogs. */}
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
                <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-4">Tags:</h3>
                <div className="flex flex-wrap gap-3">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="bg-[var(--color-bg)] border border-[var(--color-border)] px-4 py-2 rounded-full text-[var(--color-text-muted)] font-semibold text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
