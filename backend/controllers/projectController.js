const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    })
    .populate('owner', 'name email')
    .populate('members.user', 'name email')
    .sort({ createdAt: -1 });

    // Handle backward compatibility for old member structure
    const processedProjects = await Promise.all(projects.map(async project => {
      const processedMembers = project.members.map(member => {
        // If member has user object (new structure), return as is
        if (member.user) {
          return member;
        }
        // If member is old structure (direct reference)
        else if (member._id) {
          // Check if explicitly marked as outsider first
          if (member.isOutsider === true) {
            return {
              email: member.email,
              name: member.name,
              isOutsider: true,
              addedAt: member.addedAt || new Date()
            };
          }
          // Try to find user in database
          return User.findById(member._id).select('name email').then(user => {
            if (user) {
              // Found user - convert to new format
              return {
                user: user,
                isOutsider: false,
                addedAt: member.addedAt || new Date()
              };
            } else {
              // User not found - treat as outsider with provided info
              return {
                email: member.email,
                name: member.name || 'Unknown',
                isOutsider: true,
                addedAt: member.addedAt || new Date()
              };
            }
          });
        }
        // If member is outsider (email only)
        else if (member.email) {
          return {
            email: member.email,
            name: member.name,
            isOutsider: true,
            addedAt: member.addedAt || new Date()
          };
        }
        return null;
      });

      // Wait for all member processing
      const resolvedMembers = await Promise.all(processedMembers);
      project.members = resolvedMembers.filter(Boolean);
      
      return project;
    }));

    res.json(processedProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Handle backward compatibility for old member structure
    const processedMembers = project.members.map(member => {
      // If member has user object (new structure), return as is
      if (member.user) {
        return member;
      }
      // If member is old structure (direct reference)
      else if (member._id) {
        // Check if explicitly marked as outsider first
        if (member.isOutsider === true) {
          return {
            email: member.email,
            name: member.name,
            isOutsider: true,
            addedAt: member.addedAt || new Date()
          };
        }
        // Try to find user in database
        return User.findById(member._id).select('name email').then(user => {
          if (user) {
            // Found user - convert to new format
            return {
              user: user,
              isOutsider: false,
              addedAt: member.addedAt || new Date()
            };
          } else {
            // User not found - treat as outsider with provided info
            return {
              email: member.email,
              name: member.name || 'Unknown',
              isOutsider: true,
              addedAt: member.addedAt || new Date()
            };
          }
        });
      }
      // If member is outsider (email only)
      else if (member.email) {
        return {
          email: member.email,
          name: member.name,
          isOutsider: true,
          addedAt: member.addedAt || new Date()
        };
      }
      return null;
    });

    // Wait for all member processing
    const resolvedMembers = await Promise.all(processedMembers);
    project.members = resolvedMembers.filter(Boolean);

    // Check if user is owner or member
    const isOwner = project.owner._id.toString() === req.user.id;
    const isMember = project.members.some(member => 
      member.user && member.user._id.toString() === req.user.id
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    const { name, description, status, priority, startDate, endDate, members } = req.body;

    // Validation
    if (!name || !description) {
      return res.status(400).json({ message: 'Please provide name and description' });
    }

    // Create project
    const project = await Project.create({
      name,
      description,
      owner: req.user.id,
      status: status || 'Planning',
      priority: priority || 'Medium',
      startDate: startDate || Date.now(),
      endDate,
      members: members || []
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    // Update project
    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('owner', 'name email')
    .populate('members.user', 'name email');

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
exports.addMember = async (req, res) => {
  try {
    const { email, name } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add members' });
    }

    // Validate email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if member already exists (by user or email)
    const existingMember = project.members.find(member => 
      (member.user && member.user.email === email) || 
      (member.email === email)
    );

    if (existingMember) {
      return res.status(400).json({ message: 'Member already exists in this project' });
    }

    // Check if user is registered
    const registeredUser = await User.findOne({ email });

    let newMember;
    if (registeredUser) {
      // Add registered user
      newMember = {
        user: registeredUser._id,
        isOutsider: false,
        addedAt: new Date()
      };
    } else {
      // Add outsider
      newMember = {
        email: email,
        name: name || email.split('@')[0], // Use name provided or extract from email
        isOutsider: true,
        addedAt: new Date()
      };
    }

    project.members.push(newMember);
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    res.json({
      message: registeredUser ? 'Registered user added to project' : 'Outsider added to project',
      project: updatedProject,
      addedMember: newMember
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:memberId
// @access  Private
exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to remove members' });
    }

    const memberId = req.params.memberId;
    
    // Remove member by user ID or email
    project.members = project.members.filter(member => {
      if (member.user) {
        // New structure: member.user._id
        return member.user._id.toString() !== memberId;
      } else if (member._id) {
        // Old structure: direct _id
        return member._id.toString() !== memberId;
      } else {
        // Outsider: email
        return member.email !== memberId;
      }
    });

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    res.json({
      message: 'Member removed successfully',
      project: updatedProject
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
