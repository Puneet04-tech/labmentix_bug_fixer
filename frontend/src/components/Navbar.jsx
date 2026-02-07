import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Settings,
  Shield,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600'
    ];
    const index = (name && name.charCodeAt(0)) ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="p-2.5 text-slate-400 hover:text-amber-400 hover:bg-blue-800/70 rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/15"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </motion.button>

      {/* Admin Panel */}
      {user?.role === 'admin' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/admin"
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white rounded-xl transition-all duration-300 shadow-xl hover:shadow-cyan-500/30 font-medium"
          >
            <Shield className="w-4 h-4" />
            <span className="font-medium hidden xl:block">Admin</span>
          </Link>
        </motion.div>
      )}

      {/* Profile Menu */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center space-x-3 p-2.5 hover:bg-blue-800/70 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-900/30"
        >
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getAvatarColor(user?.name || 'User')} text-white flex items-center justify-center font-bold text-sm shadow-lg`}>
            {getInitials(user?.name || 'User')}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
        </motion.button>

        {/* Profile Dropdown */}
        {showProfileMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowProfileMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-64 bg-blue-800/95 backdrop-blur-2xl border border-blue-700/70 rounded-2xl shadow-2xl py-3 z-20"
            >
              <div className="px-4 py-3 border-b border-blue-700/70">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>

              <Link
                to="/profile"
                className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-blue-700/70 hover:text-slate-100 transition-all duration-300 rounded-lg mx-2"
                onClick={() => setShowProfileMenu(false)}
              >
                <User className="w-4 h-4" />
                <span>Profile Settings</span>
              </Link>

              <Link
                to="/settings"
                className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-blue-700/70 hover:text-slate-100 transition-all duration-300 rounded-lg mx-2"
                onClick={() => setShowProfileMenu(false)}
              >
                <Settings className="w-4 h-4" />
                <span>Preferences</span>
              </Link>

              <div className="border-t border-blue-700/70 mt-2 pt-2">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
