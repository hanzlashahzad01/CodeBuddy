import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, CheckCircle, Clock } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`/api/courses/${id}`);
        setCourse(data.data);
      } catch (error) {
        console.error('Error fetching course', error);
      }
      setLoading(false);
    };
    fetchCourse();
  }, [id]);

  if (loading) return <div className="py-20 text-center text-xl text-[var(--color-text-muted)]">Loading course...</div>;
  if (!course) return <div className="py-20 text-center text-xl text-[var(--color-text-muted)]">Course not found.</div>;

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          <div className="lg:col-span-2">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{course.title}</h1>
            <p className="text-xl text-gray-300 mb-8">{course.description}</p>
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
              <span className="flex items-center"><Clock className="w-5 h-5 mr-2 text-[var(--color-primary)]" /> {course.duration || '0h'} Video</span>
              <span className="flex items-center"><PlayCircle className="w-5 h-5 mr-2 text-[var(--color-primary)]" /> {course.videos?.length || 0} Lectures</span>
              <span className="flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-[var(--color-primary)]" /> Certificate of Completion</span>
            </div>
          </div>
          
          <div className="lg:col-span-1 bg-white text-black rounded-2xl overflow-hidden shadow-2xl sticky top-24 transform lg:-translate-y-12">
            {course.image && (
              <img 
                src={course.image.startsWith('/') ? `http://localhost:5000${course.image}` : course.image} 
                alt={course.title} 
                className="w-full h-48 object-cover"
                onError={(e) => { e.target.src = '/no-photo.jpg' }}
              />
            )}
            <div className="p-8">
              <div className="text-4xl font-black text-gray-900 mb-6">
                ${course.price}
              </div>
              <Link to={`/checkout/${course._id}`} className="block w-full text-center bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg">
                Enroll Now
              </Link>
              <p className="text-center text-gray-500 text-sm mt-4 font-medium">30-Day Money-Back Guarantee</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {/* What you'll learn */}
          <section>
            <h2 className="text-3xl font-bold text-[var(--color-text-main)] mb-6">What you'll learn</h2>
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-8 rounded-2xl">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1,2,3,4,5,6].map((item) => (
                  <li key={item} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-[var(--color-primary)] mr-3 flex-shrink-0" />
                    <span className="text-[var(--color-text-main)] font-medium">Master industry standard tools and practices for web development.</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Video Curriculum */}
          {course.videos && course.videos.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-[var(--color-text-main)] mb-6">Course Curriculum</h2>
              <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
                {course.videos.sort((a,b) => a.order - b.order).map((video, index) => (
                  <div key={video._id} className="flex items-center gap-4 p-5 border-b border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <PlayCircle className={`w-5 h-5 flex-shrink-0 ${video.isFreePreview ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className="flex-1 font-semibold text-[var(--color-text-main)]">{video.title}</span>
                    <span className="text-sm text-[var(--color-text-muted)]">{video.duration} mins</span>
                    {video.isFreePreview && (
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Free Preview</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
