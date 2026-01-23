# Backend Server.js - Line by Line Explanation

## File: `backend/server.js`

This is the main entry point for the Express.js backend server. It sets up the server, middleware, routes, and error handling.

---

## 📚 Technical Terms Glossary

- **Express.js**: Minimal, unopinionated web framework for Node.js. Handles routing, middleware, and HTTP utilities.
- **CORS (Cross-Origin Resource Sharing)**: Security feature that allows or blocks requests from different origins (domains/ports).
- **Helmet**: Express middleware that sets HTTP headers for security (prevents XSS, clickjacking, etc).
- **dotenv**: Loads environment variables from a `.env` file into `process.env`.
- **Middleware**: Functions that run during the request/response cycle, can modify req/res or end the cycle.
- **Route**: URL pattern and HTTP method (GET, POST, etc) handled by the server.
- **HTTP Status Codes**: Numbers indicating result of HTTP request (200=OK, 404=Not Found, 500=Server Error).
- **Module.exports/require()**: Node.js module system for importing/exporting code.

---

## 🧑‍💻 Important Code Explanations

### Import Statements
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
```
- `const ... = require('...')`: Node.js CommonJS import. Loads a package or file.
- `express`: Main web server framework. Handles routes, middleware, and server startup.
- `cors`: Middleware to allow cross-origin requests (frontend <-> backend communication).
- `helmet`: Middleware to set secure HTTP headers.
- `dotenv`: Loads environment variables from `.env` file.
- `connectDB`: Custom function to connect to MongoDB (see backend-config-db.md).

### Middleware Example
```javascript
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```
- `app.use(...)`: Registers middleware to run for every request.
- `helmet()`: Adds security headers.
- `cors()`: Enables cross-origin requests.
- `express.json()`: Parses JSON request bodies.
- `express.urlencoded({ extended: true })`: Parses URL-encoded form data.

### Route Example
```javascript
app.get('/', (req, res) => {
  res.json({ message: 'Bug Tracker API is running!' });
});
```
- `app.get(path, handler)`: Defines a GET route.
- `req`: Request object (info about HTTP request).
- `res`: Response object (methods to send data back).
- `res.json(...)`: Sends JSON response.

### Server Startup
```javascript
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
- `app.listen(port, callback)`: Starts the server.
- `PORT`: Port number (from env or default).
- `console.log(...)`: Prints message to terminal.

---

## Line-by-Line Breakdown

### Lines 1-5: Import Dependencies
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
```

**Line 1: Import Express.js**
```javascript
const express = require('express');
```
-**`const`**: Constant variable (cannot be reassigned)
- **`express`**: Variable name (lowercase convention for modules)
- **`require('express')`**: CommonJS import from node_modules
- **Express.js**: Web application framework for Node.js

**What is Express.js?**
- Minimal, flexible Node.js web framework
- Provides robust features for web and mobile applications
- Standard for building REST APIs
- Simplifies HTTP server creation

**What Express provides:**
```javascript
// Without Express (raw Node.js) - Complex!
const http = require('http');
http.createServer((req, res) => {
  if (req.url === '/api/users' && req.method === 'GET') {
    // Handle request manually
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({users: []}));
  }
}).listen(5000);

// With Express - Simple!
const app = express();
app.get('/api/users', (req, res) => {
  res.json({users: []});
});
app.listen(5000);
```

**Line 2: Import CORS Middleware**
```javascript
const cors = require('cors');
```
- **CORS**: Cross-Origin Resource Sharing
- **Purpose**: Allow frontend (different origin) to access backend API
- **Problem it solves**: Browser security blocks cross-origin requests by default

**What is Cross-Origin?**
```javascript
// Same Origin (✅ Allowed by default)
Frontend: http://localhost:3000
Backend:  http://localhost:3000

// Different Origin (❌ Blocked without CORS)
Frontend: http://localhost:3000  // Port 3000
Backend:  http://localhost:5000  // Port 5000 (different!)

// Also different origins:
http vs https
domain.com vs api.domain.com
domain.com vs another.com
```

**How CORS works:**
```javascript
// Request from frontend
fetch('http://localhost:5000/api/users')

// Without cors() middleware:
// ❌ Error: CORS policy: No 'Access-Control-Allow-Origin' header

