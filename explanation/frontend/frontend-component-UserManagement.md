# frontend-component-UserManagement.md

## Overview
The `UserManagement.jsx` component provides admin interface for managing user roles and permissions.

## File Location
```
frontend/src/components/UserManagement.jsx
```

## Dependencies - Detailed Import Analysis

```jsx
import React, { useState, useEffect } from 'react';
import { Users, Shield, User, Crown, Key, AlertCircle, CheckCircle } from 'lucide-react';
```

### Import Statement Breakdown:
- **React Hooks**: `useState, useEffect` - State management and lifecycle effects
- **Lucide Icons**: 7 individual icon components for role indicators and UI elements

## State Management Syntax

```jsx
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');
const [updatingUserId, setUpdatingUserId] = useState(null);
```

**Syntax Pattern**: Multiple useState hooks for different data types and loading states.

## Role Update with Optimistic UI

```jsx
const handleRoleChange = async (userId, newRole) => {
  const oldUsers = [...users];
  const userIndex = users.findIndex(user => user._id === userId);

  if (userIndex === -1) return;

  // Optimistic update
  const updatedUsers = [...users];
  updatedUsers[userIndex] = { ...updatedUsers[userIndex], role: newRole };
  setUsers(updatedUsers);
  setUpdatingUserId(userId);

  try {
    const response = await fetch(`/api/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ role: newRole })
    });

    if (!response.ok) {
      throw new Error('Failed to update role');
    }

    setSuccess('Role updated successfully');
    setTimeout(() => setSuccess(''), 3000);
  } catch (err) {
    // Revert optimistic update on error
    setUsers(oldUsers);
    setError(err.message);
    setTimeout(() => setError(''), 5000);
  } finally {
    setUpdatingUserId(null);
  }
};
```

**Syntax Pattern**: Optimistic UI updates with error rollback, array spread for state copying.

## Array Find and Mapping

```jsx
const getRoleIcon = (role) => {
  switch (role) {
    case 'admin': return <Crown className="w-4 h-4 text-purple-500" />;
    case 'core': return <Shield className="w-4 h-4 text-blue-500" />;
    case 'member': return <User className="w-4 h-4 text-green-500" />;
    default: return <User className="w-4 h-4 text-gray-500" />;
  }
};

