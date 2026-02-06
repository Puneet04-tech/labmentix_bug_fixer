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
        className={`fixed top-0 left-0 h-full bg-[#0b1220] shadow-xl z-30 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0 w-64`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <Link to="/dashboard" className="flex items-center space-x-2 neon-text">
                <span className="text-3xl">🐛</span>
                <span className="text-xl font-bold text-emerald-600 neon-text">Bug Tracker</span>
              </Link>
            <button
              onClick={toggleSidebar}
                className="lg:hidden text-slate-600 hover:text-emerald-600"
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
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive(item.path)
                        ? 'bg-[#122433] text-emerald-100 font-semibold'
                         : 'text-slate-100 hover:bg-[#122433]'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 px-3">
              <h3 className="px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Quick Actions
              </h3>
              <div className="space-y-1">
                <Link
                  to="/projects/create"
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className="flex items-center space-x-3 px-4 py-3 text-slate-100 hover:bg-[#122433] rounded-lg transition neon-btn neon-glow"
                >
                  <span className="text-2xl">➕</span>
                  <span>New Project</span>
                </Link>
                <Link
                  to="/tickets/create"
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className="flex items-center space-x-3 px-4 py-3 text-slate-100 hover:bg-[#122433] rounded-lg transition neon-btn neon-glow"
                >
                  <span className="text-2xl">🎟️</span>
                  <span>New Ticket</span>
                </Link>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700">
            <div className="bg-[#122433] rounded-lg p-3 text-center">
              <p className="text-xs text-slate-100 font-medium">Day 6-8 Complete!</p>
              <p className="text-xs text-slate-400 mt-1">UI Enhanced + Kanban</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
