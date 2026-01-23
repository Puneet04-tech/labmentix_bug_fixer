# Backend Models: Ticket.js - Complete Line-by-Line Explanation

This file defines the **Ticket model** - the core entity representing bugs, features, and tasks in the bug tracking system.

---

## 📋 File Overview

- **Location**: `backend/models/Ticket.js`
- **Purpose**: Define Ticket schema with relationships to Projects and Users
- **Total Lines**: 68
- **Dependencies**: mongoose
- **Exports**: Mongoose Ticket model

---

## 🔍 Complete Code Structure

The Ticket model represents individual work items (bugs, features, tasks) within projects. It includes:
- **Metadata**: Title, description, type
- **Workflow**: Status tracking (Open → In Progress → Resolved)
- **Organization**: Priority levels, due dates
- **Relationships**: Links to Project, assignee, reporter
- **Timestamps**: Created and updated dates
- **Indexing**: Optimized database queries

---

## 🎯 Field Breakdown

### **title** (Lines 4-8)
```javascript
title: {
  type: String,
  required: [true, 'Please add a ticket title'],
  trim: true,
  maxlength: [100, 'Title cannot be more than 100 characters']
}
```

**Purpose**: Brief summary of the ticket
**Validation**: Required, max 100 chars, auto-trimmed
**Example**: "Login button not working on mobile"

---

### **description** (Lines 9-13)
```javascript
description: {
  type: String,
  required: [true, 'Please add a description'],
  maxlength: [2000, 'Description cannot be more than 2000 characters']
}
```

**Purpose**: Detailed explanation of the issue/feature
**Validation**: Required, max 2000 chars
**Example**: "When users click the login button on iPhone 12, the button animation freezes and no login attempt occurs. This happens on both Safari and Chrome mobile browsers."

---

### **type** (Lines 14-18)
```javascript
type: {
  type: String,
  enum: ['Bug', 'Feature', 'Improvement', 'Task'],
  default: 'Bug'
}
```

**Purpose**: Categorizes the ticket
**Options**:
- **Bug**: Something is broken
- **Feature**: New functionality
- **Improvement**: Enhance existing feature
- **Task**: General work item

**Default**: 'Bug' (most common in bug tracking)

---

### **status** (Lines 19-23)
```javascript
status: {
  type: String,
  enum: ['Open', 'In Progress', 'In Review', 'Resolved', 'Closed'],
  default: 'Open'
}
```

**Purpose**: Tracks ticket lifecycle
**Workflow**:
1. **Open**: Newly created, awaiting assignment
2. **In Progress**: Actively being worked on
3. **In Review**: Code/work submitted for review
4. **Resolved**: Fix implemented, awaiting verification
5. **Closed**: Verified and completed

**Example Flow**:
```
Open → In Progress → In Review → Resolved → Closed
       (Developer)   (Code Review) (QA Test) (Done)
```

---

### **priority** (Lines 24-28)
```javascript
priority: {
  type: String,
  enum: ['Low', 'Medium', 'High', 'Critical'],
  default: 'Medium'
}
```

**Purpose**: Indicates urgency

**Priority Levels**:
- **Critical**: Production down, security vulnerability
- **High**: Major feature broken, affects many users
- **Medium**: Standard bugs/features
- **Low**: Minor issues, nice-to-have features

---

### **project** (Lines 29-33) - REQUIRED RELATIONSHIP
```javascript
project: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Project',
  required: true
}
```

**What it does**:
- Links ticket to a project
- Stores only the project ID (ObjectId)
- **Required**: Every ticket must belong to a project

**Usage**:
```javascript
// Create ticket in specific project
const ticket = await Ticket.create({
  title: 'Bug Fix',
  description: 'Details...',
  project: '507f1f77bcf86cd799439011', // Project ID
  reportedBy: req.user.id
});

// Populate to get project details
const ticket = await Ticket.findById(ticketId).populate('project');
console.log(ticket.project.name); // "E-Commerce Platform"
```

---

### **assignedTo** (Lines 34-37) - OPTIONAL
```javascript
assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}
```

**What it does**:
- References the user assigned to work on this ticket
- **Optional**: Tickets can be unassigned
- Can be updated as work is assigned/reassigned

**Example**:
```javascript
// Unassigned ticket
const ticket1 = await Ticket.create({
  title: 'New Feature',
  project: projectId,
  reportedBy: userId
  // assignedTo: undefined (not assigned yet)
});

// Assign ticket to developer
ticket1.assignedTo = developerId;
await ticket1.save();
```

