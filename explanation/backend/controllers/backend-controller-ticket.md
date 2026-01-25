# Backend Controller: ticketController.js - Ticket Management

## 📋 File Overview
**Location**: `backend/controllers/ticketController.js`  
**Lines**: 282  
**Purpose**: Complete ticket CRUD with advanced filtering and assignment

---

## 🎯 Core Functions
1. **getTickets** - List tickets with filters (project, status, priority, assignee, search)
2. **getTicket** - Get single ticket details
3. **createTicket** - Create new ticket
4. **updateTicket** - Update ticket
5. **deleteTicket** - Delete ticket
6. **getTicketsByProject** - Get all tickets for specific project
7. **assignTicket** - Assign/reassign ticket to user

---

## 📝 KEY SECTIONS

### **Lines 7-46: Get All Tickets with Advanced Filtering**

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
    
    // Search filter
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

**Lines 15-21**: **Security filter** - Only show tickets from user's projects
- Gets all projects where user is owner OR member
- `.select('_id')` - Only need project IDs (faster query)
- `.map(p => p._id)` - Extract IDs into array
- `{ $in: projectIds }` - MongoDB operator: ticket.project must be in this array

**Lines 24-27**: Apply URL query parameters as filters
- Example: `/api/tickets?status=Open&priority=High`
- `if (project)` - Only apply if provided
- Overwrites security filter if specific project requested

**Lines 30-34**: Search functionality
- `$regex` - MongoDB regular expression search
- `$options: 'i'` - Case-insensitive
- Searches in BOTH title AND description fields
- Example: search="bug" matches "Bug in login" or "Password bug in description"

**Lines 36-40**: Execute query with populated fields
- Populate project name, assignee details, reporter details
- Sort by newest first

**Example request**: `GET /api/tickets?status=Open&priority=High&search=login`
- Returns open, high-priority tickets with "login" in title/description

---

### **Lines 51-76: Get Single Ticket**

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

**Line 54**: Populate project with **owner and members** fields
- Needed for authorization check

**Lines 64-70**: **Authorization check**
- User must be project owner OR member to view ticket
- Prevents users from accessing other teams' tickets

---

### **Lines 81-137: Create Ticket**

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

**Lines 91-101**: **Project access validation**
- User must be project owner OR member to create tickets
- Prevents creating tickets in other teams' projects

**Lines 104-111**: **Assignee validation** - Critical!
- If assigning ticket during creation, validate assignee is part of project
- Assignee must be owner OR in members array
- Prevents assigning to users outside the project

**Line 121**: `reportedBy: req.user.id` - Automatically set to current user
- Tracks who created the ticket

---

### **Lines 142-179: Update Ticket**

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

**Lines 152-156**: **Project member can update** (unlike projects where only owner can update)
- Allows team collaboration on ticket status/details

**Lines 159-166**: Validate new assignee if being changed

**Line 169**: Update with options:
- `new: true` - Return updated document
- `runValidators: true` - Run schema validations

---

### **Lines 184-202: Delete Ticket**

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

**Lines 193-197**: **Delete authorization** - Two options:
1. Project owner can delete any ticket
2. Ticket reporter (creator) can delete their own ticket

**Why this logic?** Allows users to delete tickets they created by mistake, but project owner has final control

---

### **Lines 210-239: Get Tickets By Project**

```javascript
exports.getTicketsByProject = async (req, res) => {
  try {
    // Check if user has access to the project
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some(member => member.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    const tickets = await Ticket.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Used by**: ProjectDetail.jsx to show all tickets for a project

**Line 226**: Simple filter - All tickets for this project ID

---

### **Lines 244-282: Assign/Reassign Ticket**

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

**Line 271**: `userId || null` - Can unassign ticket by sending null

**Sample request**: Assign ticket to a member (only project owner or member can do this)
```http
PUT /api/tickets/507.../assign
Content-Type: application/json
Authorization: Bearer <token>

