# Frontend Page: TicketDetail.jsx - Complete Explanation

Single ticket view with comments.

## 📋 Overview
- **Purpose**: View ticket details and discussion
- **Features**: Edit ticket, assign users, comments, status updates

---

## 🔑 Key Features

### **Fetch Ticket**
```jsx
const { id } = useParams();
const { currentTicket, fetchTicket, updateTicket } = useTicket();

useEffect(() => {
  fetchTicket(id);
}, [id]);
```

### **Ticket Info**
```jsx
<h1>{currentTicket.title}</h1>
<p>{currentTicket.description}</p>
<Badge status={currentTicket.status} />
<Badge priority={currentTicket.priority} />
<Badge type={currentTicket.type} />
```

### **Metadata**
```jsx
<div>
  <strong>Project:</strong> {currentTicket.project.name}
  <strong>Reported By:</strong> {currentTicket.reportedBy.name}
  <strong>Assigned To:</strong> {currentTicket.assignedTo?.name || 'Unassigned'}
  <strong>Due Date:</strong> {formatDate(currentTicket.dueDate)}
</div>
```

### **Status Update**
```jsx
<select value={currentTicket.status} onChange={handleStatusChange}>
  <option value="Open">Open</option>
  <option value="In Progress">In Progress</option>
  <option value="In Review">In Review</option>
  <option value="Resolved">Resolved</option>
  <option value="Closed">Closed</option>
</select>
```

### **Assignment**
```jsx
<select value={currentTicket.assignedTo?._id} onChange={handleAssignChange}>
  <option value="">Unassigned</option>
  {projectMembers.map(member => (
    <option key={member._id} value={member._id}>{member.name}</option>
  ))}
</select>
```

### **Comments**
```jsx
<CommentSection ticketId={id} />
```

### **Actions**
```jsx
<button onClick={() => setShowEdit(true)}>Edit</button>
<button onClick={() => handleDelete()}>Delete</button>
```

---

## 🎯 Usage
Protected route: `/tickets/:id`

---

## 📚 Related Files
- [frontend-components-CommentSection.md](frontend-components-CommentSection.md)
- [frontend-context-TicketContext.md](frontend-context-TicketContext.md)
- [frontend-components-EditTicketModal.md](frontend-components-EditTicketModal.md)
