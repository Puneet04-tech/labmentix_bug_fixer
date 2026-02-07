# backend-controller-auth.md

## Overview
The `authController.js` file handles user authentication with registration, login, and session management.

## File Location
```
backend/controllers/authController.js
```

## Dependencies - Detailed Import Analysis

```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');
```

### Import Statement Breakdown:
- **User Model**: Mongoose model for user data and authentication methods
- **jsonwebtoken**: JWT library for token generation and verification

## JWT Token Generation

```javascript
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
```

**Syntax Pattern**: JWT signing with payload, secret, and expiration options.

## Async Controller Function with Try-Catch

```javascript
exports.register = async (req, res) => {
  try {
    // controller logic
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Syntax Pattern**: Express async controller with error handling.

## Request Body Destructuring

```javascript
const { name, email, password } = req.body;
```

**Syntax Pattern**: Destructuring request body properties.

## Mongoose Model Methods

```javascript
const userExists = await User.findOne({ email });
const user = await User.create({ name, email, password });
```

**Syntax Pattern**: Using Mongoose static methods for database operations.

## Password Field Selection

```javascript
const user = await User.findOne({ email }).select('+password');
```

**Syntax Pattern**: Explicitly including excluded fields in queries.

## Model Instance Methods

```javascript
const isMatch = await user.comparePassword(password);
```

**Syntax Pattern**: Calling custom methods on Mongoose model instances.

## Conditional Response Status

```javascript
if (!name || !email || !password) {
  return res.status(400).json({ message: 'Please provide all fields' });
}
```

**Syntax Pattern**: Input validation with early return.

## User ID from Authenticated Request

```javascript
const user = await User.findById(req.user.id);
```

**Syntax Pattern**: Accessing user ID set by authentication middleware.

## Critical Code Patterns

### 1. JWT Token Generation
```javascript
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
```
**Pattern**: Creating signed JWT tokens with expiration.

### 2. Async Express Controller
```javascript
exports.controllerName = async (req, res) => {
  try {
    // logic here
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```
**Pattern**: Standard async controller with try-catch error handling.

### 3. Request Body Destructuring
```javascript
const { field1, field2, field3 } = req.body;
```
**Pattern**: Extracting multiple fields from request body.

### 4. Mongoose Find and Create
```javascript
const existing = await Model.findOne({ field: value });
const newDoc = await Model.create({ field1, field2 });
```
**Pattern**: Database existence check followed by creation.

### 5. Selective Field Inclusion
```javascript
const doc = await Model.findOne(query).select('+excludedField');
```
**Pattern**: Explicitly including fields excluded by default in schema.

### 6. Model Instance Method Calls
```javascript
const result = await instance.customMethod(param);
```
**Pattern**: Calling custom methods defined in model schema.

### 7. Input Validation with Early Return
```javascript
if (!field1 || !field2) {
  return res.status(400).json({ message: 'Validation error' });
}
```
**Pattern**: Client-side validation before database operations.

### 8. Authenticated User Access
```javascript
const user = await User.findById(req.user.id);
```
**Pattern**: Accessing user data from request object set by auth middleware.

