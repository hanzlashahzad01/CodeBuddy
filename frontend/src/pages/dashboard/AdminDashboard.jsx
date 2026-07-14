import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, Users, BookOpen, ShoppingCart, MessageSquare,
  FileText, LogOut, ChevronRight, TrendingUp, DollarSign,
  Settings, Bell, Search, Menu, X, Star, PlayCircle, Plus,
  Edit, Trash2, Upload, FolderOpen, FileCheck, Eye, Rss, CheckCheck
} from 'lucide-react';
import { logout, reset } from '../../features/auth/authSlice';

// ── CUSTOM REVENUE/PROFIT CHART (SVG) ──
const RevenueChart = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  if (!data || data.length === 0) return null;
  
  const maxVal = Math.max(...data.map(d => d.revenue), 100);
  const height = 160;
  const width = 500;
  const padding = 35;
  
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.revenue / maxVal) * (height - padding * 2);
    return { x, y, label: d.month, value: d.revenue };
  });
  
  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const areaPath = points.length > 0 ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` : '';
  
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl shadow-sm relative flex-1">
      <h3 className="text-base font-bold text-[var(--text-main)] mb-1 flex items-center justify-between">
        <span>Revenue / Profit Trend</span>
        <span className="text-xs text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> Live
        </span>
      </h3>
      <p className="text-xs text-[var(--text-muted)] mb-4">Last 6 Months (Auto-updating)</p>
      
      <div className="w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0"/>
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
            const y = padding + r * (height - padding * 2);
            return (
              <line key={idx} x1={padding} y1={y} x2={width - padding} y2={y} stroke="var(--border)" strokeDasharray="3 3" />
            );
          })}
          
          {/* Area Fill */}
          <path d={areaPath} fill="url(#areaGrad)" />
          
          {/* Stroke Line */}
          <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="3.5" strokeLinecap="round" />
          
          {/* Data Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle 
                cx={p.x} 
                cy={p.y} 
                r={hoveredIndex === i ? 7 : 5} 
                fill="#ffffff" 
                stroke="#6366f1" 
                strokeWidth={hoveredIndex === i ? 4 : 3}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer transition-all duration-150"
              />
              
              {/* X Axis Labels */}
              <text 
                x={p.x} 
                y={height - 8} 
                textAnchor="middle" 
                fill="var(--text-muted)" 
                fontSize="11" 
                fontWeight="600"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {hoveredIndex !== null && (
        <div 
          className="absolute bg-slate-950 text-white text-xs font-bold rounded-lg px-2.5 py-1.5 shadow-lg z-10 border border-slate-700 pointer-events-none"
          style={{
            left: `${(points[hoveredIndex].x / width) * 100}%`,
            top: `${(points[hoveredIndex].y / height) * 100 - 15}%`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {points[hoveredIndex].label}: <span className="text-green-400 font-extrabold">${points[hoveredIndex].value}</span>
        </div>
      )}
    </div>
  );
};

// ── CUSTOM REGISTRATIONS CHART (SVG) ──
const RegistrationsChart = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  if (!data || data.length === 0) return null;
  
  const maxVal = Math.max(...data.map(d => d.registrations), 10);
  const height = 160;
  const width = 500;
  const padding = 35;
  
  const barSpacing = (width - padding * 2) / data.length;
  const barWidth = 22;
  
  const bars = data.map((d, i) => {
    const x = padding + i * barSpacing + (barSpacing - barWidth) / 2;
    const barHeight = (d.registrations / maxVal) * (height - padding * 2);
    const y = height - padding - barHeight;
    return { x, y, width: barWidth, height: barHeight, label: d.month, value: d.registrations };
  });
  
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl shadow-sm relative flex-1">
      <h3 className="text-base font-bold text-[var(--text-main)] mb-1 flex items-center justify-between">
        <span>Student Registration Growth</span>
        <span className="text-xs text-indigo-500 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Users className="w-3.5 h-3.5" /> Live
        </span>
      </h3>
      <p className="text-xs text-[var(--text-muted)] mb-4">Last 6 Months (Auto-updating)</p>
      
      <div className="w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
            const y = padding + r * (height - padding * 2);
            return (
              <line key={idx} x1={padding} y1={y} x2={width - padding} y2={y} stroke="var(--border)" strokeDasharray="3 3" />
            );
          })}
          
          {/* Bars */}
          {bars.map((b, i) => (
            <g key={i}>
              <rect 
                x={b.x} 
                y={b.y} 
                width={b.width} 
                height={b.height > 0 ? b.height : 2} 
                rx="4"
                fill={hoveredIndex === i ? '#8b5cf6' : '#a78bfa'}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer transition-all duration-150"
              />
              
              {/* X Axis Labels */}
              <text 
                x={b.x + b.width / 2} 
                y={height - 8} 
                textAnchor="middle" 
                fill="var(--text-muted)" 
                fontSize="11" 
                fontWeight="600"
              >
                {b.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {hoveredIndex !== null && (
        <div 
          className="absolute bg-slate-950 text-white text-xs font-bold rounded-lg px-2.5 py-1.5 shadow-lg z-10 border border-slate-700 pointer-events-none"
          style={{
            left: `${((bars[hoveredIndex].x + bars[hoveredIndex].width / 2) / width) * 100}%`,
            top: `${(bars[hoveredIndex].y / height) * 100 - 15}%`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {bars[hoveredIndex].label}: <span className="text-purple-400 font-extrabold">{bars[hoveredIndex].value} Users</span>
        </div>
      )}
    </div>
  );
};

// ── MAIN ADMIN DASHBOARD COMPONENT ──
const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, totalOrders: 0, revenue: 0, latestUsers: [], latestOrders: [], graphData: [] });
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // File Upload Loading State
  const [uploadingFile, setUploadingFile] = useState(false);

  // --- CRUD Modes ('list', 'create', 'edit') ---
  const [courseMode, setCourseMode] = useState('list');
  const [playlistMode, setPlaylistMode] = useState('list');
  const [videoMode, setVideoMode] = useState('list');
  const [noteMode, setNoteMode] = useState('list');
  const [blogMode, setBlogMode] = useState('list');

  // --- Edit states (stores item being edited) ---
  const [editCourse, setEditCourse] = useState(null);
  const [editPlaylist, setEditPlaylist] = useState(null);
  const [editVideo, setEditVideo] = useState(null);
  const [editNote, setEditNote] = useState(null);
  const [editBlog, setEditBlog] = useState(null);

  // --- Form Fields ---
  // Course Fields
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseLevel, setCourseLevel] = useState('Beginner');
  const [coursePrice, setCoursePrice] = useState(0);
  const [courseDiscount, setCourseDiscount] = useState(0);
  const [courseLang, setCourseLang] = useState('Urdu/Hindi');
  const [coursePremium, setCoursePremium] = useState(false);
  const [courseImage, setCourseImage] = useState('no-photo.jpg');
  const [courseDuration, setCourseDuration] = useState('0 hours');
  const [courseLectures, setCourseLectures] = useState(0);

  // Playlist Fields
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [playlistDesc, setPlaylistDesc] = useState('');
  const [playlistCategory, setPlaylistCategory] = useState('');
  const [playlistTags, setPlaylistTags] = useState('');
  const [playlistThumbnail, setPlaylistThumbnail] = useState('no-thumbnail.jpg');

  // Video Fields
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState('0:00');
  const [videoOrder, setVideoOrder] = useState(0);
  const [videoCourseId, setVideoCourseId] = useState('');
  const [videoPlaylistId, setVideoPlaylistId] = useState('');
  const [videoIsPreview, setVideoIsPreview] = useState(false);

  // Note Fields
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDesc, setNoteDesc] = useState('');
  const [noteFileUrl, setNoteFileUrl] = useState('');
  const [noteFormat, setNoteFormat] = useState('PDF');
  const [noteSize, setNoteSize] = useState('0.0 MB');

  // Blog Fields
  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCoverImage, setBlogCoverImage] = useState('');
  const [blogTags, setBlogTags] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  // --- API Fetchers ---
  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard', { withCredentials: true });
      if (data.success) setStats(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/admin/users', { withCredentials: true });
      if (data.success) setUsers(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('/api/courses');
      if (data.success) setCourses(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const { data } = await axios.get('/api/playlists');
      if (data.success) setPlaylists(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVideos = async () => {
    try {
      const { data } = await axios.get('/api/videos');
      if (data.success) setVideos(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get('/api/notes');
      if (data.success) setNotes(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get('/api/blogs');
      if (data.success) setBlogs(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get('/api/messages', { withCredentials: true });
      if (data.success) setMessages(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingStats(true);
      await Promise.all([
        fetchStats(),
        fetchUsers(),
        fetchCourses(),
        fetchPlaylists(),
        fetchVideos(),
        fetchNotes(),
        fetchBlogs(),
        fetchMessages()
      ]);
      setLoadingStats(false);
    };
    fetchData();
  }, []);

  // --- File Upload Handler ---
  const handleFileUpload = async (e, onUploadSuccess, fileType = 'image') => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      if (data.success) {
        onUploadSuccess(data.data, data.size);
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadingFile(false);
    }
  };

  // --- Course CRUD Functions ---
  const openCreateCourse = () => {
    setEditCourse(null);
    setCourseTitle('');
    setCourseDesc('');
    setCourseCategory('');
    setCourseLevel('Beginner');
    setCoursePrice(0);
    setCourseDiscount(0);
    setCourseLang('Urdu/Hindi');
    setCoursePremium(false);
    setCourseImage('no-photo.jpg');
    setCourseDuration('0 hours');
    setCourseLectures(0);
    setCourseMode('create');
  };

  const openEditCourse = (c) => {
    setEditCourse(c);
    setCourseTitle(c.title);
    setCourseDesc(c.description);
    setCourseCategory(c.category);
    setCourseLevel(c.level || 'Beginner');
    setCoursePrice(c.price || 0);
    setCourseDiscount(c.discount || 0);
    setCourseLang(c.language || 'Urdu/Hindi');
    setCoursePremium(c.isPremium || false);
    setCourseImage(c.image || 'no-photo.jpg');
    setCourseDuration(c.duration || '0 hours');
    setCourseLectures(c.totalLectures || 0);
    setCourseMode('edit');
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: courseTitle,
      description: courseDesc,
      category: courseCategory,
      level: courseLevel,
      price: Number(coursePrice),
      discount: Number(courseDiscount),
      language: courseLang,
      isPremium: coursePremium,
      image: courseImage,
      duration: courseDuration,
      totalLectures: Number(courseLectures)
    };
    try {
      if (courseMode === 'create') {
        const { data } = await axios.post('/api/courses', payload, { withCredentials: true });
        if (data.success) {
          alert('Course created successfully!');
          fetchCourses();
          setCourseMode('list');
        }
      } else {
        const { data } = await axios.put(`/api/courses/${editCourse._id}`, payload, { withCredentials: true });
        if (data.success) {
          alert('Course updated successfully!');
          fetchCourses();
          setCourseMode('list');
        }
      }
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      const { data } = await axios.delete(`/api/courses/${id}`, { withCredentials: true });
      if (data.success) {
        alert('Course deleted.');
        fetchCourses();
      }
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    }
  };

  // --- Playlist CRUD Functions ---
  const openCreatePlaylist = () => {
    setEditPlaylist(null);
    setPlaylistTitle('');
    setPlaylistDesc('');
    setPlaylistCategory('');
    setPlaylistTags('');
    setPlaylistThumbnail('no-thumbnail.jpg');
    setPlaylistMode('create');
  };

  const openEditPlaylist = (p) => {
    setEditPlaylist(p);
    setPlaylistTitle(p.title);
    setPlaylistDesc(p.description);
    setPlaylistCategory(p.category);
    setPlaylistTags(p.tags?.join(', ') || '');
    setPlaylistThumbnail(p.thumbnail || 'no-thumbnail.jpg');
    setPlaylistMode('edit');
  };

  const handlePlaylistSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: playlistTitle,
      description: playlistDesc,
      category: playlistCategory,
      tags: playlistTags.split(',').map(t => t.trim()).filter(t => t),
      thumbnail: playlistThumbnail
    };
    try {
      if (playlistMode === 'create') {
        const { data } = await axios.post('/api/playlists', payload, { withCredentials: true });
        if (data.success) {
          alert('Playlist created successfully!');
          fetchPlaylists();
          setPlaylistMode('list');
        }
      } else {
        const { data } = await axios.put(`/api/playlists/${editPlaylist._id}`, payload, { withCredentials: true });
        if (data.success) {
          alert('Playlist updated successfully!');
          fetchPlaylists();
          setPlaylistMode('list');
        }
      }
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeletePlaylist = async (id) => {
    if (!window.confirm('Delete this playlist?')) return;
    try {
      const { data } = await axios.delete(`/api/playlists/${id}`, { withCredentials: true });
      if (data.success) {
        alert('Playlist deleted.');
        fetchPlaylists();
      }
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    }
  };

  // --- Video CRUD Functions ---
  const openCreateVideo = () => {
    setEditVideo(null);
    setVideoTitle('');
    setVideoDesc('');
    setVideoUrl('');
    setVideoDuration('0:00');
    setVideoOrder(0);
    setVideoCourseId(courses[0]?._id || '');
    setVideoPlaylistId('');
    setVideoIsPreview(false);
    setVideoMode('create');
  };

  const openEditVideo = (v) => {
    setEditVideo(v);
    setVideoTitle(v.title);
    setVideoDesc(v.description);
    setVideoUrl(v.videoUrl);
    setVideoDuration(v.duration);
    setVideoOrder(v.order);
    setVideoCourseId(v.course?._id || v.course || '');
    setVideoPlaylistId(v.playlist?._id || v.playlist || '');
    setVideoIsPreview(v.isFreePreview || false);
    setVideoMode('edit');
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: videoTitle,
      description: videoDesc,
      videoUrl: videoUrl,
      duration: videoDuration,
      order: Number(videoOrder),
      isFreePreview: videoIsPreview
    };
    if (videoCourseId) payload.course = videoCourseId;
    if (videoPlaylistId) payload.playlist = videoPlaylistId;

    try {
      if (videoMode === 'create') {
        const { data } = await axios.post('/api/videos', payload, { withCredentials: true });
        if (data.success) {
          alert('Video uploaded successfully!');
          fetchVideos();
          setVideoMode('list');
        }
      } else {
        const { data } = await axios.put(`/api/videos/${editVideo._id}`, payload, { withCredentials: true });
        if (data.success) {
          alert('Video updated successfully!');
          fetchVideos();
          setVideoMode('list');
        }
      }
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      const { data } = await axios.delete(`/api/videos/${id}`, { withCredentials: true });
      if (data.success) {
        alert('Video deleted.');
        fetchVideos();
      }
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    }
  };

  // --- Note CRUD Functions ---
  const openCreateNote = () => {
    setEditNote(null);
    setNoteTitle('');
    setNoteDesc('');
    setNoteFileUrl('');
    setNoteFormat('PDF');
    setNoteSize('0.0 MB');
    setNoteMode('create');
  };

  const openEditNote = (n) => {
    setEditNote(n);
    setNoteTitle(n.title);
    setNoteDesc(n.description);
    setNoteFileUrl(n.fileUrl);
    setNoteFormat(n.format || 'PDF');
    setNoteSize(n.size || '0.0 MB');
    setNoteMode('edit');
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!noteFileUrl) {
      alert('Please upload a file or specify a file URL!');
      return;
    }
    const payload = {
      title: noteTitle,
      description: noteDesc,
      fileUrl: noteFileUrl,
      format: noteFormat,
      size: noteSize
    };
    try {
      if (noteMode === 'create') {
        const { data } = await axios.post('/api/notes', payload, { withCredentials: true });
        if (data.success) {
          alert('Note uploaded successfully!');
          fetchNotes();
          setNoteMode('list');
        }
      } else {
        const { data } = await axios.put(`/api/notes/${editNote._id}`, payload, { withCredentials: true });
        if (data.success) {
          alert('Note updated successfully!');
          fetchNotes();
          setNoteMode('list');
        }
      }
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      const { data } = await axios.delete(`/api/notes/${id}`, { withCredentials: true });
      if (data.success) {
        alert('Note deleted.');
        fetchNotes();
      }
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    }
  };

  // --- Blog CRUD Functions ---
  const openCreateBlog = () => {
    setEditBlog(null);
    setBlogTitle('');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogCoverImage('');
    setBlogTags('');
    setBlogMode('create');
  };

  const openEditBlog = (b) => {
    setEditBlog(b);
    setBlogTitle(b.title);
    setBlogExcerpt(b.excerpt || '');
    setBlogContent(b.content || '');
    setBlogCoverImage(b.coverImage || '');
    setBlogTags(b.tags?.join(', ') || '');
    setBlogMode('edit');
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: blogTitle,
      excerpt: blogExcerpt,
      content: blogContent,
      coverImage: blogCoverImage,
      tags: blogTags.split(',').map(t => t.trim()).filter(t => t)
    };
    try {
      if (blogMode === 'create') {
        const { data } = await axios.post('/api/blogs', payload, { withCredentials: true });
        if (data.success) {
          alert('Blog post created!');
          fetchBlogs();
          setBlogMode('list');
        }
      } else {
        const { data } = await axios.put(`/api/blogs/${editBlog._id}`, payload, { withCredentials: true });
        if (data.success) {
          alert('Blog post updated!');
          fetchBlogs();
          setBlogMode('list');
        }
      }
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      const { data } = await axios.delete(`/api/blogs/${id}`, { withCredentials: true });
      if (data.success) {
        alert('Blog deleted.');
        fetchBlogs();
      }
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await axios.put(`/api/messages/${id}/read`, {}, { withCredentials: true });
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(`/api/messages/${id}`, { withCredentials: true });
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'playlists', label: 'Playlists', icon: FolderOpen },
    { id: 'videos', label: 'Videos', icon: PlayCircle },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'blogs', label: 'Blogs', icon: Rss },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600', lightBg: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-600 dark:text-blue-400' },
    { label: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: 'from-purple-500 to-purple-600', lightBg: 'bg-purple-50 dark:bg-purple-900/20', textColor: 'text-purple-600 dark:text-purple-400' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'from-green-500 to-green-600', lightBg: 'bg-green-50 dark:bg-green-900/20', textColor: 'text-green-600 dark:text-green-400' },
    { label: 'Revenue', value: `$${(stats.revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'from-yellow-500 to-orange-500', lightBg: 'bg-yellow-50 dark:bg-yellow-900/20', textColor: 'text-yellow-600 dark:text-yellow-400' },
  ];

  return (
    <div className="flex h-screen bg-[var(--bg)] overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[var(--card)] border-r border-[var(--border)] flex flex-col transition-all duration-300 ease-in-out flex-shrink-0`}>
        <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} p-5 border-b border-[var(--border)]`}>
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg text-[var(--text-main)]">Admin Panel</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-[var(--bg)] text-[var(--text-muted)] transition-colors cursor-pointer">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {sidebarOpen && (
          <div className="p-5 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[var(--text-main)] truncate">{user?.name}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
                <span className="text-xs font-bold text-indigo-500 uppercase">Admin</span>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                // Reset form views when changing tab
                setCourseMode('list');
                setPlaylistMode('list');
                setVideoMode('list');
                setNoteMode('list');
                setBlogMode('list');
              }}
              className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center px-2'} py-2.5 rounded-xl font-semibold text-base transition-all duration-200 cursor-pointer
                ${activeTab === id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text-main)]'
                }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
              {sidebarOpen && activeTab === id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-[var(--border)]">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-xl text-red-500 hover:bg-red-500/10 font-semibold transition-colors cursor-pointer`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-[var(--card)] border-b border-[var(--border)] flex items-center justify-between px-6 flex-shrink-0">
          <h1 className="text-xl font-extrabold text-[var(--text-main)] capitalize">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-[var(--text-muted)] hover:text-[var(--color-primary)] font-semibold transition-colors">
              ← View Site
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[var(--bg)]">
          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map(({ label, value, icon: Icon, color, lightBg, textColor }) => (
                  <div key={label} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${lightBg} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${textColor}`} />
                      </div>
                      <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" /> +12%
                      </span>
                    </div>
                    <p className="text-4xl font-black text-[var(--text-main)] mb-1">{loadingStats ? '...' : value}</p>
                    <p className="text-[var(--text-muted)] font-semibold">{label}</p>
                  </div>
                ))}
              </div>

              {/* Dynamic Analytics Graphs */}
              {!loadingStats && stats.graphData && (
                <div className="flex flex-col lg:flex-row gap-6">
                  <RevenueChart data={stats.graphData} />
                  <RegistrationsChart data={stats.graphData} />
                </div>
              )}

              {/* Recent Users */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                  <h2 className="text-xl font-bold text-[var(--text-main)]">Recent Users</h2>
                  <button onClick={() => setActiveTab('users')} className="text-sm text-indigo-500 hover:underline font-semibold cursor-pointer">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[var(--bg)]">
                      <tr>
                        {['User', 'Email', 'Role', 'Joined'].map(h => (
                          <th key={h} className="px-6 py-4 text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {(stats.latestUsers || []).map(u => (
                        <tr key={u._id} className="hover:bg-[var(--bg)] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {u.name?.charAt(0)?.toUpperCase()}
                              </div>
                              <span className="font-semibold text-[var(--text-main)]">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[var(--text-muted)]">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${u.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{u.role}</span>
                          </td>
                          <td className="px-6 py-4 text-[var(--text-muted)]">{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {!stats.latestUsers?.length && (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-[var(--text-muted)]">No users found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === 'users' && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <h2 className="text-xl font-bold text-[var(--text-main)]">All Users ({users.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[var(--bg)]">
                    <tr>
                      {['#', 'User', 'Email', 'Role', 'Courses', 'Joined'].map(h => (
                        <th key={h} className="px-6 py-4 text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {users.map((u, idx) => (
                      <tr key={u._id} className="hover:bg-[var(--bg)] transition-colors">
                        <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {u.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <span className="font-semibold text-[var(--text-main)]">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[var(--text-muted)]">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${u.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{u.role}</span>
                        </td>
                        <td className="px-6 py-4 text-[var(--text-main)] font-semibold">{u.purchasedCourses?.length || 0}</td>
                        <td className="px-6 py-4 text-[var(--text-muted)]">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {!users.length && (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-[var(--text-muted)]">No users found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── COURSES CRUD ── */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              {courseMode === 'list' ? (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[var(--text-main)]">All Courses ({courses.length})</h2>
                    <button onClick={openCreateCourse} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer">
                      <Plus className="w-4 h-4" /> Add Course
                    </button>
                  </div>
                  <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-[var(--bg)]">
                          <tr>
                            {['Thumbnail', 'Title', 'Price', 'Level', 'Lectures', 'Actions'].map(h => (
                              <th key={h} className="px-6 py-4 text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                          {courses.map((c) => (
                            <tr key={c._id} className="hover:bg-[var(--bg)] transition-colors">
                              <td className="px-6 py-4">
                                <img 
                                  src={c.image?.startsWith('/') ? `http://localhost:5000${c.image}` : c.image} 
                                  alt={c.title} 
                                  className="w-16 h-10 object-cover rounded-lg border border-[var(--border)]"
                                  onError={(e) => { e.target.src = '/no-photo.jpg' }}
                                />
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-semibold text-[var(--text-main)]">{c.title}</p>
                                  <p className="text-xs text-[var(--text-muted)] line-clamp-1">{c.description}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-bold text-green-500">${c.price}</td>
                              <td className="px-6 py-4">
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 capitalize">{c.level}</span>
                              </td>
                              <td className="px-6 py-4 text-[var(--text-main)] font-semibold">{c.totalLectures || 0}</td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button onClick={() => openEditCourse(c)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteCourse(c._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {!courses.length && (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-[var(--text-muted)]">No courses found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 max-w-3xl mx-auto shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[var(--text-main)]">{courseMode === 'create' ? 'Create New Course' : 'Edit Course'}</h2>
                    <button onClick={() => setCourseMode('list')} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold cursor-pointer">Cancel</button>
                  </div>
                  <form onSubmit={handleCourseSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Title</label>
                        <input type="text" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} required className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" placeholder="e.g. React Mastery" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Category</label>
                        <input type="text" value={courseCategory} onChange={(e) => setCourseCategory(e.target.value)} required className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" placeholder="e.g. Web Development" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Description</label>
                      <textarea value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} required rows={4} className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" placeholder="Describe the course..."></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Price ($)</label>
                        <input type="number" value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Discount ($)</label>
                        <input type="number" value={courseDiscount} onChange={(e) => setCourseDiscount(e.target.value)} className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Level</label>
                        <select value={courseLevel} onChange={(e) => setCourseLevel(e.target.value)} className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500">
                          {['Beginner', 'Intermediate', 'Advanced', 'All Levels'].map(l => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Language</label>
                        <input type="text" value={courseLang} onChange={(e) => setCourseLang(e.target.value)} className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Duration</label>
                        <input type="text" value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)} className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" placeholder="e.g. 15 hours" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Total Lectures</label>
                        <input type="number" value={courseLectures} onChange={(e) => setCourseLectures(e.target.value)} className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>

                    <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--bg)]">
                      <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Course Thumbnail</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileUpload(e, (url) => setCourseImage(url))} 
                          className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                        />
                        {uploadingFile && <span className="text-xs text-indigo-500 animate-pulse font-semibold">Uploading...</span>}
                      </div>
                      {courseImage && (
                        <div className="mt-3">
                          <p className="text-xs text-[var(--text-muted)] mb-1">Preview:</p>
                          <img 
                            src={courseImage.startsWith('/') ? `http://localhost:5000${courseImage}` : courseImage} 
                            alt="preview" 
                            className="w-32 h-20 object-cover rounded-lg border border-[var(--border)]"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isPremium" checked={coursePremium} onChange={(e) => setCoursePremium(e.target.checked)} className="w-5 h-5 rounded accent-indigo-600" />
                      <label htmlFor="isPremium" className="text-sm font-bold text-[var(--text-main)] cursor-pointer">Premium Course (Requires Purchase)</label>
                    </div>

                    <button type="submit" disabled={uploadingFile} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3.5 px-4 rounded-xl hover:opacity-90 transition-opacity cursor-pointer">
                      {courseMode === 'create' ? 'Publish Course' : 'Update Course'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ── PLAYLISTS CRUD ── */}
          {activeTab === 'playlists' && (
            <div className="space-y-6">
              {playlistMode === 'list' ? (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[var(--text-main)]">All Playlists ({playlists.length})</h2>
                    <button onClick={openCreatePlaylist} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer">
                      <Plus className="w-4 h-4" /> Create Playlist
                    </button>
                  </div>
                  <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-[var(--bg)]">
                          <tr>
                            {['Thumbnail', 'Title', 'Category', 'Tags', 'Actions'].map(h => (
                              <th key={h} className="px-6 py-4 text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                          {playlists.map((p) => (
                            <tr key={p._id} className="hover:bg-[var(--bg)] transition-colors">
                              <td className="px-6 py-4">
                                <img 
                                  src={p.thumbnail?.startsWith('/') ? `http://localhost:5000${p.thumbnail}` : p.thumbnail} 
                                  alt={p.title} 
                                  className="w-16 h-10 object-cover rounded-lg border border-[var(--border)]"
                                  onError={(e) => { e.target.src = '/no-thumbnail.jpg' }}
                                />
                              </td>
                              <td className="px-6 py-4 font-semibold text-[var(--text-main)]">{p.title}</td>
                              <td className="px-6 py-4 text-[var(--text-muted)]">{p.category}</td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                  {p.tags?.map(t => (
                                    <span key={t} className="text-xs bg-slate-100 dark:bg-slate-800 text-[var(--text-muted)] px-2 py-0.5 rounded">{t}</span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button onClick={() => openEditPlaylist(p)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeletePlaylist(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {!playlists.length && (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-[var(--text-muted)]">No playlists found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 max-w-3xl mx-auto shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[var(--text-main)]">{playlistMode === 'create' ? 'Create Playlist' : 'Edit Playlist'}</h2>
                    <button onClick={() => setPlaylistMode('list')} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold cursor-pointer">Cancel</button>
                  </div>
                  <form onSubmit={handlePlaylistSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Title</label>
                        <input type="text" value={playlistTitle} onChange={(e) => setPlaylistTitle(e.target.value)} required className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" placeholder="e.g. JS Cheatsheets" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Category</label>
                        <input type="text" value={playlistCategory} onChange={(e) => setPlaylistCategory(e.target.value)} required className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" placeholder="e.g. JavaScript" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Description</label>
                      <textarea value={playlistDesc} onChange={(e) => setPlaylistDesc(e.target.value)} required rows={4} className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" placeholder="Description..."></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Tags (Comma-separated)</label>
                      <input type="text" value={playlistTags} onChange={(e) => setPlaylistTags(e.target.value)} className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" placeholder="e.g. javascript, beginners, tutorials" />
                    </div>

                    <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--bg)]">
                      <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Playlist Thumbnail</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleFileUpload(e, (url) => setPlaylistThumbnail(url))} 
                          className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                        />
                        {uploadingFile && <span className="text-xs text-indigo-500 animate-pulse font-semibold">Uploading...</span>}
                      </div>
                      {playlistThumbnail && (
                        <div className="mt-3">
                          <p className="text-xs text-[var(--text-muted)] mb-1">Preview:</p>
                          <img 
                            src={playlistThumbnail.startsWith('/') ? `http://localhost:5000${playlistThumbnail}` : playlistThumbnail} 
                            alt="preview" 
                            className="w-32 h-20 object-cover rounded-lg border border-[var(--border)]"
                          />
                        </div>
                      )}
                    </div>

                    <button type="submit" disabled={uploadingFile} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3.5 px-4 rounded-xl hover:opacity-90 transition-opacity cursor-pointer">
                      {playlistMode === 'create' ? 'Create Playlist' : 'Update Playlist'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ── VIDEOS CRUD ── */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              {videoMode === 'list' ? (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[var(--text-main)]">All Videos ({videos.length})</h2>
                    <button onClick={openCreateVideo} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer">
                      <Plus className="w-4 h-4" /> Upload Video
                    </button>
                  </div>
                  <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-[var(--bg)]">
                          <tr>
                            {['Order', 'Title', 'Assigned To', 'Duration', 'Preview', 'Actions'].map(h => (
                              <th key={h} className="px-6 py-4 text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                          {videos.map((v) => (
                            <tr key={v._id} className="hover:bg-[var(--bg)] transition-colors">
                              <td className="px-6 py-4 font-semibold text-[var(--text-muted)]">{v.order}</td>
                              <td className="px-6 py-4 font-semibold text-[var(--text-main)]">{v.title}</td>
                              <td className="px-6 py-4">
                                {v.course ? (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-bold">Course: {v.course.title || 'Loading...'}</span>
                                ) : v.playlist ? (
                                  <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full font-bold">Playlist</span>
                                ) : (
                                  <span className="text-xs text-[var(--text-muted)] font-bold">Unassigned</span>
                                )}
                              </td>
                              <td className="px-6 py-4 font-medium">{v.duration} mins</td>
                              <td className="px-6 py-4">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${v.isFreePreview ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>{v.isFreePreview ? 'Free' : 'Locked'}</span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button onClick={() => openEditVideo(v)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteVideo(v._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {!videos.length && (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-[var(--text-muted)]">No videos found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 max-w-3xl mx-auto shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[var(--text-main)]">{videoMode === 'create' ? 'Upload Video' : 'Edit Video'}</h2>
                    <button onClick={() => setVideoMode('list')} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold cursor-pointer">Cancel</button>
                  </div>
                  <form onSubmit={handleVideoSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Video Title</label>
                        <input type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} required className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" placeholder="e.g. Getting Started" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Video URL (YouTube embed or file URL)</label>
                        <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" placeholder="e.g. https://www.youtube.com/watch?v=..." />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Description</label>
                      <textarea value={videoDesc} onChange={(e) => setVideoDesc(e.target.value)} required rows={4} className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" placeholder="Video description..."></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Duration (mins)</label>
                        <input type="text" value={videoDuration} onChange={(e) => setVideoDuration(e.target.value)} className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" placeholder="e.g. 15" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Order (Sequence Index)</label>
                        <input type="number" value={videoOrder} onChange={(e) => setVideoOrder(e.target.value)} required className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="flex items-center pt-8">
                        <input type="checkbox" id="isPreview" checked={videoIsPreview} onChange={(e) => setVideoIsPreview(e.target.checked)} className="w-5 h-5 rounded accent-indigo-600" />
                        <label htmlFor="isPreview" className="text-sm font-bold text-[var(--text-main)] ml-2 cursor-pointer">Free Preview</label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Assign to Course</label>
                        <select value={videoCourseId} onChange={(e) => setVideoCourseId(e.target.value)} className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500">
                          <option value="">-- Select Course (Optional) --</option>
                          {courses.map(c => (
                            <option key={c._id} value={c._id}>{c.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Assign to Playlist</label>
                        <select value={videoPlaylistId} onChange={(e) => setVideoPlaylistId(e.target.value)} className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500">
                          <option value="">-- Select Playlist (Optional) --</option>
                          {playlists.map(p => (
                            <option key={p._id} value={p._id}>{p.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3.5 px-4 rounded-xl hover:opacity-90 transition-opacity cursor-pointer">
                      {videoMode === 'create' ? 'Save Video' : 'Update Video'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ── NOTES CRUD ── */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              {noteMode === 'list' ? (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[var(--text-main)]">All Notes ({notes.length})</h2>
                    <button onClick={openCreateNote} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer">
                      <Plus className="w-4 h-4" /> Upload Note
                    </button>
                  </div>
                  <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-[var(--bg)]">
                          <tr>
                            {['Title', 'Format', 'Size', 'Uploaded At', 'Actions'].map(h => (
                              <th key={h} className="px-6 py-4 text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                          {notes.map((n) => (
                            <tr key={n._id} className="hover:bg-[var(--bg)] transition-colors">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-semibold text-[var(--text-main)]">{n.title}</p>
                                  <p className="text-xs text-[var(--text-muted)] line-clamp-1">{n.description}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-xs font-bold px-2.5 py-1 bg-red-100 text-red-700 rounded-lg">{n.format}</span>
                              </td>
                              <td className="px-6 py-4 text-[var(--text-main)] font-semibold">{n.size}</td>
                              <td className="px-6 py-4 text-[var(--text-muted)]">{new Date(n.createdAt).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button onClick={() => openEditNote(n)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteNote(n._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {!notes.length && (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-[var(--text-muted)]">No notes uploaded yet.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 max-w-3xl mx-auto shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[var(--text-main)]">{noteMode === 'create' ? 'Upload Note Document' : 'Edit Note'}</h2>
                    <button onClick={() => setNoteMode('list')} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold cursor-pointer">Cancel</button>
                  </div>
                  <form onSubmit={handleNoteSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Note Title</label>
                      <input type="text" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} required className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" placeholder="e.g. JS Cheatsheet" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Description</label>
                      <textarea value={noteDesc} onChange={(e) => setNoteDesc(e.target.value)} required rows={4} className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" placeholder="Describe the contents of the note..."></textarea>
                    </div>

                    <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--bg)]">
                      <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Upload Document File (PDF, DOCX, ZIP)</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="file" 
                          accept=".pdf,.docx,.zip,.txt,.rar" 
                          onChange={(e) => handleFileUpload(e, (url, size) => {
                            setNoteFileUrl(url);
                            setNoteSize(size);
                            const ext = url.split('.').pop().toUpperCase();
                            setNoteFormat(ext);
                          })} 
                          className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                        />
                        {uploadingFile && <span className="text-xs text-indigo-500 animate-pulse font-semibold">Uploading...</span>}
                      </div>
                      {noteFileUrl && (
                        <div className="mt-3 text-sm text-[var(--text-main)] font-semibold flex items-center gap-2">
                          <FileCheck className="w-5 h-5 text-green-500" />
                          <span>File Ready: {noteFileUrl.split('/').pop()} ({noteSize})</span>
                        </div>
                      )}
                    </div>

                    <button type="submit" disabled={uploadingFile} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3.5 px-4 rounded-xl hover:opacity-90 transition-opacity cursor-pointer">
                      {noteMode === 'create' ? 'Publish Note' : 'Update Note'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ── BLOGS CRUD ── */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              {blogMode === 'list' ? (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[var(--text-main)]">All Blog Posts ({blogs.length})</h2>
                    <button onClick={openCreateBlog} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer">
                      <Plus className="w-4 h-4" /> New Post
                    </button>
                  </div>
                  <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-[var(--bg)]">
                          <tr>
                            {['Cover', 'Title', 'Excerpt', 'Tags', 'Date', 'Actions'].map(h => (
                              <th key={h} className="px-6 py-4 text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                          {blogs.map((b) => (
                            <tr key={b._id} className="hover:bg-[var(--bg)] transition-colors">
                              <td className="px-6 py-4">
                                {b.coverImage ? (
                                  <img src={b.coverImage.startsWith('/') ? `http://localhost:5000${b.coverImage}` : b.coverImage} alt={b.title} className="w-16 h-10 object-cover rounded-lg border border-[var(--border)]" onError={(e) => { e.target.src = '/no-photo.jpg' }} />
                                ) : (
                                  <div className="w-16 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Rss className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 font-semibold text-[var(--text-main)] max-w-[200px]">
                                <p className="line-clamp-2">{b.title}</p>
                              </td>
                              <td className="px-6 py-4 text-[var(--text-muted)] max-w-[200px]">
                                <p className="text-sm line-clamp-2">{b.excerpt}</p>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                  {b.tags?.slice(0, 2).map(t => (
                                    <span key={t} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">{t}</span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{new Date(b.createdAt).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button onClick={() => openEditBlog(b)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteBlog(b._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {!blogs.length && (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-[var(--text-muted)]">No blog posts yet.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 max-w-3xl mx-auto shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[var(--text-main)]">{blogMode === 'create' ? 'Create Blog Post' : 'Edit Blog Post'}</h2>
                    <button onClick={() => setBlogMode('list')} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold cursor-pointer">Cancel</button>
                  </div>
                  <form onSubmit={handleBlogSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Title</label>
                      <input type="text" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} required className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" placeholder="Blog post title..." />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Excerpt (Short Summary)</label>
                      <textarea value={blogExcerpt} onChange={(e) => setBlogExcerpt(e.target.value)} required rows={2} className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" placeholder="A short description shown on the blog list page..."></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Content (HTML supported)</label>
                      <textarea value={blogContent} onChange={(e) => setBlogContent(e.target.value)} required rows={10} className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] font-mono text-sm focus:outline-none focus:border-indigo-500" placeholder="Full article content. You may use HTML tags for rich formatting..."></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--bg)]">
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Cover Image</label>
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setBlogCoverImage(url))} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
                        {uploadingFile && <span className="text-xs text-indigo-500 animate-pulse font-semibold">Uploading...</span>}
                        {blogCoverImage && (
                          <img src={blogCoverImage.startsWith('/') ? `http://localhost:5000${blogCoverImage}` : blogCoverImage} alt="cover preview" className="mt-3 w-full h-24 object-cover rounded-lg" />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Tags (Comma-separated)</label>
                        <input type="text" value={blogTags} onChange={(e) => setBlogTags(e.target.value)} className="w-full p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:border-indigo-500" placeholder="e.g. react, javascript, tutorial" />
                      </div>
                    </div>

                    <button type="submit" disabled={uploadingFile} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3.5 px-4 rounded-xl hover:opacity-90 transition-opacity cursor-pointer">
                      {blogMode === 'create' ? 'Publish Post' : 'Update Post'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === 'orders' && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
                <h2 className="text-xl font-bold text-[var(--text-main)]">Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[var(--bg)]">
                    <tr>
                      {['User', 'Course', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                        <th key={h} className="px-6 py-4 text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {(stats.latestOrders || []).map((o) => (
                      <tr key={o._id} className="hover:bg-[var(--bg)] transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[var(--text-main)]">{o.user?.name || 'Unknown student'}</p>
                          <p className="text-xs text-[var(--text-muted)]">{o.user?.email || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4 font-medium text-[var(--text-main)]">{o.course?.title || 'Course details unavailable'}</td>
                        <td className="px-6 py-4 font-bold text-green-500">${o.amount}</td>
                        <td className="px-6 py-4 capitalize text-[var(--text-muted)] font-semibold">{o.paymentMethod}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${o.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.paymentStatus}</span>
                        </td>
                        <td className="px-6 py-4 text-[var(--text-muted)]">{new Date(o.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {!stats.latestOrders?.length && (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-[var(--text-muted)]">No orders yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── MESSAGES ── */}
          {activeTab === 'messages' && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
                <h2 className="text-xl font-bold text-[var(--text-main)]">Contact Messages ({messages.length})</h2>
                <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">{messages.filter(m => !m.isRead).length} Unread</span>
              </div>
              {messages.length > 0 ? (
                <div className="divide-y divide-[var(--border)]">
                  {messages.map((msg) => (
                    <div key={msg._id} className={`p-6 hover:bg-[var(--bg)] transition-colors ${!msg.isRead ? 'border-l-4 border-indigo-500' : ''}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                              {msg.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-[var(--text-main)]">{msg.name}</p>
                              <p className="text-xs text-[var(--text-muted)]">{msg.email}</p>
                            </div>
                            {!msg.isRead && <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">New</span>}
                          </div>
                          <p className="font-semibold text-[var(--text-main)] mb-1">{msg.subject}</p>
                          <p className="text-[var(--text-muted)] text-sm leading-relaxed">{msg.message}</p>
                          <p className="text-xs text-[var(--text-muted)] mt-3">{new Date(msg.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {!msg.isRead && (
                            <button onClick={() => handleMarkRead(msg._id)} title="Mark as read" className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer">
                              <CheckCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => handleDeleteMessage(msg._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-[var(--text-muted)]">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-semibold">No messages yet.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
