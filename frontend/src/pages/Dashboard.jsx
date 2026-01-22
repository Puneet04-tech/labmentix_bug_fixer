import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { useTicket } from '../context/TicketContext';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const { user } = useAuth();
  const { projects } = useProject();
  const { tickets } = useTicket();
  const [selectedProject, setSelectedProject] = useState('all');

  // Calculate quick stats
  const totalTickets = tickets.length;
  const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;
  const completedTickets = tickets.filter(t => ['Resolved', 'Closed'].includes(t.status)).length;
  const myTickets = tickets.filter(t => t.assignedTo?._id === user?._id).length;

  // Recent activity (last 5 tickets)
  const recentTickets = [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div>
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your projects today
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center space-x-2">
              <Link
                to="/tickets/create"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-medium"
              >
                + New Ticket
              </Link>
              <Link
                to="/projects/create"
                className="bg-white text-primary-600 px-4 py-2 rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition font-medium"
              >
                + New Project
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
              <p className="text-3xl font-bold text-gray-900">{totalTickets}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎫</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-yellow-600">{inProgressTickets}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedTickets}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Assigned to Me</p>
              <p className="text-3xl font-bold text-purple-600">{myTickets}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            {recentTickets.length > 0 ? (
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <Link
                    key={ticket._id}
                    to={`/tickets/${ticket._id}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">
                        {ticket.type === 'Bug' ? '🐛' : ticket.type === 'Feature' ? '✨' : ticket.type === 'Improvement' ? '🔧' : '📋'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{ticket.title}</p>
                        <p className="text-sm text-gray-500">{ticket.project?.name || 'Unknown Project'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                        ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.status === 'In Review' ? 'bg-purple-100 text-purple-800' :
                        ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {ticket.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                        ticket.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                        ticket.priority === 'Medium' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent tickets</p>
            )}
          </div>
        </div>

        {/* Projects Overview */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Projects</h2>
            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <p className="font-medium text-gray-900 truncate">{project.name}</p>
                    <p className="text-sm text-gray-500">{project.status}</p>
                  </Link>
                ))}
                {projects.length > 5 && (
                  <Link
                    to="/projects"
                    className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium pt-2"
                  >
                    View all {projects.length} projects →
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No projects yet</p>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg shadow-md p-6 text-white">
            <h2 className="text-lg font-bold mb-4">🚀 Days 6-8 Complete!</h2>
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Enhanced Dashboard UI</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Sidebar & Navigation</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Kanban Board View</span>
              </li>
            </ul>
            <Link
              to="/kanban"
              className="block w-full bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-medium text-center"
            >
              Try Kanban Board →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
