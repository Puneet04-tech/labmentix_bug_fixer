# Backend Controller: analyticsController.js - Complete Explanation

Dashboard analytics using MongoDB aggregations and statistics.

## 📋 Overview
- **Lines**: 315
- **Functions**: 5 (getOverview, getProjectStats, getTicketTrends, getUserActivity, getTeamPerformance)
- **Key Features**: MongoDB aggregations, date filtering, completion rates, team statistics

---

## 🔑 **Function 1: getOverview (Lines 8-75)**

```javascript
exports.getOverview = async (req, res) => {
  try {
    // Get user's projects
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    });

    const projectIds = userProjects.map(p => p._id);

    // Get counts
    const totalProjects = userProjects.length;
    const totalTickets = await Ticket.countDocuments({ project: { $in: projectIds } });
    const totalComments = await Comment.countDocuments({ 
      ticket: { $in: await Ticket.find({ project: { $in: projectIds } }).distinct('_id') }
    });

    // Ticket status breakdown
    const ticketsByStatus = await Ticket.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Ticket priority breakdown
    const ticketsByPriority = await Ticket.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Ticket type breakdown
    const ticketsByType = await Ticket.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Recent activity (tickets created in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentTickets = await Ticket.countDocuments({
      project: { $in: projectIds },
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      totalProjects,
      totalTickets,
      totalComments,
      recentTickets,
      ticketsByStatus: ticketsByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      ticketsByPriority: ticketsByPriority.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      ticketsByType: ticketsByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### MongoDB Aggregation Pipeline:

**Lines 29-32: Status Breakdown**
```javascript
const ticketsByStatus = await Ticket.aggregate([
  { $match: { project: { $in: projectIds } } },
  { $group: { _id: '$status', count: { $sum: 1 } } }
]);
```

**Aggregation stages**:
1. **$match**: Filter tickets by user's projects
2. **$group**: Group by status field, count each group

**Example output**:
```javascript
[
  { _id: 'Open', count: 15 },
  { _id: 'In Progress', count: 8 },
  { _id: 'Resolved', count: 12 }
]
```

### Array to Object Transformation:

**Lines 59-62: Convert to Object**
```javascript
ticketsByStatus: ticketsByStatus.reduce((acc, item) => {
  acc[item._id] = item.count;
  return acc;
}, {})
```

**Why reduce()?**
- **Input**: `[{ _id: 'Open', count: 15 }, { _id: 'Resolved', count: 12 }]`
- **Output**: `{ 'Open': 15, 'Resolved': 12 }`
- **Benefit**: Easier to access in frontend with `stats.Open` instead of finding in array

**Step-by-step**:
```javascript
Initial: acc = {}
Item 1: { _id: 'Open', count: 15 }
  → acc['Open'] = 15
  → acc = { Open: 15 }
Item 2: { _id: 'Resolved', count: 12 }
  → acc['Resolved'] = 12
  → acc = { Open: 15, Resolved: 12 }
```

### Date Filtering:

**Lines 47-52: Last 7 Days**
```javascript
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const recentTickets = await Ticket.countDocuments({
  project: { $in: projectIds },
  createdAt: { $gte: sevenDaysAgo }
});
```
- **setDate()**: Modify date 7 days back
- **$gte**: Greater than or equal (MongoDB operator)
- **Result**: Count tickets created in last 7 days

---

## 🔑 **Function 2: getProjectStats (Lines 80-121)**

```javascript
exports.getProjectStats = async (req, res) => {
  try {
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    }).select('name status priority');

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

    res.json(projectStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Promise.all for Parallel Queries:

**Lines 90-109: Map + Promise.all**
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
    return { /* stats */ };
  })
);
```

**Why Promise.all?**
- **Without**: Process projects sequentially (slow)
  - Project A queries → wait
  - Project B queries → wait
  - Project C queries → wait
- **With**: Process all projects in parallel (fast)
  - All projects query simultaneously

**Performance**:
- **5 projects, 200ms per query**:
  - Sequential: 5 × 200ms = 1000ms
  - Parallel: ~200ms (all at once)

### Completion Rate Calculation:

**Line 108: Percentage Math**
```javascript
completionRate: totalTickets > 0 ? Math.round((closedTickets / totalTickets) * 100) : 0
```
- **Formula**: `(closed / total) × 100`
- **Math.round()**: Round to nearest integer
- **Guard**: Check totalTickets > 0 to avoid division by zero

**Examples**:
```javascript
// 15 closed out of 20 total
(15 / 20) * 100 = 75%

