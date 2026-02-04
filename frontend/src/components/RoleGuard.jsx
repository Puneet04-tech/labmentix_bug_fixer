import React from 'react';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/roles';

const RoleGuard = ({ 
  userRole, 
  permissions, 
  requireAll = false, // if true, requires all permissions; if false, requires any permission
  children, 
  fallback = null,
  renderFallback = false 
}) => {
  if (!userRole || !permissions) {
    return renderFallback ? fallback : null;
  }

  let hasRequiredPermission;
  
  if (requireAll) {
    hasRequiredPermission = hasAllPermissions(userRole, permissions);
  } else {
    hasRequiredPermission = hasAnyPermission(userRole, permissions);
  }

  if (hasRequiredPermission) {
    return children;
  }

  return renderFallback ? fallback : null;
};

export default RoleGuard;
