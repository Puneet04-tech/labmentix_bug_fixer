const Project = require('../models/Project');
const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const User = require('../models/User');

// @desc    Get overall statistics
// @route   GET /api/analytics/overview
// @access  Private
exports.getOverview = async (req, res) => {
  try {
    // Get user's projects
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    });

    const projectIds = userProjects.map(p => p._id);

    // Get counts
    const totalProjects = userProjects.length;
    const totalTickets = await Ticket.countDocuments({ project: { $in: projectIds } });
    const totalComments = await Comment.countDocuments({ 
      ticket: { $in: await Ticket.find({ project: { $in: projectIds } }).distinct('_id') }
    });

    // Ticket status breakdown
    const ticketsByStatus = await Ticket.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Ticket priority breakdown
    const ticketsByPriority = await Ticket.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Ticket type breakdown
    const ticketsByType = await Ticket.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Recent activity (tickets created in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentTickets = await Ticket.countDocuments({
      project: { $in: projectIds },
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      totalProjects,
      totalTickets,
      totalComments,
      recentTickets,
      ticketsByStatus: ticketsByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      ticketsByPriority: ticketsByPriority.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      ticketsByType: ticketsByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project statistics
// @route   GET /api/analytics/projects
// @access  Private
exports.getProjectStats = async (req, res) => {
  try {
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    }).select('name status priority');

    const projectStats = await Promise.all(
      userProjects.map(async (project) => {
        const totalTickets = await Ticket.countDocuments({ project: project._id });
        const openTickets = await Ticket.countDocuments({ 
          project: project._id, 
          status: { $in: ['Open', 'In Progress', 'In Review'] }
        });
        const closedTickets = await Ticket.countDocuments({ 
          project: project._id, 
          status: { $in: ['Resolved', 'Closed'] }
        });

        return {
          id: project._id,
          name: project.name,
          status: project.status,
          priority: project.priority,
          totalTickets,
          openTickets,
          closedTickets,
          completionRate: totalTickets > 0 ? Math.round((closedTickets / totalTickets) * 100) : 0
        };
      })
    );

    res.json(projectStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ticket trends (last 30 days)
// @route   GET /api/analytics/trends
// @access  Private
exports.getTicketTrends = async (req, res) => {
  try {
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    });

    const projectIds = userProjects.map(p => p._id);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Tickets created per day
    const ticketTrends = await Ticket.aggregate([
      { 
        $match: { 
          project: { $in: projectIds },
          createdAt: { $gte: thirtyDaysAgo }
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          created: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Tickets resolved per day
    const resolvedTrends = await Ticket.aggregate([
      { 
        $match: { 
          project: { $in: projectIds },
          status: { $in: ['Resolved', 'Closed'] },
          updatedAt: { $gte: thirtyDaysAgo }
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' }
          },
          resolved: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Merge trends
    const trends = {};
    ticketTrends.forEach(item => {
      trends[item._id] = { date: item._id, created: item.created, resolved: 0 };
    });
    resolvedTrends.forEach(item => {
      if (trends[item._id]) {
        trends[item._id].resolved = item.resolved;
      } else {
        trends[item._id] = { date: item._id, created: 0, resolved: item.resolved };
      }
    });

    const trendArray = Object.values(trends).sort((a, b) => a.date.localeCompare(b.date));

    res.json(trendArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user activity stats
// @route   GET /api/analytics/user-activity
// @access  Private
exports.getUserActivity = async (req, res) => {
  try {
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    });

    const projectIds = userProjects.map(p => p._id);

    // Tickets created by user
    const ticketsCreated = await Ticket.countDocuments({ 
      reportedBy: req.user.id,
      project: { $in: projectIds }
    });

    // Tickets assigned to user
    const ticketsAssigned = await Ticket.countDocuments({ 
      assignedTo: req.user.id,
      project: { $in: projectIds }
    });

    // Comments by user
    const commentsPosted = await Comment.countDocuments({ 
      author: req.user.id
    });

    // Projects owned
    const projectsOwned = await Project.countDocuments({ 
      owner: req.user.id 
    });

    // Recent tickets (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentTicketsCreated = await Ticket.countDocuments({
      reportedBy: req.user.id,
      project: { $in: projectIds },
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      ticketsCreated,
      ticketsAssigned,
      commentsPosted,
      projectsOwned,
      recentTicketsCreated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get team performance
// @route   GET /api/analytics/team
// @access  Private
exports.getTeamPerformance = async (req, res) => {
  try {
    const userProjects = await Project.find({
      owner: req.user.id
    }).populate('members', 'name email');

    if (userProjects.length === 0) {
      return res.json([]);
    }

    const projectIds = userProjects.map(p => p._id);

    // Get all team members
    const allMembers = new Set();
    userProjects.forEach(project => {
      project.members.forEach(member => {
        allMembers.add(member._id.toString());
      });
    });

    const teamStats = await Promise.all(
      Array.from(allMembers).map(async (memberId) => {
        const member = await User.findById(memberId).select('name email');
        
        const assignedTickets = await Ticket.countDocuments({
          assignedTo: memberId,
          project: { $in: projectIds }
        });

        const resolvedTickets = await Ticket.countDocuments({
          assignedTo: memberId,
          project: { $in: projectIds },
          status: { $in: ['Resolved', 'Closed'] }
        });

        const commentsCount = await Comment.countDocuments({
          author: memberId
        });

        return {
          id: memberId,
          name: member.name,
          email: member.email,
          assignedTickets,
          resolvedTickets,
          commentsCount,
          resolutionRate: assignedTickets > 0 ? Math.round((resolvedTickets / assignedTickets) * 100) : 0
        };
      })
    );

    res.json(teamStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
