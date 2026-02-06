import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import EnhancedTicketForm from '../components/EnhancedTicketForm';
import ScreenshotUpload from '../components/ScreenshotUpload';
import AttachmentManager from '../components/AttachmentManager';
import RoleGuard from '../components/RoleGuard';
import { ROLES, hasPermission, getRoleDisplayName, getRoleColor } from '../utils/roles';
import { Shield, Upload, FileText, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

const DemoPage = () => {
  const { user } = useAuth();
  const [currentRole, setCurrentRole] = useState(user?.role || ROLES.MEMBER);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showDemoAttachments, setShowDemoAttachments] = useState(true);

  // Demo attachments
  const demoAttachments = [
    {
      id: '1',
      name: 'screenshot-bug-1.png',
      size: 1024576,
      type: 'image/png',
      status: 'uploaded',
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'John Doe'
    },
    {
      id: '2', 
      name: 'error-log.txt',
      size: 5120,
      type: 'text/plain',
      status: 'uploaded',
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Jane Smith'
    },
    {
      id: '3',
      name: 'feature-spec.pdf',
      size: 2048576,
      type: 'application/pdf',
      status: 'uploaded',
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Bob Johnson'
    }
  ];

  const handleRoleChange = (role) => {
    setCurrentRole(role);
  };

  const handleTicketSubmit = async (ticketData) => {
    console.log('Ticket submitted:', ticketData);
    alert('Ticket submitted successfully! (Check console for details)');
  };

  const handleFileDownload = async (attachment) => {
    console.log('Downloading file:', attachment);
    alert(`Downloading ${attachment.name}...`);
  };

  const handleFileDelete = async (attachment) => {
    console.log('Deleting file:', attachment);
    alert(`Deleted ${attachment.name}`);
  };

  const handleFileView = (attachment) => {
    console.log('Viewing file:', attachment);
    alert(`Viewing ${attachment.name}`);
  };

  const roles = [
    { id: ROLES.MEMBER, name: 'Member', description: 'Can view tickets and add comments' },
    { id: ROLES.CORE, name: 'Core Member', description: 'Can create tickets and upload attachments' },
    { id: ROLES.ADMIN, name: 'Administrator', description: 'Full system access' }
  ];

  return (
    <div className="min-h-screen bg-[#0b1220] px-4 py-8">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-400 mb-2">Role-Based Access & File Upload Demo</h1>
          <p className="text-lg text-purple-100">Test different roles and file upload functionality</p>
        </div>

        {/* Role Selector */}
        <div className="bg-slate-900/85 rounded-2xl p-8 shadow-2xl border border-slate-800 mb-8">
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-orange-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Current Role Simulation</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleChange(role.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  currentRole === role.id
                    ? 'border-orange-500 bg-orange-500/20'
                    : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getRoleColor(role.id)}`}>
                    {role.name}
                  </span>
                  {currentRole === role.id && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-gray-300 text-left">{role.description}</p>
              </button>
            ))}
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-sm text-gray-300">
              <span className="font-medium text-white">Current Role:</span>{' '}
              <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getRoleColor(currentRole)}`}>
                {getRoleDisplayName(currentRole)}
              </span>
            </p>
          </div>
        </div>

        {/* Permissions Overview */}
        <div className="bg-slate-900/85 rounded-2xl p-8 shadow-2xl border border-slate-800 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Role Permissions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { permission: 'view_tickets', label: 'View Tickets' },
              { permission: 'create_tickets', label: 'Create Tickets' },
              { permission: 'edit_own_tickets', label: 'Edit Own Tickets' },
              { permission: 'edit_all_tickets', label: 'Edit All Tickets' },
              { permission: 'delete_tickets', label: 'Delete Tickets' },
              { permission: 'upload_attachments', label: 'Upload Attachments' },
              { permission: 'assign_tickets', label: 'Assign Tickets' },
              { permission: 'manage_team', label: 'Manage Team' },
              { permission: 'view_reports', label: 'View Reports' },
              { permission: 'manage_settings', label: 'Manage Settings' }
            ].map(({ permission, label }) => (
              <div key={permission} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-sm text-gray-300">{label}</span>
                {hasPermission(currentRole, permission) ? (
                  <Eye className="w-4 h-4 text-green-500" />
                ) : (
                  <EyeOff className="w-4 h-4 text-red-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* File Upload Demo */}
        <div className="bg-slate-900/85 rounded-2xl p-8 shadow-2xl border border-slate-800 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Upload className="w-6 h-6 text-orange-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Screenshot Upload Demo</h2>
            </div>
            <RoleGuard
              userRole={currentRole}
              permissions={['upload_attachments']}
              renderFallback={false}
            >
              <span className="text-sm text-green-400">✓ You can upload files</span>
            </RoleGuard>
          </div>
          
          <RoleGuard
            userRole={currentRole}
            permissions={['upload_attachments']}
            fallback={
              <div className="text-center py-8 text-gray-400">
                <XCircle className="w-12 h-12 mx-auto mb-4" />
                <p>You don't have permission to upload attachments.</p>
                <p className="text-sm mt-2">Required role: Developer or higher</p>
              </div>
            }
          >
            <ScreenshotUpload
              onFilesChange={setUploadedFiles}
              maxFiles={3}
              maxSize={2 * 1024 * 1024} // 2MB for demo
            />
          </RoleGuard>
        </div>

        {/* Attachment Manager Demo */}
        <div className="bg-slate-900/85 rounded-2xl p-8 shadow-2xl border border-slate-800 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-orange-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Attachment Manager Demo</h2>
            </div>
            <button
              onClick={() => setShowDemoAttachments(!showDemoAttachments)}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              {showDemoAttachments ? 'Hide' : 'Show'} Demo Files
            </button>
          </div>
          
          {showDemoAttachments && (
            <AttachmentManager
              attachments={demoAttachments}
              onDownload={handleFileDownload}
              onDelete={handleFileDelete}
              onView={handleFileView}
              canDelete={hasPermission(currentRole, 'delete_tickets')}
              canDownload={hasPermission(currentRole, 'view_tickets')}
            />
          )}
        </div>

        {/* Ticket Form Demo */}
        <div className="bg-slate-900/85 rounded-2xl p-8 shadow-2xl border border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-6">Enhanced Ticket Form Demo</h2>
          
          <EnhancedTicketForm
            userRole={currentRole}
            userId={user?._id}
            onSubmit={handleTicketSubmit}
            onCancel={() => console.log('Cancelled')}
          />
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
