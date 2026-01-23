# Kanban.jsx - Frontend Page Line-by-Line Explanation

## Overview
Drag-and-drop kanban board page with status columns, project filtering, ticket cards, and status update functionality.

## Key Features
- 5 status columns: Open, In Progress, In Review, Resolved, Closed
- Drag-and-drop status changes via KanbanColumn component
- Project filter dropdown
- Real-time ticket stats (total, active, completed)
- Color-coded column headers
- Instructions panel for user guidance

## Line-by-Line Analysis

### Lines 1-6: Imports
```jsx
import { useState, useEffect } from 'react';
import { useTicket } from '../context/TicketContext';
import { useProject } from '../context/ProjectContext';
import { toast } from 'react-toastify';
import KanbanColumn from '../components/KanbanColumn';
```
- **KanbanColumn**: Handles drag-drop for individual columns

### Lines 10-12: State Management
```jsx
const [selectedProject, setSelectedProject] = useState('all');
const [loading, setLoading] = useState(false);
```
- **selectedProject**: Filter by project ID or 'all'
- **loading**: Show loading indicator during status update

### Lines 23-34: Status Change Handler
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
- **Called by KanbanColumn**: When user drops ticket in new column
- **Partial update**: Only send { status: newStatus }
- **Success toast**: Show new status name
- **finally block**: Always reset loading, even if error

### Lines 36-41: Filter Tickets by Project
```jsx
const filteredTickets = selectedProject === 'all' 
  ? tickets 
  : tickets.filter(t => t.project?._id === selectedProject);
```
- **Ternary operator**: Simple if/else for filtering
- **Optional chaining**: `t.project?._id` safe access
- **All vs filtered**: Show all tickets or tickets from one project

### Lines 43-65: Column Configuration
```jsx
const columns = [
  { 
    title: 'Open', 
    tickets: filteredTickets.filter(t => t.status === 'Open'),
    color: 'bg-blue-500'
  },
  { 
    title: 'In Progress', 
    tickets: filteredTickets.filter(t => t.status === 'In Progress'),
    color: 'bg-yellow-500'
  },
  { 
    title: 'In Review', 
    tickets: filteredTickets.filter(t => t.status === 'In Review'),
    color: 'bg-purple-500'
  },
  { 
    title: 'Resolved', 
    tickets: filteredTickets.filter(t => t.status === 'Resolved'),
    color: 'bg-green-500'
  },
  { 
    title: 'Closed', 
    tickets: filteredTickets.filter(t => t.status === 'Closed'),
    color: 'bg-gray-500'
  }
];
```
- **5 columns**: One for each ticket status
- **Filter per column**: Each column gets tickets with matching status
- **Color coding**: Blue → Yellow → Purple → Green → Gray (workflow progression)
- **Dynamic arrays**: Recalculated when filteredTickets changes

### Lines 83-97: Project Filter Dropdown
```jsx
<select
  value={selectedProject}
  onChange={(e) => setSelectedProject(e.target.value)}
  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
>
  <option value="all">All Projects</option>
  {projects.map(project => (
    <option key={project._id} value={project._id}>
      {project.name}
    </option>
  ))}
</select>
```
- **All projects option**: Default view shows all tickets
- **Dynamic project list**: Loop through projects array

### Lines 104-123: Ticket Stats Display
```jsx
<div className="mt-4 flex flex-wrap gap-4 text-sm">
  <div className="flex items-center space-x-2">
    <span className="text-gray-600">Total:</span>
    <span className="font-bold text-gray-900">{filteredTickets.length}</span>
  </div>
  <div className="flex items-center space-x-2">
    <span className="text-gray-600">Active:</span>
    <span className="font-bold text-yellow-600">
      {filteredTickets.filter(t => ['Open', 'In Progress', 'In Review'].includes(t.status)).length}
    </span>
  </div>
  <div className="flex items-center space-x-2">
    <span className="text-gray-600">Completed:</span>
    <span className="font-bold text-green-600">
      {filteredTickets.filter(t => ['Resolved', 'Closed'].includes(t.status)).length}
    </span>
  </div>
</div>
```
- **Total**: All filtered tickets
- **Active**: Open + In Progress + In Review
  - `.includes(t.status)`: Check if status in array
- **Completed**: Resolved + Closed
- **Color coding**: Yellow for active, green for completed

