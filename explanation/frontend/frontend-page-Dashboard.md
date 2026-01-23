# Dashboard.jsx - Frontend Page Line-by-Line Explanation

## Overview
Dashboard overview page showing project stats, recent activity, and quick access to projects. Uses .filter() to calculate statistics from projects and tickets arrays.

## Key Features
- Calculate stats from projects array
- Filter recent projects (created within last 7 days)
- Sort projects by creation date
- Limit to 5 most recent projects
- Display total projects, active tickets, total members
- Link to individual projects

## Line-by-Line Analysis

### Lines 1-4: Imports
```jsx
import { Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
```
- **Link**: Navigation to project detail pages
- **useProject**: Access projects array
- **useAuth**: Access current user info

### Technical Terms Glossary
- **Derived metrics**: Calculations computed from arrays (`.reduce`, `.filter`) such as `totalProjects`, `activeTickets`, and `totalMembers`.
- **Recent list**: Using date math (`new Date()` and `setDate()`) to filter recent items (e.g., last 7 days).

### Important Import & Syntax Explanations
- `useProject()` provides the projects array; perform null-safe operations (`projects?.length || 0`) to avoid runtime errors.
- `Array.prototype.reduce()` pattern accumulates values; ensure initial accumulator is provided (e.g., 0) to avoid `undefined` results.
- Sorting by date: `new Date(b.createdAt) - new Date(a.createdAt)` yields descending order (newest first).
- Accessibility note: Cards presenting key metrics should have semantic headings and accessible labels for screen readers.

### Lines 8-11: Context Access
```jsx
const { projects, loading } = useProject();
const { user } = useAuth();
const navigate = useNavigate();
```
- **projects**: Array of all user's projects from ProjectContext
- **loading**: Boolean state for loading indicator
- **user**: Current authenticated user

### Lines 13-16: Calculate Total Projects
```jsx
const totalProjects = projects.length;
```
- **projects.length**: Count of all projects user has access to

### Lines 18-25: Calculate Active Tickets
```jsx
const activeTickets = projects.reduce((total, project) => {
  const projectActiveTickets = project.tickets?.filter(
    ticket => ticket.status !== 'Closed' && ticket.status !== 'Resolved'
  ).length || 0;
  return total + projectActiveTickets;
}, 0);
```
- **.reduce()**: Sum up active tickets across all projects
- **total**: Accumulator starting at 0
- **project.tickets?.filter()**: Optional chaining (some projects might not have tickets)
- **ticket.status !== 'Closed' && ticket.status !== 'Resolved'**: Active means not closed or resolved
- **|| 0**: Default to 0 if tickets is undefined

### Lines 27-32: Calculate Total Members
```jsx
const totalMembers = projects.reduce((total, project) => {
  const memberCount = (project.members?.length || 0) + 1; // +1 for owner
  return total + memberCount;
}, 0);
```
- **project.members?.length**: Count members array (optional chaining)
- **+ 1**: Add 1 for project owner (not in members array)
- **Sum logic**: Accumulate member counts across all projects

### Lines 34-45: Recent Projects (Last 7 Days)
```jsx
const recentProjects = projects
  .filter(project => {
    const projectDate = new Date(project.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return projectDate >= weekAgo;
  })
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 5);
```
- **Filter step**: Keep only projects created in last 7 days
  - `new Date(project.createdAt)`: Convert string to Date object
  - `weekAgo.setDate(weekAgo.getDate() - 7)`: Subtract 7 days from today
  - `projectDate >= weekAgo`: Check if project is within last week
- **Sort step**: `.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))`
  - Sort by creation date, newest first
  - `new Date(b.createdAt) - new Date(a.createdAt)`: Descending order (b - a, not a - b)
- **Limit step**: `.slice(0, 5)` takes first 5 results

### Lines 47-55: Get Status Color (Helper Function)
```jsx
const getStatusColor = (status) => {
  const colors = {
    'Planning': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'On Hold': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};
```
- **Object lookup**: Map status to Tailwind CSS classes
- **Default fallback**: `|| 'bg-gray-100 text-gray-800'` if status not found

### Lines 57-150: JSX Template

