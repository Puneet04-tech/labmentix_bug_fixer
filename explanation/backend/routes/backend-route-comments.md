# Backend Routes: comments.js - Line by Line Explanation

**Location**: `backend/routes/comments.js` | **Lines**: 28

## 📋 Overview

Comment routes with CRUD and ticket-specific queries. **All routes protected**.

**Routes:**
- `POST /api/comments` - Create comment
- `GET /api/comments/ticket/:ticketId` - Get comments for ticket
- `GET /api/comments/ticket/:ticketId/count` - Get comment count
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

---

## 🔍 Code Analysis

**Global Auth (Line 14):**
```javascript
router.use(auth);
```

**Create Comment (Line 17):**
```javascript
router.post('/', createComment);
```
Author is `req.user.id` from auth middleware.

**Ticket-Specific (Lines 20-21):**
```javascript
router.get('/ticket/:ticketId', getCommentsByTicket);
router.get('/ticket/:ticketId/count', getCommentCount);
```
Must come before `/:id` routes.

**Update/Delete (Lines 24-26):**
```javascript
router.route('/:id')
  .put(updateComment)
  .delete(deleteComment);
```
Controller checks authorization:
- **Update**: Only author can edit
- **Delete**: Author OR project owner can delete

---

## 🔗 Related Files
- [commentController.js](backend-controller-comment.md) - Authorization matrix
 - [commentController.js](backend-controller-comment.md) - Authorization matrix

---

## 📚 Technical Terms Glossary
- `router.use(auth)`: Ensures `req.user` is available for route handlers.
- `router.get('/ticket/:ticketId', ...)`: Ticket-scoped routes should be defined before `/:id` routes.

## 🧑‍💻 Important Import & Syntax Explanations
- Use `req.params.ticketId` for ticket-specific queries and `req.params.id` for comment-specific operations.
- Controller-level checks ensure only authors or project owners can delete comments.
