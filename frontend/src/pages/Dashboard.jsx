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
      {/* Mossy Background Effects */}
      <div className="fixed inset-0 opacity-70">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/50 via-slate-900/40 to-slate-950/50"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 15% 25%, rgba(59, 130, 246, 0.18) 0%, transparent 45%),
                           radial-gradient(circle at 85% 15%, rgba(6, 182, 212, 0.15) 0%, transparent 40%),
                           radial-gradient(circle at 35% 75%, rgba(14, 165, 233, 0.20) 0%, transparent 50%),
                           radial-gradient(circle at 75% 65%, rgba(20, 184, 166, 0.12) 0%, transparent 35%),
                           radial-gradient(circle at 50% 40%, rgba(56, 189, 248, 0.09) 0%, transparent 55%),
                           radial-gradient(circle at 20% 85%, rgba(2, 132, 199, 0.16) 0%, transparent 45%),
                           radial-gradient(circle at 90% 35%, rgba(45, 212, 191, 0.13) 0%, transparent 40%),
                           radial-gradient(circle at 10% 50%, rgba(16, 185, 129, 0.18) 0%, transparent 45%),
                           radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.15) 0%, transparent 40%),
                           radial-gradient(circle at 60% 20%, rgba(132, 204, 22, 0.20) 0%, transparent 50%),
                           radial-gradient(circle at 25% 70%, rgba(5, 150, 105, 0.12) 0%, transparent 35%),
                           radial-gradient(circle at 70% 45%, rgba(20, 184, 166, 0.09) 0%, transparent 55%),
                           radial-gradient(circle at 45% 85%, rgba(13, 148, 136, 0.16) 0%, transparent 45%),
                           radial-gradient(circle at 95% 60%, rgba(6, 182, 212, 0.13) 0%, transparent 40%)`
        }}></div>
        {/* Foggy overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/12 backdrop-blur-[1px]"></div>
      </div>

      {/* Grain Texture Overlay */}
      <div className="fixed inset-0 opacity-20"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
             backgroundSize: '128px 128px'
           }}></div>

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
          <div className="bg-slate-900/70 rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">Total Tickets</p>
                <p className="text-3xl font-bold text-orange-400 mt-1">{totalTickets}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/70 rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">In Progress</p>
                <p className="text-3xl font-bold text-yellow-400 mt-1">{inProgressTickets}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-yellow-500 rounded"></div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/70 rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">Completed</p>
                <p className="text-3xl font-bold text-green-400 mt-1">{completedTickets}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded"></div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/70 rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-100">Assigned to Me</p>
                <p className="text-3xl font-bold text-purple-400 mt-1">{myTickets}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-purple-500 rounded"></div>
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
          <div className="bg-slate-900/85 rounded-2xl p-8 shadow-2xl border border-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-emerald-400 text-center mb-6 drop-shadow-md">Recent Activity</h2>
              <Link to="/tickets/create" className="bg-gradient-to-r from-orange-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium shadow hover:from-orange-600 hover:to-purple-600 transition">+ New Ticket</Link>
            </div>
            {recentTickets.length > 0 ? (
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <Link
                    key={ticket._id}
                    to={`/tickets/${ticket._id}`}
                    className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">
                        {ticket.type === 'Bug' ? '🐛' : ticket.type === 'Feature' ? '✨' : ticket.type === 'Improvement' ? '🔧' : '📋'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{ticket.title}</p>
                        <p className="text-sm text-slate-400">{ticket.project?.name || 'Unknown Project'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ticket.status === 'Open' ? 'bg-blue-900 text-blue-100' :
                                ticket.status === 'In Progress' ? 'bg-yellow-800 text-yellow-100' :
                                ticket.status === 'In Review' ? 'bg-purple-800 text-purple-100' :
                                ticket.status === 'Resolved' ? 'bg-green-800 text-green-100' :
                                'bg-slate-700 text-white'
                              }`}>
                        {ticket.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ticket.priority === 'Critical' ? 'bg-red-800 text-red-100' :
                                ticket.priority === 'High' ? 'bg-orange-800 text-orange-100' :
                                ticket.priority === 'Medium' ? 'bg-blue-800 text-blue-100' :
                                'bg-slate-700 text-white'
                              }`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">No recent tickets</p>
            )}
          </div>

          {/* Projects Overview */}
          <div className="bg-slate-900/85 rounded-2xl p-8 shadow-2xl border border-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-teal-400 text-center mb-6 drop-shadow-md">Your Projects</h2>
              <Link to="/projects/create" className="bg-gradient-to-r from-orange-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium shadow hover:from-orange-600 hover:to-purple-600 transition">+ New Project</Link>
            </div>
            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <Link
                    key={project._id}
                    to={`/projects/${project._id}`}
                    className="block p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
                  >
                    <p className="font-medium text-white truncate">{project.name}</p>
                    <p className="text-sm text-slate-400">{project.status}</p>
                  </Link>
                ))}
                {projects.length > 5 && (
                  <Link
                    to="/projects"
                    className="block text-center text-sm text-amber-300 hover:text-amber-400 font-medium pt-2"
                  >
                    View all {projects.length} projects →
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-4">No projects yet</p>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
