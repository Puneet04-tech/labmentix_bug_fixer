# 🌐 frontend/utils/roles.js - Role-Based Access Control

## 📋 File Overview
- **Location**: `frontend/src/utils/roles.js`
- **Purpose**: Manages user roles and permissions system
- **Lines**: ~125 lines
- **Dependencies**: None (pure utility functions)
- **New Feature**: Updated February 2026

---

## 🔍 Line-by-Line Breakdown

### 1-10: Role Definitions
```javascript
// Role-based access control system
export const ROLES = {
  ADMIN: 'admin',
  CORE: 'core',
  MEMBER: 'member'
};
```

**Role Hierarchy:**
- **ADMIN**: Full system access, user management
- **CORE**: Advanced features, ticket management
- **MEMBER**: Basic user access, standard features

### 11-20: Permission Levels
```javascript
// Permission levels (higher number = more permissions)
export const PERMISSION_LEVELS = {
  [ROLES.MEMBER]: 1,
  [ROLES.CORE]: 2,
  [ROLES.ADMIN]: 3
};
```

**Level System:**
- **Level 1 (Member)**: Basic read/write access
- **Level 2 (Core)**: Advanced features, team management
- **Level 3 (Admin)**: System administration, user management

### 21-60: Permission Definitions
```javascript
// Permissions for each role
export const ROLE_PERMISSIONS = {
  [ROLES.MEMBER]: [
    'view_tickets',
    'view_dashboard',
    'view_projects',
    'add_comments'
  ],
  [ROLES.CORE]: [
    'view_tickets',
    'view_dashboard',
    'view_projects',
    'add_comments',
    'create_tickets',
    'edit_own_tickets',
    'upload_attachments',
    'change_ticket_status',
    'assign_tickets',
    'view_reports'
  ],
  [ROLES.ADMIN]: [
    'view_tickets',
    'view_dashboard',
    'view_projects',
    'add_comments',
    'create_tickets',
    'edit_all_tickets',
    'upload_attachments',
    'change_ticket_status',
    'assign_tickets',
    'delete_tickets',
    'view_reports',
    'manage_team',
    'manage_users',
    'manage_settings',
    'system_admin'
  ]
};
```

**Permission Categories:**
- **View Permissions**: Dashboard, tickets, projects
- **Create/Edit**: Ticket management, comments
- **Advanced**: File uploads, status changes, assignments
- **Admin**: User management, system settings, deletions

### 61-90: Permission Checking Functions
```javascript
// Check if user has specific permission
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

// Check if user has any of the specified permissions
export const hasAnyPermission = (userRole, permissions) => {
  if (!userRole || !permissions || !Array.isArray(permissions)) return false;
  return permissions.some(permission => hasPermission(userRole, permission));
};

// Check if user has all specified permissions
export const hasAllPermissions = (userRole, permissions) => {
  if (!userRole || !permissions || !Array.isArray(permissions)) return false;
  return permissions.every(permission => hasPermission(userRole, permission));
};
```

**Permission Checking:**
- **Single Permission**: Check for specific access
- **Any Permission**: OR logic for multiple permissions
- **All Permissions**: AND logic for required permissions

### 91-110: Route Access Control
```javascript
// Check if user can access a route based on role
export const canAccessRoute = (userRole, requiredPermissions) => {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  return hasAnyPermission(userRole, requiredPermissions);
};
```

**Route Protection:**
- **Public Routes**: No permissions required
- **Protected Routes**: Any matching permission grants access
- **Flexible**: Supports multiple permission requirements

### 111-125: Display Functions
```javascript
// Get role display name
export const getRoleDisplayName = (role) => {
  const roleNames = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.CORE]: 'Core Member',
    [ROLES.MEMBER]: 'Member'
  };
  return roleNames[role] || 'Unknown';
};

// Get role color for UI
export const getRoleColor = (role) => {
  const roleColors = {
    [ROLES.ADMIN]: 'bg-red-500',
    [ROLES.CORE]: 'bg-blue-500',
    [ROLES.MEMBER]: 'bg-gray-500'
  };
  return roleColors[role] || 'bg-gray-500';
};
```

**UI Integration:**
- **Display Names**: User-friendly role labels
- **Color Coding**: Visual role identification
- **Fallback**: Handles unknown roles gracefully

