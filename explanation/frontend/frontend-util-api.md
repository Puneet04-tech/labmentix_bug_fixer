# api.js - Frontend Utility Line-by-Line Explanation

## Overview
Axios instance configuration with automatic JWT token injection for all API requests via request interceptor.

## Key Features
- Centralized API base URL configuration
- Automatic Bearer token injection
- Environment variable support
- Token from localStorage

---

### Technical Terms Glossary

- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **Instance**: Custom axios object with default config (baseURL, headers, etc).
- **Interceptor**: Function that runs before a request or after a response.
- **JWT (JSON Web Token)**: Token format for authentication.
- **localStorage**: Browser storage for key-value pairs (persists after reload).
- **Environment Variable**: Value set outside code, e.g., in .env file.
- **Vite**: Frontend build tool that exposes env variables with VITE_ prefix.

---

## 🧑‍💻 Important Code Explanations

### Import Statement
```javascript
import axios from 'axios';
```
- `import ... from ...`: ES6 module import syntax.
- `axios`: HTTP client for making API requests.

### Axios Instance
```javascript
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});
```
- `axios.create({...})`: Creates a custom axios instance.
- `baseURL`: Prefix for all API requests.
- `import.meta.env.VITE_API_URL`: Reads env variable from Vite config.
- `||`: Fallback to localhost if env not set.

### Request Interceptor
```javascript
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
- `interceptors.request.use(...)`: Runs before every request.
- `localStorage.getItem('token')`: Gets JWT token from browser storage.
- `config.headers.Authorization`: Sets Authorization header for JWT auth.
- ``Bearer ${token}``: Format required by backend.

### Export
```javascript
export default API;
```
- `export default`: Makes API available to other files.

## Line-by-Line Analysis

### Lines 1-2: Import
```javascript
import axios from 'axios';
```
- **axios**: HTTP client library for making API requests

### Lines 4-6: Create Axios Instance
```javascript
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});
```
- **axios.create()**: Create custom axios instance with default config
- **baseURL**: All requests will be prefixed with this URL
- **import.meta.env.VITE_API_URL**: Vite environment variable
  - Read from `.env` file: `VITE_API_URL=https://api.example.com/api`
  - Vite requires `VITE_` prefix for client-side variables
- **Fallback**: `'http://localhost:5000/api'` if env var not set
- **Why baseURL**: Avoid repeating full URL in every request
  - Instead of: `axios.get('http://localhost:5000/api/tickets')`
  - Can use: `API.get('/tickets')`

### Lines 8-15: Request Interceptor (CRITICAL)
```javascript
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
- **interceptors.request.use()**: Runs before EVERY request
- **config parameter**: Request configuration object
- **localStorage.getItem('token')**: Get JWT token from browser storage
  - Token stored by AuthContext on login
- **if (token)**: Only add header if token exists (not on login/register)
- **config.headers.Authorization**: Set Authorization header
- **`Bearer ${token}`**: Format required by backend JWT middleware
  - "Bearer" is the authentication scheme
  - Space + token value
- **return config**: Must return config for request to proceed

### Line 17: Export
```javascript
export default API;
```
- **Export API instance**: Used throughout app for all API calls

## Related Files
- **AuthContext.jsx**: Stores token on login, clears on logout
- **ProjectContext.jsx**: Uses API.get(), API.post(), etc.
- **TicketContext.jsx**: Uses API for ticket operations
- **All contexts**: Import and use this API instance

## Usage Examples

### Login Request (No Token)
```javascript
// AuthContext.jsx
const response = await API.post('/auth/login', { email, password });
```
- **Interceptor runs**: Checks localStorage
- **No token**: Authorization header not added (login doesn't need token)
- **Request**: `POST http://localhost:5000/api/auth/login`

### Fetch Projects (With Token)
```javascript
// ProjectContext.jsx
const response = await API.get('/projects');
```
- **Interceptor runs**: Checks localStorage
- **Token found**: `localStorage.getItem('token')` → 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
- **Header added**: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Request**: `GET http://localhost:5000/api/projects` with auth header
- **Backend**: Verifies token in auth middleware

