# backend-route-tickets.md

## Overview
The `tickets.js` file defines routes for ticket CRUD operations, filtering, and assignment.

## File Location
```
backend/routes/tickets.js
```

## Dependencies - Detailed Import Analysis

```javascript
const express = require('express');
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
```

### Import Statement Breakdown:
- **express**: Framework for creating router instance
- **ticketController**: Controller functions for ticket operations
- **auth**: Middleware for JWT token verification

## Route Chaining for Same Path

```javascript
router.route('/')
  .get(getTickets)
  .post(createTicket);
```

**Syntax Pattern**: Defining multiple HTTP methods for the same route path.

## Specific Route Before Generic

```javascript
router.get('/project/:projectId', getTicketsByProject);
router.route('/:id')
  .get(getTicket)
  .put(updateTicket)
  .delete(deleteTicket);
```

**Syntax Pattern**: Ordering routes to prevent parameter conflicts.

## Custom Action Route

```javascript
router.put('/:id/assign', assignTicket);
```

**Syntax Pattern**: Separate endpoint for specialized operations.

## Router Export

```javascript
module.exports = router;
```

**Syntax Pattern**: Exporting configured router for application mounting.

## Critical Code Patterns

### 1. Controller Function Destructuring
```javascript
const {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketsByProject,
  assignTicket
} = require('../controllers/ticketController');
```
**Pattern**: Importing multiple controller functions.

### 2. Global Authentication
```javascript
router.use(auth);
```
**Pattern**: Protecting all routes with authentication middleware.

### 3. Route Method Chaining
```javascript
router.route('/:id')
  .get(getTicket)
  .put(updateTicket)
  .delete(deleteTicket);
```
**Pattern**: Grouping multiple HTTP methods for same resource.

### 4. Route Order Importance
```javascript
router.get('/project/:projectId', getTicketsByProject);  // First
router.route('/:id')...  // Second
```
**Pattern**: Defining specific routes before generic parameterized routes.

### 5. Custom Action Endpoints
```javascript
router.put('/:id/assign', assignTicket);
```
**Pattern**: Separate routes for specialized resource actions.

### 6. Parameterized Route Definitions
```javascript
router.get('/project/:projectId', getTicketsByProject);
router.route('/:id').get(getTicket);
```
**Pattern**: Using route parameters for resource identification.

### 7. Middleware Application
```javascript
router.use(auth);  // Applied to all following routes
```
**Pattern**: Global middleware application for route protection.

### 8. Router Module Export
```javascript
module.exports = router;
```
**Pattern**: Exporting router for mounting in main application.
