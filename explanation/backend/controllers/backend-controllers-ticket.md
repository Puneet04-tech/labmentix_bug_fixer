# Backend Controller: ticketController.js - Complete Explanation

Ticket CRUD with advanced filtering, search, and assignment validation.

## 📋 Overview
- **Lines**: 282
- **Functions**: 7 (getTickets, getTicket, createTicket, updateTicket, deleteTicket, getTicketsByProject, assignTicket)
- **Key Features**: Complex filtering, search with regex, project access validation

---

## 🔑 **Function 1: getTickets (Lines 7-47)**

```javascript
exports.getTickets = async (req, res) => {
  try {
    const { project, status, priority, assignedTo, search } = req.query;
    
    // Build filter
    const filter = {};
    
    // Get user's projects first
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    }).select('_id');
    
    const projectIds = userProjects.map(p => p._id);
    filter.project = { $in: projectIds };
    
    // Apply additional filters
    if (project) filter.project = project;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    
    // Search filter - search in title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(filter)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Complex Filtering Logic:

**Lines 14-23: Security Filter - Get User's Projects**
```javascript
const userProjects = await Project.find({
  $or: [
    { owner: req.user.id },
    { members: req.user.id }
  ]
}).select('_id');

const projectIds = userProjects.map(p => p._id);
filter.project = { $in: projectIds };
```
**Why this matters**:
- **Security**: Users should only see tickets from THEIR projects
- **Step 1**: Find all projects user owns or is member of
- **Step 2**: Extract just the IDs with `.map()`
- **Step 3**: Use `$in` operator to match tickets from those projects

**Example**:
```javascript
// User 123 has access to:
// Project A (owner)
// Project B (member)

// userProjects = [{ _id: 'A' }, { _id: 'B' }]
// projectIds = ['A', 'B']
// filter.project = { $in: ['A', 'B'] }

// Query will only return tickets where project is 'A' OR 'B'
```

**Lines 25-28: Optional Filters**
```javascript
if (project) filter.project = project;
if (status) filter.status = status;
if (priority) filter.priority = priority;
if (assignedTo) filter.assignedTo = assignedTo;
```
**Each filter is optional** - only applied if query param exists

**Lines 31-35: Search with Regex**
```javascript
if (search) {
  filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } }
  ];
}
```
- **$regex**: MongoDB regular expression search
- **options: 'i'**: Case-insensitive
- **$or**: Matches if search term found in title OR description

**Example Queries**:
```javascript
// 1. Get all my tickets
GET /api/tickets
// No filters, returns all tickets from user's projects

// 2. Filter by status
GET /api/tickets?status=Open
// Only open tickets

// 3. Search for "login"
GET /api/tickets?search=login
// Tickets with "login" in title or description (case-insensitive)

