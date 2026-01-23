# Authentication Middleware (auth.js) - Line by Line Explanation

## File: `backend/middleware/auth.js`

This middleware protects routes by verifying JWT tokens and extracting user information from requests.

---

## Complete Code
```javascript
const jwt = require('jsonwebtoken');

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

module.exports = auth;
```

---

## Line-by-Line Breakdown

### Line 1: Import JWT Library
```javascript
const jwt = require('jsonwebtoken');
```

**Explanation:**
- Imports the `jsonwebtoken` library for JWT operations
- JWT = JSON Web Token (industry standard for secure authentication)
- Used to verify tokens sent by the client

**What JWT does:**
- Creates signed tokens (during login)
- Verifies token signatures (in this middleware)
- Decodes token payload to extract user data
- Ensures tokens haven't been tampered with

---

### Line 3: Define Middleware Function
```javascript
const auth = async (req, res, next) => {
```

**Explanation:**
- Declares middleware function named `auth`
- **`async`**: Allows use of `await` for async operations
- **`req`**: Request object (contains headers, body, params)
- **`res`**: Response object (used to send responses)
- **`next`**: Callback to pass control to next middleware/route

**Middleware Signature:**
- Must have `(req, res, next)` parameters
- Typically calls `next()` to continue to next handler
- Can end the request by sending a response

**How Middleware Works:**
```
Client Request → Middleware 1 → Middleware 2 → Route Handler → Response
                    ↓               ↓              ↓
                  next()         next()        res.json()
```

---

### Line 4: Try Block Begins
```javascript
  try {
```

**Explanation:**
- Starts error handling for token verification
- Any errors in token processing will be caught
- Prevents server crashes from invalid tokens

**Why needed:**
- `jwt.verify()` throws errors for invalid tokens
- Malformed tokens cause exceptions
- Expired tokens throw specific errors
- Try-catch handles these gracefully

---

### Line 5-6: Extract Token from Header
```javascript
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
```

**Explanation:**
- **`req.header('Authorization')`**: Gets the Authorization header from request
- **`?.replace('Bearer ', '')`**: Optional chaining + removes "Bearer " prefix
- **Result**: Extracts the actual JWT token

**Authorization Header Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
               ↑      ↑
               prefix  token
```

**Step-by-Step:**
1. Client sends: `Authorization: Bearer abc123token`
2. `req.header('Authorization')` gets: `"Bearer abc123token"`
3. `?.replace('Bearer ', '')` removes prefix: `"abc123token"`
4. `token` variable now contains: `"abc123token"`

**Optional Chaining (`?.`):**
- If Authorization header doesn't exist, returns `undefined`
- Without `?`, would throw error: "Cannot read property 'replace' of undefined"
- With `?`, safely returns `undefined` if header missing

**Why "Bearer"?**
- Standard convention for token-based authentication
- Indicates the token type is a "bearer token"
- Format specified in OAuth 2.0 standard
- Many APIs expect this format

---

### Line 8-10: Check if Token Exists
```javascript
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
```

**Explanation:**
- **`if (!token)`**: Checks if token is falsy (undefined, null, empty string)
- **`return res.status(401)`**: Returns 401 Unauthorized status code
- **`.json({ message: ... })`**: Sends JSON error response
- **`return`**: Stops execution (doesn't call `next()`)

**When token is missing:**
- User didn't include Authorization header
- User logged out (removed token from localStorage)
- User never logged in
- Token was manually deleted

**Response Example:**
```json
{
  "message": "No token, authorization denied"
}
```

**HTTP Status Code 401:**
- Means "Unauthorized" (not "Unauthenticated")
- Indicates authentication is required
- Client should redirect to login page
- Standard code for missing/invalid credentials

---

### Line 12-13: Verify Token
```javascript
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

**Explanation:**
- **`jwt.verify()`**: Verifies token signature and decodes payload
- **`token`**: The JWT string to verify
- **`process.env.JWT_SECRET`**: Secret key used to sign the token
- **`decoded`**: Contains the decoded token payload (user data)

**What jwt.verify() does:**
1. Checks token format (3 parts: header.payload.signature)
2. Decodes the payload
3. Verifies signature using JWT_SECRET
4. Checks expiration time (if `exp` claim exists)
5. Returns decoded payload if valid
6. Throws error if invalid

**Token Structure:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
↑                                      ↑                                                          ↑
Header (algorithm)                     Payload (user data)                                        Signature
```

**Decoded Payload Example:**
```javascript
{
  id: "507f1f77bcf86cd799439011",
  email: "user@example.com",
  iat: 1674123456,  // Issued at timestamp
  exp: 1674209856   // Expiration timestamp
}
```

**Verification Process:**
1. Token was created with: `jwt.sign(payload, JWT_SECRET)`
2. Verification checks: Same JWT_SECRET can decode signature
3. If secrets don't match → Token is fake/tampered
4. If secret matches → Token is authentic

**Security:**
- Only server with correct JWT_SECRET can verify tokens
- Tampering with payload changes signature
- Changed signature fails verification
- Ensures token integrity and authenticity

---

### Line 14: Attach User to Request
```javascript
    req.user = decoded;
```

**Explanation:**
- Adds `user` property to request object
- Contains decoded token data (user ID, email, etc.)
- Available to all subsequent middleware and route handlers
- Eliminates need to decode token again

**What gets attached:**
```javascript
req.user = {
  id: "507f1f77bcf86cd799439011",
  email: "user@example.com",
  iat: 1674123456,
  exp: 1674209856
}
```

**Usage in Route Handlers:**
```javascript
app.get('/api/profile', auth, (req, res) => {
  // auth middleware already ran
  // req.user is now available
  const userId = req.user.id;  // Get authenticated user ID
  // Fetch user data using userId
});
```

**Why this is useful:**
- Route handlers know which user made the request
- Can fetch user-specific data from database
- Can check user permissions
- No need to pass user ID in URL or body

---

### Line 15: Call Next Middleware
```javascript
    next();
