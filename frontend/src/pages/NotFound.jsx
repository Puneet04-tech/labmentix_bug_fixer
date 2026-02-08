import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen relative">
      {/* Mossy Foggy Background */}
      <div className="fixed inset-0">
        {/* Primary Mossy Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900"></div>

        {/* Secondary Foggy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-600/40 via-emerald-500/30 to-teal-400/40"></div>

        {/* Accent Moss Layer */}
        <div className="absolute inset-0 bg-gradient-to-bl from-lime-500/25 via-green-500/20 to-emerald-500/25"></div>

        {/* Foggy Mesh Gradient */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background: `
              radial-gradient(circle at 15% 25%, rgba(16, 185, 129, 0.25) 0%, transparent 45%),
              radial-gradient(circle at 85% 15%, rgba(34, 197, 94, 0.20) 0%, transparent 40%),
              radial-gradient(circle at 35% 75%, rgba(132, 204, 22, 0.30) 0%, transparent 50%),
              radial-gradient(circle at 75% 65%, rgba(20, 184, 166, 0.18) 0%, transparent 35%),
              radial-gradient(circle at 50% 40%, rgba(56, 189, 248, 0.15) 0%, transparent 55%),
              radial-gradient(circle at 20% 85%, rgba(2, 132, 199, 0.22) 0%, transparent 45%),
              radial-gradient(circle at 90% 35%, rgba(45, 212, 191, 0.19) 0%, transparent 40%),
              radial-gradient(circle at 10% 50%, rgba(16, 185, 129, 0.24) 0%, transparent 45%),
              radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.21) 0%, transparent 40%),
              radial-gradient(circle at 60% 20%, rgba(132, 204, 22, 0.26) 0%, transparent 50%),
              radial-gradient(circle at 25% 70%, rgba(5, 150, 105, 0.17) 0%, transparent 35%),
              radial-gradient(circle at 70% 45%, rgba(20, 184, 166, 0.16) 0%, transparent 55%),
              radial-gradient(circle at 45% 85%, rgba(13, 148, 136, 0.23) 0%, transparent 45%),
              radial-gradient(circle at 95% 60%, rgba(6, 182, 212, 0.20) 0%, transparent 40%)
            `
          }}
        ></div>

        {/* Mossy Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-8"
          style={{
            backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiPgogICAgICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz4KICAgIDwvZz4KICA8L2cT4KPC9zdmc+")`,
            backgroundSize: '60px 60px'
          }}
        ></div>

        {/* Foggy Glass Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 backdrop-blur-[2px]"></div>
      </div>

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