const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'core': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'member': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
```

**Syntax Pattern**: Switch statements returning JSX elements for conditional rendering.

## Critical Code Patterns

### 1. Optimistic State Updates
```jsx
const oldUsers = [...users];
// Update UI immediately
setUsers(updatedUsers);
// Revert on error
setUsers(oldUsers);
```
**Pattern**: Immediate UI updates with error rollback for better UX.

### 2. Array Destructuring and Spread
```jsx
const updatedUsers = [...users];
updatedUsers[userIndex] = { ...updatedUsers[userIndex], role: newRole };
```
**Pattern**: Array spread and object spread for immutable state updates.

### 3. Template Literals for Dynamic Classes
```jsx
className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}
```
**Pattern**: Dynamic CSS classes using template literals and function calls.

### 4. Local Storage API Usage
```jsx
'Authorization': `Bearer ${localStorage.getItem('token')}`
```
**Pattern**: Browser localStorage API for token retrieval.

## Key Features

### User Listing
- **Complete User Table**: Displays all system users with detailed information
- **Avatar Generation**: Automatic avatar creation from user names
- **User Statistics**: Total user count display
- **Responsive Design**: Horizontal scrolling for mobile devices

### Role Management
- **Real-time Role Changes**: Dropdown selection for role updates
- **Loading States**: Visual feedback during role updates
- **Optimistic Updates**: Immediate UI updates with server confirmation
- **Error Handling**: Comprehensive error display and recovery

### Visual Role Indicators
- **Role Icons**: Crown (admin), Shield (core), User (member)
- **Color-coded Badges**: Purple (admin), Blue (core), Green (member)
- **Role Descriptions**: Detailed permission explanations
- **Permission Summary**: Quick reference panel for role capabilities

### Access Control
- **Admin-only Access**: Component restricted to admin users
- **API Authentication**: JWT token-based authentication
- **Error Boundaries**: Graceful handling of API failures

## Code Breakdown

### User Fetching Logic
```jsx
const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/users/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    setUsers(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Role Change Handler
```jsx
const handleRoleChange = async (userId, newRole) => {
  setUpdatingUserId(userId);
  setError('');
  setSuccess('');

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role: newRole })
    });

    if (!response.ok) {
      throw new Error('Failed to update user role');
    }

    const data = await response.json();
    setSuccess(`User role updated successfully`);
    
    // Update the user in the local state
    setUsers(users.map(user => 
      user._id === userId 
        ? { ...user, role: newRole }
        : user
    ));
  } catch (err) {
    setError(err.message);
  } finally {
    setUpdatingUserId(null);
  }
};
```

### Visual Helper Functions
```jsx
const getRoleIcon = (role) => {
  switch (role) {
    case 'admin':
      return <Crown className="w-4 h-4 text-purple-500" />;
    case 'core':
      return <Shield className="w-4 h-4 text-blue-500" />;
    case 'member':
      return <User className="w-4 h-4 text-green-500" />;
    default:
      return <User className="w-4 h-4 text-gray-500" />;
  }
};

const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
    case 'core':
      return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
    case 'member':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    default:
      return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
  }
};

const getRoleDescription = (role) => {
  switch (role) {
    case 'admin':
      return 'Full system access, user management';
    case 'core':
      return 'Advanced permissions, project management';
    case 'member':
      return 'Basic ticket creation and commenting';
    default:
      return 'Limited access';
  }
};
```

## Flow Diagram

```mermaid
graph TD
    A[Component Mount] --> B[fetchUsers()]
    B --> C[API Call: GET /api/users/all]
    C --> D{Response OK?}
    D -->|Yes| E[Set users state]
    D -->|No| F[Set error state]
    E --> G[Set loading: false]
    F --> G

    G --> H[Render user table]
    H --> I{User selects new role?}
    I -->|Yes| J[handleRoleChange(userId, newRole)]
    J --> K[Set updatingUserId]
    K --> L[API Call: PUT /api/users/:id/role]
    L --> M{Response OK?}
    M -->|Yes| N[Update local state]
    M -->|No| O[Set error state]
    N --> P[Set success message]
    O --> P
    P --> Q[Clear updatingUserId]
    Q --> H
```

## API Integration

### Fetch All Users
**Method**: GET
**URL**: `/api/users/all`
**Headers**:
```json
{
  "Authorization": "Bearer {token}"
}
```
**Response**:
```json
[
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Update User Role
**Method**: PUT
**URL**: `/api/users/{userId}/role`
**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {token}"
}
```
**Body**:
```json
{
  "role": "core"
}
```

## Role System

### Admin Role
- **Icon**: Crown (👑)
- **Color**: Purple
- **Permissions**: Full system access, user management, all operations
- **Use Case**: System administrators, super users

### Core Role
- **Icon**: Shield (🛡️)
- **Color**: Blue
- **Permissions**: Advanced permissions, project management, team oversight
- **Use Case**: Team leads, senior developers, project managers

### Member Role
- **Icon**: User (👤)
- **Color**: Green
- **Permissions**: Basic ticket creation, commenting, assigned tasks
- **Use Case**: Regular team members, contributors

## Testing Examples

### Test User Loading
```javascript
// Mock API response
const mockUsers = [
  { _id: '1', name: 'Admin User', email: 'admin@test.com', role: 'admin', createdAt: '2024-01-01' },
  { _id: '2', name: 'Core User', email: 'core@test.com', role: 'core', createdAt: '2024-01-02' }
];

jest.mock('../utils/api');
API.get.mockResolvedValue({ data: mockUsers });

render(<UserManagement />);

await waitFor(() => {
  expect(screen.getByText('Admin User')).toBeInTheDocument();
  expect(screen.getByText('Core User')).toBeInTheDocument();
});
```

### Test Role Change
```javascript
render(<UserManagement />);

// Find role select for a user
const roleSelect = screen.getAllByDisplayValue('member')[0];

// Change role to core
fireEvent.change(roleSelect, { target: { value: 'core' } });

// Verify API call
await waitFor(() => {
  expect(fetch).toHaveBeenCalledWith('/api/users/someUserId/role', expect.objectContaining({
    method: 'PUT',
    body: JSON.stringify({ role: 'core' })
  }));
});
```

### Test Error Handling
```javascript
// Mock API failure
fetch.mockRejectedValueOnce(new Error('Network error'));

render(<UserManagement />);

await waitFor(() => {
  expect(screen.getByText('Network error')).toBeInTheDocument();
});
```

### Test Loading State
```javascript
render(<UserManagement />);

// Should show loading spinner initially
expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
```

## Security Considerations
- **Admin-only Access**: Should be protected by role guards
- **API Authentication**: All requests require valid JWT tokens
- **Input Validation**: Role values validated against allowed options
- **Audit Trail**: Consider logging role changes for compliance

## Performance Notes
- **Efficient Rendering**: Table-based layout for large user lists
- **Optimistic Updates**: Immediate UI feedback for better UX
- **Minimal Re-renders**: Targeted state updates
- **Loading Optimization**: Single API call on mount

## Accessibility Features
- **Semantic HTML**: Proper table structure with headers
- **Keyboard Navigation**: Select dropdowns accessible via keyboard
- **Screen Reader Support**: Descriptive labels and ARIA attributes
- **Color Contrast**: High contrast for role badges and icons
- **Focus Management**: Clear focus indicators

## Error Handling
- **API Failures**: User-friendly error messages
- **Network Issues**: Graceful degradation
- **Validation Errors**: Clear feedback for invalid operations
- **Loading States**: Prevent user confusion during operations

## Related Files
- **Admin Page**: Uses UserManagement for user administration
- **Role Utilities**: `../utils/roles.js` - Permission checking functions
- **Auth Context**: User authentication and role management
- **Backend Users API**: Server-side user management endpoints

## Future Enhancements
- Bulk role operations
- Advanced user filtering and search
- User activity logs
- Role change history
- User deactivation/reactivation
- Password reset capabilities
- User profile management integration