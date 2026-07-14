import React, { useEffect, useState } from 'react';
import { Play, X } from 'lucide-react';
import axios from 'axios';

const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) 
    ? `https://www.youtube.com/embed/${match[2]}` 
    : url;
};

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const { data } = await axios.get('/api/videos');
        if (data.success) {
          setTutorials(data.data);
        }
      } catch (error) {
        console.error('Error fetching tutorials', error);
      }
      setLoading(false);
    };
    fetchTutorials();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-5xl font-extrabold text-[var(--text-main)] mb-4">Free YouTube Tutorials</h1>
      <p className="text-xl text-[var(--text-muted)] mb-8 max-w-3xl">Access hundreds of free, high-quality coding tutorials directly from our YouTube channel.</p>
      
      {/* YouTube Channel Banner */}
      <div className="mb-12 bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-red-600/10">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/50 flex-shrink-0 bg-white shadow-md">
            <img src="/codebuddy_avatar.jpg" alt="CodeBuddy Channel Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-2">Subscribe to CodeBuddy on YouTube!</h2>
            <p className="text-red-100 text-sm md:text-base max-w-xl">Don't miss out on free coding crash courses, project builds, roadmaps, and career guidance in Hindi/Urdu.</p>
          </div>
        </div>
        <a 
          href="http://www.youtube.com/@CodeBuddy166" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="px-6 py-4 bg-white text-red-700 font-bold rounded-2xl hover:bg-red-50 hover:scale-105 transition-all shadow-lg whitespace-nowrap"
        >
          Visit YouTube Channel 🎥
        </a>
      </div>

      {loading ? (
        <p className="text-[var(--text-muted)] text-xl text-center">Loading tutorials...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tutorials.map((tutorial) => {
            return (
              <div 
                key={tutorial._id} 
                onClick={() => setActiveVideo(tutorial)}
                className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="aspect-[16/9] w-full bg-slate-800 relative flex items-center justify-center overflow-hidden">
                  {tutorial.thumbnailUrl ? (
                    <img 
                      src={tutorial.thumbnailUrl} 
                      alt={tutorial.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = '/no-thumbnail.jpg' }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-white fill-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  {tutorial.duration && (
                    <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded z-10">{tutorial.duration}</span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-[var(--text-main)] mb-2 line-clamp-2 leading-snug h-12">{tutorial.title}</h3>
                  <p className="text-[var(--text-muted)] text-xs font-semibold">Free Tutorial</p>
                </div>
              </div>
            );
          })}
          {tutorials.length === 0 && (
            <div className="col-span-full text-center py-10 text-[var(--text-muted)] font-semibold">
              No tutorials available at the moment. Check back later!
            </div>
          )}
        </div>
      )}

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

export default Tutorials;
