import express from 'express';
import Enrollment from '../models/Enrollment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Update lesson progress
// @route   POST /api/progress/lesson/:lessonId
// @access  Private
router.post('/lesson/:lessonId', protect, async (req, res) => {
  try {
    const { courseId } = req.body;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check if lesson already completed
    const lessonCompleted = enrollment.progress.completedLessons.find(
      cl => cl.lesson.toString() === req.params.lessonId
    );

    if (!lessonCompleted) {
      enrollment.progress.completedLessons.push({
        lesson: req.params.lessonId
      });
      
      await enrollment.updateProgress();
      
      // Update user learning stats
      await req.user.updateLearningStats(10); // Assume 10 minutes per lesson
    }

    res.json({
      success: true,
      message: 'Progress updated',
      data: enrollment.progress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;