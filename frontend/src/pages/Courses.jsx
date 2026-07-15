import React, { useEffect, useState } from 'react';
import { PlayCircle, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get('/api/courses');
        if (data.success) {
          setCourses(data.data);
        }
      } catch (error) {
        console.error('Error fetching courses', error);
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-main)] mb-8">Premium Courses</h1>
      <p className="text-lg sm:text-xl text-[var(--text-muted)] mb-12 max-w-3xl">Take your skills to the next level with our in-depth, project-based premium courses.</p>
      
      {loading ? (
        <p className="text-[var(--text-muted)] text-xl text-center">Loading premium courses...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map(course => {
            const priceLabel = course.price === 0 ? 'Free' : `$${course.price}`;
            return (
              <div key={course._id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group flex flex-col h-full">
                <Link to={`/courses/${course._id}`} className="h-56 bg-slate-800 relative block overflow-hidden">
                  {course.image && course.image !== 'no-photo.jpg' ? (
                    <img 
                      src={course.image.startsWith('/') ? `http://localhost:5000${course.image}` : course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = '/no-photo.jpg' }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-white/30 group-hover:text-white/50 transition-colors" />
                    </div>
                  )}
                </Link>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-[var(--color-primary)] px-3 py-1 bg-[var(--color-primary)]/10 rounded-full capitalize">{course.level || 'All Levels'}</span>
                    <span className="flex items-center text-yellow-500 font-bold">
                      <Star className="w-4 h-4 mr-1 fill-current" /> {course.averageRating || '5.0'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--text-main)] mb-3 leading-tight line-clamp-2 h-14">{course.title}</h2>
                  <p className="text-[var(--text-muted)] mb-6 font-medium line-clamp-2 flex-grow">{course.description}</p>
                  
                  <div className="flex justify-between items-center border-t border-[var(--border)] pt-6 mt-auto">
                    <span className="text-3xl font-extrabold text-[var(--text-main)]">{priceLabel}</span>
                    <Link to={`/courses/${course._id}`} className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-lg transition-colors">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          {courses.length === 0 && (
            <div className="col-span-full text-center py-10 text-[var(--color-text-muted)] font-semibold">
              No courses available at the moment. Check back later!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Courses;
