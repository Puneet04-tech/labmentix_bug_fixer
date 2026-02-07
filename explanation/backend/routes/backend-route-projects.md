# backend-route-projects.md

## Overview
The `projects.js` file defines routes for project CRUD operations and member management.

## File Location
```
backend/routes/projects.js
```

## Dependencies - Detailed Import Analysis

```javascript
const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');
const auth = require('../middleware/auth');
```

### Import Statement Breakdown:
- **express**: Framework for creating router instance
- **projectController**: Controller functions for all project operations
- **auth**: Middleware for JWT token verification

## Global Authentication Middleware

```javascript
router.use(auth);
```

**Syntax Pattern**: Applying authentication to all routes defined after this line.

## Standard CRUD Route Definitions

```javascript
router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
```

**Syntax Pattern**: RESTful route definitions for resource operations.

## Nested Resource Routes

```javascript
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);
```

**Syntax Pattern**: Routes for managing nested resources (project members).

## Router Export

```javascript
module.exports = router;
```

**Syntax Pattern**: Exporting configured router for application mounting.

## Critical Code Patterns

### 1. Controller Function Destructuring
```javascript
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');
```
**Pattern**: Importing multiple functions from controller module.

### 2. Global Route Protection
```javascript
router.use(auth);
```
**Pattern**: Protecting all subsequent routes with authentication middleware.

### 3. RESTful Route Structure
```javascript
router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
```
**Pattern**: Standard REST API route patterns.

### 4. Nested Resource Management
```javascript
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);
```
**Pattern**: Managing sub-resources through nested route parameters.

### 5. Route Parameter Extraction
```javascript
router.get('/:id', getProject);
router.delete('/:id/members/:userId', removeMember);
```
**Pattern**: Using route parameters for resource identification.

### 6. HTTP Method Mapping
```javascript
router.get()    // Read operations
router.post()   // Create operations
router.put()    // Update operations
router.delete() // Delete operations
```
**Pattern**: Mapping HTTP methods to CRUD operations.

### 7. Middleware Application Order
```javascript
router.use(auth);  // Applied first
router.get('/', getProjects);  // Then routes
```
**Pattern**: Middleware execution order in route definitions.

### 8. Modular Router Export
```javascript
module.exports = router;
```
**Pattern**: Exporting router for mounting in main application.