---

## 🔄 Flow Diagrams

### Permission Check Flow
```
User Action → Required Permission → hasPermission()
                                      ↓
                            Check ROLE_PERMISSIONS
                                      ↓
                         User Role Permissions
                                      ↓
                            Grant/Deny Access
```

### Route Access Flow
```
Route Request → canAccessRoute() → Required Permissions
                                      ↓
                           hasAnyPermission()
                                      ↓
                         Check User Permissions
                                      ↓
                            Allow/Deny Navigation
```

---

## 🎯 Common Operations

### Checking Permissions
```javascript
import { hasPermission, hasAnyPermission } from '../utils/roles';

// Single permission check
const canCreateTickets = hasPermission(user.role, 'create_tickets');

// Multiple permissions (OR logic)
const canManageTickets = hasAnyPermission(user.role, [
  'create_tickets',
  'edit_all_tickets'
]);
```

### Route Protection
```javascript
import { canAccessRoute } from '../utils/roles';

// Check if user can access admin routes
const adminRoutes = ['manage_users', 'system_admin'];
const canAccessAdmin = canAccessRoute(user.role, adminRoutes);
```

### UI Role Display
```javascript
import { getRoleDisplayName, getRoleColor } from '../utils/roles';

// Display user role
const roleName = getRoleDisplayName(user.role);
const roleColor = getRoleColor(user.role);

// Use in JSX
<span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${roleColor}`}>
  {roleName}
</span>
```

---

## ⚠️ Common Pitfalls

### 1. **Incorrect Permission Checks**
```javascript
// ❌ Wrong - checking wrong permission
if (hasPermission(user.role, 'view_dashboard')) {
  // Allow creating tickets
}

// ✅ Correct - check appropriate permission
if (hasPermission(user.role, 'create_tickets')) {
  // Allow creating tickets
}
```

### 2. **Missing Null Checks**
```javascript
// ❌ Wrong - no null check
const permissions = ROLE_PERMISSIONS[user.role];

// ✅ Correct - handle undefined roles
const permissions = ROLE_PERMISSIONS[user.role] || [];
```

### 3. **Hardcoded Role Strings**
```javascript
// ❌ Wrong - magic strings
if (user.role === 'admin') { /* ... */ }

// ✅ Correct - use constants
if (user.role === ROLES.ADMIN) { /* ... */ }
```

---

## 🧪 Testing Examples

### Testing Permission Functions
```javascript
describe('Role Permissions', () => {
  test('admin should have all permissions', () => {
    expect(hasPermission(ROLES.ADMIN, 'manage_users')).toBe(true);
    expect(hasPermission(ROLES.ADMIN, 'system_admin')).toBe(true);
  });

  test('member should have basic permissions only', () => {
    expect(hasPermission(ROLES.MEMBER, 'view_tickets')).toBe(true);
    expect(hasPermission(ROLES.MEMBER, 'manage_users')).toBe(false);
  });

  test('core should have intermediate permissions', () => {
    expect(hasPermission(ROLES.CORE, 'create_tickets')).toBe(true);
    expect(hasPermission(ROLES.CORE, 'manage_users')).toBe(false);
  });
});
```

### Testing Route Access
```javascript
describe('Route Access', () => {
  test('should allow access with correct permissions', () => {
    const required = ['view_tickets', 'create_tickets'];
    expect(canAccessRoute(ROLES.CORE, required)).toBe(true);
    expect(canAccessRoute(ROLES.MEMBER, required)).toBe(false);
  });
});
```

---

## 🎓 Key Takeaways

1. **Hierarchical System**: Clear role progression from Member → Core → Admin
2. **Granular Permissions**: Specific permissions for different actions
3. **Flexible Checking**: Support for single, any, or all permission requirements
4. **UI Integration**: Built-in display names and color coding
5. **Type Safety**: Constants prevent typos and magic strings

---

## 📚 Related Files

- **Auth Context**: `frontend/context/AuthContext.jsx` - User authentication state
- **Protected Route**: `frontend/components/ProtectedRoute.jsx` - Route protection
- **Role Guard**: `frontend/components/RoleGuard.jsx` - Component-level protection
- **Backend Auth**: `backend/controllers/auth.js` - Server-side role validation
- **User Model**: `backend/models/User.js` - Role field definition