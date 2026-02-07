# frontend-page-TicketDetail.md

## Overview
The `TicketDetail.jsx` page displays detailed information for a single ticket with editing, assignment, and permission-based actions.

## File Location
```
frontend/src/pages/TicketDetail.jsx
```

## Dependencies - Detailed Import Analysis

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

### Import Statement Breakdown:
- **React Hooks**: `useState`, `useEffect` - State management and side effects
- **React Router**: `useParams`, `useNavigate`, `Link` - URL parameters, navigation, and links
- **Ticket Context**: `useTicket` - Ticket data and operations
- **Auth Context**: `useAuth` - User authentication and permissions
- **Toast Notifications**: `react-toastify` - User feedback for operations
- **Component Imports**: Multiple child components for modals and sections

## URL Parameter Extraction

```jsx
const { id } = useParams();
```

**Syntax Pattern**: Destructuring ticket ID from URL parameters.

## Context Hook Destructuring

```jsx
const { currentTicket, fetchTicket, updateTicket, assignTicket, deleteTicket } = useTicket();
```

**Syntax Pattern**: Destructuring multiple functions from context hook.

## Modal State Management

```jsx
const [showEditModal, setShowEditModal] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
```

**Syntax Pattern**: Separate state variables for different modal visibility states.

## Load Ticket Effect

```jsx
useEffect(() => {
  loadTicket();
}, [id]);
```

**Syntax Pattern**: Effect hook to load data when component mounts or ID changes.

## Async Update Handler with Toast

```jsx
const handleUpdateTicket = async (formData) => {
  try {
    const updated = await updateTicket(id, formData);
    if (updated) {
      toast.success('✅ Ticket updated successfully!');
      setShowEditModal(false);
      await loadTicket();
    }
  } catch (error) {
    toast.error('❌ Failed to update ticket');
    throw error;
  }
};
```

**Syntax Pattern**: Async function with success/error toast notifications and UI state updates.

## Assignment Handler

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

**Syntax Pattern**: Async assignment update with user feedback and data reload.

## Delete Confirmation Handler

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

**Syntax Pattern**: Async delete with loading state and navigation on success.

## Permission Checks

```jsx
const isReporter = currentTicket.reportedBy._id === user._id;
const isProjectOwner = currentTicket.project.owner === user._id;
const canEdit = isReporter || isProjectOwner || currentTicket.project.members?.some(m => m === user._id);
const canDelete = isReporter || isProjectOwner;
```

**Syntax Pattern**: Boolean permission flags using ID comparisons and array membership checks.

## Array Some Method for Membership

```jsx
currentTicket.project.members?.some(m => m === user._id)
```

**Syntax Pattern**: Array some method to check if user ID exists in members array.

## Conditional Rendering with Logical AND

```jsx
{canEdit && (
  <button onClick={() => setShowEditModal(true)}>
    Edit
  </button>
)}
```

**Syntax Pattern**: Permission-based conditional rendering.

## Select Value with Optional Chaining

```jsx
value={currentTicket.assignedTo?._id || ''}
```

**Syntax Pattern**: Safe property access with fallback for select value.

## Critical Code Patterns

### 1. URL Parameter Destructuring
```jsx
const { id } = useParams();
```
**Pattern**: Extracting route parameters from URL.

### 2. Modal State Management
```jsx
const [showModal, setShowModal] = useState(false);
```
**Pattern**: Boolean state for controlling modal visibility.

### 3. Async Operation with Toast Feedback
```jsx
const handleAction = async (data) => {
  try {
    await apiCall(data);
    toast.success('Success message');
    setShowModal(false);
    await reloadData();
  } catch (error) {
    toast.error('Error message');
  }
};
```
**Pattern**: Standard async operation with user feedback and UI updates.

### 4. Permission-Based Conditional Rendering
```jsx
{canEdit && <EditButton onClick={handleEdit} />}
```
**Pattern**: Using permission flags to control UI element visibility.

### 5. ID-Based Permission Checks
```jsx
const isOwner = item.owner._id === user._id;
const canEdit = isOwner || item.members?.some(m => m._id === user._id);
```
**Pattern**: Permission logic using user ID comparisons.

### 6. Array Membership Testing
```jsx
array?.some(item => item._id === targetId)
```
**Pattern**: Checking if user exists in array of IDs.

### 7. Safe Property Access in Forms
```jsx
value={data.optionalProperty?._id || ''}
```
**Pattern**: Optional chaining with fallback for form inputs.

### 8. Loading State During Async Operations
```jsx
const [isLoading, setIsLoading] = useState(false);
// In handler:
setIsLoading(true);
try {
  await operation();
} finally {
  setIsLoading(false);
}
```
**Pattern**: Loading state management for async operations.
