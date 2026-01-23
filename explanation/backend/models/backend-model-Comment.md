# Backend Model: Comment.js - Line by Line Explanation

**Location**: `backend/models/Comment.js` | **Lines**: 44

## 📋 Overview

Mongoose schema for ticket comments with edit tracking and timestamps.

**Key Features:**
- Ticket and author references
- Auto-tracking of edits (`isEdited`, `editedAt`)
- Timestamps option (`createdAt`, `updatedAt`)
- Indexes for query performance

---

## 🔍 Code Analysis

**Schema Fields:**
- `content`: Required, max 1000 chars
- `ticket`: ObjectId ref (required)
- `author`: ObjectId ref (required)
- `isEdited`: Boolean (default false)
- `editedAt`: Date (set when edited)

**Timestamps Option (Line 25):**
```javascript
}, {
  timestamps: true  // Auto-creates createdAt and updatedAt
});
```

**Indexes (Lines 30-31):**
```javascript
commentSchema.index({ ticket: 1, createdAt: -1 });  // Get comments for ticket, newest first
commentSchema.index({ author: 1 });  // Get all comments by user
```

**Pre-save Edit Tracking (Lines 34-40):**
```javascript
commentSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
  next();
});
```
Automatically sets `isEdited=true` and `editedAt` when content is updated (but not on create).

---

## 🔗 Related Files
- [commentController.js](backend-controller-comment.md) - CRUD operations
