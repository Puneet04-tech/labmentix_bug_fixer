# Frontend Page: Kanban.jsx - Complete Explanation

Drag-and-drop Kanban board for tickets.

## 📋 Overview
- **Purpose**: Visual ticket workflow management
- **Features**: Drag-and-drop between columns, real-time updates

---

## 🔑 Key Features

### **Columns**
```jsx
const columns = ['Open', 'In Progress', 'In Review', 'Resolved', 'Closed'];
```

### **Fetch Tickets**
```jsx
const { tickets, fetchTickets, updateTicket } = useTicket();

useEffect(() => {
  fetchTickets();
}, []);
```

### **Group by Status**
```jsx
const ticketsByStatus = columns.reduce((acc, status) => {
  acc[status] = tickets.filter(t => t.status === status);
  return acc;
}, {});
```

### **Kanban Board**
```jsx
<div className="flex space-x-4 overflow-x-auto">
  {columns.map(status => (
    <KanbanColumn
      key={status}
      status={status}
      tickets={ticketsByStatus[status]}
      onDrop={handleDrop}
    />
  ))}
</div>
```

### **Drop Handler**
```jsx
const handleDrop = async (ticketId, newStatus) => {
  await updateTicket(ticketId, { status: newStatus });
  fetchTickets(); // Refresh
};
```

---

## 🎯 Usage
Protected route: `/kanban`

---

## 📚 Related Files
- [frontend-components-KanbanColumn.md](frontend-components-KanbanColumn.md)
- [frontend-context-TicketContext.md](frontend-context-TicketContext.md)
