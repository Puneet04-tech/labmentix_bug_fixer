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
 - [analyticsController.js](backend-controller-analytics.md) - Aggregation pipelines
 - [Analytics.jsx](frontend-page-Analytics.md) - Uses `Promise.all` to fetch all endpoints

---

## 📚 Technical Terms Glossary
- `router.use(auth)`: Protect analytics endpoints so queries respect the current user's projects.
- `aggregation pipeline`: A sequence of MongoDB stages (`$match`, `$group`, `$project`, etc.) for server-side data processing.

## 🧑‍💻 Important Import & Syntax Explanations
- Use aggregation (`Model.aggregate`) for heavy analytics to reduce data transfer and processing on the application server.
- When returning analytics results, normalize formats (e.g., `{ Open: 5, Closed: 3 }`) for easier frontend consumption.
