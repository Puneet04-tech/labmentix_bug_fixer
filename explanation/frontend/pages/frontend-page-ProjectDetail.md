# Frontend Page: ProjectDetail.jsx - Line by Line Explanation

**Location**: `frontend/src/pages/ProjectDetail.jsx`
**Lines**: 424 lines
**Purpose**: Comprehensive project view with inline editing, team display, and activity statistics

---

## 📋 Overview

**Core Functionality:**
- View complete project details with status/priority badges
- Inline editing form for project owners
- Team members list with owner badge
- Project activity statistics (total/resolved/open tickets)
- Breadcrumb navigation
- Delete confirmation with warning

**Key Features:**
- Authorization checks (only owner can edit/delete)
- Form validation with error messages
- Date validation (end date after start date)
- Real-time ticket statistics
- Responsive grid layouts

---

## 🔍 Line-by-Line Code Analysis

### **Imports (Lines 1-5)**

```jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { useTicket } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
```

**Line 1**: React hooks for state management (`useState`) and side effects (`useEffect`)
**Line 2**: React Router hooks - `useParams` extracts `:id` from URL, `useNavigate` for programmatic navigation, `Link` for navigation links
**Line 3**: Custom hook for project operations (fetch, update, delete)
**Line 4**: Custom hook for ticket operations (fetchTicketsByProject)
**Line 5**: Custom hook for user authentication state

---

### Technical Terms Glossary

- **Inline editing**: Allowing the user to edit fields directly within the page UI. Implemented by copying `currentProject` into `formData`, toggling `isEditing`, and only saving when user confirms.
- **Owner-only actions**: Authorization checks comparing `user._id` with `currentProject.owner._id` to show/hide edit/delete controls.
- **Normalization**: Converting date strings for `<input type="date">` and back when sending to the API (use ISO → `YYYY-MM-DD` → ISO as required).
- **Derived local state**: Use `formData` and `projectTickets` to avoid mutating `currentProject` from context until the user saves edits.

---

## 🧑‍💻 Important Import & Syntax Explanations

- `useParams()`/`useNavigate()`: `useParams()` reads route parameters (e.g., project `id`); `useNavigate()` performs programmatic navigation (e.g., after delete).
- `useProject()` and `useTicket()`: Context hooks centralize data fetching and mutations; prefer calling context functions (`fetchProject`, `updateProject`, `fetchTicketsByProject`) instead of direct API calls from the page.
- `setFormData({ ... })` on load: Pre-fill edit form and avoid two-way binding to context values to prevent accidental live edits.
- `await fetchTicketsByProject(id)`: Fetch project-specific tickets for stats; wrap in `try/catch` and set loading states for UX.
- Accessibility note: Ensure inline edit controls have clear labels and focus management (move focus into first input when entering edit mode, restore focus to trigger button on close).

---

### **Component Declaration (Lines 7-24)**

```jsx
const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProject, fetchProject, updateProject, deleteProject, loading } = useProject();
  const { fetchTicketsByProject } = useTicket();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [projectTickets, setProjectTickets] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: '',
    priority: '',
    startDate: '',
    endDate: ''
  });
  const [errors, setErrors] = useState({});
```

**Line 8**: Extract `id` parameter from URL path `/projects/:id`
**Line 9**: Navigation function to redirect after delete
**Line 10**: Destructure project context - `currentProject` is the fetched project, `loading` shows fetch status
**Line 11**: Get ticket fetching function from TicketContext
**Line 12**: Get current authenticated user and logout function
**Line 13**: Toggle state for inline edit mode (view/edit)
**Line 14**: Local state to store project's tickets for statistics
**Lines 15-22**: Form state with 6 fields matching Project model
**Line 23**: Error state object with field-specific error messages

**Why separate state?** `currentProject` from context is read-only; `formData` allows editing without affecting context until save

---

### **Load Project Effect (Lines 25-27)**

```jsx
  useEffect(() => {
    loadProject();
  }, [id]);
```

**Line 26**: Call `loadProject` when component mounts or `id` changes
**Dependency `[id]`**: Re-fetch if user navigates to different project (e.g., from project list)

**Why useEffect?** Data fetching is a side effect that must run after component renders

---

### **Load Project Function (Lines 29-45)**

