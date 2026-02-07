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
        } w-64 border-r border-blue-700/60`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
            <div className="flex items-center justify-between p-6 border-b border-blue-700/70">
              <Link to="/dashboard" className="flex items-center space-x-2 neon-text">
                <span className="text-3xl">🐛</span>
                <span className="text-xl font-bold text-cyan-400 neon-text">Bug Tracker</span>
              </Link>
            <button
              onClick={toggleSidebar}
                className="lg:hidden text-slate-600 hover:text-cyan-400"
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
