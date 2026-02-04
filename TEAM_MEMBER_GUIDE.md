# Team Member Management with Outsider Support

## 🎯 Overview

The Bug Tracker now supports adding team members by email address. Unregistered email addresses are automatically treated as "Outsiders" with special badges.

## ✨ New Features

### 1. **Email-Based Member Addition**
- Add any team member by their email address
- No need to pre-register users
- Automatic detection of registered vs unregistered users

### 2. **Outsider System**
- Unregistered emails are marked as "Outsiders"
- Special orange badges to distinguish outsiders
- Optional name field for outsiders

### 3. **Enhanced UI Components**
- `TeamMemberManager` component for managing team members
- Visual distinction between owners, members, and outsiders
- Real-time member addition/removal

## 🚀 How to Use

### Adding Team Members

1. **Navigate to Project Detail Page**
   - Go to any project you own
   - Scroll to the "Team Members" section

2. **Click "Add Member" Button**
   - Only project owners can add members
   - Opens the member addition form

3. **Enter Email Address**
   - Required field: Email address
   - Optional field: Name (for outsiders)

4. **Automatic Detection**
   - **Registered User**: Added as regular team member
   - **Unregistered Email**: Added as "Outsider" with orange badge

### Member Types

| Type | Badge | Permissions | Description |
|------|-------|-------------|-------------|
| **Owner** | Blue "Owner" badge | Full control | Project creator |
| **Member** | No special badge | Can view project | Registered user |
| **Outsider** | Orange "Outsider" badge | Can view project | Unregistered email |

## 📝 API Endpoints

### Add Member
```http
POST /api/projects/:id/members
Content-Type: application/json
Authorization: Bearer <token>

{
  "email": "john@example.com",
  "name": "John Doe"  // Optional, for outsiders
}
```

### Response Examples

**Registered User Added:**
```json
{
  "message": "Registered user added to project",
  "project": { /* updated project */ },
  "addedMember": {
    "user": "user_id",
    "isOutsider": false,
    "addedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Outsider Added:**
```json
{
  "message": "Outsider added to project",
  "project": { /* updated project */ },
  "addedMember": {
    "email": "outsider@example.com",
    "name": "John Doe",
    "isOutsider": true,
    "addedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Remove Member
```http
DELETE /api/projects/:id/members/:memberId
Authorization: Bearer <token>
```

## 🎨 UI Components

### TeamMemberManager Props
```jsx
<TeamMemberManager
  project={project}           // Project object with members
  currentUser={user}          // Current logged-in user
  onMemberAdded={callback}   // Called when member is added
  onMemberRemoved={callback} // Called when member is removed
/>
```

### Visual Indicators

- **Owner**: Blue background with "Owner" badge
- **Member**: Gray background with user icon
- **Outsider**: Orange background with "Outsider" badge and special icon

## 🔧 Backend Changes

### Project Model Update
```javascript
members: [{
  user: { type: ObjectId, ref: 'User' },
  email: { type: String, required: false },
  name: { type: String, required: false },
  isOutsider: { type: Boolean, default: false },
  addedAt: { type: Date, default: Date.now }
}]
```

### Controller Logic
1. Check if email exists in User collection
2. If exists → Add as registered user
3. If not exists → Add as outsider with email/name
4. Prevent duplicate members
5. Only owners can add/remove members

## 🧪 Testing Scenarios

### Test Case 1: Add Registered User
1. Use email of existing registered user
2. Should be added without "Outsider" badge
3. Should show user's registered name

### Test Case 2: Add Outsider
1. Use email that doesn't exist in system
2. Should be added with "Outsider" badge
3. Should show provided name or email prefix

### Test Case 3: Duplicate Prevention
1. Try to add same email twice
2. Should show error message
3. Should not create duplicate entry

### Test Case 4: Permission Check
1. Try to add member as non-owner
2. Should not show "Add Member" button
3. API should return 403 error

## 🎯 Benefits

1. **Flexibility**: Add anyone by email without pre-registration
2. **Clarity**: Visual distinction between insiders and outsiders
3. **Collaboration**: Easy to include external stakeholders
4. **Security**: Maintains access control with owner permissions
5. **Scalability**: No need to pre-register all collaborators

## 🔄 Migration Notes

Existing projects with members will continue to work. The system automatically handles both old and new member formats during the transition period.
