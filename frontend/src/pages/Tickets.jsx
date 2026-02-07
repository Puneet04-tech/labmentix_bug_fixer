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
      {/* Mossy Background Effects */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/30 via-slate-900/20 to-slate-950/30"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 15% 25%, rgba(59, 130, 246, 0.12) 0%, transparent 45%),
                           radial-gradient(circle at 85% 15%, rgba(6, 182, 212, 0.10) 0%, transparent 40%),
                           radial-gradient(circle at 35% 75%, rgba(14, 165, 233, 0.14) 0%, transparent 50%),
                           radial-gradient(circle at 75% 65%, rgba(20, 184, 166, 0.08) 0%, transparent 35%),
                           radial-gradient(circle at 50% 40%, rgba(56, 189, 248, 0.06) 0%, transparent 55%),
                           radial-gradient(circle at 20% 85%, rgba(2, 132, 199, 0.11) 0%, transparent 45%),
                           radial-gradient(circle at 90% 35%, rgba(45, 212, 191, 0.09) 0%, transparent 40%),
                           radial-gradient(circle at 10% 50%, rgba(16, 185, 129, 0.12) 0%, transparent 45%),
                           radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.10) 0%, transparent 40%),
                           radial-gradient(circle at 60% 20%, rgba(132, 204, 22, 0.14) 0%, transparent 50%),
                           radial-gradient(circle at 25% 70%, rgba(5, 150, 105, 0.08) 0%, transparent 35%),
                           radial-gradient(circle at 70% 45%, rgba(20, 184, 166, 0.06) 0%, transparent 55%),
                           radial-gradient(circle at 45% 85%, rgba(13, 148, 136, 0.11) 0%, transparent 45%),
                           radial-gradient(circle at 95% 60%, rgba(6, 182, 212, 0.09) 0%, transparent 40%)`
        }}></div>
        {/* Foggy overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/8 backdrop-blur-[0.5px]"></div>
      </div>

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
          <div className="bg-[#0f1724] rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-slate-400 text-center mb-4">No tickets found</h3>
            <p className="text-slate-400 mb-6">
              {tickets.length === 0 
                ? 'Create your first ticket to get started!' 
                : 'Try adjusting your filters or search criteria.'}
            </p>
            <Link
              to="/tickets/create"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition font-medium"
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
              <div key={ticket._id} className="bg-[#0f1724] rounded-lg shadow-md hover:shadow-lg transition p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getTypeIcon(ticket.type)}</span>
                      <Link
                        to={`/tickets/${ticket._id}`}
                        className="text-xl font-semibold text-slate-100 hover:text-primary-400 transition"
                      >
                        {ticket.title}
                      </Link>
                    </div>
                    
                    <p className="text-slate-300 mb-4 line-clamp-2">{ticket.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#122433] text-slate-100">
                        {ticket.type}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <span>Project: <span className="font-medium text-slate-100">{ticket.project.name}</span></span>
                      <span>Reported by: <span className="font-medium text-slate-100">{ticket.reportedBy?.name || 'Unknown'}</span></span>
                      {ticket.assignedTo && ticket.assignedTo.name ? (
                        <span>Assigned to: <span className="font-medium text-slate-100">{ticket.assignedTo.name}</span></span>
                      ) : (
                        <span>Assigned to: <span className="font-medium text-slate-400">Unassigned</span></span>
                      )}
                      {ticket.dueDate && (
                        <span>Due: <span className="font-medium text-slate-700 dark:text-slate-300">
                          {new Date(ticket.dueDate).toLocaleDateString()}
                        </span></span>
                      )}
                    </div>
                  </div>
                  
                    <div className="flex gap-2 ml-4">
                    <Link
                      to={`/tickets/${ticket._id}`}
                        className="text-amber-300 hover:text-amber-200 font-medium px-4 py-2 rounded-lg hover:bg-[#122433] transition"
                    >
                      View
                    </Link>
                    {(ticket.reportedBy._id === user._id) && (
                      <button
                        onClick={() => handleDelete(ticket._id)}
                        className="text-red-600 hover:text-red-800 font-medium px-4 py-2 rounded-lg transition"
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
