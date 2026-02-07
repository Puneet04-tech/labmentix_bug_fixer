# backend-model-User.md

## Overview
The `User.js` file defines the Mongoose schema for user authentication with password hashing.

## File Location
```
backend/models/User.js
```

## Dependencies - Detailed Import Analysis

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
```

### Import Statement Breakdown:
- **mongoose**: ODM library for MongoDB schema definition and model creation
- **bcrypt**: Library for secure password hashing and comparison

## Mongoose Schema Definition

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, match: /.+@.+\..+/ },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['admin', 'core', 'member'], default: 'member' },
  createdAt: { type: Date, default: Date.now }
});
```

**Syntax Pattern**: Defining schema fields with validation rules and constraints.

## Pre-save Middleware Hook

```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

**Syntax Pattern**: Mongoose pre-save hook for automatic password hashing.

## Schema Methods Definition

```javascript
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

**Syntax Pattern**: Adding instance methods to schema for password comparison.

## Model Export

```javascript
module.exports = mongoose.model('User', userSchema);
```

**Syntax Pattern**: Creating and exporting Mongoose model from schema.

## Critical Code Patterns

### 1. Schema Field Validation
```javascript
field: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  match: regex
}
```
**Pattern**: Defining field types with multiple validation constraints.

### 2. Selective Field Exclusion
```javascript
password: { type: String, select: false }
```
**Pattern**: Excluding sensitive fields from default query results.

### 3. Enum Field Definition
```javascript
role: { type: String, enum: ['admin', 'core', 'member'], default: 'member' }
```
**Pattern**: Restricting field values to predefined options.

### 4. Pre-save Hook for Hashing
```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  // hash password
});
```
**Pattern**: Conditional middleware execution based on field modification.

### 5. Salt Generation
```javascript
const salt = await bcrypt.genSalt(10);
```
**Pattern**: Generating salt rounds for password hashing.

### 6. Password Hashing
```javascript
this.password = await bcrypt.hash(this.password, salt);
```
**Pattern**: Hashing plain text password with generated salt.

### 7. Instance Method Definition
```javascript
userSchema.methods.methodName = async function(param) {
  // method implementation
};
```
**Pattern**: Adding custom methods to model instances.

### 8. Password Comparison
```javascript
await bcrypt.compare(enteredPassword, this.password)
```
**Pattern**: Secure comparison of plain text with hashed password.
