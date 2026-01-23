# Backend Controller: commentController.js - Comment Operations

## 📋 File Overview
**Location**: `backend/controllers/commentController.js`  
**Lines**: 172  
**Purpose**: CRUD operations for ticket comments

---

## 🎯 Core Functions
1. **getCommentsByTicket** - Get all comments for a ticket
2. **createComment** - Add comment to ticket
3. **updateComment** - Edit own comment
4. **deleteComment** - Delete comment (author or project owner)
5. **getCommentCount** - Get comment count for ticket

---

## 📝 KEY SECTIONS

### **Lines 8-35: Get Comments for Ticket**
```javascript
exports.getCommentsByTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId).populate('project');
    
    // Check if user has access to the project
    const project = await Project.findById(ticket.project._id);
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some(member => member.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to access this ticket' });
    }

    const comments = await Comment.find({ ticket: ticketId })
      .populate('author', 'name email')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Line 28**: `.sort({ createdAt: 1 })` - Ascending order (oldest first)
- Comments shown in chronological order for conversation flow

---

### **Lines 40-80: Create Comment**
```javascript
exports.createComment = async (req, res) => {
  try {
    const { content, ticket } = req.body;

    if (!content || !ticket) {
      return res.status(400).json({ message: 'Please provide content and ticket ID' });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    // Check if user has access to the project
    const ticketDoc = await Ticket.findById(ticket).populate('project');
    const project = await Project.findById(ticketDoc.project._id);
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some(member => member.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to comment on this ticket' });
    }

    const comment = await Comment.create({
      content: content.trim(),
      ticket,
      author: req.user.id
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Line 48**: `.trim()` - Remove whitespace from both ends
**Line 71**: `author: req.user.id` - Automatically set to current user

---

### **Lines 85-115: Update Comment**
```javascript
exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    let comment = await Comment.findById(req.params.id);

    // Check if user is the author
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.content = content.trim();
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email');

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Line 98**: **Only author can edit** - Users can't edit others' comments

---

### **Lines 120-152: Delete Comment**
```javascript
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate({
      path: 'ticket',
      populate: { path: 'project' }
    });

    // Check if user is the author or project owner
    const project = await Project.findById(comment.ticket.project._id);
    const isAuthor = comment.author.toString() === req.user.id;
    const isProjectOwner = project.owner.toString() === req.user.id;

    if (!isAuthor && !isProjectOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comment deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Lines 134-137**: Two deletion permissions:
1. Comment author - Can delete own comments
2. Project owner - Can moderate/delete any comment

**Line 123**: Nested populate - Get ticket AND its project

---

### **Lines 157-169: Get Comment Count**
```javascript
exports.getCommentCount = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const count = await Comment.countDocuments({ ticket: ticketId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

**Used by**: UI to show comment count badge on tickets

---

## 🔒 Authorization Matrix

| Operation | Author | Project Owner | Project Member | Other |
|-----------|--------|---------------|----------------|-------|
| View | ✅ (if in project) | ✅ | ✅ | ❌ |
| Create | ✅ (if in project) | ✅ | ✅ | ❌ |
| Update | ✅ (own only) | ❌ | ❌ | ❌ |
| Delete | ✅ (own only) | ✅ (any comment) | ❌ | ❌ |

---

## 🔗 Related Files
- [Comment Model](../models/backend-models-Comment.md) - Schema definition
- [Ticket Controller](backend-controller-ticket.md) - Ticket operations
- [CommentSection.jsx](../../frontend/components/frontend-component-CommentSection.md) - Frontend component

---

Simple but essential - enables ticket collaboration! 💬✨
