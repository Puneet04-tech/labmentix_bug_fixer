# Tickets.jsx - Frontend Page Line-by-Line Explanation

## Overview
Tickets list page with advanced filtering (5 filter types), URL params synchronization, search, and FilterBar component integration.

## Key Features
- 5 filter types: user (all/assigned/reported), search, status, priority, project
- URL params synchronization (filters persist on page reload/share)
- FilterBar component for complex filter UI
- Real-time filtering with multiple criteria
- Color-coded status/priority badges
- Delete permission check (only reporter can delete)

## Line-by-Line Analysis

### Lines 1-6: Imports
```jsx
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTicket } from '../context/TicketContext';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import FilterBar from '../components/FilterBar';
```
- **useSearchParams**: React Router hook to read/write URL query params
- **FilterBar**: Complex filtering UI component

### Technical Terms Glossary
- **URL-sync filters**: Persisting UI filter state in the URL (`useSearchParams`) so page state is shareable and bookmarkable.
- **Derived filtering**: Building `filteredTickets` by applying multiple predicate checks (search/status/priority/project/user) over the tickets array.
- **Performance consideration**: For large lists, consider memoizing filtered results with `useMemo` to avoid repeated expensive computations on each render.

### Important Import & Syntax Explanations
- `useSearchParams()`: Hook to read and update the URL query string without a full reload; `setSearchParams(params)` updates the URL.
- `tickets.filter(...)`: Functional filtering pattern; each predicate should be short and return boolean quickly.
- `ticket.title.toLowerCase().includes(searchTerm.toLowerCase())`: Case-insensitive search — normalize both strings to lowercase before comparing.
- `setSearchParams(params)` inside `useEffect` with dependencies: keeps URL in sync whenever filter state changes; avoid cycles by ensuring initial state reads from `searchParams`.
- Accessibility note: Ensure table/list rows have appropriate landmarks and that filter controls are keyboard-accessible with labels.

### Lines 11-17: URL Params Initialization (CRITICAL)
```jsx
const [userFilter, setUserFilter] = useState(searchParams.get('user') || 'all');
const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || '');
const [projectFilter, setProjectFilter] = useState(searchParams.get('project') || '');
```
- **searchParams.get('user')**: Read 'user' param from URL (?user=assigned)
- **|| 'all'**: Default to 'all' if no param exists
- **5 filter states**: user, search, status, priority, project
- **Why URL params**: Filters persist on page reload, shareable URLs

### Lines 23-34: URL Params Sync Effect (CRITICAL)
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
- **Runs on every filter change**: When any filter state updates
- **Build params object**: Only include non-default values
- **setSearchParams(params)**: Updates URL without page reload
- **Result**: URL like `/tickets?user=assigned&status=Open&priority=High`

### Lines 36-42: Clear All Filters
```jsx
const handleClearFilters = () => {
  setUserFilter('all');
  setSearchTerm('');
  setStatusFilter('');
  setPriorityFilter('');
  setProjectFilter('');
};
```
- **Reset all filters**: Set to default values
- **URL will update**: Via useEffect above

### Lines 44-72: Complex Filter Logic (CRITICAL)
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
- **5 separate checks**: Each filter is independent
- **matchesSearch**: Title OR description (case-insensitive)
- **matchesStatus**: `!statusFilter` means no filter applied (include all)
- **matchesPriority**: Same pattern - empty filter = no restriction
- **matchesProject**: Compare project._id with selected project ID
- **matchesUser**: 3 options
  - 'all': true (no filter)
  - 'assigned': `ticket.assignedTo?._id === user._id`
  - 'reported': `ticket.reportedBy._id === user._id`
- **ALL conditions must be true**: AND logic

### Lines 74-90: Helper Functions
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
- **5 ticket statuses**: Open, In Progress, In Review, Resolved, Closed
- **Color progression**: Blue → Yellow → Purple → Green → Gray

