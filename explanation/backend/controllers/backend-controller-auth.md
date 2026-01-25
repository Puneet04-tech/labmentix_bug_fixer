# Backend Controller: authController.js - Authentication Logic

## 📋 File Overview
**Location**: `backend/controllers/authController.js`  
**Lines**: 104  
**Purpose**: Handle user registration, login, and authentication

---

## 🎯 Core Functions
1. **register** - Create new user account
2. **login** - Authenticate existing user
3. **getMe** - Get current user details

---

## 📝 LINE-BY-LINE BREAKDOWN

### **Lines 1-2: Imports**
```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');
```

### **Lines 4-9: Generate JWT Token**
```javascript
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
```

**Creates JWT token with**:
- Payload: `{ id: userId, role: userRole }` - User's MongoDB _id and role (useful for quick authorization checks)
- Secret: `process.env.JWT_SECRET` - Signing key (keep secret!)
- Expiration: 30 days - Token becomes invalid after this

**Used by**: register() and login() to return token to frontend

---

### **Lines 14-47: Register New User**

```javascript
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Line 16**: Extract name, email, password from request body

**Lines 19-21**: Validation - All fields required

**Lines 24-27**: Check if email already registered
- `User.findOne({ email })` - Query database
- Returns existing user or null
- Prevents duplicate accounts

**Lines 30-34**: Create user in database
- `User.create()` - Mongoose method
- **Password automatically hashed** by User model's pre-save hook (see User.md)
- Returns created user object

**Lines 36-42**: Success response
- Status 201 Created
- Returns user data + JWT token
- Frontend stores token in localStorage

**Flow**: Frontend POST /api/auth/register → Validate → Check duplicate → Hash password → Save user → Generate token → Return

---

### **Lines 52-82: Login Existing User**

```javascript
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Line 62**: `.select('+password')` - **Critical!**
- User model has `password: { select: false }` - Password excluded by default
- Must explicitly request password field for comparison
- Security: Prevents password from being returned in normal queries

**Lines 64-66**: User not found
- Return 401 Unauthorized
- Generic "Invalid credentials" message (don't reveal if email exists - security)

**Line 69**: Compare password using User model method
- `comparePassword()` defined in User model (see User.md)
- Uses bcrypt to compare plain password with hashed password
- Returns true/false

**Lines 71-73**: Password doesn't match
- Return 401 with same generic message

**Lines 75-80**: Success - Return user data + token

**Security note**: Same error message for "user not found" and "wrong password" prevents email enumeration attacks

---

### **Lines 87-104: Get Current User**

```javascript
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Line 89**: `req.user.id` - Set by auth middleware
- Middleware decoded JWT token → extracted user ID → stored in req.user

**Used by**: AuthContext on page load to restore user session

**Flow**: Frontend GET /api/auth/me (with token) → auth middleware verifies token → getMe returns user data

---

## 🔄 Complete Authentication Flows

### **Registration Flow**
```
1. User fills registration form
2. Frontend: POST /api/auth/register { name, email, password }
3. Backend: Check if email exists
4. Backend: Hash password (User model pre-save hook)
5. Backend: Save user to database
6. Backend: Generate JWT token
7. Backend: Return { user, token }
8. Frontend: Store token in localStorage
9. Frontend: Set user in AuthContext
10. Frontend: Navigate to dashboard
```

### **Login Flow**
```
1. User fills login form
2. Frontend: POST /api/auth/login { email, password }
3. Backend: Find user by email (include password)
4. Backend: Compare password with bcrypt
5. Backend: Generate JWT token
6. Backend: Return { user, token }
7. Frontend: Store token in localStorage
8. Frontend: Set user in AuthContext
9. Frontend: Navigate to dashboard
```

### **Session Restoration Flow (Page Reload)**
```
1. User refreshes page
2. Frontend: Check localStorage for token
3. Frontend: GET /api/auth/me (with token in header)
4. Backend: auth middleware verifies token
5. Backend: getMe returns user data
6. Frontend: Set user in AuthContext
7. Frontend: User stays logged in
```

---

## 🔐 Security Features

1. **Password Hashing**: Bcrypt with salt (in User model)
2. **JWT Tokens**: Signed with secret, 30-day expiration
3. **Password Not Returned**: Never send hashed password to frontend
4. **Generic Error Messages**: Don't reveal if email exists
5. **Token Required**: getMe protected by auth middleware

---

## 🚨 Common Issues

**Issue**: Passwords stored in plain text
- **Solution**: User model pre-save hook hashes password automatically

**Issue**: Token never expires
- **Solution**: `expiresIn: '30d'` in generateToken()

**Issue**: Email enumeration attack
```javascript
// WRONG - Reveals if email exists
if (!user) return res.json({ message: 'Email not found' });
if (!isMatch) return res.json({ message: 'Wrong password' });

// CORRECT - Same message for both
if (!user || !isMatch) return res.json({ message: 'Invalid credentials' });
```

---

## 🔗 Related Files
- [User Model](../models/backend-models-User.md) - Password hashing, comparePassword method
- [auth.js middleware](../core/backend-core-auth-middleware.md) - Token verification
- [AuthContext.jsx](../../frontend/contexts/frontend-context-AuthContext.md) - Frontend authentication

---

Foundation of security - handles all authentication! 🔐✨

---

## 📚 Technical Terms Glossary
- `jwt.sign(payload, secret, opts)`: Creates JWT tokens used for authentication.
- `.select('+password')`: Explicitly include a field excluded by default in the model (used to verify passwords).
- `comparePassword()`: Model method (bcrypt) to compare plain text to hashed password.

## 🧑‍💻 Important Import & Syntax Explanations
- `process.env.JWT_SECRET`: Environment variable holding the JWT signing secret — never commit this to source.
- `res.status(401).json({ message: 'Invalid credentials' })`: Use generic error messages to avoid account enumeration.
- `user.create()` vs `new User()` + `save()`: Two common patterns to create documents in Mongoose.

---

### Sample Requests & Responses

POST /api/auth/register
Request:
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123",
  "role": "core"  # optional: "member" | "core" | "admin"
}
```
Response (201):
```json
{
  "_id": "507...",
  "name": "Alice",
  "email": "alice@example.com",
  "role": "core",
  "token": "eyJ..."
}
```

> Note: Creating an `admin` account via registration requires a server-side key for safety. Example using header `x-admin-key`:

```http
POST /api/auth/register
Content-Type: application/json
x-admin-key: <ADMIN_REGISTRATION_KEY>

{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "securepass",
  "role": "admin"
}
```

If `x-admin-key` does not match the server `ADMIN_REGISTRATION_KEY`, the request will be rejected with `403 Forbidden`.

POST /api/auth/login
Request:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "secret123"
}
```
Response (200):
```json
{
  "_id": "507...",
  "name": "Alice",
  "email": "alice@example.com",
  "token": "eyJ..."
}
```

Edge cases:
- Registering with an already used email → 400 (User already exists)
- Missing fields → 400 Bad Request
- Incorrect login credentials → 401 Unauthorized (generic message)