## Interceptor Flow

```
User calls API.get('/projects')
         ↓
  Interceptor runs
         ↓
  Get token from localStorage
         ↓
    Token exists?
   ┌─────┴─────┐
   YES          NO
   │            │
   Add header   Skip
   │            │
   └─────┬──────┘
         ↓
  Return config
         ↓
Request sent to backend with/without auth header
```

## Environment Variables

**.env file (development)**:
```env
VITE_API_URL=http://localhost:5000/api
```

**.env.production (production)**:
```env
VITE_API_URL=https://api.bugtracker.com/api
```

**Vite automatically loads** the correct .env file based on mode:
- `npm run dev` → `.env` or `.env.development`
- `npm run build` → `.env.production`

## Why Interceptor vs Manual Headers?

**Without interceptor (manual headers)**:
```javascript
// BAD - Repeated code everywhere
const token = localStorage.getItem('token');
const response = await axios.get('http://localhost:5000/api/projects', {
  headers: { Authorization: `Bearer ${token}` }
});
```
- **Problems**:
  - Repeated code in every request
  - Easy to forget
  - Hard to update (change token location, change 50 files)

**With interceptor (current approach)**:
```javascript
// GOOD - Centralized logic
const response = await API.get('/projects');
```
- **Benefits**:
  - Clean, simple requests
  - Automatic token injection
  - Single source of truth (api.js)
  - Easy to update (change one file)

## Token Format

**Authorization Header**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTlkNGYxZjJhYTQ1MDEyYzNiNGU2NyIsImlhdCI6MTczOTQzMTYzMywiZXhwIjoxNzQyMDIzNjMzfQ.K9pJ7iM3vR8sL2nF4hW6xD1cT0yZ5qE9uX7pG3kA2sV
```

**Parts**:
1. **Scheme**: "Bearer" (fixed string)
2. **Space**: " " (separator)
3. **Token**: JWT string (header.payload.signature)

**Backend reads**:
```javascript
// backend/middleware/auth.js
const authHeader = req.headers.authorization;
const token = authHeader.split(' ')[1]; // Get token after "Bearer "
```

## Security Considerations

1. **Token in localStorage**:
   - **Pro**: Persists across page reloads
   - **Con**: Vulnerable to XSS attacks
   - **Mitigation**: Sanitize user input, use Content Security Policy

2. **Token in Request Interceptor**:
   - **Pro**: Automatic, consistent
   - **Con**: All requests include token (even public ones)
   - **Mitigation**: Backend ignores token on public routes

3. **Token Expiration**:
   - **Current**: 30-day expiration
   - **Improvement**: Implement refresh token rotation

## Alternative Approaches

**Option 1: httpOnly Cookies**
```javascript
// No interceptor needed
// Backend sets: res.cookie('token', jwt, { httpOnly: true })
// Browser automatically sends cookie with requests
```
- **Pro**: Safer from XSS (JS can't access)
- **Con**: Vulnerable to CSRF, need CSRF tokens

**Option 2: Response Interceptor (Token Refresh)**
```javascript
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      const newToken = await refreshToken();
      // Retry original request with new token
    }
    return Promise.reject(error);
  }
);
```
- **Auto-refresh**: Detect 401, refresh token, retry request
- **Better UX**: No forced logout on token expiration

## Export Pattern
```javascript
export default API;
```

**Usage in other files**:
```javascript
import API from '../utils/api';
```

**Not a named export**:
```javascript
// WRONG
import { API } from '../utils/api';
```

## baseURL Concatenation

| baseURL | Request Path | Final URL |
|---------|--------------|-----------|
| http://localhost:5000/api | /projects | http://localhost:5000/api/projects |
| http://localhost:5000/api | /tickets/123 | http://localhost:5000/api/tickets/123 |
| https://api.example.com/api | /auth/login | https://api.example.com/api/auth/login |

**Important**: No trailing slash in baseURL, leading slash in request path
