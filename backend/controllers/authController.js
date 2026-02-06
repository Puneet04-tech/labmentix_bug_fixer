const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, adminKey } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Handle role assignment
    let userRole = 'member';
    
    if (role === 'admin') {
      // Check for admin setup key or registration key
      const key = adminKey || req.headers['x-admin-key'];

      // Allow a developer fallback when NODE_ENV !== 'production'
      const serverKey = process.env.ADMIN_REGISTRATION_KEY || (process.env.NODE_ENV !== 'production' ? 'admin-secret-key-123' : null);

      if (!serverKey) {
        return res.status(500).json({ message: 'Server misconfiguration: ADMIN_REGISTRATION_KEY is not set. Contact the administrator or set this environment variable.' });
      }
      if (key !== serverKey) {
        return res.status(403).json({ message: 'Invalid admin setup key' });
      }
      userRole = 'admin';
    } else if (role === 'core') {
      // Core role also requires admin key
      const key = adminKey || req.headers['x-admin-key'];

      const serverKey = process.env.ADMIN_REGISTRATION_KEY || (process.env.NODE_ENV !== 'production' ? 'admin-secret-key-123' : null);

      if (!serverKey) {
        return res.status(500).json({ message: 'Server misconfiguration: ADMIN_REGISTRATION_KEY is not set. Contact the administrator or set this environment variable.' });
      }
      if (key !== serverKey) {
        return res.status(403).json({ message: 'Invalid admin setup key for core role' });
      }
      userRole = 'core';
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: userRole
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