// 8 closed out of 10 total
(8 / 10) * 100 = 80%

// 0 tickets
0 total → return 0 (not divide by zero)
```

---

## 🔑 **Function 3: getTicketTrends (Lines 126-185)**

```javascript
exports.getTicketTrends = async (req, res) => {
  try {
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    });

    const projectIds = userProjects.map(p => p._id);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Tickets created per day
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

    // Tickets resolved per day
    const resolvedTrends = await Ticket.aggregate([
      { 
        $match: { 
          project: { $in: projectIds },
          status: { $in: ['Resolved', 'Closed'] },
          updatedAt: { $gte: thirtyDaysAgo }
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' }
          },
          resolved: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Merge trends
    const trends = {};
    ticketTrends.forEach(item => {
      trends[item._id] = { date: item._id, created: item.created, resolved: 0 };
    });
    resolvedTrends.forEach(item => {
      if (trends[item._id]) {
        trends[item._id].resolved = item.resolved;
      } else {
        trends[item._id] = { date: item._id, created: 0, resolved: item.resolved };
      }
    });

    const trendArray = Object.values(trends).sort((a, b) => a.date.localeCompare(b.date));

    res.json(trendArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Date Aggregation with $dateToString:

**Lines 148-154: Group by Date**
```javascript
{
  $group: {
    _id: { 
      $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
    },
    created: { $sum: 1 }
  }
}
```

**What it does**:
- **$dateToString**: Convert date to string format
- **format: '%Y-%m-%d'**: Output as "2024-01-15"
- **Group by date string**: Count tickets per day

**Example**:
```javascript
Input tickets:
  { createdAt: 2024-01-15T10:30:00Z }
  { createdAt: 2024-01-15T14:20:00Z }
  { createdAt: 2024-01-16T09:00:00Z }

Output:
  [
    { _id: '2024-01-15', created: 2 },
    { _id: '2024-01-16', created: 1 }
  ]
```

### Merging Two Trend Arrays:

**Lines 175-185: Merge Created + Resolved**
```javascript
const trends = {};
ticketTrends.forEach(item => {
  trends[item._id] = { date: item._id, created: item.created, resolved: 0 };
});
resolvedTrends.forEach(item => {
  if (trends[item._id]) {
    trends[item._id].resolved = item.resolved;
  } else {
    trends[item._id] = { date: item._id, created: 0, resolved: item.resolved };
  }
});

const trendArray = Object.values(trends).sort((a, b) => a.date.localeCompare(b.date));
```

**Step-by-step**:
```javascript
// Step 1: Add created counts
ticketTrends = [
  { _id: '2024-01-15', created: 5 },
  { _id: '2024-01-16', created: 3 }
]
trends = {
  '2024-01-15': { date: '2024-01-15', created: 5, resolved: 0 },
  '2024-01-16': { date: '2024-01-16', created: 3, resolved: 0 }
}

// Step 2: Add resolved counts
resolvedTrends = [
  { _id: '2024-01-15', resolved: 2 },
  { _id: '2024-01-17', resolved: 1 }
]
trends = {
  '2024-01-15': { date: '2024-01-15', created: 5, resolved: 2 },
  '2024-01-16': { date: '2024-01-16', created: 3, resolved: 0 },
  '2024-01-17': { date: '2024-01-17', created: 0, resolved: 1 }
}

// Step 3: Convert to array and sort
trendArray = [
  { date: '2024-01-15', created: 5, resolved: 2 },
  { date: '2024-01-16', created: 3, resolved: 0 },
  { date: '2024-01-17', created: 0, resolved: 1 }
]
```

**Result**: Each date has both created and resolved counts

---

## 🔑 **Function 4: getUserActivity (Lines 190-240)**

```javascript
exports.getUserActivity = async (req, res) => {
  try {
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    });

    const projectIds = userProjects.map(p => p._id);

    // Tickets created by user
    const ticketsCreated = await Ticket.countDocuments({ 
      reportedBy: req.user.id,
      project: { $in: projectIds }
    });

    // Tickets assigned to user
    const ticketsAssigned = await Ticket.countDocuments({ 
      assignedTo: req.user.id,
      project: { $in: projectIds }
    });

    // Comments by user
    const commentsPosted = await Comment.countDocuments({ 
      author: req.user.id
    });

    // Projects owned
    const projectsOwned = await Project.countDocuments({ 
      owner: req.user.id 
    });

    // Recent tickets (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentTicketsCreated = await Ticket.countDocuments({
      reportedBy: req.user.id,
      project: { $in: projectIds },
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      ticketsCreated,
      ticketsAssigned,
      commentsPosted,
      projectsOwned,
      recentTicketsCreated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Simple counts** for current user's activity metrics

---

## 🔑 **Function 5: getTeamPerformance (Lines 245-315)**

```javascript
exports.getTeamPerformance = async (req, res) => {
  try {
    const userProjects = await Project.find({
      owner: req.user.id
    }).populate('members', 'name email');

    if (userProjects.length === 0) {
      return res.json([]);
    }

    const projectIds = userProjects.map(p => p._id);

    // Get all team members
    const allMembers = new Set();
    userProjects.forEach(project => {
      project.members.forEach(member => {
        allMembers.add(member._id.toString());
      });
    });

    const teamStats = await Promise.all(
      Array.from(allMembers).map(async (memberId) => {
        const member = await User.findById(memberId).select('name email');
        
        const assignedTickets = await Ticket.countDocuments({
          assignedTo: memberId,
          project: { $in: projectIds }
        });

        const resolvedTickets = await Ticket.countDocuments({
          assignedTo: memberId,
          project: { $in: projectIds },
          status: { $in: ['Resolved', 'Closed'] }
        });

        const commentsCount = await Comment.countDocuments({
          author: memberId
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

    res.json(teamStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Collecting Unique Team Members:

**Lines 257-263: Set for Deduplication**
```javascript
const allMembers = new Set();
userProjects.forEach(project => {
  project.members.forEach(member => {
    allMembers.add(member._id.toString());
  });
});
```

**Why Set?**
- **Automatic deduplication**: Member in multiple projects counted once
- **toString()**: Convert ObjectId to string for Set comparison

**Example**:
```javascript
Project A: members = [user123, user456]
Project B: members = [user456, user789]

Without Set: [user123, user456, user456, user789] // Duplicate!
With Set: [user123, user456, user789] // Unique only
```

### Resolution Rate Per Member:

**Line 290: Individual Performance**
```javascript
resolutionRate: assignedTickets > 0 ? Math.round((resolvedTickets / assignedTickets) * 100) : 0
```

**Example**:
```
Member Alice:
  assignedTickets: 20
  resolvedTickets: 18
  resolutionRate: (18/20) * 100 = 90%

Member Bob:
  assignedTickets: 10
  resolvedTickets: 5
  resolutionRate: (5/10) * 100 = 50%
```

---

## 🎯 Usage Examples

### 1. Dashboard Overview
```javascript
GET /api/analytics/overview

Response:
{
  totalProjects: 5,
  totalTickets: 47,
  totalComments: 123,
  recentTickets: 8,
  ticketsByStatus: {
    "Open": 15,
    "In Progress": 12,
    "Resolved": 20
  },
  ticketsByPriority: {
    "Low": 10,
    "Medium": 25,
    "High": 12
  },
  ticketsByType: {
    "Bug": 30,
    "Feature": 12,
    "Task": 5
  }
}
```

### 2. Project Statistics
```javascript
GET /api/analytics/projects

Response:
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
  }
]
```

### 3. Ticket Trends (30 days)
```javascript
GET /api/analytics/trends

Response:
[
  { date: "2024-01-15", created: 5, resolved: 2 },
  { date: "2024-01-16", created: 3, resolved: 4 },
  { date: "2024-01-17", created: 0, resolved: 1 }
]
```

### 4. User Activity
```javascript
GET /api/analytics/user-activity

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

Response:
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

## 📚 Related Files
- [frontend-pages-Dashboard.md](frontend-pages-Dashboard.md) - Overview UI
- [frontend-pages-Analytics.md](frontend-pages-Analytics.md) - Charts and graphs
- [backend-routes-analytics.md](backend-routes-analytics.md) - Route definitions
- [backend-models-Ticket.md](backend-models-Ticket.md) - Ticket schema
