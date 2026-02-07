import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useTicket } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import TeamMemberManager from '../components/TeamMemberManager';

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

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
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
        setProjectTickets(tickets || []);
      } else {
        console.error('Project not found');
        navigate('/projects');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      navigate('/projects');
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  // Additional safety check
  if (!currentProject._id || !currentProject.name) {
    return (
      <div className="min-h-screen bg-[#0b1220] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Invalid project data</p>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const isOwner = currentProject.owner._id === user._id;

  return (
    <div className="min-h-screen relative">
      {/* Mossy Background Effects */}
      <div className="fixed inset-0 opacity-40 pointer-events-none">
        {/* Green Mossy Rings */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-radial from-emerald-400/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-20 w-80 h-80 bg-gradient-radial from-green-500/25 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-radial from-lime-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-teal-400/25 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-gradient-radial from-emerald-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-20 w-48 h-48 bg-gradient-radial from-green-400/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-radial from-lime-500/25 to-transparent rounded-full blur-3xl"></div>

        {/* Blue Mossy Rings */}
        <div className="absolute top-20 right-1/4 w-88 h-88 bg-gradient-radial from-blue-400/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-10 w-76 h-76 bg-gradient-radial from-cyan-500/25 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-68 h-68 bg-gradient-radial from-sky-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/2 right-20 w-60 h-60 bg-gradient-radial from-blue-500/25 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 right-1/2 w-52 h-52 bg-gradient-radial from-cyan-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-2/3 w-44 h-44 bg-gradient-radial from-sky-500/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-10 left-3/4 w-36 h-36 bg-gradient-radial from-blue-400/25 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Foggy Background Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/10 via-slate-800/5 to-slate-900/10 backdrop-blur-[1px] pointer-events-none"></div>

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

      {/* Content */}
      <div className="relative z-10 min-h-screen">
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
              <h2 className="text-3xl font-bold text-slate-100 mb-2 text-center">{currentProject.name}</h2>
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
            <h3 className="text-xl font-bold text-slate-100 mb-4 text-center">Edit Project</h3>
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
            <h3 className="text-xl font-bold text-slate-100 mb-3 text-center">Description</h3>
            <p className="text-slate-300 whitespace-pre-wrap">{currentProject.description}</p>
          </div>
        )}

        {/* Team Members */}
        <div className="bg-[#0f1724] rounded-xl shadow-sm p-6 sm:p-8 mb-6">
          <TeamMemberManager
            project={currentProject}
            currentUser={user}
            onMemberAdded={(updatedProject) => {
              // Update the current project in context or state
              fetchProject(id);
            }}
            onMemberRemoved={(updatedProject) => {
              // Update the current project in context or state
              fetchProject(id);
            }}
          />
        </div>

        {/* Activity / Stats */}
        <div className="bg-[#0f1724] rounded-xl shadow-sm p-6 sm:p-8">
          <h3 className="text-xl font-bold text-slate-100 mb-4 text-center">Project Activity</h3>
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
    </div>
  );
};

export default ProjectDetail;
