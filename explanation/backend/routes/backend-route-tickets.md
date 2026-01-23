# Backend Routes: tickets.js - Line by Line Explanation

**Location**: `backend/routes/tickets.js` | **Lines**: 33

## 📋 Overview

Ticket routes with CRUD, filtering, and assignment. **All routes protected**.

**Routes:**
- `GET /api/tickets` - List tickets (with query filters)
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/project/:projectId` - Get tickets for project
- `GET /api/tickets/:id` - Get single ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket
- `PUT /api/tickets/:id/assign` - Assign ticket to user

---

## 🔍 Code Analysis

**Global Auth (Line 16):**
```javascript
router.use(auth);
```

**Route Chaining (Lines 19-21):**
```javascript
router.route('/')
  .get(getTickets)
  .post(createTicket);
```
Same path, different HTTP methods.

**Project-Specific (Line 24):**
```javascript
router.get('/project/:projectId', getTicketsByProject);
```
Must come **before** `/:id` to avoid treating "project" as an ID.

**Single Ticket (Lines 27-30):**
```javascript
router.route('/:id')
  .get(getTicket)
  .put(updateTicket)
  .delete(deleteTicket);
```

**Assignment (Line 33):**
```javascript
router.put('/:id/assign', assignTicket);
```
Separate endpoint for assigning tickets (has different authorization logic).

---

## 🔗 Related Files
- [ticketController.js](backend-controller-ticket.md) - Filtering + authorization
 - [ticketController.js](backend-controller-ticket.md) - Filtering + authorization

---

## 📚 Technical Terms Glossary
- `router.use(auth)`: Apply auth middleware to all routes defined after this line.
- `router.route('/path').get(...).post(...)`: Route chaining to handle multiple HTTP methods for same path.

## 🧑‍💻 Important Import & Syntax Explanations
- Route order matters: define `router.get('/project/:projectId')` before `router.get('/:id')` to avoid conflicts.
- `router.put('/:id/assign', assignTicket)`: Separate endpoints for specialized actions (assignment) keep controllers focused.
