# Frontend Component: Sidebar.jsx - Complete Explanation

Navigation sidebar with menu items and quick actions.

## 📋 Overview
- **Lines**: 112
- **Purpose**: Main navigation menu
- **Responsive**: Slides in/out on mobile, always visible on desktop

---

## 🔑 Key Features

### **Menu Items (Lines 7-13)**
```jsx
const menuItems = [
  { name: 'Dashboard', icon: '📊', path: '/dashboard' },
  { name: 'Projects', icon: '📁', path: '/projects' },
  { name: 'Tickets', icon: '🎫', path: '/tickets' },
  { name: 'Kanban Board', icon: '📋', path: '/kanban' },
  { name: 'Analytics', icon: '📈', path: '/analytics' },
];
```

### **Active Route Detection (Lines 15-17)**
```jsx
const isActive = (path) => {
  return location.pathname === path || location.pathname.startsWith(path + '/');
};
```
**Highlights current route** and child routes (e.g., /projects and /projects/123)

### **Mobile Overlay (Lines 21-27)**
```jsx
{isOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
    onClick={toggleSidebar}
  ></div>
)}
```
**Dark overlay** when sidebar open on mobile, closes on click

### **Responsive Classes (Lines 30-35)**
```jsx
className={`fixed top-0 left-0 h-full bg-white shadow-xl z-30 transition-transform duration-300 ease-in-out ${
  isOpen ? 'translate-x-0' : '-translate-x-full'
} lg:translate-x-0 lg:static lg:z-0 w-64`}
```
- **Mobile**: Slides in/out with transform
- **Desktop (lg:)**: Always visible, static position

### **Navigation Links (Lines 64-77)**
```jsx
{menuItems.map((item) => (
  <Link
    key={item.path}
    to={item.path}
    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
      isActive(item.path)
        ? 'bg-primary-100 text-primary-700 font-semibold'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
  >
    <span className="text-2xl">{item.icon}</span>
    <span>{item.name}</span>
  </Link>
))}
```
**Closes sidebar on mobile** after clicking link

### **Quick Actions (Lines 80-102)**
```jsx
<Link to="/projects/create">
  <span className="text-2xl">➕</span>
  <span>New Project</span>
</Link>
<Link to="/tickets/create">
  <span className="text-2xl">🎟️</span>
  <span>New Ticket</span>
</Link>
```

---

## 🎯 Usage
```jsx
<Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
```

---

## 📚 Related Files
- [frontend-components-Layout.md](frontend-components-Layout.md) - Parent component
- [frontend-App.md](frontend-App.md) - Route definitions
