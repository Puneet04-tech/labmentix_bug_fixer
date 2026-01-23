# ProtectedRoute.jsx - Frontend Component Line-by-Line Explanation

## Overview
Route guard component that redirects unauthenticated users to login page, with loading state handling.

## Key Features
- Check user authentication status
- Show loading spinner during auth check
- Redirect to login if not authenticated
- Allow access if authenticated

## Line-by-Line Analysis

### Lines 1-3: Imports
```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
```
- **Navigate**: Component for declarative redirection
- **useAuth**: Access authentication state

### Lines 5-7: Component Props and Context
```jsx
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
```
- **children prop**: The protected page component to render
- **user**: Current authenticated user (null if not logged in)
- **loading**: Boolean indicating auth check in progress

### Lines 9-15: Loading State
```jsx
if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
}
```
- **Why loading state**: On page load, AuthContext checks localStorage for token and validates with API
- **h-screen**: Full viewport height
- **flex items-center justify-center**: Center spinner
- **animate-spin**: Tailwind CSS rotation animation
- **Spinner**: Circular loading indicator (12×12, blue border-bottom)
- **Duration**: Usually ~100-500ms while AuthContext validates token

### Lines 17-19: Redirect if Not Authenticated
```jsx
if (!user) {
  return <Navigate to="/login" replace />;
}
```
- **!user**: If user is null/undefined (not authenticated)
- **Navigate component**: Declarative redirect (React Router v6)
- **replace prop**: Replace history entry instead of pushing new one
  - User can't press back button to return to protected page
  - Prevents redirect loop

### Lines 21: Render Protected Content
```jsx
return children;
```
- **children**: Render the protected page component
- **Only reached if**: user is authenticated and loading is false

## Related Files
- **AuthContext.jsx**: Provides user and loading state
- **App.jsx**: Wraps protected routes with ProtectedRoute
- **Login.jsx**: Redirect destination

## Usage in App.jsx
```jsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Layout>
        <Dashboard />
      </Layout>
    </ProtectedRoute>
  } />
  
  <Route path="/projects" element={
    <ProtectedRoute>
      <Layout>
        <Projects />
      </Layout>
    </ProtectedRoute>
  } />
</Routes>
```
- **Wrap protected pages**: ProtectedRoute wraps Layout wraps Page component
- **Public routes**: Login and Register NOT wrapped (anyone can access)

## Authentication Flow

```
User navigates to /dashboard
         ↓
   ProtectedRoute runs
         ↓
    Check loading
         ↓
   ┌─────┴─────┐
   │  loading  │  YES → Show spinner
   └─────┬─────┘
         NO
         ↓
    Check user
         ↓
   ┌─────┴─────┐
   │   !user   │  YES → Navigate to /login
   └─────┬─────┘
         NO
         ↓
  Render children (Dashboard)
```

## Why Replace History?
```jsx
<Navigate to="/login" replace />
```

**Without replace (push history)**:
1. User navigates to /dashboard (not logged in)
2. Redirected to /login
3. User logs in
4. Redirected to /dashboard
5. User presses back button → /login → Redirected to /dashboard (loop)

**With replace (replace history)**:
1. User navigates to /dashboard (not logged in)
2. Redirected to /login (replaces /dashboard in history)
3. User logs in
4. Redirected to /dashboard
5. User presses back button → Goes to page before /dashboard (no loop)

## Loading State Importance

**Without loading check**:
```jsx
// WRONG - causes flash of login page
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};
```
- On page load, user is initially null (before token validated)
- User would see login page flash, then dashboard
- Bad UX

**With loading check** (current implementation):
- Show spinner while validating token
- Only redirect if validation completes and user still null
- Smooth experience, no flashing

## Security Considerations
- **Client-side only**: This only prevents UI access
- **Not sufficient alone**: Backend must also verify JWT token
- **Backend protection**: All API endpoints use auth middleware
- **Full security**: Frontend (ProtectedRoute) + Backend (auth middleware)

## Alternative Implementations

**Option 1: Redirect to original page after login**
```jsx
if (!user) {
  return <Navigate to={`/login?redirect=${window.location.pathname}`} replace />;
}
```
- Save intended destination in query param
- Login page redirects to saved location after auth

**Option 2: Show 403 page instead of redirect**
```jsx
if (!user) {
  return <UnauthorizedPage />;
}
```
- Show error page instead of redirecting
- Less common for web apps

## Component Type Pattern
This is a **Higher-Order Component (HOC)** pattern:
- Wraps child components
- Adds authentication logic
- Conditionally renders children

Similar to:
- `<ErrorBoundary>` (React error handling)
- `<Suspense>` (React lazy loading)
- `<PermissionGuard>` (role-based access)
