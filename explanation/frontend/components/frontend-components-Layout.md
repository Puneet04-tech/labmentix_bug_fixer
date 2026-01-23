# Frontend Component: Layout.jsx - Complete Explanation

Application layout wrapper with sidebar, navbar, and main content area.

## 📋 Overview
- **Lines**: 35
- **Purpose**: Consistent layout structure for all authenticated pages
- **Features**: Responsive sidebar, navbar, breadcrumbs, content area

---

## 🔑 Complete Code

```jsx
import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
```

---

## 💡 Line-by-Line Explanation

### **Lines 6-7: Props**
```jsx
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
```
- **children**: Page content to render
- **sidebarOpen**: Controls mobile sidebar visibility (false = hidden)

---

### **Lines 9-11: Toggle Function**
```jsx
const toggleSidebar = () => {
  setSidebarOpen(!sidebarOpen);
};
```
**Passed to**:
- Navbar → Hamburger button
- Sidebar → Close button & overlay click

---

### **Line 14: Root Container**
```jsx
<div className="flex h-screen bg-gray-50">
```
- **flex**: Horizontal layout (sidebar + content)
- **h-screen**: Full viewport height (100vh)
- **bg-gray-50**: Light gray background

---

### **Line 16: Sidebar Component**
```jsx
<Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
```
- **isOpen**: Controls visibility on mobile
- **toggleSidebar**: Function to close sidebar

**Responsive behavior**:
- **Mobile (<1024px)**: Hidden by default, slides in when `isOpen=true`
- **Desktop (≥1024px)**: Always visible, ignores `isOpen`

---

### **Line 19: Main Content Wrapper**
```jsx
<div className="flex-1 flex flex-col overflow-hidden">
```
- **flex-1**: Take remaining space after sidebar
- **flex flex-col**: Vertical layout (navbar + content)
- **overflow-hidden**: Prevent scroll on wrapper (content area handles scrolling)

---

### **Line 21: Navbar**
```jsx
<Navbar toggleSidebar={toggleSidebar} />
```
- **toggleSidebar**: For hamburger menu button on mobile

---

### **Lines 24-30: Main Content Area**
```jsx
<main className="flex-1 overflow-y-auto">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <Breadcrumbs />
    {children}
  </div>
</main>
```

**Line 24: Scrollable Container**
- **flex-1**: Take remaining height
- **overflow-y-auto**: Enable vertical scrolling

**Line 25: Content Constraints**
- **max-w-7xl**: Max width 80rem (1280px)
- **mx-auto**: Center horizontally
- **px-4 sm:px-6 lg:px-8**: Responsive padding
  - Mobile: 1rem (16px)
  - Tablet: 1.5rem (24px)
  - Desktop: 2rem (32px)
- **py-6**: Vertical padding 1.5rem (24px)

**Lines 26-27**:
- **Breadcrumbs**: Navigation trail
- **children**: Actual page content

