import VideoSession from '../models/VideoSession.js';
import User from '../models/User.js';
import Course from '../models/Course.js';

// @desc    Get all video sessions
// @route   GET /api/video-sessions
// @access  Private
export const getAllSessions = async (req, res) => {
  try {
    const { 
      status, 
      courseId, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 10 
    } = req.query;

    // Build query
    const query = {};
    
    // Filter by instructor if not admin
    if (req.user.role !== 'admin') {
      query.instructor = req.user._id;
    }
    
    if (status) query.status = status;
    if (courseId) query.course = courseId;
    
    if (startDate || endDate) {
      query.scheduledDate = {};
      if (startDate) query.scheduledDate.$gte = new Date(startDate);
      if (endDate) query.scheduledDate.$lte = new Date(endDate);
    }

    const sessions = await VideoSession.find(query)
      .populate('course', 'title thumbnail')
      .populate('instructor', 'name email avatar')
      .populate('participants.user', 'name email avatar')
      .sort({ scheduledDate: 1, scheduledTime: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await VideoSession.countDocuments(query);

    res.json({
      success: true,
      count: sessions.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: sessions
    });
  } catch (error) {
    console.error('Error getting video sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get sessions for student
// @route   GET /api/video-sessions/student
// @access  Private
export const getStudentSessions = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Find sessions where the student is a participant
    const query = {
      'participants.user': req.user._id
    };
    
    if (status) query.status = status;

    const sessions = await VideoSession.find(query)
      .populate('course', 'title thumbnail')
      .populate('instructor', 'name email avatar')
      .sort({ scheduledDate: 1, scheduledTime: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await VideoSession.countDocuments(query);

    res.json({
      success: true,
      count: sessions.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: sessions
    });
  } catch (error) {
    console.error('Error getting student sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single video session
// @route   GET /api/video-sessions/:id
// @access  Private
export const getSessionById = async (req, res) => {
  try {
    const session = await VideoSession.findById(req.params.id)
      .populate('instructor', 'name email avatar')
      .populate('course', 'title description thumbnail')
      .populate('participants.user', 'name email avatar');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Video session not found'
      });
    }

    // Check access permissions
    const isInstructor = session.instructor._id.toString() === req.user.id;
    const isParticipant = session.participants.some(p => p.user._id.toString() === req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isInstructor && !isParticipant && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error getting video session:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create video session
// @route   POST /api/video-sessions
// @access  Private (Instructor/Admin)
export const createSession = async (req, res) => {
  try {
    // Check if course exists
    const course = await Course.findById(req.body.course);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user has permission to create sessions for this course
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create sessions for this course'
      });
    }

    // Create session
    const sessionData = {
      ...req.body,
      instructor: req.user.id
    };

    const session = await VideoSession.create(sessionData);

    // Create recurring sessions if specified
    if (session.isRecurring) {
      await session.createRecurringSessions();
    }

    await session.populate('course', 'title thumbnail');
    await session.populate('instructor', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Video session created successfully',
      data: session
    });
  } catch (error) {
    console.error('Error creating video session:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update video session
// @route   PUT /api/video-sessions/:id
// @access  Private (Session owner/Admin)
export const updateSession = async (req, res) => {
  try {
    let session = await VideoSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Video session not found'
      });
    }

    // Check ownership
    if (session.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this session'
      });
    }

    // Don't allow updating live or completed sessions
    if (session.status === 'live' || session.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update live or completed sessions'
      });
    }

    session = await VideoSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('course', 'title thumbnail');

    res.json({
      success: true,
      message: 'Video session updated successfully',
      data: session
    });
  } catch (error) {
    console.error('Error updating video session:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete video session
// @route   DELETE /api/video-sessions/:id
// @access  Private (Session owner/Admin)
export const deleteSession = async (req, res) => {
  try {
    const session = await VideoSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Video session not found'
      });
    }

    // Check ownership
    if (session.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this session'
      });
    }

    // Don't allow deleting live sessions
    if (session.status === 'live') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete live sessions'
      });
    }

    await session.deleteOne();

    res.json({
      success: true,
      message: 'Video session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting video session:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Join video session
// @route   POST /api/video-sessions/:id/join
// @access  Private
export const joinSession = async (req, res) => {
  try {
    const session = await VideoSession.findById(req.params.id)
      .populate('course', 'title enrolledStudents');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Video session not found'
      });
    }

    // Check if user is enrolled in the course or is the instructor
    const isInstructor = session.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    // For learners, check if they're enrolled in the course
    if (req.user.role === 'learner' && !isInstructor && !isAdmin) {
      const isEnrolled = await Course.exists({
        _id: session.course._id,
        'enrolledStudents.student': req.user._id
      });

      if (!isEnrolled) {
        return res.status(403).json({
          success: false,
          message: 'You must be enrolled in the course to join this session'
        });
      }
    }

    // Check if session is at capacity
    const currentParticipants = session.participants.filter(p => p.status === 'joined').length;
    if (currentParticipants >= session.maxParticipants && !isInstructor && !isAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Session is at maximum capacity'
      });
    }

    // Add participant if not already added
    await session.addParticipant(req.user.id);
    await session.markParticipantJoined(req.user.id);

    res.json({
      success: true,
      message: 'Successfully joined the session',
      data: {
        meetingLink: session.meetingLink,
        meetingId: session.meetingId
      }
    });
  } catch (error) {
    console.error('Error joining video session:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Leave video session
// @route   POST /api/video-sessions/:id/leave
// @access  Private
export const leaveSession = async (req, res) => {
  try {
    const session = await VideoSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Video session not found'
      });
    }

    await session.markParticipantLeft(req.user.id);

    // End session if instructor leaves
    if (session.instructor.toString() === req.user.id && session.status === 'live') {
      await session.endSession();
    }

    res.json({
      success: true,
      message: 'Successfully left the session'
    });
  } catch (error) {
    console.error('Error leaving video session:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Start video session
// @route   POST /api/video-sessions/:id/start
// @access  Private (Instructor/Admin)
export const startSession = async (req, res) => {
  try {
    const session = await VideoSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Video session not found'
      });
    }

    // Check if user is the instructor
    if (session.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the instructor can start the session'
      });
    }

    if (session.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: 'Session cannot be started'
      });
    }

    session.status = 'live';
    session.actualStartTime = new Date();
    await session.save();

    res.json({
      success: true,
      message: 'Session started successfully',
      data: {
        meetingLink: session.meetingLink,
        meetingId: session.meetingId
      }
    });
  } catch (error) {
    console.error('Error starting video session:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    End video session
// @route   POST /api/video-sessions/:id/end
// @access  Private (Instructor/Admin)
export const endSession = async (req, res) => {
  try {
    const session = await VideoSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Video session not found'
      });
    }

    // Check if user is the instructor
    if (session.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the instructor can end the session'
      });
    }

    if (session.status !== 'live') {
      return res.status(400).json({
        success: false,
        message: 'Session is not currently live'
      });
    }

    await session.endSession();

    res.json({
      success: true,
      message: 'Session ended successfully',
      data: session
    });
  } catch (error) {
    console.error('Error ending video session:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add session material
// @route   POST /api/video-sessions/:id/materials
// @access  Private (Instructor/Admin)
export const addMaterial = async (req, res) => {
  try {
    const session = await VideoSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Video session not found'
      });
    }

    // Check if user is the instructor
    if (session.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the instructor can add materials'
      });
    }

    session.materials.push(req.body);
    await session.save();

    res.json({
      success: true,
      message: 'Material added successfully',
      data: session.materials[session.materials.length - 1]
    });
  } catch (error) {
    console.error('Error adding session material:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get session analytics
// @route   GET /api/video-sessions/:id/analytics
// @access  Private (Instructor/Admin)
export const getSessionAnalytics = async (req, res) => {
  try {
    const session = await VideoSession.findById(req.params.id)
      .populate('participants.user', 'name email');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Video session not found'
      });
    }

    // Check ownership
    if (session.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view analytics'
      });
    }

    const analytics = {
      totalRegistered: session.participants.length,
      totalAttended: session.participants.filter(p => p.status === 'joined').length,
      attendanceRate: session.participants.length > 0 
        ? ((session.participants.filter(p => p.status === 'joined').length / session.participants.length) * 100).toFixed(2)
        : 0,
      averageAttendanceDuration: session.participants
        .filter(p => p.attendanceDuration > 0)
        .reduce((sum, p) => sum + p.attendanceDuration, 0) / 
        Math.max(session.participants.filter(p => p.attendanceDuration > 0).length, 1),
      sessionDuration: session.actualDuration || 0,
      participantDetails: session.participants.map(p => ({
        user: p.user,
        status: p.status,
        joinedAt: p.joinedAt,
        leftAt: p.leftAt,
        attendanceDuration: p.attendanceDuration
      }))
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error getting session analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};