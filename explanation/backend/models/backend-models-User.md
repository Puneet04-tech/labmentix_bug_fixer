# Backend Models: User.js - Complete Line-by-Line Explanation

This file defines the **User model** using Mongoose, which represents users in the bug tracking system. It includes schema definition, password hashing, and password comparison methods.

---

## 📋 File Overview

- **Location**: `backend/models/User.js`
- **Purpose**: Define User schema with validation, password hashing, and authentication methods
- **Total Lines**: 50
- **Dependencies**: mongoose, bcryptjs
- **Exports**: Mongoose User model

---

## 🔍 Line-by-Line Breakdown

### **Line 1: Import Mongoose**
```javascript
const mongoose = require('mongoose');
```

**What it does:**
- Imports the Mongoose library

**Why it's needed:**
- Mongoose is an ODM (Object Data Modeling) library for MongoDB
- Provides schema-based solution to model application data
- Gives us Schema, Model, and validation capabilities

**Key Concepts:**
- **ODM**: Maps JavaScript objects to MongoDB documents
- **Schema**: Defines structure of documents within a collection
- **Model**: Compiled from schema, used to create/read/update/delete documents

---

### **Line 2: Import bcryptjs**
```javascript
const bcrypt = require('bcryptjs');
```

**What it does:**
- Imports the bcryptjs library for password hashing

**Why it's needed:**
- **Never store passwords in plain text!**
- bcrypt is a one-way hashing algorithm designed for passwords
- Automatically handles salting (adding random data before hashing)
- Slow by design to prevent brute-force attacks

**Security Benefits:**
- Even if database is compromised, passwords remain secure
- Each password gets unique salt, preventing rainbow table attacks
- Computationally expensive to crack

---

### **Line 4: Create User Schema**
```javascript
const userSchema = new mongoose.Schema({
```

**What it does:**
- Creates a new Mongoose Schema instance
- Opens object definition for schema fields

**Why it's needed:**
- Schema defines structure of User documents
- Enforces data types and validation rules
- Provides methods and middleware hooks

**Schema Structure:**
- Each field has type, validation, and constraints
- Can include default values, enums, references to other models

---

### **Lines 5-11: Name Field Definition**
```javascript
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
```

**Field-by-Field Explanation:**

**`type: String`**
- Specifies this field stores text data
- Mongoose converts values to String type

**`required: [true, 'Please add a name']`**
- **First element (true)**: This field is mandatory
- **Second element (error message)**: Custom error if validation fails
- Document cannot be saved without this field

**`trim: true`**
- Automatically removes whitespace from beginning and end
- Example: "  John Doe  " becomes "John Doe"
- Prevents accidental spaces causing validation issues

**`maxlength: [50, 'Name cannot be more than 50 characters']`**
- **First element (50)**: Maximum character limit
- **Second element (error message)**: Custom error if exceeded
- Prevents excessively long names

**Use Case:**
- User enters name during registration
- Trimmed and validated before saving to database
- Ensures clean, consistent data

---

### **Lines 12-21: Email Field Definition**
```javascript
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
```

**Field-by-Field Explanation:**

**`type: String`**
- Email stored as text

**`required: [true, 'Please add an email']`**
- Email is mandatory for user registration

**`unique: true`**
- **Critical for authentication!**
- Each email can only be registered once
- MongoDB creates unique index on this field
- Prevents duplicate accounts

**`lowercase: true`**
- Converts email to lowercase before saving
- Example: "John@EXAMPLE.COM" becomes "john@example.com"
- Ensures case-insensitive email matching during login

**`trim: true`**
- Removes whitespace from email
- Prevents " john@example.com " from being different than "john@example.com"

**`match: [regex, error message]`**
- **Regex Pattern**: `/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/`
- Validates email format before saving
- Must match pattern like: name@domain.com

