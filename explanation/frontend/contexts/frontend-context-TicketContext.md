# Frontend Context: TicketContext.jsx - Complete Explanation

Ticket state management with filtering and assignment.

## 📋 Overview
- **Lines**: 157
- **Purpose**: Global ticket CRUD, filtering, assignment
- **Key Features**: Filter by project/status/priority, assign to users

---

## 🔑 Key Functions

### **State (Lines 17-20)**
```javascript
const { user } = useAuth();
const [tickets, setTickets] = useState([]);
const [currentTicket, setCurrentTicket] = useState(null);
const [loading, setLoading] = useState(false);
```

---

### **fetchTickets with Filters (Lines 23-36)**
```javascript
const fetchTickets = async (filters = {}) => {
  try {
    setLoading(true);
    const queryParams = new URLSearchParams(filters).toString();
    const response = await API.get(`/tickets${queryParams ? '?' + queryParams : ''}`);
    setTickets(response.data);
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to fetch tickets');
  } finally {
    setLoading(false);
  }
};
```
**Filters**: `{ project, status, priority, assignedTo, search }`
**Example**: `fetchTickets({ status: 'Open', priority: 'High' })`
**Result**: `GET /tickets?status=Open&priority=High`

---

### **fetchTicketsByProject (Lines 39-51)**
Gets all tickets for a specific project

---

### **fetchTicket (Lines 54-66)**
Gets single ticket with all populated fields

---

### **createTicket (Lines 69-80)**
```javascript
const createTicket = async (ticketData) => {
  try {
    const response = await API.post('/tickets', ticketData);
    setTickets([response.data, ...tickets]); // Prepend new ticket
    toast.success('Ticket created successfully!');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to create ticket');
    return null;
  }
};
```

---

### **updateTicket (Lines 83-98)**
Updates ticket and refreshes both list and currentTicket if needed

---

### **deleteTicket (Lines 101-111)**
Removes ticket from state after deletion

---

### **assignTicket (Lines 114-131)**
```javascript
const assignTicket = async (id, userId) => {
  try {
    const response = await API.put(`/tickets/${id}/assign`, { userId });
    setTickets(tickets.map(ticket => 
      ticket._id === id ? response.data : ticket
    ));
    if (currentTicket?._id === id) {
      setCurrentTicket(response.data);
    }
    toast.success('Ticket assigned successfully!');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to assign ticket');
    return null;
  }
};
```
**Assigns ticket** to user (or unassigns if userId is null)

---

### **Auto-fetch on Login (Lines 134-143)**
Fetches all user's tickets when logged in

---

## 🎯 Usage with Filters

```javascript
import { useTicket } from '../context/TicketContext';

function TicketList() {
  const { tickets, loading, fetchTickets } = useTicket();
  
  // Filter by status
  const filterByStatus = (status) => {
    fetchTickets({ status });
  };
  
  // Search tickets
  const search = (query) => {
    fetchTickets({ search: query });
  };
  
  // Multiple filters
  const filterComplex = () => {
    fetchTickets({
      project: projectId,
      status: 'Open',
      priority: 'High',
      assignedTo: userId
    });
  };
  
  return <div>{/* Render tickets */}</div>;
}
```

---

## 📚 Related Files
- [backend-controllers-ticket.md](backend-controllers-ticket.md) - Backend logic
- [frontend-pages-Tickets.md](frontend-pages-Tickets.md) - Ticket list with filters
- [frontend-pages-Kanban.md](frontend-pages-Kanban.md) - Kanban board view