```

**Explanation:**
- Passes control to next middleware or route handler
- Authentication successful, allow request to continue
- Without this, request would hang indefinitely

**Control Flow:**
```
Request → auth middleware → next() → route handler → response
          ↓ (adds req.user)
```

**Example Chain:**
```javascript
app.get('/api/tickets', auth, ticketController.getTickets);
                        ↑               ↑
                   Middleware        Route Handler
```

**Execution Order:**
1. `auth` middleware runs
2. Token verified successfully
3. `req.user` set with user data
4. `next()` called
5. `ticketController.getTickets` runs
6. Can access `req.user.id` to get user's tickets

---

### Line 16-18: Catch Block (Error Handling)
```javascript
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
```

**Explanation:**
- Catches any errors from token verification
- Returns 401 Unauthorized with error message
- **No `return` needed** - sending response ends the chain
- **Doesn't call `next()`** - stops request processing

**Errors Caught:**
1. **Invalid Signature**: Token was tampered with
2. **Malformed Token**: Not a valid JWT format
3. **Expired Token**: Past expiration time
4. **Wrong Algorithm**: Token signed with different algorithm
5. **Invalid Secret**: JWT_SECRET doesn't match

**Response Example:**
```json
{
  "message": "Token is not valid"
}
```

**Why generic message:**
- Security best practice
- Don't reveal specific reason (expired vs tampered vs wrong secret)
- Prevents attackers from learning about system
- Client just knows: "Not authorized, go to login"

**Client Handling:**
```javascript
// Frontend axios interceptor
if (error.response.status === 401) {
  // Token invalid
  localStorage.removeItem('token');
  window.location = '/login';
}
```

---

### Line 19-21: Export Middleware
```javascript
};

module.exports = auth;
```

**Explanation:**
- Closes the `auth` function
- Exports the middleware for use in other files
- CommonJS module pattern

**Usage in Routes:**
```javascript
const auth = require('../middleware/auth');

// Protect single route
router.get('/profile', auth, getProfile);

// Protect all routes in router
router.use(auth);
router.get('/tickets', getTickets);
router.post('/tickets', createTicket);
```

---

## Complete Request Flow Example

### 1. User Logs In
```javascript
// Login route creates token
const token = jwt.sign(
  { id: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '30d' }
);
```

### 2. Client Stores Token
```javascript
// Frontend stores in localStorage
localStorage.setItem('token', token);
```

### 3. Client Makes Request
```javascript
// Frontend sends token in header
axios.get('/api/tickets', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});
```

### 4. Middleware Runs
```javascript
// Backend (this file)
1. Extract token from header
2. Verify token signature
3. Decode user data
4. Attach to req.user
5. Call next()
```

### 5. Route Handler Accesses User
```javascript
// Route handler
app.get('/api/tickets', auth, async (req, res) => {
  // req.user available thanks to auth middleware
  const userId = req.user.id;
  const tickets = await Ticket.find({ assignee: userId });
  res.json(tickets);
});
```

---

## Protected vs Unprotected Routes

### Unprotected (Public) Routes
```javascript
router.post('/auth/login', login);       // No auth needed
router.post('/auth/register', register); // No auth needed
```

### Protected (Private) Routes
```javascript
router.get('/tickets', auth, getTickets);         // Requires auth
router.post('/tickets', auth, createTicket);      // Requires auth
router.put('/tickets/:id', auth, updateTicket);   // Requires auth
router.delete('/tickets/:id', auth, deleteTicket);// Requires auth
```

---

## Security Best Practices Demonstrated

1. ✅ **Token in Header**: Not in URL or body (more secure)
2. ✅ **Bearer Prefix**: Standard convention
3. ✅ **JWT Verification**: Ensures token authenticity
4. ✅ **Generic Error Messages**: Don't leak security details
5. ✅ **401 Status Code**: Proper HTTP semantics
6. ✅ **No Token Storage**: Token verified on each request
7. ✅ **Secret Key**: Server-side only, never exposed

---

## Common Issues and Solutions

### Issue 1: "Token is not valid"
**Causes:**
- Token expired
- Wrong JWT_SECRET in .env
- Token corrupted in localStorage
- Server restarted with different secret

**Solution:**
- Logout and login again
- Check JWT_SECRET matches
- Clear localStorage

### Issue 2: "No token, authorization denied"
**Causes:**
- User not logged in
- Token not sent in header
- Authorization header missing

**Solution:**
- Redirect to login
- Check frontend axios config
- Verify token in localStorage

### Issue 3: CORS Preflight Fails
**Cause:**
- OPTIONS request doesn't include token
- CORS middleware not configured

**Solution:**
- Ensure CORS allows Authorization header
- Check CORS configuration

---

## Testing the Middleware

### Postman Test
```
GET http://localhost:5000/api/tickets

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Expected: 200 OK with tickets data
```

### Without Token
```
GET http://localhost:5000/api/tickets

(No Authorization header)

Expected: 401 with "No token, authorization denied"
```

### Invalid Token
```
GET http://localhost:5000/api/tickets

Headers:
Authorization: Bearer invalid-token-string

Expected: 401 with "Token is not valid"
```

---

This middleware is the gatekeeper that protects all sensitive routes!
