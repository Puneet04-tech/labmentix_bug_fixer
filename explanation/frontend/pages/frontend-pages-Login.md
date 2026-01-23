# Frontend Page: Login.jsx - Complete Explanation

User login form with email and password.

## 📋 Overview
- **Purpose**: Authenticate users
- **Features**: Form validation, remember me, forgot password link

---

## 🔑 Key Features

### **Form State**
```jsx
const [formData, setFormData] = useState({
  email: '',
  password: '',
  rememberMe: false
});
```

### **Submit Handler**
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await login(formData.email, formData.password);
  if (result.success) {
    navigate('/dashboard');
  }
};
```

### **Form Fields**
```jsx
<input
  type="email"
  value={formData.email}
  onChange={(e) => setFormData({...formData, email: e.target.value})}
  required
/>
<input
  type="password"
  value={formData.password}
  onChange={(e) => setFormData({...formData, password: e.target.value})}
  required
/>
```

### **Remember Me**
```jsx
<input
  type="checkbox"
  checked={formData.rememberMe}
  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
/>
```

### **Links**
```jsx
<Link to="/register">Don't have an account? Sign up</Link>
<Link to="/forgot-password">Forgot password?</Link>
```

---

## 🎯 Usage
Public route: `/login`

---

## 📚 Related Files
- [frontend-context-AuthContext.md](frontend-context-AuthContext.md)
- [frontend-pages-Register.md](frontend-pages-Register.md)
- [backend-controllers-auth.md](backend-controllers-auth.md)
