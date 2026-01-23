# Frontend Context: ProjectContext.jsx - COMPLETE LINE-BY-LINE EXPLANATION

## 📋 File Overview
**Location**: `frontend/src/contexts/ProjectContext.jsx`  
**Lines**: 167  
**Purpose**: Global project state management with full CRUD operations

---

## 🎯 Core Functionality

**What It Does**:
1. Manages array of all projects
2. Tracks current project for detail view
3. Provides CRUD functions (Create, Read, Update, Delete)
4. Handles project member management
5. Auto-fetches projects when user logs in

**State Management Pattern**: Optimistic updates + API sync

---

## 📝 LINE-BY-LINE BREAKDOWN

### **Lines 1-3: Imports**
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';
import { useAuth } from './AuthContext';
```

**Line 1**: React hooks for context and state
**Line 2**: Toast notifications for success/error
**Line 3**: Axios instance with authentication
**Line 4**: Access user state from AuthContext

### Technical Terms Glossary

- **Context API**: React system for global state; avoids prop drilling.
- **Optimistic UI**: Immediately reflect changes in UI before server confirmation.
- **API client (Axios instance)**: Centralized HTTP client used to call backend endpoints.
- **useEffect dependency array**: Controls when effect runs; e.g., `[user]` means run when `user` changes.
- **Spread operator `...`**: Expands elements of an array or properties of an object.
- **Destructuring**: Extract values from objects/arrays into variables, e.g. `const { data } = response`.

---

### Important Import & Syntax Explanations

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';
import { useAuth } from './AuthContext';
```

- `createContext()`: Creates a context object for `ProjectContext`.
- `useProject` pattern: Custom hook wrapping `useContext(ProjectContext)` to ensure proper usage.
- `useAuth()`: Accesses logged-in user; used to trigger fetching when user logs in.
- `API.get('/projects')`: Calls backend `GET /api/projects` endpoint; uses Axios instance with token header.
- `setProjects([data, ...projects])`: Prepends new project to array using spread operator.


### **Lines 5-13: Create Context + Custom Hook**
```javascript
const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
};
```

**Same pattern as AuthContext** - Enforces proper usage

### **Lines 15-19: ProjectProvider Start + State**
```javascript
export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
```

**Line 16**: `projects` - Array of ALL projects
- Example: `[{ _id: '123', name: 'Bug Tracker', owner: {...}, members: [...] }, ...]`

**Line 17**: `currentProject` - Single project for detail view
- Used by ProjectDetail.jsx to show one project's full info

**Line 18**: `loading` - True during API calls

**Line 19**: `user` from AuthContext - Only fetch projects if user logged in

