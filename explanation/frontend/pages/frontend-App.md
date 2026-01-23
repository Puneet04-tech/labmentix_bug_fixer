# Frontend: App.jsx - Complete Explanation

Main application component with routing.

## 📋 Overview
- **Purpose**: Root component with all routes
- **Features**: React Router, protected routes, context providers

---

## 🔑 Complete Structure

```jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { TicketProvider } from './context/TicketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import Tickets from './pages/Tickets';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import Kanban from './pages/Kanban';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProjectProvider>
          <TicketProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
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
              
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Projects />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/projects/create"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CreateProject />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/projects/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ProjectDetail />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/tickets"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Tickets />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/tickets/create"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CreateTicket />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/tickets/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TicketDetail />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/kanban"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Kanban />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Analytics />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TicketProvider>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
```

---

## 💡 Key Concepts

### **Context Providers Hierarchy**
```jsx
<AuthProvider>
  <ProjectProvider>
    <TicketProvider>
      {/* All components can access all 3 contexts */}
    </TicketProvider>
  </ProjectProvider>
</AuthProvider>
```
**Order matters**: AuthProvider outermost because Project and Ticket contexts depend on user

### **Protected Route Pattern**
```jsx
<ProtectedRoute>
  <Layout>
    <Dashboard />
  </Layout>
</ProtectedRoute>
```
**Wrapping order**:
1. ProtectedRoute - Check auth
2. Layout - Add sidebar/navbar
3. Page - Actual content

### **Route Specificity**
```jsx
<Route path="/projects/create" element={...} />  {/* More specific first */}
<Route path="/projects/:id" element={...} />      {/* Generic param second */}
```
**Always define specific paths before parameterized ones!**

### **Redirect Root**
```jsx
<Route path="/" element={<Navigate to="/dashboard" replace />} />
```
Automatically redirect `/` to `/dashboard`

---

## 📚 Related Files
- All page components
- All context providers
- [frontend-components-Layout.md](frontend-components-Layout.md)
- [frontend-components-ProtectedRoute.md](frontend-components-ProtectedRoute.md)
