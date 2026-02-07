# backend-middleware-auth.md

## Overview
The `auth.js` file implements JWT token verification middleware for route protection.

## File Location
```
backend/middleware/auth.js
```

## Dependencies - Detailed Import Analysis

```javascript
const jwt = require('jsonwebtoken');
```

### Import Statement Breakdown:
- **jsonwebtoken**: Library for JWT token verification and decoding

## Middleware Function Definition

```javascript
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
```

**Syntax Pattern**: Async Express middleware with JWT verification and error handling.

## Token Extraction from Header

```javascript
const token = req.header('Authorization')?.replace('Bearer ', '');
```

**Syntax Pattern**: Optional chaining for safe header access and Bearer prefix removal.

## JWT Verification

```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

**Syntax Pattern**: Verifying token signature and decoding payload with secret key.

## Request Object Augmentation

```javascript
req.user = decoded;
```

**Syntax Pattern**: Attaching decoded user data to request object for downstream handlers.

## Middleware Export

```javascript
module.exports = auth;
```

**Syntax Pattern**: Exporting middleware function for use in route definitions.

## Critical Code Patterns

### 1. Async Middleware Function
```javascript
const auth = async (req, res, next) => {
  // async operations
};
```
**Pattern**: Defining asynchronous Express middleware.

### 2. Try-Catch Error Handling
```javascript
try {
  // token verification
} catch (error) {
  res.status(401).json({ message: 'Token is not valid' });
}
```
**Pattern**: Comprehensive error handling for JWT operations.

### 3. Optional Header Access
```javascript
req.header('Authorization')?.replace('Bearer ', '')
```
**Pattern**: Safe property access with optional chaining.

### 4. Token Presence Validation
```javascript
if (!token) {
  return res.status(401).json({ message: 'No token, authorization denied' });
}
```
**Pattern**: Early return for missing authentication credentials.

### 5. JWT Decode and Attach
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;
```
**Pattern**: Verifying token and attaching user data to request.

### 6. Control Flow Continuation
```javascript
next();
```
**Pattern**: Passing control to next middleware or route handler.

### 7. HTTP Status Code Usage
```javascript
res.status(401).json({ message: '...' })
```
**Pattern**: Using 401 Unauthorized for authentication failures.

### 8. Module Export Pattern
```javascript
module.exports = auth;
```
**Pattern**: Exporting middleware for router integration.
