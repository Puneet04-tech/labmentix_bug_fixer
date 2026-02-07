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
        size: screenshot.size,
        type: screenshot.type,
        url: screenshot.uploadedUrl || null,
        filename: screenshot.filename || null,
        status: screenshot.uploadedUrl ? 'uploaded' : 'pending'
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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Create New Ticket</h1>
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
  );
};

export default CreateTicket;