---

### **reportedBy** (Lines 38-42) - REQUIRED
```javascript
reportedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}
```

**What it does**:
- References the user who created/reported the ticket
- **Required**: Must know who reported the issue
- Immutable after creation (shouldn't change)

**Why it's important**:
- Accountability and tracking
- Contact person for clarifications
- Activity attribution

---

### **dueDate** (Lines 43-45) - OPTIONAL
```javascript
dueDate: {
  type: Date
}
```

**Purpose**: Optional deadline for ticket completion
**When to use**: Time-sensitive bugs, sprint deadlines, release blockers

**Example**:
```javascript
// High priority with deadline
const urgentTicket = await Ticket.create({
  title: 'Security Patch',
  priority: 'Critical',
  dueDate: new Date('2026-01-31'), // Must fix by end of month
  project: projectId,
  reportedBy: userId
});

// Check if overdue
const isOverdue = ticket.dueDate && ticket.dueDate < new Date();
```

---

### **Timestamps** (Lines 46-54)

```javascript
createdAt: {
  type: Date,
  default: Date.now
},
updatedAt: {
  type: Date,
  default: Date.now
}
```

**createdAt**: When ticket was first created (never changes)
**updatedAt**: Last modification time (updated by middleware)

---

## ⚙️ Middleware & Indexes

### **Pre-Save Hook** (Lines 57-60)
```javascript
ticketSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
```

**Purpose**: Automatically update `updatedAt` timestamp
**When it runs**: Every time `.save()` is called
**Example**:
```javascript
ticket.status = 'In Progress';
await ticket.save(); // updatedAt automatically set to now
```

---

### **Database Indexes** (Lines 63-64)
```javascript
ticketSchema.index({ project: 1, status: 1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
```

**What are indexes?**
- Speed up database queries
- Like an index in a book - find data faster

**First Index** `{ project: 1, status: 1 }`:
- Optimizes queries filtering by project and status
- Example: "Get all Open tickets in Project X"

**Second Index** `{ assignedTo: 1, status: 1 }`:
- Optimizes queries for user's assigned tickets
- Example: "Get all In Progress tickets assigned to me"

**Performance Impact**:
```javascript
// WITHOUT INDEX: Scans all tickets (slow)
// WITH INDEX: Jumps directly to matching tickets (fast)

// This query benefits from first index:
await Ticket.find({ project: projectId, status: 'Open' });

// This query benefits from second index:
await Ticket.find({ assignedTo: userId, status: 'In Progress' });
```

---

## 🔗 Relationships Diagram

```
       User (Reporter)
            │
            │ reportedBy (1:1)
            ▼
┌──────────────────────┐
│       Ticket         │
│  (Bug/Feature/Task)  │
└──────────────────────┘
            │
            │ project (Many:1)
            ▼
         Project
            │
            │ assignedTo (1:1)
            ▼
     User (Assignee)
            │
            │ (1:Many)
            ▼
        Comments
```

---

## 📊 Field Summary Table

| Field | Type | Required | Default | Enum/Ref |
|-------|------|----------|---------|----------|
| title | String | ✅ | - | Max 100 chars |
| description | String | ✅ | - | Max 2000 chars |
| type | String (Enum) | ❌ | 'Bug' | Bug, Feature, Improvement, Task |
| status | String (Enum) | ❌ | 'Open' | Open, In Progress, In Review, Resolved, Closed |
| priority | String (Enum) | ❌ | 'Medium' | Low, Medium, High, Critical |
| project | ObjectId | ✅ | - | → Project |
| assignedTo | ObjectId | ❌ | - | → User |
| reportedBy | ObjectId | ✅ | - | → User |
| dueDate | Date | ❌ | - | - |
| createdAt | Date | ❌ | Date.now | - |
| updatedAt | Date | ❌ | Date.now | Auto-updated |

---

## 🎯 Common Operations

### Create Ticket
```javascript
const ticket = await Ticket.create({
  title: 'Login fails on mobile',
  description: 'Users cannot login on iOS Safari...',
  type: 'Bug',
  priority: 'High',
  project: projectId,
  reportedBy: req.user.id,
  dueDate: new Date('2026-02-01')
});
```

### Assign Ticket
```javascript
const ticket = await Ticket.findById(ticketId);
ticket.assignedTo = developerId;
ticket.status = 'In Progress';
await ticket.save(); // updatedAt auto-updated
```

### Get User's Assigned Tickets
```javascript
const myTickets = await Ticket.find({
  assignedTo: req.user.id,
  status: { $ne: 'Closed' } // Not closed
})
.populate('project', 'name')
.populate('reportedBy', 'name email');
```

### Get Project Tickets by Priority
```javascript
const criticalTickets = await Ticket.find({
  project: projectId,
  priority: 'Critical',
  status: { $in: ['Open', 'In Progress'] }
})
.sort({ createdAt: -1 });
```

### Move Ticket Through Workflow
```javascript
// Open → In Progress
ticket.status = 'In Progress';
ticket.assignedTo = developerId;
await ticket.save();

// In Progress → In Review
ticket.status = 'In Review';
await ticket.save();

// In Review → Resolved
ticket.status = 'Resolved';
await ticket.save();

// Resolved → Closed (with completion date)
ticket.status = 'Closed';
ticket.endDate = new Date();
await ticket.save();
```

### Search Tickets
```javascript
const tickets = await Ticket.find({
  project: { $in: projectIds },
  $or: [
    { title: { $regex: 'login', $options: 'i' } },
    { description: { $regex: 'login', $options: 'i' } }
  ]
});
```

---

## ⚠️ Common Pitfalls

### 1. **Forgetting to Update status When Assigning**
```javascript
// INCOMPLETE - assigned but still "Open"
ticket.assignedTo = userId;
await ticket.save();
// Status should also change to "In Progress"

// COMPLETE
ticket.assignedTo = userId;
ticket.status = 'In Progress';
await ticket.save();
```

### 2. **Not Validating assignedTo is Project Member**
```javascript
// WRONG - assign to anyone
ticket.assignedTo = randomUserId;

// RIGHT - validate user is project member
const project = await Project.findById(ticket.project);
const isValidAssignee = project.owner.equals(randomUserId) ||
                       project.members.some(m => m.equals(randomUserId));
if (!isValidAssignee) {
  throw new Error('User not in project');
}
ticket.assignedTo = randomUserId;
```

### 3. **Using findByIdAndUpdate Instead of .save()**
```javascript
// WRONG - updatedAt middleware won't run
await Ticket.findByIdAndUpdate(ticketId, { status: 'Closed' });

// RIGHT - middleware runs with .save()
const ticket = await Ticket.findById(ticketId);
ticket.status = 'Closed';
await ticket.save(); // updatedAt updated
```

---

## 🧪 Testing Examples

### Test Ticket Creation
```javascript
const ticket = await Ticket.create({
  title: 'Test Ticket',
  description: 'Test description',
  project: projectId,
  reportedBy: userId
});

console.log(ticket.type); // 'Bug' (default)
console.log(ticket.status); // 'Open' (default)
console.log(ticket.priority); // 'Medium' (default)
console.log(ticket.assignedTo); // undefined (not assigned)
```

### Test Enum Validation
```javascript
try {
  await Ticket.create({
    title: 'Test',
    description: 'Test',
    type: 'InvalidType', // ❌ Not in enum
    project: projectId,
    reportedBy: userId
  });
} catch (error) {
  console.log(error.message); // Validation error
}
```

### Test Indexes Performance
```javascript
// Query with indexed fields (fast)
console.time('indexed');
await Ticket.find({ project: projectId, status: 'Open' });
console.timeEnd('indexed'); // ~5ms

// Query without indexed fields (slower)
console.time('not-indexed');
await Ticket.find({ title: /test/ });
console.timeEnd('not-indexed'); // ~50ms
```

---

## 🎓 Key Takeaways

1. **Tickets belong to Projects** - required relationship
2. **Status enum** controls workflow (Open → Closed)
3. **Priority enum** indicates urgency
4. **Type enum** categorizes work (Bug/Feature/etc.)
5. **assignedTo is optional** - tickets can be unassigned
6. **reportedBy is required** - accountability
7. **Indexes optimize** common queries
8. **Pre-save middleware** auto-updates timestamps

---

## 📚 Related Files

- [backend-models-Project.md](backend-models-Project.md) - Projects contain tickets
- [backend-models-User.md](backend-models-User.md) - Users create and are assigned tickets
- [backend-models-Comment.md](backend-models-Comment.md) - Comments belong to tickets
- [backend-controllers-ticket.md](backend-controllers-ticket.md) - Ticket CRUD operations

---

*This Ticket model is the heart of the bug tracking system!* 🐛✅
