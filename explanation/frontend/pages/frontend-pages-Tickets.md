# Frontend Page: Tickets.jsx - Complete Explanation

Ticket list with filtering and search.

## 📋 Overview
- **Purpose**: Display all tickets with filters
- **Features**: Filter bar, search, status badges, pagination

---

## 🔑 Key Features

### **Fetch with Filters**
```jsx
const { tickets, fetchTickets } = useTicket();

const handleFilterChange = (filters) => {
  fetchTickets(filters);
};
```

### **Filter Bar**
```jsx
<FilterBar onFilterChange={handleFilterChange} />
```

### **Ticket Table**
```jsx
<table>
  <thead>
    <tr>
      <th>Title</th>
      <th>Status</th>
      <th>Priority</th>
      <th>Assigned To</th>
      <th>Created</th>
    </tr>
  </thead>
  <tbody>
    {tickets.map(ticket => (
      <tr key={ticket._id} onClick={() => navigate(`/tickets/${ticket._id}`)}>
        <td>{ticket.title}</td>
        <td><Badge status={ticket.status} /></td>
        <td><Badge priority={ticket.priority} /></td>
        <td>{ticket.assignedTo?.name || 'Unassigned'}</td>
        <td>{formatDate(ticket.createdAt)}</td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## 🎯 Usage
Protected route: `/tickets`

---

## 📚 Related Files
- [frontend-components-FilterBar.md](frontend-components-FilterBar.md)
- [frontend-context-TicketContext.md](frontend-context-TicketContext.md)
- [frontend-pages-TicketDetail.md](frontend-pages-TicketDetail.md)
