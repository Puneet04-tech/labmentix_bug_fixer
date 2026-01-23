# Backend Model: Ticket.js - Line by Line Explanation

**Location**: `backend/models/Ticket.js` | **Lines**: 67

## 📋 Overview

Mongoose schema for bug tickets with project/user references and indexed queries.

**Key Features:**
- Project reference (required)
- AssignedTo/ReportedBy user references
- Type/Status/Priority enums
- Compound indexes for performance
- Auto-update `updatedAt`

---

## 🔍 Code Analysis

**Schema Fields:**
- `title`: Required, max 100 chars
- `description`: Required, max 2000 chars
- `type`: Enum ['Bug', 'Feature', 'Improvement', 'Task']
- `status`: Enum ['Open', 'In Progress', 'In Review', 'Resolved', 'Closed']
- `priority`: Enum ['Low', 'Medium', 'High', 'Critical']
- `project`: ObjectId ref (required)
- `assignedTo`: ObjectId ref (optional)
- `reportedBy`: ObjectId ref (required)
- `dueDate`: Date (optional)

**Indexes (Lines 62-63):**
```javascript
ticketSchema.index({ project: 1, status: 1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
```
Optimizes queries:
- "Get all tickets for project X with status Y"
- "Get all tickets assigned to user with status Y"

**Pre-save Hook:**
Updates `updatedAt` on every save.

---

## 🔗 Related Files
- [ticketController.js](backend-controller-ticket.md) - CRUD + filtering
