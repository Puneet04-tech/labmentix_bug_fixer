# 🚀 Role-Based Access & Screenshot Upload - Usage Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Role-Based Access Control](#role-based-access-control)
3. [Screenshot Upload System](#screenshot-upload-system)
4. [Attachment Management](#attachment-management)
5. [Enhanced Ticket Form](#enhanced-ticket-form)
6. [Demo Page](#demo-page)
7. [Integration Examples](#integration-examples)

---

## 🚀 Quick Start

### 1. Access the Demo Page
Navigate to `http://localhost:5173/demo` to test all features interactively.

### 2. Test Different Roles
- Click on role buttons (Viewer, Developer, Manager, Admin)
- Watch the UI change based on permissions
- Try different actions with each role

### 3. Upload Screenshots
- Select "Developer" role or higher
- Drag & drop files or click to browse
- Test file validation and limits

---

## 👥 Role-Based Access Control

### User Roles & Permissions

#### 🔍 **Viewer Role**
- ✅ View tickets
- ✅ View dashboard
- ✅ Add comments
- ❌ Create tickets
- ❌ Upload files
- ❌ Edit tickets

#### 💻 **Developer Role**
- ✅ All Viewer permissions
- ✅ Create tickets
- ✅ Edit own tickets
- ✅ Upload attachments
- ✅ Change ticket status
- ❌ Delete tickets
- ❌ Manage team

#### 👔 **Manager Role**
- ✅ All Developer permissions
- ✅ Edit all tickets
- ✅ Delete tickets
- ✅ Assign tickets
- ✅ View reports
- ✅ Manage team
- ❌ System settings

#### 🛡️ **Admin Role**
- ✅ All Manager permissions
- ✅ Manage users
- ✅ System settings
- ✅ Full system access

### Using Role Guards

```jsx
import RoleGuard from './components/RoleGuard';
import { hasPermission } from './utils/roles';

// Protect a component
<RoleGuard
  userRole={user.role}
  permissions={['create_tickets']}
  fallback={<div>Access Denied</div>}
>
  <CreateTicketButton />
</RoleGuard>

// Check permissions in code
if (hasPermission(user.role, 'delete_tickets')) {
  // Show delete button
}
```

### Role-Based UI Elements

The dashboard now shows different buttons based on role:

- **New Ticket** - Developer+
- **Team Management** - Manager+
- **Reports** - Manager+
- **Settings** - Admin only

---

## 📸 Screenshot Upload System

### Features
- **Drag & Drop** support
- **Multiple files** (up to 5)
- **File validation** (type, size)
- **Progress indicators**
- **Error handling**

### Supported File Types
- 📷 Images: JPG, PNG, GIF, WebP
- 📄 Documents: PDF
- 📊 Max size: 5MB per file
- 🔢 Max files: 5 per upload

### Using ScreenshotUpload Component

```jsx
import ScreenshotUpload from './components/ScreenshotUpload';

function MyComponent() {
  const handleFilesChange = (files) => {
    console.log('Files selected:', files);
  };

  return (
    <ScreenshotUpload
      onFilesChange={handleFilesChange}
      maxFiles={5}
      maxSize={5 * 1024 * 1024} // 5MB
      allowedTypes={['image/jpeg', 'image/png', 'application/pdf']}
    />
  );
}
```

### Upload Process
1. **Drag files** to the upload area or click "browse"
2. **Files are validated** automatically
3. **See file list** with size and type info
4. **Remove files** with the X button
5. **Files are ready** for form submission

---

## 📎 Attachment Management

### Features
- **View attachments** with file icons
- **Download files** with permission check
- **Delete attachments** (role-based)
- **File type detection**
- **Upload status tracking**

### Using AttachmentManager Component

```jsx
import AttachmentManager from './components/AttachmentManager';

function TicketAttachments({ ticket, userRole }) {
  const handleDownload = async (attachment) => {
    // Download logic here
  };

  const handleDelete = async (attachment) => {
    // Delete logic here
  };

  return (
    <AttachmentManager
      attachments={ticket.attachments}
      onDownload={handleDownload}
      onDelete={handleDelete}
      canDelete={hasPermission(userRole, 'delete_tickets')}
      canDownload={hasPermission(userRole, 'view_tickets')}
    />
  );
}
```

### Attachment Actions
- **👁️ View** - Preview images, download other files
- **⬇️ Download** - Download file to device
- **🗑️ Delete** - Remove attachment (requires permission)

---

## 📝 Enhanced Ticket Form

### Role-Based Fields
- **Basic fields** - Available to all roles
- **Status field** - Developer+ only
- **Assignment** - Manager+ only
- **Attachments** - Developer+ only

### Form Features
- **Real-time validation**
- **Error handling**
- **File integration**
- **Permission-based sections**

### Using EnhancedTicketForm

```jsx
import EnhancedTicketForm from './components/EnhancedTicketForm';

function CreateTicketPage() {
  const { user } = useAuth();

  const handleSubmit = async (ticketData) => {
    // Submit ticket with attachments
    console.log('Ticket data:', ticketData);
  };

  return (
    <EnhancedTicketForm
      userRole={user.role}
      userId={user._id}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/tickets')}
    />
  );
}
```

### Form Sections
1. **Basic Information** - Title, Type, Description
2. **Priority & Status** - Based on permissions
3. **Assignment** - Manager+ only
4. **Tags** - Categorization
5. **Attachments** - File upload section

---

## 🎮 Demo Page

### Access
Navigate to `/demo` to test all features interactively.

### Demo Features
1. **Role Switcher** - Test different user roles
2. **Permission Matrix** - See all permissions for each role
3. **File Upload Demo** - Test upload restrictions
4. **Attachment Manager** - Demo file management
5. **Ticket Form** - Test role-based form fields

### Testing Scenarios

#### Scenario 1: Viewer Role
- Try to create ticket → ❌ Access Denied
- Try to upload files → ❌ Permission Required
- View dashboard → ✅ Works
- Add comments → ✅ Works

#### Scenario 2: Developer Role
- Create ticket → ✅ Works
- Upload files → ✅ Works
- Edit own ticket → ✅ Works
- Delete ticket → ❌ Permission Required

#### Scenario 3: Manager Role
- Assign tickets → ✅ Works
- Delete tickets → ✅ Works
- View reports → ✅ Works
- Manage team → ✅ Works

#### Scenario 4: Admin Role
- All features → ✅ Works
- System settings → ✅ Works
- User management → ✅ Works

---

## 🔧 Integration Examples

### 1. Adding Role Guards to Existing Components

```jsx
// In your existing components
import RoleGuard from './components/RoleGuard';
import { hasPermission } from './utils/roles';

function TicketActions({ ticket, user }) {
  return (
    <div className="flex space-x-2">
      <RoleGuard
        userRole={user.role}
        permissions={['edit_own_tickets', 'edit_all_tickets']}
        requireAll={false}
      >
        <button>Edit Ticket</button>
      </RoleGuard>
      
      <RoleGuard
        userRole={user.role}
        permissions={['delete_tickets']}
      >
        <button>Delete Ticket</button>
      </RoleGuard>
    </div>
  );
}
```

### 2. Adding File Upload to Forms

```jsx
import ScreenshotUpload from './components/ScreenshotUpload';

function BugReportForm({ user }) {
  const [files, setFiles] = useState([]);

  return (
    <form>
      {/* Other form fields */}
      
      <RoleGuard
        userRole={user.role}
        permissions={['upload_attachments']}
      >
        <div className="mb-4">
          <label>Screenshots</label>
          <ScreenshotUpload
            onFilesChange={setFiles}
            maxFiles={3}
            maxSize={2 * 1024 * 1024}
          />
        </div>
      </RoleGuard>
      
      <button type="submit">Submit Bug Report</button>
    </form>
  );
}
```

### 3. Checking Permissions in Business Logic

```jsx
import { hasPermission, canEditTicket, canDeleteTicket } from './utils/roles';

function TicketService() {
  const updateTicket = (ticket, updates, user) => {
    if (!canEditTicket(user.role, ticket.createdBy, user._id)) {
      throw new Error('Insufficient permissions');
    }
    
    // Update logic here
  };

  const deleteTicket = (ticket, user) => {
    if (!canDeleteTicket(user.role)) {
      throw new Error('Insufficient permissions');
    }
    
    // Delete logic here
  };
}
```

---

## 🎯 Best Practices

### 1. Role Checks
- Always check permissions on both client and server
- Use RoleGuard components for UI protection
- Implement server-side validation for security

### 2. File Uploads
- Validate files on both client and server
- Scan uploaded files for security
- Store files in secure locations
- Implement file size limits

### 3. User Experience
- Show clear permission errors
- Provide helpful feedback
- Use loading states for file operations
- Implement progress indicators

### 4. Security
- Never trust client-side permission checks
- Validate all user inputs
- Implement rate limiting for uploads
- Use secure file storage

---

## 🆘 Troubleshooting

### Common Issues

#### 1. Permissions Not Working
```jsx
// Make sure user role is properly set
console.log('User role:', user.role);

// Check permission utility
import { hasPermission } from './utils/roles';
console.log('Can create ticket:', hasPermission(user.role, 'create_tickets'));
```

#### 2. File Upload Not Working
```jsx
// Check file permissions
console.log('Can upload:', hasPermission(user.role, 'upload_attachments'));

// Check file validation
const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
console.log('File type valid:', allowedTypes.includes(file.type));
console.log('File size valid:', file.size <= maxSize);
```

#### 3. Role Guard Not Hiding Content
```jsx
// Make sure to use the correct permission names
<RoleGuard
  userRole={user.role}
  permissions={['create_tickets']} // Check spelling
  renderFallback={false} // Set to true to see fallback
>
  <YourComponent />
</RoleGuard>
```

---

## 📞 Support

If you encounter any issues:

1. **Check the demo page** at `/demo` for testing
2. **Verify user role** is set correctly
3. **Check browser console** for errors
4. **Test with different roles** to isolate the issue
5. **Review permission names** in `utils/roles.js`

---

## 🎉 Conclusion

You now have a fully functional role-based access control system with screenshot upload capabilities! The system includes:

- ✅ 4 user roles with hierarchical permissions
- ✅ Drag & drop file upload with validation
- ✅ Attachment management with CRUD operations
- ✅ Role-based UI components
- ✅ Interactive demo page for testing
- ✅ Comprehensive error handling
- ✅ Dark theme integration

Start by visiting `/demo` to explore all features, then integrate them into your existing components using the examples provided above!
