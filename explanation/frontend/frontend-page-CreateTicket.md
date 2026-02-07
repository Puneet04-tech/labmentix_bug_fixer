# frontend-page-CreateTicket.md

## Overview
The `CreateTicket.jsx` page provides a comprehensive form for creating new tickets with dynamic project member loading and validation.

## File Location
```
frontend/src/pages/CreateTicket.jsx
```

## Dependencies - Detailed Import Analysis

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTicket } from '../context/TicketContext';
import { useProject } from '../context/ProjectContext';
```

### Import Statement Breakdown:
- **React Hooks**: `useState`, `useEffect` - State management and side effects
- **React Router**: `useNavigate` - Navigation after creation
- **Ticket Context**: `useTicket` - Ticket creation operations
- **Project Context**: `useProject` - Project data and member loading

## Form State with Default Values

```jsx
const [formData, setFormData] = useState({
  title: '',
  description: '',
  type: 'Bug',
  status: 'Open',
  priority: 'Medium',
  project: '',
  assignedTo: '',
  dueDate: ''
});
const [projectMembers, setProjectMembers] = useState([]);
```

**Syntax Pattern**: Form state object with defaults and derived state for project members.

## Dynamic Member Loading Effect

```jsx
useEffect(() => {
  if (formData.project) {
    const selectedProject = projects.find(p => p._id === formData.project);
    if (selectedProject) {
      const members = [
        { _id: selectedProject.owner._id, name: selectedProject.owner.name, email: selectedProject.owner.email },
        ...selectedProject.members
      ];
      setProjectMembers(members);
    }
  } else {
    setProjectMembers([]);
  }
}, [formData.project, projects]);
```

**Syntax Pattern**: Effect hook that updates derived state based on form data changes.

## Array Find for Project Selection

```jsx
const selectedProject = projects.find(p => p._id === formData.project);
```

**Syntax Pattern**: Finding specific object in array by ID match.

## Building Members Array with Spread

```jsx
const members = [
  { _id: selectedProject.owner._id, name: selectedProject.owner.name, email: selectedProject.owner.email },
  ...selectedProject.members
];
```

**Syntax Pattern**: Creating array with owner first, then spreading member array.

## Form Data Normalization

```jsx
const ticketData = {
  ...formData,
  assignedTo: formData.assignedTo || undefined,
  dueDate: formData.dueDate || undefined
};
```

**Syntax Pattern**: Converting empty strings to undefined for optional fields.

## Generic Input Handler

```jsx
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
```

**Syntax Pattern**: Dynamic form field updates using computed property names.

## Conditional Dropdown Disabling

```jsx
disabled={!formData.project}
```

**Syntax Pattern**: Disabling form elements based on other field values.

## Character Counter Display

```jsx
{formData.title.length}/100 characters
```

**Syntax Pattern**: Real-time character count using string length property.

## Critical Code Patterns

### 1. Form State with Complex Defaults
```jsx
const [formData, setFormData] = useState({
  field1: '',
  field2: 'default',
  field3: '',
  field4: ''
});
```
**Pattern**: Initializing form state with appropriate defaults for select fields.

### 2. Derived State from Form Data
```jsx
const [derivedData, setDerivedData] = useState([]);
useEffect(() => {
  if (formData.selector) {
    const selected = data.find(item => item._id === formData.selector);
    setDerivedData(selected ? selected.items : []);
  }
}, [formData.selector, data]);
```
**Pattern**: Computing derived state based on form field changes.

### 3. Array Find with ID Matching
```jsx
const selectedItem = items.find(item => item._id === selectedId);
```
**Pattern**: Finding specific object in array by unique identifier.

### 4. Building Arrays with Owner First
```jsx
const members = [
  { _id: owner._id, name: owner.name },
  ...membersArray
];
```
**Pattern**: Creating ordered arrays with specific items first.

### 5. Form Data Normalization
```jsx
const normalizedData = {
  ...formData,
  optionalField: formData.optionalField || undefined
};
```
**Pattern**: Converting empty strings to undefined for API compatibility.

### 6. Dynamic Form Updates
```jsx
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
```
**Pattern**: Generic input handler for all form fields.

### 7. Conditional Element Disabling
```jsx
disabled={!formData.requiredField}
```
**Pattern**: Disabling dependent form elements until prerequisites are met.

### 8. Character Counting
```jsx
{formData.field.length}/maxLength characters
```
**Pattern**: Real-time character count display.

### Lines 47-62: Form Submission
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.title.trim() || !formData.description.trim() || !formData.project) {
    alert('Please fill in all required fields');
    return;
  }

  const ticketData = {
    ...formData,
    assignedTo: formData.assignedTo || undefined,
    dueDate: formData.dueDate || undefined
  };

  const newTicket = await createTicket(ticketData);
  if (newTicket) {
    navigate('/tickets');
  }
};
```
- **Simple validation**: Required fields check (no errors state)
- **Remove empty optionals**: `assignedTo || undefined` removes empty string
- **Why undefined**: Backend expects undefined, not empty string
- **Navigate on success**: Redirect to tickets list

