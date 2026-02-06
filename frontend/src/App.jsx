import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { TicketProvider } from './context/TicketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { useTheme } from './context/ThemeContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminSetup from './pages/AdminSetup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import Tickets from './pages/Tickets';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import Analytics from './pages/Analytics';
import Kanban from './pages/Kanban';
import DemoPage from './pages/DemoPage';
import NotFound from './pages/NotFound';

// Components
import AIAssistant from './components/AIAssistant';
import AIAnalytics from './components/AIAnalytics';

function App() {
  const { theme } = useTheme();

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ProjectProvider>
          <TicketProvider>
            <div className={`min-h-screen bg-[#0b1220] text-slate-100`}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/admin-setup" element={<AdminSetup />} />
                
                {/* Admin Routes - No Layout, Full Screen */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* Protected Routes with Layout */}
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
                  path="/projects/:id/edit"
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
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AIAnalytics />
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
                  path="/demo"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <DemoPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                
                {/* 404 Not Found - Must be last */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ToastContainer position="top-right" autoClose={3000} />
              {/* AI Assistant - Global */}
              <AIAssistant />
            </div>
          </TicketProvider>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