### Lines 62-85: Stats Cards
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  {/* Total Projects Card */}
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">Total Projects</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{totalProjects}</p>
      </div>
      <div className="text-4xl">📁</div>
    </div>
  </div>
  
  {/* Active Tickets Card */}
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">Active Tickets</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{activeTickets}</p>
      </div>
      <div className="text-4xl">🎫</div>
    </div>
  </div>
  
  {/* Total Members Card */}
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">Team Members</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{totalMembers}</p>
      </div>
      <div className="text-4xl">👥</div>
    </div>
  </div>
</div>
```
- **Grid layout**: `grid-cols-1 md:grid-cols-3` - 1 column on mobile, 3 on medium+
- **Dynamic values**: {totalProjects}, {activeTickets}, {totalMembers} from calculations above
- **Emojis**: Visual icons for each card

### Lines 87-125: Recent Projects Section
```jsx
<div className="bg-white rounded-lg shadow-md p-6">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-bold text-gray-900">📋 Recent Projects</h2>
    <Link
      to="/projects"
      className="text-primary-600 hover:text-primary-700 font-medium"
    >
      View All →
    </Link>
  </div>
  
  {recentProjects.length === 0 ? (
    <div className="text-center py-8">
      <p className="text-gray-500 mb-4">No recent projects</p>
      <Link
        to="/projects/create"
        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
      >
        Create Your First Project
      </Link>
    </div>
  ) : (
    <div className="space-y-4">
      {recentProjects.map(project => (
        <Link
          key={project._id}
          to={`/projects/${project._id}`}
          className="block border-l-4 border-primary-500 bg-gray-50 p-4 hover:bg-gray-100 transition"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{project.name}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-1">{project.description}</p>
            </div>
            <div className="ml-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
            <span>Owner: {project.owner.name}</span>
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </Link>
      ))}
    </div>
  )}
</div>
```
- **Conditional rendering**: Show empty state if no recent projects
- **.map() loop**: Render each project in recentProjects array
- **Link wrapper**: Entire card is clickable, navigates to project detail
- **key prop**: `key={project._id}` required for React list rendering
- **line-clamp-1**: Truncate description to 1 line with ellipsis
- **Date formatting**: `new Date(project.createdAt).toLocaleDateString()` converts ISO string to readable date

### Lines 127-145: Quick Actions Section
```jsx
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h2>
  <div className="space-y-3">
    <Link
      to="/projects/create"
      className="block bg-primary-50 border border-primary-200 p-4 rounded-lg hover:bg-primary-100 transition"
    >
      <span className="text-primary-700 font-medium">➕ Create New Project</span>
    </Link>
    <Link
      to="/tickets/create"
      className="block bg-green-50 border border-green-200 p-4 rounded-lg hover:bg-green-100 transition"
    >
      <span className="text-green-700 font-medium">🎫 Create New Ticket</span>
    </Link>
    <Link
      to="/kanban"
      className="block bg-purple-50 border border-purple-200 p-4 rounded-lg hover:bg-purple-100 transition"
    >
      <span className="text-purple-700 font-medium">📋 View Kanban Board</span>
    </Link>
  </div>
</div>
```
- **Quick links**: Common actions for easy access
- **Color coding**: Different colors for different action types

## Related Files
- **ProjectContext.jsx**: Provides projects array
- **AuthContext.jsx**: Provides user info
- **Projects.jsx**: "View All" destination
- **CreateProject.jsx**: "Create Project" destination

## Data Calculations Summary

| Stat | Calculation | Method |
|------|-------------|--------|
| Total Projects | `projects.length` | Simple array length |
| Active Tickets | Sum of non-closed tickets across all projects | `.reduce()` with nested `.filter()` |
| Total Members | Sum of members + owners across all projects | `.reduce()` with `+1` for owner |
| Recent Projects | Projects from last 7 days, sorted by date, top 5 | `.filter()` → `.sort()` → `.slice()` |

## Array Methods Used
- **.reduce()**: Sum values across arrays
- **.filter()**: Select items matching criteria
- **.sort()**: Order by date
- **.slice()**: Limit results to first N items
- **.map()**: Render list of JSX elements

## Date Operations
- **new Date(project.createdAt)**: Convert ISO string to Date object
- **weekAgo.setDate(weekAgo.getDate() - 7)**: Subtract 7 days
- **new Date(b.createdAt) - new Date(a.createdAt)**: Sort by date (descending)
- **.toLocaleDateString()**: Format date for display
