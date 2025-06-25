import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllSessions,
  getStudentSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  joinSession,
  leaveSession,
  startSession,
  endSession,
  addMaterial,
  getSessionAnalytics
} from '../controllers/videoSessionController.js';

const router = express.Router();

// Validation middleware
const validateSession = [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('course').isMongoId().withMessage('Valid course ID is required'),
  body('scheduledDate').isISO8601().withMessage('Valid scheduled date is required'),
  body('scheduledTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Time must be in HH:MM format'),
  body('duration').isInt({ min: 15, max: 180 }).withMessage('Duration must be between 15 and 180 minutes'),
  body('maxParticipants').isInt({ min: 1, max: 100 }).withMessage('Max participants must be between 1 and 100'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

const validateMaterial = [
  body('name').trim().notEmpty().withMessage('Material name is required'),
  body('type').isIn(['pdf', 'doc', 'video', 'audio', 'link', 'other']).withMessage('Invalid material type'),
  body('url').isURL().withMessage('Valid URL is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Routes for instructors
router.get('/', protect, authorize('instructor', 'admin'), getAllSessions);
router.post('/', protect, authorize('instructor', 'admin'), validateSession, createSession);
router.put('/:id', protect, validateSession, updateSession);
router.delete('/:id', protect, deleteSession);
router.post('/:id/start', protect, startSession);
router.post('/:id/end', protect, endSession);
router.post('/:id/materials', protect, validateMaterial, addMaterial);
router.get('/:id/analytics', protect, authorize('instructor', 'admin'), getSessionAnalytics);

// Routes for all users
router.get('/student', protect, getStudentSessions);
router.get('/:id', protect, getSessionById);
router.post('/:id/join', protect, joinSession);
router.post('/:id/leave', protect, leaveSession);

export default router;