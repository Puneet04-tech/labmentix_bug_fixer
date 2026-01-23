# FilterBar.jsx - Frontend Component Line-by-Line Explanation

## Overview
Comprehensive filtering UI with 5 filter types (search, project, status, priority, user), active filter badges, clear functionality, and URL state management.

## Key Features
- Search input with real-time filtering
- Project dropdown (multiselect concept)
- Status dropdown (5 statuses)
- Priority dropdown (4 priorities)
- User tabs (My Tickets, Assigned to Me, All)
- Active filter badges with individual clear buttons
- Clear All button
- Responsive layout (stacks on mobile)

## Line-by-Line Analysis

### Lines 1-8: Imports & Component Setup
```jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';

const FilterBar = ({ filters, onFilterChange }) => {
  const { user } = useAuth();
  const { projects } = useProject();
  const navigate = useNavigate();
  const location = useLocation();
```

**Props**:
- **filters**: Current filter state object
  - `{ search, projectId, status, priority, user }`
- **onFilterChange**: Callback function to update filters in parent

**Hooks**:
- **useAuth**: Get current user for "My Tickets" filter
- **useProject**: Get projects list for dropdown
- **useNavigate/useLocation**: URL param management

### Lines 10-20: Filter Options
```jsx
  const statusOptions = ['Open', 'In Progress', 'In Review', 'Resolved', 'Closed'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];
  const userFilterOptions = [
    { label: 'My Tickets', value: 'me' },
    { label: 'Assigned to Me', value: 'assigned' },
    { label: 'All', value: 'all' }
  ];
```

**Status Options** (5):
- Open, In Progress, In Review, Resolved, Closed

**Priority Options** (4):
- Low, Medium, High, Critical

**User Filter Options** (3):
| Label | Value | Meaning |
|-------|-------|---------|
| My Tickets | 'me' | Tickets I created (reporter) |
| Assigned to Me | 'assigned' | Tickets assigned to me |
| All | 'all' | All tickets in system |

### Lines 22-34: URL Sync Effect
```jsx
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlFilters = {
      search: params.get('search') || '',
      projectId: params.get('projectId') || '',
      status: params.get('status') || '',
      priority: params.get('priority') || '',
      user: params.get('user') || 'all'
    };
    
    if (JSON.stringify(urlFilters) !== JSON.stringify(filters)) {
      onFilterChange(urlFilters);
    }
  }, [location.search]);
```

**Purpose**: Sync filters with URL params on mount/navigation

**Example URL**:
```
/tickets?search=bug&status=Open&priority=High&user=me
```

**Parsed filters**:
```javascript
{
  search: 'bug',
  projectId: '',
  status: 'Open',
  priority: 'High',
  user: 'me'
}
```

**Comparison check**:
```javascript
if (JSON.stringify(urlFilters) !== JSON.stringify(filters)) {
  onFilterChange(urlFilters);
}
```
- **Why**: Prevent infinite loop (only update if filters actually changed)
- **JSON.stringify**: Compare object equality

### Lines 36-47: Handle Filter Change
```jsx
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    onFilterChange(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) {
        params.set(key, newFilters[key]);
      }
    });
    navigate(`?${params.toString()}`, { replace: true });
  };
```

**Flow**:
1. Create new filters object with updated value
2. Call parent's onFilterChange callback
3. Build URL params (skip empty values)
4. Navigate to new URL with replace (no history entry)

**Example**:
```javascript
// User selects status "Open"
handleFilterChange('status', 'Open')

// New filters
{ ...filters, status: 'Open' }

// URL params
search = ''          (skip, empty)
projectId = ''       (skip, empty)
status = 'Open'      (include)
priority = ''        (skip, empty)
user = 'all'         (include)

// Navigate to
/tickets?status=Open&user=all
```

### Lines 49-58: Clear Single Filter
```jsx
  const clearFilter = (filterName) => {
    const defaultValues = {
      search: '',
      projectId: '',
      status: '',
      priority: '',
      user: 'all'
    };
    handleFilterChange(filterName, defaultValues[filterName]);
  };
```
- **Default values**: Reset to empty or 'all' for user
- **Reuses**: handleFilterChange for consistency

### Lines 60-67: Clear All Filters
```jsx
  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      projectId: '',
      status: '',
      priority: '',
      user: 'all'
    };
    onFilterChange(clearedFilters);
    navigate(location.pathname, { replace: true });
  };
```
- **Reset all**: Set all filters to defaults
- **Navigate**: Clear URL params (just pathname, no query string)

### Lines 69-78: Active Filters Check
```jsx
  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.projectId ||
      filters.status ||
      filters.priority ||
      (filters.user && filters.user !== 'all')
    );
  };
```
- **Returns true if**: Any filter has a value (except user='all')
- **Purpose**: Show/hide "Clear All" button and active badges