```jsx
  const loadProject = async () => {
    const project = await fetchProject(id);
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        status: project.status,
        priority: project.priority,
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ''
      });
      // Load project tickets
      const tickets = await fetchTicketsByProject(id);
      setProjectTickets(tickets);
    }
  };
```

**Line 30**: Fetch project from API using context function
**Line 31**: Check if project exists (might be null if unauthorized or not found)
**Lines 32-39**: Populate form with current project data
**Line 38**: **Date conversion** - MongoDB stores ISO string, input needs `YYYY-MM-DD` format, `.split('T')[0]` extracts date part
**Line 39**: Optional endDate - use empty string if null to avoid uncontrolled input warning
**Line 42**: Fetch all tickets belonging to this project for statistics
**Line 43**: Store tickets in local state

**Why load tickets separately?** Tickets aren't included in project document; separate API call needed

---

### **Form Change Handler (Lines 47-52)**

```jsx
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };
```

**Line 48**: **Dynamic update** - `[e.target.name]` uses input's `name` attribute as key
**Lines 49-51**: Clear error message when user starts typing in that field

**Why clear errors?** Improves UX by removing error as soon as user fixes issue

---

### **Validation Function (Lines 54-74)**

```jsx
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name cannot be more than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description cannot be more than 500 characters';
    }

    if (formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    return newErrors;
  };
```

**Lines 57-59**: **Name validation** - `.trim()` removes whitespace, ensures not empty string
**Lines 60-61**: Character limit validation (matches backend model)
**Lines 63-67**: Description validation with same pattern
**Line 69**: **Date logic validation** - only validate if endDate is set (it's optional)
**Line 70**: **String comparison works for dates in `YYYY-MM-DD` format** due to lexicographic ordering

**Return**: Object with error messages or empty object if valid

---

### **Update Handler (Lines 76-90)**

```jsx
  const handleUpdate = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await updateProject(id, formData);
    if (result.success) {
      setIsEditing(false);
    }
  };
```

**Line 77**: Prevent form submission from refreshing page
**Line 79**: Run validation before sending to API
**Lines 80-83**: If any errors, display them and stop submission
**Line 85**: Call context function to send PUT request to API
**Lines 86-88**: If successful, exit edit mode (returns to view mode)

**Why check `result.success`?** Context function handles errors and returns success status

---

### **Delete Handler (Lines 92-100)**

```jsx
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${currentProject?.name}"? This action cannot be undone.`)) {
      const result = await deleteProject(id);
      if (result.success) {
        navigate('/projects');
      }
    }
  };
```

**Line 93**: **Native confirmation dialog** - shows project name for clarity, warns irreversible
**Line 94**: Only delete if user clicks "OK" in confirmation
**Lines 95-97**: Navigate to projects list after successful deletion

**Why navigate?** Current project no longer exists; can't stay on detail page

---

### **Color Helper Functions (Lines 102-121)**

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

**Line 103**: Map each status to Tailwind CSS classes (background + text color)
**Line 110**: Fallback to gray if unknown status
**Lines 113-120**: Same pattern for priority with severity-based colors

**Why functions?** Reusable color logic used in multiple places (badges, tables)

---

### **Loading State (Lines 123-129)**

```jsx
  if (loading || !currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
```

**Line 123**: Show spinner if loading OR project not yet fetched
**Line 126**: **CSS spinner** - `animate-spin` rotates continuously, `border-b-2` creates loading circle

**Why guard clause?** Prevents errors from accessing `currentProject` properties before it's loaded

---

### **Authorization Check (Line 131)**

```jsx
  const isOwner = currentProject.owner._id === user._id;
```

**Purpose**: Determine if logged-in user owns this project
**Usage**: Controls visibility of edit/delete buttons and edit form

**Why compute once?** Used multiple times in render; efficient to calculate once

---

### **Header Section (Lines 133-161)**

```jsx
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary-600">🐛 Bug Tracker</h1>
            <nav className="hidden md:flex space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-primary-600">Dashboard</Link>
              <Link to="/projects" className="text-primary-600 font-medium">Projects</Link>
              <Link to="/tickets" className="text-gray-600 hover:text-primary-600">Tickets</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <p className="font-medium text-gray-900">{user?.name}</p>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
```

**Standard header** across all pages - logo, navigation, user info, logout
**Line 138**: `hidden md:flex` - hide nav on mobile, show on medium+ screens
**Line 140**: Current page "Projects" highlighted with `text-primary-600`

---

### **Breadcrumb Navigation (Lines 165-171)**

```jsx
        <nav className="flex mb-6 text-sm">
          <Link to="/projects" className="text-primary-600 hover:text-primary-700">
            Projects
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{currentProject.name}</span>
        </nav>
```

**Purpose**: Show navigation path "Projects / Project Name"
**Line 166**: Clickable link back to projects list
**Line 170**: Current project name (not clickable, already on page)

**Why breadcrumbs?** Helps users understand location in app hierarchy

---

### **Project Header Card (Lines 174-211)**

```jsx
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentProject.name}</h2>
              <div className="flex space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentProject.status)}`}>
                  {currentProject.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(currentProject.priority)}`}>
                  {currentProject.priority}
                </span>
              </div>
            </div>
            {isOwner && !isEditing && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Project
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
```