**Regex Breakdown:**
- `^\w+` - Starts with word characters (letters, numbers, underscore)
- `([\.-]?\w+)*` - Optional dots or hyphens followed by word characters
- `@` - Must contain @ symbol
- `\w+` - Domain name (word characters)
- `([\.-]?\w+)*` - Optional subdomains
- `(\.\w{2,3})+` - Must end with .com, .net, .org, etc. (2-3 characters)
- `$` - End of string

**Example Valid Emails:**
- john.doe@example.com ✅
- jane-doe@company.co.uk ✅
- user123@test.org ✅

**Example Invalid Emails:**
- john@example (missing domain extension) ❌
- @example.com (missing local part) ❌
- john..doe@example.com (double dots) ❌

---

### **Lines 22-27: Password Field Definition**
```javascript
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },
```

**Field-by-Field Explanation:**

**`type: String`**
- Password stored as hashed string (not plain text!)

**`required: [true, 'Please add a password']`**
- Password is mandatory

**`minlength: [6, 'Password must be at least 6 characters']`**
- Enforces minimum password length of 6 characters
- Security best practice (though 8+ is recommended in production)

**`select: false` ⚠️ CRITICAL SECURITY SETTING**
- **Prevents password from being returned in query results by default**
- When you query `User.find()` or `User.findById()`, password field is excluded
- Must explicitly request with `.select('+password')` if needed (e.g., during login)

**Security Importance:**
```javascript
// Normal query - password NOT included
const user = await User.findById(userId);
console.log(user); // { _id, name, email, createdAt } - NO password!

// Explicit selection - password included (used during login)
const user = await User.findOne({ email }).select('+password');
console.log(user); // { _id, name, email, password: '$2a$10$...', createdAt }
```

**Why This Matters:**
- Prevents accidental password leaks in API responses
- Even hashed passwords shouldn't be exposed unnecessarily
- Extra layer of security beyond hashing

---

### **Lines 28-31: CreatedAt Field**
```javascript
  createdAt: {
    type: Date,
    default: Date.now
  }
```

**Field-by-Field Explanation:**

**`type: Date`**
- Stores JavaScript Date object
- MongoDB stores as ISODate format

**`default: Date.now`**
- Automatically sets current timestamp when user is created
- `Date.now` is a function reference (no parentheses!)
- Called each time new document is created

**Use Cases:**
- Track when user registered
- Sort users by registration date
- Calculate account age

**Important Note:**
- Use `Date.now` not `Date.now()`
- `Date.now` - function reference, called each time ✅
- `Date.now()` - executed once, same value for all users ❌

---

### **Line 32: Close Schema Definition**
```javascript
});
```

**What it does:**
- Closes the schema object definition
- Schema configuration complete

---

