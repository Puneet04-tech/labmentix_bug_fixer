const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
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

// @desc    Get all users (admin only)
// @route   GET /api/users/all
// @access  Private (Admin only)
router.get('/all', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user role (admin only)
// @route   PUT /api/users/:id/role
// @access  Private (Admin only)
router.put('/:id/role', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const { role } = req.body;
    
    // Validate role
    const allowedRoles = ['admin', 'core', 'member'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Find user
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from changing their own role
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    // Update user role
    user.role = role;
    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password');
    
    res.json({
      message: 'User role updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
router.delete('/:id', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user statistics (admin only)
// @route   GET /api/users/stats
// @access  Private (Admin only)
router.get('/stats', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const coreUsers = await User.countDocuments({ role: 'core' });
    const memberUsers = await User.countDocuments({ role: 'member' });
    
    // Get users created in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      totalUsers,
      adminUsers,
      coreUsers,
      memberUsers,
      recentUsers,
      roleDistribution: {
        admin: adminUsers,
        core: coreUsers,
        member: memberUsers
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user by ID (admin only)
// @route   GET /api/users/:id
// @access  Private (Admin only)
router.get('/:id', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;