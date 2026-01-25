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
 - [projectController.js](backend-controller-project.md) - Authorization checks

---

## 📚 Technical Terms Glossary
- `router.use(auth)`: Protect all routes below this call with the auth middleware.
- `router.post('/:id/members', addMember)`: Route for modifying nested resources (members subresource).

## 🧑‍💻 Important Import & Syntax Explanations
- Member management routes use `req.params` to get path variables such as `:id` and `:userId`.
- Use controller-level checks (owner-only) for sensitive operations like adding/removing members.

---

## 🧪 Sample Requests & Responses

- Create project — `POST /api/projects`
```http
POST /api/projects
Content-Type: application/json
Authorization: Bearer <token>

{
	"name": "Website Redesign",
	"description": "Redesign marketing site",
	"members": ["userId1", "userId2"]
}
```
Response (201 Created):
```json
{
	"id": "projId",
	"name": "Website Redesign",
	"owner": "userIdOwner",
	"members": ["userIdOwner", "userId1", "userId2"],
	"createdAt": "2024-01-01T12:00:00.000Z"
}
```

- Get project — `GET /api/projects/:id`
```http
GET /api/projects/projId
Authorization: Bearer <token>
```
Response (200 OK):
```json
{
	"id": "projId",
	"name": "Website Redesign",
	"description": "Redesign marketing site",
	"owner": "userIdOwner",
	"members": ["userIdOwner", "userId1", "userId2"],
	"createdAt": "2024-01-01T12:00:00.000Z"
}
```

---

## ⚠️ Edge Cases & Notes

- Missing or invalid `Authorization` header: server responds with `401 Unauthorized`.
- Invalid `:id` format (not a valid ObjectId): respond `400 Bad Request` with validation error.
- Accessing a project the user is not a member of: respond `403 Forbidden` or `404 Not Found` depending on controller behavior.
- Updating/deleting by a non-owner: respond `403 Forbidden` — enforce owner-only checks in controller.
- Adding an existing member: handle idempotently (no-op) or respond `409 Conflict` — pick one behavior and document it in controller.
- Removing the last owner: prevent or transfer ownership first; otherwise operations may leave project without an owner.
- Concurrent member modifications: ensure atomic updates (use Mongoose update operators) to avoid lost updates.

