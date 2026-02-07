# backend-controller-analytics.md

## Overview
The `analyticsController.js` file generates dashboard statistics and analytics data.

## File Location
```
backend/controllers/analyticsController.js
```

## Dependencies - Detailed Import Analysis

```javascript
const Ticket = require('../models/Ticket');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
```

### Import Statement Breakdown:
- **Ticket Model**: Mongoose model for ticket aggregation queries
- **Project Model**: Mongoose model for project-based filtering
- **Comment Model**: Mongoose model for comment statistics

## MongoDB Aggregation Pipeline

```javascript
const ticketsByStatus = await Ticket.aggregate([
  { $match: { project: { $in: projectIds } } },
  { $group: { _id: '$status', count: { $sum: 1 } } }
]);
```

**Syntax Pattern**: Using aggregation pipeline for grouping and counting documents.

## Array Reduce for Object Transformation

```javascript
ticketsByStatus.reduce((acc, item) => {
  acc[item._id] = item.count;
  return acc;
}, {})
```

**Syntax Pattern**: Transforming aggregation results from array to object format.

## Promise.all with Array Map

```javascript
const projectStats = await Promise.all(
  userProjects.map(async (project) => {
    // async operations per project
  })
);
```

**Syntax Pattern**: Running multiple async operations in parallel for each array item.

## Date Range Filtering in Aggregation

```javascript
$match: {
  project: { $in: projectIds },
  createdAt: { $gte: thirtyDaysAgo }
}
```

**Syntax Pattern**: Filtering documents by date range in aggregation pipeline.

## Date Formatting in Aggregation

```javascript
$group: {
  _id: {
    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
  },
  created: { $sum: 1 }
}
```

**Syntax Pattern**: Grouping by formatted date string in aggregation.

## Completion Rate Calculation

```javascript
completionRate: totalTickets > 0 ? Math.round((closedTickets / totalTickets) * 100) : 0
```

**Syntax Pattern**: Calculating percentage with division by zero protection.

## Set to Array Conversion

```javascript
Array.from(allMembers).map(async (memberId) => {
  // operations per member
})
```

**Syntax Pattern**: Converting Set to Array for iteration with async operations.

## Critical Code Patterns

### 1. Aggregation Pipeline for Grouping
```javascript
await Model.aggregate([
  { $match: { field: { $in: values } } },
  { $group: { _id: '$groupField', count: { $sum: 1 } } }
])
```
**Pattern**: Using MongoDB aggregation for efficient grouping and counting.

### 2. Array to Object Transformation
```javascript
array.reduce((acc, item) => {
  acc[item._id] = item.count;
  return acc;
}, {})
```
**Pattern**: Converting aggregation results to object format.

### 3. Parallel Async Operations
```javascript
await Promise.all(
  items.map(async (item) => {
    // async work per item
  })
)
```
**Pattern**: Running multiple async operations concurrently.

### 4. Date-Based Aggregation
```javascript
{
  $group: {
    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
    count: { $sum: 1 }
  }
}
```
**Pattern**: Grouping documents by formatted date.

### 5. Percentage Calculation with Safety
```javascript
total > 0 ? Math.round((part / total) * 100) : 0
```
**Pattern**: Calculating percentage with division by zero protection.

### 6. Status Array Filtering
```javascript
status: { $in: ['Open', 'In Progress', 'In Review'] }
```
**Pattern**: Filtering by multiple status values using $in operator.

### 7. Date Range Queries
```javascript
createdAt: { $gte: startDate, $lte: endDate }
```
**Pattern**: Filtering documents within date range.

### 8. Resolution Rate Calculation
```javascript
resolutionRate: assignedTickets > 0 ? Math.round((resolvedTickets / assignedTickets) * 100) : 0
```
**Pattern**: Calculating performance metrics as percentages.

