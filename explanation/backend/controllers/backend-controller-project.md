# backend-controller-project.md

## Overview
The `projectController.js` file handles project CRUD operations and member management.

## File Location
```
backend/controllers/projectController.js
```

## Dependencies - Detailed Import Analysis

```javascript
const Project = require('../models/Project');
```

### Import Statement Breakdown:
- **Project Model**: Mongoose model for project data and operations

## MongoDB Query with $or Operator

```javascript
const projects = await Project.find({
  $or: [
    { owner: req.user.id },
    { members: req.user.id }
  ]
})
```

**Syntax Pattern**: Finding documents where user is either owner or member.

## Mongoose Populate Method

```javascript
.populate('owner', 'name email')
.populate('members', 'name email')
```

**Syntax Pattern**: Replacing ObjectId references with actual document data.

## Sorting Query Results

```javascript
.sort({ createdAt: -1 })
```

**Syntax Pattern**: Sorting by creation date in descending order (newest first).

## Authorization Check with ObjectId Comparison

```javascript
const isOwner = project.owner._id.toString() === req.user.id;
const isMember = project.members.some(member => member._id.toString() === req.user.id);
```

**Syntax Pattern**: Converting ObjectId to string for comparison with user ID.

## Array Method for Membership Check

```javascript
const isMember = project.members.some(member => member._id.toString() === req.user.id);
```

**Syntax Pattern**: Using `some()` to check if user exists in members array.

## Default Values in Object Creation

```javascript
const project = await Project.create({
  name,
  description,
  owner: req.user.id,
  status: status || 'Planning',
  priority: priority || 'Medium',
  startDate: startDate || Date.now(),
  members: members || []
});
```

**Syntax Pattern**: Using logical OR for default values in object creation.

## Re-fetching with Population

```javascript
const populatedProject = await Project.findById(project._id)
  .populate('owner', 'name email')
  .populate('members', 'name email');
```

**Syntax Pattern**: Re-querying document to populate references after creation.

## FindByIdAndUpdate with Options

```javascript
project = await Project.findByIdAndUpdate(
  req.params.id,
  req.body,
  { new: true, runValidators: true }
)
```

**Syntax Pattern**: Updating document and returning updated version with validation.

## Array Filter for Member Removal

```javascript
project.members = project.members.filter(
  member => member.toString() !== req.params.userId
);
```

**Syntax Pattern**: Using `filter()` to remove specific member from array.

## Critical Code Patterns

### 1. Complex MongoDB Query with $or
```javascript
const projects = await Project.find({
  $or: [
    { owner: req.user.id },
    { members: req.user.id }
  ]
})
```
**Pattern**: Finding documents matching multiple conditions.

### 2. Multiple Populate Calls
```javascript
.populate('field1', 'fields')
.populate('field2', 'fields')
```
**Pattern**: Populating multiple reference fields in a query.

### 3. ObjectId to String Conversion
```javascript
obj._id.toString() === stringId
```
**Pattern**: Converting MongoDB ObjectId to string for comparison.

### 4. Array Membership Check
```javascript
array.some(item => item._id.toString() === targetId)
```
**Pattern**: Checking if an object exists in an array of references.

### 5. Default Values in Object Destructuring
```javascript
const obj = { field: value || defaultValue }
```
**Pattern**: Providing fallback values for optional fields.

### 6. Re-fetch After Create
```javascript
const doc = await Model.create(data);
const populated = await Model.findById(doc._id).populate('refs');
```
**Pattern**: Re-querying to populate references after document creation.

### 7. Update with Validation
```javascript
await Model.findByIdAndUpdate(id, data, { new: true, runValidators: true })
```
**Pattern**: Updating document with schema validation enabled.

### 8. Array Filtering
```javascript
array = array.filter(item => condition)
```
**Pattern**: Removing items from array based on condition.

