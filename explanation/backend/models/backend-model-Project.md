# backend-model-Project.md

## Overview
The `Project.js` file defines the Mongoose schema for projects with owner/member relationships.

## File Location
```
backend/models/Project.js
```

## Dependencies - Detailed Import Analysis

```javascript
const mongoose = require('mongoose');
```

### Import Statement Breakdown:
- **mongoose**: ODM library for schema definition and model creation

## Schema with Reference Fields

```javascript
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 500 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'], default: 'Planning' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

**Syntax Pattern**: Defining schema with ObjectId references and enum constraints.

## Pre-save Hook for Timestamps

```javascript
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
```

**Syntax Pattern**: Mongoose pre-save hook for automatic timestamp updates.

## Model Export

```javascript
module.exports = mongoose.model('Project', projectSchema);
```

**Syntax Pattern**: Creating and exporting Mongoose model from schema.

## Critical Code Patterns

### 1. ObjectId Reference Fields
```javascript
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
```
**Pattern**: Defining single reference to another model.

### 2. Array of References
```javascript
members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
```
**Pattern**: Defining array of references to another model.

### 3. Enum Field Constraints
```javascript
status: { type: String, enum: ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'], default: 'Planning' }
```
**Pattern**: Restricting string field to predefined values.

### 4. Multiple Enum Fields
```javascript
priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' }
```
**Pattern**: Using enums for categorical data with defaults.

### 5. Manual Timestamp Updates
```javascript
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
```
**Pattern**: Pre-save hook for updating modification timestamps.

### 6. Schema Field Validation
```javascript
name: { type: String, required: true, maxlength: 100 }
```
**Pattern**: Combining multiple validation rules on schema fields.

### 7. Optional Date Fields
```javascript
endDate: { type: Date }
```
**Pattern**: Defining optional date fields without defaults.

### 8. Default Date Values
```javascript
startDate: { type: Date, default: Date.now }
```
**Pattern**: Setting default values for date fields.
