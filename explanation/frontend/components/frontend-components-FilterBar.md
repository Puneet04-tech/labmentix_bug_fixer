# Frontend Component: FilterBar.jsx - Complete Explanation

Ticket filtering UI with status, priority, and search.

## 📋 Overview
- **Purpose**: Filter tickets by multiple criteria
- **Features**: Status, priority, assigned to, search input

---

## 🔑 Key Features

### **Filter State**
```jsx
const [filters, setFilters] = useState({
  status: '',
  priority: '',
  assignedTo: '',
  search: ''
});
```

### **Apply Filters**
```jsx
const handleFilterChange = (key, value) => {
  const newFilters = { ...filters, [key]: value };
  setFilters(newFilters);
  onFilterChange(newFilters); // Pass to parent
};
```

### **Select Dropdowns**
```jsx
<select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
  <option value="">All Status</option>
  <option value="Open">Open</option>
  <option value="In Progress">In Progress</option>
  <option value="Resolved">Resolved</option>
</select>
```

### **Search Input**
```jsx
<input
  type="text"
  placeholder="Search tickets..."
  value={filters.search}
  onChange={(e) => handleFilterChange('search', e.target.value)}
/>
```

---

## 🎯 Usage
```jsx
<FilterBar onFilterChange={(filters) => fetchTickets(filters)} />
```

---

## 📚 Related Files
- [frontend-pages-Tickets.md](frontend-pages-Tickets.md)
- [frontend-context-TicketContext.md](frontend-context-TicketContext.md)
