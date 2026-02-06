const mongoose = require('mongoose');
const Ticket = require('./models/Ticket');
const Project = require('./models/Project');
const User = require('./models/User');

async function createSampleData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/bugtracker');
    console.log('Connected to MongoDB...');
    
    // Create sample user if not exists
    let user = await User.findOne({ email: 'admin@example.com' });
    if (!user) {
      user = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Created sample user');
    }
    
    // Create sample project
    let project = await Project.findOne({ name: 'Demo Project' });
    let projectId;
    if (!project) {
      project = await Project.create({
        name: 'Demo Project',
        description: 'Sample project for AI demo',
        owner: user._id,
        status: 'Active',
        priority: 'High'
      });
      projectId = project._id;
      console.log('Created sample project');
    } else {
      projectId = project._id;
    }
    
    // Clear existing tickets
    await Ticket.deleteMany({});
    console.log('Cleared existing tickets');
    
    // Create sample tickets with different dates
    const now = new Date();
    const tickets = [];
    
    for (let i = 0; i < 20; i++) {
      const createdAt = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000)); // One ticket per day for 20 days
      const resolvedAt = i < 15 ? new Date(createdAt.getTime() + (2 * 24 * 60 * 60 * 1000)) : null; // First 15 are resolved
      
      tickets.push({
        title: `Sample Ticket ${i + 1}`,
        description: `This is sample ticket ${i + 1} for AI demonstration`,
        type: i % 4 === 0 ? 'Feature' : i % 3 === 0 ? 'Bug' : 'Improvement',
        status: resolvedAt ? 'Resolved' : 'Open',
        priority: i % 5 === 0 ? 'Critical' : i % 3 === 0 ? 'High' : 'Medium',
        project: projectId,
        assignedTo: user._id,
        reportedBy: user._id,
        createdAt,
        resolvedAt,
        dueDate: new Date(createdAt.getTime() + (7 * 24 * 60 * 60 * 1000))
      });
    }
    
    await Ticket.insertMany(tickets);
    console.log('Sample data created successfully!');
    console.log('Created 20 tickets over 20 days with 15 resolved');
    console.log('');
    console.log('Now you can test the AI Analytics:');
    console.log('1. Go to http://localhost:3000/analytics');
    console.log('2. Click the purple AI bot in bottom-right');
    console.log('3. Ask: "analyze trends"');
    console.log('4. Ask: "predict next week"');
    console.log('5. Ask: "team performance"');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createSampleData();
