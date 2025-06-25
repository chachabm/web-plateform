import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalLessons,
      totalEnrollments,
      totalRevenue,
      recentUsers,
      recentCourses,
      topCourses
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Lesson.countDocuments(),
      Enrollment.countDocuments(),
      Course.aggregate([
        { $group: { _id: null, total: { $sum: '$revenue' } } }
      ]),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
      Course.find().sort({ createdAt: -1 }).limit(5).populate('instructor', 'name'),
      Course.find().sort({ enrollmentCount: -1 }).limit(5).populate('instructor', 'name')
    ]);

    const stats = {
      overview: {
        totalUsers,
        totalCourses,
        totalLessons,
        totalEnrollments,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      recent: {
        users: recentUsers,
        courses: recentCourses
      },
      topCourses
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Private (Admin)
router.get('/users', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      search,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting other admins
    if (user.role === 'admin' && user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete other admin users'
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all courses for admin
// @route   GET /api/admin/courses
// @access  Private (Admin)
router.get('/courses', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = {};
    if (status === 'published') query.isPublished = true;
    if (status === 'draft') query.isPublished = false;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      count: courses.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: courses
    });
  } catch (error) {
    console.error('Get admin courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get course analytics
// @route   GET /api/admin/courses/:id/analytics
// @access  Private (Admin)
router.get('/courses/:id/analytics', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const [
      enrollments,
      completions,
      revenue,
      ratings
    ] = await Promise.all([
      Enrollment.countDocuments({ course: course._id }),
      Enrollment.countDocuments({ course: course._id, isCompleted: true }),
      Enrollment.aggregate([
        { $match: { course: course._id } },
        { $group: { _id: null, total: { $sum: '$course.price' } } }
      ]),
      Enrollment.find({ course: course._id, rating: { $exists: true } }).select('rating')
    ]);

    const analytics = {
      enrollments,
      completions,
      completionRate: enrollments > 0 ? (completions / enrollments * 100).toFixed(2) : 0,
      revenue: revenue[0]?.total || 0,
      averageRating: ratings.length > 0 
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0,
      totalRatings: ratings.length
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get course analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;