import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

const CreateProject = () => {
  const navigate = useNavigate();
  const { createProject, loading } = useProject();
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const [errors, setErrors] = useState({});

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await createProject(formData);
    if (result && result.success) {
      navigate('/projects');
    }
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
            <p className="font-medium text-slate-900">{user?.name}</p>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm">
          <Link to="/projects" className="text-primary-600 hover:text-primary-700">
            Projects
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-600">Create New Project</span>
        </nav>

        {/* Form Card */}
        <div className="bg-[#0f1724] rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Create New Project</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg bg-[#0f1724] text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                  errors.name ? 'border-red-500' : 'border-slate-700'
                }`}
                placeholder="Enter project name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-400 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-2 border rounded-lg bg-[#0f1724] text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
                  errors.description ? 'border-red-500' : 'border-slate-700'
                }`}
                placeholder="Describe your project..."
              />
              <p className="text-sm text-slate-500 mt-1">
                {formData.description.length}/500 characters
              </p>
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-400 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-[#0f1724] text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-slate-400 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-[#0f1724] text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Start Date and End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-slate-400 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-[#0f1724] text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-slate-400 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg bg-[#0f1724] text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                    errors.endDate ? 'border-red-500' : 'border-slate-700'
                  }`}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <Link
                to="/projects"
                className="px-6 py-2 border border-slate-700 text-slate-100 rounded-lg hover:bg-[#122433] transition neon-btn neon-glow"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed neon-btn neon-glow"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
    </div>
  );
};

export default CreateProject;
