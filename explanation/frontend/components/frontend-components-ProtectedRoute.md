# Frontend Component: ProtectedRoute.jsx - Complete Explanation

Route guard that redirects unauthenticated users to login.

## 📋 Overview
- **Lines**: 22
- **Purpose**: Protect routes from unauthenticated access
- **Pattern**: Higher-Order Component (HOC) wrapper

---

## 🔑 Complete Code

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

---

## 💡 Line-by-Line Explanation

### **Line 4: Component Props**
```jsx
const ProtectedRoute = ({ children }) => {
```
- **children**: The component/page to protect
- **HOC Pattern**: Wraps other components with authentication logic

---

### **Line 5: Get Auth State**
```jsx
const { user, loading } = useAuth();
```
- **user**: Current authenticated user (null if not logged in)
- **loading**: True while checking authentication status

---

### **Lines 7-13: Loading State**
```jsx
if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
}
```
**Why needed?**
- **Prevents flash of wrong content**: Don't show login page while checking auth
- **Shows spinner**: User knows something is happening
- **Full screen**: `h-screen` makes it fill viewport

**TailwindCSS Classes**:
- `flex items-center justify-center`: Center content
- `h-screen`: 100% viewport height
- `animate-spin`: Built-in rotation animation
- `rounded-full`: Perfect circle
- `h-12 w-12`: 3rem × 3rem size
- `border-b-2`: Bottom border only
- `border-primary-600`: Brand color

---

### **Lines 15-17: Redirect if Not Authenticated**
```jsx
if (!user) {
  return <Navigate to="/login" replace />;
}
```
- **Navigate**: React Router component for redirects
- **to="/login"**: Redirect destination
- **replace**: Replace history entry (can't go back to protected page)

**Why replace?**
```
Without replace:
User → /dashboard (not logged in) → /login → back button → /dashboard (not logged in) → /login (loop!)

With replace:
User → /login (no /dashboard in history) → back button → previous page before /dashboard
```

---

### **Line 19: Render Protected Content**
```jsx
return children;
```
If user is authenticated and loading is false, render the wrapped component

---

## 🔄 Complete Authentication Flow

```
User visits /dashboard
    ↓
ProtectedRoute checks auth
    ↓
loading = true?
    ↓ YES → Show spinner
    ↓ NO
    ↓
user exists?
    ↓ NO → Navigate to /login
    ↓ YES
    ↓
Render Dashboard
```

---

## 🎯 Usage in App.jsx

```jsx
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected route */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected with Layout */}
      <Route 
        path="/projects" 
        element={
          <ProtectedRoute>
            <Layout>
              <Projects />
            </Layout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

---

## 🔒 Security Considerations

### **1. Client-Side Only**
```
Protected routes = UI protection
Backend still validates tokens on every API call
```
**Don't rely solely on client-side protection!**

### **2. Token in localStorage**
```javascript
// AuthContext checks token on mount
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    // Verify with backend
    API.get('/auth/me');
  }
}, []);
```

### **3. Replace vs Push**
Using `replace` prevents history manipulation:
```javascript
<Navigate to="/login" replace />  // ✅ Secure
<Navigate to="/login" />           // ❌ Can navigate back
```

---

## 🎨 Visual States

### **1. Loading State**
```
┌─────────────────────────┐
│                         │
│                         │
│           ⟳             │  ← Spinning animation
│                         │
│                         │
└─────────────────────────┘
```

### **2. Redirecting (Not Authenticated)**
```
User sees nothing (instant redirect)
```

### **3. Authenticated (Shows Content)**
```
┌─────────────────────────┐
│  Dashboard Content      │
│  User: John Doe         │
│  Projects: 5            │
│                         │
└─────────────────────────┘
```

---

## 🧪 Testing Scenarios

### **Scenario 1: Not Logged In**
```
Action: Visit /dashboard
Result: Redirect to /login
```

### **Scenario 2: Logged In**
```
Action: Visit /dashboard
Result: Show Dashboard
```

### **Scenario 3: Token Expired**
```
Action: Visit /dashboard with expired token
Flow:
  1. loading = true (show spinner)
  2. API.get('/auth/me') fails
  3. AuthContext sets user = null
  4. loading = false
  5. user === null
  6. Redirect to /login
```

### **Scenario 4: Fresh Page Load**
```
Action: Refresh /dashboard while logged in
Flow:
  1. ProtectedRoute mounts
  2. loading = true (AuthContext checking token)
  3. Show spinner
  4. AuthContext verifies token
  5. loading = false, user = { ... }
  6. Render Dashboard
```

---

## ⚡ Performance Notes

### **Why Render Spinner?**
```
Bad (flashes login page):
loading = true → show nothing → show login → user loads → show dashboard

Good (smooth transition):
loading = true → show spinner → user loads → show dashboard
```

### **Minimal Re-renders**
- Only re-renders when `user` or `loading` changes
- AuthContext memoizes values
- No unnecessary checks

---

## 📚 Related Files
- [frontend-context-AuthContext.md](frontend-context-AuthContext.md) - Auth state management
- [frontend-App.md](frontend-App.md) - Route definitions
- [frontend-pages-Login.md](frontend-pages-Login.md) - Login destination
- [frontend-components-Layout.md](frontend-components-Layout.md) - Often used together
