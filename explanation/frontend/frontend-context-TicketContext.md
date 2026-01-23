# TicketContext.jsx - Frontend Context Line-by-Line Explanation

## Overview
React Context providing global state management for tickets with CRUD operations, filtering, assignment, and API integration.

## Key Features
- Global tickets array state
- currentTicket for detail view
- 7 API functions: fetchTickets, fetchTicketsByProject, fetchTicket, createTicket, updateTicket, deleteTicket, assignTicket
- Toast notifications for all operations
- Auto-fetch on user login
- Loading state management

## Line-by-Line Analysis

### Lines 1-5: Imports
```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
```
- **createContext**: Create TicketContext
- **API**: Axios instance with token interceptor
- **useAuth**: Access user state for auto-fetch

### Lines 7-14: Context Setup
```jsx
const TicketContext = createContext();

export const useTicket = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicket must be used within a TicketProvider');
  }
  return context;
};
```
- **Custom hook**: useTicket() for consuming context
- **Error check**: Prevents using context outside provider
- **Same pattern as AuthContext and ProjectContext**

### Lines 16-20: State Management
```jsx
const { user } = useAuth();
const [tickets, setTickets] = useState([]);
const [currentTicket, setCurrentTicket] = useState(null);
const [loading, setLoading] = useState(false);
```
- **tickets**: Array of all tickets (list view)
- **currentTicket**: Single ticket (detail view)
- **loading**: Loading indicator for fetch operations

### Lines 22-35: Fetch All Tickets
```jsx
const fetchTickets = async (filters = {}) => {
  try {
    setLoading(true);
    const queryParams = new URLSearchParams(filters).toString();
    const response = await API.get(`/tickets${queryParams ? '?' + queryParams : ''}`);\n    setTickets(response.data);
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to fetch tickets');
  } finally {
    setLoading(false);
  }
};
```
- **filters parameter**: Optional query params object
- **URLSearchParams**: Convert object to query string
  - `{ status: 'Open', priority: 'High' }` → `status=Open&priority=High`
- **Conditional query**: Only add `?` if params exist
- **finally block**: Always reset loading state

### Lines 37-52: Fetch Tickets by Project
```jsx
const fetchTicketsByProject = async (projectId) => {
  try {
    setLoading(true);
    const response = await API.get(`/tickets/project/${projectId}`);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to fetch project tickets');
    return [];
  } finally {
    setLoading(false);
  }
};
```
- **Project-specific endpoint**: `/tickets/project/:projectId`
- **Returns data**: Unlike fetchTickets, this returns array directly
- **Return empty array on error**: Prevents undefined errors

### Lines 54-68: Fetch Single Ticket
```jsx
const fetchTicket = async (id) => {
  try {
    setLoading(true);
    const response = await API.get(`/tickets/${id}`);
    setCurrentTicket(response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to fetch ticket');
    return null;
  } finally {
    setLoading(false);
  }
};
```
- **Sets currentTicket**: Used by TicketDetail page
- **Also returns data**: Allows caller to use result
- **Return null on error**: Indicates failure

### Lines 70-83: Create Ticket
```jsx
const createTicket = async (ticketData) => {
  try {
    const response = await API.post('/tickets', ticketData);
    setTickets([response.data, ...tickets]);
    toast.success('Ticket created successfully!');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to create ticket');
    return null;
  }
};
```
- **Prepend to array**: `[response.data, ...tickets]` adds new ticket to start
- **Why prepend**: Show newest tickets first
- **Success toast**: Notify user of creation
- **Return new ticket**: Allows navigation to detail page

### Lines 85-103: Update Ticket
```jsx
const updateTicket = async (id, ticketData) => {
  try {
    const response = await API.put(`/tickets/${id}`, ticketData);
    setTickets(tickets.map(ticket => 
      ticket._id === id ? response.data : ticket
    ));
    if (currentTicket?._id === id) {
      setCurrentTicket(response.data);
    }
    toast.success('Ticket updated successfully!');
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update ticket');
    return null;
  }
};
```
- **.map() replacement**: Update specific ticket in array
  - Find ticket with matching id
  - Replace with updated data
  - Keep others unchanged
