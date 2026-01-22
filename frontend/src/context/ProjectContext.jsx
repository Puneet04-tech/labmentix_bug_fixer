import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch all projects
  const fetchProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch projects';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single project
  const fetchProject = async (id) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/projects/${id}`);
      setCurrentProject(data);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch project';
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new project
  const createProject = async (projectData) => {
    setLoading(true);
    try {
      const { data } = await API.post('/projects', projectData);
      setProjects([data, ...projects]);
      toast.success('Project created successfully!');
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create project';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Update project
  const updateProject = async (id, projectData) => {
    setLoading(true);
    try {
      const { data } = await API.put(`/projects/${id}`, projectData);
      setProjects(projects.map(p => p._id === id ? data : p));
      setCurrentProject(data);
      toast.success('Project updated successfully!');
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update project';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    setLoading(true);
    try {
      await API.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
      toast.success('Project deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete project';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Add member to project
  const addMember = async (projectId, userId) => {
    try {
      const { data } = await API.post(`/projects/${projectId}/members`, { userId });
      setProjects(projects.map(p => p._id === projectId ? data : p));
      setCurrentProject(data);
      toast.success('Member added successfully!');
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add member';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Remove member from project
  const removeMember = async (projectId, userId) => {
    try {
      const { data } = await API.delete(`/projects/${projectId}/members/${userId}`);
      setProjects(projects.map(p => p._id === projectId ? data : p));
      setCurrentProject(data);
      toast.success('Member removed successfully!');
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove member';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Load projects when user logs in
  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
  }, [user]);

  const value = {
    projects,
    currentProject,
    loading,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    addMember,
    removeMember
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};
