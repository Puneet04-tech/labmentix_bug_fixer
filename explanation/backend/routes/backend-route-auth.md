# Backend Routes: auth.js - Line by Line Explanation

**Location**: `backend/routes/auth.js` | **Lines**: 13

## 📋 Overview

Authentication routes for register, login, and get current user.

**Routes:**
- `POST /api/auth/register` - Public
- `POST /api/auth/login` - Public
- `GET /api/auth/me` - Protected (requires auth middleware)

---

## 🔍 Code Analysis

**Imports (Lines 1-4):**
```javascript
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');
```

**Public Routes (Lines 7-8):**
```javascript
router.post('/register', register);
router.post('/login', login);
```
No authentication required - anyone can register or login.

**Protected Route (Line 11):**
```javascript
router.get('/me', auth, getMe);
```
`auth` middleware runs first, verifies JWT token, adds `req.user`, then calls `getMe` controller.

---

## 🔗 Related Files
- [authController.js](backend-controller-auth.md) - Controller functions
- [auth.js middleware](backend-middleware-auth.md) - JWT verification
 - [authController.js](backend-controller-auth.md) - Controller functions
 - [auth.js middleware](backend-middleware-auth.md) - JWT verification

---

## 📚 Technical Terms Glossary
- `auth` middleware: Verifies JWT and attaches `req.user` to the request.
- Public vs Protected routes: Public routes are accessible without a token (register/login), protected routes require a valid token.

## 🧑‍💻 Important Import & Syntax Explanations
- Route-level middleware: `router.get('/me', auth, getMe)` shows how to protect a single route with middleware.
- Keep authentication logic out of controllers where possible; centralize in middleware to avoid duplication.
