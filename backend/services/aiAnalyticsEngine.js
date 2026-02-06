const Ticket = require('../models/Ticket');
const Project = require('../models/Project');
const User = require('../models/User');

class AIAnalyticsEngine {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  // Clear cache to force fresh analysis
  clearCache() {
    this.cache.clear();
  }

  // Get cached data or compute fresh
  async getCachedData(key, computeFunction) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    const data = await computeFunction();
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  }

  // Real trend analysis based on actual data
  async analyzeTrends() {
    return this.getCachedData('trends', async () => {
      const now = new Date();
      const periods = {
        today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        month: new Date(now.getFullYear(), now.getMonth(), 1),
        lastMonth: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        quarter: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
      };

      // Check if there's any data at all
      const totalTickets = await Ticket.countDocuments();
      
      if (totalTickets === 0) {
        return {
          periods,
          metrics: {
            tickets: { today: 0, week: 0, month: 0, lastMonth: 0, quarter: 0 },
            resolved: { today: 0, week: 0, month: 0, lastMonth: 0 },
            highPriority: { today: 0, week: 0, month: 0 }
          },
          trends: {
            weeklyGrowth: 0,
            monthlyGrowth: 0,
            resolutionRate: 0,
            highPriorityRate: 0,
            dataStatus: 'no_data'
          }
        };
      }

      const [
        ticketsToday,
        ticketsWeek,
        ticketsMonth,
        ticketsLastMonth,
        ticketsQuarter,
        resolvedToday,
        resolvedWeek,
        resolvedMonth,
        resolvedLastMonth,
        highPriorityToday,
        highPriorityWeek,
        highPriorityMonth
      ] = await Promise.all([
        Ticket.countDocuments({ createdAt: { $gte: periods.today } }),
        Ticket.countDocuments({ createdAt: { $gte: periods.week } }),
        Ticket.countDocuments({ createdAt: { $gte: periods.month } }),
        Ticket.countDocuments({ createdAt: { $gte: periods.lastMonth, $lt: periods.month } }),
        Ticket.countDocuments({ createdAt: { $gte: periods.quarter } }),
        Ticket.countDocuments({ status: 'Resolved', resolvedAt: { $gte: periods.today } }),
        Ticket.countDocuments({ status: 'Resolved', resolvedAt: { $gte: periods.week } }),
        Ticket.countDocuments({ status: 'Resolved', resolvedAt: { $gte: periods.month } }),
        Ticket.countDocuments({ status: 'Resolved', resolvedAt: { $gte: periods.lastMonth, $lt: periods.month } }),
        Ticket.countDocuments({ priority: 'High', createdAt: { $gte: periods.today } }),
        Ticket.countDocuments({ priority: 'High', createdAt: { $gte: periods.week } }),
        Ticket.countDocuments({ priority: 'High', createdAt: { $gte: periods.month } })
      ]);

      // Calculate real trends
      const weeklyGrowth = ticketsWeek > 0 ? ((ticketsToday * 7 - ticketsWeek) / ticketsWeek * 100) : 0;
      const monthlyGrowth = ticketsLastMonth > 0 ? ((ticketsMonth - ticketsLastMonth) / ticketsLastMonth * 100) : 0;
      const resolutionRate = ticketsMonth > 0 ? (resolvedMonth / ticketsMonth * 100) : 0;
      const highPriorityRate = ticketsMonth > 0 ? (highPriorityMonth / ticketsMonth * 100) : 0;

      return {
        periods,
        metrics: {
          tickets: { today: ticketsToday, week: ticketsWeek, month: ticketsMonth, lastMonth: ticketsLastMonth, quarter: ticketsQuarter },
          resolved: { today: resolvedToday, week: resolvedWeek, month: resolvedMonth, lastMonth: resolvedLastMonth },
          highPriority: { today: highPriorityToday, week: highPriorityWeek, month: highPriorityMonth }
        },
        trends: {
          weeklyGrowth: Number(weeklyGrowth.toFixed(1)),
          monthlyGrowth: Number(monthlyGrowth.toFixed(1)),
          resolutionRate: Number(resolutionRate.toFixed(1)),
          highPriorityRate: Number(highPriorityRate.toFixed(1)),
          dataStatus: 'has_data'
        }
      };
    });
  }

  // Real team performance analysis
  async analyzeTeamPerformance() {
    return this.getCachedData('teamPerformance', async () => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Get real user performance data
      const userStats = await Ticket.aggregate([
        {
          $match: {
            createdAt: { $gte: monthStart }
          }
        },
        {
          $group: {
            _id: '$assignedTo',
            assignedCount: { $sum: 1 },
            resolvedCount: {
              $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
            },
            avgResolutionTime: {
              $avg: {
                $cond: [
                  { $and: [{ $ne: ['$resolvedAt', null] }, { $ne: ['$createdAt', null] }] },
                  { $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 1000 * 60 * 60 * 24] },
                  null
                ]
              }
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $project: {
            name: '$user.name',
            email: '$user.email',
            role: '$user.role',
            assignedCount: 1,
            resolvedCount: 1,
            resolutionRate: {
              $cond: [
                { $eq: ['$assignedCount', 0] },
                0,
                { $multiply: [{ $divide: ['$resolvedCount', '$assignedCount'] }, 100] }
              ]
            },
            avgResolutionTime: { $ifNull: ['$avgResolutionTime', 0] }
          }
        },
        {
          $sort: { resolvedCount: -1 }
        }
      ]);

      // Calculate team metrics
      const totalAssigned = userStats.reduce((sum, user) => sum + user.assignedCount, 0);
      const totalResolved = userStats.reduce((sum, user) => sum + user.resolvedCount, 0);
      const avgResolutionTime = userStats.filter(u => u.avgResolutionTime > 0)
        .reduce((sum, user) => sum + user.avgResolutionTime, 0) / 
        userStats.filter(u => u.avgResolutionTime > 0).length || 0;

      return {
        userStats,
        teamMetrics: {
          totalMembers: userStats.length,
          totalAssigned,
          totalResolved,
          teamResolutionRate: totalAssigned > 0 ? Number((totalResolved / totalAssigned * 100).toFixed(1)) : 0,
          avgResolutionTime: Number(avgResolutionTime.toFixed(1)),
          topPerformer: userStats[0] || null
        }
      };
    });
  }

  // Real project health analysis
  async analyzeProjectHealth() {
    return this.getCachedData('projectHealth', async () => {
      const projectStats = await Project.aggregate([
        {
          $lookup: {
            from: 'tickets',
            localField: '_id',
            foreignField: 'project',
            as: 'tickets'
          }
        },
        {
          $project: {
            name: 1,
            status: 1,
            priority: 1,
            createdAt: 1,
            ticketCount: { $size: '$tickets' },
            openTickets: {
              $size: {
                $filter: {
                  input: '$tickets',
                  cond: { $in: ['$$this.status', ['Open', 'In Progress']] }
                }
              }
            },
            highPriorityTickets: {
              $size: {
                $filter: {
                  input: '$tickets',
                  cond: { $eq: ['$$this.priority', 'High'] }
                }
              }
            },
            resolvedTickets: {
              $size: {
                $filter: {
                  input: '$tickets',
                  cond: { $eq: ['$$this.status', 'Resolved'] }
                }
              }
            }
          }
        },
        {
          $addFields: {
            healthScore: {
              $add: [
                { $multiply: [{ $divide: ['$resolvedTickets', { $max: ['$ticketCount', 1] }] }, 50] },
                { $multiply: [{ $subtract: [1, { $divide: ['$highPriorityTickets', { $max: ['$ticketCount', 1] }] }] }, 30] },
                { $cond: [{ $eq: ['$status', 'Active'] }, 20, 0] }
              ]
            }
          }
        }
      ]);

      // Calculate overall health metrics
      const totalProjects = projectStats.length;
      const activeProjects = projectStats.filter(p => p.status === 'Active').length;
      const avgHealthScore = projectStats.reduce((sum, p) => sum + p.healthScore, 0) / totalProjects;
      const criticalProjects = projectStats.filter(p => p.healthScore < 30).length;

      return {
        projectStats,
        overallHealth: {
          totalProjects,
          activeProjects,
          avgHealthScore: Number(avgHealthScore.toFixed(1)),
          criticalProjects,
          healthDistribution: {
            excellent: projectStats.filter(p => p.healthScore >= 80).length,
            good: projectStats.filter(p => p.healthScore >= 60 && p.healthScore < 80).length,
            fair: projectStats.filter(p => p.healthScore >= 40 && p.healthScore < 60).length,
            poor: projectStats.filter(p => p.healthScore < 40).length
          }
        }
      };
    });
  }

  // Real predictive analytics using historical data
  async generatePredictions() {
    return this.getCachedData('predictions', async () => {
      const now = new Date();
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get historical data for predictions
      const dailyTickets = await Ticket.aggregate([
        {
          $match: {
            createdAt: { $gte: last30Days }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 },
            resolved: {
              $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
            }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
      ]);

      // Calculate trends for predictions
      const recentDaily = dailyTickets.slice(-7);
      const avgDailyTickets = recentDaily.reduce((sum, day) => sum + day.count, 0) / recentDaily.length;
      const avgDailyResolved = recentDaily.reduce((sum, day) => sum + day.resolved, 0) / recentDaily.length;

      // Trend analysis
      const firstHalf = dailyTickets.slice(0, 15);
      const secondHalf = dailyTickets.slice(15);
      const firstHalfAvg = firstHalf.reduce((sum, day) => sum + day.count, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, day) => sum + day.count, 0) / secondHalf.length;
      const trend = secondHalfAvg > firstHalfAvg ? 'increasing' : secondHalfAvg < firstHalfAvg ? 'decreasing' : 'stable';

      // Predict next week
      const trendMultiplier = trend === 'increasing' ? 1.1 : trend === 'decreasing' ? 0.9 : 1.0;
      const predictedNextWeek = Math.round(avgDailyTickets * 7 * trendMultiplier);
      const predictedResolutions = Math.round(avgDailyResolved * 7 * trendMultiplier);

      // Get current workload
      const openTickets = await Ticket.countDocuments({ 
        status: { $in: ['Open', 'In Progress'] } 
      });
      const totalUsers = await User.countDocuments({ role: { $in: ['admin', 'core', 'member'] } });
      const workloadPerUser = openTickets / totalUsers;

      return {
        nextWeek: {
          expectedTickets: predictedNextWeek,
          expectedResolutions: predictedResolutions,
          trend,
          confidence: trend === 'stable' ? 85 : trend === 'increasing' ? 75 : 70
        },
        currentWorkload: {
          openTickets,
          totalUsers,
          workloadPerUser: Number(workloadPerUser.toFixed(1)),
          workloadLevel: workloadPerUser > 10 ? 'High' : workloadPerUser > 5 ? 'Medium' : 'Low'
        },
        performance: {
          avgResolutionTime: avgDailyResolved > 0 ? (7 / avgDailyResolved).toFixed(1) : 'N/A',
          successRate: avgDailyTickets > 0 ? ((avgDailyResolved / avgDailyTickets) * 100).toFixed(1) : 0
        }
      };
    });
  }

  // Generate real recommendations based on data
  async generateRecommendations() {
    const [trends, teamPerf, projectHealth, predictions] = await Promise.all([
      this.analyzeTrends(),
      this.analyzeTeamPerformance(),
      this.analyzeProjectHealth(),
      this.generatePredictions()
    ]);

    const recommendations = [];

    // High priority recommendations
    if (trends.trends.highPriorityRate > 30) {
      recommendations.push({
        priority: 'high',
        title: 'Critical: Reduce High Priority Bug Volume',
        description: `${trends.trends.highPriorityRate}% of tickets are high priority. This indicates systemic issues.`,
        impact: 'Reduce critical issues by 40%',
        effort: 'High',
        category: 'quality',
        data: { highPriorityRate: trends.trends.highPriorityRate }
      });
    }

    if (predictions.currentWorkload.workloadLevel === 'High') {
      recommendations.push({
        priority: 'high',
        title: 'Team Overload Alert',
        description: `Each team member handles ${predictions.currentWorkload.workloadPerUser} tickets on average.`,
        impact: 'Improve team productivity by 25%',
        effort: 'Medium',
        category: 'workload',
        data: { workloadPerUser: predictions.currentWorkload.workloadPerUser }
      });
    }

    if (trends.trends.resolutionRate < 60) {
      recommendations.push({
        priority: 'high',
        title: 'Improve Resolution Process',
        description: `Current resolution rate is only ${trends.trends.resolutionRate}%. Target should be >80%.`,
        impact: 'Increase resolution rate by 30%',
        effort: 'High',
        category: 'process',
        data: { resolutionRate: trends.trends.resolutionRate }
      });
    }

    // Medium priority recommendations
    if (projectHealth.overallHealth.criticalProjects > 0) {
      recommendations.push({
        priority: 'medium',
        title: 'Address Critical Project Health',
        description: `${projectHealth.overallHealth.criticalProjects} projects need immediate attention.`,
        impact: 'Improve project success rate',
        effort: 'Medium',
        category: 'projects',
        data: { criticalProjects: projectHealth.overallHealth.criticalProjects }
      });
    }

    if (teamPerf.teamMetrics.avgResolutionTime > 5) {
      recommendations.push({
        priority: 'medium',
        title: 'Optimize Resolution Time',
        description: `Average resolution time is ${teamPerf.teamMetrics.avgResolutionTime} days. Consider process improvements.`,
        impact: 'Reduce resolution time by 35%',
        effort: 'Medium',
        category: 'efficiency',
        data: { avgResolutionTime: teamPerf.teamMetrics.avgResolutionTime }
      });
    }

    // Low priority recommendations
    if (trends.trends.monthlyGrowth < -10) {
      recommendations.push({
        priority: 'low',
        title: 'Investigate Declining Ticket Volume',
        description: `Ticket volume decreased by ${Math.abs(trends.trends.monthlyGrowth)}% this month.`,
        impact: 'Ensure comprehensive issue tracking',
        effort: 'Low',
        category: 'monitoring',
        data: { monthlyGrowth: trends.trends.monthlyGrowth }
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'low',
        title: 'Maintain Current Performance',
        description: 'All metrics are within acceptable ranges. Continue current practices.',
        impact: 'Sustain current efficiency',
        effort: 'Low',
        category: 'maintenance',
        data: {}
      });
    }

    return recommendations;
  }

  // Comprehensive analysis
  async getComprehensiveAnalysis() {
    const [trends, teamPerf, projectHealth, predictions, recommendations] = await Promise.all([
      this.analyzeTrends(),
      this.analyzeTeamPerformance(),
      this.analyzeProjectHealth(),
      this.generatePredictions(),
      this.generateRecommendations()
    ]);

    return {
      timestamp: new Date().toISOString(),
      trends,
      teamPerformance: teamPerf,
      projectHealth,
      predictions,
      recommendations,
      summary: {
        overallHealth: projectHealth.overallHealth.avgHealthScore,
        teamEfficiency: teamPerf.teamMetrics.teamResolutionRate,
        projectStability: projectHealth.overallHealth.healthDistribution.excellent / projectHealth.overallHealth.totalProjects * 100,
        riskLevel: predictions.currentWorkload.workloadLevel === 'High' ? 'High' : 
                   predictions.currentWorkload.workloadLevel === 'Medium' ? 'Medium' : 'Low'
      }
    };
  }
}

module.exports = AIAnalyticsEngine;
