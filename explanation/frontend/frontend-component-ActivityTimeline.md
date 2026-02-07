# frontend-component-ActivityTimeline.md

## Overview
The `ActivityTimeline.jsx` component displays chronological ticket activity with timestamps and user information.

## File Location
```
frontend/src/components/ActivityTimeline.jsx
```

## Dependencies - Detailed Import Analysis

```jsx
import { useState, useEffect } from 'react';
import API from '../utils/api';
```

### Import Statement Breakdown:
- **React Hooks**: `useState`, `useEffect` - State management and side effects
- **API Utility**: `API` - Centralized axios instance for HTTP requests

## Props Destructuring

```jsx
const ActivityTimeline = ({ ticketId }) => {
```

**Syntax Pattern**: Arrow function component with destructured props.

## useState for Multiple State Variables

```jsx
const [activities, setActivities] = useState([]);
const [loading, setLoading] = useState(true);
```

**Syntax Pattern**: Multiple state variables for component data and loading state.

## useEffect for Data Fetching

```jsx
useEffect(() => {
  if (ticketId) {
    fetchActivities();
  }
}, [ticketId]);
```

**Syntax Pattern**: Side effect hook with dependency array for conditional data fetching.

## Async Function Declaration

```jsx
const fetchActivities = async () => {
  try {
    setLoading(true);
    const response = await API.get(`/api/comments/ticket/${ticketId}`);
    const commentActivities = response.data.map(comment => ({
      id: comment._id,
      type: 'comment',
      action: 'commented',
      user: comment.author,
      content: comment.content,
      timestamp: comment.createdAt,
      icon: '💬'
    }));
    setActivities(commentActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
  } finally {
    setLoading(false);
  }
};
```

**Syntax Pattern**: Async/await pattern with try-catch-finally for error handling.

## Array Map for Data Transformation

```jsx
const commentActivities = response.data.map(comment => ({
  id: comment._id,
  type: 'comment',
  action: 'commented',
  user: comment.author,
  content: comment.content,
  timestamp: comment.createdAt,
  icon: '💬'
}));
```

**Syntax Pattern**: Array map for transforming API response data.

## Array Sort with Date Comparison

```jsx
const sortedActivities = commentActivities.sort((a, b) => 
  new Date(b.timestamp) - new Date(a.timestamp)
);
```

**Syntax Pattern**: Array sort with date subtraction for descending chronological order.

## Conditional Rendering with Early Return

```jsx
if (loading) {
  return <div className="loading-placeholder">Loading activities...</div>;
}
```

**Syntax Pattern**: Early return pattern for loading state.

## Critical Code Patterns

### 1. Async Data Fetching
```jsx
const fetchActivities = async () => {
  try {
    const response = await API.get(`/api/comments/ticket/${ticketId}`);
    // process data
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};
```
**Pattern**: Async/await with proper error handling and loading state management.

### 2. Data Transformation Mapping
```jsx
response.data.map(comment => ({
  id: comment._id,
  type: 'comment',
  action: 'commented',
  user: comment.author,
  // ... other properties
}));
```
**Pattern**: Array map for converting API response to component-specific data structure.

### 3. Date-based Sorting
```jsx
activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
```
**Pattern**: Numeric date comparison for chronological sorting.

### 4. Loading State Management
```jsx
const [loading, setLoading] = useState(true);
// ...
finally {
  setLoading(false);
}
```
**Pattern**: Boolean state for loading UI with proper cleanup.

### 5. Conditional Effect Execution
```jsx
useEffect(() => {
  if (ticketId) {
    fetchActivities();
  }
}, [ticketId]);
```
**Pattern**: Dependency-based effect execution to prevent unnecessary API calls.```
- **Trigger**: Runs when ticketId changes
- **Guard**: Only fetch if ticketId exists
- **Dependency**: Re-fetch if ticketId changes

### Lines 14-41: Fetch Activities Function
```jsx
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/comments/ticket/${ticketId}`);
```
- **Endpoint**: `GET /api/comments/ticket/:ticketId`
- **Returns**: Array of comment objects with populated author

```jsx
      const commentActivities = response.data.map(comment => ({
        id: comment._id,
        type: 'comment',
        action: comment.isEdited ? 'edited a comment' : 'added a comment',
        user: comment.author,
        content: comment.content,
        timestamp: comment.isEdited ? comment.editedAt : comment.createdAt,
        icon: '💬'
      }));
```

**Transformation**:
| Comment Field | Activity Field | Mapping Logic |
|---------------|----------------|---------------|
| _id | id | Direct mapping |
| - | type | Always 'comment' |
| isEdited | action | 'edited a comment' or 'added a comment' |
| author | user | Direct mapping (populated object) |
| content | content | Direct mapping |
| isEdited, editedAt, createdAt | timestamp | editedAt if edited, else createdAt |
| - | icon | Always '💬' emoji |

