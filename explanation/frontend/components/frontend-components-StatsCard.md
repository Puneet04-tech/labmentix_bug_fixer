# Frontend Component: StatsCard.jsx - Complete Explanation

Dashboard statistics card component.

## 📋 Overview
- **Purpose**: Display single metric on dashboard
- **Features**: Icon, value, label, optional trend

---

## 🔑 Complete Code

```jsx
const StatsCard = ({ icon, label, value, trend, color = 'blue' }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <span className="text-3xl">{icon}</span>
        </div>
        {trend && (
          <span className={`text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
```

---

## 🎯 Usage Examples

### **Basic Card**
```jsx
<StatsCard
  icon="📊"
  label="Total Projects"
  value={15}
  color="blue"
/>
```

### **With Trend**
```jsx
<StatsCard
  icon="🎫"
  label="Open Tickets"
  value={42}
  trend={12}
  color="red"
/>
```
Shows: "↑ 12%" in green

### **Dashboard Grid**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatsCard icon="📁" label="Projects" value={stats.totalProjects} />
  <StatsCard icon="🎫" label="Tickets" value={stats.totalTickets} />
  <StatsCard icon="💬" label="Comments" value={stats.totalComments} />
  <StatsCard icon="✅" label="Resolved" value={stats.resolved} trend={8} />
</div>
```

---

## 🎨 Color Variants
- **blue**: Projects, info
- **red**: Critical, open tickets
- **green**: Resolved, success
- **yellow**: In progress, warnings

---

## 📚 Related Files
- [frontend-pages-Dashboard.md](frontend-pages-Dashboard.md)
- [backend-controllers-analytics.md](backend-controllers-analytics.md)
