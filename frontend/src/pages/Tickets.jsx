import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTicket } from '../context/TicketContext';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

const Tickets = () => {
  const { tickets, fetchTickets, deleteTicket } = useTicket();
  const { projects } = useProject();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

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
    if (filter === 'assigned') {
      matchesUser = ticket.assignedTo?._id === user._id;
    } else if (filter === 'reported') {
      matchesUser = ticket.reportedBy._id === user._id;
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesUser;
  });

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'In Review': 'bg-purple-100 text-purple-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Closed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tickets</h1>
          <Link
            to="/tickets/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition duration-200 font-medium"
          >
            + New Ticket
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Project Filter */}
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>{project.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* User Filter Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Tickets ({tickets.length})
            </button>
            <button
              onClick={() => setFilter('assigned')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'assigned' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Assigned to Me ({tickets.filter(t => t.assignedTo?._id === user._id).length})
            </button>
            <button
              onClick={() => setFilter('reported')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'reported' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reported by Me ({tickets.filter(t => t.reportedBy._id === user._id).length})
            </button>
          </div>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">No tickets found</p>
            <Link
              to="/tickets/create"
              className="text-indigo-600 hover:text-indigo-700 font-medium mt-2 inline-block"
            >
              Create your first ticket
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map(ticket => (
              <div key={ticket._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getTypeIcon(ticket.type)}</span>
                      <Link
                        to={`/tickets/${ticket._id}`}
                        className="text-xl font-semibold text-gray-800 hover:text-indigo-600 transition"
                      >
                        {ticket.title}
                      </Link>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{ticket.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        {ticket.type}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>Project: <span className="font-medium text-gray-700">{ticket.project.name}</span></span>
                      <span>Reported by: <span className="font-medium text-gray-700">{ticket.reportedBy.name}</span></span>
                      {ticket.assignedTo && (
                        <span>Assigned to: <span className="font-medium text-gray-700">{ticket.assignedTo.name}</span></span>
                      )}
                      {ticket.dueDate && (
                        <span>Due: <span className="font-medium text-gray-700">
                          {new Date(ticket.dueDate).toLocaleDateString()}
                        </span></span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Link
                      to={`/tickets/${ticket._id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
                    >
                      View
                    </Link>
                    {(ticket.reportedBy._id === user._id) && (
                      <button
                        onClick={() => handleDelete(ticket._id)}
                        className="text-red-600 hover:text-red-800 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
