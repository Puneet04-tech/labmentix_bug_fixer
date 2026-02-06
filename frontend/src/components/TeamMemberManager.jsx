import React, { useState } from 'react';
import { User, Mail, X, UserPlus, AlertCircle, BadgeCheck, UserX } from 'lucide-react';

const TeamMemberManager = ({ 
  project, 
  onMemberAdded, 
  onMemberRemoved,
  currentUser 
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Safety check
  if (!project || !currentUser) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-gray-500">
          <p>Unable to load team members</p>
        </div>
      </div>
    );
  }

  const handleAddMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${project._id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, name: name.trim() || undefined })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add member');
      }

      onMemberAdded?.(data.project);
      setEmail('');
      setName('');
      setShowAddForm(false);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${project._id}/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove member');
      }

      onMemberRemoved?.(data.project);
      
    } catch (err) {
      setError(err.message);
    }
  };

  const getMemberDisplayInfo = (member) => {
    // Handle new structure (member.user object)
    if (member.user) {
      return {
        _id: member.user._id,
        name: member.user.name,
        email: member.user.email,
        isOutsider: false,
        avatar: member.user.name.charAt(0).toUpperCase()
      };
    }
    // Handle old structure (direct member object with _id)
    else if (member._id) {
      // Check if explicitly marked as outsider
      if (member.isOutsider === true) {
        return {
          _id: member.email || member._id,
          name: member.name || member.email?.split('@')[0] || 'Outsider',
          email: member.email || 'No email',
          isOutsider: true,
          avatar: (member.name || member.email?.split('@')[0] || 'O').charAt(0).toUpperCase()
        };
      }
      // Regular registered user (old format)
      return {
        _id: member._id,
        name: member.name || 'Unknown User',
        email: member.email || 'No email',
        isOutsider: false,
        avatar: (member.name || 'U').charAt(0).toUpperCase()
      };
    }
    // Handle outsiders (email only, no _id)
    else if (member.email) {
      return {
        _id: member.email,
        name: member.name || member.email.split('@')[0],
        email: member.email,
        isOutsider: true,
        avatar: (member.name || member.email.split('@')[0]).charAt(0).toUpperCase()
      };
    }
    // Fallback for any other format
    else {
      return {
        _id: 'unknown',
        name: 'Unknown Member',
        email: 'No email',
        isOutsider: false,
        avatar: 'U'
      };
    }
  };

  const canManageMembers = project.owner && project.owner._id === currentUser._id;
  const membersArray = Array.isArray(project.members) ? project.members : [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Team Members
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {membersArray.length + 1} member{membersArray.length !== 0 ? 's' : ''}
          </p>
        </div>
        
        {canManageMembers && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        )}
      </div>

      {/* Add Member Form */}
      {showAddForm && canManageMembers && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleAddMember} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name (Optional - for outsiders)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Adding...' : 'Add Member'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEmail('');
                  setName('');
                  setError('');
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members List */}
      <div className="space-y-3">
        {/* Project Owner */}
        <div className="flex items-center justify-between p-3 solid-card rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              {project.owner.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {project.owner.name}
                </p>
                <BadgeCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm muted">
                {project.owner.email}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
              Owner
            </span>
          </div>
        </div>

        {/* Team Members */}
        {membersArray.map((member) => {
          const memberInfo = getMemberDisplayInfo(member);
          return (
            <div
              key={memberInfo._id}
              className="flex items-center justify-between p-3 solid-card rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  memberInfo.isOutsider 
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {memberInfo.avatar}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {memberInfo.name}
                    </p>
                    {memberInfo.isOutsider ? (
                      <UserX className="w-4 h-4 text-orange-500" />
                    ) : (
                      <User className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <p className="text-sm muted">
                    {memberInfo.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {memberInfo.isOutsider && (
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs font-medium rounded-full">
                    Outsider
                  </span>
                )}
                
                {canManageMembers && (
                  <button
                    onClick={() => handleRemoveMember(memberInfo._id)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Remove member"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {membersArray.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No team members yet</p>
            {canManageMembers && (
              <p className="text-sm mt-1">Click "Add Member" to invite someone</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMemberManager;
