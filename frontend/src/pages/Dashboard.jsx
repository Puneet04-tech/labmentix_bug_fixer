import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-primary-600">🐛 Bug Tracker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome,</p>
              <p className="font-medium text-gray-900">{user?.name}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Your Dashboard!
              </h2>
              <p className="text-gray-600">
                You're successfully logged in as <span className="font-semibold">{user?.email}</span>
              </p>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-3">
                ✅ Day 2: User Authentication - Complete!
              </h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  User registration with validation
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Login with JWT token authentication
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Protected routes with auth context
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Password hashing with bcrypt
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  User profile display
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-3xl font-bold text-primary-600 mb-1">0</div>
                <div className="text-sm text-gray-600">Projects</div>
                <div className="text-xs text-gray-500 mt-1">Coming in Day 3</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-3xl font-bold text-primary-600 mb-1">0</div>
                <div className="text-sm text-gray-600">Tickets</div>
                <div className="text-xs text-gray-500 mt-1">Coming in Day 4</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-3xl font-bold text-primary-600 mb-1">1</div>
                <div className="text-sm text-gray-600">Team Members</div>
                <div className="text-xs text-gray-500 mt-1">Just you for now!</div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <p>🚀 Next up: Day 3 - Project Management</p>
              <p className="mt-1">Create projects and manage your team</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
