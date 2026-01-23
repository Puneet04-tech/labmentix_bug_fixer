# Backend Routes: tickets.js - Complete Explanation

Express router for ticket CRUD, filtering, and assignment.

## 📋 Overview
- **Lines**: 35
- **Routes**: 7 (all protected)
- **Features**: CRUD, filtering, assignment, project-specific queries

---

## 🔑 Complete Code

```javascript
const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketsByProject,
  assignTicket
} = require('../controllers/ticketController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Ticket CRUD routes
router.route('/')
  .get(getTickets)
  .post(createTicket);

// Project-specific tickets
router.get('/project/:projectId', getTicketsByProject);

// Single ticket routes
router.route('/:id')
  .get(getTicket)
  .put(updateTicket)
  .delete(deleteTicket);

// Assign ticket
router.put('/:id/assign', assignTicket);

module.exports = router;
```

---

## 🎯 Route Chaining Pattern

### Lines 19-21: Using .route()
```javascript
router.route('/')
  .get(getTickets)
  .post(createTicket);
```
**Benefit**: Cleaner syntax for same path with different methods
**Equivalent to**:
```javascript
router.get('/', getTickets);
router.post('/', createTicket);
```

---

## 📍 Route Definitions

### **1. GET /api/tickets** (Line 20)
```javascript
.get(getTickets)
```
- **Purpose**: Get all tickets with optional filters
- **Query params**: 
  - `project` - Filter by project ID
  - `status` - Filter by status (Open, In Progress, etc.)
  - `priority` - Filter by priority (Low, Medium, High, Critical)
  - `assignedTo` - Filter by assigned user ID
  - `search` - Search in title/description
- **Response**: Array of tickets

**Example queries**:
```
GET /api/tickets
GET /api/tickets?status=Open
GET /api/tickets?status=Open&priority=High
GET /api/tickets?search=login bug
```

---

### **2. POST /api/tickets** (Line 21)
```javascript
.post(createTicket)
```
- **Purpose**: Create new ticket
- **Body**: `{ title, description, type?, status?, priority?, project, assignedTo?, dueDate? }`
- **Response**: Created ticket (201)

---

### **3. GET /api/tickets/project/:projectId** (Line 24)
```javascript
router.get('/project/:projectId', getTicketsByProject);
```
- **Purpose**: Get all tickets for specific project
- **Params**: `projectId` - Project ID
- **Authorization**: Must be project owner or member
- **Response**: Array of project's tickets

**Important**: This must come BEFORE `/:id` route, otherwise "project" would be treated as an ID!

---

### **4. GET /api/tickets/:id** (Line 27)
```javascript
router.route('/:id')
  .get(getTicket)
```
- **Purpose**: Get single ticket details
- **Params**: `id` - Ticket ID
- **Authorization**: Must have access to ticket's project
- **Response**: Ticket with populated fields

---

### **5. PUT /api/tickets/:id** (Line 28)
```javascript
  .put(updateTicket)
```
- **Purpose**: Update ticket
- **Params**: `id` - Ticket ID
- **Body**: Any ticket fields to update
- **Authorization**: Must be project owner or member
- **Response**: Updated ticket

---

### **6. DELETE /api/tickets/:id** (Line 29)
```javascript
  .delete(deleteTicket)
```
- **Purpose**: Delete ticket
- **Params**: `id` - Ticket ID
- **Authorization**: Must be project owner OR ticket reporter
- **Response**: Success message with deleted ID

---

### **7. PUT /api/tickets/:id/assign** (Line 32)
```javascript
router.put('/:id/assign', assignTicket);
```
- **Purpose**: Assign ticket to user (or unassign)
- **Params**: `id` - Ticket ID
- **Body**: `{ userId }` (null to unassign)
- **Authorization**: Must be project owner or member
- **Response**: Updated ticket

**Note**: This must come AFTER `/:id` routes because it's more specific

---

## 🔄 Route Ordering Matters!

```javascript
// Correct order:
router.get('/project/:projectId', getTicketsByProject);  // Specific path first
router.route('/:id')                                      // Generic param second
  .get(getTicket);

// Wrong order:
router.route('/:id')                                      // Would match "/project" as ID!
  .get(getTicket);
router.get('/project/:projectId', getTicketsByProject);  // Never reached
```

**If reversed**: `GET /api/tickets/project/abc123` would match `/:id` route with `id="project"`

---

## 🎯 Usage Examples

### 1. Get All Tickets
```javascript
GET /api/tickets
Authorization: Bearer <token>

Response:
[
  {
    "_id": "ticket1",
    "title": "Login bug",
    "status": "Open",
    "priority": "High",
    "project": { "name": "Bug Tracker" },
    "assignedTo": { "name": "Bob" }
  }
]
```

### 2. Get Filtered Tickets
```javascript
GET /api/tickets?status=Open&priority=High
Authorization: Bearer <token>

Response:
[...open high priority tickets...]
```

### 3. Search Tickets
```javascript
GET /api/tickets?search=login
Authorization: Bearer <token>

Response:
[...tickets with "login" in title or description...]
```

### 4. Create Ticket
```javascript
POST /api/tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Login button not working",
  "description": "Button doesn't respond to clicks",
  "project": "proj1",
  "priority": "High"
}

Response (201):
{
  "_id": "ticket2",
  "title": "Login button not working",
  "status": "Open",
  "priority": "High",
  ...
}
```

### 5. Get Tickets by Project
```javascript
GET /api/tickets/project/proj1
Authorization: Bearer <token>

Response:
[...all tickets in project proj1...]
```

### 6. Get Single Ticket
```javascript
GET /api/tickets/ticket1
Authorization: Bearer <token>

Response:
{
  "_id": "ticket1",
  "title": "Login bug",
  "description": "Details...",
  "project": {...},
  "assignedTo": {...}
}
```

### 7. Update Ticket
```javascript
PUT /api/tickets/ticket1
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress",
  "priority": "Critical"
}

Response:
{
  "_id": "ticket1",
  "status": "In Progress",
  "priority": "Critical",
  ...
}
```

### 8. Delete Ticket
```javascript
DELETE /api/tickets/ticket1
Authorization: Bearer <token>

Response:
{
  "message": "Ticket deleted successfully",
  "id": "ticket1"
}
```

### 9. Assign Ticket
```javascript
PUT /api/tickets/ticket1/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user123"
}

Response:
{
  "_id": "ticket1",
  "assignedTo": {
    "_id": "user123",
    "name": "Bob",
    "email": "bob@example.com"
  }
}
```

### 10. Unassign Ticket
```javascript
PUT /api/tickets/ticket1/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": null
}

Response:
{
  "_id": "ticket1",
  "assignedTo": null
}
```

---

## 📚 Related Files
- [backend-controllers-ticket.md](backend-controllers-ticket.md) - Controller logic
- [backend-models-Ticket.md](backend-models-Ticket.md) - Ticket schema
- [frontend-context-TicketContext.md](frontend-context-TicketContext.md) - Frontend integration