### Lines 125-137: Project Dropdown
```jsx
<div className="mb-6">
  <label className="block text-gray-700 font-medium mb-2">
    Project <span className="text-red-500">*</span>
  </label>
  <select
    name="project"
    value={formData.project}
    onChange={handleChange}
    required
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
  >
    <option value="">Select a project</option>
    {projects.map(project => (
      <option key={project._id} value={project._id}>
        {project.name}
      </option>
    ))}
  </select>
</div>
```
- **Required asterisk**: Indicates mandatory field
- **Default option**: "Select a project" with empty value
- **Dynamic options**: Loop through projects array

### Lines 154-169: Type Dropdown with Emojis
```jsx
<div>
  <label className="block text-gray-700 font-medium mb-2">Type</label>
  <select
    name="type"
    value={formData.type}
    onChange={handleChange}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
  >
    <option value="Bug">🐛 Bug</option>
    <option value="Feature">✨ Feature</option>
    <option value="Improvement">🔧 Improvement</option>
    <option value="Task">📋 Task</option>
  </select>
</div>
```
- **Emojis in dropdown**: Visual distinction between types
- **4 ticket types**: Bug, Feature, Improvement, Task

### Lines 201-220: Assignment Dropdown (Depends on Project)
```jsx
<div>
  <label className="block text-gray-700 font-medium mb-2">Assign To</label>
  <select
    name="assignedTo"
    value={formData.assignedTo}
    onChange={handleChange}
    disabled={!formData.project}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
  >
    <option value="">Unassigned</option>
    {projectMembers.map(member => (
      <option key={member._id} value={member._id}>
        {member.name} ({member.email})
      </option>
    ))}
  </select>
</div>
```
- **disabled={!formData.project}**: Can't assign until project selected
- **projectMembers**: Dynamically loaded based on project selection
- **Display format**: "John Doe (john@example.com)"
- **Unassigned option**: Ticket can be created without assignee

### Lines 222-234: Due Date Input
```jsx
<div className="mb-8">
  <label className="block text-gray-700 font-medium mb-2">Due Date</label>
  <input
    type="date"
    name="dueDate"
    value={formData.dueDate}
    onChange={handleChange}
    min={today}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
  />
</div>
```
- **min={today}**: Prevent past dates
- **today**: `new Date().toISOString().split('T')[0]`
- **Optional field**: No asterisk, no validation

## Related Files
- **TicketContext.jsx**: Provides createTicket function
- **ProjectContext.jsx**: Provides projects array and fetchProjects
- **Tickets.jsx**: Destination after successful creation
- **Ticket.js (model)**: Backend schema with same fields

## Form Fields Summary

| Field | Type | Required | Default | Depends On |
|-------|------|----------|---------|------------|
| title | text | Yes | '' | - |
| description | textarea | Yes | '' | - |
| type | select | No | 'Bug' | - |
| status | select | No | 'Open' | - |
| priority | select | No | 'Medium' | - |
| project | select | Yes | '' | - |
| assignedTo | select | No | '' | project (disabled if no project) |
| dueDate | date | No | '' | - |

## Dynamic Member Loading Flow
1. User selects project from dropdown
2. `formData.project` changes
3. useEffect detects change
4. Find selected project in projects array
5. Extract owner and members
6. Set projectMembers state
7. Assignment dropdown populates with members
8. User can now assign ticket

## Dropdown Options

**Type (4 options):**
- 🐛 Bug (default)
- ✨ Feature
- 🔧 Improvement
- 📋 Task

**Status (5 options):**
- Open (default)
- In Progress
- In Review
- Resolved
- Closed

**Priority (4 options):**
- Low
- Medium (default)
- High
- Critical

## Character Limits
- **Title**: 100 characters (shows counter)
- **Description**: 2000 characters (shows counter)
- Prevents overflow in database/UI

## UX Features
- Assignment disabled until project selected
- Due date minimum set to today
- Character counters show remaining space
- Cancel button returns to tickets list
- Empty optional fields converted to undefined
