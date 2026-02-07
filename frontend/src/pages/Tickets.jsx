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
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">🎫 Tickets</h1>
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
            <h3 className="text-xl font-bold text-slate-100 mb-2">No tickets found</h3>
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
  );
};

export default Tickets;