### Lines 80-92: Get Filter Display Name
```jsx
  const getFilterDisplayName = (filterName, value) => {
    if (filterName === 'projectId') {
      const project = projects.find(p => p._id === value);
      return project ? project.name : value;
    }
    if (filterName === 'user') {
      const option = userFilterOptions.find(o => o.value === value);
      return option ? option.label : value;
    }
    if (filterName === 'search') {
      return `"${value}"`;
    }
    return value;
  };
```

**Transformations**:
| Filter | Input | Output |
|--------|-------|--------|
| projectId | '507f1f77bcf86cd799439011' | 'My Project' (name lookup) |
| user | 'me' | 'My Tickets' (label lookup) |
| user | 'assigned' | 'Assigned to Me' |
| search | 'bug fix' | '"bug fix"' (quoted) |
| status | 'Open' | 'Open' (unchanged) |
| priority | 'High' | 'High' (unchanged) |

### Lines 94-277: JSX Render

#### Lines 95-99: Container
```jsx
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col gap-4">
```
- **flex-col**: Vertical layout (stacks all filters)
- **gap-4**: 16px spacing between rows

#### Lines 101-113: Search Input
```jsx
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search tickets..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
```
- **Controlled input**: `value={filters.search}`
- **Real-time update**: onChange immediately updates filter

#### Lines 115-137: Project Dropdown
```jsx
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project
            </label>
            <select
              value={filters.projectId}
              onChange={(e) => handleFilterChange('projectId', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
```
- **Responsive grid**: 1 column mobile, 4 columns desktop
- **Default option**: "All Projects" (empty value)
- **Dynamic options**: Map through projects from context

#### Lines 139-156: Status Dropdown
```jsx
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
```
- **Similar pattern**: Default "All Statuses" + dynamic options

#### Lines 158-175: Priority Dropdown
```jsx
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              {priorityOptions.map(priority => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
```

#### Lines 177-206: User Filter Tabs
```jsx
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter By
            </label>
            <div className="flex gap-1 border border-gray-300 rounded-lg overflow-hidden">
              {userFilterOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('user', option.value)}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition ${
                    filters.user === option.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
```

**Tab styling**:
- **Active tab**: Blue background, white text
- **Inactive tabs**: White background, gray text, hover effect
- **flex-1**: Equal width for all tabs

**Visual**:
```
┌─────────────┬─────────────┬─────────────┐
│ My Tickets  │Assigned to Me│     All     │
│   (blue)    │   (white)   │   (white)   │
└─────────────┴─────────────┴─────────────┘
```

#### Lines 210-253: Active Filter Badges
```jsx
        {hasActiveFilters() && (
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-600">Active Filters:</span>
```
- **Conditional**: Only show if hasActiveFilters() is true
- **border-t**: Top border separator
- **flex-wrap**: Badges wrap to next line if needed

```jsx
            {filters.search && (
              <div className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                <span>Search: {getFilterDisplayName('search', filters.search)}</span>
                <button
                  onClick={() => clearFilter('search')}
                  className="ml-1 hover:bg-indigo-200 rounded-full p-0.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
```

**Badge structure**:
- **Pill shape**: `rounded-full` with padding
- **Indigo color**: `bg-indigo-100 text-indigo-700`
- **Label**: "Search: "bug fix""
- **X button**: Clear individual filter

**Visual**:
```
Search: "bug fix"  ✕
```

**Repeat pattern for**:
- projectId badge
- status badge
- priority badge
- user badge (if not 'all')

#### Lines 255-264: Clear All Button
```jsx
            <button
              onClick={clearAllFilters}
              className="ml-auto px-4 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-full text-sm font-medium transition"
            >
              Clear All
            </button>
          </div>
        )}
```
- **ml-auto**: Push to right side
- **Red color**: Emphasizes destructive action
- **Inside active badges section**: Only shows with badges

## Related Files
- **Tickets.jsx**: Parent component that uses FilterBar
- **ProjectContext.jsx**: Provides projects list
- **AuthContext.jsx**: Provides current user

## Filter Flow Diagram

```
User interacts with FilterBar
         ↓
handleFilterChange() called
         ↓
Update filters state in FilterBar
         ↓
onFilterChange(newFilters) → Parent (Tickets.jsx)
         ↓
Parent updates URL params
         ↓
Navigate to new URL with replace
         ↓
useEffect detects URL change
         ↓
Parse URL params
         ↓
onFilterChange(urlFilters) if different
         ↓
Parent re-fetches tickets with new filters
         ↓
Ticket list updates
```

## URL Synchronization

