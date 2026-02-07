# 👥 frontend/pages/Team.jsx - Team Management Page

## 📋 File Overview
- **Location**: `frontend/src/pages/Team.jsx`
- **Purpose**: Displays all users in the system with their roles and information
- **Lines**: ~69 lines
- **Dependencies**: React, API utility, AuthContext, Lucide icons
- **New Feature**: Added February 2026

---

## 🔍 Line-by-Line Breakdown

### 1-10: Imports & Setup
```jsx
import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';

const Team = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
```

**Component Structure:**
- **React Hooks**: useEffect for data loading, useState for state management
- **API Integration**: Uses centralized API utility
- **Auth Context**: Access to current user information
- **Icons**: Lucide React for user avatars

### 11-25: Data Loading Effect
```jsx
useEffect(() => {
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/users');
      setUsers(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  load();
}, []);
```

**Data Fetching:**
- **Automatic Loading**: Fetches users on component mount
- **Error Handling**: Comprehensive error states
- **Loading States**: User feedback during data fetch
- **API Response**: Handles both success and error responses

### 26-45: Page Header & Layout
```jsx
return (
  <div className="min-h-screen px-4">
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Team</h1>
          <p className="text-sm text-gray-300 mt-1">All users in the system</p>
        </div>
      </div>
```

**Layout Design:**
- **Full Height**: Responsive container with proper spacing
- **Header Section**: Clear page title and description
- **Dark Theme**: Consistent with app's design system
- **Typography**: Proper hierarchy with white text on dark background

### 46-69: User List Rendering
```jsx
<div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800">
  {loading ? (
    <p className="text-gray-300">Loading...</p>
  ) : error ? (
    <p className="text-red-400">{error}</p>
  ) : users.length === 0 ? (
    <p className="text-gray-300">No users found</p>
  ) : (
    <div className="space-y-3">
      {users.map(u => (
        <div key={u._id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">
              {u.name ? u.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-medium text-white">{u.name}</div>
              <div className="text-sm text-gray-300">{u.email}</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">{u.role}</div>
        </div>
      ))}
    </div>
  )}
</div>
```

**User Display Features:**
- **Avatar Generation**: First letter of name or icon fallback
- **User Information**: Name, email, and role display
- **Responsive Design**: Proper spacing and alignment
- **State Handling**: Loading, error, and empty states
- **Role Visibility**: Shows user roles for team management

---

## 🔄 Flow Diagrams

### Team Page Flow
```
Component Mount → useEffect → API Call (/users)
                                      ↓
                            Loading State
                                      ↓
                 Success → Display Users
                 Error → Show Error Message
```

### User Card Rendering
```
User Data → Avatar Generation → Name/Email Display
                                      ↓
                            Role Badge
                                      ↓
                            Styled Card
```

---

## 🎯 Common Operations

### Fetching Team Data
```javascript
// Automatic data loading
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await API.get('/users');
      setUsers(response.data);
    } catch (error) {
      setError('Failed to load team members');
    }
  };

  fetchUsers();
}, []);
```

### User Avatar Generation
```javascript
// Generate user avatar
const getUserAvatar = (user) => {
  if (user.name && user.name.length > 0) {
    return user.name.charAt(0).toUpperCase();
  }
  return <User className="w-5 h-5" />;
};
```

### Role Display
```javascript
// Display user role
const displayRole = (role) => {
  const roleMap = {
    'admin': 'Administrator',
    'core': 'Core Member',
    'member': 'Member'
  };
  return roleMap[role] || 'Unknown';
};
```

---

## ⚠️ Common Pitfalls

### 1. **Missing Error Handling**
```javascript
// ❌ Wrong - no error handling
const users = await API.get('/users');
setUsers(users.data);

// ✅ Correct - comprehensive error handling
try {
  const response = await API.get('/users');
  setUsers(response.data || []);
} catch (err) {
  setError(err.response?.data?.message || 'Failed to load users');
}
```

### 2. **Avatar Fallback Issues**
```javascript
// ❌ Wrong - no null check
const avatar = user.name.charAt(0);

// ✅ Correct - handle empty names
const avatar = user.name && user.name.length > 0
  ? user.name.charAt(0).toUpperCase()
  : <User className="w-5 h-5" />;
```

### 3. **Role Display**
```javascript
// ❌ Wrong - raw role display
<div>{user.role}</div>

// ✅ Correct - formatted role display
<div>{displayRole(user.role)}</div>
```

---

## 🧪 Testing Examples

### Testing Data Loading
```javascript
describe('Team Page', () => {
  test('should load users on mount', async () => {
    render(<Team />);

    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('should handle API errors', async () => {
    // Mock API error
    jest.spyOn(API, 'get').mockRejectedValue({
      response: { data: { message: 'Server error' } }
    });

    render(<Team />);

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });
});
```

### Testing User Display
```javascript
describe('User Display', () => {
  test('should show user avatar', () => {
    const user = { name: 'John Doe', email: 'john@example.com', role: 'member' };

    render(<UserCard user={user} />);

    expect(screen.getByText('J')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

---

## 🎓 Key Takeaways

1. **Automatic Data Loading**: Fetches team data on component mount
2. **Comprehensive States**: Handles loading, error, and empty states
3. **User-Friendly Display**: Avatars, names, emails, and roles
4. **Responsive Design**: Works on all screen sizes
5. **Error Resilience**: Graceful error handling and user feedback

---

## 📚 Related Files

- **API Utility**: `frontend/utils/api.js` - HTTP request handling
- **Auth Context**: `frontend/context/AuthContext.jsx` - User authentication
- **Backend Route**: `backend/routes/users.js` - User data endpoint
- **User Model**: `backend/models/User.js` - User data structure
- **Layout**: `frontend/components/Layout.jsx` - Page layout wrapper