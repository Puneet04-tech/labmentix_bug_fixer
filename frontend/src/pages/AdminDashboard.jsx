import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Settings, 
  Shield, 
  BarChart3, 
  Activity,
  UserPlus,
  Lock,
  Database,
  Bell,
  ChevronRight
} from 'lucide-react';
import UserManagement from '../components/UserManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      description: 'System statistics and overview'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      description: 'Manage users and roles'
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: 'Security settings and logs'
    },
    {
      id: 'system',
      label: 'System',
      icon: Settings,
      description: 'System configuration'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'overview':
        return <AdminOverview />;
      case 'security':
        return <SecuritySettings />;
      case 'system':
        return <SystemSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  System Management
                </p>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-l-4 border-purple-500'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.description}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <Activity className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Overview Component
const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalTickets: 0,
    activeUsers: 0
  });

  const quickActions = [
    {
      title: 'Add User',
      description: 'Invite new users to the system',
      icon: UserPlus,
      color: 'bg-blue-500',
      link: '/admin?tab=users'
    },
    {
      title: 'System Health',
      description: 'Check system performance and status',
      icon: Activity,
      color: 'bg-green-500',
      link: '/admin?tab=system'
    },
    {
      title: 'Security Audit',
      description: 'Review security settings and logs',
      icon: Lock,
      color: 'bg-red-500',
      link: '/admin?tab=security'
    },
    {
      title: 'Database',
      description: 'Manage database and backups',
      icon: Database,
      color: 'bg-purple-500',
      link: '/admin?tab=system'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Admin Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          System statistics and quick actions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.totalUsers}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Projects
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.totalProjects}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Tickets
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.totalTickets}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.activeUsers}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Recent System Activity
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">System running normally</span>
            <span className="text-gray-500 dark:text-gray-500 ml-auto">2 min ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">New user registration</span>
            <span className="text-gray-500 dark:text-gray-500 ml-auto">15 min ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Database backup completed</span>
            <span className="text-gray-500 dark:text-gray-500 ml-auto">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Security Settings Component
const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Security Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage security configurations and access controls
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Access Control
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Require 2FA for admin accounts
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Configure
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Session Timeout
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Auto-logout after inactivity
              </p>
            </div>
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>2 hours</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// System Settings Component
const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          System Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure system parameters and maintenance
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Database Management
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Database Backup
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last backup: 2 hours ago
              </p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Backup Now
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                System Maintenance
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Perform system cleanup and optimization
              </p>
            </div>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              Run Maintenance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
