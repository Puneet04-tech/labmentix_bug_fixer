
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import StatsCard from '../components/StatsCard';
import TicketChart from '../components/TicketChart';

// Helper functions for analytics calculations
const calculateProductivityTrends = (trends) => {
  if (!trends || !Array.isArray(trends)) return [];

  return trends.map(trend => ({
    ...trend,
    productivity: trend.completedTickets / Math.max(trend.totalTickets, 1),
    efficiency: trend.avgResolutionTime ? (1 / trend.avgResolutionTime) * 100 : 0
  }));
};

const calculateTicketVelocity = (overview, trends) => {
  if (!overview || !trends) return null;

  const totalTickets = trends.reduce((sum, trend) => sum + (trend.totalTickets || 0), 0);
  const completedTickets = trends.reduce((sum, trend) => sum + (trend.completedTickets || 0), 0);
  const avgResolutionTime = trends.reduce((sum, trend) => sum + (trend.avgResolutionTime || 0), 0) / Math.max(trends.length, 1);

  return {
    velocity: totalTickets / Math.max(trends.length, 1),
    completionRate: totalTickets > 0 ? (completedTickets / totalTickets) * 100 : 0,
    avgResolutionTime,
    trend: trends.length > 1 ? (trends[trends.length - 1].totalTickets - trends[0].totalTickets) / trends.length : 0
  };
};

const calculateTeamWorkload = (teamPerformance) => {
  if (!teamPerformance || !Array.isArray(teamPerformance)) return [];

  return teamPerformance.map(member => ({
    ...member,
    workloadScore: (member.activeTickets || 0) * 0.4 + (member.completedThisWeek || 0) * 0.3 + (member.avgResolutionTime || 0) * 0.3,
    capacity: member.activeTickets < 5 ? 'low' : member.activeTickets < 10 ? 'medium' : 'high'
  }));
};