**Example Comment**:
```javascript
// Backend response
{
  _id: '507f1f77bcf86cd799439011',
  content: 'Fixed the bug',
  author: {
    _id: '507f1f77bcf86cd799439012',
    name: 'John Doe',
    email: 'john@example.com'
  },
  ticket: '507f1f77bcf86cd799439013',
  isEdited: true,
  createdAt: '2024-01-15T10:30:00.000Z',
  editedAt: '2024-01-15T11:45:00.000Z'
}

// Transformed activity
{
  id: '507f1f77bcf86cd799439011',
  type: 'comment',
  action: 'edited a comment',  // Because isEdited=true
  user: { _id: '...', name: 'John Doe', email: '...' },
  content: 'Fixed the bug',
  timestamp: '2024-01-15T11:45:00.000Z',  // editedAt, not createdAt
  icon: '💬'
}
```

```jsx
      const sortedActivities = commentActivities.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
```
- **Sorting**: Newest first (descending)
- **Logic**: `b.timestamp - a.timestamp` (larger = newer = first)
- **Example**:
  ```
  Before: [Comment 1 (10:30), Comment 2 (11:45), Comment 3 (09:00)]
  After:  [Comment 2 (11:45), Comment 1 (10:30), Comment 3 (09:00)]
  ```

```jsx
      setActivities(sortedActivities);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };
```
- **finally**: Always stop loading even on error
- **No toast**: Silent error handling (logged, not shown)

### Lines 43-53: Format Timestamp Function
```jsx
  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
```

**Format Options**:
| Option | Value | Example Output |
|--------|-------|----------------|
| month | 'short' | 'Jan', 'Feb', 'Dec' |
| day | 'numeric' | 1, 15, 31 |
| year | 'numeric' | 2024 |
| hour | 'numeric' | 1-12 (no leading zero) |
| minute | '2-digit' | 00-59 (with leading zero) |
| hour12 | true | AM/PM format |

**Example Outputs**:
| Input | Output |
|-------|--------|
| 2024-01-15T10:30:00.000Z | Jan 15, 2024, 10:30 AM |
| 2024-12-25T23:45:00.000Z | Dec 25, 2024, 11:45 PM |
| 2024-03-01T00:05:00.000Z | Mar 1, 2024, 12:05 AM |

**Compare to CommentSection.jsx formatDate()**:
- **CommentSection**: Relative ("5 minutes ago")
- **ActivityTimeline**: Absolute ("Jan 15, 2024, 10:30 AM")
- **Why different**: Timeline is historical, comments are recent

### Lines 55-64: Loading State Render
```jsx
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Activity</h3>
        <p className="text-gray-500">Loading activity...</p>
      </div>
    );
  }
```
- **Early return**: Exit render if still loading
- **Placeholder**: Shows title + loading text

### Lines 66-117: Main Render

#### Lines 67-70: Container & Header
```jsx
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Activity Timeline ({activities.length})
      </h3>
```
- **Activity count**: Dynamic `({activities.length})`

#### Lines 72-77: Empty State
```jsx
      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No activity yet</p>
      ) : (
        <div className="space-y-4">
```
- **Conditional**: Show empty message if no activities
- **space-y-4**: 16px vertical gap between activities

#### Lines 78-116: Activity List
```jsx
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
```
- **key={activity.id}**: Unique key for React list
- **flex gap-3**: Horizontal layout with 12px gap

```jsx
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-lg">
                  {activity.icon}
                </div>
              </div>
```
- **Icon container**: 32×32px circle
- **bg-indigo-100**: Light indigo background
- **text-lg**: 18px emoji size
- **flex-shrink-0**: Icon doesn't shrink if space limited

```jsx
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{activity.user.name}</span>
                    {' '}
                    <span className="text-gray-600">{activity.action}</span>
                  </p>
```
- **flex-1**: Takes remaining space
- **min-w-0**: Allow text to truncate if needed
- **Font weights**: Semibold name, normal action

**Visual**:
```
John Doe edited a comment
^^^^^^^^ ^^^^^^^^^^^^^^^^^^
 bold        normal
```

```jsx
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
```
- **whitespace-nowrap**: Timestamp stays on one line
- **text-xs**: 12px font (smaller than main text)
- **text-gray-500**: Lighter color for secondary info

```jsx
                {activity.content && activity.type === 'comment' && (
                  <div className="mt-2 bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {activity.content}
                    </p>
                  </div>
                )}
```
- **Conditional**: Only show content for comments (not other activity types)
- **bg-gray-50**: Very light gray background (distinguishes content box)
- **line-clamp-3**: Truncate after 3 lines with ellipsis
  - **Requires**: Tailwind plugin or custom CSS
  - **Effect**: Long comments don't take up too much space

**line-clamp-3 CSS**:
```css
.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
```

## Related Files
- **TicketDetail.jsx**: Uses this component to show ticket history
- **backend/controllers/commentController.js**: getTicketComments endpoint
- **CommentSection.jsx**: Similar component but with CRUD operations

## Activity Timeline vs Comment Section

