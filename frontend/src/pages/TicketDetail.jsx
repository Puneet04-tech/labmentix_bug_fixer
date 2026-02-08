import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTicket } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import CommentSection from '../components/CommentSection';
import ActivityTimeline from '../components/ActivityTimeline';
import EditTicketModal from '../components/EditTicketModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentTicket, fetchTicket, updateTicket, assignTicket, deleteTicket } = useTicket();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadTicket();
  }, [id]);

  const loadTicket = async () => {
    await fetchTicket(id);
  };

  const handleUpdateTicket = async (formData) => {
    try {
      const updated = await updateTicket(id, formData);
      if (updated) {
        toast.success('✅ Ticket updated successfully!');
        setShowEditModal(false);
        await loadTicket(); // Reload ticket data
      }
    } catch (error) {
      toast.error('❌ Failed to update ticket');
      throw error;
    }
  };

  const handleAssign = async (userId) => {
    try {
      await assignTicket(id, userId);
      toast.success('✅ Ticket assignment updated!');
      await loadTicket();
    } catch (error) {
      toast.error('❌ Failed to update assignment');
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteTicket(id);
      if (success) {
        toast.success('✅ Ticket deleted successfully!');
        navigate('/tickets');
      }
    } catch (error) {
      toast.error('❌ Failed to delete ticket');
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'In Review': 'bg-purple-100 text-purple-800',
      'Resolved': 'bg-green-100 text-green-800',
    'Closed': 'bg-surface-100 dark:bg-surface-700 text-slate-800 dark:text-slate-100'
    };
    return colors[status] || 'bg-surface-100 dark:bg-surface-700 text-slate-800 dark:text-slate-100';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-surface-100 dark:bg-surface-700 text-slate-800 dark:text-slate-100';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Bug': '🐛',
      'Feature': '✨',
      'Improvement': '🔧',
      'Task': '📋'
    };
    return icons[type] || '📝';
  };

  if (!currentTicket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">Loading ticket...</p>
        </div>
      </div>
    );
  }

  // Robust checks for id equality (handle populated objects or raw ids)
  const reportedById = currentTicket.reportedBy?._id ? currentTicket.reportedBy._id : currentTicket.reportedBy;
  const ownerId = currentTicket.project.owner?._id ? currentTicket.project.owner._id : currentTicket.project.owner;
  const isReporter = reportedById === user._id;
  const isProjectOwner = ownerId === user._id;
  const isMember = Array.isArray(currentTicket.project.members)
    ? currentTicket.project.members.some(m => (m._id ? m._id === user._id : m === user._id))
    : false;

  const canEdit = isReporter || isProjectOwner || isMember;
  const canDelete = isReporter || isProjectOwner;

  // Get all project members for assignment (owner + members)
  const projectMembers = Array.isArray(currentTicket.project.members)
    ? currentTicket.project.members.map(member => {
        // Handle new structure with populated user
        if (member.user && member.user._id) {
          return {
            _id: member.user._id,
            name: member.user.name || 'Unknown User',
            email: member.user.email || ''
          };
        }
        // Handle old structure or outsider
        return {
          _id: member._id || member.email,
          name: member.name || 'Unknown User',
          email: member.email || ''
        };
      })
    : [];

  // Normalize owner object (could be id or populated object)
  const ownerObj = currentTicket.project.owner && currentTicket.project.owner.name
    ? currentTicket.project.owner
    : { _id: currentTicket.project.owner, name: currentTicket.project.owner?.toString() || 'Owner' };

  const allMembers = [ownerObj, ...projectMembers];

  return (
    <div className="min-h-screen relative">
      {/* Mossy Foggy Background */}
      <div className="fixed inset-0">
        {/* Primary Mossy Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900"></div>

        {/* Secondary Foggy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-600/40 via-emerald-500/30 to-teal-400/40"></div>

        {/* Accent Moss Layer */}
        <div className="absolute inset-0 bg-gradient-to-bl from-lime-500/25 via-green-500/20 to-emerald-500/25"></div>

        {/* Foggy Mesh Gradient */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background: `
              radial-gradient(circle at 15% 25%, rgba(16, 185, 129, 0.25) 0%, transparent 45%),
              radial-gradient(circle at 85% 15%, rgba(34, 197, 94, 0.20) 0%, transparent 40%),
              radial-gradient(circle at 35% 75%, rgba(132, 204, 22, 0.30) 0%, transparent 50%),
              radial-gradient(circle at 75% 65%, rgba(20, 184, 166, 0.18) 0%, transparent 35%),
              radial-gradient(circle at 50% 40%, rgba(56, 189, 248, 0.15) 0%, transparent 55%),
              radial-gradient(circle at 20% 85%, rgba(2, 132, 199, 0.22) 0%, transparent 45%),
              radial-gradient(circle at 90% 35%, rgba(45, 212, 191, 0.19) 0%, transparent 40%),
              radial-gradient(circle at 10% 50%, rgba(16, 185, 129, 0.24) 0%, transparent 45%),
              radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.21) 0%, transparent 40%),
              radial-gradient(circle at 60% 20%, rgba(132, 204, 22, 0.26) 0%, transparent 50%),
              radial-gradient(circle at 25% 70%, rgba(5, 150, 105, 0.17) 0%, transparent 35%),
              radial-gradient(circle at 70% 45%, rgba(20, 184, 166, 0.16) 0%, transparent 55%),
              radial-gradient(circle at 45% 85%, rgba(13, 148, 136, 0.23) 0%, transparent 45%),
              radial-gradient(circle at 95% 60%, rgba(6, 182, 212, 0.20) 0%, transparent 40%)
            `
          }}
        ></div>

        {/* Mossy Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-8"
          style={{
            backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPGcgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiPgogICAgICA8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz4KICAgIDwvZz4KICA8L2cT4KPC9zdmc+")`,
            backgroundSize: '60px 60px'
          }}
        ></div>

        {/* Foggy Glass Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/tickets" className="text-primary-600 hover:text-primary-800 mb-4 inline-flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Tickets</span>
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{getTypeIcon(currentTicket.type)}</span>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center">{currentTicket.title}</h1>
            </div>
            <div className="flex gap-2 mt-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentTicket.status)}`}>
                {currentTicket.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(currentTicket.priority)}`}>
                {currentTicket.priority}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-surface-100 dark:bg-surface-700 text-slate-600 dark:text-slate-200">
                {currentTicket.type}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {canEdit && (
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition font-medium flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit</span>
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition font-medium flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0f1724] rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-100 mb-4 text-center">📝 Description</h2>
            <p className="text-slate-300 whitespace-pre-wrap">{currentTicket.description}</p>
          </div>

          {/* Attachments */}
          {currentTicket.attachments && currentTicket.attachments.length > 0 && (
            <div className="bg-[#0f1724] rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-slate-100 mb-4 text-center">📎 Attachments</h2>
              <div className="space-y-3">
                {currentTicket.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 text-slate-400">
                        {attachment.type && attachment.type.startsWith('image/') ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-100 truncate">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {(attachment.size / 1024).toFixed(1)} KB • {attachment.type}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${attachment.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <ActivityTimeline ticketId={id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <div className="bg-[#0f1724] rounded-xl shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4">📋 Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Project</p>
                <Link 
                  to={`/projects/${currentTicket.project._id}`}
                  className="text-primary-600 hover:text-primary-800 font-medium"
                >
                  {currentTicket.project.name}
                </Link>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Reported By</p>
                <p className="font-medium text-slate-800 dark:text-slate-100">{currentTicket.reportedBy.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{currentTicket.reportedBy.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Created</p>
                <p className="text-slate-700 dark:text-slate-300">{new Date(currentTicket.createdAt).toLocaleString()}</p>
              </div>
              {currentTicket.dueDate && (
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Due Date</p>
                  <p className="text-slate-700 dark:text-slate-300">{new Date(currentTicket.dueDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Assignment */}
          <div className="bg-[#0f1724] rounded-xl shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-100 mb-4">👤 Assignment</h3>
            {currentTicket.assignedTo ? (
              <div className="mb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Assigned To</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {currentTicket.assignedTo.name || currentTicket.assignedTo.email || 'Unknown User'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {currentTicket.assignedTo.email || 'No email'}
                </p>
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 mb-4 italic">Unassigned</p>
            )}

            {canEdit && (
              <div>
                <label className="block text-sm text-slate-400 font-medium mb-2">Change Assignment</label>
                <select
                  onChange={(e) => handleAssign(e.target.value || null)}
                  value={currentTicket.assignedTo?._id || currentTicket.assignedTo || ''}
                  className="w-full px-3 py-2 border border-slate-700 bg-[#0f1724] text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Unassigned</option>
                  {allMembers.map(m => (
                    <option key={m._id} value={m._id}>{m.name} {m.email ? `(${m.email})` : ''}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Authorization Info */}
          <div className="bg-[#122433] border border-slate-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-slate-100 mb-2">🔐 Permissions</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              {isReporter && <li>• You reported this ticket</li>}
              {isProjectOwner && <li>• You own this project</li>}
              {canEdit && <li>• You can edit this ticket</li>}
              {canDelete && <li>• You can delete this ticket</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-6">
        <CommentSection ticketId={id} />
      </div>

      {/* Modals */}
      <EditTicketModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        ticket={currentTicket}
        onSubmit={handleUpdateTicket}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Ticket"
        message="Are you sure you want to delete this ticket? This will remove all associated comments and activity history."
        itemName={currentTicket.title}
        isDeleting={isDeleting}
      />
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
