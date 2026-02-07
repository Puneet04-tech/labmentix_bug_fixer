# frontend-page-Kanban.md

## Overview
The `Kanban.jsx` page displays tickets in a kanban board layout with drag-and-drop functionality and project filtering.

## File Location
```
frontend/src/pages/Kanban.jsx
```

## Dependencies - Detailed Import Analysis

```jsx
import { useState, useEffect } from 'react';
import { useTicket } from '../context/TicketContext';
import { useProject } from '../context/ProjectContext';
import { toast } from 'react-toastify';
import KanbanColumn from '../components/KanbanColumn';
```

### Import Statement Breakdown:
- **React Hooks**: `useState`, `useEffect` - State management and side effects
- **Ticket Context**: `useTicket` - Ticket data and operations
- **Project Context**: `useProject` - Project data for filtering
- **Toast Notifications**: `react-toastify` - User feedback for operations
- **KanbanColumn Component**: Individual column component with drag-and-drop

## State Management

```jsx
const [selectedProject, setSelectedProject] = useState('all');
const [loading, setLoading] = useState(false);
```

**Syntax Pattern**: Separate state variables for different UI concerns.

## Async Status Update Handler

```jsx
const handleStatusChange = async (ticketId, newStatus) => {
  setLoading(true);
  try {
    const result = await updateTicket(ticketId, { status: newStatus });
    if (result.success) {
      toast.success(`Ticket moved to ${newStatus}`);
    }
  } catch (error) {
    toast.error('Failed to update ticket status');
  } finally {
    setLoading(false);
  }
};
```

**Syntax Pattern**: Async function with try-catch-finally for error handling and loading states.

## Conditional Filtering with Ternary Operator

```jsx
const filteredTickets = selectedProject === 'all' 
  ? tickets 
  : tickets.filter(t => t.project?._id === selectedProject);
```

**Syntax Pattern**: Ternary operator for conditional logic with optional chaining.

## Array Filtering by Status

```jsx
tickets: filteredTickets.filter(t => t.status === 'Open')
```

**Syntax Pattern**: Filtering array by exact property match.

## Column Configuration Array

```jsx
const columns = [
  { 
    title: 'Open', 
    tickets: filteredTickets.filter(t => t.status === 'Open'),
    color: 'bg-blue-500'
  }
  // ... more columns
];
```

**Syntax Pattern**: Array of objects with computed properties.

## Array Includes Method for Status Checking

```jsx
filteredTickets.filter(t => ['Open', 'In Progress', 'In Review'].includes(t.status)).length
```

**Syntax Pattern**: Array includes method for multiple value checking.

## Map Over Projects Array

```jsx
{projects.map(project => (
  <option key={project._id} value={project._id}>
    {project.name}
  </option>
))}
```

**Syntax Pattern**: Array map for rendering dynamic options.

## Conditional Rendering with Logical AND

```jsx
{loading && (
  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    {/* Loading content */}
  </div>
)}
```

**Syntax Pattern**: Short-circuit evaluation for conditional rendering.

## Critical Code Patterns

### 1. Async Error Handling with Loading State
```jsx
const handleStatusChange = async (ticketId, newStatus) => {
  setLoading(true);
  try {
    await updateTicket(ticketId, { status: newStatus });
    toast.success('Success message');
  } catch (error) {
    toast.error('Error message');
  } finally {
    setLoading(false);
  }
};
```
**Pattern**: Try-catch-finally with loading state management.

### 2. Conditional Array Filtering
```jsx
const filtered = condition ? array : array.filter(item => item.property === value);
```
**Pattern**: Ternary operator for conditional filtering logic.

### 3. Safe Property Access in Filters
```jsx
array.filter(t => t.optionalProperty?._id === targetId)
```
**Pattern**: Optional chaining to safely access nested properties.

### 4. Array Includes for Multiple Conditions
```jsx
array.filter(item => ['value1', 'value2'].includes(item.property))
```
**Pattern**: Array includes method for checking against multiple values.

### 5. Dynamic Array Creation with Computed Properties
```jsx
const columns = statuses.map(status => ({
  title: status,
  tickets: tickets.filter(t => t.status === status),
  color: getColor(status)
}));
```
**Pattern**: Creating arrays of objects with computed/filtered properties.

### 6. Fixed Positioning with Transform
```jsx
className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
```
**Pattern**: Centering elements using transform translate.

### 7. Conditional Messages with Ternary
```jsx
{condition ? 'Message 1' : 'Message 2'}
```
**Pattern**: Ternary operator for conditional text rendering.
