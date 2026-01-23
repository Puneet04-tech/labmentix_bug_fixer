# Backend Routes: analytics.js - Line by Line Explanation

**Location**: `backend/routes/analytics.js` | **Lines**: 21

## 📋 Overview

Analytics routes for statistics and insights. **All routes protected**.

**Routes:**
- `GET /api/analytics/overview` - Global stats
- `GET /api/analytics/projects` - Per-project completion rates
- `GET /api/analytics/trends` - 30-day ticket trends
- `GET /api/analytics/user-activity` - User-specific stats
- `GET /api/analytics/team` - Team performance (owner only)

---

## 🔍 Code Analysis

**Global Auth (Line 12):**
```javascript
router.use(auth);
```

**Analytics Endpoints (Lines 15-19):**
```javascript
router.get('/overview', getOverview);
router.get('/projects', getProjectStats);
router.get('/trends', getTicketTrends);
router.get('/user-activity', getUserActivity);
router.get('/team', getTeamPerformance);
```

All routes use MongoDB aggregation pipelines for efficient data processing.

**Authorization:**
- Most routes: Filter by user's projects
- `/team`: Only project owners see team stats

---

## 🔗 Related Files
- [analyticsController.js](backend-controller-analytics.md) - Aggregation pipelines
- [Analytics.jsx](frontend-page-Analytics.md) - Uses `Promise.all` to fetch all endpoints
