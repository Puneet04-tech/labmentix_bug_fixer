# TicketDetail.jsx - Frontend Page Line-by-Line Explanation

## Overview
Detailed ticket view page with inline editing, assignment management, permission-based actions, modals, and comment/activity sections.

## Key Features
- Display full ticket details
- Permission checks (isReporter, isProjectOwner, canEdit, canDelete)
- EditTicketModal for updating ticket
- DeleteConfirmationModal for safe deletion
- Assignment dropdown (change assignedTo)
- CommentSection component
- ActivityTimeline component
- Breadcrumb navigation

## Line-by-Line Analysis

### Lines 1-9: Imports
```jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTicket } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import CommentSection from '../components/CommentSection';
import ActivityTimeline from '../components/ActivityTimeline';
import EditTicketModal from '../components/EditTicketModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
```
- **useParams**: Extract ticket ID from URL
- **4 child components**: CommentSection, ActivityTimeline, EditTicketModal, DeleteConfirmationModal

### Lines 13-18: State Management
```jsx
const { id } = useParams();
const { currentTicket, fetchTicket, updateTicket, assignTicket, deleteTicket } = useTicket();

const [showEditModal, setShowEditModal] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
```
- **id**: Ticket ID from URL params (/tickets/:id)
- **currentTicket**: Single ticket object from TicketContext
- **Modal states**: Control visibility of edit/delete modals
- **isDeleting**: Disable delete button during deletion

### Lines 20-23: Load Ticket on Mount
```jsx
useEffect(() => {
  loadTicket();
}, [id]);
```
- **Dependency [id]**: Reload when ticket ID changes
- **loadTicket()**: Wrapper function for fetchTicket(id)

### Lines 30-44: Update Ticket Handler
```jsx
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
```
- **Close modal on success**: `setShowEditModal(false)`
- **Reload ticket**: Ensures UI reflects changes (might have calculated fields)
- **Throw error**: Allows EditTicketModal to handle errors

### Lines 46-55: Assignment Handler
```jsx
const handleAssign = async (userId) => {
  try {
    await assignTicket(id, userId);
    toast.success('✅ Ticket assignment updated!');
    await loadTicket();
  } catch (error) {
    toast.error('❌ Failed to update assignment');
  }
};
```
- **userId can be null**: Unassign ticket
- **Reload after assign**: Update assignedTo in UI

### Lines 57-72: Delete Handler
```jsx
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
```
- **setIsDeleting(true)**: Disable button, show loading
- **Navigate on success**: Redirect to tickets list (ticket no longer exists)
- **Reset on error**: Re-enable delete button if failed

### Lines 113-120: Permission Checks (CRITICAL)
```jsx
const isReporter = currentTicket.reportedBy._id === user._id;
const isProjectOwner = currentTicket.project.owner === user._id;
const canEdit = isReporter || isProjectOwner || currentTicket.project.members?.some(m => m === user._id);
const canDelete = isReporter || isProjectOwner;
```
- **isReporter**: User created this ticket
- **isProjectOwner**: User owns the project
- **canEdit**: Reporter OR Owner OR Project Member
  - `.some(m => m === user._id)`: Check if user ID is in members array
- **canDelete**: Only Reporter OR Owner
- **More restrictive delete**: Members can edit but not delete

### Lines 150-182: Edit/Delete Buttons
```jsx
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
```
- **Conditional rendering**: Buttons only show if user has permission
- **SVG icons**: Inline edit and delete icons

### Lines 234-254: Assignment Dropdown
```jsx
<div className="bg-white rounded-lg shadow-md p-6">
  <h3 className="text-lg font-bold text-gray-900 mb-4">👤 Assignment</h3>
  {currentTicket.assignedTo ? (
    <div className="mb-4">
      <p className="text-sm text-gray-500 mb-1">Assigned To</p>
      <p className="font-medium text-gray-900">{currentTicket.assignedTo.name}</p>
      <p className="text-sm text-gray-500">{currentTicket.assignedTo.email}</p>
    </div>
  ) : (
    <p className="text-gray-500 mb-4 italic">Unassigned</p>
  )}
  
  {canEdit && (
    <div>
      <label className="block text-sm text-gray-700 font-medium mb-2">Change Assignment</label>
      <select
        onChange={(e) => handleAssign(e.target.value || null)}
        value={currentTicket.assignedTo?._id || ''}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
      >
        <option value="">Unassigned</option>
        {/* Note: Would need to fetch project members here */}
      </select>
    </div>
  )}
</div>
```
- **Display current**: Show assignedTo name and email if exists
- **Dropdown only for canEdit**: Assignment control requires edit permission
- **e.target.value || null**: Empty string becomes null (unassign)
- **Note in code**: Need to fetch project members for dropdown options

### Lines 256-270: Permission Info Box
```jsx
<div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
  <h4 className="text-sm font-semibold text-primary-900 mb-2">🔐 Permissions</h4>
  <ul className="text-sm text-primary-800 space-y-1">
    {isReporter && <li>• You reported this ticket</li>}
    {isProjectOwner && <li>• You own this project</li>}
    {canEdit && <li>• You can edit this ticket</li>}
    {canDelete && <li>• You can delete this ticket</li>}
  </ul>
</div>
```
- **Educational**: Shows user why they have/don't have permissions
- **Conditional list items**: Only show relevant permissions

### Lines 276-291: Modals
```jsx
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
```
- **EditTicketModal**: Pre-filled form with current ticket data
- **DeleteConfirmationModal**: Reusable confirmation dialog
  - Shows ticket title in confirmation
  - Disables during deletion

## Related Files
- **TicketContext.jsx**: Provides currentTicket, updateTicket, assignTicket, deleteTicket
- **EditTicketModal.jsx**: Modal form component
- **DeleteConfirmationModal.jsx**: Reusable delete confirmation
- **CommentSection.jsx**: Comments display and posting
- **ActivityTimeline.jsx**: Activity history display

## Permission Logic Summary

| Permission | Condition | Allows |
|------------|-----------|--------|
| isReporter | reportedBy._id === user._id | Edit, Delete |
| isProjectOwner | project.owner === user._id | Edit, Delete |
| isMember | user._id in project.members | Edit only |
| canEdit | isReporter OR isProjectOwner OR isMember | Edit button, Assignment dropdown |
| canDelete | isReporter OR isProjectOwner | Delete button |

## Component Hierarchy
```
TicketDetail
├── Header (breadcrumb, title, badges, edit/delete buttons)
├── Main Content (2-column grid)
│   ├── Left Column
│   │   ├── Description card
│   │   └── ActivityTimeline
│   └── Right Column (Sidebar)
│       ├── Details card (project, reporter, dates)
│       ├── Assignment card (current + change dropdown)
│       └── Permissions info
├── CommentSection
└── Modals
    ├── EditTicketModal
    └── DeleteConfirmationModal
```

## State Management Pattern
- **currentTicket**: Single source of truth for ticket data
- **Load on mount**: `useEffect(() => loadTicket(), [id])`
- **Reload after mutations**: updateTicket, assignTicket both call loadTicket()
- **Navigate after delete**: Ticket no longer exists, must leave page
