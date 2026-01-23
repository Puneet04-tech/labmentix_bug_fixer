# Backend Routes: projects.js - Line by Line Explanation

**Location**: `backend/routes/projects.js` | **Lines**: 27

## 📋 Overview

Project routes with CRUD operations and member management. **All routes protected** via `router.use(auth)`.

**Routes:**
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member
- `DELETE /api/projects/:id/members/:userId` - Remove member

---

## 🔍 Code Analysis

**Global Auth (Line 14):**
```javascript
router.use(auth);
```
Applies auth middleware to **all routes** below this line.

**CRUD Routes (Lines 17-21):**
```javascript
router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
```

**Member Management (Lines 24-25):**
```javascript
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);
```
Only project owner can add/remove members (checked in controller).

---

## 🔗 Related Files
- [projectController.js](backend-controller-project.md) - Authorization checks
