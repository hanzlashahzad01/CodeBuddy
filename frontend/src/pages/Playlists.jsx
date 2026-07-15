import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle } from 'lucide-react';

/**
 * Resolve playlist thumbnail — priority order:
 *  1. firstVideo.thumbnailUrl  — permanent YT video thumbnail (no expiry, most reliable)
 *  2. Extract videoId from firstVideo.videoUrl → build clean YT thumb URL
 *  3. playlist.thumbnail — only if it's a clean http URL without signed params (sqp/rs expire)
 *  4. null → gradient placeholder
 */
const resolveThumbnail = (thumbnail, firstVideo) => {
  // ── Priority 1: direct video thumbnail URL stored in DB (always clean, never expires) ──
  if (firstVideo?.thumbnailUrl && firstVideo.thumbnailUrl.startsWith('http')) {
    return firstVideo.thumbnailUrl;
  }

  // ── Priority 2: build from first video's YouTube URL ──
  if (firstVideo?.videoUrl) {
    const m = firstVideo.videoUrl.match(/(?:youtu\.be\/|watch\?v=)([^&?]+)/);
    if (m && m[1]) return `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`;
  }

  // ── Priority 3: playlist-level thumbnail — strip signed query params before using ──
  if (thumbnail && thumbnail.startsWith('http') && !thumbnail.includes('no-thumbnail')) {
    // Remove expiring signed params (sqp, rs, etc.) by keeping only the base URL
    try {
      const url = new URL(thumbnail);
      // If it's a YouTube image URL, strip all query params (they expire)
      if (url.hostname.includes('ytimg.com') || url.hostname.includes('yt3.ggpht')) {
        return `${url.origin}${url.pathname}`;
      }
      return thumbnail; // non-YT URLs (e.g. Cloudinary) keep as-is
    } catch {
      return thumbnail;
    }
  }

  return null; // fallback → gradient placeholder
};

// Individual playlist card — manages its own imgError state
const PlaylistCard = ({ playlist }) => {
  const thumbSrc = resolveThumbnail(playlist.thumbnail, playlist.firstVideo);
  const [imgFailed, setImgFailed] = useState(false);

  const showImg = thumbSrc && !imgFailed;

  return (
    <Link
      to={`/playlists/${playlist._id}`}
      className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[var(--color-primary)] hover:-translate-y-1 transition-all duration-300 flex flex-col group"
    >
      {/* Thumbnail */}
      <div className="aspect-[16/9] w-full bg-slate-800 relative overflow-hidden flex-shrink-0">
        {showImg ? (
          <img
            src={thumbSrc}
            alt={playlist.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          /* Gradient placeholder when no thumbnail is available */
          <div className="w-full h-full bg-gradient-to-br from-indigo-700 to-purple-800 flex items-center justify-center">
            <PlayCircle className="w-16 h-16 text-white/40" />
          </div>
        )}

        {/* Play-on-hover overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PlayCircle className="text-white w-16 h-16 drop-shadow-xl" />
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text-main)] mb-2 line-clamp-2 leading-snug">
            {playlist.title}
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm line-clamp-2">
            {playlist.description}
          </p>
        </div>
        <div className="flex justify-between items-center text-sm font-semibold text-[var(--color-primary)] mt-4 pt-3 border-t border-[var(--color-border)]">
          <span>🎬 {(playlist.videoCount ?? playlist.videos?.length ?? 0)} Videos</span>
          <span className="text-xs text-[var(--color-text-muted)] font-normal">{playlist.category}</span>
        </div>
      </div>
    </Link>
  );
};

// Skeleton card for loading state
const SkeletonCard = () => (
  <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden flex flex-col animate-pulse">
    <div className="aspect-[16/9] w-full bg-slate-700/50" />
    <div className="p-6 space-y-3">
      <div className="h-6 bg-slate-700/50 rounded w-3/4" />
      <div className="h-4 bg-slate-700/30 rounded w-full" />
      <div className="h-4 bg-slate-700/30 rounded w-5/6" />
      <div className="h-4 bg-slate-700/20 rounded w-1/3 mt-4" />
    </div>
  </div>
);

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const { data } = await axios.get('/api/playlists');
        setPlaylists(data.data || []);
      } catch (error) {
        console.error('Error fetching playlists', error);
      }
      setLoading(false);
    };
    fetchPlaylists();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--color-text-main)] mb-8 text-center">
        Free Playlists
      </h1>

      {/* YouTube Channel Banner */}
      <div className="mb-12 bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-red-600/10">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/50 flex-shrink-0 bg-white shadow-md">
            <img src="/codebuddy_avatar.jpg" alt="CodeBuddy Channel Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-2">Subscribe to CodeBuddy on YouTube!</h2>
            <p className="text-red-100 text-sm md:text-base max-w-xl">
              Don't miss out on free coding crash courses, project builds, roadmaps, and career guidance in Hindi/Urdu.
            </p>
          </div>
        </div>
        <a
          href="http://www.youtube.com/@CodeBuddy166"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-4 bg-white text-red-700 font-bold rounded-2xl hover:bg-red-50 hover:scale-105 transition-all shadow-lg whitespace-nowrap flex-shrink-0"
        >
          Visit YouTube Channel 🎥
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : playlists.length === 0 ? (
        <p className="text-[var(--color-text-muted)] text-xl text-center py-16">No playlists found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {playlists.map(playlist => (
            <PlaylistCard key={playlist._id} playlist={playlist} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlists;