### Lines 125-137: Loading Overlay
```jsx
{loading && (
  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-4 z-50">
    <div className="flex items-center space-x-3">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
      <span className="text-gray-700">Updating ticket...</span>
    </div>
  </div>
)}
```
- **Fixed positioning**: Overlay on top of board during update
- **Center with transform**: `top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`
- **Spinner**: Animated loading indicator
- **z-50**: High z-index to appear above all content

### Lines 139-149: Kanban Board Layout
```jsx
<div className="flex space-x-4 overflow-x-auto pb-4">
  {columns.map((column) => (
    <KanbanColumn
      key={column.title}
      title={column.title}
      tickets={column.tickets}
      color={column.color}
      onDrop={handleStatusChange}
    />
  ))}
</div>
```
- **Horizontal flex**: Columns side-by-side
- **overflow-x-auto**: Horizontal scroll on smaller screens
- **Pass onDrop**: KanbanColumn calls this when ticket dropped
- **Loop columns**: Render 5 KanbanColumn components

### Lines 151-171: Empty State
```jsx
{filteredTickets.length === 0 && (
  <div className="bg-white rounded-lg shadow-md p-12 text-center">
    <div className="text-6xl mb-4">📭</div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">No tickets found</h3>
    <p className="text-gray-600 mb-6">
      {selectedProject === 'all' 
        ? 'Create your first ticket to get started!'
        : 'No tickets in this project. Try selecting a different project.'}
    </p>
    <a
      href="/tickets/create"
      className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
    >
      + Create First Ticket
    </a>
  </div>
)}
```
- **Conditional message**: Different for all vs filtered view
- **CTA button**: Create ticket link

### Lines 173-186: Usage Instructions
```jsx
<div className="mt-6 bg-primary-50 border border-primary-200 rounded-lg p-4">
  <h3 className="font-semibold text-primary-900 mb-2">💡 How to use:</h3>
  <ul className="text-sm text-primary-800 space-y-1">
    <li>• <strong>Drag & Drop:</strong> Click and drag tickets between columns to update their status</li>
    <li>• <strong>Click Ticket:</strong> Click on any ticket card to view full details</li>
    <li>• <strong>Filter by Project:</strong> Use the dropdown to view tickets from specific projects</li>
    <li>• <strong>Color Codes:</strong> Left border indicates priority (Gray=Low, Blue=Medium, Orange=High, Red=Critical)</li>
  </ul>
</div>
```
- **Educational panel**: Helps users understand kanban features
- **Instructions list**: Drag-drop, click, filter, color codes

## Related Files
- **TicketContext.jsx**: Provides tickets array, updateTicket
- **ProjectContext.jsx**: Provides projects array for filter
- **KanbanColumn.jsx**: Individual column component with drag-drop
- **TicketDetail.jsx**: Navigation destination when clicking ticket card

## Kanban Board Layout

```
┌────────────┬────────────┬────────────┬────────────┬────────────┐
│   OPEN     │ IN PROGRESS│  IN REVIEW │  RESOLVED  │   CLOSED   │
│  (Blue)    │  (Yellow)  │  (Purple)  │  (Green)   │   (Gray)   │
├────────────┼────────────┼────────────┼────────────┼────────────┤
│ Ticket 1   │ Ticket 3   │ Ticket 5   │ Ticket 7   │ Ticket 9   │
│ Ticket 2   │ Ticket 4   │            │ Ticket 8   │            │
└────────────┴────────────┴────────────┴────────────┴────────────┘
```

## Drag-Drop Flow
1. User drags ticket from one column
2. User drops ticket in another column
3. KanbanColumn component detects drop
4. onDrop(ticketId, newColumnStatus) called
5. handleStatusChange updates ticket via API
6. TicketContext updates tickets array
7. Columns re-render with new ticket positions

## Stats Calculation

| Stat | Formula | Example |
|------|---------|---------|
| Total | filteredTickets.length | 25 tickets |
| Active | Open + In Progress + In Review | 15 tickets |
| Completed | Resolved + Closed | 10 tickets |

## Status Progression Flow
```
Open → In Progress → In Review → Resolved → Closed
(Blue)    (Yellow)     (Purple)   (Green)   (Gray)
```

## Filter Logic
- **selectedProject === 'all'**: Show all tickets
- **selectedProject === projectId**: Show only tickets from that project
- Filter applied BEFORE grouping into columns
