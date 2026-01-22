const express = require('express');
const router = express.Router();
const {
  getCommentsByTicket,
  createComment,
  updateComment,
  deleteComment,
  getCommentCount
} = require('../controllers/commentController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Comment CRUD routes
router.post('/', createComment);

// Ticket-specific comments
router.get('/ticket/:ticketId', getCommentsByTicket);
router.get('/ticket/:ticketId/count', getCommentCount);

// Single comment routes
router.route('/:id')
  .put(updateComment)
  .delete(deleteComment);

module.exports = router;
