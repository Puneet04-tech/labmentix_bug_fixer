# Frontend Page: Analytics.jsx - Line by Line Explanation

**Location**: `frontend/src/pages/Analytics.jsx`
**Lines**: 395 lines
**Purpose**: Comprehensive analytics dashboard with statistics, charts, and team performance metrics

---

## 📋 Overview

**Core Functionality:**
- Fetch 5 analytics endpoints with `Promise.all`
- Display overview stats (projects, tickets, comments)
- Visualize tickets by status/priority/type
- Show project performance table with completion rates
- Display team performance with resolution rates
- Render 30-day trends chart (created vs resolved tickets)

**Key Features:**
- Parallel data fetching for performance
- Multiple chart types (stats cards, tables, bar charts)
- Responsive grid layouts
- Loading state during initial fetch
- Dynamic progress bars for completion/resolution rates

---

## 🔍 Line-by-Line Code Analysis

### **Imports (Lines 1-6)**

```jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import StatsCard from '../components/StatsCard';
import TicketChart from '../components/TicketChart';
```

**Line 1**: React hooks for state and side effects
**Line 2**: React Router `Link` for navigation
**Line 3**: Authentication context for user info and logout
**Line 4**: Axios instance with auth headers for API calls
**Line 5**: Reusable component for stat display cards
**Line 6**: Chart component for data visualization

**Why direct API import?** Analytics data not in global context; fetch directly when component mounts

---

### Technical Terms Glossary

- **Parallel fetching (`Promise.all`)**: Execute multiple API calls concurrently and wait for all to finish before updating related state variables — reduces overall latency compared to sequential calls.
- **Overview vs. detailed endpoints**: Keep small, focused endpoints (`/analytics/overview`, `/analytics/trends`) to avoid monolithic payloads and enable targeted caching.
- **Chart data normalization**: Convert raw API counts into percentages or formatted series for chart components (`TicketChart`).

---

## 🧑‍💻 Important Import & Syntax Explanations

- `API.get('/analytics/...')` calls use the centralized axios instance; handle auth errors and consider caching or memoization for expensive analytics calls.
- `Promise.all([...])`: Use `const [a,b] = await Promise.all([...])` to run requests in parallel; wrap in `try/catch` to handle any failure case cleanly.
- `setState` per endpoint: Keep separate state slices (`overview`, `trends`, `teamPerformance`) so components can render parts of the page as soon as relevant data arrives if you switch to incremental loading.
- Performance note: For very large datasets, consider server-side pre-aggregation to reduce client CPU and payload sizes.

---

### **Component Declaration & State (Lines 8-14)**

```jsx
const Analytics = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [projectStats, setProjectStats] = useState([]);
  const [trends, setTrends] = useState([]);
  const [userActivity, setUserActivity] = useState(null);
  const [teamPerformance, setTeamPerformance] = useState([]);
```

**Line 10**: Authentication state (user object, logout function)
**Line 11**: Loading flag for initial data fetch
**Lines 12-16**: **5 separate state variables** for 5 analytics endpoints:
  - `overview`: Object with totalProjects, totalTickets, ticketsByStatus, etc.
  - `projectStats`: Array of project objects with completion rates
  - `trends`: Array of {date, created, resolved} objects
  - `userActivity`: Object with user-specific stats
  - `teamPerformance`: Array of team member objects with resolution rates

**Why separate states?** Each endpoint returns different data structure; easier to manage separately

---

### **Fetch Effect (Lines 16-18)**

```jsx
  useEffect(() => {
    fetchAnalytics();
  }, []);
```

**Line 17**: Call fetch function on component mount
**Empty dependency `[]`**: Only run once, no re-fetching on updates

---

### **Fetch Analytics Function (Lines 20-38)**

```jsx
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [overviewRes, projectsRes, trendsRes, userRes, teamRes] = await Promise.all([
        API.get('/analytics/overview'),
        API.get('/analytics/projects'),
        API.get('/analytics/trends'),
        API.get('/analytics/user-activity'),
        API.get('/analytics/team')
      ]);

      setOverview(overviewRes.data);
      setProjectStats(projectsRes.data);
      setTrends(trendsRes.data);
      setUserActivity(userRes.data);
      setTeamPerformance(teamRes.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };
```