### **Lines 23-35: Fetch All Projects**
```javascript
const fetchProjects = async () => {
  try {
    setLoading(true);
    const { data } = await API.get('/projects');
    setProjects(data);
  } catch (error) {
    toast.error('Failed to fetch projects');
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

**Line 24**: `setLoading(true)` - Show loading state

**Line 25**: GET `/projects`
- Backend returns projects where user is owner OR member
- Backend query:
  ```javascript
  const projects = await Project.find({
    $or: [{ owner: req.user.id }, { members: req.user.id }]
  });
  ```

**Line 26**: `setProjects(data)` - Replace entire projects array

**Line 30**: `finally` block - **Always runs** (even if error)
- Ensures loading state reset

### **Lines 38-50: Fetch Single Project**
```javascript
const fetchProject = async (id) => {
  try {
    setLoading(true);
    const { data } = await API.get(`/projects/${id}`);
    setCurrentProject(data);
    return data;
  } catch (error) {
    toast.error('Failed to fetch project');
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

**Line 40**: GET `/projects/:id` - Single project by ID

**Line 41**: `setCurrentProject(data)` - Store in separate state
- **Why separate?** ProjectDetail.jsx needs full details
- `projects` array only has basic info

**Line 42**: `return data` - **Allows chaining**
```javascript
const project = await fetchProject(id);
console.log(project.name);
```

### **Lines 53-65: Create Project**
```javascript
const createProject = async (projectData) => {
  try {
    setLoading(true);
    const { data } = await API.post('/projects', projectData);
    setProjects([data, ...projects]);  // Add to beginning
    toast.success('Project created successfully');
    return data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to create project');
    throw error;
  } finally {
    setLoading(false);
  }
};
```

**Line 56**: POST `/projects` with form data

**Line 57**: `setProjects([data, ...projects])` - **Optimistic UI Update**
- Add new project to START of array
- **Why start?** Newest projects appear first
- Spread operator `...projects` preserves existing projects

**Before**:
```javascript
projects = [{ _id: '1', name: 'Old Project' }]
```

**After**:
```javascript
projects = [
  { _id: '2', name: 'New Project' },  // ← Added at start
  { _id: '1', name: 'Old Project' }
]
```

**Line 58**: Success toast

**Line 59**: `return data` - CreateProject.jsx can navigate:
```javascript
const newProject = await createProject(formData);
navigate(`/projects/${newProject._id}`);
```

**Line 61**: `throw error` - CreateProject.jsx can handle validation errors

### **Lines 68-82: Update Project**
```javascript
const updateProject = async (id, projectData) => {
  try {
    setLoading(true);
    const { data } = await API.put(`/projects/${id}`, projectData);
    setProjects(projects.map(p => p._id === id ? data : p));
    setCurrentProject(data);
    toast.success('Project updated successfully');
    return data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update project');
    throw error;
  } finally {
    setLoading(false);
  }
};
```

**Line 71**: PUT `/projects/:id` with updated data

**Line 72**: `setProjects(projects.map(p => p._id === id ? data : p))`
- **Map through array, replace updated project**
- If project ID matches → Use new data
- If project ID doesn't match → Keep original

**Before**:
```javascript
projects = [
  { _id: '1', name: 'Old Name', status: 'Planning' },
  { _id: '2', name: 'Other' }
]
```

**After updating project 1**:
```javascript
projects = [
  { _id: '1', name: 'New Name', status: 'In Progress' },  // ← Updated
  { _id: '2', name: 'Other' }  // ← Unchanged
]
```

**Line 73**: `setCurrentProject(data)` - Also update detail view
- **Why?** If user on ProjectDetail.jsx, they see updated data immediately

### **Lines 85-97: Delete Project**
```javascript
const deleteProject = async (id) => {
  try {
    setLoading(true);
    await API.delete(`/projects/${id}`);
    setProjects(projects.filter(p => p._id !== id));
    toast.success('Project deleted successfully');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to delete project');
    throw error;
  } finally {
    setLoading(false);
  }
};
```

**Line 88**: DELETE `/projects/:id`

**Line 89**: `setProjects(projects.filter(p => p._id !== id))`
- **Filter keeps projects where ID doesn't match**
- Removes deleted project from array

**Before**:
```javascript
projects = [
  { _id: '1', name: 'Project A' },
  { _id: '2', name: 'Project B' },
  { _id: '3', name: 'Project C' }
]
```

**After deleting project 2**:
```javascript
projects = [
  { _id: '1', name: 'Project A' },
  { _id: '3', name: 'Project C' }  // Project B removed
]
```

**No setCurrentProject()** - User likely navigating away after delete

### **Lines 100-113: Add Member to Project**
```javascript
const addMember = async (projectId, userId) => {
  try {
    setLoading(true);
    const { data } = await API.post(`/projects/${projectId}/members`, { userId });
    setProjects(projects.map(p => p._id === projectId ? data : p));
    setCurrentProject(data);
    toast.success('Member added successfully');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to add member');
    throw error;
  } finally {
    setLoading(false);
  }
};
```

**Line 103**: POST `/projects/:projectId/members` with `{ userId }`

**Backend adds user to members array**:
```javascript
project.members.push(userId);
await project.save();
```

**Line 104**: Update project in array (same map pattern as update)

**Line 105**: Update currentProject for detail view

### **Lines 116-129: Remove Member from Project**
```javascript
const removeMember = async (projectId, userId) => {
  try {
    setLoading(true);
    const { data } = await API.delete(`/projects/${projectId}/members/${userId}`);
    setProjects(projects.map(p => p._id === projectId ? data : p));
    setCurrentProject(data);
    toast.success('Member removed successfully');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to remove member');
    throw error;
  } finally {
    setLoading(false);
  }
};
```

**Line 119**: DELETE `/projects/:projectId/members/:userId`

**Backend removes user from members array**:
```javascript
project.members = project.members.filter(m => m.toString() !== userId);
await project.save();
```

**Same map pattern** to update state

### **Lines 147-154: Auto-Fetch on Login**
```javascript
useEffect(() => {
  if (user) {
    fetchProjects();
  } else {
    setProjects([]);
  }
}, [user]);
```

**Line 148**: `if (user)` - User just logged in

**Line 149**: `fetchProjects()` - Load user's projects

**Lines 150-152**: `else` - User logged out
- Clear projects array
- **Why?** Don't show previous user's projects

**Line 154**: `[user]` dependency - Runs when user changes
- Login → user becomes object → fetch projects
- Logout → user becomes null → clear projects

### **Lines 132-145: Context Provider Value**
```javascript
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
  removeMember,
};

return (
  <ProjectContext.Provider value={value}>
    {children}
  </ProjectContext.Provider>
);
```

**Lines 132-143**: Value object with state + functions

**Line 145**: Provider makes everything available to children

---

## 🔄 State Management Patterns

### **Pattern 1: Optimistic Array Updates**

**Create** - Add to start:
```javascript
setProjects([newProject, ...projects]);
```

**Update** - Map and replace:
```javascript
setProjects(projects.map(p => p._id === id ? updatedProject : p));
```

**Delete** - Filter out:
```javascript
setProjects(projects.filter(p => p._id !== id));
```

### **Pattern 2: Dual State Management**
```javascript
const [projects, setProjects] = useState([]);       // For list views
const [currentProject, setCurrentProject] = useState(null);  // For detail view
```

**Why both?**
- Projects.jsx displays `projects` array
- ProjectDetail.jsx needs full `currentProject` details
- Member management updates both simultaneously

### **Pattern 3: Loading States**
```javascript
try {
  setLoading(true);
  await API.call();
} finally {
  setLoading(false);  // Always runs
}
```

**Why finally?** Loading resets even if API call fails

---

## 🎯 Usage in Components

**In Projects.jsx (List View)**:
```javascript
const { projects, loading, deleteProject } = useProject();

return (
  <div>
    {loading && <Loader />}
    {projects.map(project => (
      <ProjectCard 
        key={project._id} 
        project={project}
        onDelete={() => deleteProject(project._id)}
      />
    ))}
  </div>
);
```

**In CreateProject.jsx**:
```javascript
const { createProject } = useProject();
const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  const newProject = await createProject(formData);
  navigate(`/projects/${newProject._id}`);  // Navigate to new project
};
```

**In ProjectDetail.jsx**:
```javascript
const { currentProject, fetchProject, addMember } = useProject();
const { id } = useParams();

useEffect(() => {
  fetchProject(id);
}, [id]);

return <h1>{currentProject?.name}</h1>;
```

**In Dashboard.jsx (First 5 Projects)**:
```javascript
const { projects } = useProject();
const recentProjects = projects.slice(0, 5);

return (
  <div>
    {recentProjects.map(p => <ProjectCard key={p._id} project={p} />)}
  </div>
);
```

---

## 🚨 Common Issues

**Issue**: Projects don't update when member added
```javascript
// PROBLEM: Not updating both states
const addMember = async (projectId, userId) => {
  await API.post(`/projects/${projectId}/members`, { userId });
  // Forgot to update state!
};

// SOLUTION: Update both projects array and currentProject
const addMember = async (projectId, userId) => {
  const { data } = await API.post(`/projects/${projectId}/members`, { userId });
  setProjects(projects.map(p => p._id === projectId ? data : p));
  setCurrentProject(data);
};
```

**Issue**: Duplicate projects appear after creation
```javascript
// PROBLEM: Not checking if project already exists
useEffect(() => {
  fetchProjects();  // Runs every render!
}, [projects]);  // Projects change → fetch again → infinite loop

// SOLUTION: Only fetch when user logs in
useEffect(() => {
  if (user) fetchProjects();
}, [user]);
```

**Issue**: Old user's projects visible after logout
```javascript
// PROBLEM: Not clearing state on logout
useEffect(() => {
  if (user) fetchProjects();
}, [user]);

// SOLUTION: Clear projects when user logs out
useEffect(() => {
  if (user) {
    fetchProjects();
  } else {
    setProjects([]);  // Clear on logout
  }
}, [user]);
```

---

## 🎓 Key Concepts

**Array Immutability in React**: Never mutate state directly
```javascript
// WRONG - Mutates array
projects.push(newProject);
setProjects(projects);  // React won't detect change!

// CORRECT - Create new array
setProjects([...projects, newProject]);
```

**Optimistic UI Updates**: Update UI before API confirms
```javascript
// Instant feedback:
setProjects([data, ...projects]);  // Update UI immediately
toast.success('Created!');

// If API fails, could rollback:
catch (error) {
  setProjects(projects);  // Revert to old state
}
```

**Context vs Props**: When to use each
- **Props**: Parent → Child (1-2 levels)
- **Context**: Global state (many components need it)
- Projects used by: Dashboard, Projects, ProjectDetail, CreateProject, Tickets, etc.

---

## 🔗 Related Files
- [Projects.jsx](../pages/frontend-pages-Projects.md) - Displays projects array
- [ProjectDetail.jsx](../pages/frontend-pages-ProjectDetail.md) - Shows currentProject
- [CreateProject.jsx](../pages/frontend-pages-CreateProject.md) - Uses createProject()
- [Dashboard.jsx](../pages/frontend-pages-Dashboard.md) - Shows first 5 projects
- [backend-controller-project.md](../../backend/controllers/backend-controller-project.md) - Backend CRUD logic

---

Core of project management - handles all project operations with optimistic updates! 📂✨