- **Update currentTicket**: If viewing updated ticket in detail page
- **Sync list and detail**: Ensures consistency across views

### Lines 105-118: Delete Ticket
```jsx
const deleteTicket = async (id) => {
  try {
    await API.delete(`/tickets/${id}`);
    setTickets(tickets.filter(ticket => ticket._id !== id));
    toast.success('Ticket deleted successfully!');
    return true;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to delete ticket');
    return false;
  }
};
```
- **.filter() removal**: Keep all tickets except deleted one
- **Return boolean**: true = success, false = failure
- **No loading state**: Delete is usually fast

### Lines 120-137: Assign Ticket
```jsx
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
- **Special endpoint**: `/tickets/:id/assign` (not PUT /tickets/:id)
- **userId parameter**: Can be null to unassign
- **Same pattern**: Update both tickets array and currentTicket

### Lines 139-149: Auto-Fetch on Login
```jsx
useEffect(() => {
  if (user) {
    fetchTickets();
  } else {
    setTickets([]);
    setCurrentTicket(null);
  }
}, [user]);
```
- **user dependency**: Runs when user logs in/out
- **Fetch on login**: Load tickets immediately
- **Clear on logout**: Reset to empty state
- **Why clear**: Security - don't show tickets after logout

### Lines 151-165: Provider Value
```jsx
const value = {
  tickets,
  currentTicket,
  loading,
  fetchTickets,
  fetchTicketsByProject,
  fetchTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  assignTicket,
  setCurrentTicket
};

return (
  <TicketContext.Provider value={value}>
    {children}
  </TicketContext.Provider>
);
```
- **11 exports**: 3 state + 7 functions + 1 setter
- **setCurrentTicket**: Allow manual control (e.g., clear on unmount)

## Related Files
- **api.js**: Axios instance with token interceptor
- **AuthContext.jsx**: Similar pattern, provides user state
- **ProjectContext.jsx**: Similar pattern for projects
- **TicketDetail.jsx**: Uses currentTicket and update functions
- **Tickets.jsx**: Uses tickets array and delete function
- **CreateTicket.jsx**: Uses createTicket function
- **Kanban.jsx**: Uses updateTicket for status changes

## State Management Pattern

| State | Used By | Updated By |
|-------|---------|------------|
| tickets[] | Tickets.jsx, Kanban.jsx, Dashboard.jsx | fetchTickets, create, update, delete |
| currentTicket | TicketDetail.jsx | fetchTicket, update, assign |
| loading | All pages | All fetch functions |

## API Endpoints Used

| Function | Method | Endpoint | Returns |
|----------|--------|----------|---------|
| fetchTickets | GET | /tickets?params | Array |
| fetchTicketsByProject | GET | /tickets/project/:id | Array |
| fetchTicket | GET | /tickets/:id | Object |
| createTicket | POST | /tickets | Object |
| updateTicket | PUT | /tickets/:id | Object |
| deleteTicket | DELETE | /tickets/:id | - |
| assignTicket | PUT | /tickets/:id/assign | Object |

## Optimistic vs Pessimistic Updates
This context uses **pessimistic updates**:
1. API call first
2. Wait for response
3. Update state if successful
4. Show error if failed

**Alternative (optimistic)**:
1. Update state immediately
2. API call in background
3. Revert if failed

## Context Nesting in App.jsx
```jsx
<AuthProvider>
  <ProjectProvider>
    <TicketProvider>
      <App />
    </TicketProvider>
  </ProjectProvider>
</AuthProvider>
```
- **Order matters**: TicketContext uses AuthContext (depends on user)
- **ProjectContext**: Independent, used by CreateTicket for project selection
