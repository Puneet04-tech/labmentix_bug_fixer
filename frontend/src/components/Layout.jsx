import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Bell, Search } from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { theme } = useTheme();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true); // Open sidebar on desktop by default
      } else {
        setSidebarOpen(false); // Close sidebar on mobile by default
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: {
        duration: 0.2
      }
    },
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-900 text-slate-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-80">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/50 via-green-900/40 to-teal-900/50"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.18) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.18) 0%, transparent 50%),
                           radial-gradient(circle at 40% 60%, rgba(132, 204, 22, 0.12) 0%, transparent 50%)`
        }}></div>
        {/* Foggy overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/15 backdrop-blur-[1px]"></div>
      </div>

      {/* Grain Texture Overlay */}
      <div className="fixed inset-0 opacity-15"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
             backgroundSize: '128px 128px'
           }}></div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed left-0 top-0 h-full z-40"
      >
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen ml-0 lg:ml-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-blue-900/85 backdrop-blur-2xl border-b border-blue-700/70 shadow-2xl shadow-blue-900/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <div className="flex items-center lg:hidden">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSidebar}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-blue-800/70 transition-all duration-300 shadow-lg hover:shadow-cyan-500/15"
                >
                  {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.button>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-md mx-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search projects, tickets..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-blue-600/50 rounded-xl bg-blue-800/40 text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-400/60 backdrop-blur-sm transition-all duration-300 shadow-lg shadow-blue-900/30"
                  />
                </div>
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-blue-800/70 transition-all duration-300 shadow-lg hover:shadow-amber-500/15 relative"
                >
                  <Bell className="w-5 h-5" />
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center border border-slate-900"
                  >
                    3
                  </motion.span>
                </motion.button>

                {/* User menu - handled by Navbar component */}
                <Navbar toggleSidebar={toggleSidebar} />
              </div>
            </div>
          </div>
        </header>

        {/* Breadcrumbs */}
        <div className="bg-blue-900/50 border-b border-blue-700/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumbs />
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="animate-fade-in"
            >
              {children}
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-blue-900/70 border-t border-blue-700/50 backdrop-blur-sm mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <div className="flex items-center space-x-4">
                <span>© 2024 LabMentix Bug Tracker</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Professional Issue Management</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="hidden sm:inline">All systems operational</span>
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
