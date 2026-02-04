// Role-based access control system
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager', 
  DEVELOPER: 'developer',
  VIEWER: 'viewer'
};

// Permission levels (higher number = more permissions)
export const PERMISSION_LEVELS = {
  [ROLES.VIEWER]: 1,
  [ROLES.DEVELOPER]: 2,
  [ROLES.MANAGER]: 3,
  [ROLES.ADMIN]: 4
};

// Permissions for each role
export const ROLE_PERMISSIONS = {
  [ROLES.VIEWER]: [
    'view_tickets',
    'view_dashboard',
    'view_projects',
    'add_comments'
  ],
  [ROLES.DEVELOPER]: [
    'view_tickets',
    'view_dashboard', 
    'view_projects',
    'add_comments',
    'create_tickets',
    'edit_own_tickets',
    'upload_attachments',
    'change_ticket_status'
  ],
  [ROLES.MANAGER]: [
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
    'manage_team'
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

// Check if user can access a route based on role
export const canAccessRoute = (userRole, requiredPermissions) => {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  return hasAnyPermission(userRole, requiredPermissions);
};

// Get role display name
export const getRoleDisplayName = (role) => {
  const roleNames = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.MANAGER]: 'Manager',
    [ROLES.DEVELOPER]: 'Developer', 
    [ROLES.VIEWER]: 'Viewer'
  };
  return roleNames[role] || 'Unknown';
};

// Get role color for UI
export const getRoleColor = (role) => {
  const roleColors = {
    [ROLES.ADMIN]: 'bg-red-500',
    [ROLES.MANAGER]: 'bg-purple-500',
    [ROLES.DEVELOPER]: 'bg-blue-500',
    [ROLES.VIEWER]: 'bg-gray-500'
  };
  return roleColors[role] || 'bg-gray-500';
};

// Check if user can edit ticket (own ticket or higher role)
export const canEditTicket = (userRole, ticketAuthorId, userId) => {
  if (hasPermission(userRole, 'edit_all_tickets')) return true;
  if (hasPermission(userRole, 'edit_own_tickets') && ticketAuthorId === userId) return true;
  return false;
};

// Check if user can delete ticket
export const canDeleteTicket = (userRole) => {
  return hasPermission(userRole, 'delete_tickets');
};
