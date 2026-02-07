# backend-model-Comment.md

## Overview
The `Comment.js` file defines the Mongoose schema for ticket comments with edit tracking.

## File Location
```
backend/models/Comment.js
```

## Dependencies - Detailed Import Analysis

```javascript
const mongoose = require('mongoose');
```

### Import Statement Breakdown:
- **mongoose**: ODM library for schema definition and model creation

## Schema with Timestamps Option

```javascript
const commentSchema = new mongoose.Schema({
  content: { type: String, required: true, maxlength: 1000 },
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date }
}, {
  timestamps: true
});
```

**Syntax Pattern**: Defining schema with automatic timestamp fields.

## Compound Index for Query Optimization

```javascript
commentSchema.index({ ticket: 1, createdAt: -1 });
```

**Syntax Pattern**: Creating index for efficient comment retrieval by ticket and date.

## Single Field Index

```javascript
commentSchema.index({ author: 1 });
```

**Syntax Pattern**: Creating index for author-based comment queries.

## Pre-save Hook for Edit Tracking

```javascript
commentSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
  next();
});
```

**Syntax Pattern**: Tracking content modifications for edit history.

## Model Export

```javascript
module.exports = mongoose.model('Comment', commentSchema);
```

**Syntax Pattern**: Creating and exporting Mongoose model from schema.

## Critical Code Patterns

### 1. Schema with Options Object
```javascript
const schema = new mongoose.Schema({
  // fields
}, {
  timestamps: true
});
```
**Pattern**: Using schema options for automatic timestamp fields.

### 2. Edit Tracking Fields
```javascript
isEdited: { type: Boolean, default: false },
editedAt: { type: Date }
```
**Pattern**: Manual tracking of content modifications.

### 3. Compound Index with Sort Order
```javascript
schema.index({ ticket: 1, createdAt: -1 });
```
**Pattern**: Indexing multiple fields with descending sort for latest-first queries.

### 4. Single Field Index
```javascript
schema.index({ author: 1 });
```
**Pattern**: Simple index for single-field queries.

### 5. Conditional Pre-save Logic
```javascript
if (this.isModified('content') && !this.isNew) {
  this.isEdited = true;
  this.editedAt = new Date();
}
```
**Pattern**: Executing logic only on updates, not on document creation.

### 6. Content Length Validation
```javascript
content: { type: String, required: true, maxlength: 1000 }
```
**Pattern**: Setting maximum length constraints on comment content.

### 7. Boolean Default Values
```javascript
isEdited: { type: Boolean, default: false }
```
**Pattern**: Default values for boolean tracking fields.

### 8. Reference Fields for Relationships
```javascript
ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
```
**Pattern**: Defining required relationships to other models.
