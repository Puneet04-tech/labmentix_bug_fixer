# frontend-page-Login.md

## Overview
The `Login.jsx` page provides email/password authentication with form validation and redirect logic.

## File Location
```
frontend/src/pages/Login.jsx
```

## Dependencies - Detailed Import Analysis

```jsx
import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
```

### Import Statement Breakdown:
- **React Hooks**: `useState`, `useEffect` - State management and side effects
- **React Router**: `useNavigate`, `Navigate`, `Link` - Navigation components
- **Auth Context**: `useAuth` - Authentication state and login function
- **Toast Notifications**: `toast` from react-toastify - User feedback

## Context Hook Destructuring

```jsx
const { user, login } = useAuth();
const navigate = useNavigate();
```

**Syntax Pattern**: Destructuring authentication state and navigation function.

## Form State Object

```jsx
const [formData, setFormData] = useState({
  email: '',
  password: ''
});
```

**Syntax Pattern**: Object state for form data with multiple fields.

## Validation State

```jsx
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
```

**Syntax Pattern**: Separate state for validation errors and loading state.

## Generic Change Handler

```jsx
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
  if (errors[name]) {
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  }
};
```

**Syntax Pattern**: Generic input handler using computed property names and error clearing.

## Form Validation Function

```jsx
const validateForm = () => {
  const newErrors = {};
  if (!formData.email) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email is invalid';
  }
  if (!formData.password) {
    newErrors.password = 'Password is required';
  }
  return newErrors;
};
```

**Syntax Pattern**: Validation function returning error object with conditional checks.

## Async Submit Handler

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  
  setIsSubmitting(true);
  try {
    const result = await login(formData);
    if (result.success) {
      toast.success('Login successful');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Login failed');
    }
  } catch (error) {
    toast.error('An error occurred during login');
  } finally {
    setIsSubmitting(false);
  }
};
```

**Syntax Pattern**: Async form submission with validation, error handling, and loading state.

## Conditional Redirect

```jsx
if (user) {
  return <Navigate to="/dashboard" replace />;
}
```

**Syntax Pattern**: Declarative redirect for authenticated users.

## Critical Code Patterns

### 1. Controlled Form Inputs
```jsx
const [formData, setFormData] = useState({ email: '', password: '' });
<input
  name="email"
  value={formData.email}
  onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
>
```
**Pattern**: React state controlling form input values.

### 2. Computed Property Names
```jsx
setFormData(prev => ({
  ...prev,
  [name]: value
}));
```
**Pattern**: Dynamic object property updates using bracket notation.

### 3. Form Validation
```jsx
const validateForm = () => {
  const newErrors = {};
  if (!formData.email) newErrors.email = 'Email is required';
  // ... more validations
  return newErrors;
};
```
**Pattern**: Validation function returning error object.

### 4. Async Error Handling
```jsx
try {
  const result = await login(formData);
  if (result.success) {
    // success
  } else {
    toast.error(result.message);
  }
} catch (error) {
  toast.error('An error occurred');
}
```
**Pattern**: Try-catch with both API response and network error handling.

### 5. Loading State Management
```jsx
const [isSubmitting, setIsSubmitting] = useState(false);
// ...
finally {
  setIsSubmitting(false);
}
```
**Pattern**: Boolean state for submit button disabling during async operations.
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  
  const result = await login(formData);
  if (result.success) {
    toast.success('✅ Login successful!');
    navigate('/dashboard');
  } else {
    toast.error(result.message || 'Login failed');
  }
};
```
- **e.preventDefault()**: Stop default form submission behavior
- **validate()**: Run validation checks
- **Object.keys(newErrors).length**: Check if errors exist
- **Early return**: Stop if validation fails
- **login(formData)**: Call AuthContext login function
- **result.success**: Check if login was successful
- **navigate('/dashboard')**: Redirect to dashboard on success
- **toast.error**: Show error message on failure

### Lines 64-68: Input Change Handler
```jsx
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
  if (errors[e.target.name]) {
    setErrors({ ...errors, [e.target.name]: '' });
  }
};
```
- **Spread operator**: Keep existing form data
- **[e.target.name]**: Dynamically set field (email or password)
- **Clear error**: Remove error message when user starts typing in that field
- **Real-time feedback**: Errors disappear as user corrects them

### Lines 70-72: Redirect Authenticated Users
```jsx
if (user) {
  return <Navigate to="/dashboard" replace />;
}
```
- **if (user)**: Check if user is already logged in
- **Navigate component**: Declarative redirect
- **replace prop**: Replace history entry instead of pushing new one (prevents back button issues)

### Lines 74-170: JSX Template
```jsx
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
```
- **min-h-screen**: Full viewport height
- **flex items-center justify-center**: Center content vertically and horizontally
- **bg-gradient-to-br**: Gradient background from top-left to bottom-right

### Lines 78-98: Email Input Field
```jsx
<input
  type="email"
  id="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
    errors.email ? 'border-red-500' : 'border-gray-300'
  }`}
  placeholder="Enter your email"
/>
{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
```
- **type="email"**: Browser validation for email format
- **value={formData.email}**: Controlled input (React state as source of truth)
- **onChange={handleChange}**: Update state on every keystroke
- **Conditional className**: Red border if error exists
- **Conditional rendering**: Show error message below input if errors.email exists

### Lines 100-120: Password Input Field
```jsx
<input
  type="password"
  id="password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
    errors.password ? 'border-red-500' : 'border-gray-300'
  }`}
  placeholder="Enter your password"
/>
```
- **type="password"**: Masks password input with dots/asterisks
- **Same pattern**: Controlled input with error handling

### Lines 122-129: Submit Button
```jsx
<button
  type="submit"
  className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
>
  Login
</button>
```
- **type="submit"**: Triggers form onSubmit event
- **w-full**: Full width button
- **hover:bg-primary-700**: Darker shade on hover

### Lines 131-140: Registration Link
```jsx
<div className="text-center">
  <p className="text-gray-600">
    Don't have an account?{' '}
    <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
      Sign up
    </Link>
  </p>
</div>
```
- **{' '}**: Add space before link
- **Link to="/register"**: Navigate to registration page without page reload

## Related Files
- **AuthContext.jsx**: Provides login function and user state
- **Register.jsx**: Registration page for new users
- **Dashboard.jsx**: Redirect destination after login
- **api.js**: Axios instance for API calls

## Validation Flow
1. User fills form
2. On submit, validate() runs
3. If errors, display them inline
4. If valid, call login() from AuthContext
5. On success, navigate to /dashboard
6. On failure, show toast error

## Security Features
- Password minimum length (6 characters)
- Email format validation
- Password field masks input
- JWT token stored in localStorage (via AuthContext)
