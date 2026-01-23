import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center px-6">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
          <div className="text-6xl mb-4">🔍</div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
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
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            📋 View Projects
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors font-medium border border-gray-300"
          >
            ← Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Looking for something?
          </h3>
          <ul className="text-left space-y-2 text-gray-600">
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
  );
};

export default NotFound;
