const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/screenshots');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'screenshot-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// @desc    Upload screenshot for ticket
// @route   POST /api/screenshots/upload
// @access  Private (all authenticated users)
router.post('/upload', auth, upload.single('screenshot'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No screenshot file provided' });
    }

    const screenshotUrl = `/uploads/screenshots/${req.file.filename}`;
    
    res.status(201).json({
      message: 'Screenshot uploaded successfully',
      screenshotUrl: screenshotUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete screenshot
// @route   DELETE /api/screenshots/:filename
// @access  Private (admin and core roles only)
router.delete('/:filename', auth, roleAuth(['admin', 'core']), (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads/screenshots', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Screenshot deleted successfully' });
    } else {
      res.status(404).json({ message: 'Screenshot not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all screenshots (admin only)
// @route   GET /api/screenshots
// @access  Private (admin only)
router.get('/', auth, roleAuth(['admin']), (req, res) => {
  try {
    const screenshotsDir = path.join(__dirname, '../uploads/screenshots');
    
    if (!fs.existsSync(screenshotsDir)) {
      return res.json({ screenshots: [] });
    }

    const files = fs.readdirSync(screenshotsDir);
    const screenshots = files.map(file => {
      const filePath = path.join(screenshotsDir, file);
      const stats = fs.statSync(filePath);
      
      return {
        filename: file,
        url: `/uploads/screenshots/${file}`,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      };
    });

    res.json({ screenshots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
