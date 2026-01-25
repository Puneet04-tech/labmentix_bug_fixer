const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET /api/users?q=<query>
// Returns list of users matching name or email (protected)
router.get('/', auth, async (req, res) => {
  try {
    const q = req.query.q || '';
    const regex = new RegExp(q, 'i');

    const users = await User.find({
      $or: [
        { name: regex },
        { email: regex }
      ]
    })
    .limit(20)
    .select('_id name email role');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;