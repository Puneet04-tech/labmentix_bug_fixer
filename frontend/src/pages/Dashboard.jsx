import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { useTicket } from '../context/TicketContext';
import { useState } from 'react';
import ModernCharts from '../components/ModernCharts';
import RoleGuard from '../components/RoleGuard';
import { hasPermission, getRoleDisplayName, getRoleColor } from '../utils/roles';
import { Plus, Users, Settings, BarChart3 } from 'lucide-react';

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

  // Prepare chart data
  const statusData = [
    { name: 'Open', value: tickets.filter(t => t.status === 'Open').length },
    { name: 'In Progress', value: tickets.filter(t => t.status === 'In Progress').length },
    { name: 'In Review', value: tickets.filter(t => t.status === 'In Review').length },
    { name: 'Resolved', value: tickets.filter(t => t.status === 'Resolved').length },
    { name: 'Closed', value: tickets.filter(t => t.status === 'Closed').length }
  ];

  const priorityData = [
    { name: 'Low', value: tickets.filter(t => t.priority === 'Low').length },
    { name: 'Medium', value: tickets.filter(t => t.priority === 'Medium').length },
    { name: 'High', value: tickets.filter(t => t.priority === 'High').length },
    { name: 'Critical', value: tickets.filter(t => t.priority === 'Critical').length }
  ];

  const typeData = [
    { name: 'Bug', value: tickets.filter(t => t.type === 'Bug').length },
    { name: 'Feature', value: tickets.filter(t => t.type === 'Feature').length },
    { name: 'Improvement', value: tickets.filter(t => t.type === 'Improvement').length },
    { name: 'Task', value: tickets.filter(t => t.type === 'Task').length }
  ];

  return (
    <div className="min-h-screen px-4 bg-[#0b1220] relative overflow-hidden">
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
            backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgZmlsbD0iIzMzZmJmZiIgZmlsbC1vcGFjaXR5PSIwLjA4Ij4KICAgICAgPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41Ii8+CiAgICA8L2c+CgogICAgPGcgZmlsbD0iIzMzZmJmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KICAgICAgPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMC41Ii8+CiAgICAgIDxjaXJjbGUgY3g9IjQ1IiBjeT0iMTUiIHI9IjAuNSIvPgogICAgICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIwLjUiLz4KICAgICAgPGNpcmNsZSBjeD0iMTUiIGN5PSI0NSIgcj0iMC41Ii8+CiAgICAgIDxjaXJjbGUgY3g9IjQ1IiBjeT0iNDUiIHI9IjAuNSIvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+")`,
            backgroundSize: '60px 60px'
          }}
        ></div>

        {/* Foggy Glass Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-lime-400 mb-2 text-center drop-shadow-lg">Dashboard</h1>
              <p className="text-lg text-purple-100">Welcome back, {user?.name}! 👋 Here's what's happening with your projects today.</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm text-purple-200">Role:</span>
                <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getRoleColor(user?.role || 'member')}`}>
                  {getRoleDisplayName(user?.role || 'member')}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <RoleGuard
                userRole={user?.role}
                permissions={['create_tickets']}
                renderFallback={false}
              >
                <Link
                  to="/tickets/new"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Ticket</span>
                </Link>
              </RoleGuard>
              
              <RoleGuard
                userRole={user?.role}
                permissions={['manage_team']}
                renderFallback={false}
              >
                <Link
                  to="/team"
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>Team</span>
                </Link>
              </RoleGuard>
              
              <RoleGuard
                userRole={user?.role}
                permissions={['view_reports']}
                renderFallback={false}
              >
                <Link
                  to="/reports"
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Reports</span>
                </Link>
              </RoleGuard>
              
              <RoleGuard
                userRole={user?.role}
                permissions={['manage_settings']}
                renderFallback={false}
              >
                <Link
                  to="/settings"
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </RoleGuard>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-emerald-900/30 rounded-xl p-6 border border-emerald-500/30 backdrop-blur-sm hover:bg-emerald-800/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-200">Total Tickets</p>
                <p className="text-3xl font-bold text-lime-400 mt-1">{totalTickets}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-emerald-500 rounded"></div>
              </div>
            </div>
          </div>
          <div className="bg-emerald-900/30 rounded-xl p-6 border border-emerald-500/30 backdrop-blur-sm hover:bg-emerald-800/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-200">In Progress</p>
                <p className="text-3xl font-bold text-yellow-400 mt-1">{inProgressTickets}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded"></div>
              </div>
            </div>
          </div>
          <div className="bg-emerald-900/30 rounded-xl p-6 border border-emerald-500/30 backdrop-blur-sm hover:bg-emerald-800/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-200">Completed</p>
                <p className="text-3xl font-bold text-teal-400 mt-1">{completedTickets}</p>
              </div>
              <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-teal-500 rounded"></div>
              </div>
            </div>
          </div>
          <div className="bg-emerald-900/30 rounded-xl p-6 border border-emerald-500/30 backdrop-blur-sm hover:bg-emerald-800/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-200">Assigned to Me</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">{myTickets}</p>
              </div>
              <div className="w-12 h-12 bg-lime-500/20 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-lime-500 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="min-h-[400px]">
            <ModernCharts
              data={statusData}
              title="Tickets by Status"
              subtitle="Distribution of tickets across different statuses"
              height={350}
              chartType="pie"
              className="w-full"
            />
          </div>
          <div className="min-h-[400px]">
            <ModernCharts
              data={priorityData}
              title="Tickets by Priority"
              subtitle="Priority breakdown of all tickets"
              height={350}
              chartType="bar"
              className="w-full"
            />
          </div>
          <div className="min-h-[400px]">
            <ModernCharts
              data={typeData}
              title="Tickets by Type"
              subtitle="Categorization by ticket type"
              height={350}
              chartType="doughnut"
              className="w-full"
            />
          </div>
        </div>

        {/* Recent Activity and Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-emerald-900/20 rounded-2xl p-8 shadow-2xl border border-emerald-500/30 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-emerald-400 text-center mb-6 drop-shadow-md">Recent Activity</h2>
              <Link to="/tickets/create" className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:from-emerald-700 hover:to-green-700 transition">+ New Ticket</Link>
            </div>
            {recentTickets.length > 0 ? (
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <Link
                    key={ticket._id}
                    to={`/tickets/${ticket._id}`}
                    className="flex items-center justify-between p-4 bg-emerald-800/30 rounded-lg hover:bg-emerald-700/50 transition border border-emerald-600/20"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">
                        {ticket.type === 'Bug' ? '🐛' : ticket.type === 'Feature' ? '✨' : ticket.type === 'Improvement' ? '🔧' : '📋'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-emerald-100 truncate">{ticket.title}</p>
                        <p className="text-sm text-emerald-200/70">{ticket.project?.name || 'Unknown Project'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ticket.status === 'Open' ? 'bg-emerald-900/50 text-emerald-100 border border-emerald-500/30' :
                                ticket.status === 'In Progress' ? 'bg-green-900/50 text-green-100 border border-green-500/30' :
                                ticket.status === 'In Review' ? 'bg-teal-900/50 text-teal-100 border border-teal-500/30' :
                                ticket.status === 'Resolved' ? 'bg-lime-900/50 text-lime-100 border border-lime-500/30' :
                                'bg-slate-700 text-white'
                              }`}>
                        {ticket.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ticket.priority === 'Critical' ? 'bg-red-900/50 text-red-100 border border-red-500/30' :
                                ticket.priority === 'High' ? 'bg-orange-900/50 text-orange-100 border border-orange-500/30' :
                                ticket.priority === 'Medium' ? 'bg-yellow-900/50 text-yellow-100 border border-yellow-500/30' :
                                'bg-slate-700 text-white'
                              }`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-emerald-200/70 text-center py-8">No recent tickets</p>
            )}
          </div>

          {/* Projects Overview */}
          <div className="bg-emerald-900/20 rounded-2xl p-8 shadow-2xl border border-emerald-500/30 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-teal-400 text-center mb-6 drop-shadow-md">Your Projects</h2>
              <Link to="/projects/create" className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:from-emerald-700 hover:to-green-700 transition">+ New Project</Link>
            </div>
            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}`}
                    className="block p-3 bg-emerald-800/30 rounded-lg hover:bg-emerald-700/50 transition border border-emerald-600/20"
                  >
                    <p className="font-medium text-emerald-100 truncate">{project.name}</p>
                    <p className="text-sm text-emerald-200/70">{project.status}</p>
                  </Link>
                ))}
                {projects.length > 5 && (
                  <Link
                    to="/projects"
                    className="block text-center text-sm text-lime-300 hover:text-lime-400 font-medium pt-2"
                  >
                    View all {projects.length} projects →
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-emerald-200/70 text-center py-4">No projects yet</p>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
