import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle } from 'lucide-react';

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/playlists');
        setPlaylists(data.data);
      } catch (error) {
        console.error('Error fetching playlists', error);
      }
      setLoading(false);
    };
    fetchPlaylists();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-5xl font-extrabold text-[var(--color-text-main)] mb-8 text-center">Free Playlists</h1>
      
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
        <p className="text-[var(--color-text-muted)] text-xl text-center">Loading playlists...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {playlists.map(playlist => (
            <Link to={`/playlists/${playlist._id}`} key={playlist._id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[var(--color-primary)] transition-all flex flex-col">
              <div className="aspect-[16/9] w-full bg-gray-200 relative overflow-hidden group">
                {playlist.thumbnail && (
                  <img 
                    src={playlist.thumbnail.startsWith('/') ? `http://localhost:5000${playlist.thumbnail}` : playlist.thumbnail} 
                    alt={playlist.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = '/no-thumbnail.jpg' }}
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="text-white w-16 h-16" />
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-2 line-clamp-1">{playlist.title}</h2>
                  <p className="text-[var(--color-text-muted)] mb-4 text-sm line-clamp-2">{playlist.description}</p>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold text-[var(--color-primary)]">
                  <span>{(playlist.videoCount ?? playlist.videos?.length ?? 0)} Videos</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlists;
