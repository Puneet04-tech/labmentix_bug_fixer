import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen relative">
      {/* Desktop Picture Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
        {/* Desktop-like gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-300/20 via-transparent to-blue-200/10"></div>
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
