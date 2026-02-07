import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';

const Settings = () => {
  const { user } = useAuth();

  // If admin, redirect to admin system settings tab
  if (user?.role === 'admin') {
    return <Navigate to="/admin?tab=system" replace />;
  }

  // Simple user settings placeholder for non-admins
  return (
    <div className="min-h-screen px-4">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">Settings</h1>
        <p className="text-sm text-gray-300 mb-6">Manage your profile and preferences</p>
        <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800">
          <p className="text-gray-300">Profile settings are coming soon. Meanwhile you can update your profile in the admin panel.</p>
          <div className="mt-4">
            <Link to="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;