const express = require('express');
const router = express.Router();
const {
  getOverview,
  getProjectStats,
  getTicketTrends,
  getUserActivity,
  getTeamPerformance
} = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Analytics routes
router.get('/overview', getOverview);
router.get('/projects', getProjectStats);
router.get('/trends', getTicketTrends);
router.get('/user-activity', getUserActivity);
router.get('/team', getTeamPerformance);

module.exports = router;
