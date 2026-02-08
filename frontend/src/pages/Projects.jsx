import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
  const { projects, loading, deleteProject } = useProject();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status) => {
    const colors = {
      'Planning': 'bg-primary-100 text-primary-700',
        'In Progress': 'bg-accent-100 text-accent-700',
        'On Hold': 'bg-amethyst-100 text-amethyst-700',
        'Completed': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800'
    };
        return colors[status] || 'bg-[#122433] text-slate-100';
  }; 

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-[#122433] text-slate-100',
      'Medium': 'bg-primary-100 text-primary-700',
      'High': 'bg-accent-100 text-accent-700',
      'Critical': 'bg-red-100 text-red-600'
    };
        return colors[priority] || 'bg-[#122433] text-slate-100';
  }; 

  const handleDelete = async (id, projectName) => {
    if (window.confirm(`Are you sure you want to delete "${projectName}"?`)) {
      await deleteProject(id);
    }
  };

  // Filter and search projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'owned') return matchesSearch && project.owner._id === user._id;
    if (filter === 'member') return matchesSearch && project.owner._id !== user._id;
    return matchesSearch;
  });

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
      {/* Header */}
      <header className="bg-[#0f1724] shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary-600">🐛 Bug Tracker</h1>
            <nav className="hidden md:flex space-x-4">
              <Link to="/dashboard" className="text-slate-500 hover:text-primary-600">Dashboard</Link>
              <Link to="/projects" className="text-primary-600 font-medium">Projects</Link>
              <Link to="/tickets" className="text-slate-500 hover:text-primary-600">Tickets</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <p className="font-medium text-slate-100">{user?.name}</p>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
            <div>
          <h2 className="text-3xl font-bold text-lime-400 text-center mb-8 drop-shadow-lg">Projects</h2>
          <p className="text-slate-400 mt-1">Manage your bug tracking projects</p>
          </div>
          <Link
            to="/projects/create"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition flex items-center neon-btn neon-glow"
          >
            <span className="text-xl mr-2">+</span>
            New Project
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-emerald-900/20 rounded-lg shadow p-4 mb-6 border border-emerald-500/30 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Filter Tabs */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-800/30 text-emerald-100 hover:bg-emerald-700/50 border border-emerald-600/20'
                }`}
              >
                All Projects ({projects.length})
              </button>
              <button
                onClick={() => setFilter('owned')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'owned'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-800/30 text-emerald-100 hover:bg-emerald-700/50 border border-emerald-600/20'
                }`}
              >
                Owned ({projects.filter(p => p.owner._id === user._id).length})
              </button>
              <button
                onClick={() => setFilter('member')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'member'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-800/30 text-emerald-100 hover:bg-emerald-700/50 border border-emerald-600/20'
                }`}
              >
                Member ({projects.filter(p => p.owner._id !== user._id).length})
              </button>
            </div>

            {/* Search */}
            <div className="flex-1 md:max-w-md">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-emerald-500/30 bg-emerald-900/20 text-emerald-100 placeholder-emerald-200/50 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-emerald-900/20 rounded-lg shadow p-12 text-center border border-emerald-500/30 backdrop-blur-sm">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-emerald-100 mb-2">No Projects Found</h3>
            <p className="text-emerald-200/70 mb-6">
              {searchTerm ? 'Try a different search term' : 'Create your first project to get started'}
            </p>
            {!searchTerm && (
              <Link
                to="/projects/create"
                className="inline-block bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-2 rounded-lg hover:from-emerald-700 hover:to-green-700 transition"
              >
                Create Project
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-emerald-900/20 rounded-lg shadow hover:shadow-lg transition cursor-pointer border border-emerald-500/30 backdrop-blur-sm hover:bg-emerald-800/30"
              >
                <div onClick={() => navigate(`/projects/${project._id}`)} className="p-6">
                  {/* Project Header */}
                  <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-emerald-100 hover:text-lime-400">
                      {project.name}
                    </h3>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium bg-emerald-800/50 text-emerald-100 border border-emerald-600/30`}>
                        {project.priority}
                      </span>
                    </div>
                  </div>

                  {/* Project Description */}
                  <p className="text-emerald-200/80 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-green-900/50 text-green-100 border border-green-500/30`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Project Stats */}
                  <div className="flex items-center justify-between text-sm text-emerald-200/70 mb-4">
                    <div className="flex items-center">
                      <span className="mr-1">👤</span>
                      <span>{project.members.length + 1} members</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">📋</span>
                      <span>0 tickets</span>
                    </div>
                  </div>

                  {/* Owner Info */}
                  <div className="text-xs text-emerald-200/60 border-t border-emerald-500/30 pt-3">
                    <p>
                      Owner: <span className="font-medium text-emerald-100">{project.owner.name}</span>
                    </p>
                    <p className="mt-1">
                      Created: {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {project.owner._id === user._id && (
                  <div className="px-6 py-3 bg-emerald-900/30 border-t border-emerald-500/30 flex justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${project._id}/edit`);
                      }}
                      className="px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project._id, project.name);
                      }}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
