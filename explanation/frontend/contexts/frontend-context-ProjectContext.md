# Frontend Context: ProjectContext.jsx - Complete Explanation

Project state management using React Context API.

## 📋 Overview
- **Lines**: 161
- **Purpose**: Global project CRUD operations and state
- **Dependencies**: AuthContext for user, API for backend calls

---

## 🔑 Key Functions

### **State (Lines 17-20)**
```javascript
const [projects, setProjects] = useState([]);
const [currentProject, setCurrentProject] = useState(null);
const [loading, setLoading] = useState(false);
const { user } = useAuth();
```

---

### **fetchProjects (Lines 23-36)**
```javascript
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
```
**When**: On user login, manual refresh
**Returns**: All projects user owns or is member of

---

### **fetchProject (Lines 39-53)**
Gets single project with populated owner and members

---

### **createProject (Lines 56-71)**
```javascript
const createProject = async (projectData) => {
  setLoading(true);
  try {
    const { data } = await API.post('/projects', projectData);
    setProjects([data, ...projects]); // Add to beginning
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
```
**Adds new project** to state immediately (optimistic update)

---

### **updateProject (Lines 74-89)**
Updates project and refreshes state with new data

---

### **deleteProject (Lines 92-105)**
Removes project from state after successful deletion

---

### **addMember (Lines 108-121)**
Adds team member to project

---

### **removeMember (Lines 124-137)**
Removes team member from project

---

### **Auto-fetch on Login (Lines 140-148)**
```javascript
useEffect(() => {
  if (user) {
    fetchProjects();
  } else {
    setProjects([]);
    setCurrentProject(null);
  }
}, [user]);
```
**Automatically fetches** projects when user logs in
**Clears state** when user logs out

---

## 🎯 Usage Example

```javascript
import { useProject } from '../context/ProjectContext';

function ProjectList() {
  const { projects, loading, createProject, deleteProject } = useProject();
  
  if (loading) return <Loader />;
  
  return (
    <div>
      {projects.map(project => (
        <div key={project._id}>
          <h3>{project.name}</h3>
          <button onClick={() => deleteProject(project._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 📚 Related Files
- [backend-controllers-project.md](backend-controllers-project.md) - Backend logic
- [frontend-pages-Projects.md](frontend-pages-Projects.md) - Project list UI
- [frontend-pages-CreateProject.md](frontend-pages-CreateProject.md) - Create form
