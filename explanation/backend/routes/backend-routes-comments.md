# Backend Routes: comments.js - Complete Explanation

Express router for comment CRUD operations.

## 📋 Overview
- **Lines**: 28
- **Routes**: 5 (all protected)
- **Features**: CRUD operations, ticket-specific queries, comment count

---

## 🔑 Complete Code

```javascript
const express = require('express');
const router = express.Router();
const {
  getCommentsByTicket,
  createComment,
  updateComment,
  deleteComment,
  getCommentCount
} = require('../controllers/commentController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Comment CRUD routes
router.post('/', createComment);

// Ticket-specific comments
router.get('/ticket/:ticketId', getCommentsByTicket);
router.get('/ticket/:ticketId/count', getCommentCount);

// Single comment routes
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

module.exports = router;
```

---

## 📍 Route Definitions

### **1. POST /api/comments** (Line 16)
```javascript
router.post('/', createComment);
```
- **Purpose**: Create new comment on a ticket
- **Body**: `{ content, ticket }`
- **Authorization**: Must have access to ticket's project
- **Response**: Created comment with populated author (201)

---

### **2. GET /api/comments/ticket/:ticketId** (Line 19)
```javascript
router.get('/ticket/:ticketId', getCommentsByTicket);
```
- **Purpose**: Get all comments for a ticket
- **Params**: `ticketId` - Ticket ID
- **Authorization**: Must have access to ticket's project
- **Response**: Array of comments sorted chronologically (oldest first)

---

### **3. GET /api/comments/ticket/:ticketId/count** (Line 20)
```javascript
router.get('/ticket/:ticketId/count', getCommentCount);
```
- **Purpose**: Get comment count for a ticket
- **Params**: `ticketId` - Ticket ID
- **Response**: `{ count: number }`
- **Use case**: Display "5 comments" without fetching all comments

---

### **4. PUT /api/comments/:id** (Line 23)
```javascript
router.put('/:id', updateComment);
```
- **Purpose**: Update comment content
- **Params**: `id` - Comment ID
- **Body**: `{ content }`
- **Authorization**: Must be comment author
- **Response**: Updated comment with populated author

---

### **5. DELETE /api/comments/:id** (Line 24)
```javascript
router.delete('/:id', deleteComment);
```
- **Purpose**: Delete comment
- **Params**: `id` - Comment ID
- **Authorization**: Must be comment author OR project owner
- **Response**: Success message with deleted ID

---

## 🔄 Route Organization

### Ticket-Specific Routes First
```javascript
router.get('/ticket/:ticketId', getCommentsByTicket);
router.get('/ticket/:ticketId/count', getCommentCount);
```
**Must come before** `/:id` routes to avoid conflicts

### Comment-Specific Routes After
```javascript
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);
```
Generic `:id` parameter routes come last

---

## 🎯 Usage Examples

### 1. Create Comment
```javascript
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is a critical bug that needs immediate attention",
  "ticket": "ticket123"
}

Response (201):
{
  "_id": "comment1",
  "content": "This is a critical bug that needs immediate attention",
  "ticket": "ticket123",
  "author": {
    "_id": "user456",
    "name": "Alice",
    "email": "alice@example.com"
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Get Comments Thread
```javascript
GET /api/comments/ticket/ticket123
Authorization: Bearer <token>

Response:
[
  {
    "_id": "comment1",
    "content": "Found the bug in login.js",
    "author": { "name": "Alice", "email": "alice@example.com" },
    "createdAt": "2024-01-15T10:00:00.000Z"
  },
  {
    "_id": "comment2",
    "content": "I'll fix it in the next sprint",
    "author": { "name": "Bob", "email": "bob@example.com" },
    "createdAt": "2024-01-15T10:15:00.000Z"
  },
  {
    "_id": "comment3",
    "content": "Fixed in commit abc123",
    "author": { "name": "Bob", "email": "bob@example.com" },
    "createdAt": "2024-01-15T14:30:00.000Z"
  }
]
```

### 3. Get Comment Count
```javascript
GET /api/comments/ticket/ticket123/count
Authorization: Bearer <token>

Response:
{
  "count": 15
}
```

### 4. Update Comment (Author Only)
```javascript
PUT /api/comments/comment1
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated: Fixed in v2.2.0"
}

Response:
{
  "_id": "comment1",
  "content": "Updated: Fixed in v2.2.0",
  "author": { "name": "Alice", "email": "alice@example.com" },
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T15:00:00.000Z"
}
```

### 5. Update Comment (Not Author)
```javascript
PUT /api/comments/comment1
Authorization: Bearer <token_of_different_user>
Content-Type: application/json

{
  "content": "Trying to edit"
}

Response (403):
{
  "message": "Not authorized to edit this comment"
}
```

### 6. Delete Comment (As Author)
```javascript
DELETE /api/comments/comment1
Authorization: Bearer <token>

Response:
{
  "message": "Comment deleted successfully",
  "id": "comment1"
}
```

### 7. Delete Comment (As Project Owner)
```javascript
// User owns project but didn't write comment
DELETE /api/comments/comment2
Authorization: Bearer <project_owner_token>

Response:
{
  "message": "Comment deleted successfully",
  "id": "comment2"
}
```

### 8. Delete Comment (Not Authorized)
```javascript
// User is not author and doesn't own project
DELETE /api/comments/comment3
Authorization: Bearer <random_user_token>

Response (403):
{
  "message": "Not authorized to delete this comment"
}
```

---

## 🔒 Authorization Summary

```
Operation | Comment Author | Project Owner | Project Member | Other
----------|----------------|---------------|----------------|-------
Create    |       ✅       |      ✅       |       ✅       |  ❌
Read      |       ✅       |      ✅       |       ✅       |  ❌
Update    |       ✅       |      ❌       |       ❌       |  ❌
Delete    |       ✅       |      ✅       |       ❌       |  ❌
```

**Key Points**:
- **Create/Read**: Any project member
- **Update**: Author only (preserve authenticity)
- **Delete**: Author OR project owner (moderation)

---

## 📚 Related Files
- [backend-controllers-comment.md](backend-controllers-comment.md) - Controller logic
- [backend-models-Comment.md](backend-models-Comment.md) - Comment schema
- [frontend-components-CommentSection.md](frontend-components-CommentSection.md) - Comment UI
- [backend-models-Ticket.md](backend-models-Ticket.md) - Ticket relationship