{
  "userId": "507..."  // user must be part of the project
}
```

Response (200):
```json
{
  "_id": "507...",
  "title": "Fix login bug",
  "assignedTo": { "_id": "507...", "name": "Bob", "email": "bob@example.com" },
  "status": "Open",
  "project": { "_id": "projId", "name": "Website Redesign" }
}
```

**Edge cases**:
- Assigning to a user who is not in the project → `400 Bad Request` (`User is not part of the project`)
- Assigning to a non-existent user id → `400 Bad Request` (`Assigned user not found`)

**Used by**: TicketDetail.jsx assignment dropdown

---

## 🔒 Authorization Matrix

| Operation | Project Owner | Project Member | Ticket Reporter | Other |
|-----------|---------------|----------------|-----------------|-------|
| View | ✅ | ✅ | ✅ (if in project) | ❌ |
| Create | ✅ | ✅ | ✅ (if in project) | ❌ |
| Update | ✅ | ✅ | ✅ (if in project) | ❌ |
| Delete | ✅ | ❌ | ✅ (own tickets) | ❌ |
| Assign | ✅ | ✅ | ✅ (if in project) | ❌ |

**Key differences from projects**:
- Members can update tickets (collaborative)

---

## 📚 Technical Terms Glossary
- `populate`: Mongoose method to replace referenced ObjectId fields with actual documents (e.g., `.populate('project', 'name')`).
- `req.user`: The authenticated user object added by the auth middleware; commonly used for authorization checks.
- `runValidators`: Option for Mongoose update operations that ensures schema validators run on updates.
- `select`: Mongoose method to include/exclude specific fields from query results (e.g., `.select('_id')`).
- `findByIdAndUpdate`: Mongoose helper to update a document by id; often used with `{ new: true }` to return the updated doc.

## 🧑‍💻 Important Import & Syntax Explanations
- `const X = require('x')` vs `import X from 'x'`: Common module import styles (Node `require` in CommonJS, `import` in ESM/TypeScript).
- `async/await` and `try/catch`: Asynchronous control flow used throughout controllers; wrap `await` calls in `try/catch` to handle errors and return proper HTTP responses.
- `.populate(field, projection)`: Use to load referenced documents and optionally limit fields.
- `res.status(code).json(obj)`: Pattern to return HTTP status codes with JSON payloads.
- `if (!resource) return res.status(404).json(...)`: Standard existence check for resources fetched by id.
- Reporters can delete their own tickets

---

## 🔄 Complex Query Examples

### **Example 1: Filter by status and priority**
```
GET /api/tickets?status=Open&priority=High

filter = {
  project: { $in: [userProjectIds] },  // Security
  status: 'Open',
  priority: 'High'
}
```

### **Example 2: Search with regex**
```
GET /api/tickets?search=login%20bug

filter = {
  project: { $in: [userProjectIds] },
  $or: [
    { title: { $regex: 'login bug', $options: 'i' } },
    { description: { $regex: 'login bug', $options: 'i' } }
  ]
}
```

### **Example 3: Specific project + assigned to user**
```
GET /api/tickets?project=123&assignedTo=456

filter = {
  project: '123',  // Overrides security filter
  assignedTo: '456'
}
```

---

## 🚨 Common Issues
### Sample Requests & Responses

POST /api/tickets (Create Ticket)
Request:
```http
POST /api/tickets
Content-Type: application/json

{
  "title": "Login fails on Safari",
  "description": "Users report 401 error when logging in via Safari",
  "project": "63f...",
  "priority": "High",
  "type": "Bug"
}
```
Success Response (201):
```json
{
  "_id": "640...",
  "title": "Login fails on Safari",
  "status": "Open",
  "priority": "High",
  "project": { "_id": "63f...", "name": "Website" },
  "reportedBy": { "_id": "507...", "name": "Alice" }
}
```

Edge cases:
- Missing `title`/`description`/`project` → 400 Bad Request
- `assignedTo` not a project member → 400 with explanatory message
- Invalid `project` id format → 400 or 404 depending on validation

GET /api/tickets/:id (Get Ticket)
Edge cases:
- Ticket not found → 404 Not Found
- User not a project member/owner → 403 Forbidden

PUT /api/tickets/:id (Update Ticket)
Edge cases:
- Trying to assign to a user not in project → 400
- Updating protected fields without permission → 403

---

**Issue**: Users can assign tickets to anyone
```javascript
// WRONG - No validation
ticket.assignedTo = req.body.userId;

// CORRECT - Validate assignee in project
if (userId) {
  const isValid = project.owner.toString() === userId ||
                  project.members.some(m => m.toString() === userId);
  if (!isValid) return res.status(400).json({...});
}
```

**Issue**: Users can see tickets from any project
```javascript
// WRONG - No project filter
const tickets = await Ticket.find({});

// CORRECT - Only user's projects
const userProjects = await Project.find({
  $or: [{ owner: req.user.id }, { members: req.user.id }]
});
const projectIds = userProjects.map(p => p._id);
const tickets = await Ticket.find({ project: { $in: projectIds } });
```

**Issue**: Case-sensitive search
```javascript
// WRONG - Exact match only
filter.title = search;  // Won't find "Bug" when searching "bug"

// CORRECT - Case-insensitive regex
filter.$or = [
  { title: { $regex: search, $options: 'i' } },
  { description: { $regex: search, $options: 'i' } }
];
```

---

## 🔗 Related Files
- [Ticket Model](../models/backend-models-Ticket.md) - Schema with status/priority enums
- [Project Model](../models/backend-models-Project.md) - For authorization checks
- [TicketContext.jsx](../../frontend/contexts/frontend-context-TicketContext.md) - Frontend ticket management
- [Tickets.jsx](../../frontend/pages/frontend-pages-Tickets.md) - Uses advanced filtering

---

Most complex controller - handles advanced filtering and team collaboration! 🎫✨
