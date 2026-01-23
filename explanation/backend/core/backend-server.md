# Backend Server.js - Line by Line Explanation

## File: `backend/server.js`

This is the main entry point for the Express.js backend server. It sets up the server, middleware, routes, and error handling.

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

**Explanation:**
- **Line 1**: Imports Express.js framework for building the web server
- **Line 2**: Imports CORS middleware to enable Cross-Origin Resource Sharing (allows frontend to communicate with backend)
- **Line 3**: Imports Helmet.js for security headers (protects against common web vulnerabilities)
- **Line 4**: Imports dotenv to load environment variables from `.env` file
- **Line 5**: Imports custom database connection function from `config/db.js`

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