const calculatePerformanceKPIs = (overview, teamPerformance) => {
  if (!overview || !teamPerformance) return null;

  const totalMembers = teamPerformance.length;
  const avgResolutionTime = teamPerformance.reduce((sum, member) => sum + (member.avgResolutionTime || 0), 0) / Math.max(totalMembers, 1);
  const totalActiveTickets = teamPerformance.reduce((sum, member) => sum + (member.activeTickets || 0), 0);
  const totalCompleted = teamPerformance.reduce((sum, member) => sum + (member.completedThisWeek || 0), 0);

  return {
    teamEfficiency: avgResolutionTime > 0 ? (1 / avgResolutionTime) * 100 : 0,
    workloadDistribution: totalActiveTickets / Math.max(totalMembers, 1),
    completionRate: (totalCompleted / Math.max(totalCompleted + totalActiveTickets, 1)) * 100,
    bottlenecks: teamPerformance.filter(member => member.activeTickets > 10).length
  };
};

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [realtimeLoading, setRealtimeLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Data states
  const [overview, setOverview] = useState(null);
  const [projectStats, setProjectStats] = useState([]);
  const [trends, setTrends] = useState([]);
  const [userActivity, setUserActivity] = useState(null);
  const [teamPerformance, setTeamPerformance] = useState([]);
  const [realtimeMetrics, setRealtimeMetrics] = useState(null);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState(null);

  // Filter states
  const [timeRange, setTimeRange] = useState('30');
  const [selectedProject, setSelectedProject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Real-time states
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [lastActivity, setLastActivity] = useState(null);
  const [activityFeed, setActivityFeed] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [dataVersion, setDataVersion] = useState(0);

  // Advanced analytics states
  const [productivityTrends, setProductivityTrends] = useState([]);
  const [ticketVelocity, setTicketVelocity] = useState(null);
  const [teamWorkload, setTeamWorkload] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [performanceKPIs, setPerformanceKPIs] = useState(null);

  // Activity feed helper function
  const updateActivityFeed = useCallback((message, type = 'info') => {
    const newActivity = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString()
    };
    setActivityFeed(prev => [newActivity, ...prev.slice(0, 9)]); // Keep last 10 activities
  }, []);

  // Memoized filtered data
  const filteredTeamPerformance = useMemo(() => {
    let filtered = [...teamPerformance];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'productivityScore' || sortBy === 'resolvedTickets') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [teamPerformance, searchTerm, sortBy, sortOrder]);

  const filteredProjectStats = useMemo(() => {
    if (selectedProject === 'all') return projectStats;
    return projectStats.filter(project => project.id === selectedProject);
  }, [projectStats, selectedProject]);

  useEffect(() => {
    fetchAnalytics();

    // Enhanced real-time updates
    let interval;
    if (liveUpdates) {
      interval = setInterval(() => {
        fetchAllRealtimeData();
        checkForUpdates();
      }, refreshInterval);
    }

    return () => clearInterval(interval);
  }, [liveUpdates, refreshInterval, timeRange, selectedProject]);

  // Check for data changes and update accordingly
  const checkForUpdates = useCallback(async () => {
    try {
      const response = await API.get('/analytics/updates', {
        params: { since: lastUpdated.toISOString() }
      });

      if (response.data.hasUpdates) {
        // Only update changed data
        if (response.data.updatedSections.includes('overview')) {
          fetchAnalytics(true);
        }
        if (response.data.updatedSections.includes('realtime')) {
          fetchRealtimeMetrics();
        }
        if (response.data.updatedSections.includes('predictive')) {
          fetchPredictiveAnalytics();
        }

        // Add to activity feed
        if (response.data.activities) {
          setActivityFeed(prev => [
            ...response.data.activities.slice(0, 10),
            ...prev.slice(0, 20)
          ]);
        }

        setLastActivity(new Date());
        setDataVersion(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }, [lastUpdated]);

  // Fetch all real-time data
  const fetchAllRealtimeData = useCallback(async () => {
    try {
      setRealtimeLoading(true);
      setConnectionStatus('updating');

      const params = { days: timeRange };
      if (selectedProject !== 'all') params.projectId = selectedProject;

      // Fetch all real-time data in parallel
      const [
        realtimeRes,
        productivityRes,
        velocityRes,
        workloadRes,
        kpisRes
      ] = await Promise.allSettled([
        API.get('/analytics/realtime', { params }),
        API.get('/analytics/productivity-trends', { params }),
        API.get('/analytics/ticket-velocity', { params }),
        API.get('/analytics/team-workload', { params }),
        API.get('/analytics/kpis', { params })
      ]);

      // Update states based on successful responses
      if (realtimeRes.status === 'fulfilled') {
        setRealtimeMetrics(realtimeRes.value.data);
      }
      if (productivityRes.status === 'fulfilled') {
        setProductivityTrends(productivityRes.value.data);
      }
      if (velocityRes.status === 'fulfilled') {
        setTicketVelocity(velocityRes.value.data);
      }
      if (workloadRes.status === 'fulfilled') {
        setTeamWorkload(workloadRes.value.data);
      }
      if (kpisRes.status === 'fulfilled') {
        setPerformanceKPIs(kpisRes.value.data);
      }

      setConnectionStatus('connected');
      setLastUpdated(new Date());

    } catch (error) {
      console.error('Failed to fetch real-time data:', error);
      setConnectionStatus('error');
    } finally {
      setRealtimeLoading(false);
    }
  }, [timeRange, selectedProject]);

  // Fetch analytics with caching, real-time updates, and error handling
  const fetchAnalytics = useCallback(async (forceRefresh = false) => {
    const cacheKey = `analytics_${timeRange}_${selectedProject}`;
    const cached = dataCache.get(cacheKey);

    // Return cached data if available and not forcing refresh
    if (cached && !forceRefresh && Date.now() - cached.timestamp < 300000) { // 5 minutes cache
      setOverview(cached.overview);
      setProjectStats(cached.projectStats);
      setTrends(cached.trends);
      setUserActivity(cached.userActivity);
      setTeamPerformance(cached.teamPerformance);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setConnectionStatus('connecting');

      const params = { days: timeRange };
      if (selectedProject !== 'all') params.projectId = selectedProject;

      // Add data version for real-time updates
      if (dataVersion) params.version = dataVersion;

      const [overviewRes, projectsRes, trendsRes, userRes, teamRes, alertsRes] = await Promise.all([
        API.get('/analytics/overview', { params }),
        API.get('/analytics/projects', { params }),
        API.get('/analytics/trends', { params }),
        API.get('/analytics/user-activity', { params }),
        API.get('/analytics/team', { params }),
        API.get('/analytics/alerts', { params }).catch(() => ({ data: [] })) // Optional alerts
      ]);

      const newData = {
        overview: overviewRes.data,
        projectStats: projectsRes.data,
        trends: trendsRes.data,
        userActivity: userRes.data,
        teamPerformance: teamRes.data,
        alerts: alertsRes.data || [],
        timestamp: Date.now(),
        version: overviewRes.data?.version || Date.now()
      };

      // Update data version for real-time tracking
      setDataVersion(newData.version);

      setDataCache(prev => new Map(prev.set(cacheKey, newData)));
      setOverview(newData.overview);
      setProjectStats(newData.projectStats);
      setTrends(newData.trends);
      setUserActivity(newData.userActivity);
      setTeamPerformance(newData.teamPerformance);
      setAlerts(newData.alerts);

      // Calculate additional metrics
      if (newData.overview && newData.trends) {
        const productivityTrends = calculateProductivityTrends(newData.trends);
        const ticketVelocity = calculateTicketVelocity(newData.overview, newData.trends);
        const teamWorkload = calculateTeamWorkload(newData.teamPerformance);
        const performanceKPIs = calculatePerformanceKPIs(newData.overview, newData.teamPerformance);

        setProductivityTrends(productivityTrends);
        setTicketVelocity(ticketVelocity);
        setTeamWorkload(teamWorkload);
        setPerformanceKPIs(performanceKPIs);
      }

      setConnectionStatus('connected');
      setRetryCount(0); // Reset retry count on success

      // Update activity feed with new data
      updateActivityFeed('Data refreshed successfully', 'success');

    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load analytics data';
      setError(errorMessage);
      setConnectionStatus('error');
      setRetryCount(prev => prev + 1);

      // Update activity feed with error
      updateActivityFeed(`Failed to refresh data: ${errorMessage}`, 'error');

      // Auto-retry logic for network errors
      if (retryCount < 3 && (error.code === 'NETWORK_ERROR' || error.response?.status >= 500)) {
        setTimeout(() => {
          if (retryCount < 3) {
            fetchAnalytics(forceRefresh);
          }
        }, Math.pow(2, retryCount) * 1000); // Exponential backoff
      }
    } finally {
      setLoading(false);
    }
  }, [timeRange, selectedProject, dataCache, dataVersion, retryCount]);

  const fetchRealtimeMetrics = useCallback(async () => {
    try {
      setRealtimeLoading(true);
      const params = { days: timeRange };
      if (selectedProject !== 'all') params.projectId = selectedProject;

      const response = await API.get('/analytics/realtime', { params });
      setRealtimeMetrics(response.data);
    } catch (error) {
      console.error('Failed to fetch realtime metrics:', error);
    } finally {
      setRealtimeLoading(false);
    }
  }, [timeRange, selectedProject]);

  const fetchPredictiveAnalytics = useCallback(async () => {
    try {
      const params = { days: timeRange };
      if (selectedProject !== 'all') params.projectId = selectedProject;

      const response = await API.get('/analytics/predictive', { params });
      setPredictiveAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch predictive analytics:', error);
    }
  }, [timeRange, selectedProject]);

  // Export functionality
  const exportData = useCallback(async (format = 'json') => {
    try {
      setExporting(true);

      const exportData = {
        overview,
        projectStats: filteredProjectStats,
        teamPerformance: filteredTeamPerformance,
        trends,
        userActivity,
        realtimeMetrics,
        predictiveAnalytics,
        exportedAt: new Date().toISOString(),
        filters: { timeRange, selectedProject, searchTerm }
      };

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        // Export team performance as CSV
        const csvContent = [
          ['Name', 'Email', 'Resolved Tickets', 'Avg Resolution Time', 'Productivity Score', 'Active Tickets', 'Overdue Tickets', 'Comments'],
          ...filteredTeamPerformance.map(member => [
            member.name,
            member.email,
            member.resolvedTickets,
            member.avgResolutionTime || 'N/A',
            member.productivityScore,
            member.activeTickets,
            member.overdueTickets,
            member.commentsCount
          ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `team-performance-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
      setError('Failed to export data');
    } finally {
      setExporting(false);
    }
  }, [overview, filteredProjectStats, filteredTeamPerformance, trends, userActivity, realtimeMetrics, predictiveAnalytics, timeRange, selectedProject, searchTerm]);

  // Refresh controls
  const refreshData = useCallback(() => {
    fetchAnalytics(true); // Force refresh
    fetchRealtimeMetrics();
    fetchPredictiveAnalytics();
    setLastUpdated(new Date());
    setRetryCount(0);
  }, [fetchAnalytics, fetchRealtimeMetrics, fetchPredictiveAnalytics]);

  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh(prev => !prev);
  }, []);

  const changeRefreshInterval = useCallback((interval) => {
    setRefreshInterval(interval);
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    setDataCache(new Map());
    refreshData();
  }, [refreshData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1220]">
        <header className="bg-[#0f1724] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary-600">🐛 Bug Tracker</h1>
              <nav className="hidden md:flex space-x-4">
                <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-primary-600">Dashboard</Link>
                <Link to="/projects" className="text-slate-500 dark:text-slate-400 hover:text-primary-600">Projects</Link>
                <Link to="/tickets" className="text-slate-500 dark:text-slate-400 hover:text-primary-600">Tickets</Link>
                <Link to="/analytics" className="text-primary-600 font-medium">Analytics</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">Welcome,</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{user?.name}</p>
              </div>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Activity Feed and Connection Status */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Connection Status */}
            <div className="bg-[#0f1724] rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-100">Connection Status</h3>
                <div className={`flex items-center space-x-2 ${connectionStatus === 'connected' ? 'text-green-400' : connectionStatus === 'connecting' ? 'text-blue-400' : 'text-red-400'}`}>
                  <div className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' : connectionStatus === 'connecting' ? 'bg-blue-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <span className="text-sm capitalize">{connectionStatus}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex justify-between">
                  <span>Last Update:</span>
                  <span className="text-slate-300">{lastUpdated.toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Version:</span>
                  <span className="text-slate-300">{dataVersion}</span>
                </div>
                {retryCount > 0 && (
                  <div className="flex justify-between">
                    <span>Retries:</span>
                    <span className="text-orange-400">{retryCount}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="lg:col-span-2 bg-[#0f1724] rounded-lg p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-100">Activity Feed</h3>
                <button
                  onClick={() => setActivityFeed([])}
                  className="text-slate-400 hover:text-slate-300 text-sm"
                  title="Clear activity feed"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {activityFeed.length === 0 ? (
                  <p className="text-slate-500 text-sm">No recent activity</p>
                ) : (
                  activityFeed.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-2 text-sm">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        activity.type === 'success' ? 'bg-green-400' :
                        activity.type === 'error' ? 'bg-red-400' :
                        activity.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-slate-300">{activity.message}</p>
                        <p className="text-slate-500 text-xs">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-slate-400">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1220] relative overflow-hidden">
      {/* Mossy Background Effects */}
      <div className="fixed inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/30 via-slate-900/20 to-slate-950/30"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 15% 25%, rgba(59, 130, 246, 0.12) 0%, transparent 45%),
                           radial-gradient(circle at 85% 15%, rgba(6, 182, 212, 0.10) 0%, transparent 40%),
                           radial-gradient(circle at 35% 75%, rgba(14, 165, 233, 0.14) 0%, transparent 50%),
                           radial-gradient(circle at 75% 65%, rgba(20, 184, 166, 0.08) 0%, transparent 35%),
                           radial-gradient(circle at 50% 40%, rgba(56, 189, 248, 0.06) 0%, transparent 55%),
                           radial-gradient(circle at 20% 85%, rgba(2, 132, 199, 0.11) 0%, transparent 45%),
                           radial-gradient(circle at 90% 35%, rgba(45, 212, 191, 0.09) 0%, transparent 40%),
                           radial-gradient(circle at 10% 50%, rgba(16, 185, 129, 0.12) 0%, transparent 45%),
                           radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.10) 0%, transparent 40%),
                           radial-gradient(circle at 60% 20%, rgba(132, 204, 22, 0.14) 0%, transparent 50%),
                           radial-gradient(circle at 25% 70%, rgba(5, 150, 105, 0.08) 0%, transparent 35%),
                           radial-gradient(circle at 70% 45%, rgba(20, 184, 166, 0.06) 0%, transparent 55%),
                           radial-gradient(circle at 45% 85%, rgba(13, 148, 136, 0.11) 0%, transparent 45%),
                           radial-gradient(circle at 95% 60%, rgba(6, 182, 212, 0.09) 0%, transparent 40%)`
        }}></div>
        {/* Foggy overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/8 backdrop-blur-[0.5px]"></div>
      </div>

      <div className="relative z-10">
      {/* Header */}
      <header className="bg-[#0f1724] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary-600">🐛 Bug Tracker</h1>
              <nav className="hidden md:flex space-x-4">
                <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-primary-600">Dashboard</Link>
                <Link to="/projects" className="text-slate-500 dark:text-slate-400 hover:text-primary-600">Projects</Link>
                <Link to="/tickets" className="text-slate-500 dark:text-slate-400 hover:text-primary-600">Tickets</Link>
                <Link to="/analytics" className="text-primary-600 font-medium">Analytics</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">Welcome,</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{user?.name}</p>
              </div>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Enhanced Analytics Controls */}
          <div className="mt-6 bg-[#0f1724] rounded-lg p-4 border border-slate-700">
            {/* Top Row: Filters and Search */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center space-x-4">
                {/* Time Range Filter */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-slate-400">Time Range:</label>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-slate-800 text-slate-100 px-3 py-1 rounded border border-slate-600 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                  </select>
                </div>

                {/* Project Filter */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-slate-400">Project:</label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="bg-slate-800 text-slate-100 px-3 py-1 rounded border border-slate-600 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Projects</option>
                    {projectStats.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>

                {/* Search */}
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-800 text-slate-100 px-3 py-1 rounded border border-slate-600 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
                  />
                </div>
              </div>

              {/* Export and Cache Controls */}
              <div className="flex items-center space-x-3">
                {/* Export Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setExporting(!exporting)}
                    disabled={exporting}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition disabled:opacity-50 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{exporting ? 'Exporting...' : 'Export'}</span>
                  </button>
                  {exporting && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg border border-slate-700 z-10">
                      <button
                        onClick={() => exportData('json')}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-100 hover:bg-slate-700 rounded-t-md"
                      >
                        Export as JSON
                      </button>
                      <button
                        onClick={() => exportData('csv')}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-100 hover:bg-slate-700 rounded-b-md"
                      >
                        Export Team Data as CSV
                      </button>
                    </div>
                  )}
                </div>

                {/* Clear Cache */}
                <button
                  onClick={clearCache}
                  className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg transition text-sm"
                  title="Clear cache and refresh"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear Cache</span>
                </button>
              </div>
            </div>

            {/* Bottom Row: Refresh Controls and Status */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                {/* Auto-refresh Toggle */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-slate-400">Auto-refresh:</label>
                  <button
                    onClick={toggleAutoRefresh}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      autoRefresh
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-600 text-slate-300'
                    }`}
                  >
                    {autoRefresh ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Refresh Interval */}
                {autoRefresh && (
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-slate-400">Interval:</label>
                    <select
                      value={refreshInterval}
                      onChange={(e) => changeRefreshInterval(Number(e.target.value))}
                      className="bg-slate-800 text-slate-100 px-2 py-1 rounded border border-slate-600 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={15000}>15s</option>
                      <option value={30000}>30s</option>
                      <option value={60000}>1m</option>
                      <option value={300000}>5m</option>
                    </select>
                  </div>
                )}

                {/* Status Indicators */}
                <div className="flex items-center space-x-4 text-xs text-slate-500">
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      connectionStatus === 'connected' ? 'bg-green-500' :
                      connectionStatus === 'connecting' ? 'bg-blue-500 animate-pulse' :
                      'bg-red-500'
                    }`}></div>
                    <span>Status: {connectionStatus === 'connected' ? 'Live' : connectionStatus === 'connecting' ? 'Connecting...' : 'Error'}</span>
                  </div>
                  <div>Last updated: {lastUpdated.toLocaleTimeString()}</div>
                  {retryCount > 0 && (
                    <div className="text-orange-400">Retries: {retryCount}</div>
                  )}
                </div>
              </div>

              {/* Manual Refresh */}
              <button
                onClick={refreshData}
                disabled={loading || realtimeLoading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className={`w-4 h-4 ${loading || realtimeLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh Data</span>
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-red-400 text-sm">{error}</span>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-lime-400 text-center mb-8 drop-shadow-lg">Analytics Dashboard</h2>
          <p className="text-slate-400 mt-2">Real-time insights and predictive analytics for your projects</p>
        </div>

        {/* Real-time Metrics */}
        {realtimeMetrics && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-teal-400 text-center mb-6 drop-shadow-md">Real-time Metrics</h3>
              {realtimeLoading && (
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Active Tickets</p>
                    <p className="text-2xl font-bold">{realtimeMetrics.activeTickets}</p>
                  </div>
                  <div className="text-blue-200">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">Due Today</p>
                    <p className="text-2xl font-bold">{realtimeMetrics.dueToday}</p>
                  </div>
                  <div className="text-yellow-200">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Overdue</p>
                    <p className="text-2xl font-bold">{realtimeMetrics.overdueTickets}</p>
                  </div>
                  <div className="text-red-200">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Sprint Velocity</p>
                    <p className="text-2xl font-bold">{realtimeMetrics.sprintVelocity}</p>
                    <p className="text-xs text-green-200">Last 7 days</p>
                  </div>
                  <div className="text-green-200">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 00-1.414 1.414L7.586 13H5V5a1 1 0 10-2 0V3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Recent Activity</p>
                    <p className="text-2xl font-bold">{realtimeMetrics.recentActivity}</p>
                    <p className="text-xs text-purple-200">Last hour</p>
                  </div>
                  <div className="text-purple-200">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overview Stats */}
        {overview && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Projects"
                value={overview.totalProjects}
                icon="📁"
                color="indigo"
              />
              <StatsCard
                title="Total Tickets"
                value={overview.totalTickets}
                icon="🎫"
                color="blue"
              />
              <StatsCard
                title="Active Users"
                value={overview.activeUsers}
                icon="👥"
                color="green"
                subtitle="Last 30 days"
              />
              <StatsCard
                title="Avg Resolution Time"
                value={`${overview.avgResolutionTime} days`}
                icon="⏱️"
                color="orange"
              />
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#0f1724] rounded-xl p-6">
                <h4 className="text-lg font-semibold text-slate-100 mb-4">SLA Compliance</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-green-400">{overview.slaCompliance}%</div>
                    <p className="text-sm text-slate-400">Tickets resolved within 7 days</p>
                  </div>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    overview.slaCompliance >= 80 ? 'bg-green-600' :
                    overview.slaCompliance >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}>
                    <span className="text-white font-bold text-lg">
                      {overview.slaCompliance >= 80 ? '✓' :
                       overview.slaCompliance >= 60 ? '⚠' : '✗'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0f1724] rounded-xl p-6">
                <h4 className="text-lg font-semibold text-slate-100 mb-4">Backlog Status</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-blue-400">{overview.backlogTickets}</div>
                    <p className="text-sm text-slate-400">Tickets older than 7 days</p>
                  </div>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    overview.backlogTickets < 10 ? 'bg-green-600' :
                    overview.backlogTickets < 25 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}>
                    <span className="text-white font-bold text-lg">
                      {overview.backlogTickets < 10 ? '✓' :
                       overview.backlogTickets < 25 ? '⚠' : '✗'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0f1724] rounded-xl p-6">
                <h4 className="text-lg font-semibold text-slate-100 mb-4">Recent Activity</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-purple-400">{overview.recentComments}</div>
                    <p className="text-sm text-slate-400">Comments in last 7 days</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <TicketChart
                data={overview.ticketsByStatus}
                type="bar"
                title="Tickets by Status"
              />
              <TicketChart
                data={overview.ticketsByPriority}
                type="donut"
                title="Tickets by Priority"
              />
              <TicketChart
                data={overview.ticketsByType}
                type="donut"
                title="Tickets by Type"
              />
            </div>
          </>
        )}

        {/* Predictive Analytics */}
        {predictiveAnalytics && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4 text-center drop-shadow-md">Predictive Analytics</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#0f1724] rounded-xl p-6">
                <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Future Predictions
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Next Month Tickets</span>
                    <span className="text-2xl font-bold text-blue-400">{predictiveAnalytics.predictions.nextMonthTickets}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Growth Rate</span>
                    <span className={`text-lg font-bold ${predictiveAnalytics.predictions.growthRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {predictiveAnalytics.predictions.growthRate >= 0 ? '+' : ''}{predictiveAnalytics.predictions.growthRate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Backlog Clearance</span>
                    <span className="text-lg font-bold text-purple-400">
                      {predictiveAnalytics.predictions.monthsToClearBacklog > 0
                        ? `${predictiveAnalytics.predictions.monthsToClearBacklog} months`
                        : 'Already clear'}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-700">
                    <div className="text-sm text-slate-400">Trend Direction</div>
                    <div className={`text-lg font-bold ${
                      predictiveAnalytics.insights.trendDirection === 'Increasing' ? 'text-green-400' :
                      predictiveAnalytics.insights.trendDirection === 'Decreasing' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {predictiveAnalytics.insights.trendDirection}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0f1724] rounded-xl p-6">
                <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Risk Assessment
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Risk Level</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      predictiveAnalytics.risks.level === 'High' ? 'bg-red-600 text-white' :
                      predictiveAnalytics.risks.level === 'Medium' ? 'bg-yellow-600 text-white' : 'bg-green-600 text-white'
                    }`}>
                      {predictiveAnalytics.risks.level}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Overdue Tickets</span>
                    <span className="text-lg font-bold text-red-400">{predictiveAnalytics.risks.overdueTickets}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Critical Tickets</span>
                    <span className="text-lg font-bold text-orange-400">{predictiveAnalytics.risks.criticalTickets}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Current Backlog</span>
                    <span className="text-lg font-bold text-blue-400">{predictiveAnalytics.risks.backlogSize}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project Performance */}
        {projectStats.length > 0 && (
            <div className="mb-8">
            <h3 className="text-2xl font-bold text-lime-400 mb-4 text-center drop-shadow-md">Project Performance</h3>
            <div className="bg-[#0f1724] rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-surface-700">
                <thead className="bg-[#0f1724]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Total Tickets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Open
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Closed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Completion
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#0f1724] divide-y divide-slate-700">
                  {projectStats.map((project) => (
                    <tr key={project.id} className="hover:bg-[#122433]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          {project.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-100">
                            {project.status}
                          </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                        {project.totalTickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                        {project.openTickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                        {project.closedTickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-[#122433] rounded-full h-2 mr-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${project.completionRate}%` }}
                            />
                          </div>
                            <span className="text-sm text-slate-100">{project.completionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Team Performance */}
        {teamPerformance.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-teal-400 mb-4 text-center drop-shadow-md">Team Performance</h3>
            <div className="bg-[#0f1724] rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-[#0f1724]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Team Member
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition"
                      onClick={() => {
                        setSortBy('resolvedTickets');
                        setSortOrder(sortBy === 'resolvedTickets' && sortOrder === 'desc' ? 'asc' : 'desc');
                      }}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Tickets Resolved</span>
                        <svg className={`w-3 h-3 ${sortBy === 'resolvedTickets' ? 'text-slate-300' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                            sortBy === 'resolvedTickets' && sortOrder === 'asc'
                              ? "M5 15l7-7 7 7"
                              : "M19 9l-7 7-7-7"
                          } />
                        </svg>
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition"
                      onClick={() => {
                        setSortBy('avgResolutionTime');
                        setSortOrder(sortBy === 'avgResolutionTime' && sortOrder === 'desc' ? 'asc' : 'desc');
                      }}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Avg Resolution Time</span>
                        <svg className={`w-3 h-3 ${sortBy === 'avgResolutionTime' ? 'text-slate-300' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                            sortBy === 'avgResolutionTime' && sortOrder === 'asc'
                              ? "M5 15l7-7 7 7"
                              : "M19 9l-7 7-7-7"
                          } />
                        </svg>
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition"
                      onClick={() => {
                        setSortBy('productivityScore');
                        setSortOrder(sortBy === 'productivityScore' && sortOrder === 'desc' ? 'asc' : 'desc');
                      }}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Productivity Score</span>
                        <svg className={`w-3 h-3 ${sortBy === 'productivityScore' ? 'text-slate-300' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                            sortBy === 'productivityScore' && sortOrder === 'asc'
                              ? "M5 15l7-7 7 7"
                              : "M19 9l-7 7-7-7"
                          } />
                        </svg>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Active Tickets
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition"
                      onClick={() => {
                        setSortBy('overdueTickets');
                        setSortOrder(sortBy === 'overdueTickets' && sortOrder === 'desc' ? 'asc' : 'desc');
                      }}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Overdue Tickets</span>
                        <svg className={`w-3 h-3 ${sortBy === 'overdueTickets' ? 'text-slate-300' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                            sortBy === 'overdueTickets' && sortOrder === 'asc'
                              ? "M5 15l7-7 7 7"
                              : "M19 9l-7 7-7-7"
                          } />
                        </svg>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Comments
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#0f1724] divide-y divide-slate-700">
                  {filteredTeamPerformance.map((member) => (
                    <tr key={member.id} className="hover:bg-[#122433]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-slate-100">{member.name}</div>
                          <div className="text-sm text-slate-400">{member.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                        {member.resolvedTickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                        {member.avgResolutionTime ? `${member.avgResolutionTime} days` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          member.productivityScore >= 80 ? 'bg-green-600 text-white' :
                          member.productivityScore >= 60 ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {member.productivityScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                        {member.activeTickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-bold ${member.overdueTickets > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {member.overdueTickets}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                        {member.commentsCount}
                      </td>
                    </tr>
                  ))}
                  {/* Summary Row */}
                  {filteredTeamPerformance.length > 1 && (
                    <tr className="bg-slate-800/50 border-t-2 border-slate-600">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-200">Total/Average</div>
                        <div className="text-xs text-slate-400">{filteredTeamPerformance.length} members</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-400">
                        {filteredTeamPerformance.reduce((sum, member) => sum + (member.resolvedTickets || 0), 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-orange-400">
                        {(filteredTeamPerformance.reduce((sum, member) => sum + (member.avgResolutionTime || 0), 0) / filteredTeamPerformance.length).toFixed(1)} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-400">
                        {(filteredTeamPerformance.reduce((sum, member) => sum + (member.productivityScore || 0), 0) / filteredTeamPerformance.length).toFixed(0)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-400">
                        {filteredTeamPerformance.reduce((sum, member) => sum + (member.activeTickets || 0), 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-400">
                        {filteredTeamPerformance.reduce((sum, member) => sum + (member.overdueTickets || 0), 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-cyan-400">
                        {filteredTeamPerformance.reduce((sum, member) => sum + (member.commentsCount || 0), 0)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Performance Insights */}
        {overview && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4 text-center drop-shadow-md">Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Efficiency Metrics */}
              <div className="bg-[#0f1724] rounded-xl p-6">
                <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Efficiency Score
                </h4>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {Math.round((overview.totalTickets > 0 ? (overview.totalTickets / Math.max(overview.totalTickets * 0.1, 1)) * 100 : 0))}%
                </div>
                <p className="text-sm text-slate-400">Ticket processing efficiency</p>
              </div>

              {/* Workload Distribution */}
              <div className="bg-[#0f1724] rounded-xl p-6">
                <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Workload Balance
                </h4>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {filteredTeamPerformance.length > 0
                    ? Math.round(100 - (Math.abs(filteredTeamPerformance.reduce((sum, member) => sum + (member.activeTickets || 0), 0) / filteredTeamPerformance.length - 2) * 10))
                    : 0}%
                </div>
                <p className="text-sm text-slate-400">Team workload distribution</p>
              </div>

              {/* Response Time */}
              <div className="bg-[#0f1724] rounded-xl p-6">
                <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Avg Response Time
                </h4>
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  {overview.avgResolutionTime || 'N/A'}
                </div>
                <p className="text-sm text-slate-400">Days to resolve tickets</p>
              </div>

              {/* Quality Score */}
              <div className="bg-[#0f1724] rounded-xl p-6">
                <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Quality Score
                </h4>
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {Math.round(overview.slaCompliance * 0.7 + (100 - overview.avgResolutionTime) * 0.3)}%
                </div>
                <p className="text-sm text-slate-400">Overall service quality</p>
              </div>
            </div>
          </div>
        )}

        {/* Trends Chart */}
        {trends.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-100 mb-4">Ticket Trends (Last 30 Days)</h3>
            <div className="bg-[#0f1724] rounded-xl shadow-sm p-6 sm:p-8">
              <div className="h-64 flex items-end justify-between gap-2">
                {trends.slice(-14).map((day, index) => {
                  const maxValue = Math.max(...trends.map(d => Math.max(d.created, d.resolved)));
                  const createdHeight = maxValue > 0 ? (day.created / maxValue) * 100 : 0;
                  const resolvedHeight = maxValue > 0 ? (day.resolved / maxValue) * 100 : 0;

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex gap-1 items-end justify-center h-48">
                        <div
                          className="w-1/2 bg-blue-500 rounded-t hover:bg-blue-600 transition-all"
                          style={{ height: `${createdHeight}%` }}
                          title={`Created: ${day.created}`}
                        />
                        <div
                          className="w-1/2 bg-green-500 rounded-t hover:bg-green-600 transition-all"
                          style={{ height: `${resolvedHeight}%` }}
                          title={`Resolved: ${day.resolved}`}
                        />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 transform rotate-45 origin-top-left mt-4">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-6 mt-8">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2" />
                  <span className="text-sm text-slate-700">Created</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2" />
                  <span className="text-sm text-slate-700">Resolved</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
    </div>
  );
};

export default Analytics;
