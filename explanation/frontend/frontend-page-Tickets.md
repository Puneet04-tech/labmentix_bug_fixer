# frontend-page-Tickets.md

## Overview
The `Tickets.jsx` page displays a list of tickets with advanced filtering, URL synchronization, and search functionality.

## File Location
```
frontend/src/pages/Tickets.jsx
```

## Dependencies - Detailed Import Analysis

```jsx
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTicket } from '../context/TicketContext';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import FilterBar from '../components/FilterBar';
```

### Import Statement Breakdown:
- **React Hooks**: `useState`, `useEffect` - State management and side effects
- **React Router**: `Link`, `useSearchParams` - Navigation and URL parameter management
- **Ticket Context**: `useTicket` - Ticket data and operations
- **Project Context**: `useProject` - Project data for filtering
- **Auth Context**: `useAuth` - User authentication and permissions
- **FilterBar Component**: Complex filtering UI component

## URL Parameter State Management

```jsx
const [searchParams, setSearchParams] = useSearchParams();
const [userFilter, setUserFilter] = useState(searchParams.get('user') || 'all');
const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || '');
const [projectFilter, setProjectFilter] = useState(searchParams.get('project') || '');
```

**Syntax Pattern**: Reading URL parameters with fallback defaults using logical OR.

## URL Synchronization Effect

```jsx
useEffect(() => {
  const params = {};
  if (userFilter !== 'all') params.user = userFilter;
  if (searchTerm) params.search = searchTerm;
  if (statusFilter) params.status = statusFilter;
  if (priorityFilter) params.priority = priorityFilter;
  if (projectFilter) params.project = projectFilter;
  
  setSearchParams(params);
}, [userFilter, searchTerm, statusFilter, priorityFilter, projectFilter, setSearchParams]);
```

**Syntax Pattern**: Building parameter object conditionally and updating URL.

## Complex Multi-Criteria Filtering

```jsx
const filteredTickets = tickets.filter(ticket => {
  // Search filter
  const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
  
  // Status filter
  const matchesStatus = !statusFilter || ticket.status === statusFilter;
  
  // Priority filter
  const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
  
  // Project filter
  const matchesProject = !projectFilter || ticket.project._id === projectFilter;
  
  // User filter
  let matchesUser = true;
  if (userFilter === 'assigned') {
    matchesUser = ticket.assignedTo?._id === user._id;
  } else if (userFilter === 'reported') {
    matchesUser = ticket.reportedBy._id === user._id;
  }
  
  return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesUser;
});
```

**Syntax Pattern**: Multiple independent filter conditions combined with logical AND.

## Case-Insensitive Search

```jsx
ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
```

**Syntax Pattern**: String case normalization for case-insensitive matching.

## Optional Filter Logic

```jsx
const matchesStatus = !statusFilter || ticket.status === statusFilter;
```

**Syntax Pattern**: Empty filter string treated as "no filter" using logical OR.

## Safe Property Access

```jsx
ticket.assignedTo?._id === user._id
```

**Syntax Pattern**: Optional chaining for potentially null assignedTo field.

## Object Mapping for Status Colors

```jsx
const getStatusColor = (status) => {
  const colors = {
    'Open': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'In Review': 'bg-purple-100 text-purple-800',
    'Resolved': 'bg-green-100 text-green-800',
    'Closed': 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};
```

**Syntax Pattern**: Object lookup with fallback for unknown status values.

## Conditional Rendering with Optional Chaining

```jsx
{ticket.assignedTo && (
  <span>Assigned to: <span className="font-medium text-gray-700">{ticket.assignedTo.name}</span></span>
)}
```

**Syntax Pattern**: Truthy check before rendering optional assignee information.

## Permission Check for Delete Action

```jsx
{(ticket.reportedBy._id === user._id) && (
  <button onClick={() => handleDelete(ticket._id)}>Delete</button>
)}
```

**Syntax Pattern**: Reporter-only delete permission using ID comparison.

## Critical Code Patterns

### 1. URL Parameter State Initialization
```jsx
const [state, setState] = useState(searchParams.get('param') || 'default');
```
**Pattern**: Reading URL parameters with fallback defaults.

### 2. Conditional URL Parameter Building
```jsx
const params = {};
if (value !== 'default') params.key = value;
setSearchParams(params);
```
**Pattern**: Only including non-default values in URL parameters.

### 3. Multi-Predicate Array Filtering
```jsx
const filtered = array.filter(item => {
  const condition1 = /* check */;
  const condition2 = /* check */;
  return condition1 && condition2 && condition3 && condition4 && condition5;
});
```
**Pattern**: Complex filtering with multiple independent conditions.

### 4. Case-Insensitive String Search
```jsx
string.toLowerCase().includes(searchTerm.toLowerCase())
```
**Pattern**: Normalizing both strings to lowercase for case-insensitive matching.

### 5. Optional Filter Logic
```jsx
const matches = !filterValue || item.property === filterValue;
```
**Pattern**: Empty filter string means "include all" using logical OR.

### 6. Safe Nested Property Access
```jsx
item.optionalProperty?.nestedProperty === value
```
**Pattern**: Optional chaining to safely access potentially null nested properties.

### 7. Object Lookup with Fallback
```jsx
const result = mapping[key] || defaultValue;
```
**Pattern**: Object property access with fallback for unknown keys.

### 8. Conditional Rendering with Existence Check
```jsx
{item.optional && <span>{item.optional.property}</span>}
```
**Pattern**: Checking existence before rendering optional data.
