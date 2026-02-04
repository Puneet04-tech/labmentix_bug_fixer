# 📚 LabMentix API Reference

## 🔐 Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "member",
  "registrationKey": "optional-admin-key"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

**Error Responses:**
- `400`: User already exists
- `400`: Invalid input data
- `500`: Server error

---

### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  }
}
```

**Error Responses:**
- `400`: Invalid credentials
- `500`: Server error

---

### GET /api/auth/me
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "member"
}
```

---

## 🏗️ Project Endpoints

### GET /api/projects
Get all projects for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "Project Alpha",
    "description": "Description of project",
    "owner": {
      "_id": "64a1b2c3d4e5f6789012346",
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "members": [
      {
        "user": {
          "_id": "64a1b2c3d4e5f6789012347",
          "name": "Bob Smith",
          "email": "bob@example.com"
        },
        "isOutsider": false,
        "addedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "status": "Active",
    "priority": "High",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

---

### POST /api/projects
Create a new project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "status": "Active",
  "priority": "High",
  "startDate": "2024-01-15",
  "endDate": "2024-03-15"
}
```

**Response (201):**
```json
{
  "_id": "64a1b2c3d4e5f6789012348",
  "name": "New Project",
  "description": "Project description",
  "owner": "64a1b2c3d4e5f6789012345",
  "members": [],
  "status": "Active",
  "priority": "High",
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

---

### GET /api/projects/:id
Get a single project by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "name": "Project Alpha",
  "description": "Description of project",
  "owner": {
    "_id": "64a1b2c3d4e5f6789012346",
    "name": "Jane Doe",
    "email": "jane@example.com"
  },
  "members": [
    {
      "user": {
        "_id": "64a1b2c3d4e5f6789012347",
        "name": "Bob Smith",
        "email": "bob@example.com"
      },
      "isOutsider": false,
      "addedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "status": "Active",
  "priority": "High",
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

---

### PUT /api/projects/:id
Update a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "Completed",
  "priority": "Medium"
}
```

**Response (200):**
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "Completed",
  "priority": "Medium"
}
```

---

### DELETE /api/projects/:id
Delete a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Project deleted successfully"
}
```

---

## 👥 Team Member Management

### POST /api/projects/:id/members
Add a member to a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "member@example.com",
  "name": "John Doe"
}
```

**Response (200):**
```json
{
  "message": "Member added successfully",
  "project": {
    "_id": "64a1b2c3d4e5f6789012345",
    "members": [
      {
        "user": {
          "_id": "64a1b2c3d4e5f6789012349",
          "name": "John Doe",
          "email": "member@example.com"
        },
        "isOutsider": false,
        "addedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

### DELETE /api/projects/:id/members/:memberId
Remove a member from a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Member removed successfully",
  "project": {
    "_id": "64a1b2c3d4e5f6789012345",
    "members": []
  }
}
```

---

## 🎫 Ticket Endpoints

### GET /api/tickets
Get all tickets for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `project`: Filter by project ID
- `status`: Filter by status
- `priority`: Filter by priority
- `assignedTo`: Filter by assigned user

**Response (200):**
```json
[
  {
    "_id": "64a1b2c3d4e5f678901234a",
    "title": "Bug in login page",
    "description": "Login button not working",
    "type": "Bug",
    "status": "Open",
    "priority": "High",
    "project": {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "Project Alpha"
    },
    "createdBy": {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "John Doe"
    },
    "assignedTo": {
      "_id": "64a1b2c3d4e5f6789012347",
      "name": "Bob Smith"
    },
    "attachments": [
      {
        "name": "screenshot.png",
        "size": 1024000,
        "type": "image/png",
        "url": "/uploads/screenshots/screenshot-123456.png",
        "filename": "screenshot-123456.png",
        "status": "uploaded"
      }
    ],
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

---

### POST /api/tickets
Create a new ticket.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Bug in login page",
  "description": "Login button not working",
  "type": "Bug",
  "priority": "High",
  "project": "64a1b2c3d4e5f6789012345",
  "assignedTo": "64a1b2c3d4e5f6789012347",
  "attachments": [
    {
      "name": "screenshot.png",
      "size": 1024000,
      "type": "image/png",
      "url": "/uploads/screenshots/screenshot-123456.png",
      "filename": "screenshot-123456.png",
      "status": "uploaded"
    }
  ]
}
```

**Response (201):**
```json
{
  "_id": "64a1b2c3d4e5f678901234b",
  "title": "Bug in login page",
  "description": "Login button not working",
  "type": "Bug",
  "status": "Open",
  "priority": "High",
  "project": "64a1b2c3d4e5f6789012345",
  "createdBy": "64a1b2c3d4e5f6789012345",
  "assignedTo": "64a1b2c3d4e5f6789012347",
  "attachments": [],
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

---

### GET /api/tickets/:id
Get a single ticket by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "64a1b2c3d4e5f678901234a",
  "title": "Bug in login page",
  "description": "Login button not working",
  "type": "Bug",
  "status": "Open",
  "priority": "High",
  "project": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "Project Alpha"
  },
  "createdBy": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "John Doe"
  },
  "assignedTo": {
    "_id": "64a1b2c3d4e5f6789012347",
    "name": "Bob Smith"
  },
  "attachments": [
    {
      "name": "screenshot.png",
      "size": 1024000,
      "type": "image/png",
      "url": "/uploads/screenshots/screenshot-123456.png",
      "filename": "screenshot-123456.png",
      "status": "uploaded"
    }
  ],
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

---

### PUT /api/tickets/:id
Update a ticket.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated ticket title",
  "description": "Updated description",
  "status": "In Progress",
  "priority": "Medium",
  "assignedTo": "64a1b2c3d4e5f6789012348"
}
```

**Response (200):**
```json
{
  "_id": "64a1b2c3d4e5f678901234a",
  "title": "Updated ticket title",
  "description": "Updated description",
  "status": "In Progress",
  "priority": "Medium"
}
```

---

### DELETE /api/tickets/:id
Delete a ticket.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Ticket deleted successfully"
}
```

---

## 📸 Screenshot/File Upload Endpoints

### POST /api/screenshots/upload
Upload a screenshot or file.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
screenshot: <file>
```

**Response (201):**
```json
{
  "message": "Screenshot uploaded successfully",
  "screenshotUrl": "/uploads/screenshots/screenshot-123456.png",
  "filename": "screenshot-123456.png",
  "originalName": "my-screenshot.png",
  "size": 1024000
}
```

**Error Responses:**
- `400`: No file provided
- `400`: Invalid file type
- `400`: File size exceeds limit
- `500`: Upload failed

---

### DELETE /api/screenshots/:filename
Delete a screenshot file.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Screenshot deleted successfully"
}
```

---

## 📊 Analytics Endpoints

### GET /api/analytics/overview
Get analytics overview data.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalTickets": 150,
  "openTickets": 45,
  "inProgressTickets": 30,
  "resolvedTickets": 75,
  "totalProjects": 12,
  "activeProjects": 8,
  "totalUsers": 25,
  "ticketsByType": {
    "Bug": 80,
    "Feature": 40,
    "Improvement": 30
  },
  "ticketsByPriority": {
    "Low": 30,
    "Medium": 60,
    "High": 45,
    "Critical": 15
  }
}
```

---

### GET /api/analytics/tickets
Get detailed ticket analytics.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `project`: Filter by project ID

**Response (200):**
```json
{
  "ticketsOverTime": [
    {
      "date": "2024-01-01",
      "created": 5,
      "resolved": 3
    },
    {
      "date": "2024-01-02",
      "created": 8,
      "resolved": 6
    }
  ],
  "averageResolutionTime": 3.5,
  "ticketsByStatus": {
    "Open": 45,
    "In Progress": 30,
    "In Review": 15,
    "Resolved": 60
  }
}
```

---

## 👥 User Management Endpoints

### GET /api/users/search
Search for users by email or name.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `q`: Search query

**Response (200):**
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012347",
    "name": "Bob Smith",
    "email": "bob@example.com",
    "role": "member"
  }
]
```

---

## 🔧 System Endpoints

### GET /api/health
Health check endpoint.

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "environment": "development"
}
```

