# backend-controller-ticket.md

## Overview
The `ticketController.js` file handles ticket CRUD operations with advanced filtering and assignment.

## File Location
```
backend/controllers/ticketController.js
```

## Dependencies - Detailed Import Analysis

```javascript
const Ticket = require('../models/Ticket');
const Project = require('../models/Project');
```

### Import Statement Breakdown:
- **Ticket Model**: Mongoose model for ticket data and operations
- **Project Model**: Mongoose model for project authorization checks

## MongoDB Query with $in Operator

```javascript
const projectIds = userProjects.map(p => p._id);
filter.project = { $in: projectIds };
```

**Syntax Pattern**: Finding documents where project ID is in an array of allowed projects.

## Regex Search with Case Insensitivity

```javascript
filter.$or = [
  { title: { $regex: search, $options: 'i' } },
  { description: { $regex: search, $options: 'i' } }
];
```

**Syntax Pattern**: Using MongoDB regex for case-insensitive text search across multiple fields.

## Multiple Populate Calls

```javascript
.populate('project', 'name')
.populate('assignedTo', 'name email')
.populate('reportedBy', 'name email')
```

**Syntax Pattern**: Populating multiple reference fields with selective field inclusion.

## Array Method for Project Membership

```javascript
const isMember = project.members.some(member => member.toString() === req.user.id);
```

**Syntax Pattern**: Using `some()` to check if user exists in project members array.

## Validation of Assignee Membership

```javascript
const isAssigneeValid = project.owner.toString() === assignedTo ||
                       project.members.some(member => member.toString() === assignedTo);
```

**Syntax Pattern**: Validating that assignee is either project owner or member.

## Default Values in Ticket Creation

```javascript
const ticket = await Ticket.create({
  title,
  description,
  type: type || 'Bug',
  status: status || 'Open',
  priority: priority || 'Medium',
  project,
  assignedTo,
  reportedBy: req.user.id,
  dueDate
});
```

**Syntax Pattern**: Using logical OR for default enum values in object creation.

## Re-fetching with Population After Create

```javascript
const populatedTicket = await Ticket.findById(ticket._id)
  .populate('project', 'name')
  .populate('assignedTo', 'name email')
  .populate('reportedBy', 'name email');
```

**Syntax Pattern**: Re-querying ticket to populate all reference fields after creation.

## Critical Code Patterns

### 1. Security-Filtered Query with $in
```javascript
const userProjects = await Project.find({
  $or: [{ owner: req.user.id }, { members: req.user.id }]
}).select('_id');
const projectIds = userProjects.map(p => p._id);
const tickets = await Ticket.find({ project: { $in: projectIds } });
```
**Pattern**: Restricting query results to user's accessible projects.

### 2. Multi-Field Regex Search
```javascript
if (search) {
  filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } }
  ];
}
```
**Pattern**: Case-insensitive search across multiple text fields.

### 3. Project Membership Validation
```javascript
const isValid = project.owner.toString() === userId ||
                project.members.some(member => member.toString() === userId);
```
**Pattern**: Checking if user is authorized for project operations.

### 4. Multiple Reference Population
```javascript
.populate('project', 'name')
.populate('assignedTo', 'name email')
.populate('reportedBy', 'name email')
```
**Pattern**: Populating multiple Mongoose references with field selection.

### 5. Default Enum Values
```javascript
status: status || 'Open',
priority: priority || 'Medium',
type: type || 'Bug'
```
**Pattern**: Providing default values for enum fields.

### 6. Post-Create Population
```javascript
const ticket = await Ticket.create(data);
const populated = await Ticket.findById(ticket._id).populate('refs');
```
**Pattern**: Re-fetching document to populate references after creation.

### 7. Authorization with Multiple Roles
```javascript
const isProjectOwner = ticket.project.owner.toString() === req.user.id;
const isReporter = ticket.reportedBy.toString() === req.user.id;
if (!isProjectOwner && !isReporter) // deny
```
**Pattern**: Allowing operation based on multiple authorization criteria.

### 8. Null Assignment for Unassignment
```javascript
ticket.assignedTo = userId || null;
```
**Pattern**: Using null to unassign optional reference fields.
