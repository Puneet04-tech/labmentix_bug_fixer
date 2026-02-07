# frontend-component-RoleGuard.md

## Overview
The `RoleGuard.jsx` component implements role-based access control for conditional rendering.

## File Location
```
frontend/src/components/RoleGuard.jsx
```

## Dependencies - Detailed Import Analysis

```jsx
import React from 'react';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/roles';
```

### Import Statement Breakdown:
- **React**: Base React import for JSX
- **Role Utilities**: Three functions for permission checking from utils/roles.js

## Component Props Destructuring

```jsx
const RoleGuard = ({
  userRole,
  permissions,
  requireAll = false,
  children,
  fallback = null,
  renderFallback = false
}) => {
```

**Syntax Pattern**: Object destructuring in function parameters with default values.

## Conditional Logic with Early Return

```jsx
if (!userRole || !permissions) {
  return renderFallback ? fallback : null;
}
```

**Syntax Pattern**: Early return pattern for invalid props, conditional rendering with ternary operator.

## Permission Checking Strategy

```jsx
let hasRequiredPermission;

if (requireAll) {
  hasRequiredPermission = hasAllPermissions(userRole, permissions);
} else {
  hasRequiredPermission = hasAnyPermission(userRole, permissions);
}
```

**Syntax Pattern**: Variable declaration with let, conditional assignment using if-else.

## Conditional Rendering with Logical AND

```jsx
return hasRequiredPermission ? children : (renderFallback ? fallback : null);
```

**Syntax Pattern**: Ternary operator for conditional rendering, nested ternary for fallback logic.

## Code Breakdown

### Permission Checking Logic
```jsx
const RoleGuard = ({ 
  userRole, 
  permissions, 
  requireAll = false,
  children, 
  fallback = null,
  renderFallback = false 
}) => {
  // Early return if required props missing
  if (!userRole || !permissions) {
    return renderFallback ? fallback : null;
  }

  let hasRequiredPermission;
  
  // Choose permission checking strategy
  if (requireAll) {
    hasRequiredPermission = hasAllPermissions(userRole, permissions);
  } else {
    hasRequiredPermission = hasAnyPermission(userRole, permissions);
  }

  // Render children if authorized, fallback if denied
  if (hasRequiredPermission) {
    return children;
  }

  return renderFallback ? fallback : null;
};
```

## Usage Examples

### Basic Permission Check
```jsx
import RoleGuard from '../components/RoleGuard';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { user } = useAuth();

  return (
    <RoleGuard
      userRole={user?.role}
      permissions="admin"
    >
      <div>Admin-only content</div>
    </RoleGuard>
  );
};
```

### Multiple Permissions (Any Required)
```jsx
<RoleGuard
  userRole={user?.role}
  permissions={['edit_tickets', 'delete_tickets']}
  requireAll={false} // Default: requires any permission
>
  <TicketActions />
</RoleGuard>
```

### Multiple Permissions (All Required)
```jsx
<RoleGuard
  userRole={user?.role}
  permissions={['manage_users', 'manage_projects', 'system_admin']}
  requireAll={true} // Requires ALL permissions
>
  <SystemSettings />
</RoleGuard>
```

### With Fallback Content
```jsx
<RoleGuard
  userRole={user?.role}
## Critical Code Patterns

### 1. Props Destructuring with Defaults
```jsx
const RoleGuard = ({
  userRole,
  permissions,
  requireAll = false,
  children,
  fallback = null,
  renderFallback = false
}) => {
```
**Pattern**: Destructuring function parameters with default values.

### 2. Early Return for Edge Cases
```jsx
if (!userRole || !permissions) {
  return renderFallback ? fallback : null;
}
```
**Pattern**: Early return to handle invalid props before main logic.

### 3. Conditional Variable Assignment
```jsx
let hasRequiredPermission;

if (requireAll) {
  hasRequiredPermission = hasAllPermissions(userRole, permissions);
} else {
  hasRequiredPermission = hasAnyPermission(userRole, permissions);
}
```
**Pattern**: Using let for conditional variable assignment.

### 4. Nested Ternary Operators
```jsx
return hasRequiredPermission ? children : (renderFallback ? fallback : null);
```
**Pattern**: Nested ternary operators for complex conditional rendering.

### 5. Optional Chaining in Usage
```jsx
userRole={user?.role}
```
**Pattern**: Optional chaining to safely access nested properties.

### 6. Array Props for Multiple Permissions
```jsx
permissions={['edit_tickets', 'delete_tickets']}
```
**Pattern**: Array literals for multiple permission requirements.

### 7. Boolean Props for Configuration
```jsx
requireAll={true}
renderFallback={true}
```
**Pattern**: Boolean props to control component behavior.