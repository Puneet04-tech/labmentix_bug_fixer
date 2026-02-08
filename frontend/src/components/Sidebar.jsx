import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { name: 'Projects', icon: '📁', path: '/projects' },
    { name: 'Tickets', icon: '🎫', path: '/tickets' },
    { name: 'Kanban Board', icon: '📋', path: '/kanban' },
    { name: 'AI Analytics', icon: '🤖', path: '/analytics' },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-blue-900/95 backdrop-blur-2xl shadow-2xl z-30 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 border-r border-blue-700/60 relative overflow-hidden`}
      >
        {/* Premium Flowing Ribbon Elements - Whole Sidebar Coverage */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          {/* Whole Sidebar Ribbon Coverage */}
          <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-r from-cyan-500/12 via-blue-500/10 to-indigo-500/11 transform -rotate-6 blur-sm"></div>
          <div className="absolute top-1/6 left-0 w-full h-1/4 bg-gradient-to-r from-purple-500/10 via-violet-500/8 to-fuchsia-500/9 transform rotate-3 blur-sm"></div>
          <div className="absolute top-1/3 left-0 w-full h-1/4 bg-gradient-to-r from-emerald-400/9 via-teal-400/7 to-cyan-400/8 transform -rotate-2 blur-sm"></div>
          <div className="absolute top-1/2 left-0 w-full h-1/4 bg-gradient-to-r from-amber-500/11 via-orange-500/9 to-red-500/10 transform rotate-4 blur-sm"></div>
          <div className="absolute top-2/3 left-0 w-full h-1/4 bg-gradient-to-r from-blue-500/8 via-cyan-400/6 to-teal-400/7 transform -rotate-5 blur-sm"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-r from-yellow-500/10 via-amber-400/8 to-orange-500/9 transform rotate-1 blur-sm"></div>

          {/* Additional overlay ribbons for depth */}
          <div className="absolute top-1/4 right-0 w-3/4 h-1/6 bg-gradient-to-l from-rose-500/8 via-pink-500/6 to-fuchsia-500/7 transform rotate-8 translate-x-2 blur-sm"></div>
          <div className="absolute bottom-1/4 right-0 w-2/3 h-1/5 bg-gradient-to-l from-violet-500/7 via-purple-500/5 to-indigo-500/6 transform -rotate-6 translate-x-1 blur-sm"></div>
        </div>

        <div className="h-full flex flex-col relative z-10">
          {/* Logo */}
            <div className="flex items-center justify-between p-6 border-b border-blue-700/70">
              <Link to="/dashboard" className="flex items-center space-x-2 neon-text relative z-10">
                <span className="text-3xl">🐛</span>
                <span className="text-xl font-bold text-cyan-400 neon-text">Bug Tracker</span>
              </Link>
            <button
              onClick={toggleSidebar}
                className="lg:hidden text-slate-600 hover:text-cyan-400 relative z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive(item.path)
                        ? 'bg-cyan-500/25 text-cyan-100 font-semibold border-l-4 border-cyan-400 shadow-lg shadow-cyan-500/15'
                         : 'text-slate-300 hover:bg-blue-800/70 hover:text-slate-100 hover:shadow-lg hover:shadow-blue-900/30'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 px-3">
              <h3 className="px-4 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-1">
                <Link
                  to="/projects/create"
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-cyan-500/25 hover:text-cyan-100 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/15"
                >
                  <span className="text-2xl">➕</span>
                  <span>New Project</span>
                </Link>
                <Link
                  to="/tickets/create"
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:bg-cyan-500/25 hover:text-cyan-100 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/15"
                >
                  <span className="text-2xl">🎟️</span>
                  <span>New Ticket</span>
                </Link>
              </div>
            </div>
          </nav>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
