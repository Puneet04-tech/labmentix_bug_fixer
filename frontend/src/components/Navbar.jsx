import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-primary-500',
      'bg-accent-500',
      'bg-amethyst-500',
      'bg-accent-300',
      'bg-primary-600'
    ];
    const index = (name && name.charCodeAt(0)) ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <nav className="bg-[#0f1724] border-b border-slate-700 sticky top-0 z-10 neon-glow">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Hamburger Menu */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-slate-600 hover:text-primary-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:block ml-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tickets, projects..."
                  className="w-80 px-4 py-2 pl-10 border border-slate-700 rounded-lg bg-[#0f1724] text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right: Notifications & Profile */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg hover:bg-[#122433] transition"
              title={`Switch theme`}
            >
              {theme === 'dark' ? (
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a.75.75 0 01.75.75V4a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM14.95 4.05a.75.75 0 011.06 1.06l-1 1a.75.75 0 11-1.06-1.06l1-1zM18 10a.75.75 0 01-.75.75H16a.75.75 0 010-1.5h1.25A.75.75 0 0118 10zM14.95 15.95a.75.75 0 00-1.06 1.06l1 1a.75.75 0 101.06-1.06l-1-1zM10 16a.75.75 0 01.75.75V18a.75.75 0 01-1.5 0v-1.25A.75.75 0 0110 16zM5.05 15.95a.75.75 0 011.06 1.06l-1 1a.75.75 0 11-1.06-1.06l1-1zM4 10a.75.75 0 01-.75.75H2.5a.75.75 0 010-1.5H3.25A.75.75 0 014 10zM5.05 4.05a.75.75 0 00-1.06 1.06l1 1a.75.75 0 001.06-1.06l-1-1z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-slate-100" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293a8 8 0 11-10.586-10.586 8.001 8.001 0 0010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-300 hover:text-primary-300 hover:bg-[#122433] rounded-lg transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification Badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile Dropdown */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-slate-100 neon-text">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
              <div className={`w-10 h-10 rounded-full ${getAvatarColor(user?.name || 'User')} text-white flex items-center justify-center font-bold text-sm cursor-pointer hover:opacity-80 transition`}>
                {getInitials(user?.name || 'User')}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-[#122433] rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
