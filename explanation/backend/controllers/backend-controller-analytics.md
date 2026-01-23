# Backend Controller: analyticsController.js - Analytics & Statistics

## 📋 File Overview
**Location**: `backend/controllers/analyticsController.js`  
**Lines**: 315  
**Purpose**: Generate dashboard statistics and analytics

---

## 🎯 Core Functions
1. **getOverview** - Overall statistics (projects, tickets, comments)
2. **getProjectStats** - Per-project completion rates
3. **getTicketTrends** - 30-day ticket creation/resolution trends
4. **getUserActivity** - Current user's activity stats
5. **getTeamPerformance** - Team member performance metrics

---

## 📝 KEY SECTIONS

### **Lines 9-73: Overview Statistics**

**MongoDB Aggregation Pipeline**:
```javascript
const ticketsByStatus = await Ticket.aggregate([
  { $match: { project: { $in: projectIds } } },
  { $group: { _id: '$status', count: { $sum: 1 } } }
]);
```

**What it does**:
1. `$match` - Filter tickets by user's projects
2. `$group` - Group by status field
3. `$sum: 1` - Count tickets in each group

**Result**: `[{ _id: 'Open', count: 5 }, { _id: 'Closed', count: 3 }]`

**Line 56**: Transform to object format:
```javascript
ticketsByStatus.reduce((acc, item) => {
  acc[item._id] = item.count;
  return acc;
}, {})
// Result: { Open: 5, Closed: 3 }
```

---

### **Lines 78-112: Project Statistics**

```javascript
const projectStats = await Promise.all(
  userProjects.map(async (project) => {
    const totalTickets = await Ticket.countDocuments({ project: project._id });
    const openTickets = await Ticket.countDocuments({ 
      project: project._id, 
      status: { $in: ['Open', 'In Progress', 'In Review'] }
    });
    const closedTickets = await Ticket.countDocuments({ 
      project: project._id, 
      status: { $in: ['Resolved', 'Closed'] }
    });

    return {
      id: project._id,
      name: project.name,
      status: project.status,
      priority: project.priority,
      totalTickets,
      openTickets,
      closedTickets,
      completionRate: totalTickets > 0 ? Math.round((closedTickets / totalTickets) * 100) : 0
    };
  })
);
```

**Line 87**: `Promise.all` - Run all queries in parallel (faster)
**Line 105**: Completion rate calculation - Percentage of closed tickets

---

### **Lines 117-181: Ticket Trends (Last 30 Days)**

```javascript
const ticketTrends = await Ticket.aggregate([
  { 
    $match: { 
      project: { $in: projectIds },
      createdAt: { $gte: thirtyDaysAgo }
    } 
  },
  {
    $group: {
      _id: { 
        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
      },
      created: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);
```

**Line 142**: `$dateToString` - Convert date to `YYYY-MM-DD` string
- Groups tickets by day
- Example: All tickets created on 2024-01-15 grouped together

**Lines 164-177**: Merge created and resolved trends
- Creates array with both metrics per day
- Used for dual-line chart in frontend

---

### **Lines 202-252: User Activity Stats**

```javascript
const ticketsCreated = await Ticket.countDocuments({ 
  reportedBy: req.user.id,
  project: { $in: projectIds }
});

const ticketsAssigned = await Ticket.countDocuments({ 
  assignedTo: req.user.id,
  project: { $in: projectIds }
});
```

**Shows**: Current user's contributions
- Tickets they created
- Tickets assigned to them
- Comments posted
- Projects owned

---

### **Lines 257-315: Team Performance**

```javascript
const teamStats = await Promise.all(
  Array.from(allMembers).map(async (memberId) => {
    const assignedTickets = await Ticket.countDocuments({
      assignedTo: memberId,
      project: { $in: projectIds }
    });

    const resolvedTickets = await Ticket.countDocuments({
      assignedTo: memberId,
      project: { $in: projectIds },
      status: { $in: ['Resolved', 'Closed'] }
    });

    return {
      id: memberId,
      name: member.name,
      email: member.email,
      assignedTickets,
      resolvedTickets,
      commentsCount,
      resolutionRate: assignedTickets > 0 ? Math.round((resolvedTickets / assignedTickets) * 100) : 0
    };
  })
);
```

**Line 307**: Resolution rate - Percentage of assigned tickets resolved
**Only includes**: Projects where current user is owner (owner can see team stats)

---

## 🔄 Analytics Data Flow

```
Frontend: GET /api/analytics/overview
  ↓
Get user's projects (owner OR member)
  ↓
Run 3 aggregation queries in parallel:
  - Group tickets by status
  - Group tickets by priority
  - Group tickets by type
  ↓
Count total tickets, comments, recent activity
  ↓
Return formatted object with all stats
  ↓
Frontend: Renders charts and stat cards
```

---

## 🔗 Related Files
- [Analytics.jsx](../../frontend/pages/frontend-pages-Analytics.md) - Frontend dashboard
- [StatsCard.jsx](../../frontend/components/frontend-component-StatsCard.md) - Stat display component

---

Powerful analytics - provides insights into project health! 📊✨

---

## 📚 Technical Terms Glossary
- `aggregate()`: MongoDB aggregation pipeline method for grouping, projecting, and transforming data efficiently.
- `$match`, `$group`, `$sort`, `$project`: Core aggregation stages used in analytics queries.
- `Promise.all`: Runs multiple async operations in parallel and waits for all to complete.

## 🧑‍💻 Important Import & Syntax Explanations
- `const result = await Model.aggregate([...])`: Use aggregation for complex DB-side calculations rather than multiple round trips.
- `$dateToString`: Convert date fields to strings for grouping by day/month in aggregation pipelines.
- `Array.map` + `Promise.all` pattern: Map over items to start async operations, then await all results in parallel.
