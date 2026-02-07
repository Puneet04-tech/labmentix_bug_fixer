import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTicket } from '../context/TicketContext';
import { useProject } from '../context/ProjectContext';
import ScreenshotUpload from '../components/ScreenshotUpload';

const CreateTicket = () => {
  const navigate = useNavigate();
  const { createTicket } = useTicket();
  const { projects, fetchProjects } = useProject();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Bug',
    status: 'Open',
    priority: 'Medium',
    project: '',
    assignedTo: '',
    dueDate: ''
  });

  const [projectMembers, setProjectMembers] = useState([]);
  const [screenshots, setScreenshots] = useState([]);

  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects();
    }
  }, []);

  useEffect(() => {
    try {
      // Get members of selected project
      if (formData.project && projects.length > 0) {
        const selectedProject = projects.find(p => p._id === formData.project);
        if (selectedProject && selectedProject.owner) {
          const members = [
            // Add owner if they exist
            selectedProject.owner._id ? {
              _id: selectedProject.owner._id,
              name: selectedProject.owner.name || 'Unknown Owner',
              email: selectedProject.owner.email || ''
            } : null,
            // Add members with proper filtering
            ...(selectedProject.members || [])
              .filter(member => member && member.user && member.user._id)
              .map(member => ({
                _id: member.user._id,
                name: member.user.name || 'Unknown User',
                email: member.user.email || ''
              }))
          ].filter(Boolean); // Remove any null entries

          setProjectMembers(members);
        } else {
          setProjectMembers([]);
        }
      } else {
        setProjectMembers([]);
      }
    } catch (error) {
      console.error('Error loading project members:', error);
      setProjectMembers([]);
    }
  }, [formData.project, projects]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.project) {
      alert('Please fill in all required fields');
      return;
    }

    const ticketData = {
      ...formData,
      assignedTo: formData.assignedTo || undefined,
      dueDate: formData.dueDate || undefined,
      attachments: screenshots.map(screenshot => ({
        name: screenshot.name,
        filename: screenshot.filename,
        url: screenshot.uploadedUrl,
        size: screenshot.size,
        type: screenshot.type
      }))
    };

    const newTicket = await createTicket(ticketData);
    if (newTicket) {
      // Reset form after successful creation
      setFormData({
        title: '',
        description: '',
        type: 'Bug',
        status: 'Open',
        priority: 'Medium',
        project: '',
        assignedTo: '',
        dueDate: ''
      });
      setScreenshots([]);
      navigate('/tickets');
    }
  };

  const today = new Date().toISOString().split('T')[0];

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
        <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-lime-400 mb-2 text-center drop-shadow-lg">Create New Ticket</h1>
        <p className="text-slate-400">Report a bug, request a feature, or create a task</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0f1724] rounded-lg shadow-md p-8">
        {/* Title */}
        <div className="mb-6">
          <label className="block text-slate-400 font-medium mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={100}
            required
            className="w-full px-4 py-2 border border-slate-700 bg-[#0f1724] text-slate-100 placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Brief description of the issue or task"
          />
          <p className="text-sm text-slate-400 mt-1">{formData.title.length}/100 characters</p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-slate-400 font-medium mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength={2000}
            required
            rows={6}
            className="w-full px-4 py-2 border border-slate-700 bg-[#0f1724] text-slate-100 placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Detailed description of the ticket..."
          />
          <p className="text-sm text-slate-400 mt-1">{formData.description.length}/2000 characters</p>
        </div>

        {/* Project */}
        <div className="mb-6">
          <label className="block text-slate-400 font-medium mb-2">
            Project <span className="text-red-500">*</span>
          </label>
          <select
            name="project"
            value={formData.project}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-700 bg-[#0f1724] text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select a project</option>
            {projects
              .filter(project => project && project._id && project.name)
              .map(project => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Type */}
          <div>
            <label className="block text-slate-400 font-medium mb-2">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-700 bg-[#0f1724] text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="Bug">🐛 Bug</option>
              <option value="Feature">✨ Feature</option>
              <option value="Improvement">🔧 Improvement</option>
              <option value="Task">📋 Task</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-slate-400 font-medium mb-2">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-700 bg-[#0f1724] text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Status */}
          <div>
            <label className="block text-slate-400 font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-700 bg-[#0f1724] text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-slate-400 font-medium mb-2">Assign To</label>
              <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              disabled={!formData.project}
                className="w-full px-4 py-2 border border-slate-700 bg-[#0f1724] text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-[#0b1220]"
            >
              <option value="">Unassigned</option>
              {projectMembers
                .filter(member => member && member._id && member.name)
                .map(member => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.email || 'No email'})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div className="mb-8">
          <label className="block text-slate-400 font-medium mb-2">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            min={today}
            className="w-full px-4 py-2 border border-slate-700 bg-[#0f1724] text-slate-100 placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Screenshots */}
        <div className="mb-8">
          <label className="block text-slate-400 font-medium mb-2">
            Screenshots & Attachments
          </label>
          <ScreenshotUpload
            onFilesChange={setScreenshots}
            maxFiles={5}
            maxSize={5 * 1024 * 1024}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 neon-btn neon-glow"
          >
            Create Ticket
          </button>
          <button
            type="button"
            onClick={() => navigate('/tickets')}
              className="flex-1 bg-[#122433] hover:bg-[#122433] text-slate-100 font-medium py-3 px-6 rounded-lg transition duration-200 neon-btn neon-glow"
          >
            Cancel
          </button>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
