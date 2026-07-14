import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Play, RefreshCw } from 'lucide-react';

const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
};

const PlaylistDetail = () => {
  const { id } = useParams();
  const [playlist, setPlaylist]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  const fetchPlaylist = async () => {
    try {
      const { data } = await axios.get(`/api/playlists/${id}`);
      setPlaylist(data.data);
      if (data.data.videos && data.data.videos.length > 0) {
        setActiveVideo(data.data.videos[0]);
      }
    } catch (error) {
      console.error('Error fetching playlist', error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPlaylist(); }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--color-text-muted)] text-lg">Loading playlist...</p>
      </div>
    </div>
  );

  if (!playlist) return (
    <div className="min-h-screen flex items-center justify-center text-[var(--color-text-muted)] text-xl">
      Playlist not found.
    </div>
  );

  const videoCount = playlist.videos?.length ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        to="/playlists"
        className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:opacity-80 mb-8 font-bold transition-opacity"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Playlists
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left: Video Player ── */}
        <div className="lg:col-span-2 space-y-4">
          {activeVideo ? (
            <div className="bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-lg">
              {/* 16:9 Player */}
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
                <h1 className="text-2xl font-bold text-[var(--color-text-main)] mb-2">{activeVideo.title}</h1>
                <p className="text-sm text-[var(--color-text-muted)]">{activeVideo.duration}</p>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--color-card)] rounded-2xl p-16 text-center text-[var(--color-text-muted)] border border-[var(--color-border)] shadow-lg">
              No videos available in this playlist yet.
            </div>
          )}

          {/* Playlist info card */}
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow">
            <h2 className="text-xl font-bold text-[var(--color-text-main)] mb-2">{playlist.title}</h2>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{playlist.description}</p>
          </div>
        </div>

        {/* ── Right: Video List ── */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-lg overflow-hidden flex flex-col" style={{ maxHeight: '700px' }}>
            {/* Header */}
            <div className="p-5 border-b border-[var(--color-border)] bg-[var(--color-bg)] flex-shrink-0">
              <h2 className="text-base font-bold text-[var(--color-text-main)] line-clamp-1">{playlist.title}</h2>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{videoCount} {videoCount === 1 ? 'Video' : 'Videos'}</p>
            </div>

            {/* Scrollable list */}
            <div className="overflow-y-auto flex-grow divide-y divide-[var(--color-border)]">
              {playlist.videos?.map((video, index) => {
                const isActive = activeVideo?._id === video._id;
                return (
                  <div
                    key={video._id}
                    onClick={() => setActiveVideo(video)}
                    className={`flex gap-3 p-3 cursor-pointer transition-colors hover:bg-[var(--color-bg)] ${
                      isActive ? 'bg-[var(--color-primary)]/10 border-l-4 border-l-[var(--color-primary)]' : ''
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0 w-24 rounded-lg overflow-hidden bg-slate-800" style={{ aspectRatio: '16/9' }}>
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : null}
                      {/* Play overlay */}
                      <div className={`absolute inset-0 flex items-center justify-center bg-black/40 ${isActive ? 'opacity-100' : 'opacity-0 hover:opacity-100'} transition-opacity`}>
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                      {/* Duration badge */}
                      {video.duration && (
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded">
                          {video.duration}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-grow min-w-0">
                      <p className={`text-xs font-semibold line-clamp-2 leading-snug ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-main)]'}`}>
                        {index + 1}. {video.title}
                      </p>
                      {video.duration && (
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{video.duration}</p>
                      )}
                    </div>
                  </div>
                );
              })}
              {videoCount === 0 && (
                <div className="p-10 text-center text-[var(--color-text-muted)] text-sm">
                  No videos found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;