| Feature | ActivityTimeline | CommentSection |
|---------|------------------|----------------|
| **Purpose** | Read-only history | Interactive comments |
| **Operations** | View only | Create, Edit, Delete |
| **Timestamps** | Absolute (Jan 15, 2024) | Relative (5 minutes ago) |
| **Layout** | Vertical timeline | Nested conversations |
| **Sorting** | Newest first | Newest first |
| **Content preview** | Truncated (3 lines) | Full content |
| **Use case** | Audit trail | Team communication |

## Example Activity Timeline

```
Activity Timeline (3)

┌─────────────────────────────────────────┐
│ 💬 John Doe edited a comment            │
│    Jan 15, 2024, 11:45 AM               │
│    ┌─────────────────────────────────┐  │
│    │ Fixed the critical bug in...   │  │
│    └─────────────────────────────────┘  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 💬 Jane Smith added a comment           │
│    Jan 15, 2024, 10:30 AM               │
│    ┌─────────────────────────────────┐  │
│    │ This looks good to me!         │  │
│    └─────────────────────────────────┘  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 💬 Bob Johnson added a comment          │
│    Jan 15, 2024, 9:00 AM                │
│    ┌─────────────────────────────────┐  │
│    │ Can we prioritize this?        │  │
│    └─────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Future Enhancements

**Additional Activity Types**:
```javascript
// Status changes
{
  id: '...',
  type: 'status_change',
  action: 'changed status from Open to In Progress',
  user: { ... },
  content: null,
  timestamp: '...',
  icon: '🔄'
}

// Priority changes
{
  id: '...',
  type: 'priority_change',
  action: 'changed priority to Critical',
  user: { ... },
  content: null,
  timestamp: '...',
  icon: '⚠️'
}

// Assignment changes
{
  id: '...',
  type: 'assignment',
  action: 'assigned to Jane Smith',
  user: { ... },
  content: null,
  timestamp: '...',
  icon: '👤'
}
```

**Fetch from Multiple Sources**:
```javascript
const fetchActivities = async () => {
  try {
    setLoading(true);
    
    // Fetch comments
    const commentsResponse = await API.get(`/comments/ticket/${ticketId}`);
    const commentActivities = transformCommentsToActivities(commentsResponse.data);
    
    // Fetch status changes (future)
    const statusResponse = await API.get(`/tickets/${ticketId}/history`);
    const statusActivities = transformHistoryToActivities(statusResponse.data);
    
    // Combine and sort
    const allActivities = [...commentActivities, ...statusActivities].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    setActivities(allActivities);
  } catch (error) {
    console.error('Failed to fetch activities:', error);
  } finally {
    setLoading(false);
  }
};
```

## Performance Considerations

**Current**:
- Single API call
- Client-side sorting
- No pagination (all activities loaded)

**Optimizations for large datasets**:
```jsx
// Backend pagination
const response = await API.get(`/comments/ticket/${ticketId}?limit=20&skip=${skip}`);

// Infinite scroll
const [page, setPage] = useState(1);
const loadMore = () => setPage(p => p + 1);

// Virtualized list (react-window)
import { FixedSizeList } from 'react-window';
```

## Accessibility Enhancements

**Improvements**:
```jsx
<div 
  className="bg-white rounded-lg shadow-md p-6"
  role="feed"
  aria-label="Activity timeline"
  aria-busy={loading}
>
  <h3 className="text-xl font-bold text-gray-900 mb-4">
    Activity Timeline ({activities.length})
  </h3>
  
  <div className="space-y-4">
    {activities.map((activity) => (
      <article 
        key={activity.id} 
        className="flex gap-3"
        aria-label={`${activity.user.name} ${activity.action} at ${formatTimestamp(activity.timestamp)}`}
      >
        {/* Activity content */}
      </article>
    ))}
  </div>
</div>
```
- **role="feed"**: ARIA role for activity streams
- **aria-busy**: Indicates loading state
- **<article>**: Semantic HTML for each activity
- **aria-label**: Screen reader summary

## Testing

**Unit tests**:
```jsx
import { render, screen, waitFor } from '@testing-library/react';
import ActivityTimeline from './ActivityTimeline';
import API from '../utils/api';

jest.mock('../utils/api');

test('renders loading state initially', () => {
  API.get.mockResolvedValue({ data: [] });
  render(<ActivityTimeline ticketId="123" />);
  expect(screen.getByText('Loading activity...')).toBeInTheDocument();
});

test('renders activities after loading', async () => {
  const mockActivities = [
    {
      _id: '1',
      content: 'Test comment',
      author: { name: 'John Doe' },
      isEdited: false,
      createdAt: '2024-01-15T10:30:00.000Z'
    }
  ];
  
  API.get.mockResolvedValue({ data: mockActivities });
  render(<ActivityTimeline ticketId="123" />);
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('added a comment')).toBeInTheDocument();
  });
});

test('renders empty state when no activities', async () => {
  API.get.mockResolvedValue({ data: [] });
  render(<ActivityTimeline ticketId="123" />);
  
  await waitFor(() => {
    expect(screen.getByText('No activity yet')).toBeInTheDocument();
  });
});
```