---

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────┐
│                  flex h-screen                      │
├───────────┬─────────────────────────────────────────┤
│           │           flex-1 flex-col               │
│           ├─────────────────────────────────────────┤
│           │           Navbar                        │
│  Sidebar  ├─────────────────────────────────────────┤
│  (fixed   │                                         │
│   width)  │        Main (overflow-y-auto)           │
│           │    ┌─────────────────────────────┐     │
│           │    │  max-w-7xl mx-auto          │     │
│           │    │  Breadcrumbs                │     │
│           │    │  {children}                 │     │
│           │    │                             │     │
│           │    │  (scrolls if content long)  │     │
│           │    └─────────────────────────────┘     │
└───────────┴─────────────────────────────────────────┘
```

---

## 📱 Responsive Behavior

### **Desktop (≥1024px)**
```
┌──────────┬────────────────────────────────┐
│          │  Navbar                        │
│ Sidebar  ├────────────────────────────────┤
│ (always  │                                │
│ visible) │  Content (max-w-7xl centered)  │
│          │                                │
└──────────┴────────────────────────────────┘
```

### **Mobile (<1024px) - Sidebar Closed**
```
┌────────────────────────────────────────┐
│  Navbar (with hamburger icon)         │
├────────────────────────────────────────┤
│                                        │
│  Content (full width)                  │
│                                        │
└────────────────────────────────────────┘
```

### **Mobile (<1024px) - Sidebar Open**
```
┌──────────────────────────────────────┐
│ ■ Overlay (dark)                     │
│ ┌─────────┐                          │
│ │ Sidebar │  Content (dimmed)        │
│ │ (slides │                          │
│ │  from   │                          │
│ │  left)  │                          │
│ └─────────┘                          │
└──────────────────────────────────────┘
```

---

## 🎯 Usage Examples

### **Basic Usage**
```jsx
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}
```

### **With ProtectedRoute**
```jsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Layout>
        <Dashboard />
      </Layout>
    </ProtectedRoute>
  } 
/>
```

### **Multiple Pages**
```jsx
<Routes>
  <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
  <Route path="/projects" element={<Layout><Projects /></Layout>} />
  <Route path="/tickets" element={<Layout><Tickets /></Layout>} />
</Routes>
```

---

## 🔄 Sidebar Toggle Flow

```
User clicks hamburger (mobile)
    ↓
Navbar calls toggleSidebar()
    ↓
sidebarOpen = true
    ↓
Sidebar slides in from left
Overlay appears
    ↓
User clicks overlay or X button
    ↓
Sidebar calls toggleSidebar()
    ↓
sidebarOpen = false
    ↓
Sidebar slides out
Overlay disappears
```

---

## 🎨 Component Hierarchy

```
Layout
├── Sidebar
│   ├── Logo
│   ├── Navigation Links
│   ├── Quick Actions
│   └── Footer
├── Main Content Wrapper
    ├── Navbar
    │   ├── Hamburger Button
    │   ├── Search
    │   └── User Menu
    └── Main Content Area
        ├── Breadcrumbs
        └── {children} ← Your page content
```

---

## ⚡ Performance Considerations

### **Overflow Strategy**
```jsx
// Parent: overflow-hidden
<div className="flex-1 flex flex-col overflow-hidden">

// Child: overflow-y-auto
<main className="flex-1 overflow-y-auto">
```
**Why?**
- Parent prevents double scrollbars
- Child handles actual content scrolling
- Navbar stays fixed at top

### **Sidebar State**
- Only affects mobile view
- Desktop sidebar unaffected by state
- Minimal re-renders (only Layout, Sidebar, Navbar affected)

---

## 🧪 Testing Scenarios

### **1. Page Navigation**
```
Action: Navigate from Dashboard to Projects
Result: 
  - Breadcrumbs update
  - Children content changes
  - Sidebar active state updates
  - Layout structure remains
```

### **2. Mobile Sidebar Toggle**
```
Action: Click hamburger on mobile
Result:
  - sidebarOpen = true
  - Sidebar slides in
  - Overlay appears
  - Body scroll locked
```

### **3. Desktop Resize**
```
Action: Resize from mobile to desktop
Result:
  - Sidebar becomes always visible
  - Hamburger button hidden
  - sidebarOpen state ignored
```

### **4. Long Content Scrolling**
```
Action: Page with 3000px of content
Result:
  - Navbar stays fixed
  - Sidebar stays fixed
  - Only main content scrolls
```

---

## 📚 Related Files
- [frontend-components-Sidebar.md](frontend-components-Sidebar.md) - Navigation sidebar
- [frontend-components-Navbar.md](frontend-components-Navbar.md) - Top navigation
- [frontend-components-Breadcrumbs.md](frontend-components-Breadcrumbs.md) - Navigation trail
- [frontend-App.md](frontend-App.md) - Layout usage in routes
