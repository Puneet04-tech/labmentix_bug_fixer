# Register.jsx - Frontend Page Line-by-Line Explanation

## Overview
User registration page with fields for name, email, password, confirmPassword, and **role** (plus optional adminKey). Includes password matching validation and redirect logic.

## Key Features
- Name, email, password, confirm password fields
- **Role selection** (`member`, `core`, `admin`) during registration
- Optional **Admin Key** input (required if registering as `admin`)
- Password matching validation
- Email format validation with regex
- Controlled form inputs
- Password strength requirement (min 6 characters)
- Redirect authenticated users to dashboard
- Navigation to login page

## Line-by-Line Analysis

### Lines 1-5: Imports
```jsx
import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
```
- **Similar to Login**: Same import pattern for form handling

### Technical Terms Glossary
- **Password confirmation**: UI-level check ensuring `password === confirmPassword` before sending to API.
- **Destructuring before submit**: Remove `confirmPassword` before sending payload to backend via `const { confirmPassword, ...registerData } = formData;`.

### Important Import & Syntax Explanations
- `register()` from `useAuth()` should return a normalized response object; handle `result.success` and common errors (email exists) gracefully.
- `navigate('/dashboard')` after registration relies on the AuthContext auto-logging in the user; ensure state is updated before navigation.
- Accessibility note: Use `aria-invalid` on inputs when validation fails and associate the error message via `aria-describedby`.

### Lines 10-17: Form State (6 Fields)
```jsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'member',
  adminKey: ''
});
const [errors, setErrors] = useState({});
```
- **Fields**: Name, email, password, confirmPassword, role, adminKey
- **role**: Default `member`; user can choose `member`, `core`, or `admin`
- **adminKey**: Required if role === `admin` (used to validate admin registration)

### Lines 19-29: Email Validation
```jsx
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```
- **Identical to Login**: Same email validation regex

### Lines 31-55: Form Validation with Password Matching
```jsx
const validate = () => {
  const newErrors = {};
  
  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
  } else if (formData.name.length < 2) {
    newErrors.name = 'Name must be at least 2 characters';
  }
  
  if (!formData.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    newErrors.email = 'Invalid email format';
  }
  
  if (!formData.password) {
    newErrors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters';
  }
  
  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }

  if (formData.role === 'admin' && !formData.adminKey.trim()) {
    newErrors.adminKey = 'Admin key is required to register as admin';
  }
  
  return newErrors;
};
```
- **Name validation**: Must be at least 2 characters
- **Email validation**: Format check with regex
- **Password validation**: Minimum 6 characters
- **Password match**: `formData.password !== formData.confirmPassword` ensures both passwords are identical
- **Admin key validation**: If `role === 'admin'`, `adminKey` must be present and non-empty
- **Critical check**: confirmPassword validation prevents typos during registration

### Lines 57-82: Form Submission
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  
  const { confirmPassword, ...registerData } = formData;
  const result = await register(registerData);
  
  if (result.success) {
    toast.success('✅ Registration successful! Logging you in...');
    navigate('/dashboard');
  } else {
    if (result.message?.includes('exists')) {
      setErrors({ ...errors, email: 'Email already registered' });
    }
    toast.error(result.message || 'Registration failed');
  }
};
```
- **Destructuring**: `const { confirmPassword, ...registerData } = formData;` removes confirmPassword from data sent to API
- **Why remove confirmPassword**: Backend doesn't need it (only validates on frontend)
- **Email exists check**: If error message contains "exists", set email field error
- **Auto-login**: On success, user is logged in and redirected to dashboard

### Lines 84-90: Input Change Handler
```jsx
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
  if (errors[e.target.name]) {
    setErrors({ ...errors, [e.target.name]: '' });
  }
};
```
- **Same as Login**: Dynamic field update with error clearing

### Lines 92-94: Redirect Authenticated Users
```jsx
if (user) {
  return <Navigate to="/dashboard" replace />;
}
```
- **Prevent double registration**: If user already logged in, redirect to dashboard

### Lines 96-220: JSX Template

### Lines 100-118: Name Input Field
```jsx
<div>
  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
    Full Name
  </label>
  <input
    type="text"
    id="name"
    name="name"
    value={formData.name}
    onChange={handleChange}
    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
      errors.name ? 'border-red-500' : 'border-gray-300'
    }`}
    placeholder="John Doe"
  />
  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
</div>
```
- **type="text"**: Plain text input for name
- **Placeholder**: Example of expected format
- **Conditional error**: Show name error message if exists

### Lines 120-138: Email Input Field
```jsx
<div>
  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
    Email Address
  </label>
  <input
    type="email"
    id="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
      errors.email ? 'border-red-500' : 'border-gray-300'
    }`}
    placeholder="john@example.com"
  />
  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
</div>
```
- **type="email"**: Browser validation for email format

### Lines 140-158: Password Input Field
```jsx
<div>
  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
    Password
  </label>
  <input
    type="password"
    id="password"
    name="password"
    value={formData.password}
    onChange={handleChange}
    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
      errors.password ? 'border-red-500' : 'border-gray-300'
    }`}
    placeholder="Min 6 characters"
  />
  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
</div>
```
- **Placeholder**: Shows minimum length requirement

### Lines 160-178: Confirm Password Field (CRITICAL)
```jsx
<div>
  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
    Confirm Password
  </label>
  <input
    type="password"
    id="confirmPassword"
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleChange}
    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
    }`}
    placeholder="Re-enter password"
  />
  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
</div>
```
- **confirmPassword field**: User must type password twice to prevent typos
- **Error message**: Shows "Passwords do not match" if they differ
- **Security measure**: Ensures user knows their password before registration

### Lines 180-187: Submit Button
```jsx
<button
  type="submit"
  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
>
  Sign Up
</button>
```
- **Submit button**: Triggers form validation and submission

### Lines 189-198: Login Link
```jsx
<div className="text-center">
  <p className="text-gray-600">
    Already have an account?{' '}
    <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
      Login
    </Link>
  </p>
</div>
```
- **Link to login**: For existing users to navigate to login page

## Related Files
- **AuthContext.jsx**: Provides register function
- **Login.jsx**: Login page for existing users
- **Dashboard.jsx**: Redirect destination after registration
- **backend/controllers/authController.js**: Handles registration API

## Validation Flow
1. User fills 4 fields (name, email, password, confirmPassword)
2. On submit, validate() checks all fields
3. Check password === confirmPassword (critical)
4. If valid, remove confirmPassword and call register()
5. If email exists, show specific error on email field
6. On success, navigate to dashboard

## Key Differences from Login
- **Extra field**: confirmPassword for verification
- **Password matching**: Validate both passwords are identical
- **Name validation**: Minimum 2 characters
- **Data transformation**: Remove confirmPassword before API call
- **Email exists error**: Special handling for duplicate email

## Security Features
- Password must match confirmPassword (prevents typos)
- Minimum password length (6 characters)
- Email format validation
- Duplicate email detection
