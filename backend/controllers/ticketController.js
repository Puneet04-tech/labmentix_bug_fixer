const Ticket = require('../models/Ticket');
const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private
exports.getTickets = async (req, res) => {
  try {
    const { project, status, priority, assignedTo, search } = req.query;
    
    // Build filter
    const filter = {};
    
    // Get user's projects first
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    }).select('_id');
    
    const projectIds = userProjects.map(p => p._id);
    filter.project = { $in: projectIds };
    
    // Apply additional filters
    if (project) filter.project = project;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    
    // Search filter - search in title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(filter)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate({
        path: 'project',
        select: 'name owner members',
        populate: [
          { path: 'owner', select: 'name email' },
          { path: 'members', select: 'name email' }
        ]
      })
      .populate('assignedTo', 'name email')
      .populate('reportedBy', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user has access to the project
    const project = ticket.project;
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some(member => member.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to access this ticket' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
exports.createTicket = async (req, res) => {
  try {
    const { title, description, type, status, priority, project, assignedTo, dueDate } = req.body;

    // Validation
    if (!title || !description || !project) {
      return res.status(400).json({ message: 'Please provide title, description, and project' });
    }

    // Check if user has access to the project
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isOwner = projectDoc.owner.toString() === req.user.id;
    const isMember = projectDoc.members.some(member => member.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to create tickets in this project' });
    }

    // If assignedTo is provided, validate they're part of the project and exist
    if (assignedTo) {
      const isAssigneeValid = projectDoc.owner.toString() === assignedTo ||
                             projectDoc.members.some(member => member.toString() === assignedTo);
      if (!isAssigneeValid) {
        return res.status(400).json({ message: 'Assigned user is not part of the project' });
      }
      const assigneeUser = await User.findById(assignedTo);
      if (!assigneeUser) {
        return res.status(400).json({ message: 'Assigned user not found' });
      }
    }

    // Create ticket
    const ticket = await Ticket.create({
      title,
      description,
      type: type || 'Bug',
      status: status || 'Open',
      priority: priority || 'Medium',
      project,
      assignedTo,
      reportedBy: req.user.id,
      dueDate
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('reportedBy', 'name email');

    res.status(201).json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
exports.updateTicket = async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id).populate('project');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user has access to the project
    const project = ticket.project;
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some(member => member.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to update this ticket' });
    }

    // If assignedTo is being changed, validate
    if (req.body.assignedTo) {
      const isAssigneeValid = project.owner.toString() === req.body.assignedTo ||
                             project.members.some(member => member.toString() === req.body.assignedTo);
      if (!isAssigneeValid) {
        return res.status(400).json({ message: 'Assigned user is not part of the project' });
      }
      const assigneeUser = await User.findById(req.body.assignedTo);
      if (!assigneeUser) {
        return res.status(400).json({ message: 'Assigned user not found' });
      }
    }

    // Update ticket
    ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('project', 'name')
    .populate('assignedTo', 'name email')
    .populate('reportedBy', 'name email');

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('project');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user is project owner or ticket reporter
    const isProjectOwner = ticket.project.owner.toString() === req.user.id;
    const isReporter = ticket.reportedBy.toString() === req.user.id;

    if (!isProjectOwner && !isReporter) {
      return res.status(403).json({ message: 'Not authorized to delete this ticket' });
    }

    await Ticket.findByIdAndDelete(req.params.id);

    res.json({ message: 'Ticket deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tickets by project
// @route   GET /api/tickets/project/:projectId
// @access  Private
exports.getTicketsByProject = async (req, res) => {
  try {
    // Check if user has access to the project
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some(member => member.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    const tickets = await Ticket.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign ticket to user
// @route   PUT /api/tickets/:id/assign
// @access  Private
exports.assignTicket = async (req, res) => {
  try {
    const { userId } = req.body;
    const ticket = await Ticket.findById(req.params.id).populate('project');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user has access to the project
    const project = ticket.project;
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some(member => member.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to assign this ticket' });
    }

    // Validate assignee is part of project and exists
    if (userId) {
      const isAssigneeValid = project.owner.toString() === userId ||
                             project.members.some(member => member.toString() === userId);
      if (!isAssigneeValid) {
        return res.status(400).json({ message: 'User is not part of the project' });
      }
      const assigneeUser = await User.findById(userId);
      if (!assigneeUser) {
        return res.status(400).json({ message: 'Assigned user not found' });
      }
    }

    ticket.assignedTo = userId || null;
    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('reportedBy', 'name email');

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
