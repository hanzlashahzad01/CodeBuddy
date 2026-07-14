import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';
import { Code2, LogOut, User as UserIcon, Moon, Sun, Search } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <nav className="bg-[var(--color-card)] border-b border-[var(--color-border)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Links */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--color-primary)] shadow-sm bg-white flex items-center justify-center flex-shrink-0">
                <img src="/codebuddy_avatar.jpg" alt="CodeBuddy Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-2xl text-[var(--color-text-main)] tracking-tight">CodeBuddy</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/playlists" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] px-3 py-2 text-lg font-medium transition-colors">Playlists</Link>
              <Link to="/tutorials" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] px-3 py-2 text-lg font-medium transition-colors">Tutorials</Link>
              <Link to="/courses" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] px-3 py-2 text-lg font-medium transition-colors">Premium</Link>
              <Link to="/blogs" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] px-3 py-2 text-lg font-medium transition-colors">Blog</Link>
            </div>
          </div>

          {/* Search, Theme Toggle, & Auth */}
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, blogs..." 
                className="pl-10 pr-4 py-2 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-primary)]"
              />
              <button type="submit" className="absolute left-3 top-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
              {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-[var(--color-text-main)] hover:text-[var(--color-primary)] transition-colors">
                  <UserIcon className="w-7 h-7" />
                </Link>
                <button 
                  onClick={onLogout}
                  className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 text-base font-semibold"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-[var(--color-text-main)] hover:text-[var(--color-primary)] px-3 py-2 text-lg font-medium transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-2.5 rounded-lg text-lg font-semibold shadow-md transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