**Lines 177-187**: Project name with status and priority badges using color helpers
**Line 188**: **Conditional rendering** - only show edit/delete buttons if:
  - User is owner (`isOwner`)
  - AND not currently editing (`!isEditing`)
**Line 190**: Clicking "Edit Project" toggles `isEditing` to true

---

### **Project Info Grid (Lines 214-236)**

```jsx
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div>
              <p className="text-sm text-gray-500">Owner</p>
              <p className="text-gray-900 font-medium">{currentProject.owner.name}</p>
              <p className="text-sm text-gray-500">{currentProject.owner.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="text-gray-900 font-medium">
                {new Date(currentProject.startDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Date</p>
              <p className="text-gray-900 font-medium">
                {currentProject.endDate
                  ? new Date(currentProject.endDate).toLocaleDateString()
                  : 'Not set'}
              </p>
            </div>
          </div>
```

**Line 214**: Responsive grid - 1 column on mobile, 3 on desktop
**Lines 216-219**: Owner info with populated user document
**Line 223**: **Date formatting** - converts ISO string to locale-specific format (e.g., "1/15/2024")
**Lines 229-231**: **Conditional rendering** - show "Not set" if endDate is null

---

### **Edit Form (Lines 240-380)**

```jsx
        {isEditing && isOwner ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Project</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
```

**Line 240**: Only render form if user is editing AND is owner
**Line 244**: Form submission triggers `handleUpdate` function

---

### **Name Input (Lines 245-259)**

```jsx
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
```

**Line 249**: `name="name"` - matches formData key for `handleChange`
**Line 251**: **Controlled input** - value from state, updates via onChange
**Lines 253-255**: **Conditional classes** - red border if error exists
**Line 257**: Show error message below input if validation failed

---

### **Description Textarea (Lines 261-275)**

```jsx
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
```

**Line 269**: `rows="4"` - fixed textarea height
**Same pattern** as name input - controlled, error styling, error message

---

### **Status & Priority Selects (Lines 277-309)**

```jsx
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
```

**Line 277**: Two-column grid for side-by-side dropdowns
**Lines 287-291**: Status options match enum in Project model
**Lines 301-305**: Priority options match enum in Project model

**Why dropdowns?** Ensures user selects valid enum values, prevents typos

---

### **Date Inputs (Lines 311-341)**

```jsx
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none ${
                      errors.endDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>
              </div>
```

**Line 315**: `type="date"` - native browser date picker
**Line 325**: **endDate has error styling** - validation checks date logic
**Line 335**: Show error if end date is before start date

---

### **Form Buttons (Lines 343-361)**

```jsx
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    loadProject();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
```

**Line 345**: `type="button"` - prevents form submission
**Lines 347-348**: Cancel resets edit mode AND reloads original data (discards changes)
**Line 356**: Disable submit button while saving to prevent double submissions
**Line 359**: Dynamic button text shows loading state

---

### **Description Display (Lines 382-387) - When Not Editing**

```jsx
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{currentProject.description}</p>
          </div>
        )}
```

**Line 382**: Else clause - show description when NOT editing
**Line 385**: `whitespace-pre-wrap` - preserves line breaks from textarea

---

### **Team Members Section (Lines 390-427)**

