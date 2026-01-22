const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketsByProject,
  assignTicket
} = require('../controllers/ticketController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Ticket CRUD routes
router.route('/')
  .get(getTickets)
  .post(createTicket);

// Project-specific tickets
router.get('/project/:projectId', getTicketsByProject);

// Single ticket routes
router.route('/:id')
  .get(getTicket)
  .put(updateTicket)
  .delete(deleteTicket);

// Assign ticket
router.put('/:id/assign', assignTicket);

module.exports = router;