**Benefits**:
1. **Shareable links**: Copy URL to share filtered view
2. **Browser navigation**: Back/forward buttons work
3. **Refresh persistence**: Filters survive page reload
4. **Bookmarkable**: Save specific filter combinations

**Example URLs**:
```
/tickets?search=bug&status=Open
/tickets?priority=Critical&user=me
/tickets?projectId=507f1f77bcf86cd799439011&status=In+Progress
```

## Active Filter Badge Examples

### Single filter active
```
Active Filters:  Status: Open  ✕                     Clear All
```

### Multiple filters active
```
Active Filters:  Search: "bug"  ✕  Status: Open  ✕  Priority: High  ✕  Clear All
```

### User filter active
```
Active Filters:  My Tickets  ✕                      Clear All
```

## Responsive Behavior

**Mobile** (<640px):
```
┌─────────────────────────┐
│ Search                  │
│ [                  ]    │
├─────────────────────────┤
│ Project                 │
│ [All Projects ▼]        │
├─────────────────────────┤
│ Status                  │
│ [All Statuses ▼]        │
├─────────────────────────┤
│ Priority                │
│ [All Priorities ▼]      │
├─────────────────────────┤
│ Filter By               │
│ [My│Assigned│All]       │
└─────────────────────────┘
```

**Desktop** (≥640px):
```
┌─────────────────────────────────────────────────────────┐
│ Search                                                  │
│ [                                             ]         │
├────────────────┬──────────────┬──────────────┬─────────┤
│ Project        │ Status       │ Priority     │Filter By│
│ [All ▼]        │ [All ▼]      │ [All ▼]      │[My│As..]│
└────────────────┴──────────────┴──────────────┴─────────┘
```

**Grid classes**:
```jsx
<div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
```
- **grid-cols-1**: 1 column on mobile
- **sm:grid-cols-4**: 4 columns on screens ≥640px

## Performance Considerations

**Current**:
- Re-renders on every filter change
- Immediate URL updates

**Optimizations**:
```jsx
import { useMemo, useCallback, useDebounce } from 'react';

// Debounce search input
const debouncedSearch = useDebounce(filters.search, 300);

// Memoize filter options
const statusOptions = useMemo(() => ['Open', 'In Progress', ...], []);

// Callback for handleFilterChange
const handleFilterChange = useCallback((filterName, value) => { ... }, [filters]);
```

## Accessibility Enhancements

**Improvements**:
```jsx
<form role="search" aria-label="Filter tickets">
  <div className="flex-1">
    <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">
      Search
    </label>
    <input
      id="search-input"
      type="search"
      value={filters.search}
      onChange={(e) => handleFilterChange('search', e.target.value)}
      placeholder="Search tickets..."
      aria-label="Search tickets by title or description"
      className="..."
    />
  </div>
  
  <select
    id="status-select"
    value={filters.status}
    onChange={(e) => handleFilterChange('status', e.target.value)}
    aria-label="Filter by status"
    className="..."
  >
    <option value="">All Statuses</option>
    {statusOptions.map(status => (
      <option key={status} value={status}>{status}</option>
    ))}
  </select>
  
  <div role="group" aria-label="Filter by user">
    {userFilterOptions.map(option => (
      <button
        key={option.value}
        onClick={() => handleFilterChange('user', option.value)}
        aria-pressed={filters.user === option.value}
        className={...}
      >
        {option.label}
      </button>
    ))}
  </div>
</form>
```

## Testing

**Unit tests**:
```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FilterBar from './FilterBar';

test('renders all filter inputs', () => {
  render(
    <MemoryRouter>
      <FilterBar filters={{}} onFilterChange={() => {}} />
    </MemoryRouter>
  );
  expect(screen.getByLabelText('Search')).toBeInTheDocument();
  expect(screen.getByLabelText('Project')).toBeInTheDocument();
  expect(screen.getByLabelText('Status')).toBeInTheDocument();
});

test('calls onFilterChange when search input changes', () => {
  const mockOnFilterChange = jest.fn();
  render(
    <MemoryRouter>
      <FilterBar filters={{ search: '' }} onFilterChange={mockOnFilterChange} />
    </MemoryRouter>
  );
  
  const searchInput = screen.getByPlaceholderText('Search tickets...');
  fireEvent.change(searchInput, { target: { value: 'bug' } });
  
  expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({ search: 'bug' }));
});

test('shows active filter badges when filters are applied', () => {
  render(
    <MemoryRouter>
      <FilterBar 
        filters={{ search: 'bug', status: 'Open' }} 
        onFilterChange={() => {}} 
      />
    </MemoryRouter>
  );
  expect(screen.getByText(/Search:/)).toBeInTheDocument();
  expect(screen.getByText(/Status:/)).toBeInTheDocument();
  expect(screen.getByText('Clear All')).toBeInTheDocument();
});
```
