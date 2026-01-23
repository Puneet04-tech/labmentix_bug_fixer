# Backend Routes: projects.js - Complete Explanation

Express router for project CRUD and team member management.

## 📋 Overview
- **Lines**: 29
- **Routes**: 7 (all protected)
- **Features**: CRUD operations, member management

---

## 🔑 Complete Code

```javascript
const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Project CRUD routes
router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

// Member management routes
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
```

---

## 🔒 Global Middleware (Line 15)

```javascript
router.use(auth);
```
**Effect**: ALL routes below this line require authentication
**Alternative**: Could add `auth` to each route individually, but this is cleaner

---

## 📍 Route Definitions

### **1. GET /api/projects** (Line 18)
```javascript
router.get('/', getProjects);
```
- **Purpose**: Get all projects user owns or is member of
- **Query params**: None
- **Response**: Array of projects with populated owner and members

---

### **2. POST /api/projects** (Line 19)
```javascript
router.post('/', createProject);
```
- **Purpose**: Create new project
- **Body**: `{ name, description, status?, priority?, startDate?, endDate?, members? }`
- **Response**: Created project (201)

---

### **3. GET /api/projects/:id** (Line 20)
```javascript
router.get('/:id', getProject);
```
- **Purpose**: Get single project details
- **Params**: `id` - Project ID
- **Authorization**: Must be owner or member
- **Response**: Project with populated fields

---

### **4. PUT /api/projects/:id** (Line 21)
```javascript
router.put('/:id', updateProject);
```
- **Purpose**: Update project
- **Params**: `id` - Project ID
- **Body**: Any project fields to update
- **Authorization**: Owner only
- **Response**: Updated project

---

### **5. DELETE /api/projects/:id** (Line 22)
```javascript
router.delete('/:id', deleteProject);
```
- **Purpose**: Delete project
- **Params**: `id` - Project ID
- **Authorization**: Owner only
- **Response**: Success message with deleted ID

---

### **6. POST /api/projects/:id/members** (Line 25)
```javascript
router.post('/:id/members', addMember);
```
- **Purpose**: Add team member to project
- **Params**: `id` - Project ID
- **Body**: `{ userId }`
- **Authorization**: Owner only
- **Response**: Updated project with new member

---

### **7. DELETE /api/projects/:id/members/:userId** (Line 26)
```javascript
router.delete('/:id/members/:userId', removeMember);
```
- **Purpose**: Remove team member from project
- **Params**: 
  - `id` - Project ID
  - `userId` - User to remove
- **Authorization**: Owner only
- **Response**: Updated project without removed member

---

## 🎯 Usage Examples

### 1. Get All Projects
```javascript
GET /api/projects
Authorization: Bearer <token>

Response:
[
  {
    "_id": "proj1",
    "name": "Bug Tracker",
    "description": "Track bugs",
    "owner": { "name": "Alice", "email": "alice@example.com" },
    "members": [{ "name": "Bob", "email": "bob@example.com" }],
    "status": "Active"
  }
]
```

### 2. Create Project
```javascript
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project description",
  "members": ["userId1", "userId2"]
}

Response (201):
{
  "_id": "proj2",
  "name": "New Project",
  "owner": { "name": "Alice", "email": "alice@example.com" },
  "members": [...]
}
```

### 3. Get Single Project
```javascript
GET /api/projects/proj1
Authorization: Bearer <token>

Response:
{
  "_id": "proj1",
  "name": "Bug Tracker",
  "owner": {...},
  "members": [...]
}
```

### 4. Update Project
```javascript
PUT /api/projects/proj1
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Completed",
  "priority": "Low"
}

Response:
{
  "_id": "proj1",
  "name": "Bug Tracker",
  "status": "Completed",
  "priority": "Low",
  ...
}
```

### 5. Delete Project
```javascript
DELETE /api/projects/proj1
Authorization: Bearer <token>

Response:
{
  "message": "Project deleted successfully",
  "id": "proj1"
}
```

### 6. Add Member
```javascript
POST /api/projects/proj1/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user123"
}

Response:
{
  "_id": "proj1",
  "members": [
    { "_id": "user456", "name": "Bob", "email": "bob@example.com" },
    { "_id": "user123", "name": "Charlie", "email": "charlie@example.com" }
  ]
}
```

### 7. Remove Member
```javascript
DELETE /api/projects/proj1/members/user123
Authorization: Bearer <token>

Response:
{
  "_id": "proj1",
  "members": [
    { "_id": "user456", "name": "Bob", "email": "bob@example.com" }
  ]
}
```

---

## 📚 Related Files
- [backend-controllers-project.md](backend-controllers-project.md) - Controller logic
- [backend-models-Project.md](backend-models-Project.md) - Project schema
- [frontend-context-ProjectContext.md](frontend-context-ProjectContext.md) - Frontend integration
