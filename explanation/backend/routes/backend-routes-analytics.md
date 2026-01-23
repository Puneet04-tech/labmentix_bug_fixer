# Backend Routes: analytics.js - Complete Explanation

Express router for analytics and dashboard statistics.

## 📋 Overview
- **Lines**: 23
- **Routes**: 5 (all protected)
- **Features**: Dashboard overview, project stats, trends, user activity, team performance

---

## 🔑 Complete Code

```javascript
const express = require('express');
const router = express.Router();
const {
  getOverview,
  getProjectStats,
  getTicketTrends,
  getUserActivity,
  getTeamPerformance
} = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Analytics routes
router.get('/overview', getOverview);
router.get('/projects', getProjectStats);
router.get('/trends', getTicketTrends);
router.get('/user-activity', getUserActivity);
router.get('/team', getTeamPerformance);

module.exports = router;
```

---

## 📍 Route Definitions

### **1. GET /api/analytics/overview** (Line 16)
```javascript
router.get('/overview', getOverview);
```
- **Purpose**: Get dashboard overview statistics
- **Response**: 
  - Total counts (projects, tickets, comments)
  - Recent activity (last 7 days)
  - Breakdowns by status, priority, type

**Response Structure**:
```javascript
{
  totalProjects: 5,
  totalTickets: 47,
  totalComments: 123,
  recentTickets: 8,
  ticketsByStatus: { "Open": 15, "In Progress": 12, "Resolved": 20 },
  ticketsByPriority: { "Low": 10, "Medium": 25, "High": 12 },
  ticketsByType: { "Bug": 30, "Feature": 12, "Task": 5 }
}
```

---

### **2. GET /api/analytics/projects** (Line 17)
```javascript
router.get('/projects', getProjectStats);
```
- **Purpose**: Get statistics for each project
- **Response**: Array of project stats with completion rates

**Response Structure**:
```javascript
[
  {
    id: "proj1",
    name: "Bug Tracker",
    status: "Active",
    priority: "High",
    totalTickets: 25,
    openTickets: 10,
    closedTickets: 15,
    completionRate: 60
  },
  {
    id: "proj2",
    name: "Feature Request",
    status: "Planning",
    priority: "Medium",
    totalTickets: 15,
    openTickets: 12,
    closedTickets: 3,
    completionRate: 20
  }
]
```

---

### **3. GET /api/analytics/trends** (Line 18)
```javascript
router.get('/trends', getTicketTrends);
```
- **Purpose**: Get ticket creation/resolution trends (last 30 days)
- **Response**: Daily breakdown of tickets created and resolved

**Response Structure**:
```javascript
[
  { date: "2024-01-15", created: 5, resolved: 2 },
  { date: "2024-01-16", created: 3, resolved: 4 },
  { date: "2024-01-17", created: 8, resolved: 1 },
  { date: "2024-01-18", created: 2, resolved: 3 }
  // ... 30 days of data
]
```

**Use case**: Line charts showing ticket trends over time

---

### **4. GET /api/analytics/user-activity** (Line 19)
```javascript
router.get('/user-activity', getUserActivity);
```
- **Purpose**: Get current user's activity statistics
- **Response**: Personal metrics for logged-in user

**Response Structure**:
```javascript
{
  ticketsCreated: 15,
  ticketsAssigned: 20,
  commentsPosted: 48,
  projectsOwned: 3,
  recentTicketsCreated: 4  // Last 7 days
}
```

---

### **5. GET /api/analytics/team** (Line 20)
```javascript
router.get('/team', getTeamPerformance);
```
- **Purpose**: Get team member performance (owner-only)
- **Authorization**: Returns stats for projects where current user is owner
- **Response**: Array of team member statistics

**Response Structure**:
```javascript
[
  {
    id: "user123",
    name: "Alice",
    email: "alice@example.com",
    assignedTickets: 20,
    resolvedTickets: 18,
    commentsCount: 35,
    resolutionRate: 90
  },
  {
    id: "user456",
    name: "Bob",
    email: "bob@example.com",
    assignedTickets: 15,
    resolvedTickets: 10,
    commentsCount: 22,
    resolutionRate: 67
  }
]
```

---

## 🎯 Usage Examples

