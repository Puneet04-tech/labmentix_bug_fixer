const Project = require('../models/Project');
const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const User = require('../models/User');

// @desc    Get overall statistics with enhanced metrics
// @route   GET /api/analytics/overview
// @access  Private
exports.getOverview = async (req, res) => {
  try {
    // Get user's projects
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    });

    const projectIds = userProjects.map(p => p._id);

    // Get counts
    const totalProjects = userProjects.length;
    const totalTickets = await Ticket.countDocuments({ project: { $in: projectIds } });
    const totalComments = await Comment.countDocuments({
      ticket: { $in: await Ticket.find({ project: { $in: projectIds } }).distinct('_id') }
    });

    // Active users (users who have created tickets or comments in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsers = await User.countDocuments({
      _id: {
        $in: [
          ...await Ticket.find({
            project: { $in: projectIds },
            createdAt: { $gte: thirtyDaysAgo }
          }).distinct('reportedBy'),
          ...await Comment.find({
            createdAt: { $gte: thirtyDaysAgo }
          }).distinct('author')
        ]
      }
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

    // Average resolution time (for resolved tickets)
    const avgResolutionTime = await Ticket.aggregate([
      {
        $match: {
          project: { $in: projectIds },
          status: { $in: ['Resolved', 'Closed'] },
          resolvedAt: { $exists: true }
        }
      },
      {
        $project: {
          resolutionTime: {
            $divide: [
              { $subtract: ['$resolvedAt', '$createdAt'] },
              1000 * 60 * 60 * 24 // Convert to days
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResolutionTime: { $avg: '$resolutionTime' }
        }
      }
    ]);

    // SLA compliance (tickets resolved within 7 days)
    const slaCompliant = await Ticket.countDocuments({
      project: { $in: projectIds },
      status: { $in: ['Resolved', 'Closed'] },
      resolvedAt: { $exists: true },
      $expr: {
        $lte: [
          { $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 1000 * 60 * 60 * 24] },
          7
        ]
      }
    });

    const totalResolved = await Ticket.countDocuments({
      project: { $in: projectIds },
      status: { $in: ['Resolved', 'Closed'] }
    });

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentTickets = await Ticket.countDocuments({
      project: { $in: projectIds },
      createdAt: { $gte: sevenDaysAgo }
    });

    const recentComments = await Comment.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Backlog analysis
    const backlogTickets = await Ticket.countDocuments({
      project: { $in: projectIds },
      status: { $in: ['Open', 'In Progress'] },
      createdAt: { $lt: sevenDaysAgo }
    });

    res.json({
      totalProjects,
      totalTickets,
      totalComments,
      activeUsers,
      recentTickets,
      recentComments,
      backlogTickets,
      avgResolutionTime: avgResolutionTime.length > 0 ? Math.round(avgResolutionTime[0].avgResolutionTime * 10) / 10 : 0,
      slaCompliance: totalResolved > 0 ? Math.round((slaCompliant / totalResolved) * 100) : 0,
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
        { 'members.user': req.user.id }
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

// @desc    Get ticket trends with enhanced metrics
// @route   GET /api/analytics/trends
// @access  Private
exports.getTicketTrends = async (req, res) => {
  try {
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
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
          created: { $sum: 1 },
          byPriority: {
            $push: '$priority'
          },
          byType: {
            $push: '$type'
          }
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

    // Comments per day
    const commentTrends = await Comment.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $lookup: {
          from: 'tickets',
          localField: 'ticket',
          foreignField: '_id',
          as: 'ticketInfo'
        }
      },
      {
        $match: {
          'ticketInfo.project': { $in: projectIds }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          comments: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Merge all trends
    const trends = {};
    ticketTrends.forEach(item => {
      trends[item._id] = {
        date: item._id,
        created: item.created,
        resolved: 0,
        comments: 0,
        priorityBreakdown: item.byPriority.reduce((acc, priority) => {
          acc[priority] = (acc[priority] || 0) + 1;
          return acc;
        }, {}),
        typeBreakdown: item.byType.reduce((acc, type) => {
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {})
      };
    });

    resolvedTrends.forEach(item => {
      if (trends[item._id]) {
        trends[item._id].resolved = item.resolved;
      } else {
        trends[item._id] = {
          date: item._id,
          created: 0,
          resolved: item.resolved,
          comments: 0,
          priorityBreakdown: {},
          typeBreakdown: {}
        };
      }
    });

    commentTrends.forEach(item => {
      if (trends[item._id]) {
        trends[item._id].comments = item.comments;
      } else {
        trends[item._id] = {
          date: item._id,
          created: 0,
          resolved: 0,
          comments: item.comments,
          priorityBreakdown: {},
          typeBreakdown: {}
        };
      }
    });

    const trendArray = Object.values(trends).sort((a, b) => a.date.localeCompare(b.date));

    // Calculate moving averages and trends
    const enhancedTrends = trendArray.map((day, index) => {
      const prev7Days = trendArray.slice(Math.max(0, index - 6), index + 1);
      const avgCreated = prev7Days.reduce((sum, d) => sum + d.created, 0) / prev7Days.length;
      const avgResolved = prev7Days.reduce((sum, d) => sum + d.resolved, 0) / prev7Days.length;

      return {
        ...day,
        movingAvgCreated: Math.round(avgCreated * 10) / 10,
        movingAvgResolved: Math.round(avgResolved * 10) / 10,
        netChange: day.created - day.resolved
      };
    });

    res.json(enhancedTrends);
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
        { 'members.user': req.user.id }
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

// @desc    Get team performance with enhanced metrics
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

        const openTickets = await Ticket.countDocuments({
          assignedTo: memberId,
          project: { $in: projectIds },
          status: { $in: ['Open', 'In Progress', 'In Review'] }
        });

        const overdueTickets = await Ticket.countDocuments({
          assignedTo: memberId,
          project: { $in: projectIds },
          status: { $nin: ['Resolved', 'Closed'] },
          dueDate: { $lt: new Date() }
        });

        const commentsCount = await Comment.countDocuments({
          author: memberId
        });

        // Average resolution time for this member
        const avgResolutionTime = await Ticket.aggregate([
          {
            $match: {
              assignedTo: memberId,
              project: { $in: projectIds },
              status: { $in: ['Resolved', 'Closed'] },
              resolvedAt: { $exists: true }
            }
          },
          {
            $project: {
              resolutionTime: {
                $divide: [
                  { $subtract: ['$resolvedAt', '$createdAt'] },
                  1000 * 60 * 60 * 24 // Convert to days
                ]
              }
            }
          },
          {
            $group: {
              _id: null,
              avgResolutionTime: { $avg: '$resolutionTime' }
            }
          }
        ]);

        // Recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentActivity = await Ticket.countDocuments({
          assignedTo: memberId,
          project: { $in: projectIds },
          updatedAt: { $gte: sevenDaysAgo }
        });

        return {
          id: memberId,
          name: member.name,
          email: member.email,
          assignedTickets,
          resolvedTickets,
          openTickets,
          overdueTickets,
          commentsCount,
          resolutionRate: assignedTickets > 0 ? Math.round((resolvedTickets / assignedTickets) * 100) : 0,
          avgResolutionTime: avgResolutionTime.length > 0 ? Math.round(avgResolutionTime[0].avgResolutionTime * 10) / 10 : 0,
          recentActivity,
          workloadScore: assignedTickets + (overdueTickets * 2) // Higher score = more workload
        };
      })
    );

    // Sort by workload score (descending) to show busiest team members first
    teamStats.sort((a, b) => b.workloadScore - a.workloadScore);

    res.json(teamStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get real-time metrics
// @route   GET /api/analytics/realtime
// @access  Private
exports.getRealtimeMetrics = async (req, res) => {
  try {
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    });

    const projectIds = userProjects.map(p => p._id);

    // Current active tickets
    const activeTickets = await Ticket.countDocuments({
      project: { $in: projectIds },
      status: { $in: ['Open', 'In Progress', 'In Review'] }
    });

    // Tickets due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueToday = await Ticket.countDocuments({
      project: { $in: projectIds },
      dueDate: { $gte: today, $lt: tomorrow },
      status: { $nin: ['Resolved', 'Closed'] }
    });

    // Overdue tickets
    const overdueTickets = await Ticket.countDocuments({
      project: { $in: projectIds },
      dueDate: { $lt: today },
      status: { $nin: ['Resolved', 'Closed'] }
    });

    // Recent activity (last hour)
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const recentActivity = await Ticket.countDocuments({
      project: { $in: projectIds },
      updatedAt: { $gte: oneHourAgo }
    });

    // Current sprint velocity (tickets resolved in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const sprintVelocity = await Ticket.countDocuments({
      project: { $in: projectIds },
      status: { $in: ['Resolved', 'Closed'] },
      resolvedAt: { $gte: sevenDaysAgo }
    });

    res.json({
      activeTickets,
      dueToday,
      overdueTickets,
      recentActivity,
      sprintVelocity,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get predictive analytics
// @route   GET /api/analytics/predictive
// @access  Private
exports.getPredictiveAnalytics = async (req, res) => {
  try {
    const userProjects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    });

    const projectIds = userProjects.map(p => p._id);

    // Historical data for predictions
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Monthly ticket creation trend
    const monthlyTrends = await Ticket.aggregate([
      {
        $match: {
          project: { $in: projectIds },
          createdAt: { $gte: ninetyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          ticketsCreated: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Calculate growth rate
    let growthRate = 0;
    if (monthlyTrends.length >= 2) {
      const recent = monthlyTrends.slice(-2);
      if (recent[1].ticketsCreated > 0) {
        growthRate = ((recent[1].ticketsCreated - recent[0].ticketsCreated) / recent[0].ticketsCreated) * 100;
      }
    }

    // Predict next month
    const avgMonthlyTickets = monthlyTrends.length > 0
      ? monthlyTrends.reduce((sum, month) => sum + month.ticketsCreated, 0) / monthlyTrends.length
      : 0;

    const predictedNextMonth = Math.round(avgMonthlyTickets * (1 + growthRate / 100));

    // Backlog growth prediction
    const currentBacklog = await Ticket.countDocuments({
      project: { $in: projectIds },
      status: { $in: ['Open', 'In Progress', 'In Review'] }
    });

    const monthlyResolutionRate = await Ticket.countDocuments({
      project: { $in: projectIds },
      status: { $in: ['Resolved', 'Closed'] },
      resolvedAt: { $gte: ninetyDaysAgo }
    }) / 3; // Average per month

    const monthsToClearBacklog = monthlyResolutionRate > 0
      ? Math.ceil(currentBacklog / monthlyResolutionRate)
      : 0;

    // Risk assessment
    const overdueTickets = await Ticket.countDocuments({
      project: { $in: projectIds },
      dueDate: { $lt: new Date() },
      status: { $nin: ['Resolved', 'Closed'] }
    });

    const criticalTickets = await Ticket.countDocuments({
      project: { $in: projectIds },
      priority: 'Critical',
      status: { $nin: ['Resolved', 'Closed'] }
    });

    let riskLevel = 'Low';
    if (overdueTickets > 10 || criticalTickets > 5) {
      riskLevel = 'High';
    } else if (overdueTickets > 5 || criticalTickets > 2) {
      riskLevel = 'Medium';
    }

    res.json({
      predictions: {
        nextMonthTickets: predictedNextMonth,
        growthRate: Math.round(growthRate * 10) / 10,
        monthsToClearBacklog,
        estimatedCompletion: monthsToClearBacklog > 0
          ? new Date(Date.now() + monthsToClearBacklog * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          : null
      },
      risks: {
        level: riskLevel,
        overdueTickets,
        criticalTickets,
        backlogSize: currentBacklog
      },
      insights: {
        avgMonthlyTickets: Math.round(avgMonthlyTickets * 10) / 10,
        resolutionRate: Math.round(monthlyResolutionRate * 10) / 10,
        trendDirection: growthRate > 5 ? 'Increasing' : growthRate < -5 ? 'Decreasing' : 'Stable'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
