# Frontend Context: AuthContext.jsx - COMPLETE LINE-BY-LINE EXPLANATION

## 📋 File Overview
**Location**: `frontend/src/contexts/AuthContext.jsx`  
**Lines**: 86  
**Purpose**: Global authentication state management

---

## 🎯 Core Functionality

**What It Does**:
1. Manages user login/logout state
2. Persists authentication across page reloads
3. Provides register/login/logout functions to entire app
4. Checks token validity on app startup

**Used By**: Every page and component that needs authentication

---

## 📝 LINE-BY-LINE BREAKDOWN

### **Lines 1-4: Imports**
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
```

**Line 1**: React context hooks
- `createContext()` - Creates context object
- `useContext()` - Consumes context in components
- `useState()` - User state, loading state
- `useEffect()` - Check authentication on mount

**Line 2**: `useNavigate()` - Programmatic navigation after login/logout

**Line 3**: `toast` - Show success/error notifications

**Line 4**: `API` - Custom axios instance with token interceptor

### **Lines 6-7: Create Context**
```javascript
const AuthContext = createContext();
```
Creates context object that will hold authentication state and functions

### **Lines 8-14: Custom Hook**
```javascript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**Purpose**: Enforces proper context usage

**Line 9**: `useContext(AuthContext)` - Gets context value

**Lines 10-12**: Error if used outside provider
```javascript
// WRONG - useAuth() called outside <AuthProvider>
function SomeComponent() {
  const { user } = useAuth();  // Throws error!
}

// CORRECT - Component wrapped in AuthProvider
<AuthProvider>
  <SomeComponent />  {/* Now useAuth() works */}
</AuthProvider>
```

### **Lines 16-20: AuthProvider Component Start**
```javascript
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
```

**Line 16**: `{ children }` - All components wrapped by provider

**Line 17**: `navigate` - For redirects after login/logout

**Line 18**: `user` state
- `null` when logged out
- `{ _id, name, email }` when logged in

**Line 19**: `loading` state
- `true` during initial auth check
- Prevents flash of login page while checking token

### **Lines 22-35: Check Authentication on Mount**
```javascript
useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await API.get('/auth/me');
        setUser(data);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };
  checkAuth();
}, []);
```

**Lines 22-35: Why This Runs**
User refreshes page → React unmounts/remounts → Need to restore user state from token

**Line 24**: `localStorage.getItem('token')` - Check if token exists
- Token was stored during login: `localStorage.setItem('token', data.token)`

**Line 25-31**: If token exists, verify it's valid

**Line 26**: `await API.get('/auth/me')` - Backend verifies token
- Backend route:
  ```javascript
  router.get('/me', protect, (req, res) => {
    res.json({ _id: req.user._id, name: req.user.name, email: req.user.email });
  });
  ```
- If token valid → Returns user data
- If token expired → Returns 401 error

**Line 27**: `setUser(data)` - Restore user state

**Line 28-30**: Catch block runs if token invalid/expired
- Remove bad token from storage

**Line 32**: `setLoading(false)` - **Always runs** (whether token valid or not)
- Now safe to render app

**Line 35**: `[]` empty dependency array - Runs ONCE on mount

### **Lines 38-49: Register Function**
```javascript
const register = async (name, email, password) => {
  try {
    const { data } = await API.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
    toast.success('Registration successful!');
    navigate('/dashboard');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Registration failed');
    throw error;
  }
};
```

**Line 38**: Async function receives form data from Register.jsx

**Line 40**: POST to `/auth/register`
- Backend creates user, hashes password, returns JWT token

**Line 41**: `localStorage.setItem('token', data.token)` - **CRITICAL**
- Stores JWT token in browser
- Persists across page reloads
- api.js interceptor will use this token for all future requests

**Line 42**: `setUser(data)` - Update state with user info

**Line 43**: Success toast notification

**Line 44**: `navigate('/dashboard')` - Redirect to dashboard

**Line 45-48**: Error handling
- `error.response?.data?.message` - Backend error message (e.g., "Email already exists")
- `throw error` - Register.jsx can handle it if needed

### **Lines 52-65: Login Function**
```javascript
const login = async (email, password) => {
  try {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
    toast.success(`Welcome back, ${data.name}!`);
    navigate('/dashboard');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Login failed');
    throw error;
  }
};
```

**Nearly identical to register**, key differences:

**Line 54**: POST to `/auth/login` instead of `/auth/register`

**Line 57**: Personalized message with user name

**Backend validates**:
- Email exists in database
- Password matches hashed password (using bcrypt)
- Returns JWT token + user data

### **Lines 68-73: Logout Function**
```javascript
const logout = () => {
  localStorage.removeItem('token');
  setUser(null);
  toast.info('Logged out successfully');
  navigate('/login');
};
```

