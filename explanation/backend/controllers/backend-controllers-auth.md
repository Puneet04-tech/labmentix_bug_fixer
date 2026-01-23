# Backend Controllers: authController.js - Complete Explanation

This controller handles user authentication: registration, login, and profile retrieval.

---

## 📋 Overview

- **Location**: `backend/controllers/authController.js`
- **Purpose**: User authentication logic
- **Functions**: register, login, getMe
- **Total Lines**: 108

---

## 🔑 Helper Function: generateToken (Lines 4-8)

```javascript
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
```

**Purpose**: Creates JWT token for authenticated users

**Parameters**:
- `id` - user's MongoDB _id

**Returns**: JWT string like `"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`

**Token Structure**:
```javascript
// Header
{ "alg": "HS256", "typ": "JWT" }

// Payload (what we encode)
{ "id": "507f1f77bcf86cd799439011", "iat": 1706011200, "exp": 1708603200 }

// Signature (prevents tampering)
HMACSHA256(header + payload, JWT_SECRET)
```

**Expiration**: `'30d'` = 30 days
- User stays logged in for 30 days
- After expiration, must login again
- Balance between convenience and security

---

## 📝 exports.register (Lines 11-49)

### **Purpose**
Creates new user account and returns JWT token

### **Route**: `POST /api/auth/register`
### **Access**: Public (no authentication required)

---

### **Step 1: Extract Data (Line 16)**
```javascript
const { name, email, password } = req.body;
```

**Expects request body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

---

### **Step 2: Validate Input (Lines 18-21)**
```javascript
if (!name || !email || !password) {
  return res.status(400).json({ message: 'Please provide all fields' });
}
```

**Status 400**: Bad Request (client error)
**Why validate?** Prevent incomplete registrations

---

### **Step 3: Check Duplicate Email (Lines 23-26)**
```javascript
const userExists = await User.findOne({ email });
if (userExists) {
  return res.status(400).json({ message: 'User already exists' });
}
```

**Prevents**: Same email registering twice
**Database**: Uses unique index on email field
**Returns**: 400 if duplicate found

---

### **Step 4: Create User (Lines 28-32)**
```javascript
const user = await User.create({
  name,
  email,
  password
});
```

**What happens**:
1. User model validates fields (name, email format, password length)
2. Pre-save middleware hashes password with bcrypt
3. Document saved to MongoDB 'users' collection
4. Returns user object with _id

**Plain text password** → **Hashed**: `$2a$10$N9qo8...`

---

### **Step 5: Return Response (Lines 34-43)**
```javascript
if (user) {
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id)
  });
}
```

**Status 201**: Created (successful resource creation)

**Response format**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Frontend usage**:
```javascript
// Store token in localStorage
localStorage.setItem('token', response.token);

// Include in subsequent requests
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### **Step 6: Error Handling (Lines 46-48)**
```javascript
catch (error) {
  res.status(500).json({ message: error.message });
}
```

**Status 500**: Internal Server Error
**Catches**: Database errors, validation errors, unexpected issues

---

## 🔐 exports.login (Lines 52-85)

### **Purpose**
Authenticates existing user with email/password

### **Route**: `POST /api/auth/login`
### **Access**: Public

---

### **Step 1: Extract Credentials (Line 55)**
```javascript
const { email, password } = req.body;
```

**Request body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### **Step 2: Validate Input (Lines 57-60)**
```javascript
if (!email || !password) {
  return res.status(400).json({ message: 'Please provide email and password' });
}
```

---

### **Step 3: Find User + Password (Line 63)**
```javascript
const user = await User.findOne({ email }).select('+password');
```

**Critical**: `.select('+password')`
- User model has `select: false` on password field
- Must explicitly request password for comparison
- Without `+password`, `user.password` would be undefined

---

### **Step 4: Check User Exists (Lines 65-67)**
```javascript
if (!user) {
  return res.status(401).json({ message: 'Invalid credentials' });
}
```

**Status 401**: Unauthorized (authentication failed)
**Security**: Don't reveal if email exists ("Invalid credentials" not "Email not found")
**Prevents**: Email enumeration attacks

---

### **Step 5: Verify Password (Lines 69-73)**
```javascript
const isMatch = await user.comparePassword(password);

if (!isMatch) {
  return res.status(401).json({ message: 'Invalid credentials' });
}
```

**How comparePassword works**:
```javascript
// User model method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

1. Extract salt from stored hash
2. Hash entered password with same salt
3. Compare resulting hash with stored hash
4. Return true/false

**Example**:
```javascript
// Stored hash: $2a$10$salt$hashedvalue
// Entered: "password123"
// bcrypt.compare('password123', '$2a$10$salt$hashedvalue')
// → true ✅ (password correct)
```

---

### **Step 6: Return Token (Lines 75-80)**
```javascript
res.json({
  _id: user._id,
  name: user.name,
  email: user.email,
  token: generateToken(user._id)
});
```

**Note**: Password NOT included in response (security)

---

## 👤 exports.getMe (Lines 88-108)

