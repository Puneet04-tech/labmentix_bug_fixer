# Backend Controller: projectController.js - Complete Explanation

Project CRUD operations with team member management.

## 📋 Overview
- **Lines**: 205
- **Functions**: 7 (getProjects, getProject, createProject, updateProject, deleteProject, addMember, removeMember)
- **Authorization**: Owner-only for modifications, owner/member for reads

---

## 🔑 **Function 1: getProjects (Lines 6-21)**

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

### Line-by-Line Breakdown:

**Line 8-12: MongoDB $or Query**
```javascript
const projects = await Project.find({
  $or: [
    { owner: req.user.id },
    { members: req.user.id }
  ]
})
```
- **$or operator**: Returns projects where EITHER condition is true
- **Condition 1**: User is the owner
- **Condition 2**: User is a member
- **Result**: User sees projects they own OR are part of

**Line 13-14: Populate Relations**
```javascript
.populate('owner', 'name email')
.populate('members', 'name email')
```
- **populate('owner')**: Replace owner ID with full user object
- **Select fields**: Only include name and email (exclude password)
- **populate('members')**: Same for all members array

**Line 15: Sort**
```javascript
.sort({ createdAt: -1 });
```
- **-1**: Descending order (newest first)
- **createdAt**: Sort by creation date

**Example Flow**:
```
User ID: 123
Projects in DB:
  Project A (owner: 123, members: []) → ✅ Returned (owner match)
  Project B (owner: 456, members: [123, 789]) → ✅ Returned (member match)
  Project C (owner: 456, members: [789]) → ❌ Not returned (no match)
```

---

## 🔑 **Function 2: getProject (Lines 26-48)**

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

### Authorization Logic:

**Line 37: Owner Check**
```javascript
const isOwner = project.owner._id.toString() === req.user.id;
```
- **toString()**: Convert MongoDB ObjectId to string for comparison
- **Why needed**: `ObjectId('abc') !== 'abc'` without conversion

**Line 38: Member Check**
```javascript
const isMember = project.members.some(member => member._id.toString() === req.user.id);
```
- **some()**: Returns true if ANY member matches
- **Iterates** through members array until finding match

**Line 40-42: Authorization Guard**
```javascript
if (!isOwner && !isMember) {
  return res.status(403).json({ message: 'Not authorized to access this project' });
}
```
- **403 Forbidden**: User authenticated but not authorized
- **Requires**: User must be owner OR member

---

## 🔑 **Function 3: createProject (Lines 53-80)**

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

### Default Values Strategy:

**Line 64-69: Using OR Operator**
```javascript
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
```
- **status || 'Planning'**: If status not provided, use 'Planning'
- **priority || 'Medium'**: Default priority
- **startDate || Date.now()**: Default to current date
- **members || []**: Default empty array if not provided

**Line 72-74: Populate After Creation**
```javascript
const populatedProject = await Project.findById(project._id)
  .populate('owner', 'name email')
  .populate('members', 'name email');
```
**Why separate query?**
- **Project.create()** returns document with IDs only
- **Need to populate** to return full user objects
- **Alternative approach**: Could use `project.populate()` but this is clearer

---

## 🔑 **Function 4: updateProject (Lines 85-113)**

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

### Update Options Explained:

**Line 101-103: findByIdAndUpdate Options**
```javascript
project = await Project.findByIdAndUpdate(
  req.params.id,
  req.body,
  { new: true, runValidators: true }
)
```
- **new: true**: Return updated document (not original)
- **runValidators: true**: Run Mongoose schema validators on update
- **Without new: true**: Would return old version before update

**Example**:
```javascript
// Before update
{ name: 'Old Name', status: 'Planning' }

// Update request
{ name: 'New Name', status: 'Active' }

// With new: true
Returns: { name: 'New Name', status: 'Active' }

// Without new: true
Returns: { name: 'Old Name', status: 'Planning' }
```

---

## 🔑 **Function 5: deleteProject (Lines 118-139)**

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

**Security**: Only owner can delete (line 128)
**Return value**: Includes deleted project ID for frontend to remove from state

---

## 🔑 **Function 6: addMember (Lines 144-173)**

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

### Duplicate Prevention:

**Line 160-162: Check Existing Member**
```javascript
if (project.members.includes(userId)) {
  return res.status(400).json({ message: 'User is already a member' });
}
```
- **includes()**: Checks if userId exists in members array
- **Prevents duplicates**: MongoDB doesn't enforce array uniqueness
- **400 Bad Request**: Client error for duplicate request

---

## 🔑 **Function 7: removeMember (Lines 178-205)**

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

### Array Filtering:

**Line 192-194: Remove Member**
```javascript
project.members = project.members.filter(
  member => member.toString() !== req.params.userId
);
```
- **filter()**: Returns new array excluding matching userId
- **toString()**: Convert ObjectId for comparison
- **Result**: All members EXCEPT the one being removed

---

## 🔄 Complete Authorization Matrix

```
Operation      | Owner | Member | Non-member
---------------|-------|--------|------------
getProjects    |  ✅   |  ✅    |  ❌
getProject     |  ✅   |  ✅    |  ❌
createProject  |  ✅   |  ✅    |  ✅  (becomes owner)
updateProject  |  ✅   |  ❌    |  ❌
deleteProject  |  ✅   |  ❌    |  ❌
addMember      |  ✅   |  ❌    |  ❌
removeMember   |  ✅   |  ❌    |  ❌
```

---

## 🎯 Usage Examples

### Creating Project with Members
```javascript
POST /api/projects
{
  "name": "Bug Tracker",
  "description": "Track bugs",
  "members": ["userId1", "userId2"]
}
```

### Querying Projects
```javascript
// User 123 owns Project A
// User 123 is member of Project B
// User 456 owns Project C

GET /api/projects (as user 123)
// Returns: [Project A, Project B]
// Does NOT return Project C
```

---

## 📚 Related Files
- [backend-models-Project.md](backend-models-Project.md) - Project schema
- [backend-routes-projects.md](backend-routes-projects.md) - Route definitions
- [frontend-context-ProjectContext.md](frontend-context-ProjectContext.md) - Frontend integration
- [backend-middleware-auth.md](backend-middleware-auth.md) - req.user population
