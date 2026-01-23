# Projects.jsx - Frontend Page Line-by-Line Explanation

## Overview
Projects list page with filtering (all/owned/member), search functionality, project cards with stats, and owner-only edit/delete actions.

## Key Features
- Filter tabs: all, owned by user, member of project
- Search by project name or description
- Display project cards with status, priority, members count
- Edit/Delete buttons for project owners only
- Confirmation dialog before delete
- Empty state with create project CTA

## Line-by-Line Analysis

### Lines 1-5: Imports
```jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
```
- **useState**: Manage filter and search state
- **useProject**: Access projects array and deleteProject function
- **useAuth**: Check user ownership permissions

### Lines 10-13: State Management
```jsx
const [filter, setFilter] = useState('all');
const [searchTerm, setSearchTerm] = useState('');
```
- **filter**: Current filter ('all', 'owned', 'member')
- **searchTerm**: User's search input

### Lines 15-25: Status Color Helper
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
- **Object map**: Status string to Tailwind classes

### Lines 27-37: Priority Color Helper
```jsx
const getPriorityColor = (priority) => {
  const colors = {
    'Low': 'bg-gray-100 text-gray-600',
    'Medium': 'bg-blue-100 text-blue-600',
    'High': 'bg-orange-100 text-orange-600',
    'Critical': 'bg-red-100 text-red-600'
  };
  return colors[priority] || 'bg-gray-100 text-gray-600';
};
```
- **Priority-based colors**: Low (gray) → Medium (blue) → High (orange) → Critical (red)

### Lines 39-45: Delete Handler
```jsx
const handleDelete = async (id, projectName) => {
  if (window.confirm(`Are you sure you want to delete "${projectName}"?`)) {
    await deleteProject(id);
  }
};
```
- **window.confirm()**: Browser native confirmation dialog
- **Template literal**: Show project name in message
- **deleteProject(id)**: Call ProjectContext function if user confirms

### Lines 47-59: Filter and Search Logic (CRITICAL)
```jsx
const filteredProjects = projects.filter(project => {
  const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       project.description.toLowerCase().includes(searchTerm.toLowerCase());
  
  if (filter === 'all') return matchesSearch;
  if (filter === 'owned') return matchesSearch && project.owner._id === user._id;
  if (filter === 'member') return matchesSearch && project.owner._id !== user._id;
  return matchesSearch;
});
```
- **matchesSearch**: Check if name OR description contains search term (case-insensitive)
- **filter === 'all'**: Return all projects matching search
- **filter === 'owned'**: Return projects where `project.owner._id === user._id` (user is owner)
- **filter === 'member'**: Return projects where `project.owner._id !== user._id` (user is member, not owner)
- **Combined logic**: Search is always applied, then filter on top

### Lines 100-137: Filter Tabs
```jsx
<div className="flex space-x-2">
  <button
    onClick={() => setFilter('all')}
    className={`px-4 py-2 rounded-lg font-medium transition ${
      filter === 'all'
        ? 'bg-primary-600 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    All Projects ({projects.length})
  </button>
  <button
    onClick={() => setFilter('owned')}
    className={`px-4 py-2 rounded-lg font-medium transition ${
      filter === 'owned'
        ? 'bg-primary-600 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    Owned ({projects.filter(p => p.owner._id === user._id).length})
  </button>
  <button
    onClick={() => setFilter('member')}
    className={`px-4 py-2 rounded-lg font-medium transition ${
      filter === 'member'
        ? 'bg-primary-600 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    Member ({projects.filter(p => p.owner._id !== user._id).length})
  </button>
</div>
```
- **Dynamic count**: Each button shows count of projects in that category
- **Active state**: Selected filter has blue background and white text
- **Inline filters**: `projects.filter(p => p.owner._id === user._id).length` counts owned projects

### Lines 139-152: Search Input
```jsx
<div className="flex-1 md:max-w-md">
  <input
    type="text"
    placeholder="Search projects..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
  />
</div>
```
- **Controlled input**: value={searchTerm}, onChange updates state
- **Real-time search**: Filters as you type (no submit button needed)

### Lines 154-185: Loading & Empty States
```jsx
{loading ? (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
) : filteredProjects.length === 0 ? (
  <div className="bg-white rounded-lg shadow p-12 text-center">
    <div className="text-6xl mb-4">📂</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Found</h3>
    <p className="text-gray-600 mb-6">
      {searchTerm ? 'Try a different search term' : 'Create your first project to get started'}
    </p>
    {!searchTerm && (
      <Link
        to="/projects/create"
        className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
      >
        Create Project
      </Link>
    )}
  </div>
) : (
  // ... projects grid
)}
```
- **3 states**: loading, empty, data
- **Conditional message**: Different message if search is active vs no projects exist
- **CTA button**: Only show "Create Project" if no search term (user isn't searching)

### Lines 187-250: Project Cards Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredProjects.map((project) => (
    <div
      key={project._id}
      className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
    >
      <div onClick={() => navigate(`/projects/${project._id}`)} className="p-6">
        {/* Project Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600">
            {project.name}
          </h3>
          <div className="flex space-x-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </span>
          </div>
        </div>

        {/* Project Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Status Badge */}
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        {/* Project Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <span className="mr-1">👤</span>
            <span>{project.members.length + 1} members</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">📋</span>
            <span>0 tickets</span>
          </div>
        </div>

        {/* Owner Info */}
        <div className="text-xs text-gray-500 border-t pt-3">
          <p>
            Owner: <span className="font-medium text-gray-700">{project.owner.name}</span>
          </p>
          <p className="mt-1">
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      {project.owner._id === user._id && (
        <div className="px-6 py-3 bg-gray-50 border-t flex justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/projects/${project._id}/edit`);
            }}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(project._id, project.name);
            }}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  ))}
</div>
```
- **Grid layout**: 1 column (mobile) → 2 (tablet) → 3 (desktop)
- **Click handler**: `onClick={() => navigate(\`/projects/${project._id}\`)}` navigates to project detail
- **line-clamp-2**: Truncate description to 2 lines
- **Members count**: `project.members.length + 1` includes owner (not in members array)
- **Conditional buttons**: `{project.owner._id === user._id && ...}` only show edit/delete to owner
- **e.stopPropagation()**: Prevent card click when clicking buttons

## Related Files
- **ProjectContext.jsx**: Provides projects array, deleteProject function
- **ProjectDetail.jsx**: Navigation destination when clicking card
- **CreateProject.jsx**: Navigation destination for "Create Project" button

## Filter Logic Summary

| Filter | Condition | Result |
|--------|-----------|--------|
| all | Always true | All projects matching search |
| owned | `project.owner._id === user._id` | Projects where user is owner |
| member | `project.owner._id !== user._id` | Projects where user is member (not owner) |

## Search Logic
- **Case-insensitive**: `.toLowerCase()` on both sides
- **Multiple fields**: Checks name OR description
- **Real-time**: Filters as you type
- **Combined with filter**: Search applied first, then filter tabs

## Owner-Only Actions
- Edit button: `navigate(\`/projects/${project._id}/edit\`)`
- Delete button: `handleDelete(project._id, project.name)`
- Conditional rendering: `{project.owner._id === user._id && ...}`
