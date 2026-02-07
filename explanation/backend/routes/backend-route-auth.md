# backend-route-auth.md

## Overview
The `auth.js` file defines authentication routes for user registration, login, and profile access.

## File Location
```
backend/routes/auth.js
```

## Dependencies - Detailed Import Analysis

```javascript
const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');
```

### Import Statement Breakdown:
- **express**: Framework for creating router instance
- **authController**: Controller functions for authentication operations
- **auth**: Middleware for JWT token verification

## Router Instance Creation

```javascript
const router = express.Router();
```

**Syntax Pattern**: Creating Express router instance for route definitions.

## Public Route Definitions

```javascript
router.post('/register', register);
router.post('/login', login);
```

**Syntax Pattern**: Defining POST routes without middleware (public access).

## Protected Route with Middleware

```javascript
router.get('/me', auth, getMe);
```

**Syntax Pattern**: Applying authentication middleware before controller execution.

## Router Export

```javascript
module.exports = router;
```

**Syntax Pattern**: Exporting router for mounting in main application.

## Critical Code Patterns

### 1. Controller Function Destructuring
```javascript
const { register, login, getMe } = require('../controllers/authController');
```
**Pattern**: Importing specific functions from controller module.

### 2. Middleware Import
```javascript
const auth = require('../middleware/auth');
```
**Pattern**: Importing authentication middleware for route protection.

### 3. Public Route Registration
```javascript
router.post('/register', register);
router.post('/login', login);
```
**Pattern**: Registering routes that don't require authentication.

### 4. Protected Route Registration
```javascript
router.get('/me', auth, getMe);
```
**Pattern**: Applying middleware as second parameter before controller.

### 5. Router Module Export
```javascript
module.exports = router;
```
**Pattern**: Exporting configured router for application mounting.

### 6. Route Method Chaining
```javascript
router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
```
**Pattern**: Defining multiple routes on same router instance.

### 7. Middleware Function Application
```javascript
router.get('/me', auth, getMe);
```
**Pattern**: Passing middleware function as route handler parameter.

### 8. Express Router Creation
```javascript
const router = express.Router();
```
**Pattern**: Creating modular router instance for route organization.
