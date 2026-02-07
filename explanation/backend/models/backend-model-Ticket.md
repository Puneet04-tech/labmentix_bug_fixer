# backend-model-Ticket.md

## Overview
The `Ticket.js` file defines the Mongoose schema for tickets with references and performance indexes.

## File Location
```
backend/models/Ticket.js
```

## Dependencies - Detailed Import Analysis

```javascript
const mongoose = require('mongoose');
```

### Import Statement Breakdown:
- **mongoose**: ODM library for schema definition and model creation

## Complex Schema with Multiple References

```javascript
const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 2000 },
  type: { type: String, enum: ['Bug', 'Feature', 'Improvement', 'Task'], default: 'Bug' },
  status: { type: String, enum: ['Open', 'In Progress', 'In Review', 'Resolved', 'Closed'], default: 'Open' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

**Syntax Pattern**: Defining schema with multiple enum fields and references.

## Compound Index Creation

```javascript
ticketSchema.index({ project: 1, status: 1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
```

**Syntax Pattern**: Creating database indexes for query performance optimization.

## Pre-save Hook for Updates

```javascript
ticketSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
```

**Syntax Pattern**: Automatic timestamp updates on document saves.

## Model Export

```javascript
module.exports = mongoose.model('Ticket', ticketSchema);
```

**Syntax Pattern**: Creating and exporting Mongoose model from schema.

## Critical Code Patterns

### 1. Multiple Enum Fields
```javascript
type: { type: String, enum: ['Bug', 'Feature', 'Improvement', 'Task'], default: 'Bug' },
status: { type: String, enum: ['Open', 'In Progress', 'In Review', 'Resolved', 'Closed'], default: 'Open' },
priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' }
```
**Pattern**: Using enums for categorical ticket attributes.

### 2. Multiple Model References
```javascript
project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
```
**Pattern**: Defining relationships between tickets and other models.

### 3. Optional Reference Fields
```javascript
assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
```
**Pattern**: Optional references that can be null/undefined.

### 4. Compound Database Indexes
```javascript
ticketSchema.index({ project: 1, status: 1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
```
**Pattern**: Creating indexes on multiple fields for query optimization.

### 5. Text Length Validation
```javascript
title: { type: String, required: true, maxlength: 100 },
description: { type: String, required: true, maxlength: 2000 }
```
**Pattern**: Setting maximum length constraints on text fields.

### 6. Optional Date Fields
```javascript
dueDate: { type: Date }
```
**Pattern**: Defining optional date fields for scheduling.

### 7. Timestamp Fields
```javascript
createdAt: { type: Date, default: Date.now },
updatedAt: { type: Date, default: Date.now }
```
**Pattern**: Manual timestamp tracking with defaults.

### 8. Pre-save Timestamp Updates
```javascript
ticketSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
```
**Pattern**: Automatic update timestamp modification.
