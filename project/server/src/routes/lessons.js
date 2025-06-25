import express from 'express';
import { body, validationResult } from 'express-validator';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get lessons for a course
// @route   GET /api/lessons/course/:courseId
// @access  Public
router.get('/course/:courseId', async (req, res) => {
  try {
    const lessons = await Lesson.find({ 
      course: req.params.courseId,
      isPublished: true 
    }).sort({ order: 1 });

    res.json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Private (Enrolled students/Instructor/Admin)
router.get('/:id', protect, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course', 'title instructor');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check access permissions
    const hasAccess = lesson.isPreview || 
                     lesson.course.instructor.toString() === req.user.id ||
                     req.user.role === 'admin' ||
                     req.user.enrolledCourses.includes(lesson.course._id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Please enroll in the course.'
      });
    }

    res.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create lesson
// @route   POST /api/lessons
// @access  Private (Instructor/Admin)
router.post('/', protect, authorize('instructor', 'admin'), [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('course').isMongoId().withMessage('Valid course ID is required'),
  body('section').trim().notEmpty().withMessage('Section is required'),
  body('videoUrl').isURL().withMessage('Valid video URL is required'),
  body('duration').matches(/^\d+:\d{2}$/).withMessage('Duration must be in MM:SS format'),
  body('order').isInt({ min: 1 }).withMessage('Order must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if course exists and user has permission
    const course = await Course.findById(req.body.course);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add lessons to this course'
      });
    }

    const lesson = await Lesson.create(req.body);

    // Add lesson to course
    course.lessons.push(lesson._id);
    await course.calculateTotalDuration();

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: lesson
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private (Course owner/Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    let lesson = await Lesson.findById(req.params.id).populate('course');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check ownership
    if (lesson.course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lesson'
      });
    }

    lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Recalculate course duration if duration changed
    if (req.body.duration) {
      await lesson.course.calculateTotalDuration();
    }

    res.json({
      success: true,
      message: 'Lesson updated successfully',
      data: lesson
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Course owner/Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check ownership
    if (lesson.course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this lesson'
      });
    }

    // Remove lesson from course
    lesson.course.lessons.pull(lesson._id);
    await lesson.course.save();
    await lesson.course.calculateTotalDuration();

    await lesson.deleteOne();

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Reorder lessons
// @route   PUT /api/lessons/course/:courseId/reorder
// @access  Private (Course owner/Admin)
router.put('/course/:courseId/reorder', protect, async (req, res) => {
  try {
    const { lessonOrders } = req.body; // Array of { lessonId, order }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reorder lessons'
      });
    }

    // Update lesson orders
    const updatePromises = lessonOrders.map(({ lessonId, order }) =>
      Lesson.findByIdAndUpdate(lessonId, { order })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Lessons reordered successfully'
    });
  } catch (error) {
    console.error('Reorder lessons error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;