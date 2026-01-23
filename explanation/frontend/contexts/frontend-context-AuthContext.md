# Frontend Context: AuthContext.jsx - Complete Explanation

Authentication state management using React Context API.

## 📋 Overview
- **Lines**: 88
- **Purpose**: Global authentication state (user, login, logout, register)
- **Pattern**: Context Provider with custom hook

---

## 🔑 Key Functions

### **useAuth Hook (Lines 8-14)**
```javascript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```
**Purpose**: Access auth state from any component
**Usage**: `const { user, login, logout } = useAuth();`
**Error Handling**: Throws if used outside AuthProvider

---

### **State Management (Lines 17-19)**
```javascript
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();
```
- `user`: Current logged-in user object or null
- `loading`: True while checking authentication
- `navigate`: React Router navigation

---

### **Check Auth on Mount (Lines 22-35)**
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
**When it runs**: On app load
**What it does**: 
1. Check if token exists
2. If yes, fetch user profile
3. If fails, clear invalid token
4. Set loading false

---

### **Register Function (Lines 38-51)**
```javascript
const register = async (name, email, password) => {
  try {
    const { data } = await API.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
    toast.success('Registration successful!');
    navigate('/dashboard');
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    toast.error(message);
    return { success: false, message };
  }
};
```
**Steps**:
1. Call register API
2. Save token to localStorage
3. Update user state
4. Show success message
5. Redirect to dashboard

---

### **Login Function (Lines 54-67)**
```javascript
const login = async (email, password) => {
  try {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
    toast.success('Login successful!');
    navigate('/dashboard');
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    toast.error(message);
    return { success: false, message };
  }
};
```
**Similar to register** but calls `/auth/login`

---

### **Logout Function (Lines 70-75)**
```javascript
const logout = () => {
  localStorage.removeItem('token');
  setUser(null);
  toast.info('Logged out successfully');
  navigate('/login');
};
```
**Steps**:
1. Remove token from storage
2. Clear user state
3. Show message
4. Redirect to login

---

## 🔄 Complete Authentication Flow

```
App Loads
    ↓
AuthProvider mounts
    ↓
checkAuth() runs
    ↓ token exists?
    ↓ YES → fetch user → setUser()
    ↓ NO → setLoading(false)
    ↓
App renders
    ↓
User logs in
    ↓
login() → API call → save token → setUser()
    ↓
Protected routes accessible
```

---

## 🎯 Usage in Components

```javascript
// In any component
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, loading, login, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;
  
  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 📚 Related Files
- [frontend-utils-api.md](frontend-utils-api.md) - API calls
- [frontend-components-ProtectedRoute.md](frontend-components-ProtectedRoute.md) - Route protection
- [frontend-pages-Login.md](frontend-pages-Login.md) - Login form
- [backend-controllers-auth.md](backend-controllers-auth.md) - Backend auth logic