### 1. Dashboard Overview
```javascript
GET /api/analytics/overview
Authorization: Bearer <token>

Response:
{
  totalProjects: 5,
  totalTickets: 47,
  totalComments: 123,
  recentTickets: 8,
  ticketsByStatus: {
    "Open": 15,
    "In Progress": 12,
    "In Review": 5,
    "Resolved": 10,
    "Closed": 5
  },
  ticketsByPriority: {
    "Low": 10,
    "Medium": 25,
    "High": 10,
    "Critical": 2
  },
  ticketsByType: {
    "Bug": 30,
    "Feature": 12,
    "Enhancement": 3,
    "Task": 2
  }
}
```

### 2. Project Statistics
```javascript
GET /api/analytics/projects
Authorization: Bearer <token>

Response:
[
  {
    id: "proj1",
    name: "Bug Tracker v2",
    status: "Active",
    priority: "High",
    totalTickets: 25,
    openTickets: 10,
    closedTickets: 15,
    completionRate: 60
  },
  {
    id: "proj2",
    name: "Mobile App",
    status: "In Development",
    priority: "Critical",
    totalTickets: 40,
    openTickets: 35,
    closedTickets: 5,
    completionRate: 13
  }
]
```

### 3. Ticket Trends (Chart Data)
```javascript
GET /api/analytics/trends
Authorization: Bearer <token>

Response:
[
  { date: "2024-01-01", created: 3, resolved: 1 },
  { date: "2024-01-02", created: 5, resolved: 2 },
  { date: "2024-01-03", created: 2, resolved: 4 },
  { date: "2024-01-04", created: 7, resolved: 3 },
  { date: "2024-01-05", created: 4, resolved: 5 },
  // ... continues for 30 days
]
```

**Frontend Usage**:
```javascript
// Can be used to create line chart with Chart.js
const labels = trends.map(t => t.date);
const createdData = trends.map(t => t.created);
const resolvedData = trends.map(t => t.resolved);
```

### 4. Personal Activity
```javascript
GET /api/analytics/user-activity
Authorization: Bearer <token>

Response:
{
  ticketsCreated: 15,
  ticketsAssigned: 20,
  commentsPosted: 48,
  projectsOwned: 3,
  recentTicketsCreated: 4
}
```

### 5. Team Performance
```javascript
GET /api/analytics/team
Authorization: Bearer <token>

Response:
[
  {
    id: "user123",
    name: "Alice Johnson",
    email: "alice@example.com",
    assignedTickets: 25,
    resolvedTickets: 23,
    commentsCount: 45,
    resolutionRate: 92
  },
  {
    id: "user456",
    name: "Bob Smith",
    email: "bob@example.com",
    assignedTickets: 18,
    resolvedTickets: 12,
    commentsCount: 28,
    resolutionRate: 67
  },
  {
    id: "user789",
    name: "Charlie Brown",
    email: "charlie@example.com",
    assignedTickets: 30,
    resolvedTickets: 20,
    commentsCount: 52,
    resolutionRate: 67
  }
]
```

### 6. Team Performance (Not Owner)
```javascript
// User is only a member, not owner of any projects
GET /api/analytics/team
Authorization: Bearer <member_token>

Response:
[]
```
**Note**: Only project owners see team stats

---

## 📊 Frontend Integration Example

```javascript
// Dashboard.jsx
import { useEffect, useState } from 'react';
import API from '../utils/api';

function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      const [overviewRes, trendsRes] = await Promise.all([
        API.get('/analytics/overview'),
        API.get('/analytics/trends')
      ]);
      setOverview(overviewRes.data);
      setTrends(trendsRes.data);
    };
    
    fetchAnalytics();
  }, []);
  
  return (
    <div>
      <h2>Total Projects: {overview?.totalProjects}</h2>
      <h2>Total Tickets: {overview?.totalTickets}</h2>
      <LineChart data={trends} />
    </div>
  );
}
```

---

## 🔒 Authorization Notes

- **All routes**: Require authentication
- **overview, projects, trends, user-activity**: Show data for user's accessible projects
- **team**: Only returns data for projects where user is OWNER

---

## 📚 Related Files
- [backend-controllers-analytics.md](backend-controllers-analytics.md) - Controller logic with MongoDB aggregations
- [frontend-pages-Dashboard.md](frontend-pages-Dashboard.md) - Overview UI
- [frontend-pages-Analytics.md](frontend-pages-Analytics.md) - Charts and detailed analytics
- [backend-models-Ticket.md](backend-models-Ticket.md) - Ticket schema for aggregations