---

## 🚨 Error Responses

All endpoints may return these common error responses:

### 400 Bad Request
```json
{
  "message": "Validation error details"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized to perform this action"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## 📝 Request/Response Examples

### Creating a Ticket with Attachments

**Request:**
```bash
curl -X POST http://localhost:5000/api/tickets \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Login button not working",
    "description": "The login button on the homepage is not responding to clicks",
    "type": "Bug",
    "priority": "High",
    "project": "64a1b2c3d4e5f6789012345",
    "assignedTo": "64a1b2c3d4e5f6789012347",
    "attachments": [
      {
        "name": "login-screenshot.png",
        "size": 2048000,
        "type": "image/png",
        "url": "/uploads/screenshots/login-screenshot-123456.png",
        "filename": "login-screenshot-123456.png",
        "status": "uploaded"
      }
    ]
  }'
```

**Response:**
```json
{
  "_id": "64a1b2c3d4e5f678901234c",
  "title": "Login button not working",
  "description": "The login button on the homepage is not responding to clicks",
  "type": "Bug",
  "status": "Open",
  "priority": "High",
  "project": "64a1b2c3d4e5f6789012345",
  "createdBy": "64a1b2c3d4e5f6789012345",
  "assignedTo": "64a1b2c3d4e5f6789012347",
  "attachments": [
    {
      "name": "login-screenshot.png",
      "size": 2048000,
      "type": "image/png",
      "url": "/uploads/screenshots/login-screenshot-123456.png",
      "filename": "login-screenshot-123456.png",
      "status": "uploaded"
    }
  ],
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

---

## 🔐 Authentication Flow

### 1. Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "member"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Use Token for Authenticated Requests
```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer <token-from-login>"
```

---

## 📊 Rate Limiting

Currently, there are no rate limits implemented, but in production:

- Authentication endpoints: 5 requests per minute
- File upload endpoints: 10 requests per minute
- General API endpoints: 100 requests per minute

---

## 🔄 Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Example:**
```bash
curl -X GET "http://localhost:5000/api/tickets?page=2&limit=10" \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "tickets": [...],
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

---

## 🧪 Testing the API

### Using Postman
1. Import the collection (if available)
2. Set environment variables:
   - `baseUrl`: http://localhost:5000
   - `token`: Your JWT token

### Using curl
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- All IDs are MongoDB ObjectId strings
- File uploads are stored in `/uploads/screenshots/`
- JWT tokens expire after 30 days
- Admin registration key: `admin-secret-key-123`

---

**🎉 This API reference covers all endpoints available in LabMentix Bug Fixer v2.0.0**
