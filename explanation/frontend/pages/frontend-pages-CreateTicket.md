# Frontend Page: CreateTicket.jsx - Complete Explanation

Form to create new tickets.

## 📋 Overview
- **Purpose**: Create new bug/feature/task tickets
- **Features**: Form validation, project selection, priority, due date

---

## 🔑 Key Features

### **Form State**
```jsx
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
```

### **Project Selection**
```jsx
<select value={formData.project} onChange={handleChange}>
  <option value="">Select Project</option>
  {projects.map(project => (
    <option key={project._id} value={project._id}>{project.name}</option>
  ))}
</select>
```

### **Submit**
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await createTicket(formData);
  if (result) {
    navigate(`/tickets/${result._id}`);
  }
};
```

---

## 🎯 Usage
Protected route: `/tickets/create`

---

## 📚 Related Files
- [frontend-context-TicketContext.md](frontend-context-TicketContext.md)
- [backend-controllers-ticket.md](backend-controllers-ticket.md)
