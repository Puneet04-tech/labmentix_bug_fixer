# Frontend Page: Register.jsx - Complete Explanation

User registration form.

## 📋 Overview
- **Purpose**: Create new user accounts
- **Features**: Form validation, password confirmation

---

## 🔑 Key Features

### **Form State**
```jsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});
```

### **Validation**
```jsx
if (formData.password !== formData.confirmPassword) {
  toast.error('Passwords do not match');
  return;
}
```

### **Submit**
```jsx
const result = await register(formData.name, formData.email, formData.password);
if (result.success) {
  navigate('/dashboard');
}
```

---

## 🎯 Usage
Public route: `/register`

---

## 📚 Related Files
- [frontend-context-AuthContext.md](frontend-context-AuthContext.md)
- [backend-controllers-auth.md](backend-controllers-auth.md)
