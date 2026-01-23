# Backend Model: User.js - Line by Line Explanation

**Location**: `backend/models/User.js` | **Lines**: 48

## 📋 Overview

Mongoose schema for user authentication with bcrypt password hashing and validation.

**Key Features:**
- Email validation with regex
- Password hashing with bcrypt (10 salt rounds)
- Password comparison method
- Password excluded from queries by default (`select: false`)

---

## 🔍 Code Analysis

**Imports (Lines 1-2):**
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
```

**Schema Definition (Lines 4-32):**
- `name`: Required, max 50 chars, trimmed
- `email`: Required, unique, lowercase, email regex validation
- `password`: Required, min 6 chars, **`select: false`** (excluded from queries)
- `createdAt`: Auto-timestamp

**Pre-save Hook (Lines 35-42):**
```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();  // Skip if password unchanged
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```
Only hashes password if modified. Uses 10 salt rounds for security.

**Compare Method (Lines 45-47):**
```javascript
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```
Used in login to verify entered password against hashed password.

---

## 🔗 Related Files
- [authController.js](backend-controller-auth.md) - Uses User model
