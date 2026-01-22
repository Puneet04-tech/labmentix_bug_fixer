import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import StatsCard from '../components/StatsCard';
import TicketChart from '../components/TicketChart';

const Analytics = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [projectStats, setProjectStats] = useState([]);
  const [trends, setTrends] = useState([]);
  const [userActivity, setUserActivity] = useState(null);
  const [teamPerformance, setTeamPerformance] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [overviewRes, projectsRes, trendsRes, userRes, teamRes] = await Promise.all([
        API.get('/analytics/overview'),
        API.get('/analytics/projects'),
        API.get('/analytics/trends'),
        API.get('/analytics/user-activity'),
        API.get('/analytics/team')
      ]);

      setOverview(overviewRes.data);
      setProjectStats(projectsRes.data);
      setTrends(trendsRes.data);
      setUserActivity(userRes.data);
      setTeamPerformance(teamRes.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary-600">🐛 Bug Tracker</h1>
              <nav className="hidden md:flex space-x-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600">Dashboard</Link>
                <Link to="/projects" className="text-gray-600 hover:text-primary-600">Projects</Link>
                <Link to="/tickets" className="text-gray-600 hover:text-primary-600">Tickets</Link>
                <Link to="/analytics" className="text-primary-600 font-medium">Analytics</Link>
              </nav>
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

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading analytics...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary-600">🐛 Bug Tracker</h1>
            <nav className="hidden md:flex space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-primary-600">Dashboard</Link>
              <Link to="/projects" className="text-gray-600 hover:text-primary-600">Projects</Link>
              <Link to="/tickets" className="text-gray-600 hover:text-primary-600">Tickets</Link>
              <Link to="/analytics" className="text-primary-600 font-medium">Analytics</Link>
            </nav>
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-2">Comprehensive insights into your projects and tickets</p>
        </div>

        {/* Overview Stats */}
        {overview && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Projects"
                value={overview.totalProjects}
                icon="📁"
                color="indigo"
              />
              <StatsCard
                title="Total Tickets"
                value={overview.totalTickets}
                icon="🎫"
                color="blue"
              />
              <StatsCard
                title="Total Comments"
                value={overview.totalComments}
                icon="💬"
                color="purple"
              />
              <StatsCard
                title="Recent Activity"
                value={overview.recentTickets}
                icon="📊"
                color="green"
                subtitle="Last 7 days"
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <TicketChart
                data={overview.ticketsByStatus}
                type="bar"
                title="Tickets by Status"
              />
              <TicketChart
                data={overview.ticketsByPriority}
                type="donut"
                title="Tickets by Priority"
              />
              <TicketChart
                data={overview.ticketsByType}
                type="donut"
                title="Tickets by Type"
              />
            </div>
          </>
        )}

        {/* User Activity */}
        {userActivity && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatsCard
                title="Projects Owned"
                value={userActivity.projectsOwned}
                icon="👑"
                color="yellow"
              />
              <StatsCard
                title="Tickets Created"
                value={userActivity.ticketsCreated}
                icon="➕"
                color="blue"
              />
              <StatsCard
                title="Tickets Assigned"
                value={userActivity.ticketsAssigned}
                icon="📌"
                color="orange"
              />
              <StatsCard
                title="Comments Posted"
                value={userActivity.commentsPosted}
                icon="💭"
                color="purple"
              />
              <StatsCard
                title="Recent Tickets"
                value={userActivity.recentTicketsCreated}
                icon="🆕"
                color="green"
                subtitle="Last 7 days"
              />
            </div>
          </div>
        )}

        {/* Project Performance */}
        {projectStats.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Project Performance</h3>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Tickets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Open
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Closed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projectStats.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          {project.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.totalTickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.openTickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.closedTickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${project.completionRate}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-900">{project.completionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Team Performance */}
        {teamPerformance.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Team Performance</h3>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resolved
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resolution Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamPerformance.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.assignedTickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.resolvedTickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.commentsCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${member.resolutionRate}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-900">{member.resolutionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Trends Chart */}
        {trends.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ticket Trends (Last 30 Days)</h3>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-64 flex items-end justify-between gap-2">
                {trends.slice(-14).map((day, index) => {
                  const maxValue = Math.max(...trends.map(d => Math.max(d.created, d.resolved)));
                  const createdHeight = maxValue > 0 ? (day.created / maxValue) * 100 : 0;
                  const resolvedHeight = maxValue > 0 ? (day.resolved / maxValue) * 100 : 0;

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex gap-1 items-end justify-center h-48">
                        <div
                          className="w-1/2 bg-blue-500 rounded-t hover:bg-blue-600 transition-all"
                          style={{ height: `${createdHeight}%` }}
                          title={`Created: ${day.created}`}
                        />
                        <div
                          className="w-1/2 bg-green-500 rounded-t hover:bg-green-600 transition-all"
                          style={{ height: `${resolvedHeight}%` }}
                          title={`Resolved: ${day.resolved}`}
                        />
                      </div>
                      <span className="text-xs text-gray-500 transform rotate-45 origin-top-left mt-4">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-6 mt-8">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2" />
                  <span className="text-sm text-gray-700">Created</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2" />
                  <span className="text-sm text-gray-700">Resolved</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;
