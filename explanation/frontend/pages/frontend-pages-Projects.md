# Frontend Page: Projects.jsx - Complete Explanation

Project list view with create and manage options.

## 📋 Overview
- **Purpose**: Display all user's projects
- **Features**: Project cards, search, create button, delete

---

## 🔑 Key Features

### **Fetch Projects**
```jsx
const { projects, loading, deleteProject } = useProject();

useEffect(() => {
  fetchProjects();
}, []);
```

### **Create Button**
```jsx
<Link to="/projects/create">
  <button className="btn-primary">+ New Project</button>
</Link>
```

### **Project Grid**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {projects.map(project => (
    <div key={project._id} className="card">
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <span className="badge">{project.status}</span>
      <Link to={`/projects/${project._id}`}>View Details</Link>
      <button onClick={() => handleDelete(project._id)}>Delete</button>
    </div>
  ))}
</div>
```

### **Delete Handler**
```jsx
const handleDelete = async (id) => {
  if (confirm('Delete project?')) {
    await deleteProject(id);
  }
};
```

---

## 🎯 Usage
Protected route: `/projects`

---

## 📚 Related Files
- [frontend-context-ProjectContext.md](frontend-context-ProjectContext.md)
- [frontend-pages-CreateProject.md](frontend-pages-CreateProject.md)
- [frontend-pages-ProjectDetail.md](frontend-pages-ProjectDetail.md)
