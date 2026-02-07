import React from 'react';
import AIAnalytics from '../components/AIAnalytics';

const Reports = () => {
  return (
    <div className="min-h-screen px-4">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">Reports</h1>
        <p className="text-sm text-gray-300 mb-6">System and project reports</p>
        {/* Reuse AI analytics for now */}
        <AIAnalytics />
      </div>
    </div>
  );
};

export default Reports;