### **Purpose**
Returns current authenticated user's profile

### **Route**: `GET /api/auth/me`
### **Access**: Private (requires authentication)

---

### **Step 1: Get User from Token (Line 92)**
```javascript
const user = await User.findById(req.user.id);
```

**Where does `req.user.id` come from?**
- Auth middleware verifies JWT token
- Extracts user ID from token payload
- Attaches to `req.user` before this controller runs

**Middleware flow**:
```javascript
// 1. Request with header: Authorization: Bearer eyJhbGc...
// 2. Auth middleware runs
// 3. Verifies token, extracts { id: "507f..." }
// 4. Sets req.user = { id: "507f..." }
// 5. Calls next() → this controller runs
```

---

### **Step 2: Check User Exists (Lines 94-96)**
```javascript
if (!user) {
  return res.status(404).json({ message: 'User not found' });
}
```

**Status 404**: Not Found (user deleted since token issued)
**Edge case**: Token valid but user no longer exists

---

### **Step 3: Return Profile (Lines 98-102)**
```javascript
res.json({
  _id: user._id,
  name: user.name,
  email: user.email
});
```

**Use case**: Frontend needs user info after page refresh
**Frontend flow**:
```javascript
// User loads app
// Token exists in localStorage
// Call /api/auth/me to get user details
// Update state with user info
```

---

## 🔄 Complete Authentication Flow

### **Registration Flow**
```
Client                          Server                      Database
  |                               |                             |
  |---POST /api/auth/register---->|                             |
  |  { name, email, password }    |                             |
  |                               |---findOne(email)---------->|
  |                               |<---null (doesn't exist)----|
  |                               |---create user------------->|
  |                               |  (hash password)            |
  |                               |<---user document-----------|
  |                               | generateToken(user._id)     |
  |<---201 { user, token }--------|                             |
  | Store token in localStorage   |                             |
```

---

### **Login Flow**
```
Client                          Server                      Database
  |                               |                             |
  |---POST /api/auth/login------->|                             |
  |  { email, password }          |                             |
  |                               |---findOne(email)---------->|
  |                               |  .select('+password')       |
  |                               |<---user with password-------|
  |                               | comparePassword(entered)    |
  |                               | bcrypt.compare()            |
  |                               | ✅ Match!                   |
  |                               | generateToken(user._id)     |
  |<---200 { user, token }--------|                             |
  | Store token in localStorage   |                             |
```

---

### **Protected Request Flow**
```
Client                          Server                      Database
  |                               |                             |
  |---GET /api/auth/me----------->|                             |
  | Header: Authorization: Bearer token                         |
  |                               | Auth Middleware:            |
  |                               | - Extract token             |
  |                               | - Verify signature          |
  |                               | - Decode payload { id: ... }|
  |                               | - Set req.user.id           |
  |                               | - Call next()               |
  |                               | getMe Controller:           |
  |                               |---findById(req.user.id)---->|
  |                               |<---user document-----------|
  |<---200 { user }---------------|                             |
```

---

## ⚠️ Security Best Practices

### 1. **Generic Error Messages**
```javascript
// WRONG - reveals which part failed
if (!user) return res.json({ message: 'Email not found' });
if (!isMatch) return res.json({ message: 'Password incorrect' });

// RIGHT - generic message
if (!user || !isMatch) return res.json({ message: 'Invalid credentials' });
```

**Why?** Prevents attackers from enumerating valid emails

---

### 2. **Password Never in Response**
```javascript
// User object has password field
// NEVER send it to client
res.json({
  _id: user._id,
  name: user.name,
  email: user.email
  // password: NEVER INCLUDE THIS!
});
```

---

### 3. **Token Expiration**
```javascript
expiresIn: '30d' // 30 days

// Production recommendation:
expiresIn: '7d' // 1 week (shorter = more secure)
expiresIn: '1h' // 1 hour (requires refresh token mechanism)
```

---

### 4. **Bcrypt Cost Factor**
```javascript
// In User model
const salt = await bcrypt.genSalt(10);
// 10 rounds is good balance
// 12-14 for high-security applications
```

---

## 🧪 Testing Examples

### Test Registration
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
});

const data = await response.json();
console.log(data.token); // JWT token
```

### Test Login
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
});

const data = await response.json();
console.log(data.name); // "Test User"
```

### Test Get Current User
```javascript
const response = await fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data.email); // "test@example.com"
```

---

## 🎓 Key Takeaways

1. **Register**: Create user, hash password, return token
2. **Login**: Verify credentials, return token
3. **GetMe**: Return profile from token
4. **JWT tokens**: 30-day expiration for persistent login
5. **Security**: Generic error messages, never expose passwords
6. **bcrypt**: One-way hashing with automatic salting

---

## 📚 Related Files

- [backend-models-User.md](backend-models-User.md) - User model with password hashing
- [backend-middleware-auth.md](backend-middleware-auth.md) - JWT verification middleware
- [backend-routes-auth.md](backend-routes-auth.md) - Auth route definitions

---

*This controller is the gateway to the application!* 🔐✅
