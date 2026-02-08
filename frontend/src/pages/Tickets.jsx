import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTicket } from '../context/TicketContext';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import FilterBar from '../components/FilterBar';

const Tickets = () => {
  const { tickets, fetchTickets, deleteTicket } = useTicket();
  const { projects } = useProject();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL params
  const [userFilter, setUserFilter] = useState(searchParams.get('user') || 'all');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || '');
  const [projectFilter, setProjectFilter] = useState(searchParams.get('project') || '');

  useEffect(() => {
    fetchTickets();
  }, []);

  // Update URL params when filters change
  useEffect(() => {
    const params = {};
    if (userFilter !== 'all') params.user = userFilter;
    if (searchTerm) params.search = searchTerm;
    if (statusFilter) params.status = statusFilter;
    if (priorityFilter) params.priority = priorityFilter;
    if (projectFilter) params.project = projectFilter;
    
    setSearchParams(params);
  }, [userFilter, searchTerm, statusFilter, priorityFilter, projectFilter, setSearchParams]);

  const handleClearFilters = () => {
    setUserFilter('all');
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
    setProjectFilter('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      await deleteTicket(id);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    // Search filter
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    
    // Priority filter
    const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
    
    // Project filter
    const matchesProject = !projectFilter || ticket.project._id === projectFilter;
    
    // User filter
    let matchesUser = true;
    if (userFilter === 'assigned') {
      matchesUser = ticket.assignedTo?._id === user._id;
    } else if (userFilter === 'reported') {
      matchesUser = ticket.reportedBy._id === user._id;
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesUser;
  });

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'bg-blue-900 text-blue-100',
      'In Progress': 'bg-yellow-800 text-yellow-100',
      'In Review': 'bg-purple-800 text-purple-100',
      'Resolved': 'bg-green-800 text-green-100',
      'Closed': 'bg-[#122433] text-slate-100'
    };
    return colors[status] || 'bg-[#122433] text-slate-100';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-[#122433] text-slate-100',
      'Medium': 'bg-yellow-800 text-yellow-100',
      'High': 'bg-orange-800 text-orange-100',
      'Critical': 'bg-red-800 text-red-100'
    };
    return colors[priority] || 'bg-[#122433] text-slate-100';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Bug': '🐛',
      'Feature': '✨',
      'Improvement': '🔧',
      'Task': '📋'
    };
    return icons[type] || '📝';
  };

  return (
    <div className="min-h-screen bg-[#0b1220] relative overflow-hidden">
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
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-teal-400 text-center mb-8 drop-shadow-lg">🎫 Tickets</h1>
            <p className="text-slate-400 mt-1">Manage and track your project tickets</p>
          </div>
          <Link
            to="/tickets/create"
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition duration-200 font-medium"
          >
            + New Ticket
          </Link>
        </div>

        {/* Filter Bar Component */}
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          projectFilter={projectFilter}
          setProjectFilter={setProjectFilter}
          userFilter={userFilter}
          setUserFilter={setUserFilter}
          projects={projects}
          tickets={tickets}
          onClearFilters={handleClearFilters}
        />

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="bg-emerald-900/20 rounded-xl shadow-sm p-12 text-center border border-emerald-500/30 backdrop-blur-sm">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-emerald-200 text-center mb-4">No tickets found</h3>
            <p className="text-emerald-200/70 mb-6">
              {tickets.length === 0 
                ? 'Create your first ticket to get started!' 
                : 'Try adjusting your filters or search criteria.'}
            </p>
            <Link
              to="/tickets/create"
              className="inline-block bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-green-700 transition font-medium"
            >
              + Create Ticket
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm text-slate-400">
              Showing <span className="font-semibold text-slate-100">{filteredTickets.length}</span> of{' '}
              <span className="font-semibold text-slate-100">{tickets.length}</span> tickets
            </div>
            
            <div className="space-y-4">{filteredTickets.map(ticket => (
              <div key={ticket._id} className="bg-emerald-900/20 rounded-lg shadow-md hover:shadow-lg transition p-6 border border-emerald-500/30 backdrop-blur-sm hover:bg-emerald-800/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getTypeIcon(ticket.type)}</span>
                      <Link
                        to={`/tickets/${ticket._id}`}
                        className="text-xl font-semibold text-emerald-100 hover:text-lime-400 transition"
                      >
                        {ticket.title}
                      </Link>
                    </div>
                    
                    <p className="text-emerald-200/80 mb-4 line-clamp-2">{ticket.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-emerald-900/50 text-emerald-100 border border-emerald-500/30`}>
                        {ticket.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium bg-green-900/50 text-green-100 border border-green-500/30`}>
                        {ticket.priority}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-teal-900/50 text-teal-100 border border-teal-500/30">
                        {ticket.type}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-emerald-200/70">
                      <span>Project: <span className="font-medium text-emerald-100">{ticket.project.name}</span></span>
                      <span>Reported by: <span className="font-medium text-emerald-100">{ticket.reportedBy?.name || 'Unknown'}</span></span>
                      {ticket.assignedTo && ticket.assignedTo.name ? (
                        <span>Assigned to: <span className="font-medium text-emerald-100">{ticket.assignedTo.name}</span></span>
                      ) : (
                        <span>Assigned to: <span className="font-medium text-emerald-200/50">Unassigned</span></span>
                      )}
                      {ticket.dueDate && (
                        <span>Due: <span className="font-medium text-emerald-200/80">
                          {new Date(ticket.dueDate).toLocaleDateString()}
                        </span></span>
                      )}
                    </div>
                  </div>
                  
                    <div className="flex gap-2 ml-4">
                    <Link
                      to={`/tickets/${ticket._id}`}
                        className="text-lime-300 hover:text-lime-200 font-medium px-4 py-2 rounded-lg hover:bg-emerald-800/50 transition border border-emerald-600/20"
                    >
                      View
                    </Link>
                    {(ticket.reportedBy._id === user._id) && (
                      <button
                        onClick={() => handleDelete(ticket._id)}
                        className="text-red-400 hover:text-red-300 font-medium px-4 py-2 rounded-lg transition hover:bg-red-900/30 border border-red-500/20"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}</div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Tickets;
