# Frontend Page: Dashboard.jsx - Complete Explanation

Main dashboard with statistics and recent activity.

## 📋 Overview
- **Purpose**: Overview of projects, tickets, and activity
- **Features**: Stats cards, charts, recent tickets

---

## 🔑 Key Features

### **Fetch Analytics**
```jsx
useEffect(() => {
  const fetchStats = async () => {
    const { data } = await API.get('/analytics/overview');
    setStats(data);
  };
  fetchStats();
}, []);
```

### **Stats Cards**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatsCard icon="📁" label="Projects" value={stats.totalProjects} />
  <StatsCard icon="🎫" label="Tickets" value={stats.totalTickets} />
  <StatsCard icon="💬" label="Comments" value={stats.totalComments} />
  <StatsCard icon="📈" label="Recent" value={stats.recentTickets} />
</div>
```

### **Charts**
```jsx
<div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
  <PieChart data={stats.ticketsByStatus} title="By Status" />
  <BarChart data={stats.ticketsByPriority} title="By Priority" />
</div>
```

### **Recent Activity**
```jsx
<div className="mt-6">
  <h3>Recent Tickets</h3>
  {recentTickets.map(ticket => (
    <Link key={ticket._id} to={`/tickets/${ticket._id}`}>
      <TicketCard ticket={ticket} />
    </Link>
  ))}
</div>
```

---

## 🎯 Usage
Protected route: `/dashboard`

---

## 📚 Related Files
- [frontend-components-StatsCard.md](frontend-components-StatsCard.md)
- [backend-controllers-analytics.md](backend-controllers-analytics.md)
