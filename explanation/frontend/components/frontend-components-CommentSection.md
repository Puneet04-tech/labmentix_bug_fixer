# Frontend Component: CommentSection.jsx - Complete Explanation

Comment thread UI for ticket discussions.

## 📋 Overview
- **Purpose**: Display and add comments on tickets
- **Features**: Comment list, add form, edit/delete buttons

---

## 🔑 Key Features

### **Props**
```jsx
const CommentSection = ({ ticketId }) => {
```

### **Fetch Comments**
```jsx
useEffect(() => {
  const loadComments = async () => {
    const { data } = await API.get(`/comments/ticket/${ticketId}`);
    setComments(data);
  };
  loadComments();
}, [ticketId]);
```

### **Add Comment Form**
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  await API.post('/comments', {
    content: newComment,
    ticket: ticketId
  });
  setNewComment('');
  loadComments(); // Refresh list
};
```

### **Comment Display**
```jsx
{comments.map(comment => (
  <div key={comment._id} className="border-b py-3">
    <div className="flex items-center space-x-2">
      <img src={comment.author.avatar} className="w-8 h-8 rounded-full" />
      <strong>{comment.author.name}</strong>
      <span className="text-gray-500">{formatDate(comment.createdAt)}</span>
    </div>
    <p className="mt-2">{comment.content}</p>
    {isAuthor && (
      <button onClick={() => deleteComment(comment._id)}>Delete</button>
    )}
  </div>
))}
```

### **Edit/Delete Buttons**
```jsx
{comment.author._id === currentUser._id && (
  <>
    <button onClick={() => startEdit(comment)}>Edit</button>
    <button onClick={() => deleteComment(comment._id)}>Delete</button>
  </>
)}
```

---

## 🎯 Usage
```jsx
<CommentSection ticketId={ticket._id} />
```

---

## 📚 Related Files
- [frontend-pages-TicketDetail.md](frontend-pages-TicketDetail.md)
- [backend-controllers-comment.md](backend-controllers-comment.md)