### **Lines 34-43: Pre-Save Middleware for Password Hashing**
```javascript
// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

**This is WHERE THE PASSWORD HASHING MAGIC HAPPENS! 🔐**

**Line 35: Register Pre-Save Hook**
```javascript
userSchema.pre('save', async function(next) {
```

**What it does:**
- Registers middleware that runs **before** document is saved
- `'save'` - triggers on `.save()` operations (not `.findOneAndUpdate()`)
- `async function` - can use await for bcrypt operations
- `next` - callback to continue to next middleware or save operation

**Why it's needed:**
- Automatically hash password without manual intervention
- Runs every time user document is saved

---

**Line 36: Check if Password Changed**
```javascript
  if (!this.isModified('password')) {
```

**What it does:**
- `this.isModified('password')` checks if password field was changed
- Returns true if password is new or modified
- Returns false if updating other fields (name, email)

**Why it's needed:**
- **Avoid re-hashing already hashed passwords!**
- If user updates their name, don't re-hash password
- Only hash when password is actually new or changed

**Example Scenario:**
```javascript
// Scenario 1: User updates name - DON'T hash password
user.name = "New Name";
await user.save(); // isModified('password') = false, skip hashing

// Scenario 2: User changes password - DO hash password
user.password = "newpassword123";
await user.save(); // isModified('password') = true, hash it!
```

---

**Line 37: Skip Hashing if Not Modified**
```javascript
    next();
```

**What it does:**
- If password wasn't modified, call `next()` to skip to next middleware or save
- Early return from middleware

**Why early return?**
- If password unchanged, rest of this middleware is irrelevant
- Prevents unnecessary bcrypt operations

---

**Line 40: Generate Salt**
```javascript
  const salt = await bcrypt.genSalt(10);
```

**What it does:**
- Generates a random "salt" for password hashing
- `10` is the "cost factor" or "rounds"

**What is a Salt?**
- Random data added to password before hashing
- Makes each hashed password unique, even if passwords are the same
- Example:
  - User 1: password "test123" + salt "a9b3c2" = hash "x7f8g9..."
  - User 2: password "test123" + salt "k4m7n1" = hash "p2q5r8..."

**What is Cost Factor (10)?**
- Number of hashing iterations (2^10 = 1,024 rounds)
- Higher = more secure but slower
- 10 is good balance between security and performance
- 12-14 recommended for high-security applications

**Why await?**
- `genSalt()` is asynchronous (takes time)
- Must wait for salt generation to complete

---

**Line 41: Hash Password with Salt**
```javascript
  this.password = await bcrypt.hash(this.password, salt);
```

**What it does:**
- Takes plain text password (`this.password`)
- Hashes it with the generated salt
- Overwrites plain text password with hashed version

**Before:**
```javascript
this.password = "mypassword123" // Plain text ❌
```

**After:**
```javascript
this.password = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy" // Hashed ✅
```

**Hash Format Breakdown:**
- `$2a$` - bcrypt algorithm identifier
- `10$` - cost factor (10 rounds)
- `N9qo8uLOickgx2ZMRZoMye` - salt (encoded)
- `IjZAgcfl7p92ldGxad68LJZdL17lhWy` - actual hash

**Why await?**
- Hashing is computationally intensive (intentionally slow for security)
- Must wait for hashing to complete before saving

**Security Note:**
- Original password is completely lost after this
- Cannot reverse hash to get original password
- Must use `comparePassword()` method to verify

---

**Line 42: Close Middleware Function**
```javascript
});
```

**What it does:**
- Closes the pre-save middleware function
- Password hashing middleware complete

---

### **Lines 44-47: Compare Password Method**
```javascript
// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

**This is how we verify passwords during login! 🔑**

**Line 45: Define Instance Method**
```javascript
userSchema.methods.comparePassword = async function(enteredPassword) {
```

**What it does:**
- Adds custom method to all User model instances
- `methods` - available on individual documents (e.g., `user.comparePassword()`)
- `async function` - can use await for bcrypt operations
- `enteredPassword` - plain text password from login attempt

**Schema Methods vs. Statics:**
- **methods**: Called on document instances (e.g., `user.comparePassword()`)
- **statics**: Called on model itself (e.g., `User.findByEmail()`)

---

**Line 46: Compare Password with Hash**
```javascript
  return await bcrypt.compare(enteredPassword, this.password);
```

**What it does:**
- `bcrypt.compare()` - securely compares plain text password with hashed password
- `enteredPassword` - plain text from user (e.g., "mypassword123")
- `this.password` - hashed password from database (e.g., "$2a$10$...")
- Returns `true` if passwords match, `false` otherwise

**How bcrypt.compare() Works:**
1. Extracts salt from stored hash
2. Hashes entered password with same salt
3. Compares resulting hash with stored hash
4. Returns boolean result

**Usage Example:**
```javascript
// During login
const user = await User.findOne({ email: 'john@example.com' }).select('+password');
const isMatch = await user.comparePassword('mypassword123');

if (isMatch) {
  console.log('Login successful! ✅');
  // Generate JWT token
} else {
  console.log('Invalid password! ❌');
  // Return error
}
```

**Why Use bcrypt.compare() Instead of === ?**
```javascript
// WRONG! ❌ This will always be false
if (enteredPassword === user.password) { ... }

// RIGHT! ✅ Properly compares with bcrypt
const isMatch = await user.comparePassword(enteredPassword);
```

**Security Benefits:**
- Timing-safe comparison (prevents timing attacks)
- Automatically handles salt extraction
- No manual hash comparison needed

---

### **Line 49: Export User Model**
```javascript
module.exports = mongoose.model('User', userSchema);
```

**What it does:**
- `mongoose.model('User', userSchema)` - creates model from schema
- `'User'` - model name (also collection name in MongoDB)
- `userSchema` - schema definition we created above
- `module.exports` - makes model available to other files

**What Happens:**
1. Mongoose compiles schema into model
2. Model name 'User' becomes collection name 'users' in MongoDB (lowercase + pluralized)
3. Model can now be imported in other files

**Usage in Other Files:**
```javascript
// In authController.js
const User = require('../models/User');

// Create new user
const user = await User.create({ name, email, password });

// Find user
const user = await User.findOne({ email });

// Update user
const user = await User.findByIdAndUpdate(userId, { name: 'New Name' });

// Delete user
await User.findByIdAndDelete(userId);
```

**Model Capabilities:**
- `.create()` - insert new document
- `.find()` - query documents
- `.findOne()` - find single document
- `.findById()` - find by ObjectId
- `.findByIdAndUpdate()` - update document
- `.findByIdAndDelete()` - delete document
- Plus all instance methods we defined (e.g., `.comparePassword()`)

---

## 🔄 Complete User Registration Flow

```javascript
// 1. User submits registration form
const { name, email, password } = req.body;

// 2. Create user document with plain text password
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'mypassword123' // Plain text
});

// 3. Pre-save middleware automatically triggers:
//    - isModified('password') = true (new password)
//    - Generate salt
//    - Hash password with salt
//    - Replace plain text with hash

// 4. User saved to database with hashed password
// Database document:
// {
//   _id: ObjectId('...'),
//   name: 'John Doe',
//   email: 'john@example.com',
//   password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
//   createdAt: 2026-01-23T10:30:00.000Z
// }
```

---

## 🔑 Complete Login Flow

```javascript
// 1. User submits login form
const { email, password } = req.body;

// 2. Find user by email and explicitly select password
const user = await User.findOne({ email }).select('+password');

if (!user) {
  return res.status(401).json({ message: 'Invalid credentials' });
}

// 3. Compare entered password with hashed password
const isMatch = await user.comparePassword(password);

if (!isMatch) {
  return res.status(401).json({ message: 'Invalid credentials' });
}

// 4. Password correct - generate JWT token
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

// 5. Return token to client
res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
```

---

## 🔒 Security Features Demonstrated

### 1. **Password Hashing**
- Passwords never stored in plain text
- One-way hashing (cannot be reversed)
- Each password gets unique salt

### 2. **select: false on Password Field**
- Passwords excluded from queries by default
- Must explicitly request with `.select('+password')`
- Prevents accidental exposure in API responses

### 3. **Email Uniqueness**
- Prevents duplicate accounts
- MongoDB index ensures uniqueness at database level

### 4. **Input Validation**
- Name: required, trimmed, max 50 characters
- Email: required, unique, valid format, lowercase
- Password: required, minimum 6 characters

### 5. **Automatic Timestamp**
- Track user registration date
- Useful for auditing and analytics

---

## 📊 Field Summary Table

| Field | Type | Required | Unique | Default | Validation |
|-------|------|----------|--------|---------|------------|
| name | String | ✅ | ❌ | - | Max 50 chars, trimmed |
| email | String | ✅ | ✅ | - | Valid email format, lowercase, trimmed |
| password | String | ✅ | ❌ | - | Min 6 chars, select: false |
| createdAt | Date | ❌ | ❌ | Date.now | - |

---

## 🎯 Common Operations

### Create User
```javascript
const user = await User.create({
  name: 'Jane Smith',
  email: 'jane@example.com',
  password: 'password123'
});
// Password automatically hashed before saving
```

### Find User (Password Excluded)
```javascript
const user = await User.findById(userId);
console.log(user);
// { _id, name, email, createdAt } - NO password
```

### Find User with Password (For Login)
```javascript
const user = await User.findOne({ email }).select('+password');
console.log(user);
// { _id, name, email, password: '$2a$10$...', createdAt }
```

### Verify Password
```javascript
const isMatch = await user.comparePassword(enteredPassword);
if (isMatch) {
  // Login successful
}
```

### Update User Name (Password Not Re-hashed)
```javascript
user.name = 'Jane Doe';
await user.save();
// isModified('password') = false, skip hashing
```

### Change Password (Automatically Re-hashed)
```javascript
user.password = 'newpassword456';
await user.save();
// isModified('password') = true, hash new password
```

---

## ⚠️ Common Pitfalls

### 1. **Forgetting .select('+password') During Login**
```javascript
// WRONG - password will be undefined
const user = await User.findOne({ email });
await user.comparePassword(password); // ERROR: password is undefined

// RIGHT - explicitly select password
const user = await User.findOne({ email }).select('+password');
await user.comparePassword(password); // Works!
```

### 2. **Using Date.now() Instead of Date.now**
```javascript
// WRONG - same timestamp for all users
createdAt: { type: Date, default: Date.now() }

// RIGHT - function reference, called each time
createdAt: { type: Date, default: Date.now }
```

### 3. **Comparing Passwords with ===**
```javascript
// WRONG - comparing plain text with hash
if (password === user.password) { ... } // Always false

// RIGHT - use bcrypt.compare()
const isMatch = await user.comparePassword(password);
```

### 4. **Updating Password with findOneAndUpdate()**
```javascript
// WRONG - pre-save middleware won't run
await User.findOneAndUpdate({ _id }, { password: 'newpass' });
// Password saved as plain text! ❌

// RIGHT - use .save() to trigger middleware
user.password = 'newpass';
await user.save(); // Pre-save middleware runs, password hashed ✅
```

---

## 🧪 Testing Examples

### Test User Creation
```javascript
const user = await User.create({
  name: 'Test User',
  email: 'test@example.com',
  password: 'test123'
});

console.log(user.password); // Hashed: $2a$10$...
console.log(user.password !== 'test123'); // true - password hashed
```

### Test Password Comparison
```javascript
const isMatch1 = await user.comparePassword('test123'); // true ✅
const isMatch2 = await user.comparePassword('wrongpass'); // false ❌
```

### Test Email Validation
```javascript
try {
  await User.create({ name: 'Test', email: 'invalid-email', password: '123456' });
} catch (error) {
  console.log(error.message); // 'Please add a valid email'
}
```

### Test Unique Email Constraint
```javascript
await User.create({ name: 'User1', email: 'same@example.com', password: '123456' });

try {
  await User.create({ name: 'User2', email: 'same@example.com', password: '123456' });
} catch (error) {
  console.log(error.code); // 11000 - Duplicate key error
}
```

---

## 🎓 Key Takeaways

1. **Mongoose Schema** defines document structure with validation
2. **bcrypt hashing** ensures password security
3. **Pre-save middleware** automatically hashes passwords
4. **select: false** prevents password leaks in queries
5. **Instance methods** add custom functionality to documents
6. **Email uniqueness** prevents duplicate accounts
7. **isModified()** check prevents unnecessary re-hashing

---

## 📚 Related Files

- [backend-middleware-auth.md](backend-middleware-auth.md) - Uses User model for authentication
- [backend-controllers-auth.md](backend-controllers-auth.md) - User registration and login
- [backend-config-db.md](backend-config-db.md) - MongoDB connection for storing users

---

*This User model is the foundation of the authentication system in this MERN bug tracking application!* 🚀