**Line 69**: Remove token from localStorage - **CRITICAL**
- Without this, user could refresh page and still be logged in

**Line 70**: Clear user state

**Line 71**: Show logout message

**Line 72**: Redirect to login page

**Not async** - No API call needed (JWT stateless authentication)

### **Lines 75-82: Context Provider Value**
```javascript
const value = {
  user,
  loading,
  register,
  login,
  logout,
};

return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);
```

**Lines 75-81**: Create value object with all auth data/functions

**Line 83**: `<AuthContext.Provider value={value}>` - Makes value available to all children

**Line 84**: `{children}` - All wrapped components

---

## 🔄 Authentication Flow

### **1. Initial Page Load**
```
User visits site
  ↓
React mounts AuthProvider
  ↓
useEffect runs checkAuth()
  ↓
Get token from localStorage
  ↓
Token exists? → Call GET /auth/me → Set user state → loading = false
Token missing? → loading = false, user stays null
```

### **2. Registration Flow**
```
User fills Register form
  ↓
Calls register(name, email, password)
  ↓
POST /auth/register
  ↓
Backend creates user + JWT token
  ↓
Store token in localStorage
  ↓
Set user state
  ↓
Navigate to /dashboard
```

### **3. Login Flow**
```
User fills Login form
  ↓
Calls login(email, password)
  ↓
POST /auth/login
  ↓
Backend validates credentials + JWT token
  ↓
Store token in localStorage
  ↓
Set user state
  ↓
Navigate to /dashboard
```

### **4. Protected Route Check**
```
User tries to access /dashboard
  ↓
ProtectedRoute checks: const { user, loading } = useAuth()
  ↓
loading = true? → Show loader (still checking token)
loading = false && user = null? → Redirect to /login
loading = false && user exists? → Allow access
```

### **5. Logout Flow**
```
User clicks Logout button
  ↓
Calls logout()
  ↓
Remove token from localStorage
  ↓
Set user = null
  ↓
Navigate to /login
```

---

## 🎯 Usage in Components

**In Pages (Login.jsx)**:
```javascript
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);  // Handles everything!
  };
}
```

**In ProtectedRoute**:
```javascript
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  return children;
}
```

**In Navbar**:
```javascript
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <span>Welcome, {user.name}!</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 🔐 Security Features

1. **Token Verification on Mount**: Ensures token hasn't expired
2. **Automatic Token Cleanup**: Removes invalid tokens
3. **Secure Storage**: localStorage persists across sessions
4. **Error Handling**: Catches backend errors (invalid credentials, etc.)
5. **Loading State**: Prevents rendering before auth check complete

---

## 🚨 Common Issues

**Issue**: User sees login page briefly before being redirected
```javascript
// PROBLEM: Not checking loading state
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;  // Redirects before token checked!
  return children;
}

// SOLUTION: Wait for loading to finish
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;  // Wait for auth check
  if (!user) return <Navigate to="/login" />;
  return children;
}
```

**Issue**: Token persists even when it should be expired
```javascript
// Backend sets token expiration (in authController.js):
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: '30d'  // Token expires after 30 days
});

// Frontend doesn't check expiration locally
// Solution: Backend returns 401 when token expires, frontend catches and logs out
```

---

## 🎓 Key Concepts

**Context API**: Share state without prop drilling
```javascript
// Without Context (Prop Drilling)
<App user={user}>
  <Navbar user={user}>
    <UserMenu user={user} />
  </Navbar>
  <Dashboard user={user}>
    <Profile user={user} />
  </Dashboard>
</App>

// With Context
<AuthProvider>
  <App>
    <Navbar />  {/* useAuth() to get user */}
    <Dashboard />  {/* useAuth() to get user */}
  </App>
</AuthProvider>
```

**localStorage**: Browser storage API
- Persists across page reloads
- Survives browser close/reopen
- **Security note**: Vulnerable to XSS attacks (store tokens carefully)

**JWT Tokens**: JSON Web Tokens
- Format: `header.payload.signature`
- Payload contains user ID
- Backend verifies signature
- Stateless (no database lookup needed for auth)

---

## 🔗 Related Files
- [Login.jsx](../pages/frontend-pages-Login.md) - Uses login function
- [Register.jsx](../pages/frontend-pages-Register.md) - Uses register function
- [ProtectedRoute.jsx](../components/frontend-component-ProtectedRoute.md) - Checks user state
- [api.js](../utils/frontend-utils-api.md) - Injects token into requests
- [backend-controller-auth.md](../../backend/controllers/backend-controller-auth.md) - Backend auth logic

---

Foundation of entire authentication system - enables secure user sessions! 🔐✨
