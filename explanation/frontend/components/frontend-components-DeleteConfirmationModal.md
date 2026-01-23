# Frontend Component: DeleteConfirmationModal.jsx - Complete Explanation

Confirmation dialog before deleting items.

## 📋 Overview
- **Purpose**: Prevent accidental deletions
- **Features**: Confirm/cancel buttons, item name display

---

## 🔑 Key Features

### **Props**
```jsx
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName, itemType }) => {
```
- **itemName**: "Bug Tracker Project"
- **itemType**: "project" or "ticket"

### **Confirm Button**
```jsx
<button
  onClick={() => {
    onConfirm();
    onClose();
  }}
  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
>
  Delete
</button>
```

### **Message**
```jsx
<p>
  Are you sure you want to delete <strong>{itemName}</strong>?
  This action cannot be undone.
</p>
```

---

## 🎯 Usage
```jsx
<DeleteConfirmationModal
  isOpen={showDelete}
  onClose={() => setShowDelete(false)}
  onConfirm={() => deleteProject(projectId)}
  itemName="Bug Tracker"
  itemType="project"
/>
```

---

## 📚 Related Files
- [frontend-pages-Projects.md](frontend-pages-Projects.md)
- [frontend-pages-Tickets.md](frontend-pages-Tickets.md)
