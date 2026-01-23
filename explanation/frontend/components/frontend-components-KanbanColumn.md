# Frontend Component: KanbanColumn.jsx - Complete Explanation

Drag-and-drop column for Kanban board.

## 📋 Overview
- **Purpose**: Display tickets in Kanban column
- **Features**: Drag-and-drop, ticket cards, column header

---

## 🔑 Key Features

### **Props**
```jsx
const KanbanColumn = ({ status, tickets, onDrop }) => {
```
- **status**: "Open", "In Progress", "Resolved"
- **tickets**: Array of tickets with this status
- **onDrop**: Called when ticket dropped

### **Drop Handler**
```jsx
const handleDrop = (e) => {
  e.preventDefault();
  const ticketId = e.dataTransfer.getData('ticketId');
  onDrop(ticketId, status); // Update ticket status
};
```

### **Ticket Card**
```jsx
<div
  draggable
  onDragStart={(e) => e.dataTransfer.setData('ticketId', ticket._id)}
  className="bg-white p-4 rounded shadow mb-2 cursor-move"
>
  <h4>{ticket.title}</h4>
  <span className="badge">{ticket.priority}</span>
</div>
```

### **Column Header**
```jsx
<div className="bg-gray-100 p-4 rounded-t">
  <h3>{status}</h3>
  <span className="badge">{tickets.length}</span>
</div>
```

---

## 🎯 Usage
```jsx
<KanbanColumn
  status="Open"
  tickets={openTickets}
  onDrop={(ticketId, newStatus) => updateTicket(ticketId, { status: newStatus })}
/>
```

---

## 📚 Related Files
- [frontend-pages-Kanban.md](frontend-pages-Kanban.md)
- [frontend-context-TicketContext.md](frontend-context-TicketContext.md)