// With app.use(cors()):
// ✅ Backend adds header: Access-Control-Allow-Origin: *
// ✅ Browser allows the request
```

**Line 3: Import Helmet**
```javascript
const helmet = require('helmet');
```
- **Helmet**: Security middleware for Express apps
- **Purpose**: Sets HTTP headers to protect against common web vulnerabilities
- **Security headers**: XSS Protection, Click-jacking, MIME sniffing, etc.

**Headers Helmet sets:**
```javascript
// Without helmet
Response Headers:
  Content-Type: application/json
  
// With helmet()
Response Headers:
  Content-Security-Policy: default-src 'self'
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN  
  X-XSS-Protection: 1; mode=block
  Strict-Transport-Security: max-age=15552000
```

**Vulnerabilities Helmet prevents:**
1. **XSS (Cross-Site Scripting)**: Malicious scripts injection
2. **Clickjacking**: Invisible iframe overlays
3. **MIME Sniffing**: Browser guessing content types
4. **Downgrade Attacks**: Force HTTPS connections

**Line 4: Import dotenv**
```javascript
const dotenv = require('dotenv');
```
- **dotenv**: Loads environment variables from `.env` file
- **Purpose**: Keep secrets out of code (passwords, API keys, etc.)
- **Usage**: Must call `dotenv.config()` to load variables

**How dotenv works:**
```javascript
// .env file content:
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.net/db
JWT_SECRET=mysecret123

// After dotenv.config():
process.env.PORT           // "5000"
process.env.MONGODB_URI    // "mongodb+srv://..."
process.env.JWT_SECRET     // "mysecret123"

// Without dotenv:
process.env.PORT           // undefined (unless set in system)
```

**Why use .env files?**
1. **Security**: Secrets not in code/git
2. **Flexibility**: Different values per environment
   ```
   development.env: MONGODB_URI=mongodb://localhost/dev
   production.env:  MONGODB_URI=mongodb+srv://prod...
   ```
3. **Team**: Each developer has own .env (not shared)
4. **Deployment**: Platform provides env variables

**Line 5: Import Database Connection**
```javascript
const connectDB = require('./config/db');
```
- **`'./config/db'`**: Relative path (`./ = current directory`)
- **Local module**: Our own file (not from node_modules)
- **Default import**: Gets `module.exports` from db.js

**Path Resolution:**
```javascript
// Starts with ./ or ../ → relative path
require('./config/db')      // ./config/db.js
require('../models/User')    // ../models/User.js

// No prefix → node_modules package
require('express')           // node_modules/express
require('mongoose')          // node_modules/mongoose

// Absolute path (rare)
require('/home/user/app/db') // Absolute file path
```

---

### Lines 7-8: Load Environment Variables
```javascript
// Load environment variables
dotenv.config();
```

**Explanation:**
- **Line 8**: Calls `dotenv.config()` to read the `.env` file and load variables like `MONGODB_URI`, `JWT_SECRET`, and `PORT` into `process.env`
- This must be called before accessing any environment variables

---

### Lines 10-11: Connect to Database
```javascript
// Connect to MongoDB
connectDB();
```

**Explanation:**
- **Line 11**: Calls the `connectDB()` function to establish connection with MongoDB
- This is an async function that connects to MongoDB Atlas using Mongoose
- Connection happens immediately when server starts

---

### Line 13: Initialize Express App
```javascript
const app = express();
```

**Explanation:**
- Creates an Express application instance
- This `app` object will be used to configure middleware, routes, and start the server

---

### Lines 15-19: Configure Middleware
```javascript
// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

**Explanation:**
- **Line 16**: `helmet()` - Adds security HTTP headers to protect against vulnerabilities like XSS, clickjacking, etc.
- **Line 17**: `cors()` - Enables Cross-Origin Resource Sharing, allowing frontend (localhost:3000) to make requests to backend (localhost:5000)
- **Line 18**: `express.json()` - Parses incoming JSON request bodies (e.g., from POST/PUT requests)
- **Line 19**: `express.urlencoded({ extended: true })` - Parses URL-encoded data (form submissions)

**Note**: Middleware runs in order for every request before reaching route handlers

---

### Lines 21-24: Root Route (Test Endpoint)
```javascript
// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Bug Tracker API is running!' });
});
```

**Explanation:**
- **Line 22**: Defines a GET route for the root path `/`
- **Line 23**: Sends a JSON response confirming the API is running
- **Purpose**: Quick way to test if the server is online
- **Example**: Visit `http://localhost:5000/` in browser to see this message

