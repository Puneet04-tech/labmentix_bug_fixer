const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a ticket title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  type: {
    type: String,
    enum: ['Bug', 'Feature', 'Improvement', 'Task'],
    default: 'Bug'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'In Review', 'Resolved', 'Closed'],
    default: 'Open'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date
  },
  attachments: [{
    name: {
      type: String,
      required: false
    },
    filename: {
      type: String,
      required: false
    },
    url: {
      type: String,
      required: false
    },
    size: {
      type: Number,
      required: false
    },
    type: {
      type: String,
      required: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolvedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
ticketSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set resolvedAt when status changes to Resolved
  if (this.isModified('status') && this.status === 'Resolved' && !this.resolvedAt) {
    this.resolvedAt = Date.now();
  }
  
  // Clear resolvedAt if status changes from Resolved
  if (this.isModified('status') && this.status !== 'Resolved' && this.resolvedAt) {
    this.resolvedAt = undefined;
  }
  
  next();
});

// Index for faster queries
ticketSchema.index({ project: 1, status: 1 });
ticketSchema.index({ assignedTo: 1, status: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);
