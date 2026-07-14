import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Play, X, Rocket } from 'lucide-react';
import axios from 'axios';

const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
};

// Map from the URL slug (e.g. "html-css") to DB category keywords
const CATEGORY_MAP = {
  'html-css'   : ['HTML', 'CSS', 'CSS Grid', 'CSS Flexbox'],
  'javascript' : ['JavaScript'],
  'react'      : ['React'],
  'nodejs'     : ['Node.js'],
  'python'     : ['Python'],
  'laravel'    : ['Laravel'],
  'mongodb'    : ['MongoDB'],
  'git-github' : ['Git & GitHub'],
  'projects'   : ['Projects'],
  'php'        : ['PHP'],
  'sql'        : ['SQL', 'MySQL', 'My SQL'],
};

const CATEGORY_META = {
  'html-css'   : { label: 'HTML & CSS',    icon: '🎨', color: '#E34F26', desc: 'Learn HTML5 & CSS3 — the building blocks of the web.' },
  'javascript' : { label: 'JavaScript',    icon: '🟨', color: '#F7DF1E', desc: 'Master modern JavaScript — from basics to ES2024.' },
  'react'      : { label: 'React',         icon: '⚛️', color: '#61DAFB', desc: 'Build powerful UIs with React & hooks.' },
  'nodejs'     : { label: 'Node.js',       icon: '🟩', color: '#68A063', desc: 'Build scalable backends with Node.js & Express.' },
  'python'     : { label: 'Python',        icon: '🐍', color: '#3776AB', desc: 'Python for web dev, automation & data science.' },
  'laravel'    : { label: 'Laravel',       icon: '🔴', color: '#FF2D20', desc: 'Full-stack PHP development with Laravel.' },
  'mongodb'    : { label: 'MongoDB',       icon: '🍃', color: '#47A248', desc: 'NoSQL database design and queries.' },
  'git-github' : { label: 'Git & GitHub',  icon: '🐙', color: '#F05032', desc: 'Version control & collaboration with Git.' },
  'projects'   : { label: 'Projects',      icon: '🚀', color: '#8B5CF6', desc: 'Master Web & App Development with real-world projects.' },
  'php'        : { label: 'PHP',           icon: '🐘', color: '#777BB4', desc: 'Back-end web development with PHP.' },
  'sql'        : { label: 'SQL & Database', icon: '🛢️', color: '#00758F', desc: 'Relational databases, SQL queries, and design.' },
};

const CategoryPage = () => {
  const { slug }   = useParams();
  const meta       = CATEGORY_META[slug];
  const categories = CATEGORY_MAP[slug] ?? [];

  const [playlists, setPlaylists]   = useState([]);
  const [videos, setVideos]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [tab, setTab]               = useState('playlists'); // 'playlists' | 'videos'

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // fetch all playlists then filter
        const plRes = await axios.get('/api/playlists');
        const filtered = (plRes.data.data ?? []).filter(pl =>
          categories.some(cat => pl.category?.toLowerCase() === cat.toLowerCase())
        );
        setPlaylists(filtered);

        // fetch videos for each matching playlist
        const videoPromises = filtered.map(pl => axios.get(`/api/playlists/${pl._id}`));
        const settled = await Promise.allSettled(videoPromises);
        const allVids = settled
          .filter(r => r.status === 'fulfilled')
          .flatMap(r => r.value.data.data.videos ?? []);
        setVideos(allVids);
      } catch (e) {
        console.error('CategoryPage fetch error', e);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  const hasContent = playlists.length > 0;

  if (!meta) return (
    <div className="min-h-screen flex items-center justify-center text-[var(--text-muted)] text-xl">
      Category not found.
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-2 text-[var(--color-primary)] font-bold hover:opacity-80 transition-opacity mb-8">
        <ArrowLeft className="w-5 h-5" /> Back to Home
      </Link>

      {/* Hero */}
      <div className="rounded-3xl p-8 mb-10 flex items-center gap-6" style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}30` }}>
        <span className="text-7xl">{meta.icon}</span>
        <div>
          <h1 className="text-4xl font-black text-[var(--text-main)]">{meta.label}</h1>
          <p className="text-[var(--text-muted)] text-lg mt-1">{meta.desc}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !hasContent ? (
        /* ── Coming Soon ── */
        <div className="text-center py-24">
          <Rocket className="w-20 h-20 mx-auto text-[var(--color-primary)] mb-6 opacity-60" />
          <h2 className="text-4xl font-black text-[var(--text-main)] mb-4">Coming Soon!</h2>
          <p className="text-[var(--text-muted)] text-lg max-w-lg mx-auto mb-8">
            We're working hard on <strong style={{ color: meta.color }}>{meta.label}</strong> tutorials. Subscribe to our YouTube channel to get notified when they drop!
          </p>
          <a
            href="http://www.youtube.com/@CodeBuddy166"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-colors shadow-lg"
          >
            Subscribe on YouTube 🎥
          </a>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setTab('playlists')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'playlists' ? 'bg-[var(--color-primary)] text-white shadow' : 'bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--text-muted)] hover:border-[var(--color-primary)]'}`}
            >
              📚 Playlists ({playlists.length})
            </button>
            <button
              onClick={() => setTab('videos')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'videos' ? 'bg-[var(--color-primary)] text-white shadow' : 'bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--text-muted)] hover:border-[var(--color-primary)]'}`}
            >
              🎬 All Videos ({videos.length})
            </button>
          </div>

          {/* ── Playlists Tab ── */}
          {tab === 'playlists' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {playlists.map(pl => (
                <Link
                  key={pl._id}
                  to={`/playlists/${pl._id}`}
                  className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[var(--color-primary)] transition-all flex flex-col"
                >
                  <div className="aspect-[16/9] w-full bg-slate-800 relative overflow-hidden group">
                    {pl.thumbnail && (
                      <img
                        src={pl.thumbnail}
                        alt={pl.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <PlayCircle className="w-14 h-14 text-white" />
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-[var(--text-main)] line-clamp-2 mb-1">{pl.title}</h3>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-2">{pl.description}</p>
                    </div>
                    <p className="text-xs font-semibold text-[var(--color-primary)] mt-3">
                      {pl.videoCount ?? pl.videos?.length ?? 0} Videos
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ── Videos Tab ── */}
          {tab === 'videos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map(v => (
                <div
                  key={v._id}
                  onClick={() => setActiveVideo(v)}
                  className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="aspect-[16/9] w-full bg-slate-800 relative overflow-hidden">
                    {v.thumbnailUrl && (
                      <img
                        src={v.thumbnailUrl}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    {v.duration && (
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
                        {v.duration}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-bold text-[var(--text-main)] line-clamp-2 leading-snug">{v.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Video Modal ── */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setActiveVideo(null)}>
          <div className="bg-[var(--card)] border border-[var(--border)] max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveVideo(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--bg)] text-[var(--text-main)] z-10 cursor-pointer">
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <iframe
                key={activeVideo._id}
                className="absolute inset-0 w-full h-full"
                src={getYoutubeEmbedUrl(activeVideo.videoUrl)}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[var(--text-main)] mb-1">{activeVideo.title}</h3>
              <p className="text-sm text-[var(--text-muted)]">{activeVideo.duration}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
