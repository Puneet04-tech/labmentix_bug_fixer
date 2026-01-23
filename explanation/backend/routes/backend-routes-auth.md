# Backend Routes: auth.js - Complete Explanation

Express router for authentication endpoints.

## 📋 Overview
- **Lines**: 14
- **Routes**: 3 (register, login, getMe)
- **Public**: 2, **Protected**: 1

---

## 🔑 Complete Code

```javascript
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', auth, getMe);

module.exports = router;
```

---

## 📍 Route Definitions

### **1. POST /api/auth/register** (Line 7)
```javascript
router.post('/register', register);
```
- **Method**: POST
- **Public**: No authentication required
- **Controller**: authController.register
- **Purpose**: Create new user account
- **Request body**: `{ name, email, password }`
- **Response**: `{ token, _id, name, email }`

---

### **2. POST /api/auth/login** (Line 8)
```javascript
router.post('/login', login);
```
- **Method**: POST
- **Public**: No authentication required
- **Controller**: authController.login
- **Purpose**: Authenticate user and get token
- **Request body**: `{ email, password }`
- **Response**: `{ token, _id, name, email }`

---

### **3. GET /api/auth/me** (Line 11)
```javascript
router.get('/me', auth, getMe);
```
- **Method**: GET
- **Protected**: Requires `auth` middleware
- **Controller**: authController.getMe
- **Purpose**: Get current user profile
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ _id, name, email, createdAt }`

**Flow**:
1. Request received with token in header
2. `auth` middleware validates token
3. If valid, `req.user` is populated
4. `getMe` controller returns user profile

---

## 🔒 Public vs Protected Routes

### Public Routes (Lines 7-8)
```javascript
router.post('/register', register);
router.post('/login', login);
```
**No middleware** → Anyone can access

### Protected Routes (Line 11)
```javascript
router.get('/me', auth, getMe);
```
**auth middleware** → Token required

---

## 🎯 Usage Examples

### 1. Register New User
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePass123"
}

Response (201):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "_id": "abc123",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### 2. Login Existing User
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePass123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "_id": "abc123",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### 3. Get Current User
```javascript
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response (200):
{
  "_id": "abc123",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### 4. Invalid Token (Protected Route)
```javascript
GET /api/auth/me
Authorization: Bearer invalid_token

Response (401):
{
  "message": "Invalid token"
}
```

---

## 🔄 Complete Authentication Flow

```
Registration:
POST /register → authController.register → Create user → Return token

Login:
POST /login → authController.login → Validate password → Return token

Protected Access:
GET /me → auth middleware → Verify token → getMe controller → Return user
```

---

## 📚 Related Files
- [backend-controllers-auth.md](backend-controllers-auth.md) - Controller implementations
- [backend-middleware-auth.md](backend-middleware-auth.md) - Auth middleware
- [frontend-context-AuthContext.md](frontend-context-AuthContext.md) - Frontend integration
- [backend-models-User.md](backend-models-User.md) - User model