---

### Lines 26-33: Health Check Endpoint
```javascript
// Health check endpoint for deployment platforms
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});
```

**Explanation:**
- **Line 27**: Defines GET route at `/api/health`
- **Line 28-32**: Returns JSON response with:
  - `status: 'healthy'` - Indicates server is running
  - `timestamp` - Current time in ISO format
  - `environment` - Shows if running in development or production
- **Purpose**: Used by deployment platforms (like Render) to monitor server health
- **Example Response**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-01-23T10:30:00.000Z",
    "environment": "production"
  }
  ```

---

### Lines 35-40: API Routes
```javascript
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/analytics', require('./routes/analytics'));
```

**Explanation:**
- **Line 36**: Mounts authentication routes at `/api/auth` (login, register, get user)
- **Line 37**: Mounts project routes at `/api/projects` (CRUD operations for projects)
- **Line 38**: Mounts ticket routes at `/api/tickets` (CRUD operations for tickets)
- **Line 39**: Mounts comment routes at `/api/comments` (CRUD operations for comments)
- **Line 40**: Mounts analytics routes at `/api/analytics` (dashboard statistics)

**How it works**:
- Each `require()` imports a router from the routes folder
- `app.use()` mounts the router at the specified base path
- All routes in that router will be prefixed with the base path

**Example**:
- If `routes/auth.js` has a route `POST /login`
- It becomes accessible as `POST /api/auth/login`

---

### Lines 42-49: Error Handling Middleware
```javascript
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});
```

**Explanation:**
- **Line 43**: Error-handling middleware with 4 parameters (err, req, res, next)
- **Line 44**: Logs the error stack trace to console for debugging
- **Line 45-48**: Sends 500 (Internal Server Error) response with:
  - Generic message: "Something went wrong!"
  - Error details: Only shown in development mode for security
- **Purpose**: Catches any unhandled errors from routes and prevents server crashes

**Security Note**: In production, detailed error messages are hidden to prevent exposing sensitive information

---

### Lines 51-56: Start Server
```javascript
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
```

**Explanation:**
- **Line 51**: Gets PORT from environment variable, defaults to 5000 if not set
- **Line 53**: Starts the Express server listening on the specified port
- **Line 54**: Logs a success message when server is ready
- **Output**: `🚀 Server is running on port 5000`

**What happens**:
1. Server binds to port 5000 (or PORT from .env)
2. Begins accepting HTTP requests
3. Routes and middleware are now active
4. Frontend can now make API calls to this server

---

## Server Startup Flow

1. ✅ Load environment variables (dotenv)
2. ✅ Connect to MongoDB (connectDB)
3. ✅ Initialize Express app
4. ✅ Configure security middleware (helmet)
5. ✅ Enable CORS for frontend communication
6. ✅ Parse JSON and URL-encoded data
7. ✅ Mount API routes
8. ✅ Set up error handling
9. ✅ Start listening on port 5000

---

## Key Concepts

### Middleware Chain
Requests flow through middleware in order:
```
Request → helmet → cors → json parser → routes → error handler → Response
```

### Route Mounting
Base paths are prefixed to all routes in a router:
```
/api/auth + /login = /api/auth/login
/api/projects + /:id = /api/projects/:id
```

### Environment Variables
Critical settings loaded from `.env`:
- `MONGODB_URI` - Database connection string
- `JWT_SECRET` - Token signing secret
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - development or production

---

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Test if API is running |
| GET | `/api/health` | Health check for monitoring |
| * | `/api/auth/*` | Authentication endpoints |
| * | `/api/projects/*` | Project management |
| * | `/api/tickets/*` | Ticket management |
| * | `/api/comments/*` | Comment management |
| * | `/api/analytics/*` | Analytics and statistics |

---

## Security Features

1. **Helmet.js**: Sets secure HTTP headers
2. **CORS**: Controlled cross-origin access
3. **JWT**: Token-based authentication
4. **Error Hiding**: Detailed errors only in development
5. **Input Parsing**: Safe parsing of JSON and form data

---

## Error Handling

Errors are caught and returned as JSON:
```json
{
  "message": "Something went wrong!",
  "error": "Detailed message (dev only)"
}
```

---

This file is the backbone of the backend - it orchestrates all server functionality!
