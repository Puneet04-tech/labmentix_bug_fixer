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

---

## 📚 Technical Terms Glossary
- `timestamps`: Mongoose schema option that adds `createdAt` and `updatedAt` fields automatically.
- `isModified('content')`: Mongoose document method to check if a field was changed before saving.
- `index`: Database index to speed up queries on fields like `ticket` and `createdAt`.

## 🧑‍💻 Important Import & Syntax Explanations
- Use `commentSchema.pre('save', ...)` to detect edits and set `isEdited`/`editedAt` fields.
- `commentSchema.index({ ticket: 1, createdAt: -1 })` optimizes fetching latest comments for a ticket.
- Use `.populate('author', 'name email')` when returning comments so front-end can show author details.