```jsx
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Team Members ({currentProject.members.length + 1})</h3>
          <div className="space-y-3">
            {/* Owner */}
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                  {currentProject.owner.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{currentProject.owner.name}</p>
                  <p className="text-sm text-gray-500">{currentProject.owner.email}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                Owner
              </span>
            </div>

            {/* Members */}
            {currentProject.members.map((member) => (
              <div key={member._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
                  Member
                </span>
              </div>
            ))}

            {currentProject.members.length === 0 && (
              <p className="text-gray-500 text-center py-4">No team members added yet</p>
            )}
          </div>
        </div>
```

**Line 391**: Count includes owner (length + 1)
**Lines 394-407**: **Owner displayed first** with special styling (blue background, "Owner" badge)
**Line 397**: **Avatar circle** with first letter of name
**Lines 410-424**: Map through members array, similar styling but gray background
**Lines 426-428**: **Empty state** - show message if no members

**Why separate owner?** Owner isn't in members array but should be displayed prominently

---

### **Activity Stats (Lines 431-453)**

```jsx
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Project Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{projectTickets.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Tickets</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {projectTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Resolved</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">
                {projectTickets.filter(t => t.status === 'Open').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Open</div>
            </div>
          </div>
          <Link 
            to={`/tickets?project=${id}`}
            className="block text-center mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            View All Project Tickets →
          </Link>
        </div>
```

**Line 435**: Total count from `projectTickets` array
**Line 440**: **Filter resolved tickets** - counts tickets with 'Resolved' OR 'Closed' status
**Line 445**: **Filter open tickets** - only 'Open' status
**Line 451**: **Link with query param** - navigates to tickets page filtered by this project

**Why local filtering?** `projectTickets` already loaded in `loadProject()`, no need for separate API call

---

## 🔐 Authorization Matrix

| Action | Permission | Check |
|--------|-----------|-------|
| View project | Project member OR owner | Backend validates in `getProject` controller |
| Edit project | Owner only | `isOwner` check hides edit button + form |
| Delete project | Owner only | `isOwner` check hides delete button |
| View team members | All members | No restriction |

**Note**: Frontend hides buttons, but backend enforces permissions

---

## 📊 Data Flow

1. **Mount**: `useEffect` calls `loadProject()`
2. **Load**: `fetchProject(id)` gets project from context/API
3. **Populate**: Set `formData` with project data + fetch tickets
4. **Display**: Render project details, team, stats
5. **Edit**: User clicks "Edit Project" → `isEditing = true` → form appears
6. **Update**: Submit form → validate → `updateProject()` → exit edit mode
7. **Delete**: Click delete → confirm → `deleteProject()` → navigate away

---

## 🐛 Common Issues & Solutions

**Issue**: Date inputs show wrong date (off by one day)
**Cause**: Time zone conversion when creating Date object
**Solution**: Use `.split('T')[0]` to extract only date part from ISO string

**Issue**: Form changes persist after cancel
**Cause**: `formData` not reset
**Solution**: `loadProject()` in cancel button re-fetches and resets form

**Issue**: Edit button visible to non-owners
**Cause**: Missing `isOwner` check
**Solution**: Conditional render `{isOwner && !isEditing && (...buttons)}`

**Issue**: projectTickets empty on first render
**Cause**: Asynchronous loading
**Solution**: Tickets loaded in `loadProject()`, counts update after state change

---

## 🔗 Related Files

- [ProjectContext.jsx](frontend-context-ProjectContext.md) - `fetchProject`, `updateProject`, `deleteProject`
- [TicketContext.jsx](frontend-context-TicketContext.md) - `fetchTicketsByProject`
- [projectController.js](backend-controller-project.md) - Backend API endpoints
- [Projects.jsx](frontend-page-Projects.md) - Project list page
- [Tickets.jsx](frontend-page-Tickets.md) - Tickets page with filtering

---

## ✨ Key Takeaways

1. **Authorization-aware UI**: `isOwner` controls edit/delete visibility
2. **Inline editing**: Toggle between view/edit with `isEditing` state
3. **Form validation**: Client-side validation before API call
4. **Date handling**: Convert ISO strings to YYYY-MM-DD for date inputs
5. **Statistics**: Calculate from loaded tickets using `.filter()`
6. **Navigation patterns**: Breadcrumbs, query params, programmatic redirect
7. **Empty states**: Handle cases where members/tickets arrays are empty
