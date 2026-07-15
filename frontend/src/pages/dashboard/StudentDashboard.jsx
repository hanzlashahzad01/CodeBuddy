import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpen, Award, Heart, User as UserIcon,
  PlayCircle, LogOut, Settings, ChevronRight,
  Clock, Star, Download, CheckCircle, Menu, X
} from 'lucide-react';
import { logout, reset } from '../../features/auth/authSlice';

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user?.purchasedCourses?.length > 0) {
      const fetchCourses = async () => {
        setLoadingCourses(true);
        try {
          const { data } = await axios.get('/api/courses', { withCredentials: true });
          if (data.success) {
            const purchased = data.data.filter(c => user.purchasedCourses.includes(c._id));
            setEnrolledCourses(purchased);
          }
        } catch (err) {
          console.error(err);
        }
        setLoadingCourses(false);
      };
      fetchCourses();
    }
  }, [user]);


  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'courses', label: 'My Courses', icon: PlayCircle },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

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
        fixed inset-y-0 left-0 z-50 w-72 bg-[var(--card)] border-r border-[var(--border)] flex flex-col transition-transform duration-300 ease-in-out
        md:sticky md:top-0 md:h-screen md:translate-x-0 md:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Profile */}
        <div className="p-6 border-b border-[var(--border)] relative">
          {/* Close button inside sidebar on mobile */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--bg)] text-[var(--text-muted)] md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black mb-4 shadow-xl">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <h2 className="text-xl font-extrabold text-[var(--text-main)]">{user?.name}</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">{user?.email}</p>
            <span className="mt-2 text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full uppercase tracking-wider">Student</span>
          </div>
        </div>

        {/* Stats Snapshot */}
        <div className="grid grid-cols-3 gap-px bg-[var(--border)] border-b border-[var(--border)]">
          {[
            { label: 'Courses', value: user?.purchasedCourses?.length || 0 },
            { label: 'Certs', value: 0 },
            { label: 'Rating', value: '5.0' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[var(--card)] p-3 text-center">
              <div className="text-2xl font-black text-[var(--text-main)]">{value}</div>
              <div className="text-xs text-[var(--text-muted)] font-semibold mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-200
                ${activeTab === id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text-main)]'
                }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{label}</span>
              {activeTab === id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[var(--border)]">
          <button
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 font-semibold transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top navigation header */}
        <header className="flex md:hidden items-center justify-between px-6 h-16 bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-30 flex-shrink-0">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-extrabold text-lg text-[var(--text-main)] capitalize">{activeTab}</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {/* ── OVERVIEW ── */}
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
                  <p className="text-indigo-100 text-lg mb-6">Continue your learning journey and achieve your goals.</p>
                  <Link to="/courses" className="inline-block bg-white text-indigo-700 font-extrabold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
                    Explore Courses →
                  </Link>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: BookOpen, label: 'Enrolled Courses', value: user?.purchasedCourses?.length || 0, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', tc: 'text-blue-600' },
                  { icon: Award, label: 'Certificates', value: 0, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50', tc: 'text-yellow-600' },
                  { icon: Clock, label: 'Hours Learned', value: '0h', color: 'from-green-500 to-teal-500', bg: 'bg-green-50', tc: 'text-green-600' },
                ].map(({ icon: Icon, label, value, bg, tc }) => (
                  <div key={label} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-7 h-7 ${tc}`} />
                    </div>
                    <div>
                      <p className="text-4xl font-black text-[var(--text-main)]">{value}</p>
                      <p className="text-[var(--text-muted)] font-semibold">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State — No Courses */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-10 text-center shadow-sm">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-main)] mb-3">No courses yet</h3>
                <p className="text-[var(--text-muted)] text-lg mb-6 max-w-md mx-auto">
                  You haven't enrolled in any course. Browse our premium courses and start learning today!
                </p>
                <Link to="/courses" className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg">
                  Browse Courses
                </Link>
              </div>
            </div>
          )}

          {/* ── MY COURSES ── */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-[var(--text-main)]">My Courses</h2>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-12 text-center">
                <PlayCircle className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
                <p className="text-xl font-bold text-[var(--text-main)] mb-2">No enrolled courses</p>
                <p className="text-[var(--text-muted)] mb-6">Start your first course and it will appear here.</p>
                <Link to="/courses" className="text-indigo-500 font-extrabold hover:underline text-lg">Browse Premium Courses →</Link>
              </div>
            </div>
          )}

          {/* ── WISHLIST ── */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-[var(--text-main)]">My Wishlist</h2>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-12 text-center">
                <Heart className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                <p className="text-xl font-bold text-[var(--text-main)] mb-2">Your wishlist is empty</p>
                <p className="text-[var(--text-muted)] mb-6">Save courses you want to take later.</p>
                <Link to="/courses" className="text-indigo-500 font-extrabold hover:underline text-lg">Explore Courses →</Link>
              </div>
            </div>
          )}

          {/* ── CERTIFICATES ── */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-[var(--text-main)]">My Certificates</h2>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-12 text-center">
                <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <p className="text-xl font-bold text-[var(--text-main)] mb-2">No certificates yet</p>
                <p className="text-[var(--text-muted)] mb-6">Complete a course to earn your certificate of completion.</p>
                <Link to="/courses" className="text-indigo-500 font-extrabold hover:underline text-lg">Start Learning →</Link>
              </div>
            </div>
          )}

          {/* ── PROFILE ── */}
          {activeTab === 'profile' && (
            <div className="space-y-8 max-w-2xl">
              <h2 className="text-3xl font-extrabold text-[var(--text-main)]">Profile Settings</h2>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-sm space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-xl">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-[var(--text-main)]">{user?.name}</h3>
                    <p className="text-[var(--text-muted)]">{user?.email}</p>
                    <button className="mt-2 text-sm text-indigo-500 font-bold hover:underline">Change Avatar</button>
                  </div>
                </div>

                <div className="border-t border-[var(--border)] pt-6 space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Full Name</label>
                    <input
                      defaultValue={user?.name}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text-main)] font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Email Address</label>
                    <input
                      defaultValue={user?.email}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)] font-medium cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">Bio</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us a bit about yourself..."
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--text-main)] font-medium focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    />
                  </div>
                  <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
