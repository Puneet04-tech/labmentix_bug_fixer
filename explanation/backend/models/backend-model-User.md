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

## 📚 Technical Terms Glossary

- **Mongoose**: ODM (Object Data Modeling) library for MongoDB. Adds schemas, validation, and model methods.
- **Schema**: Blueprint for MongoDB documents (defines fields, types, validation).
- **Model**: Mongoose class for interacting with a MongoDB collection.
- **Bcrypt**: Library for hashing passwords securely.
- **Pre-save Hook**: Mongoose middleware that runs before saving a document.
- **Validation**: Ensures data meets requirements before saving.
- **Unique**: Ensures no two documents have the same value for a field.
- **select: false**: Field is excluded from query results by default (e.g., password).

---

## 🔍 Code Analysis

### Import Statements
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
```
- `mongoose`: Main ODM library for MongoDB. Handles schemas, models, and database connection.
- `bcrypt`: Library for hashing and comparing passwords securely.

### Schema Definition
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, match: /.+@.+\..+/ },
  password: { type: String, required: true, minlength: 6, select: false },
  createdAt: { type: Date, default: Date.now }
});
```
- `mongoose.Schema({...})`: Defines the structure and validation for user documents.
- `required: true`: Field must be present.
- `unique: true`: No duplicate emails allowed.
- `trim: true`: Removes whitespace from start/end.
- `lowercase: true`: Converts email to lowercase.
- `match: /.+@.+\..+/`: Regex for email validation.
- `select: false`: Password is not returned in queries by default.

### Pre-save Hook
```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```
- `pre('save', ...)`: Runs before saving a user.
- `this.isModified('password')`: Only hash if password changed.
- `bcrypt.genSalt(10)`: Generates salt for hashing (10 rounds).
- `bcrypt.hash(...)`: Hashes the password.

### Password Comparison Method
```javascript
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```
- `comparePassword`: Custom method to check if entered password matches hashed password.
- `bcrypt.compare(...)`: Compares plain and hashed passwords.

---

## 🔗 Related Files
- [authController.js](backend-controller-auth.md) - Uses User model
