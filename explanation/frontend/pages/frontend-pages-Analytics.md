# Frontend Page: Analytics.jsx - Complete Explanation

Advanced analytics with charts and team performance.

## 📋 Overview
- **Purpose**: Detailed analytics and insights
- **Features**: Multiple charts, trends, team stats

---

## 🔑 Key Features

### **Fetch All Analytics**
```jsx
useEffect(() => {
  const fetchData = async () => {
    const [overview, projects, trends, activity, team] = await Promise.all([
      API.get('/analytics/overview'),
      API.get('/analytics/projects'),
      API.get('/analytics/trends'),
      API.get('/analytics/user-activity'),
      API.get('/analytics/team')
    ]);
    setOverview(overview.data);
    setProjects(projects.data);
    setTrends(trends.data);
    setActivity(activity.data);
    setTeam(team.data);
  };
  fetchData();
}, []);
```

### **Overview Section**
```jsx
<div className="grid grid-cols-4 gap-4">
  <StatsCard icon="📁" label="Projects" value={overview.totalProjects} />
  <StatsCard icon="🎫" label="Tickets" value={overview.totalTickets} />
  <StatsCard icon="💬" label="Comments" value={overview.totalComments} />
  <StatsCard icon="📈" label="Recent" value={overview.recentTickets} />
</div>
```

### **Trends Chart**
```jsx
<LineChart
  data={trends}
  xKey="date"
  yKeys={['created', 'resolved']}
  title="Ticket Trends (30 Days)"
/>
```

### **Project Stats**
```jsx
<table>
  <thead>
    <tr>
      <th>Project</th>
      <th>Total Tickets</th>
      <th>Open</th>
      <th>Closed</th>
      <th>Completion Rate</th>
    </tr>
  </thead>
  <tbody>
    {projects.map(project => (
      <tr key={project.id}>
        <td>{project.name}</td>
        <td>{project.totalTickets}</td>
        <td>{project.openTickets}</td>
        <td>{project.closedTickets}</td>
        <td>{project.completionRate}%</td>
      </tr>
    ))}
  </tbody>
</table>
```

### **Team Performance**
```jsx
<div>
  <h3>Team Performance</h3>
  {team.map(member => (
    <div key={member.id}>
      <strong>{member.name}</strong>
      <p>Assigned: {member.assignedTickets}</p>
      <p>Resolved: {member.resolvedTickets}</p>
      <p>Resolution Rate: {member.resolutionRate}%</p>
    </div>
  ))}
</div>
```

---

## 🎯 Usage
Protected route: `/analytics`

---

## 📚 Related Files
- [backend-controllers-analytics.md](backend-controllers-analytics.md)
- [frontend-components-StatsCard.md](frontend-components-StatsCard.md)
