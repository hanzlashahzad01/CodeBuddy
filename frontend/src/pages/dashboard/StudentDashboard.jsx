import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpen, Award, Heart, User as UserIcon,
  PlayCircle, LogOut, Settings, ChevronRight,
  Clock, Star, CheckCircle2, Menu, X, Code, Play,
  Megaphone, Video, Share2, Copy, Check
} from 'lucide-react';
import { logout, reset } from '../../features/auth/authSlice';

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Real DB states
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [playlistsProgress, setPlaylistsProgress] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Referral States
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // 1. Fetch enrolled courses
        const coursesRes = await axios.get('/api/courses');
        if (coursesRes.data.success) {
          const purchased = (coursesRes.data.data || []).filter(
            (c) => user.purchasedCourses?.includes(c._id)
          );
          setEnrolledCourses(purchased);
        }

        // 2. Fetch all playlists to get progress
        const playlistsRes = await axios.get('/api/playlists');
        if (playlistsRes.data.success) {
          const allPlaylists = playlistsRes.data.data || [];
          const progressPromises = allPlaylists.map(async (pl) => {
            try {
              const progRes = await axios.get(`/api/progress/${pl._id}`, { withCredentials: true });
              if (progRes.data.success) {
                return {
                  playlist: pl,
                  percentComplete: progRes.data.data.percentComplete || 0,
                  watchedCount: progRes.data.data.watchedVideos?.length || 0,
                };
              }
            } catch (err) {
              console.error(`Error loading progress for playlist ${pl._id}`, err);
            }
            return { playlist: pl, percentComplete: 0, watchedCount: 0 };
          });
          const settledProgress = await Promise.all(progressPromises);
          setPlaylistsProgress(settledProgress.filter((p) => p.percentComplete > 0));
        }

        // 3. Fetch announcements
        const announceRes = await axios.get('/api/announcements');
        if (announceRes.data.success) {
          setAnnouncements(announceRes.data.data || []);
        }

        // 4. Fetch live classes
        const liveRes = await axios.get('/api/live-classes', { withCredentials: true });
        if (liveRes.data.success) {
          setLiveClasses(liveRes.data.data || []);
        }

      } catch (err) {
        console.error('Error fetching dashboard details', err);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  const copyReferralLink = () => {
    if (!user?.referralCode) return;
    const shareUrl = `${window.location.origin}/register?ref=${user.referralCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'courses', label: 'Premium Courses', icon: PlayCircle },
    { id: 'playlists', label: 'My Progress', icon: Play },
    { id: 'live', label: 'Live Webinars', icon: Video },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
  ];

  const totalCertificates = playlistsProgress.filter((p) => p.percentComplete === 100).length;

  return (
    <div className="flex min-h-screen bg-[var(--bg)] relative overflow-x-hidden">
      {/* Backdrop for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[var(--color-card)] border-r border-[var(--color-border)] flex flex-col transition-transform duration-300 ease-in-out
        md:sticky md:top-0 md:h-screen md:translate-x-0 md:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-[var(--color-border)] relative flex-shrink-0">
          <button 
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-text-muted)] md:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black mb-4 shadow-xl">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <h2 className="text-xl font-extrabold text-[var(--color-text-main)] leading-tight">{user?.name}</h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">{user?.email}</p>
            <span className="mt-2 text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full uppercase tracking-wider">Student</span>
          </div>
        </div>

        {/* Stats Snapshot */}
        <div className="grid grid-cols-3 gap-px bg-[var(--color-border)] border-b border-[var(--color-border)] flex-shrink-0">
          {[
            { label: 'Courses', value: enrolledCourses.length },
            { label: 'Progress', value: `${playlistsProgress.length}` },
            { label: 'Certs', value: totalCertificates },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[var(--color-card)] p-3 text-center">
              <div className="text-xl font-black text-[var(--color-text-main)]">{value}</div>
              <div className="text-xs text-[var(--color-text-muted)] font-semibold mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-200 cursor-pointer
                ${activeTab === id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-main)]'
                }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{label}</span>
              {activeTab === id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[var(--color-border)] flex-shrink-0">
          <button
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top navigation header */}
        <header className="flex md:hidden items-center justify-between px-6 h-16 bg-[var(--color-card)] border-b border-[var(--color-border)] sticky top-0 z-30 flex-shrink-0">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-extrabold text-lg text-[var(--color-text-main)] capitalize">{activeTab}</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow p-4 sm:p-8 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* ── TAB 1: OVERVIEW ── */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Welcome Banner */}
                  <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/30">
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full" />
                    <div className="relative z-10">
                      <p className="text-indigo-200 font-medium mb-2">Welcome back 👋</p>
                      <h1 className="text-4xl font-black mb-4">
                        {user?.name?.split(' ')[0] || 'Student'}!
                      </h1>
                      <p className="text-indigo-100 text-lg mb-6 font-semibold">Continue your learning journey and build awesome projects.</p>
                      <Link to="/playlists" className="inline-block bg-white text-indigo-700 font-extrabold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
                        Watch Free Lectures 🎬
                      </Link>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { icon: BookOpen, label: 'Enrolled Courses', value: enrolledCourses.length, bg: 'bg-blue-500/10', tc: 'text-blue-500' },
                      { icon: PlayCircle, label: 'Started Playlists', value: playlistsProgress.length, bg: 'bg-indigo-500/10', tc: 'text-indigo-500' },
                      { icon: Award, label: 'Certificates Earned', value: totalCertificates, bg: 'bg-emerald-500/10', tc: 'text-emerald-500' },
                    ].map(({ icon: Icon, label, value, bg, tc }) => (
                      <div key={label} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-7 h-7 ${tc}`} />
                        </div>
                        <div>
                          <p className="text-3xl font-black text-[var(--color-text-main)]">{value}</p>
                          <p className="text-[var(--color-text-muted)] text-sm font-semibold">{label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Grid: Announcements Board & Referral Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Announcements Board */}
                    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col">
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--color-border)]">
                        <Megaphone className="w-5 h-5 text-indigo-500" />
                        <h3 className="text-lg font-bold text-[var(--color-text-main)]">Announcements Board</h3>
                      </div>
                      
                      {announcements.length === 0 ? (
                        <p className="text-sm text-[var(--color-text-muted)] py-6 text-center font-medium">No announcements published yet.</p>
                      ) : (
                        <div className="space-y-4 divide-y divide-[var(--color-border)] max-h-[300px] overflow-y-auto pr-1">
                          {announcements.map((ann, idx) => {
                            const badgeColors = ann.tag === 'Urgent' ? 'bg-red-500/10 text-red-500' : ann.tag === 'Update' ? 'bg-blue-500/10 text-blue-500' : ann.tag === 'New Course' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-400';
                            return (
                              <div key={ann._id} className={`pt-4 ${idx === 0 ? 'pt-0 border-t-0' : ''}`}>
                                <div className="flex justify-between items-start gap-2 mb-1.5">
                                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeColors}`}>
                                    {ann.tag}
                                  </span>
                                  <span className="text-[10px] text-[var(--color-text-muted)]">
                                    {new Date(ann.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold text-[var(--color-text-main)]">{ann.title}</h4>
                                <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Referral program card */}
                    {user?.referralCode && (
                      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--color-border)]">
                            <Share2 className="w-5 h-5 text-indigo-500" />
                            <h3 className="text-lg font-bold text-[var(--color-text-main)]">Refer & Earn Rewards</h3>
                          </div>
                          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed mb-6">
                            Share your referral link with friends. When they register and enroll in their first premium course, you'll earn a <span className="font-bold text-[var(--color-text-main)]">15% discount coupon token</span> automatically!
                          </p>
                          
                          {/* Code Display */}
                          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl p-4 text-center mb-6 shadow-inner">
                            <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider block font-bold">Your Referral Code</span>
                            <span className="text-2xl font-black text-[var(--color-primary)] tracking-widest mt-1 block">{user.referralCode}</span>
                          </div>
                        </div>

                        {/* Copy Link input */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Share Invite Link</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              readOnly
                              value={`${window.location.origin}/register?ref=${user.referralCode}`}
                              className="flex-grow bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--color-text-muted)] focus:outline-none"
                            />
                            <button
                              onClick={copyReferralLink}
                              className="px-4 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer"
                            >
                              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              <span>{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Playlist Progress Tracker Summary */}
                  <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-4">Recent Playlist Progress</h3>
                    {playlistsProgress.length === 0 ? (
                      <p className="text-sm text-[var(--color-text-muted)] font-medium">You haven't watched any playlist lectures yet. Open any playlist, click "Mark Complete" on lectures to start tracking progress!</p>
                    ) : (
                      <div className="space-y-4">
                        {playlistsProgress.slice(0, 3).map(({ playlist: pl, percentComplete, watchedCount }) => (
                          <div key={pl._id} className="space-y-2">
                            <div className="flex justify-between items-center text-sm font-semibold">
                              <Link to={`/playlists/${pl._id}`} className="text-[var(--color-text-main)] hover:text-[var(--color-primary)] font-bold">{pl.title}</Link>
                              <span className="text-[var(--color-primary)]">{percentComplete}%</span>
                            </div>
                            <div className="w-full h-2 bg-[var(--color-bg)] rounded-full overflow-hidden border border-[var(--color-border)]">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentComplete}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── TAB 2: PREMIUM COURSES TAB ── */}
              {activeTab === 'courses' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-extrabold text-[var(--color-text-main)]">Premium Courses Enrolled</h2>
                  {enrolledCourses.length === 0 ? (
                    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-12 text-center">
                      <PlayCircle className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
                      <p className="text-xl font-bold text-[var(--color-text-main)] mb-2">No enrolled courses</p>
                      <p className="text-[var(--color-text-muted)] mb-6">Start your first premium course and it will appear here.</p>
                      <Link to="/courses" className="inline-block px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl shadow-lg transition-colors">Browse Premium Courses</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {enrolledCourses.map((c) => (
                        <div key={c._id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-full md:w-48 h-32 bg-slate-800 flex-shrink-0">
                            {c.image && c.image !== 'no-photo.jpg' ? (
                              <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-lg font-black"><Code className="w-8 h-8 opacity-40" /></div>
                            )}
                          </div>
                          <div className="p-5 flex flex-col justify-between flex-grow">
                            <div>
                              <h3 className="font-bold text-[var(--color-text-main)] leading-snug line-clamp-1">{c.title}</h3>
                              <p className="text-xs text-[var(--color-text-muted)] mt-1">{c.category}</p>
                            </div>
                            <Link to={`/courses/${c._id}`} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[var(--color-primary)] hover:opacity-80">
                              <span>Go to Course</span>
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 3: PLAYLIST PROGRESS TAB ── */}
              {activeTab === 'playlists' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-extrabold text-[var(--color-text-main)]">My Playlist Progress</h2>
                  {playlistsProgress.length === 0 ? (
                    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-12 text-center">
                      <PlayCircle className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
                      <p className="text-xl font-bold text-[var(--color-text-main)] mb-2">No playlists started</p>
                      <p className="text-[var(--color-text-muted)] mb-6">Open free playlists and mark lectures as complete to track your progress.</p>
                      <Link to="/playlists" className="inline-block px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl shadow-lg transition-colors">Explore Playlists</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {playlistsProgress.map(({ playlist: pl, percentComplete, watchedCount }) => (
                        <div key={pl._id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                          <h3 className="font-bold text-[var(--color-text-main)] leading-snug line-clamp-1">{pl.title}</h3>
                          <p className="text-xs text-[var(--color-text-muted)] mt-1 mb-4">{pl.category}</p>
                          <div className="flex justify-between items-center text-sm font-semibold mb-2">
                            <span>Progress</span>
                            <span className="text-[var(--color-primary)]">{percentComplete}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-[var(--color-bg)] rounded-full overflow-hidden border border-[var(--color-border)] mb-4">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentComplete}%` }} />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-[var(--color-text-muted)]">{watchedCount} / {pl.videoCount || pl.videos?.length || 0} Videos</span>
                            <Link to={`/playlists/${pl._id}`} className="text-sm font-bold text-[var(--color-primary)] hover:opacity-85">Continue Learning →</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 4: LIVE WEBINARS TAB ── */}
              {activeTab === 'live' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-extrabold text-[var(--color-text-main)]">Live Scheduled Webinars</h2>
                  
                  {liveClasses.length === 0 ? (
                    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-12 text-center">
                      <Video className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
                      <p className="text-xl font-bold text-[var(--color-text-main)] mb-2">No live classes scheduled</p>
                      <p className="text-[var(--color-text-muted)] max-w-sm mx-auto">There are no upcoming live training sessions or webinars scheduled at the moment. Check back soon!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {liveClasses.map((cls) => {
                        const schedDate = new Date(cls.scheduledAt);
                        const isUpcoming = schedDate > new Date();
                        return (
                          <div key={cls._id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${isUpcoming ? 'bg-indigo-500/10 text-indigo-500' : 'bg-red-500/10 text-red-500'}`}>
                                  {isUpcoming ? 'Upcoming Live' : 'Ongoing / Live Now'}
                                </span>
                              </div>
                              <h3 className="text-lg font-bold text-[var(--color-text-main)]">{cls.title}</h3>
                              <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">{cls.description}</p>
                              <div className="mt-4 bg-[var(--color-bg)] border border-[var(--color-border)] p-3 rounded-xl text-xs font-semibold text-[var(--color-text-muted)]">
                                📅 {schedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {schedDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            
                            <a
                              href={cls.joinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-6 w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-center font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Video className="w-4 h-4 fill-white" />
                              <span>Join Meeting 🎥</span>
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 5: CERTIFICATES TAB ── */}
              {activeTab === 'certificates' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-extrabold text-[var(--color-text-main)]">My Certificates</h2>
                  {totalCertificates === 0 ? (
                    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-12 text-center">
                      <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                      <p className="text-xl font-bold text-[var(--color-text-main)] mb-2">No certificates yet</p>
                      <p className="text-[var(--color-text-muted)] mb-6">Complete a full playlist (100% progress) and pass its assessment to unlock your certificate.</p>
                      <Link to="/playlists" className="text-indigo-500 font-extrabold hover:underline text-lg">Browse Free Playlists →</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {playlistsProgress.filter((p) => p.percentComplete === 100).map(({ playlist: pl }) => (
                        <div key={pl._id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm border-l-4 border-l-amber-500 flex flex-col justify-between">
                          <div>
                            <Award className="w-8 h-8 text-amber-500 mb-2" />
                            <h3 className="font-bold text-[var(--color-text-main)] leading-snug line-clamp-2">{pl.title} Certificate</h3>
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">Earned on CodeBuddy Academy</p>
                          </div>
                          <Link to={`/playlists/${pl._id}`} className="mt-6 w-full py-2.5 text-center bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black text-xs rounded-xl hover:opacity-90 transition-opacity">
                            Download Certificate 🏆
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 6: PROFILE TAB ── */}
              {activeTab === 'profile' && (
                <div className="space-y-8 max-w-2xl">
                  <h2 className="text-3xl font-extrabold text-[var(--color-text-main)]">Profile Settings</h2>
                  <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8 shadow-sm space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-xl">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-2xl font-extrabold text-[var(--color-text-main)]">{user?.name}</h3>
                        <p className="text-[var(--color-text-muted)]">{user?.email}</p>
                      </div>
                    </div>

                    <div className="border-t border-[var(--color-border)] pt-6 space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-[var(--color-text-muted)] mb-2">Full Name</label>
                        <input
                          defaultValue={user?.name}
                          className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-main)] font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[var(--color-text-muted)] mb-2">Email Address</label>
                        <input
                          defaultValue={user?.email}
                          disabled
                          className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)] font-medium cursor-not-allowed"
                        />
                      </div>
                      <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg cursor-pointer">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
