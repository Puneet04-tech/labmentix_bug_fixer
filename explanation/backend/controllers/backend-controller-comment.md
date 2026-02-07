# backend-controller-comment.md

## Overview
The `commentController.js` file handles CRUD operations for ticket comments.

## File Location
```
backend/controllers/commentController.js
```

## Dependencies - Detailed Import Analysis

```javascript
const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');
const Project = require('../models/Project');
```

### Import Statement Breakdown:
- **Comment Model**: Mongoose model for comment data and operations
- **Ticket Model**: Mongoose model for ticket authorization checks
- **Project Model**: Mongoose model for project membership validation

## Nested Populate with Path

```javascript
.populate({
  path: 'ticket',
  populate: { path: 'project' }
})
```

**Syntax Pattern**: Populating nested references through multiple levels.

## String Trimming for Validation

```javascript
if (content.trim().length === 0) {
  return res.status(400).json({ message: 'Comment cannot be empty' });
}
```

**Syntax Pattern**: Trimming whitespace and validating non-empty content.

## Comment Creation with Trimmed Content

```javascript
const comment = await Comment.create({
  content: content.trim(),
  ticket,
  author: req.user.id
});
```

**Syntax Pattern**: Trimming user input before saving to database.

## Author-Only Update Authorization

```javascript
if (comment.author.toString() !== req.user.id) {
  return res.status(403).json({ message: 'Not authorized to edit this comment' });
}
```

**Syntax Pattern**: Restricting updates to comment author only.

## Multiple Authorization Criteria for Deletion

```javascript
const isAuthor = comment.author.toString() === req.user.id;
const isProjectOwner = project.owner.toString() === req.user.id;
if (!isAuthor && !isProjectOwner) // deny
```

**Syntax Pattern**: Allowing operation based on multiple user roles.

## Count Documents Query

```javascript
const count = await Comment.countDocuments({ ticket: ticketId });
```

**Syntax Pattern**: Counting documents matching a filter condition.

## Critical Code Patterns

### 1. Project Access Validation
```javascript
const ticket = await Ticket.findById(ticketId).populate('project');
const project = await Project.findById(ticket.project._id);
const isOwner = project.owner.toString() === req.user.id;
const isMember = project.members.some(member => member.toString() === req.user.id);
```
**Pattern**: Verifying user has access to ticket's project.

### 2. Nested Reference Population
```javascript
.populate({
  path: 'ticket',
  populate: { path: 'project' }
})
```
**Pattern**: Populating references through multiple relationship levels.

### 3. Input Sanitization
```javascript
content: content.trim()
```
**Pattern**: Trimming whitespace from user input before storage.

### 4. Author-Only Operations
```javascript
if (comment.author.toString() !== req.user.id) {
  return res.status(403).json({ message: 'Not authorized' });
}
```
**Pattern**: Restricting comment modifications to original author.

### 5. Multi-Role Authorization
```javascript
const isAuthor = comment.author.toString() === req.user.id;
const isProjectOwner = project.owner.toString() === req.user.id;
if (!isAuthor && !isProjectOwner) // deny deletion
```
**Pattern**: Allowing operation for multiple authorized roles.

### 6. Document Counting
```javascript
const count = await Comment.countDocuments({ ticket: ticketId });
```
**Pattern**: Getting count of related documents.

### 7. Chronological Sorting
```javascript
.sort({ createdAt: 1 })
```
**Pattern**: Sorting comments in ascending chronological order.

### 8. Post-Create Population
```javascript
const comment = await Comment.create(data);
const populated = await Comment.findById(comment._id).populate('author', 'name email');
```
**Pattern**: Re-fetching to populate references after creation.

