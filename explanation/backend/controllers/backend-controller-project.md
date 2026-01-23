# Backend Controller: projectController.js - Project CRUD Operations

## 📋 File Overview
**Location**: `backend/controllers/projectController.js`  
**Lines**: 205  
**Purpose**: Handle all project operations (CRUD + member management)

---

## 🎯 Core Functions
1. **getProjects** - List all user's projects
2. **getProject** - Get single project details
3. **createProject** - Create new project
4. **updateProject** - Update project
5. **deleteProject** - Delete project
6. **addMember** - Add team member
7. **removeMember** - Remove team member

---

## 📝 KEY SECTIONS

### **Lines 6-21: Get All Projects**

```javascript
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    })
    .populate('owner', 'name email')
    .populate('members', 'name email')
    .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Lines 8-12**: MongoDB query with $or operator
- Find projects where user is EITHER owner OR member
- `{ owner: req.user.id }` - User created the project
- `{ members: req.user.id }` - User added as team member

**Line 13**: `.populate('owner', 'name email')`
- Replaces owner ID with actual user object
- Only includes name and email fields
- **Before populate**: `owner: "507f1f77bcf86cd799439011"`
- **After populate**: `owner: { _id: "507f...", name: "John", email: "john@example.com" }`

**Line 14**: Populate members array similarly

**Line 15**: Sort by creation date, newest first (`-1` = descending)

---

### **Lines 26-48: Get Single Project**

```javascript
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner or member
    const isOwner = project.owner._id.toString() === req.user.id;
    const isMember = project.members.some(member => member._id.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Line 38**: Authorization check - Owner verification
- `.toString()` converts MongoDB ObjectId to string for comparison
- `req.user.id` is string from JWT token

**Line 39**: Check if user in members array
- `.some()` returns true if any member matches

**Lines 41-43**: Return 403 Forbidden if not authorized
- **Security**: Prevents users from accessing other teams' projects

---

### **Lines 53-82: Create Project**

```javascript
exports.createProject = async (req, res) => {
  try {
    const { name, description, status, priority, startDate, endDate, members } = req.body;

    // Validation
    if (!name || !description) {
      return res.status(400).json({ message: 'Please provide name and description' });
    }

    // Create project
    const project = await Project.create({
      name,
      description,
      owner: req.user.id,
      status: status || 'Planning',
      priority: priority || 'Medium',
      startDate: startDate || Date.now(),
      endDate,
      members: members || []
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Line 64**: `owner: req.user.id` - Current user becomes project owner

**Lines 65-68**: Default values
- `status || 'Planning'` - Default status if not provided
- `startDate || Date.now()` - Default to today
- `members || []` - Empty array if no members

**Lines 73-75**: Re-fetch with populated fields
- `Project.create()` returns project with ID references
- Need to populate owner/members to return full objects to frontend

---

### **Lines 87-110: Update Project**

```javascript
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    // Update project
    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('owner', 'name email')
    .populate('members', 'name email');

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Line 96**: **Only owner can update project**
- Members can view but not edit

**Line 101**: `findByIdAndUpdate` options:
- `{ new: true }` - Return updated document (not original)
- `runValidators: true` - Run Mongoose schema validations on update

---

### **Lines 115-137: Delete Project**

```javascript
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Line 125**: **Only owner can delete** - Critical security check

**Line 129**: `findByIdAndDelete` - Removes from database

**Line 131**: Returns deleted project ID - Frontend uses this to remove from UI

---

### **Lines 142-171: Add Member**

```javascript
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add members' });
    }

    // Check if member already exists
    if (project.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push(userId);
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Line 157**: Check if already a member - Prevents duplicates

**Line 161**: Add to members array
- `push(userId)` - Appends to array

**Line 162**: `await project.save()` - **Critical!**
- Changes to document must be explicitly saved
- Triggers Mongoose validators and middleware

**Lines 164-166**: Re-fetch with populated data to return full member objects

---

### **Lines 176-201: Remove Member**

```javascript
exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to remove members' });
    }

    project.members = project.members.filter(
      member => member.toString() !== req.params.userId
    );
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Lines 189-191**: Filter out member
- `.filter()` keeps all members except the one being removed
- `member.toString()` - Convert ObjectId to string for comparison
- `req.params.userId` - Member ID from URL: `/api/projects/:id/members/:userId`

---

## 🔒 Authorization Matrix

| Operation | Owner | Member | Other |
|-----------|-------|--------|-------|
| View | ✅ | ✅ | ❌ |
| Create | ✅ | N/A | N/A |
| Update | ✅ | ❌ | ❌ |
| Delete | ✅ | ❌ | ❌ |
| Add Member | ✅ | ❌ | ❌ |
| Remove Member | ✅ | ❌ | ❌ |

**Key principle**: Members can view, only owners can modify

---

## 🔄 Data Flow Examples

### **Create Project Flow**
```
POST /api/projects
Body: { name: "Bug Tracker", description: "...", status: "Planning" }
  ↓
Validate required fields
  ↓
Create project with owner = current user ID
  ↓
Save to database
  ↓
Populate owner/members (convert IDs to objects)
  ↓
Return populated project (201 Created)
```

### **Add Member Flow**
```
POST /api/projects/123/members
Body: { userId: "456" }
  ↓
Find project
  ↓
Check user is owner
  ↓
Check member not already added
  ↓
Push userId to members array
  ↓
Save project
  ↓
Populate members
  ↓
Return updated project
```

---

## 🚨 Common Issues

**Issue**: Members array not updating in UI
```javascript
// WRONG - Forgot to save
project.members.push(userId);
res.json(project);  // Change not persisted!

// CORRECT - Save before returning
project.members.push(userId);
await project.save();
res.json(project);
```

**Issue**: ObjectId comparison fails
```javascript
// WRONG - Comparing ObjectId object to string
if (project.owner._id === req.user.id)  // Always false!

// CORRECT - Convert to string
if (project.owner._id.toString() === req.user.id)
```

**Issue**: Populated fields not returned
```javascript
// WRONG - Don't populate after create
const project = await Project.create({...});
res.json(project);  // owner is just an ID!

// CORRECT - Re-fetch with populate
const project = await Project.create({...});
const populated = await Project.findById(project._id)
  .populate('owner', 'name email');
  res.json(populated);

---

## 📚 Technical Terms Glossary
- `populate`: Mongoose method to replace referenced ObjectId fields with full documents (e.g., `.populate('owner', 'name email')`).
- `req.user`: Authenticated user object attached by the auth middleware; used for authorization checks.
- `runValidators`: Option for update operations that runs schema validators on updates.
- `findByIdAndUpdate`: Mongoose helper that updates a document by id and can return the updated doc with `{ new: true }`.

## 🧑‍💻 Important Import & Syntax Explanations
- `const X = require('x')` vs `import X from 'x'`: CommonJS (`require`) vs ESM (`import`) module styles.
- `async/await` and `try/catch`: Used to handle asynchronous database operations; always catch errors and return appropriate HTTP responses.
- `res.status(code).json(payload)`: Standard pattern to send HTTP responses with status codes and JSON bodies.
- `if (!resource) return res.status(404).json(...)`: Standard resource-existence check after `findById`.
```

---

## 🔗 Related Files
- [Project Model](../models/backend-models-Project.md) - Schema definition
- [auth middleware](../core/backend-core-auth-middleware.md) - Sets req.user
- [ProjectContext.jsx](../../frontend/contexts/frontend-context-ProjectContext.md) - Frontend project management

---

Core project management - handles all project operations! 📁✨