**Line 23**: **`Promise.all` for parallel requests** - waits for all 5 API calls to complete
**Why `Promise.all`?** Faster than sequential fetches; all endpoints needed simultaneously
**Lines 24-28**: Destructure 5 responses from array
**Lines 31-35**: Update all 5 state variables with response data
**Line 37**: Log error if any request fails (doesn't break UI)
**Line 39**: **Always** set loading to false (even on error) using `finally`

**Performance**: 5 parallel requests vs. 5 sequential (5x faster on average)

---

### **Loading State (Lines 40-75)**

```jsx
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary-600">🐛 Bug Tracker</h1>
              <nav className="hidden md:flex space-x-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600">Dashboard</Link>
                <Link to="/projects" className="text-gray-600 hover:text-primary-600">Projects</Link>
                <Link to="/tickets" className="text-gray-600 hover:text-primary-600">Tickets</Link>
                <Link to="/analytics" className="text-primary-600 font-medium">Analytics</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome,</p>
                <p className="font-medium text-gray-900">{user?.name}</p>
              </div>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading analytics...</p>
          </div>
        </main>
      </div>
    );
  }
```

**Lines 40-68**: Render full header while loading (maintains layout consistency)
**Line 52**: Current page "Analytics" highlighted
**Line 71**: Simple loading message instead of spinner

**Why show header?** User sees familiar structure immediately; only content area changes

---

### **Main Render - Header (Lines 77-112)**

```jsx
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary-600">🐛 Bug Tracker</h1>
            <nav className="hidden md:flex space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-primary-600">Dashboard</Link>
              <Link to="/projects" className="text-gray-600 hover:text-primary-600">Projects</Link>
              <Link to="/tickets" className="text-gray-600 hover:text-primary-600">Tickets</Link>
              <Link to="/analytics" className="text-primary-600 font-medium">Analytics</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome,</p>
              <p className="font-medium text-gray-900">{user?.name}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
```

**Same header** as loading state - logo, navigation, user info, logout

---

### **Page Title (Lines 115-119)**

```jsx
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-2">Comprehensive insights into your projects and tickets</p>
        </div>
```

**Line 116**: Main page heading
**Line 117**: Subtitle describing page purpose

---

### **Overview Stats Section (Lines 121-151)**

```jsx
        {overview && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Projects"
                value={overview.totalProjects}
                icon="📁"
                color="indigo"
              />
              <StatsCard
                title="Total Tickets"
                value={overview.totalTickets}
                icon="🎫"
                color="blue"
              />
              <StatsCard
                title="Total Comments"
                value={overview.totalComments}
                icon="💬"
                color="purple"
              />
              <StatsCard
                title="Recent Activity"
                value={overview.recentTickets}
                icon="📊"
                color="green"
                subtitle="Last 7 days"
              />
            </div>
```

**Line 121**: **Conditional render** - only show if `overview` data loaded
**Line 123**: Responsive grid - 1 column (mobile), 2 (tablet), 4 (desktop)
**Lines 124-148**: **4 `StatsCard` components** with different data:
  - Total projects count
  - Total tickets count
  - Total comments count
  - Recent tickets (last 7 days) with subtitle

**Props breakdown**:
- `title`: Card heading
- `value`: Numeric stat to display
- `icon`: Emoji icon
- `color`: Tailwind color class (indigo, blue, purple, green)
- `subtitle`: Optional additional text

---

### **Charts Row (Lines 153-165)**

```jsx
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <TicketChart
                data={overview.ticketsByStatus}
                type="bar"
                title="Tickets by Status"
              />
              <TicketChart
                data={overview.ticketsByPriority}
                type="donut"
                title="Tickets by Priority"
              />
              <TicketChart
                data={overview.ticketsByType}
                type="donut"
                title="Tickets by Type"
              />
            </div>
          </>
        )}
```

**Line 153**: 3-column grid on large screens, 1 column on mobile
**Lines 154-158**: **Bar chart** for status distribution (Open, In Progress, Resolved, etc.)
**Lines 159-163**: **Donut chart** for priority distribution (Low, Medium, High, Critical)
**Lines 164-168**: **Donut chart** for type distribution (Bug, Feature, Task, etc.)

**Data structure**: `ticketsByStatus` is object like `{Open: 5, Resolved: 3}`

---

### **User Activity Section (Lines 171-208)**

```jsx
        {userActivity && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatsCard
                title="Projects Owned"
                value={userActivity.projectsOwned}
                icon="👑"
                color="yellow"
              />
              <StatsCard
                title="Tickets Created"
                value={userActivity.ticketsCreated}
                icon="➕"
                color="blue"
              />
              <StatsCard
                title="Tickets Assigned"
                value={userActivity.ticketsAssigned}
                icon="📌"
                color="orange"
              />
              <StatsCard
                title="Comments Posted"
                value={userActivity.commentsPosted}
                icon="💭"
                color="purple"
              />
              <StatsCard
                title="Recent Tickets"
                value={userActivity.recentTicketsCreated}
                icon="🆕"
                color="green"
                subtitle="Last 7 days"
              />
            </div>
          </div>
        )}
```

**Line 171**: Conditional render if `userActivity` data exists
**Line 174**: **5-column grid** for 5 user-specific stats
**Lines 175-206**: **5 `StatsCard` components**:
  1. Projects where user is owner
  2. Tickets created by user (as reporter)
  3. Tickets assigned to user
  4. Comments posted by user
  5. Recent tickets created (last 7 days)

**Purpose**: Personalized stats show individual contribution

---

### **Project Performance Table (Lines 211-289)**

```jsx
        {projectStats.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Project Performance</h3>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Tickets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Open
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Closed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion
                    </th>
                  </tr>
                </thead>
```

**Line 211**: Only render if `projectStats` array has data
**Lines 217-237**: **Table header** with 6 columns:
  - Project name (clickable link)
  - Status badge
  - Total tickets count
  - Open tickets count
  - Closed tickets count
  - Completion percentage (with progress bar)

---

### **Project Table Rows (Lines 238-275)**

```jsx
                <tbody className="bg-white divide-y divide-gray-200">
                  {projectStats.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          {project.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.totalTickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.openTickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.closedTickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${project.completionRate}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-900">{project.completionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
```

**Line 239**: Map through `projectStats` array
**Line 240**: Hover effect on table rows
**Lines 242-246**: **Project name as link** to project detail page
**Lines 247-251**: Status badge with rounded pill style
**Lines 252-260**: Numeric stat columns
**Lines 261-273**: **Completion progress bar**:
  - Line 263: Gray background bar (full width = 16 units)
  - Lines 264-267: Green filled bar (width = percentage)
  - Line 269: Percentage text next to bar

**Completion Rate Calculation** (in backend): `closedTickets / totalTickets * 100`

---

### **Team Performance Table (Lines 293-367)**

```jsx
        {teamPerformance.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Team Performance</h3>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resolved
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resolution Rate
                    </th>
                  </tr>
                </thead>
```

**Line 293**: Only render if `teamPerformance` array has data (only for project owners)
**Lines 299-319**: **Table header** with 5 columns:
  - Team member (name + email)
  - Assigned tickets count
  - Resolved tickets count
  - Comments count
  - Resolution rate percentage (with progress bar)

---

### **Team Table Rows (Lines 320-362)**

```jsx
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamPerformance.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.assignedTickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.resolvedTickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.commentsCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${member.resolutionRate}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-900">{member.resolutionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
```

**Line 321**: Map through `teamPerformance` array
**Lines 324-328**: **Member info cell** with name and email stacked
**Lines 329-337**: Numeric stat columns (assigned, resolved, comments)
**Lines 338-350**: **Resolution rate progress bar**:
  - Similar to completion bar but uses indigo color
  - Formula: `resolvedTickets / assignedTickets * 100`

**Note**: Team performance only available for project owners (backend filters by ownership)

---

### **Trends Chart (Lines 372-395)**

```jsx
        {trends.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ticket Trends (Last 30 Days)</h3>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-64 flex items-end justify-between gap-2">
                {trends.slice(-14).map((day, index) => {
                  const maxValue = Math.max(...trends.map(d => Math.max(d.created, d.resolved)));
                  const createdHeight = maxValue > 0 ? (day.created / maxValue) * 100 : 0;
                  const resolvedHeight = maxValue > 0 ? (day.resolved / maxValue) * 100 : 0;

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex gap-1 items-end justify-center h-48">
                        <div
                          className="w-1/2 bg-blue-500 rounded-t hover:bg-blue-600 transition-all"
                          style={{ height: `${createdHeight}%` }}
                          title={`Created: ${day.created}`}
                        />
                        <div
                          className="w-1/2 bg-green-500 rounded-t hover:bg-green-600 transition-all"
                          style={{ height: `${resolvedHeight}%` }}
                          title={`Resolved: ${day.resolved}`}
                        />
                      </div>
                      <span className="text-xs text-gray-500 transform rotate-45 origin-top-left mt-4">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
```

**Line 372**: Only render if `trends` array has data
**Line 377**: **Show last 14 days** (backend returns 30 days, UI displays 14 for readability)
**Line 378**: **Calculate max value** to normalize bar heights
**Lines 379-380**: Calculate percentage heights for created and resolved bars
**Lines 383-400**: **Dual bar chart**:
  - Each day has 2 bars side-by-side (blue for created, green for resolved)
  - Bars scale from 0-100% based on max value
  - Hover shows actual count via `title` attribute
  - Date label rotated 45° to fit horizontally

**Line 398**: Format date as "Jan 15", "Feb 3", etc.

**Why slice(-14)?** 30 days too crowded; 14 days shows 2-week trend clearly

---

### **Chart Legend (Lines 401-411)**

```jsx
              <div className="flex justify-center gap-6 mt-8">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2" />
                  <span className="text-sm text-gray-700">Created</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2" />
                  <span className="text-sm text-gray-700">Resolved</span>
                </div>
              </div>
            </div>
          </div>
        )}
```

**Lines 402-406**: Legend for "Created" - blue square + label
**Lines 407-411**: Legend for "Resolved" - green square + label

---

## 📊 Data Flow

1. **Mount**: Component renders with loading state
2. **Fetch**: `fetchAnalytics()` calls 5 endpoints in parallel with `Promise.all`
3. **Update**: All 5 state variables updated simultaneously
4. **Render**: Display sections based on which data is available:
   - `overview` → stats cards + charts
   - `userActivity` → user stats
   - `projectStats` → project table
   - `teamPerformance` → team table (if user owns projects)
   - `trends` → 30-day chart

---

## 🎨 Chart Components Used

**StatsCard Component**:
- Props: `title`, `value`, `icon`, `color`, `subtitle` (optional)
- Displays stat with emoji icon and colored background
- Used for: overview stats (4), user activity stats (5)

**TicketChart Component**:
- Props: `data`, `type`, `title`
- Renders different chart types: `bar`, `donut`
- Used for: status distribution (bar), priority distribution (donut), type distribution (donut)

**Custom Trends Chart**:
- Built in-line (not separate component)
- Dual-bar chart with side-by-side bars
- Dynamic height calculation based on max value
- Rotated date labels for horizontal fit

---

## 🐛 Common Issues & Solutions

**Issue**: `Promise.all` fails if any endpoint fails
**Solution**: Individual try-catch in `fetchAnalytics` prevents complete failure; error logged but UI continues

**Issue**: Progress bars overflow container
**Solution**: Fixed width (`w-16`) prevents overflow, inline `style` sets percentage width

**Issue**: Date labels overlap on trends chart
**Solution**: `transform rotate-45` rotates labels diagonally

**Issue**: Team performance table empty for non-owners
**Cause**: Backend only returns data for project owners
**Solution**: Conditional render `{teamPerformance.length > 0 && (...)}`

**Issue**: Chart max value calculation incorrect
**Cause**: Comparing created and resolved separately
**Solution**: `Math.max(d.created, d.resolved)` finds max of both values per day

---

## 🔐 Authorization & Access

**Who can see what:**
- **Overview stats**: All authenticated users (global aggregation)
- **User activity**: User's own stats (filtered by user ID in backend)
- **Project performance**: Projects user owns or is member of
- **Team performance**: Only for projects where user is owner
- **Trends**: Global ticket trends (all users)

**Backend enforcement**: `/analytics/team` endpoint checks project ownership before aggregating team data

---

## 📈 Analytics Endpoints Summary

| Endpoint | Method | Data Returned | Used In |
|----------|--------|---------------|---------|
| `/analytics/overview` | GET | Total counts, ticket distributions, recent activity | Stats cards, charts |
| `/analytics/projects` | GET | Project list with completion rates | Project table |
| `/analytics/trends` | GET | 30-day created/resolved counts by date | Trends chart |
| `/analytics/user-activity` | GET | User's tickets, comments, projects owned | User activity cards |
| `/analytics/team` | GET | Team member resolution rates | Team table |

---

## 🔗 Related Files

- [analyticsController.js](backend-controller-analytics.md) - Backend aggregation logic
- [analytics.js routes](backend-routes-analytics.md) - API endpoint definitions
- [StatsCard.jsx](frontend-component-StatsCard.md) - Reusable stat display component
- [TicketChart.jsx](frontend-component-TicketChart.md) - Chart visualization component
- [Dashboard.jsx](frontend-page-Dashboard.md) - Similar stats display pattern
- [api.js](frontend-utils-api.md) - Axios instance with auth headers

---

## ✨ Key Takeaways

1. **Parallel fetching**: `Promise.all` fetches 5 endpoints simultaneously for performance
2. **Conditional rendering**: Each section checks if data exists before rendering
3. **Responsive tables**: `overflow-hidden` with horizontal scroll on mobile
4. **Progress bars**: Inline `style` for dynamic width based on percentage
5. **Chart normalization**: Scale bar heights based on max value for consistent visualization
6. **Date formatting**: `toLocaleDateString` converts ISO strings to readable dates
7. **Component reusability**: `StatsCard` and `TicketChart` used multiple times
8. **Loading state**: Shows header immediately, only content area shows loading message
9. **Authorization awareness**: Team performance only for owners, handled by backend
10. **Empty states**: `length > 0` checks prevent rendering empty tables
