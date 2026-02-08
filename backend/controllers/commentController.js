const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');
const Project = require('../models/Project');

// Helper to extract an ID string from a ref which may be an ObjectId, string, or populated object
const refToId = (ref) => {
  if (!ref) return null;
  if (typeof ref === 'string') return ref;
  if (ref._id) return ref._id.toString();
  if (ref.toString) return ref.toString();
  return null;
};

// @desc    Get all comments for a ticket
// @route   GET /api/comments/ticket/:ticketId
// @access  Private
exports.getCommentsByTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Check if ticket exists and user has access
    const ticket = await Ticket.findById(ticketId).populate('project');
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user has access to project
    const project = await Project.findById(ticket.project._id);
    const isOwner = refToId(project.owner) === req.user.id;
    const isMember = project.members.some(member => refToId(member.user) === req.user.id);

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

// @desc    Create new comment
// @route   POST /api/comments
// @access  Private
exports.createComment = async (req, res) => {
  try {
    const { content, ticket } = req.body;

    // Validation
    if (!content || !ticket) {
      return res.status(400).json({ message: 'Please provide content and ticket ID' });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    // Check if ticket exists and user has access
    const ticketDoc = await Ticket.findById(ticket).populate('project');
    if (!ticketDoc) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user has access to the project
    const project = await Project.findById(ticketDoc.project._id);
    const isOwner = refToId(project.owner) === req.user.id;
    const isMember = project.members.some(member => refToId(member.user) === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to comment on this ticket' });
    }

    // Create comment
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

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content cannot be empty' });
    }

    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    // Update comment
    comment.content = content.trim();
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email');

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate({
      path: 'ticket',
      populate: { path: 'project' }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is author or project owner
    const project = await Project.findById(comment.ticket.project._id);
    const isAuthor = comment.author.toString() === req.user.id;
    const isProjectOwner = refToId(project.owner) === req.user.id;
    const isProjectMember = project.members.some(member => refToId(member.user) === req.user.id);

    if (!isAuthor && !isProjectOwner && !isProjectMember) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comment deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comment count for a ticket
// @route   GET /api/comments/ticket/:ticketId/count
// @access  Private
exports.getCommentCount = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const count = await Comment.countDocuments({ ticket: ticketId });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
