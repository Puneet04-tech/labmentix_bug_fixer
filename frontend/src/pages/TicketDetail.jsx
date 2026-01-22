import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTicket } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import ActivityTimeline from '../components/ActivityTimeline';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentTicket, fetchTicket, updateTicket, assignTicket, deleteTicket } = useTicket();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    status: '',
    priority: '',
    dueDate: ''
  });

  useEffect(() => {
    loadTicket();
  }, [id]);

  useEffect(() => {
    if (currentTicket) {
      setFormData({
        title: currentTicket.title,
        description: currentTicket.description,
        type: currentTicket.type,
        status: currentTicket.status,
        priority: currentTicket.priority,
        dueDate: currentTicket.dueDate ? new Date(currentTicket.dueDate).toISOString().split('T')[0] : ''
      });
    }
  }, [currentTicket]);

  const loadTicket = async () => {
    await fetchTicket(id);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updated = await updateTicket(id, formData);
    if (updated) {
      setIsEditing(false);
    }
  };

  const handleAssign = async (userId) => {
    await assignTicket(id, userId);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      const success = await deleteTicket(id);
      if (success) {
        navigate('/tickets');
      }
    }
  };

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

  if (!currentTicket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading ticket...</p>
        </div>
      </div>
    );
  }

  const isReporter = currentTicket.reportedBy._id === user._id;
  const isProjectOwner = currentTicket.project.owner === user._id;
  const canEdit = isReporter || isProjectOwner || currentTicket.project.members?.some(m => m === user._id);
  const canDelete = isReporter || isProjectOwner;

  // Get all project members for assignment
  const projectMembers = currentTicket.project.members || [];
  const allMembers = [
    { _id: currentTicket.project.owner, name: 'Owner' },
    ...projectMembers
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Link to="/tickets" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
          ← Back to Tickets
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{getTypeIcon(currentTicket.type)}</span>
              <h1 className="text-3xl font-bold text-gray-800">{currentTicket.title}</h1>
            </div>
            <div className="flex gap-2 mt-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentTicket.status)}`}>
                {currentTicket.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(currentTicket.priority)}`}>
                {currentTicket.priority}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                {currentTicket.type}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {canEdit && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition font-medium"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition font-medium"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">{isEditing ? (
            <form onSubmit={handleUpdate} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Ticket</h2>
              
              {/* Title */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={100}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={2000}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Type */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Bug">Bug</option>
                    <option value="Feature">Feature</option>
                    <option value="Improvement">Improvement</option>
                    <option value="Task">Task</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Status */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{currentTicket.description}</p>
              </div>

              {/* Activity Timeline */}
              <ActivityTimeline ticketId={id} />
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Project</p>
                <Link 
                  to={`/projects/${currentTicket.project._id}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {currentTicket.project.name}
                </Link>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reported By</p>
                <p className="font-medium text-gray-700">{currentTicket.reportedBy.name}</p>
                <p className="text-sm text-gray-500">{currentTicket.reportedBy.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-gray-700">{new Date(currentTicket.createdAt).toLocaleString()}</p>
              </div>
              {currentTicket.dueDate && (
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="text-gray-700">{new Date(currentTicket.dueDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Assignment */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Assignment</h3>
            {currentTicket.assignedTo ? (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                <p className="font-medium text-gray-700">{currentTicket.assignedTo.name}</p>
                <p className="text-sm text-gray-500">{currentTicket.assignedTo.email}</p>
              </div>
            ) : (
              <p className="text-gray-500 mb-4">Unassigned</p>
            )}
            
            {canEdit && (
              <div>
                <label className="block text-sm text-gray-500 mb-2">Change Assignment</label>
                <select
                  onChange={(e) => handleAssign(e.target.value || null)}
                  value={currentTicket.assignedTo?._id || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Unassigned</option>
                  {/* Note: Would need to fetch project members here */}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-6">
        <CommentSection ticketId={id} />
      </div>
    </div>
  );
};

export default TicketDetail;
