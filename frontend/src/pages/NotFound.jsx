import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen relative">
      {/* Mossy Background Effects */}
      <div className="fixed inset-0 opacity-40 pointer-events-none">
        {/* Green Mossy Rings */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-radial from-emerald-400/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-20 w-80 h-80 bg-gradient-radial from-green-500/25 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-radial from-lime-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-teal-400/25 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-gradient-radial from-emerald-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-20 w-48 h-48 bg-gradient-radial from-green-400/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-radial from-lime-500/25 to-transparent rounded-full blur-3xl"></div>

        {/* Blue Mossy Rings */}
        <div className="absolute top-20 right-1/4 w-88 h-88 bg-gradient-radial from-blue-400/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-10 w-76 h-76 bg-gradient-radial from-cyan-500/25 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-68 h-68 bg-gradient-radial from-sky-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/2 right-20 w-60 h-60 bg-gradient-radial from-blue-500/25 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 right-1/2 w-52 h-52 bg-gradient-radial from-cyan-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-2/3 w-44 h-44 bg-gradient-radial from-sky-500/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-10 left-3/4 w-36 h-36 bg-gradient-radial from-blue-400/25 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Foggy Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/10 via-slate-800/5 to-slate-900/10 backdrop-blur-[1px] pointer-events-none"></div>

      {/* Flowing Ribbon Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Warm Contrasting Ribbons */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-orange-500/20 via-pink-500/15 to-purple-500/20 transform -rotate-6 translate-y-8 blur-sm"></div>
        <div className="absolute top-1/4 right-0 w-full h-24 bg-gradient-to-l from-red-500/18 via-orange-400/12 to-yellow-500/15 transform rotate-3 translate-y-6 blur-sm"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-28 bg-gradient-to-r from-purple-500/16 via-pink-400/14 to-red-500/18 transform -rotate-2 translate-y-4 blur-sm"></div>
        <div className="absolute bottom-0 right-0 w-full h-36 bg-gradient-to-l from-yellow-500/20 via-orange-500/15 to-red-400/18 transform rotate-5 translate-y-10 blur-sm"></div>
        <div className="absolute top-1/2 left-1/4 w-3/4 h-20 bg-gradient-to-r from-pink-500/14 via-purple-500/12 to-orange-500/16 transform rotate-1 translate-y-2 blur-sm"></div>
      </div>

      {/* Grain Texture Overlay */}
      <div className="fixed inset-0 opacity-15 pointer-events-none"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
             backgroundSize: '128px 128px'
           }}></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
      <div className="text-center px-6">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
          <div className="text-6xl mb-4">🔍</div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-slate-100 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🏠 Go Home
          </Link>
          <Link
            to="/projects"
            className="px-6 py-3 bg-[#122433] text-slate-100 rounded-lg hover:bg-[#0f1724] transition-colors font-medium"
          >
            📋 View Projects
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-[#0f1724] text-slate-100 rounded-lg hover:bg-[#122433] transition-colors font-medium border border-slate-700"
          >
            ← Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-[#0f1724] rounded-lg shadow-md max-w-lg mx-auto">
          <h3 className="text-lg font-semibold text-slate-100 mb-3">
            Looking for something?
          </h3>
          <ul className="text-left space-y-2 text-slate-400">
            <li>
              <Link to="/dashboard" className="text-blue-600 hover:underline">
                📊 Dashboard
              </Link> - View your overview
            </li>
            <li>
              <Link to="/projects" className="text-blue-600 hover:underline">
                📁 Projects
              </Link> - Manage your projects
            </li>
            <li>
              <Link to="/tickets" className="text-blue-600 hover:underline">
                🎫 Tickets
              </Link> - View all tickets
            </li>
            <li>
              <Link to="/kanban" className="text-blue-600 hover:underline">
                📋 Kanban Board
              </Link> - Track progress
            </li>
          </ul>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-sm text-gray-500">
          If you believe this is an error, please contact support.
        </p>
      </div>
      </div>
    </div>
  );
};

export default NotFound;
