# Backend Model: Project.js - Line by Line Explanation

**Location**: `backend/models/Project.js` | **Lines**: 58

## 📋 Overview

Mongoose schema for projects with owner/member references and status tracking.

**Key Features:**
- Owner reference (single User)
- Members array (multiple Users)
- Status enum (5 states)
- Priority enum (4 levels)
- Auto-update `updatedAt` timestamp

---

## 🔍 Code Analysis

**Schema Fields:**
- `name`: Required, max 100 chars
- `description`: Required, max 500 chars
- `owner`: ObjectId ref to User (required)
- `members`: Array of ObjectId refs to User
- `status`: Enum ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled']
- `priority`: Enum ['Low', 'Medium', 'High', 'Critical']
- `startDate`: Date (default: now)
- `endDate`: Date (optional)

**Pre-save Hook (Lines 53-56):**
```javascript
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
```
Updates `updatedAt` every time document is saved.

**Usage Pattern:**
```javascript
// Owner can update, members can view
// Backend checks: isOwner for edit/delete, isOwner||isMember for view
```

---

## 🔗 Related Files
- [projectController.js](backend-controller-project.md) - CRUD + member management
