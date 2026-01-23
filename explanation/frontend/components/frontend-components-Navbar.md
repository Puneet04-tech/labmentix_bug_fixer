# Frontend Component: Navbar.jsx - Complete Explanation

Top navigation bar with search, user menu, and mobile toggle.

## 📋 Overview
- **Purpose**: Top app bar with user actions
- **Features**: Hamburger menu, search, notifications, user dropdown

---

## 🔑 Key Features

### **Hamburger Button (Mobile)**
```jsx
<button onClick={toggleSidebar} className="lg:hidden">
  <svg>...</svg>
</button>
```
**Visible only on mobile** to open sidebar

### **User Menu**
```jsx
const { user, logout } = useAuth();
<img src={user.avatar || '/default-avatar.png'} />
<span>{user.name}</span>
<button onClick={logout}>Logout</button>
```
Shows user info and logout button

---

## 📚 Related Files
- [frontend-components-Layout.md](frontend-components-Layout.md)
- [frontend-context-AuthContext.md](frontend-context-AuthContext.md)