// 4. Complex filter
GET /api/tickets?status=Open&priority=High&search=bug
// Open + High priority + contains "bug"
```

---

## 🔑 **Function 2: getTicket (Lines 52-76)**

```javascript
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('project', 'name owner members')
      .populate('assignedTo', 'name email')
      .populate('reportedBy', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user has access to the project
    const project = ticket.project;
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some(member => member.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to access this ticket' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Key Point**: Authorization check via project access (lines 65-71)

---

## 🔑 **Function 3: createTicket (Lines 81-134)**

```javascript
exports.createTicket = async (req, res) => {
  try {
    const { title, description, type, status, priority, project, assignedTo, dueDate } = req.body;

    // Validation
    if (!title || !description || !project) {
      return res.status(400).json({ message: 'Please provide title, description, and project' });
    }

    // Check if user has access to the project
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isOwner = projectDoc.owner.toString() === req.user.id;
    const isMember = projectDoc.members.some(member => member.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to create tickets in this project' });
    }

    // If assignedTo is provided, validate they're part of the project
    if (assignedTo) {
      const isAssigneeValid = projectDoc.owner.toString() === assignedTo ||
                             projectDoc.members.some(member => member.toString() === assignedTo);
      if (!isAssigneeValid) {
        return res.status(400).json({ message: 'Assigned user is not part of the project' });
      }
    }

    // Create ticket
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

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('reportedBy', 'name email');

    res.status(201).json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Assignment Validation:

**Lines 104-110: Validate Assignee**
```javascript
if (assignedTo) {
  const isAssigneeValid = projectDoc.owner.toString() === assignedTo ||
                         projectDoc.members.some(member => member.toString() === assignedTo);
  if (!isAssigneeValid) {
    return res.status(400).json({ message: 'Assigned user is not part of the project' });
  }
}
```
**Business Rule**: Can only assign tickets to project owner or members
**Why**: Prevents assigning tickets to random users

**Example**:
```javascript
// Project A: owner=123, members=[456, 789]

// Valid assignments
assignedTo: 123 → ✅ (owner)
assignedTo: 456 → ✅ (member)
assignedTo: 789 → ✅ (member)

// Invalid assignment
assignedTo: 999 → ❌ 400 Bad Request
```

---

## 🔑 **Function 4: updateTicket (Lines 139-182)**

```javascript
exports.updateTicket = async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id).populate('project');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user has access to the project
    const project = ticket.project;
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some(member => member.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to update this ticket' });
    }

    // If assignedTo is being changed, validate
    if (req.body.assignedTo) {
      const isAssigneeValid = project.owner.toString() === req.body.assignedTo ||
                             project.members.some(member => member.toString() === req.body.assignedTo);
      if (!isAssigneeValid) {
        return res.status(400).json({ message: 'Assigned user is not part of the project' });
      }
    }

    // Update ticket
    ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('project', 'name')
    .populate('assignedTo', 'name email')
    .populate('reportedBy', 'name email');

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Same validation** as create for assignedTo (lines 157-163)

---

## 🔑 **Function 5: deleteTicket (Lines 187-209)**

```javascript
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('project');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user is project owner or ticket reporter
    const isProjectOwner = ticket.project.owner.toString() === req.user.id;
    const isReporter = ticket.reportedBy.toString() === req.user.id;

    if (!isProjectOwner && !isReporter) {
      return res.status(403).json({ message: 'Not authorized to delete this ticket' });
    }

    await Ticket.findByIdAndDelete(req.params.id);

    res.json({ message: 'Ticket deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Special Authorization Rule:

**Lines 196-201: Two Delete Permissions**
```javascript
const isProjectOwner = ticket.project.owner.toString() === req.user.id;
const isReporter = ticket.reportedBy.toString() === req.user.id;

if (!isProjectOwner && !isReporter) {
  return res.status(403).json({ message: 'Not authorized to delete this ticket' });
}
```
**Can delete if**:
- You are the project owner, OR
- You reported the ticket

**Example**:
```
Ticket created by User 456 in Project owned by User 123

Delete attempts:
- User 123: ✅ (project owner)
- User 456: ✅ (reporter)
- User 789: ❌ (neither owner nor reporter)
```

---

## 🔑 **Function 6: getTicketsByProject (Lines 214-240)**

Gets all tickets for a specific project with auth check

---

## 🔑 **Function 7: assignTicket (Lines 245-282)**

```javascript
exports.assignTicket = async (req, res) => {
  try {
    const { userId } = req.body;
    const ticket = await Ticket.findById(req.params.id).populate('project');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user has access to the project
    const project = ticket.project;
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some(member => member.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to assign this ticket' });
    }

    // Validate assignee is part of project
    if (userId) {
      const isAssigneeValid = project.owner.toString() === userId ||
                             project.members.some(member => member.toString() === userId);
      if (!isAssigneeValid) {
        return res.status(400).json({ message: 'User is not part of the project' });
      }
    }

    ticket.assignedTo = userId || null;
    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('reportedBy', 'name email');

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Unassignment Feature:

**Line 273: Allow Null**
```javascript
ticket.assignedTo = userId || null;
```
**If userId is null/undefined**: Unassigns ticket
**Use case**: Remove assignment from ticket

---

## 🔄 Complete Query Examples

### 1. Basic Fetch
```javascript
GET /api/tickets
// Returns all tickets from user's projects
```

### 2. Single Status Filter
```javascript
GET /api/tickets?status=In Progress
// Returns only "In Progress" tickets
```

### 3. Multiple Filters
```javascript
GET /api/tickets?status=Open&priority=Critical
// Open AND Critical tickets
```

### 4. Search Query
```javascript
GET /api/tickets?search=login bug
// Tickets with "login bug" in title or description
```

### 5. Complex Combined Query
```javascript
GET /api/tickets?project=abc123&status=Open&priority=High&assignedTo=xyz789&search=api
// Project abc123 AND Open AND High AND assigned to xyz789 AND contains "api"
```

---

## 🎯 Authorization Matrix

```
Operation         | Project Owner | Project Member | Reporter | Other
------------------|---------------|----------------|----------|-------
getTickets        |      ✅       |       ✅       |    ✅    |  ❌
getTicket         |      ✅       |       ✅       |    ✅    |  ❌
createTicket      |      ✅       |       ✅       |    -     |  ❌
updateTicket      |      ✅       |       ✅       |    ✅    |  ❌
deleteTicket      |      ✅       |       ❌       |    ✅    |  ❌
assignTicket      |      ✅       |       ✅       |    ✅    |  ❌
```

---

## 📚 Related Files
- [backend-models-Ticket.md](backend-models-Ticket.md) - Ticket schema
- [backend-routes-tickets.md](backend-routes-tickets.md) - Route definitions
- [frontend-context-TicketContext.md](frontend-context-TicketContext.md) - Frontend integration
- [backend-controllers-project.md](backend-controllers-project.md) - Project authorization
