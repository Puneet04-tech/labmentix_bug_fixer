import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useTicket } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProject, fetchProject, updateProject, deleteProject, loading, addMember, removeMember } = useProject();
  const { fetchTicketsByProject } = useTicket();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [projectTickets, setProjectTickets] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: '',
    priority: '',
    startDate: '',
    endDate: ''
  });
  const [errors, setErrors] = useState({});

  // Add member search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    const project = await fetchProject(id);
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        status: project.status,
        priority: project.priority,
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ''
      });
      // Load project tickets
      const tickets = await fetchTicketsByProject(id);
      setProjectTickets(tickets);
      // clear search state
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name cannot be more than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description cannot be more than 500 characters';
    }

    if (formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    return newErrors;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await updateProject(id, formData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${currentProject?.name}"? This action cannot be undone.`)) {
      const result = await deleteProject(id);
      if (result.success) {
        navigate('/projects');
      }
    }
  };

  // Search users to add as member
  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) return setSearchResults([]);
    try {
      const { data } = await API.get(`/users?q=${encodeURIComponent(searchQuery.trim())}`);
      // filter out owner and existing members
      const filtered = data.filter(u => u._id !== currentProject.owner._id && !currentProject.members.some(m => m._id === u._id));
      setSearchResults(filtered);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddMember = async (userId) => {
    const result = await addMember(id, userId);
    if (result.success) {
      setSearchResults(prev => prev.filter(u => u._id !== userId));
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from the project?')) return;
    await removeMember(id, userId);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Planning': 'bg-primary-900 text-primary-100',
      'In Progress': 'bg-blue-900 text-blue-100',
      'On Hold': 'bg-yellow-800 text-yellow-100',
      'Completed': 'bg-green-800 text-green-100',
      'Cancelled': 'bg-red-800 text-red-100'
    };
    return colors[status] || 'bg-[#122433] text-slate-100';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-[#122433] text-slate-100',
      'Medium': 'bg-blue-800 text-blue-100',
      'High': 'bg-orange-800 text-orange-100',
      'Critical': 'bg-red-800 text-red-100'
    };
    return colors[priority] || 'bg-[#122433] text-slate-100';
  };

  if (loading || !currentProject) {
    return (
      <div className="min-h-screen bg-[#0b1220] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const isOwner = currentProject.owner._id === user._id;

  return (
    <div className="min-h-screen bg-[#0b1220]">
      {/* Header */}
      <header className="bg-[#0f1724] shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary-600">🐛 Bug Tracker</h1>
            <nav className="hidden md:flex space-x-4">
              <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-primary-600">Dashboard</Link>
              <Link to="/projects" className="text-primary-600 font-medium">Projects</Link>
              <Link to="/tickets" className="text-slate-500 dark:text-slate-400 hover:text-primary-600">Tickets</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <p className="font-medium text-slate-900 dark:text-slate-100">{user?.name}</p>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm">
          <Link to="/projects" className="text-primary-600 hover:text-primary-700">
            Projects
          </Link>
          <span className="mx-2 text-slate-400 dark:text-slate-500">/</span>
          <span className="text-slate-600 dark:text-slate-300">{currentProject.name}</span>
        </nav>

        {/* Project Header */}
        <div className="bg-[#0f1724] rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-100 mb-2">{currentProject.name}</h2>
              <div className="flex space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentProject.status)}`}>
                  {currentProject.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(currentProject.priority)}`}>
                  {currentProject.priority}
                </span>
              </div>
            </div>
            {isOwner && !isEditing && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-amethyst-600 text-white rounded-lg hover:bg-amethyst-700 transition"
                >
                  Edit Project
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Owner</p>
              <p className="text-slate-900 dark:text-slate-100 font-medium">{currentProject.owner.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{currentProject.owner.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Start Date</p>
              <p className="text-slate-900 dark:text-slate-100 font-medium">
                {new Date(currentProject.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">End Date</p>
              <p className="text-slate-900 dark:text-slate-100 font-medium">
                {currentProject.endDate
                  ? new Date(currentProject.endDate).toLocaleDateString()
                  : 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form or Description */}
        {isEditing && isOwner ? (
          <div className="bg-[#0f1724] rounded-xl shadow-sm p-6 sm:p-8 mb-6">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Edit Project</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg bg-[#0f1724] text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none ${
                    errors.name ? 'border-red-500' : 'border-slate-700'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-lg bg-[#0f1724] text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                    errors.description ? 'border-red-500' : 'border-slate-700'
                  }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-[#0f1724] text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-[#0f1724] text-slate-100 focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-700 bg-[#0f1724] text-slate-100 placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg bg-[#0f1724] text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none ${
                        errors.endDate ? 'border-red-500' : 'border-slate-700'
                      }`}
                  />
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    loadProject();
                  }}
                  className="px-4 py-2 border border-slate-700 text-slate-100 rounded-lg hover:bg-[#122433]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-[#0f1724] rounded-xl shadow-sm p-6 sm:p-8 mb-6">
            <h3 className="text-xl font-bold text-slate-100 mb-3">Description</h3>
            <p className="text-slate-300 whitespace-pre-wrap">{currentProject.description}</p>
          </div>
        )}

        {/* Team Members */}
        <div className="bg-[#0f1724] rounded-xl shadow-sm p-6 sm:p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Team Members ({currentProject.members.length + 1})</h3>

          {/* Add Member (owner-only) */}
          {isOwner && (
            <div className="mb-4">
              <label className="block text-sm text-slate-600 dark:text-slate-300 font-medium mb-2">Add Member</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 border border-surface-200 dark:border-surface-700 rounded-lg"
                />
                <button
                  onClick={handleSearchUsers}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Search
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-3 space-y-2">
                    {searchResults.map(u => (
                      <div key={u._id} className="flex items-center justify-between p-2 bg-[#0f1724] rounded">
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{u.email}</div>
                      </div>
                      <div>
                        <button
                          onClick={() => handleAddMember(u._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded-md"
                        >Add</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

            <div className="space-y-3">
            {/* Owner */}
            <div className="flex items-center justify-between p-3 bg-[#122433] rounded-lg">
                <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                  {currentProject.owner.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-slate-100">{currentProject.owner.name}</p>
                  <p className="text-sm text-slate-300">{currentProject.owner.email}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded-full">
                Owner
              </span>
            </div>

            {/* Members */}
            {currentProject.members.map((member) => (
              <div key={member._id} className="flex items-center justify-between p-3 bg-[#0f1724] rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-400 rounded-full flex items-center justify-center text-white font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                      <p className="font-medium text-slate-100">{member.name}</p>
                      <p className="text-sm text-slate-300">{member.email}</p>
                    </div>
                </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-[#122433] text-slate-100 text-xs font-medium rounded-full">Member</span>
                  {isOwner && (
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md"
                    >Remove</button>
                  )}
                </div>
              </div>
            ))}

            {currentProject.members.length === 0 && (
              <p className="text-slate-500 dark:text-slate-400 text-center py-4">No team members added yet</p>
            )}
          </div>
        </div>

        {/* Activity / Stats */}
        <div className="bg-[#0f1724] rounded-xl shadow-sm p-6 sm:p-8">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Project Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-[#122433] rounded-lg">
              <div className="text-3xl font-bold text-slate-100">{projectTickets.length}</div>
              <div className="text-sm text-slate-400 mt-1">Total Tickets</div>
            </div>
            <div className="text-center p-4 bg-[#122433] rounded-lg">
              <div className="text-3xl font-bold text-green-400">
                {projectTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length}
              </div>
              <div className="text-sm text-slate-400 mt-1">Resolved</div>
            </div>
            <div className="text-center p-4 bg-[#122433] rounded-lg">
              <div className="text-3xl font-bold text-red-400">
                {projectTickets.filter(t => t.status === 'Open').length}
              </div>
              <div className="text-sm text-slate-400 mt-1">Open</div>
            </div>
          </div>
          <Link 
            to={`/tickets?project=${id}`}
            className="block text-center mt-4 text-indigo-300 hover:text-indigo-100 font-medium"
          >
            View All Project Tickets →
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
