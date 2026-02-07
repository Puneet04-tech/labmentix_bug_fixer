# backend-route-comments.md

## Overview
The `comments.js` file defines routes for comment CRUD operations and ticket-specific queries.

## File Location
```
backend/routes/comments.js
```

## Dependencies - Detailed Import Analysis

```javascript
const express = require('express');
const {
  getCommentsByTicket,
  createComment,
  updateComment,
  deleteComment,
  getCommentCount
} = require('../controllers/commentController');
const auth = require('../middleware/auth');
```

### Import Statement Breakdown:
- **express**: Framework for creating router instance
- **commentController**: Controller functions for comment operations
- **auth**: Middleware for JWT token verification

## Ticket-Scoped Routes

```javascript
router.get('/ticket/:ticketId', getCommentsByTicket);
router.get('/ticket/:ticketId/count', getCommentCount);
```

**Syntax Pattern**: Routes for accessing comments by parent ticket relationship.

## Route Chaining for CRUD

```javascript
router.route('/:id')
  .put(updateComment)
  .delete(deleteComment);
```

**Syntax Pattern**: Grouping update and delete operations for same resource.

## Router Export

```javascript
module.exports = router;
```

**Syntax Pattern**: Exporting configured router for application mounting.

## Critical Code Patterns

### 1. Controller Function Destructuring
```javascript
const {
  getCommentsByTicket,
  createComment,
  updateComment,
  deleteComment,
  getCommentCount
} = require('../controllers/commentController');
```
**Pattern**: Importing multiple controller functions.

### 2. Global Authentication Protection
```javascript
router.use(auth);
```
**Pattern**: Protecting all routes with authentication middleware.

### 3. Hierarchical Route Structure
```javascript
router.get('/ticket/:ticketId', getCommentsByTicket);
router.get('/ticket/:ticketId/count', getCommentCount);
```
**Pattern**: Routes organized by parent-child relationships.

### 4. Route Order for Specificity
```javascript
router.get('/ticket/:ticketId', ...);  // More specific first
router.route('/:id').put(...);         // Generic parameter last
```
**Pattern**: Defining specific routes before parameterized ones.

### 5. Single Route for Creation
```javascript
router.post('/', createComment);
```
**Pattern**: POST to root path for resource creation.

### 6. Chained CRUD Operations
```javascript
router.route('/:id')
  .put(updateComment)
  .delete(deleteComment);
```
**Pattern**: Grouping multiple operations on same resource path.

### 7. Count Endpoint Pattern
```javascript
router.get('/ticket/:ticketId/count', getCommentCount);
```
**Pattern**: Separate endpoint for aggregate data queries.

### 8. Router Module Export
```javascript
module.exports = router;
```
**Pattern**: Exporting router for mounting in main application.
