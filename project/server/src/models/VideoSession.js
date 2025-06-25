import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  joinedAt: {
    type: Date
  },
  leftAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['registered', 'joined', 'left'],
    default: 'registered'
  },
  attendanceDuration: {
    type: Number, // in minutes
    default: 0
  }
});

const sessionMaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['pdf', 'doc', 'video', 'audio', 'link', 'other'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  size: {
    type: String
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const videoSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Session title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Duration is required'],
    min: [15, 'Duration must be at least 15 minutes'],
    max: [180, 'Duration cannot exceed 180 minutes']
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Max participants is required'],
    min: [1, 'Must allow at least 1 participant'],
    max: [100, 'Cannot exceed 100 participants']
  },
  sessionType: {
    type: String,
    enum: ['live', 'recorded', 'hybrid'],
    default: 'live'
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  meetingLink: {
    type: String,
    required: true
  },
  meetingId: {
    type: String,
    unique: true
  },
  recordingUrl: {
    type: String
  },
  participants: [participantSchema],
  materials: [sessionMaterialSchema],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly'],
    required: function() {
      return this.isRecurring;
    }
  },
  recurringEndDate: {
    type: Date
  },
  parentSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VideoSession'
  },
  sessionNotes: {
    type: String
  },
  actualStartTime: {
    type: Date
  },
  actualEndTime: {
    type: Date
  },
  actualDuration: {
    type: Number // in minutes
  },
  attendanceCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 500
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  settings: {
    allowRecording: {
      type: Boolean,
      default: true
    },
    allowChat: {
      type: Boolean,
      default: true
    },
    allowScreenShare: {
      type: Boolean,
      default: true
    },
    requireRegistration: {
      type: Boolean,
      default: true
    },
    sendReminders: {
      type: Boolean,
      default: true
    },
    autoRecord: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
videoSessionSchema.index({ instructor: 1 });
videoSessionSchema.index({ course: 1 });
videoSessionSchema.index({ scheduledDate: 1 });
videoSessionSchema.index({ status: 1 });
videoSessionSchema.index({ meetingId: 1 });

// Generate unique meeting ID before saving
videoSessionSchema.pre('save', function(next) {
  if (!this.meetingId) {
    this.meetingId = `session-${this._id}-${Date.now()}`;
  }
  
  if (!this.meetingLink) {
    this.meetingLink = `https://meet.learnhub.com/${this.meetingId}`;
  }
  
  next();
});

// Calculate actual duration when session ends
videoSessionSchema.methods.endSession = function() {
  this.actualEndTime = new Date();
  this.status = 'completed';
  
  if (this.actualStartTime) {
    this.actualDuration = Math.round(
      (this.actualEndTime - this.actualStartTime) / (1000 * 60)
    );
  }
  
  // Update attendance count
  this.attendanceCount = this.participants.filter(p => p.status === 'joined').length;
  
  return this.save();
};

// Add participant to session
videoSessionSchema.methods.addParticipant = function(userId) {
  const existingParticipant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (!existingParticipant) {
    this.participants.push({ user: userId });
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Mark participant as joined
videoSessionSchema.methods.markParticipantJoined = function(userId) {
  const participant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (participant) {
    participant.status = 'joined';
    participant.joinedAt = new Date();
    
    // Start session if this is the first participant and instructor
    if (this.status === 'scheduled' && userId.toString() === this.instructor.toString()) {
      this.status = 'live';
      this.actualStartTime = new Date();
    }
  }
  
  return this.save();
};

// Mark participant as left
videoSessionSchema.methods.markParticipantLeft = function(userId) {
  const participant = this.participants.find(
    p => p.user.toString() === userId.toString()
  );
  
  if (participant && participant.status === 'joined') {
    participant.status = 'left';
    participant.leftAt = new Date();
    
    // Calculate attendance duration
    if (participant.joinedAt) {
      participant.attendanceDuration = Math.round(
        (participant.leftAt - participant.joinedAt) / (1000 * 60)
      );
    }
  }
  
  return this.save();
};

// Create recurring sessions
videoSessionSchema.methods.createRecurringSessions = function() {
  if (!this.isRecurring || !this.recurringPattern) {
    return Promise.resolve([]);
  }
  
  const sessions = [];
  const startDate = new Date(this.scheduledDate);
  const endDate = this.recurringEndDate || new Date(startDate.getTime() + (90 * 24 * 60 * 60 * 1000)); // 3 months default
  
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Calculate next occurrence
    switch (this.recurringPattern) {
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'biweekly':
        currentDate.setDate(currentDate.getDate() + 14);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
    
    if (currentDate <= endDate) {
      const sessionData = this.toObject();
      delete sessionData._id;
      delete sessionData.createdAt;
      delete sessionData.updatedAt;
      delete sessionData.participants;
      delete sessionData.actualStartTime;
      delete sessionData.actualEndTime;
      delete sessionData.actualDuration;
      delete sessionData.attendanceCount;
      delete sessionData.recordingUrl;
      
      sessionData.scheduledDate = new Date(currentDate);
      sessionData.parentSessionId = this._id;
      sessionData.status = 'scheduled';
      
      sessions.push(sessionData);
    }
  }
  
  return mongoose.model('VideoSession').insertMany(sessions);
};

export default mongoose.model('VideoSession', videoSessionSchema);