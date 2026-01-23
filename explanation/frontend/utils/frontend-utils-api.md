# Frontend Utils: api.js - Complete Explanation

## 📋 Overview

- **Location**: `frontend/src/utils/api.js`
- **Purpose**: Configure Axios instance with automatic JWT token injection
- **Lines**: 16
- **Key Features**: Base URL configuration, request interceptors, token management

---

## 🔍 Complete Code

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

---

## 📖 Line-by-Line Explanation

### **Line 1: Import Axios**
```javascript
import axios from 'axios';
```

**What it does**: Imports the Axios HTTP client library

**Why Axios?**
- Promise-based HTTP client
- Works in browser and Node.js
- Automatic JSON transformation
- Request/response interceptors
- Better error handling than fetch()

---

### **Lines 3-5: Create Axios Instance**
```javascript
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});
```

**Line 3**: `axios.create()` - Creates custom axios instance with default config

**Line 4**: Base URL configuration
- `import.meta.env.VITE_API_URL` - Environment variable from Vite
- `||` - Fallback operator
- `'http://localhost:5000/api'` - Default development URL

**How it works**:
```javascript
// In development (.env.development):
VITE_API_URL=http://localhost:5000/api

// In production (.env.production):
VITE_API_URL=https://api.example.com/api

// All API calls now use this base:
API.get('/projects') → http://localhost:5000/api/projects
API.post('/tickets') → http://localhost:5000/api/tickets
```

---

### **Lines 7-13: Request Interceptor**
```javascript
// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**What are Interceptors?**
- Functions that run before every request/response
- Modify requests automatically
- Add global error handling

**Line 8**: `API.interceptors.request.use()` - Register request interceptor

**Line 9**: `(config) =>` - Function receives request config

**Line 10**: `localStorage.getItem('token')` - Get JWT token from storage

**Line 11-12**: Add Authorization header if token exists
- `config.headers.Authorization` - Set header
- `Bearer ${token}` - JWT standard format

**Line 13**: Return modified config (required!)

**Complete Flow**:
```javascript
// 1. User logs in
const { data } = await API.post('/auth/login', { email, password });
localStorage.setItem('token', data.token); // Save token

// 2. Later, make protected request
API.get('/projects'); // → Interceptor runs automatically

// 3. Interceptor adds header:
// Headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }

// 4. Backend receives request with token
// 5. Auth middleware verifies token
// 6. Request succeeds ✅
```

---

### **Line 15: Export**
```javascript
export default API;
```

**Usage in other files**:
```javascript
// In AuthContext.jsx
import API from '../utils/api';
const { data } = await API.post('/auth/login', credentials);

// In ProjectContext.jsx
import API from '../utils/api';
const { data } = await API.get('/projects');

// In TicketContext.jsx
import API from '../utils/api';
const { data } = await API.post('/tickets', ticketData);
```

---

## 🔄 Complete Request Flow

```
Component
    ↓ calls API.get('/projects')
API Instance
    ↓ triggers interceptor
Request Interceptor
    ↓ gets token from localStorage
    ↓ adds Authorization header
Modified Request
    ↓ sent to backend
Backend
    ↓ auth middleware verifies token
    ↓ returns data
Response
    ↓ back to component
Component Updates
```

---

## 🎯 Common Usage Examples

### **Login (No Token Needed)**
```javascript
const login = async (email, password) => {
  const { data } = await API.post('/auth/login', { email, password });
  localStorage.setItem('token', data.token); // Save for future requests
  return data;
};
```

### **Protected Request (Token Auto-Added)**
```javascript
const fetchProjects = async () => {
  const { data } = await API.get('/projects');
  // Interceptor automatically adds:
  // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  return data;
};
```

### **Create Resource**
```javascript
const createTicket = async (ticketData) => {
  const { data } = await API.post('/tickets', ticketData);
  // Token automatically included
  return data;
};
```

### **Update Resource**
```javascript
const updateTicket = async (id, updates) => {
  const { data } = await API.put(`/tickets/${id}`, updates);
  return data;
};
```

### **Delete Resource**
```javascript
const deleteTicket = async (id) => {
  await API.delete(`/tickets/${id}`);
};
```

---

## ⚠️ Common Issues & Solutions

### **Issue 1: 401 Unauthorized After Login**
```javascript
// WRONG - Token not saved
const { data } = await API.post('/auth/login', credentials);
// Forgot to save token!

// RIGHT - Save token immediately
const { data } = await API.post('/auth/login', credentials);
localStorage.setItem('token', data.token); ✅
```

### **Issue 2: Token Not Sent**
```javascript
// Check if token exists in localStorage
const token = localStorage.getItem('token');
console.log('Token:', token); // Should not be null

// Check network tab in DevTools
// Request Headers should have:
// Authorization: Bearer eyJhbGc...
```

### **Issue 3: CORS Errors**
```javascript
// Backend needs CORS configured
// In backend/server.js:
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
```

### **Issue 4: Wrong Base URL**
```javascript
// Check .env file
VITE_API_URL=http://localhost:5000/api

// Must start with VITE_ for Vite to expose it
// Restart dev server after changing .env
```

---

## 🔒 Security Considerations

### **1. Token Storage**
```javascript
// localStorage is vulnerable to XSS
// For higher security, consider httpOnly cookies
// But for this app, localStorage is acceptable with proper CSP headers
```

### **2. Token Expiration**
```javascript
// JWT expires in 30 days (set in backend)
// After expiration, user must login again
// Could add refresh token mechanism for better UX
```

### **3. Logout Cleanup**
```javascript
const logout = () => {
  localStorage.removeItem('token'); // Always clear token
  // Redirect to login
};
```

---

## 🧪 Testing

### **Test Token Injection**
```javascript
// In browser console
localStorage.setItem('token', 'test-token');
API.get('/auth/me')
  .then(res => console.log('Success:', res))
  .catch(err => console.log('Error:', err));

// Check Network tab → Request Headers
// Should see: Authorization: Bearer test-token
```

### **Test Without Token**
```javascript
localStorage.removeItem('token');
API.get('/projects')
  .catch(err => {
    console.log(err.response.status); // 401
    console.log(err.response.data.message); // "No token provided"
  });
```

---

## 📊 Environment Variables

### **.env.development**
```env
VITE_API_URL=http://localhost:5000/api
```

### **.env.production**
```env
VITE_API_URL=https://your-backend.render.com/api
```

### **How to Use**
```javascript
// Vite automatically loads correct .env based on mode
// Development: npm run dev → uses .env.development
// Production: npm run build → uses .env.production
```

---

## 🎓 Key Takeaways

1. **Axios instance** centralizes HTTP configuration
2. **Request interceptors** add token automatically
3. **Environment variables** manage URLs per environment
4. **Bearer token** is JWT authentication standard
5. **localStorage** stores token between sessions
6. **Interceptors run before every request** - no manual header setting needed

---

## 📚 Related Files

- [backend-middleware-auth.md](backend-middleware-auth.md) - Backend JWT verification
- [frontend-context-AuthContext.md](frontend-context-AuthContext.md) - Token management
- [frontend-context-ProjectContext.md](frontend-context-ProjectContext.md) - Uses API
- [frontend-context-TicketContext.md](frontend-context-TicketContext.md) - Uses API

---

*This file is the HTTP client foundation for all API calls!* 🌐