### Lines 110-124: FilterBar Component
```jsx
<FilterBar
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  statusFilter={statusFilter}
  setStatusFilter={setStatusFilter}
  priorityFilter={priorityFilter}
  setPriorityFilter={setPriorityFilter}
  projectFilter={projectFilter}
  setProjectFilter={setProjectFilter}
  userFilter={userFilter}
  setUserFilter={setUserFilter}
  projects={projects}
  tickets={tickets}
  onClearFilters={handleClearFilters}
/>
```
- **Pass all filter states**: FilterBar controls all 5 filters
- **Pass setters**: FilterBar can update state
- **Pass data**: projects array for project dropdown, tickets for counts
- **onClearFilters**: Callback to reset all filters

### Lines 195-215: Ticket Card
```jsx
<div key={ticket._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{getTypeIcon(ticket.type)}</span>
        <Link
          to={`/tickets/${ticket._id}`}
          className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition"
        >
          {ticket.title}
        </Link>
      </div>
```
- **Emoji icons**: Different icon per ticket type (Bug 🐛, Feature ✨, etc.)
- **Title link**: Navigate to ticket detail page

### Lines 217-223: Ticket Info
```jsx
<div className="flex flex-wrap gap-4 text-sm text-gray-500">
  <span>Project: <span className="font-medium text-gray-700">{ticket.project.name}</span></span>
  <span>Reported by: <span className="font-medium text-gray-700">{ticket.reportedBy.name}</span></span>
  {ticket.assignedTo && (
    <span>Assigned to: <span className="font-medium text-gray-700">{ticket.assignedTo.name}</span></span>
  )}
```
- **Conditional assignee**: Only show if ticket.assignedTo exists
- **Populated fields**: project, reportedBy, assignedTo are ObjectId refs

### Lines 232-242: Delete Permission
```jsx
{(ticket.reportedBy._id === user._id) && (
  <button
    onClick={() => handleDelete(ticket._id)}
    className="text-red-600 hover:text-red-800 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition"
  >
    Delete
  </button>
)}
```
- **Reporter-only delete**: `ticket.reportedBy._id === user._id`
- **No delete for others**: Even if assigned or project owner

## Related Files
- **TicketContext.jsx**: Provides tickets array, fetchTickets, deleteTicket
- **FilterBar.jsx**: Complex filter UI component
- **TicketDetail.jsx**: Navigation destination for ticket cards
- **CreateTicket.jsx**: Navigation destination for "New Ticket" button

## Filter Logic Summary

| Filter | Options | Logic |
|--------|---------|-------|
| User | all, assigned, reported | assigned: ticket.assignedTo._id === user._id<br>reported: ticket.reportedBy._id === user._id |
| Search | text input | title OR description contains term (case-insensitive) |
| Status | 5 dropdown options | ticket.status === selectedStatus (or all if empty) |
| Priority | 4 dropdown options | ticket.priority === selectedPriority (or all if empty) |
| Project | dropdown of projects | ticket.project._id === selectedProjectId (or all if empty) |

## URL Params Feature
- **Read on mount**: `searchParams.get('user')` initializes state from URL
- **Write on change**: `setSearchParams(params)` updates URL on every filter change
- **Benefits**:
  - Shareable filtered views: `/tickets?user=assigned&status=Open`
  - Persist filters on page reload
  - Browser back/forward works with filters

## Permission Matrix

| Action | Reporter | Assignee | Project Owner | Project Member |
|--------|----------|----------|---------------|----------------|
| View | ✅ | ✅ | ✅ | ✅ |
| Delete | ✅ | ❌ | ❌ | ❌ |
| Edit | Via TicketDetail | Via TicketDetail | Via TicketDetail | Via TicketDetail |

## Empty State Logic
```jsx
{searchTerm ? 'Try a different search term' : 'Create your first ticket to get started!'}
```
- Different message based on whether search is active
- CTA button only if no tickets AND no search
